import express from "express";
import {
  acceptProblem,
  approveProblem,
  rejectProblem,
  banUser,
  unbanUser,
  flagIssue,
  unflagIssue,
  getFlaggedIssues,
  getAnalytics,
  getIssueFlagCount,
} from "../controllers/goverment.controller.js";
import { isGovernment } from "../utils/helper.js";
import isAuthenticated from "../middlewares/Authentication.js";

const router = express.Router();

// Problem management
router.post(
  "/approve/:problemId",
  isAuthenticated,
  isGovernment,
  approveProblem
);
router.post("/reject/:problemId", isAuthenticated, isGovernment, rejectProblem);
router.post(
  "/complete/:problemId",
  isAuthenticated,
  isGovernment,
  acceptProblem
);

// User management
router.post("/ban-user/:userId", isAuthenticated, isGovernment, banUser);
router.post("/unban-user/:userId", isAuthenticated, isGovernment, unbanUser);

// Flag management
router.post("/flag/:problemId", isAuthenticated, flagIssue);
router.delete("/unflag/:problemId", isAuthenticated, unflagIssue);
router.get("/flagged-issues", isAuthenticated, isGovernment, getFlaggedIssues);
router.get("/flag-count/:problemId", isAuthenticated, getIssueFlagCount);

// Analytics
router.get("/analytics", isAuthenticated, isGovernment, getAnalytics);

export default router;
