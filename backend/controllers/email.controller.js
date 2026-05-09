import { Email } from "../models/email.model.js";
import { User } from "../models/user.model.js";

export const createEmail = async (req, res) => {
    try {
        const userId = req.id;
        const {to, subject, message} = req.body;
        if(!to || !subject || !message) return res.status(400).json({message:"All fields are required", success:false});

        // Get the sender's info
        const sender = await User.findById(userId);
        if(!sender) return res.status(404).json({message:"Sender not found", success:false});

        const email = await Email.create({
            to,
            subject,
            message,
            from: sender.email,
            senderId: userId,
            userId,
            isDraft: false
        });
        return res.status(201).json({
            email,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

export const deleteEmail = async (req,res) => {
    try {
        const emailId = req.params.id;
        
        if(!emailId) return res.status(400).json({message:"Email id is required"});

        const email = await Email.findByIdAndDelete(emailId);

        if(!email) return res.status(404).json({message:"Email is not found"});

        return res.status(200).json({
            message:"Email Deleted successfully",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// INBOX: emails received by the current user (non-draft)
export const getAllEmailById = async (req, res) => {
    try {
        const userId = req.id;

        const user = await User.findById(userId);
        if(!user) return res.status(404).json({message:"User not found", success:false});

        const emails = await Email.find({ to: user.email, isDraft: false }).sort({ createdAt: -1 });

        return res.status(200).json({ emails, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// SENT: emails sent by the current user (non-draft)
export const getSentEmails = async (req, res) => {
    try {
        const userId = req.id;
        const emails = await Email.find({ senderId: userId, isDraft: false }).sort({ createdAt: -1 });
        return res.status(200).json({ emails, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// STARRED: toggle star for the current user
export const toggleStarEmail = async (req, res) => {
    try {
        const userId = req.id;
        const emailId = req.params.id;

        const email = await Email.findById(emailId);
        if (!email) return res.status(404).json({ message: "Email not found", success: false });

        const isStarred = email.starredBy.some(id => id.toString() === userId.toString());

        if (isStarred) {
            email.starredBy = email.starredBy.filter(id => id.toString() !== userId.toString());
        } else {
            email.starredBy.push(userId);
        }

        await email.save();

        return res.status(200).json({
            email,
            starred: !isStarred,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// STARRED: get all starred emails for current user
export const getStarredEmails = async (req, res) => {
    try {
        const userId = req.id;
        const emails = await Email.find({
            starredBy: userId,
            isDraft: false
        }).sort({ createdAt: -1 });
        return res.status(200).json({ emails, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// SNOOZED: toggle snooze for the current user
export const toggleSnoozeEmail = async (req, res) => {
    try {
        const userId = req.id;
        const emailId = req.params.id;
        const { until } = req.body; // ISO date string or null to un-snooze

        const email = await Email.findById(emailId);
        if (!email) return res.status(404).json({ message: "Email not found", success: false });

        const existingIdx = email.snoozedBy.findIndex(s => s.userId.toString() === userId.toString());

        if (existingIdx !== -1) {
            // Remove snooze (toggle off)
            email.snoozedBy.splice(existingIdx, 1);
        } else {
            // Add snooze with until date
            email.snoozedBy.push({
                userId,
                until: until ? new Date(until) : new Date(Date.now() + 24 * 60 * 60 * 1000) // default 24h
            });
        }

        await email.save();
        return res.status(200).json({ email, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// SNOOZED: get all snoozed emails for current user
export const getSnoozedEmails = async (req, res) => {
    try {
        const userId = req.id;
        const now = new Date();
        const emails = await Email.find({
            'snoozedBy.userId': userId,
            isDraft: false
        }).sort({ createdAt: -1 });

        // Filter to only those where snooze hasn't expired
        const snoozedEmails = emails.filter(e => {
            const entry = e.snoozedBy.find(s => s.userId.toString() === userId.toString());
            return entry && entry.until > now;
        });

        return res.status(200).json({ emails: snoozedEmails, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// DRAFTS: save a draft
export const saveDraft = async (req, res) => {
    try {
        const userId = req.id;
        const { to, subject, message, draftId } = req.body;

        const sender = await User.findById(userId);
        if (!sender) return res.status(404).json({ message: "User not found", success: false });

        let draft;
        if (draftId) {
            // Update existing draft
            draft = await Email.findOneAndUpdate(
                { _id: draftId, senderId: userId, isDraft: true },
                { to: to || '', subject: subject || '', message: message || '' },
                { new: true }
            );
            if (!draft) return res.status(404).json({ message: "Draft not found", success: false });
        } else {
            // Create new draft
            draft = await Email.create({
                to: to || '',
                subject: subject || '',
                message: message || '',
                from: sender.email,
                senderId: userId,
                userId,
                isDraft: true
            });
        }

        return res.status(201).json({ draft, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// DRAFTS: get all drafts for current user
export const getDrafts = async (req, res) => {
    try {
        const userId = req.id;
        const drafts = await Email.find({ senderId: userId, isDraft: true }).sort({ updatedAt: -1 });
        return res.status(200).json({ drafts, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// DRAFTS: send a draft (convert to real email)
export const sendDraft = async (req, res) => {
    try {
        const userId = req.id;
        const { draftId } = req.params;

        const draft = await Email.findOne({ _id: draftId, senderId: userId, isDraft: true });
        if (!draft) return res.status(404).json({ message: "Draft not found", success: false });

        if (!draft.to || !draft.subject || !draft.message) {
            return res.status(400).json({ message: "Draft is incomplete, fill in all fields before sending", success: false });
        }

        draft.isDraft = false;
        await draft.save();

        return res.status(200).json({ email: draft, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}