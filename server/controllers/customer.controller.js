import {
  createCustomerService,
  removeCustomer,
  updateCustomer,
} from "../services/customer.service.js";

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

export const updateCustomerInfo = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await updateCustomer(id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCustomer = async (req, res) => {
  const { id } = req.params;

  try {
    await removeCustomer(id);

    res.json({
      message: "Customer removed!",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
