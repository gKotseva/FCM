export const validateCustomer = (req, res, next) => {
  const { name, email, company, phone, user_id, notes } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      message: "Name and email are required.",
    });
  }

  if (name.length < 2) {
    return res.status(400).json({
      message: "The name must be more than 2 characters.",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Invalid email format.",
    });
  }

  next();
};
