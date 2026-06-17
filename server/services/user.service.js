import { db } from "../config/db.js";
import bcrypt from "bcrypt";

export const getAllUsers = async () => {
  const [rows] = await db.query("SELECT id, name, email, createdAt FROM users");

  return rows;
};

export const createUserService = async ({ name, email, password }) => {
  const passwordHash = await bcrypt.hash(password, 10);

  const [result] = await db.query(
    "INSERT INTO users (name, email, passwordHash) VALUES (?, ?, ?)",
    [name, email, passwordHash],
  );

  return {
    id: result.insertId,
    name,
    email,
  };
};

export const findUserByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

  return rows[0] || null;
};
