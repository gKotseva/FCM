import bcrypt from "bcrypt";
import { db } from "../config/db.js";
import jwt from "jsonwebtoken";

export const registerUserService = async ({
  firstName,
  lastName,
  email,
  password,
}) => {
  const [existingUsers] = await db.query(
    "SELECT id FROM Users WHERE email = ?",
    [email],
  );

  if (existingUsers.length > 0) {
    const error = new Error("Email already exists.");
    error.code = "EMAIL_EXISTS";
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const [userResult] = await db.query(
    `INSERT INTO Users
      (firstName, lastName, email, passwordHash)
     VALUES (?, ?, ?, ?)`,
    [firstName, lastName, email, passwordHash],
  );

  const userId = userResult.insertId;

  await db.query(
    `INSERT INTO UserSettings
      (user_id)
     VALUES (?)`,
    [userId],
  );

  return {
    id: userId,
    firstName,
    lastName,
    email,
  };
};

export const loginUserService = async (
  email,
  password,
  ipAddress,
  userAgent,
) => {
  const [users] = await db.query("SELECT * FROM Users WHERE email = ?", [
    email,
  ]);

  if (users.length === 0) {
    const error = new Error("Invalid email or password.");
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  const user = users[0];

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatch) {
    const error = new Error("Invalid email or password.");
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );

  const refreshToken = jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    },
  );

  const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await db.query(
    `INSERT INTO Sessions
      (user_id, refresh_token_hash, expires_at, ip_address, user_agent)
     VALUES (?, ?, ?, ?, ?)`,
    [user.id, refreshTokenHash, expiresAt, ipAddress, userAgent],
  );

  return {
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
    accessToken,
    refreshToken,
  };
};

export const getCurrentUserService = async (userId) => {
  const [rows] = await db.query(
    `SELECT id, firstName, lastName, email, createdAt
     FROM Users
     WHERE id = ?`,
    [userId],
  );

  return rows[0] || null;
};

export const getUserById = async (userId) => {
  const [rows] = await db.query(
    `SELECT id, firstName, lastName, email, createdAt
     FROM Users
     WHERE id = ?`,
    [userId],
  );

  return rows[0] || null;
};

export const refreshTokenService = async (refreshToken) => {
  const [sessions] = await db.query(
    `SELECT *
     FROM Sessions
     WHERE revoked_at IS NULL`,
  );

  let session = null;

  for (const currentSession of sessions) {
    const isValid = await bcrypt.compare(
      refreshToken,
      currentSession.refresh_token_hash,
    );

    if (isValid) {
      session = currentSession;
      break;
    }
  }

  if (!session) {
    const error = new Error("Invalid refresh token.");
    error.code = "INVALID_REFRESH_TOKEN";
    throw error;
  }

  if (new Date(session.expires_at) <= new Date()) {
    const error = new Error("Refresh token has expired.");
    error.code = "REFRESH_TOKEN_EXPIRED";
    throw error;
  }

  const user = await getUserById(session.user_id);

  if (!user) {
    const error = new Error("User not found.");
    error.code = "USER_NOT_FOUND";
    throw error;
  }

  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );

  return {
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
    accessToken,
  };
};

export const logoutUserService = async (refreshToken) => {
  const [sessions] = await db.query(
    `SELECT id, refresh_token_hash
     FROM Sessions
     WHERE revoked_at IS NULL`,
  );

  let session = null;

  for (const currentSession of sessions) {
    const isValid = await bcrypt.compare(
      refreshToken,
      currentSession.refresh_token_hash,
    );

    if (isValid) {
      session = currentSession;
      break;
    }
  }

  if (!session) {
    const error = new Error("Invalid refresh token.");
    error.code = "INVALID_REFRESH_TOKEN";
    throw error;
  }

  await db.query(
    `UPDATE Sessions
     SET revoked_at = NOW()
     WHERE id = ?`,
    [session.id],
  );

  return true;
};
