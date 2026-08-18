import db from "../config/db.js";

export const validateWorkspace = (req, res, next) => {
  const { name } = req.body;

  if (!name)
    return res.status(400).json({
      message: "Name is required.",
    });

  if (name.length < 2)
    return res.status(400).json({
      message: "Name should be at least 2 characters.",
    });

  next();
};

export const authorizeWorkspaceOwner = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user.userId;

    const [rows] = await db.execute(
      "SELECT owner_id FROM workspaces WHERE id = ?",
      [workspaceId],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Workspace not found.",
      });
    }

    if (rows[0].owner_id !== userId) {
      return res.status(403).json({
        message: "You do not have permission to modify this workspace.",
      });
    }

    next();
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};

export const authorizeWorkspaceMember = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user.userId;

    const [workspaceRows] = await db.execute(
      "SELECT id FROM workspaces WHERE id = ?",
      [workspaceId],
    );

    if (workspaceRows.length === 0) {
      return res.status(404).json({
        message: "Workspace not found.",
      });
    }

    const [memberRows] = await db.execute(
      `SELECT id
       FROM workspace_members
       WHERE workspace_id = ? AND user_id = ?`,
      [workspaceId, userId],
    );

    if (memberRows.length === 0) {
      return res.status(403).json({
        message: "You do not have access to this workspace.",
      });
    }

    next();
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};

export const validateWorkspaceMember = (req, res, next) => {
  const { role, permission } = req.body;

  const allowedRoles = ["owner", "admin", "member"];
  const allowedPermissions = ["view", "edit", "all"];

  if (role && !allowedRoles.includes(role)) {
    return res.status(400).json({
      message: "Invalid role.",
    });
  }

  if (permission && !allowedPermissions.includes(permission)) {
    return res.status(400).json({
      message: "Invalid permission.",
    });
  }

  next();
};
