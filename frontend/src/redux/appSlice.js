import { createSlice } from "@reduxjs/toolkit"

const appSlice = createSlice({
    name: "app",
    initialState: {
        open: false,
        user: null,
        emails: [],
        sentEmails: [],
        starredEmails: [],
        snoozedEmails: [],
        drafts: [],
        selectedEmail: null,
        searchText: "",
        activeTab: "inbox", // "inbox" | "sent" | "starred" | "snoozed" | "drafts"
    },
    reducers: {
        setOpen: (state, action) => {
            state.open = action.payload;
        },
        setAuthUser: (state, action) => {
            state.user = action.payload;
        },
        setEmails: (state, action) => {
            state.emails = action.payload;
        },
        setSentEmails: (state, action) => {
            state.sentEmails = action.payload;
        },
        setStarredEmails: (state, action) => {
            state.starredEmails = action.payload;
        },
        setSnoozedEmails: (state, action) => {
            state.snoozedEmails = action.payload;
        },
        setDrafts: (state, action) => {
            state.drafts = action.payload;
        },
        addDraft: (state, action) => {
            const exists = state.drafts.findIndex(d => d._id === action.payload._id);
            if (exists !== -1) {
                state.drafts[exists] = action.payload;
            } else {
                state.drafts.unshift(action.payload);
            }
        },
        removeDraft: (state, action) => {
            state.drafts = state.drafts.filter(d => d._id !== action.payload);
        },
        setSelectedEmail: (state, action) => {
            state.selectedEmail = action.payload;
        },
        setSearchText: (state, action) => {
            state.searchText = action.payload;
        },
        setActiveTab: (state, action) => {
            state.activeTab = action.payload;
        },
        // Toggle star on a specific email in any list
        updateEmailStarInLists: (state, action) => {
            const { emailId, userId, starred } = action.payload;
            const updateEmail = (email) => {
                if (email._id === emailId) {
                    if (starred) {
                        if (!email.starredBy) email.starredBy = [];
                        if (!email.starredBy.includes(userId)) email.starredBy.push(userId);
                    } else {
                        email.starredBy = (email.starredBy || []).filter(id => id !== userId);
                    }
                }
                return email;
            };
            state.emails = state.emails.map(updateEmail);
            state.sentEmails = state.sentEmails.map(updateEmail);
            state.starredEmails = state.starredEmails.map(updateEmail);
        },
    }
});

export const {
    setOpen, setAuthUser, setEmails, setSentEmails,
    setStarredEmails, setSnoozedEmails, setDrafts, addDraft, removeDraft,
    setSelectedEmail, setSearchText, setActiveTab, updateEmailStarInLists
} = appSlice.actions;

export default appSlice.reducer;