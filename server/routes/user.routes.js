import express from "express";
import {
  getUsers,
  createUser,
  loginUser,
  getMe,
} from "../controllers/user.controller.js";
import {
  validateRegister,
  validateLogin,
  authenticate,
} from "../middlewares/user.middleware.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/me", authenticate, getMe);
router.post("/register", validateRegister, createUser);
router.post("/login", validateLogin, loginUser);

export default router;
