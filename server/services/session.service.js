import { db } from "../config/db.js";
import bcrypt from "bcrypt";

export const createSession = async ({
  userId,
  refreshTokenHash,
  expiresAt,
  ipAddress,
  userAgent,
}) => {
  await db.query(
    `
    INSERT INTO session
    (
      user_id,
      refresh_token_hash,
      expires_at,
      ip_address,
      user_agent
    )
    VALUES (?, ?, ?, ?, ?)
    `,
    [userId, refreshTokenHash, expiresAt, ipAddress, userAgent],
  );
};

export const findSessionByUserIdAndToken = async (userId, refreshToken) => {
  const [rows] = await db.query(
    `
    SELECT *
    FROM session
    WHERE user_id = ?
    AND revoked_at IS NULL
    ORDER BY id DESC
    `,
    [userId],
  );

  for (const session of rows) {
    const match = await bcrypt.compare(
      refreshToken,
      session.refresh_token_hash,
    );

    if (match) {
      return session;
    }
  }

  return null;
};

export const revokeSession = async (sessionId) => {
  await db.query(
    `
    UPDATE session
    SET revoked_at = NOW()
    WHERE id = ?
    `,
    [sessionId],
  );
};
