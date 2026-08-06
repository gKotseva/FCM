export const validateCustomer = (req, res, next) => {
  const { name, email } = req.body;
  const isUpdate = req.method === "PUT" || req.method === "PATCH";

  if (!isUpdate && (!name || !email)) {
    return res.status(400).json({
      message: "Name and email are required.",
    });
  }

  if (isUpdate && Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message: "At least one field is required to update.",
    });
  }

  if (name && name.length < 2) {
    return res.status(400).json({
      message: "The name must be more than 2 characters.",
    });
  }

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format.",
      });
    }
  }

  next();
};
