import {
  registerUserService,
  loginUserService,
  getCurrentUserService,
  refreshTokenService,
  logoutUserService,
} from "../services/auth.service.js";

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const user = await registerUserService({
      firstName,
      lastName,
      email,
      password,
    });

    return res.status(201).json({
      message: "User registered successfully.",
      data: user,
    });
  } catch (error) {
    console.error(error);

    if (error.code === "EMAIL_EXISTS") {
      return res.status(409).json({
        message: "Email is already in use.",
      });
    }

    return res.status(500).json({
      message: "Failed to register user.",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await loginUserService(
      email,
      password,
      req.ip,
      req.get("user-agent"),
    );

    return res.status(200).json({
      message: "Login successful.",
      data: result,
    });
  } catch (error) {
    console.error(error);

    if (error.code === "INVALID_CREDENTIALS") {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    return res.status(500).json({
      message: "Failed to login.",
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await getCurrentUserService(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.status(200).json({
      data: user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to get current user.",
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        message: "Refresh token is required.",
      });
    }

    const result = await refreshTokenService(refreshToken);

    return res.status(200).json({
      message: "Token refreshed successfully.",
      data: result,
    });
  } catch (error) {
    console.error(error);

    if (error.code === "INVALID_REFRESH_TOKEN") {
      return res.status(401).json({
        message: "Invalid refresh token.",
      });
    }

    if (error.code === "REFRESH_TOKEN_EXPIRED") {
      return res.status(401).json({
        message: "Refresh token has expired.",
      });
    }

    if (error.code === "REFRESH_TOKEN_REVOKED") {
      return res.status(401).json({
        message: "Invalid refresh token.",
      });
    }

    if (error.code === "USER_NOT_FOUND") {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.status(500).json({
      message: "Failed to refresh token.",
    });
  }
};

export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        message: "Refresh token is required.",
      });
    }

    await logoutUserService(refreshToken);

    return res.status(200).json({
      message: "Logout successful.",
    });
  } catch (error) {
    console.error(error);

    if (error.code === "INVALID_REFRESH_TOKEN") {
      return res.status(401).json({
        message: "Invalid refresh token.",
      });
    }

    return res.status(500).json({
      message: "Failed to logout.",
    });
  }
};
