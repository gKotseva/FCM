import { createCustomerService } from "../services/customer.service.js";

export const createCustomer = async (req, res) => {
  try {
    const customer = await createCustomerService(req.body);

    res.status(201).json(customer);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    res.status(500).json(error.message);
  }
};
