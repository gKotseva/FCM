import { db } from "../config/db.js";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../config/jwt.js";
import { createSession } from "./session.service.js";

export const getAllUsers = async () => {
  const [rows] = await db.query(
    "SELECT id, firstName, lastName, email, createdAt FROM users",
  );

  return rows;
};

export const createUserService = async ({
  firstName,
  lastName,
  email,
  password,
}) => {
  const passwordHash = await bcrypt.hash(password, 10);

  const [result] = await db.query(
    "INSERT INTO users (firstName, lastName, email, passwordHash) VALUES (?, ?, ?, ?)",
    [firstName, lastName, email, passwordHash],
  );

  const userId = result.insertId;

  await db.query(
    `INSERT INTO userSettings 
    (user_id, notifications_enabled, dark_mode, language, timezone)
    VALUES (?, ?, ?, ?, ?)`,
    [userId, true, false, "en", "Europe/Sofia"],
  );

  return {
    id: userId,
    firstName,
    lastName,
    email,
  };
};

export const findUserByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

  return rows[0] || null;
};

export const loginUserService = async ({ email, password }) => {
  const user = await findUserByEmail(email);

  if (!user) {
    return {
      success: false,
      status: 401,
      message: "Invalid credentials",
    };
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    return {
      success: false,
      status: 401,
      message: "Invalid credentials",
    };
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

  await createSession({
    userId: user.id,
    refreshTokenHash,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    ipAddress: null,
    userAgent: null,
  });

  return {
    success: true,
    data: {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    },
  };
};

export const getUserById = async (id) => {
  const [rows] = await db.query(
    "SELECT id, firstName, lastName, email, avatarUrl, createdAt FROM users WHERE id = ?",
    [id],
  );

  return rows[0];
};
