import { Router } from "express";
import { getUsers, login, register } from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/").get(verifyJwt, getUsers);

export default router;