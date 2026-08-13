import db from "../config/db.js";

export const saveRefreshToken = async (userId, token, expiresAt) => {
  await db.execute(
    `INSERT INTO refresh_tokens
     (user_id, token, expires_at)
     VALUES (?, ?, ?)`,
    [userId, token, expiresAt],
  );
};

export const findRefreshToken = async (token) => {
  const [rows] = await db.execute(
    `SELECT * FROM refresh_tokens
     WHERE token = ? AND expires_at > NOW()`,
    [token],
  );

  return rows[0];
};

export const deleteRefreshToken = async (token) => {
  await db.execute(`DELETE FROM refresh_tokens WHERE token = ?`, [token]);
};
