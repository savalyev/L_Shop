import { Router } from "express";
import { AuthController } from "../controllers/users/authController";

const authRouter = Router();

authRouter.post("/register", AuthController.register);
authRouter.post('/login', AuthController.login);
authRouter.post("/logout", AuthController.logout);

export {authRouter};