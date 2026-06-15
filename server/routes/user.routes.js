import express from "express";
import { getUsers, createUser } from "../controllers/user.controller.js";
import { validateRegister } from "../middlewares/user.middleware.js";

const router = express.Router();

router.get("/", getUsers);
router.post("/register", validateRegister, createUser);

export default router;
