export const validateTeam = (req, res, next) => {
  const { name, manager_id } = req.body;
  const isUpdate = req.method === "PUT" || req.method === "PATCH";

  if (!isUpdate && (!name || !manager_id)) {
    return res.status(400).json({
      message: "name, manager_id are required.",
    });
  }

  if (isUpdate && !name && !manager_id) {
    return res.status(400).json({
      message: "At least one field is required to update.",
    });
  }

  if (name && name.length < 2) {
    return res.status(400).json({
      message: "Name too short.",
    });
  }

  next();
};
