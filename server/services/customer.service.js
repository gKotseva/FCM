import { db } from "../config/db.js";

export const createCustomerService = async ({
  name,
  email,
  company,
  phone,
  user_id,
  notes,
}) => {
  const [result] = await db.query(
    `
    INSERT INTO customers 
    (name, email, company, phone, user_id, notes)
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [name, email, company, phone, user_id, notes],
  );

  return {
    id: result.insertId,
    name,
    email,
    company,
    phone,
    user_id,
    notes,
  };
};
