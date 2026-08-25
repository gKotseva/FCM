import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  addWorkspaceMember,
  createWorkspace,
  deleteSingleWorkspace,
  getSingleWorkspace,
  getWorkspaceMembers,
  getWorkspaces,
  removeWorkspaceMember,
  updateSingleWorkspace,
  updateWorkspaceMember,
} from "../controllers/workspace.controller.js";

import {
  authorizeWorkspaceMember,
  authorizeWorkspaceOwner,
  validateWorkspace,
  validateWorkspaceMember,
} from "../middlewares/workspace.middleware.js";

const router = express.Router();

router.post("/", authenticate, validateWorkspace, createWorkspace);
router.put(
  "/:workspaceId",
  authenticate,
  authorizeWorkspaceOwner,
  validateWorkspace,
  updateSingleWorkspace,
);
router.delete(
  "/:workspaceId",
  authenticate,
  authorizeWorkspaceOwner,
  deleteSingleWorkspace,
);
router.get("/", authenticate, getWorkspaces);
router.get("/:workspaceId", authenticate, getSingleWorkspace);

router.get(
  "/:workspaceId/members",
  authenticate,
  authorizeWorkspaceMember,
  getWorkspaceMembers,
);

router.post(
  "/:workspaceId/members",
  authenticate,
  authorizeWorkspaceOwner,
  validateWorkspaceMember,
  addWorkspaceMember,
);

router.put(
  "/:workspaceId/members/:userId",
  authenticate,
  authorizeWorkspaceOwner,
  validateWorkspaceMember,
  updateWorkspaceMember,
);

router.delete(
  "/:workspaceId/members/:userId",
  authenticate,
  authorizeWorkspaceOwner,
  removeWorkspaceMember,
);

export default router;
