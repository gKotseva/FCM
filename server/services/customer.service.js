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

export const updateCustomer = async (id, updates) => {
  const fields = Object.keys(updates);

  if (fields.length === 0) {
    throw new Error("No fields to update");
  }

  const setClause = fields.map((field) => `${field} = ?`).join(", ");
  const values = fields.map((field) => updates[field]);

  values.push(id);

  const [result] = await db.query(
    `UPDATE customers SET ${setClause} WHERE id = ?`,
    values,
  );

  return result;
};

export const removeCustomer = async (id) => {
  const [result] = await db.query("DELETE FROM Customers WHERE id = ?", [id]);

  return result;
};
