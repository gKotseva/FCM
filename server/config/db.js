import mysql from "mysql2/promise";
import dotenv from "dotenv";

const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";

dotenv.config({
  path: envFile,
});

console.log({
  NODE_ENV: process.env.NODE_ENV,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
});

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});
