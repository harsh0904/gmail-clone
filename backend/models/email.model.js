import mongoose from "mongoose";

const emailSchema = new mongoose.Schema({
    to:{
        type:String,
        required:false  // not required for drafts
    },
    subject:{
        type:String,
        required:false
    },
    message:{
        type:String,
        required:false
    },
    from:{
        type:String,
        required:true
    },
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    // Starred: per-user starred list
    starredBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    // Snoozed: per-user snooze time
    snoozedBy: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        until: { type: Date }
    }],
    // Drafts
    isDraft: {
        type: Boolean,
        default: false
    }
},{timestamps:true});

export const Email = mongoose.model("Email", emailSchema);