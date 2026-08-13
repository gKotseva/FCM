import express from "express";
import {
  authenticate,
  validateLogin,
  validateRegister,
} from "../middlewares/auth.middleware.js";
import {
  getMe,
  login,
  register,
  refresh,
  logout,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", authenticate, getMe);

export default router;
