import {
  createWorkspaceService,
  deleteSingleWorkspaceService,
  getSingleWorkspaceService,
  getWorkspacesService,
  updateSingleWorkspaceService,
} from "../services/workspace.service.js";

export const getWorkspaces = async (req, res) => {
  const userId = req.user.userId;

  try {
    const workspaces = await getWorkspacesService(userId);

    return res.status(200).json({
      workspaces,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};

export const createWorkspace = async (req, res) => {
  const userId = req.user.userId;
  const { name } = req.body;

  try {
    const response = await createWorkspaceService(userId, name);

    return res.status(201).json({
      message: "Workspace created successfully.",
      workspaceId: response.insertId,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};

export const getSingleWorkspace = async (req, res) => {
  const { workspaceId } = req.params;

  try {
    const response = await getSingleWorkspaceService(workspaceId);

    return res.status(200).json({ workspace: response });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};

export const updateSingleWorkspace = async (req, res) => {
  const { workspaceId } = req.params;
  const { name } = req.body;

  try {
    const response = await updateSingleWorkspaceService(workspaceId, name);

    return res.status(200).json({
      message: "Workspace updated successfully.",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};

export const deleteSingleWorkspace = async (req, res) => {
  const { workspaceId } = req.params;

  try {
    await deleteSingleWorkspaceService(workspaceId);

    return res.status(204).send();
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};
