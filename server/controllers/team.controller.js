import {
  createTeamService,
  getTeamsService,
  getTeamService,
  updateTeamService,
  deleteTeamService,
} from "../services/team.service.js";

export const createTeam = async (req, res) => {
  const { name } = req.body;
  const { workspaceId } = req.params;

  try {
    const response = await createTeamService(name, workspaceId);

    return res.status(201).json({
      message: "Team created successfully.",
      team: response,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};

export const getTeams = async (req, res) => {
  const { userId } = req.user;
  const { workspaceId } = req.params;

  try {
    const response = await getTeamsService(workspaceId, userId);

    return res.status(200).json({
      teams: response,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};

export const getTeam = async (req, res) => {
  const { workspaceId, teamId } = req.params;

  try {
    const team = await getTeamService(workspaceId, teamId);

    return res.status(200).json({
      team,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};

export const updateTeam = async (req, res) => {
  const { workspaceId, teamId } = req.params;
  const { name } = req.body;

  try {
    const response = await updateTeamService(workspaceId, teamId, name);

    return res.status(200).json({
      message: "Team updated successfully.",
      team: response,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};

export const deleteTeam = async (req, res) => {
  const { workspaceId, teamId } = req.params;

  try {
    await deleteTeamService(workspaceId, teamId);

    return res.status(204).send();
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};
