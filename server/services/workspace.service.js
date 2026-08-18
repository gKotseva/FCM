import db from "../config/db.js";

export const getWorkspacesService = async (userId) => {
  const [rows] = await db.execute(
    "SELECT * FROM workspaces WHERE owner_id = ?",
    [userId],
  );

  return rows;
};

export const createWorkspaceService = async (userId, name) => {
  const [result] = await db.execute(
    `INSERT INTO workspaces (owner_id, name)
     VALUES (?, ?)`,
    [userId, name],
  );

  await db.execute(
    `INSERT INTO workspace_members
     (workspace_id, user_id, permission, role)
     VALUES (?, ?, ?, ?)`,
    [result.insertId, userId, "all", "owner"],
  );

  return result;
};

export const getSingleWorkspaceService = async (workspaceId) => {
  const [rows] = await db.execute("SELECT * FROM workspaces WHERE id = ?", [
    workspaceId,
  ]);

  if (rows.length === 0) {
    const error = new Error("Workspace not found.");
    error.statusCode = 404;
    throw error;
  }

  return rows[0];
};

export const updateSingleWorkspaceService = async (workspaceId, name) => {
  const [result] = await db.execute(
    "UPDATE workspaces SET name = ? WHERE id = ?",
    [name, workspaceId],
  );

  return result;
};

export const deleteSingleWorkspaceService = async (workspaceId) => {
  const [rows] = await db.execute("DELETE FROM workspaces WHERE id = ?", [
    workspaceId,
  ]);

  return rows[0];
};

export const getWorkspaceMembersService = async (workspaceId) => {
  const [rows] = await db.execute(
    `SELECT 
       wm.id,
       wm.workspace_id,
       wm.user_id,
       wm.permission,
       wm.role,
       wm.created_at,
       wm.updated_at,
       u.email
     FROM workspace_members wm
     JOIN users u ON wm.user_id = u.id
     WHERE wm.workspace_id = ?`,
    [workspaceId],
  );

  return rows;
};

export const addWorkspaceMemberService = async (
  workspaceId,
  userId,
  permission = null,
  role = "member",
) => {
  const [workspaceRows] = await db.execute(
    "SELECT id FROM workspaces WHERE id = ?",
    [workspaceId],
  );

  if (workspaceRows.length === 0) {
    const error = new Error("Workspace not found.");
    error.statusCode = 404;
    throw error;
  }

  const [userRows] = await db.execute("SELECT id FROM users WHERE id = ?", [
    userId,
  ]);

  if (userRows.length === 0) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  const [memberRows] = await db.execute(
    `SELECT id
     FROM workspace_members
     WHERE workspace_id = ? AND user_id = ?`,
    [workspaceId, userId],
  );

  if (memberRows.length > 0) {
    const error = new Error("User is already a member of this workspace.");
    error.statusCode = 409;
    throw error;
  }

  const [result] = await db.execute(
    `INSERT INTO workspace_members
     (workspace_id, user_id, permission, role)
     VALUES (?, ?, ?, ?)`,
    [workspaceId, userId, permission, role],
  );

  return result;
};

export const updateWorkspaceMemberService = async (
  workspaceId,
  userId,
  permission,
  role,
) => {
  const [memberRows] = await db.execute(
    `SELECT id, role
     FROM workspace_members
     WHERE workspace_id = ? AND user_id = ?`,
    [workspaceId, userId],
  );

  if (memberRows.length === 0) {
    const error = new Error("Workspace member not found.");
    error.statusCode = 404;
    throw error;
  }

  if (memberRows[0].role === "owner" && role !== "owner") {
    const error = new Error("Workspace owner cannot be demoted.");
    error.statusCode = 403;
    throw error;
  }

  await db.execute(
    `UPDATE workspace_members
     SET permission = ?, role = ?
     WHERE workspace_id = ? AND user_id = ?`,
    [permission, role, workspaceId, userId],
  );

  return true;
};

export const removeWorkspaceMemberService = async (workspaceId, userId) => {
  const [memberRows] = await db.execute(
    `SELECT id, role
     FROM workspace_members
     WHERE workspace_id = ? AND user_id = ?`,
    [workspaceId, userId],
  );

  if (memberRows.length === 0) {
    const error = new Error("Workspace member not found.");
    error.statusCode = 404;
    throw error;
  }

  if (memberRows[0].role === "owner") {
    const error = new Error("Workspace owner cannot be removed.");
    error.statusCode = 403;
    throw error;
  }

  await db.execute(
    `DELETE FROM workspace_members
     WHERE workspace_id = ? AND user_id = ?`,
    [workspaceId, userId],
  );

  return true;
};
