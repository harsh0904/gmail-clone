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
            userId  // keep for backward compat
        });
        return res.status(201).json({
            email,
            success: true
        })
    } catch (error) {
        console.log(error);
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
    }
}

// INBOX: emails received by the current user
export const getAllEmailById = async (req, res) => {
    try {
        const userId = req.id;

        // Get current user's email to find emails sent TO them
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({message:"User not found", success:false});

        const emails = await Email.find({ to: user.email }).sort({ createdAt: -1 });

        return res.status(200).json({ emails, success: true });
    } catch (error) {
        console.log(error);
    }
}

// SENT: emails sent by the current user
export const getSentEmails = async (req, res) => {
    try {
        const userId = req.id;
        const emails = await Email.find({ senderId: userId }).sort({ createdAt: -1 });
        return res.status(200).json({ emails, success: true });
    } catch (error) {
        console.log(error);
    }
}