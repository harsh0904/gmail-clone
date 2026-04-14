#!/bin/bash
# Gmail Clone — Deploy Script (run on server after setup-server.sh)
# Usage: bash deploy.sh

set -e

APP_DIR=/var/www/gmailclone

echo "=============================="
echo "  Deploying Backend..."
echo "=============================="

cd $APP_DIR/backend

# Create production .env
cat > .env << 'EOF'
MONGO_URI=mongodb://localhost:27017/gmailclone
SECRET_KEY=gmailclone_prod_secret_k3y_xZ9!qP2@mN4&vL7
PORT=8080
NODE_ENV=production
EOF

npm install --omit=dev

# Start/restart backend with PM2
pm2 stop gmailclone-backend 2>/dev/null || true
pm2 delete gmailclone-backend 2>/dev/null || true
pm2 start index.js --name gmailclone-backend --env production
pm2 save
pm2 startup

echo "=============================="
echo "  Backend is live on :8080"
echo "=============================="

echo "=============================="
echo "  Building Frontend..."
echo "=============================="

cd $APP_DIR/frontend
npm install

# Production env already set to api.snenmh.xyz in .env.production
npm run build

echo "=============================="
echo "  Frontend built!"
echo "=============================="

# Reload nginx
nginx -t && systemctl reload nginx

echo ""
echo "=========================================="
echo "  Deployment complete!"
echo "  Frontend: http://snenmh.xyz"
echo "  Backend:  http://api.snenmh.xyz"
echo "=========================================="
