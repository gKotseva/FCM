import express from "express";
import authRoutes from "./routes/auth.routes.js";
import workspaceRoutes from "./routes/workspace.routes.js";
import teamRoutes from "./routes/team.routes.js";

const router = express.Router();

router.use("/api/auth", authRoutes);
router.use("/api/workspaces", workspaceRoutes);
router.use("/api/teams", teamRoutes);

export default router;
