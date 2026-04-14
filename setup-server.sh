#!/bin/bash
# Gmail Clone — VPS Setup Script
# Run as root on Ubuntu server

set -e  # Exit on any error

echo "=============================="
echo " Gmail Clone VPS Setup Script"
echo " Server: 173.249.11.198"
echo " Domain: snenmh.xyz"
echo "=============================="

# ── 1. System Update ──────────────────────────────────────────────────────────
echo "[1/10] Updating system packages..."
apt-get update -y && apt-get upgrade -y

# ── 2. Install Node.js 20 ─────────────────────────────────────────────────────
echo "[2/10] Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# ── 3. Install MongoDB ────────────────────────────────────────────────────────
echo "[3/10] Installing MongoDB..."
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
apt-get update -y
apt-get install -y mongodb-org
systemctl enable mongod
systemctl start mongod
echo "MongoDB started."

# ── 4. Install Nginx ──────────────────────────────────────────────────────────
echo "[4/10] Installing Nginx..."
apt-get install -y nginx
systemctl enable nginx

# ── 5. Install PM2 globally ───────────────────────────────────────────────────
echo "[5/10] Installing PM2..."
npm install -g pm2

# ── 6. Install Certbot ────────────────────────────────────────────────────────
echo "[6/10] Installing Certbot..."
apt-get install -y certbot python3-certbot-nginx

# ── 7. Set up app directory ───────────────────────────────────────────────────
echo "[7/10] Setting up app directory..."
mkdir -p /var/www/gmailclone

# ── 8. Configure Nginx ────────────────────────────────────────────────────────
echo "[8/10] Configuring Nginx..."

cat > /etc/nginx/sites-available/snenmh.xyz << 'NGINX_CONF'
# Frontend — snenmh.xyz
server {
    listen 80;
    server_name snenmh.xyz www.snenmh.xyz;

    root /var/www/gmailclone/frontend/dist;
    index index.html;

    # Handle React Router (SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}

# Backend API — api.snenmh.xyz
server {
    listen 80;
    server_name api.snenmh.xyz;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX_CONF

ln -sf /etc/nginx/sites-available/snenmh.xyz /etc/nginx/sites-enabled/snenmh.xyz
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

echo "==========================="
echo "  Base setup complete!  "
echo "==========================="
echo ""
echo "Next steps (run separately after DNS is pointed):"
echo "  certbot --nginx -d snenmh.xyz -d www.snenmh.xyz -d api.snenmh.xyz"
echo ""
echo "Then upload app files and run deploy.sh"
