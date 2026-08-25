import express from "express";

import {
  createTeam,
  deleteTeam,
  getTeam,
  getTeams,
  updateTeam,
} from "../controllers/team.controller.js";

import { validateTeam } from "../middlewares/team.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";

import {
  authorizeWorkspaceMember,
  authorizeWorkspaceOwner,
} from "../middlewares/workspace.middleware.js";

const router = express.Router();

router.post(
  "/workspace/:workspaceId",
  authenticate,
  authorizeWorkspaceOwner,
  validateTeam,
  createTeam,
);

router.get(
  "/workspace/:workspaceId",
  authenticate,
  authorizeWorkspaceMember,
  getTeams,
);

router.get(
  "/workspace/:workspaceId/teams/:teamId",
  authenticate,
  authorizeWorkspaceMember,
  getTeam,
);

router.put(
  "/workspace/:workspaceId/teams/:teamId",
  authenticate,
  authorizeWorkspaceOwner,
  validateTeam,
  updateTeam,
);

router.delete(
  "/workspace/:workspaceId/teams/:teamId",
  authenticate,
  authorizeWorkspaceOwner,
  deleteTeam,
);

export default router;
