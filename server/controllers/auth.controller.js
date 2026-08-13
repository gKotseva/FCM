import {
  getMeService,
  loginService,
  registerService,
} from "../services/auth.service.js";
import {
  deleteRefreshToken,
  findRefreshToken,
  saveRefreshToken,
} from "../services/refreshToken.service.js";
import {
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenExpiration,
  verifyRefreshToken,
} from "../utils/jwt.js";

export const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const response = await registerService(email, password);

    return res.status(201).json({
      message: "User registered successfully.",
      userId: response.insertId,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await loginService(email, password);

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    const expiresAt = getRefreshTokenExpiration();

    await saveRefreshToken(user.id, refreshToken, expiresAt);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: expiresAt,
    });

    return res.status(200).json({
      message: "Login successful.",
      accessToken,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await getMeService(req.user.userId);

    return res.status(200).json({
      user,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};

export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token is required.",
      });
    }

    const decoded = verifyRefreshToken(refreshToken);

    const storedToken = await findRefreshToken(refreshToken);

    if (!storedToken) {
      return res.status(401).json({
        message: "Invalid or expired refresh token.",
      });
    }

    await deleteRefreshToken(refreshToken);

    const newAccessToken = generateAccessToken(decoded.userId);
    const newRefreshToken = generateRefreshToken(decoded.userId);
    const expiresAt = getRefreshTokenExpiration();

    await saveRefreshToken(decoded.userId, newRefreshToken, expiresAt);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: expiresAt,
    });

    return res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired refresh token.",
    });
  }
};

export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token is required.",
      });
    }

    await deleteRefreshToken(refreshToken);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
