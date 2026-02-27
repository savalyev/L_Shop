import { Router } from "express";
import { authController } from "../controllers/users/authController";

const authRouter = Router();

authRouter.post("/register", authController.register);

export {authRouter};