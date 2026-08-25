export const validateTeam = (req, res, next) => {
  const { name } = req.body;
  const { workspaceId } = req.params;

  if (!name || !workspaceId) {
    return res.status(400).json({
      message: "Team name and workspace ID are required.",
    });
  }

  if (name.length < 2)
    return res.status(400).json({
      message: "Team name should be at least 2 characters.",
    });

  next();
};
