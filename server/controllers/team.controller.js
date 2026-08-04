import {
  addTeam,
  allTeams,
  removeTeam,
  teamById,
  updateTeam,
  addMemberToTeam,
  getMembersByTeam,
  updateMemberRole,
  removeMemberFromTeam,
} from "../services/team.service.js";

export const createTeam = async (req, res) => {
  try {
    const result = await addTeam(req.body);
    res.status(200).json({ message: "Team created", data: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTeams = async (req, res) => {
  try {
    const result = await allTeams();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTeamById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await teamById(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTeamInfo = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await updateTeam(id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTeam = async (req, res) => {
  const { id } = req.params;

  try {
    await removeTeam(id);

    res.json({
      message: "Team removed!",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const addMember = async (req, res) => {
  const { id } = req.params;

  try {
    await addMemberToTeam(id, req.body);

    res.status(201).json({
      message: "Member added successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMembers = async (req, res) => {
  const { id } = req.params;

  try {
    const members = await getMembersByTeam(id);

    res.json(members);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateMember = async (req, res) => {
  const { id, userId } = req.params;

  try {
    const result = await updateMemberRole(id, userId, req.body);

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const removeMember = async (req, res) => {
  const { id, userId } = req.params;

  try {
    await removeMemberFromTeam(id, userId);

    res.json({
      message: "Member removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
