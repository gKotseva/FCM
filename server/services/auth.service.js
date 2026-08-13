import bcrypt from "bcrypt";
import db from "../config/db.js";

export const registerService = async (email, password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      "INSERT INTO users (email, passwordHash) VALUES (?, ?)",
      [email, hashedPassword],
    );

    return result;
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      const error = new Error("User with this email already exists.");
      error.statusCode = 409;
      throw error;
    }
    throw error;
  }
};

export const loginService = async (email, password) => {
  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      const error = new Error("Invalid email or password.");
      error.statusCode = 401;
      throw error;
    }

    const user = rows[0];

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      const error = new Error("Invalid email or password.");
      error.statusCode = 401;
      throw error;
    }

    return { id: user.id };
  } catch (error) {
    throw error;
  }
};

export const getMeService = async (userId) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, email FROM users WHERE id = ?",
      [userId],
    );

    if (rows.length === 0) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }

    return rows[0];
  } catch (error) {
    throw error;
  }
};
