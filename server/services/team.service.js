import db from "../config/db.js";

export const createTeamService = async (name, workspaceId) => {
  const [result] = await db.execute(
    `INSERT INTO teams (name, workspace_id)
     VALUES (?, ?)`,
    [name, workspaceId],
  );

  const [rows] = await db.execute(`SELECT * FROM teams WHERE id = ?`, [
    result.insertId,
  ]);

  return rows[0];
};

export const getTeamsService = async (workspaceId, userId) => {
  const [teams] = await db.execute(
    `SELECT t.*
     FROM teams t
     JOIN workspace_members wm
       ON t.workspace_id = wm.workspace_id
     WHERE t.workspace_id = ?
       AND wm.user_id = ?`,
    [workspaceId, userId],
  );

  return teams;
};

export const getTeamService = async (workspaceId, teamId) => {
  const [rows] = await db.execute(
    `SELECT *
     FROM teams
     WHERE id = ? AND workspace_id = ?`,
    [teamId, workspaceId],
  );

  if (rows.length === 0) {
    const error = new Error("Team not found.");
    error.statusCode = 404;
    throw error;
  }

  return rows[0];
};

export const updateTeamService = async (workspaceId, teamId, name) => {
  const [result] = await db.execute(
    `UPDATE teams
     SET name = ?
     WHERE id = ? AND workspace_id = ?`,
    [name, teamId, workspaceId],
  );

  if (result.affectedRows === 0) {
    const error = new Error("Team not found.");
    error.statusCode = 404;
    throw error;
  }

  const [rows] = await db.execute(
    `SELECT * FROM teams
     WHERE id = ? AND workspace_id = ?`,
    [teamId, workspaceId],
  );

  return rows[0];
};

export const deleteTeamService = async (workspaceId, teamId) => {
  const [result] = await db.execute(
    `DELETE FROM teams
     WHERE id = ? AND workspace_id = ?`,
    [teamId, workspaceId],
  );

  if (result.affectedRows === 0) {
    const error = new Error("Team not found.");
    error.statusCode = 404;
    throw error;
  }
};
