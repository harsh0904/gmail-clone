import express from "express"; 
import { 
    createEmail, 
    deleteEmail, 
    getAllEmailById, 
    getSentEmails,
    toggleStarEmail,
    getStarredEmails,
    toggleSnoozeEmail,
    getSnoozedEmails,
    saveDraft,
    getDrafts,
    sendDraft
} from "../controllers/email.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

// Static routes MUST come before /:id parameterized routes
router.route("/create").post(isAuthenticated, createEmail);
router.route("/getallemails").get(isAuthenticated, getAllEmailById);
router.route("/sentemails").get(isAuthenticated, getSentEmails);

// Starred
router.route("/starred").get(isAuthenticated, getStarredEmails);

// Snoozed
router.route("/snoozed").get(isAuthenticated, getSnoozedEmails);

// Drafts
router.route("/drafts").get(isAuthenticated, getDrafts);
router.route("/drafts/save").post(isAuthenticated, saveDraft);
router.route("/drafts/:draftId/send").post(isAuthenticated, sendDraft);

// Parameterized routes AFTER static routes
router.route("/:id/star").put(isAuthenticated, toggleStarEmail);
router.route("/:id/snooze").put(isAuthenticated, toggleSnoozeEmail);
router.route("/:id").delete(isAuthenticated, deleteEmail);

export default router;
