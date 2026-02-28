import { Router } from "express";
import { authController } from "../controllers/users/authController";

const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post('/login', authController.login);

export {authRouter};