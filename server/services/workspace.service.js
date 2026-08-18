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
