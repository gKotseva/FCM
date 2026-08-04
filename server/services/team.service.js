import { db } from "../config/db.js";

export const addTeam = async ({ name, manager_id }) => {
  const [result] = await db.query(
    "INSERT INTO team (name, manager_id) VALUES (?, ?)",
    [name, manager_id],
  );

  return {
    id: result.insertId,
    name,
    manager_id,
  };
};

export const allTeams = async () => {
  const [rows] = await db.query("SELECT * FROM team");

  return rows;
};

export const teamById = async (id) => {
  const [rows] = await db.query("SELECT * FROM team WHERE id=?", [id]);

  return rows[0];
};

export const updateTeam = async (id, updates) => {
  const fields = Object.keys(updates);

  if (fields.length === 0) {
    throw new Error("No fields to update");
  }

  const setClause = fields.map((field) => `${field} = ?`).join(", ");
  const values = fields.map((field) => updates[field]);

  values.push(id);

  const [result] = await db.query(
    `UPDATE team SET ${setClause} WHERE id = ?`,
    values,
  );

  return result;
};

export const removeTeam = async (id) => {
  const [result] = await db.query("DELETE FROM team WHERE id = ?", [id]);

  return result;
};

export const addMemberToTeam = async (teamId, { user_id, role }) => {
  const [result] = await db.query(
    `
    INSERT INTO TeamMembers
    (user_id, team_id, role)
    VALUES (?, ?, ?)
    `,
    [user_id, teamId, role],
  );

  return result;
};

export const getMembersByTeam = async (teamId) => {
  const [rows] = await db.query(
    `
    SELECT *
    FROM TeamMembers
    WHERE team_id = ?
    `,
    [teamId],
  );

  return rows;
};

export const updateMemberRole = async (teamId, userId, { role }) => {
  const [result] = await db.query(
    `
    UPDATE TeamMembers
    SET role = ?
    WHERE team_id = ?
      AND user_id = ?
    `,
    [role, teamId, userId],
  );

  return result;
};

export const removeMemberFromTeam = async (teamId, userId) => {
  const [result] = await db.query(
    `
    DELETE FROM TeamMembers
    WHERE team_id = ?
      AND user_id = ?
    `,
    [teamId, userId],
  );

  return result;
};
