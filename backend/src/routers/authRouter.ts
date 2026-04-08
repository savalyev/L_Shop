import { Router } from "express";
import { AuthController } from "../controllers/users/authController";

const authRouter = Router();


/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Регистрация пользователя
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/RegistrationBody"
 *     responses:
 *       201:
 *         description: Пользователь успешно зарегистрирован
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: "#/components/schemas/RequestUser"
 *       400:
 *         description: Имя и пароль обязательны
 *       401:
 *         description: Ошибка авторизации (AuthError)
 *       500:
 *         description: Внутренняя ошибка сервера
 */
authRouter.post("/register", AuthController.register);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Авторизация пользователя
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/LoginBody"
 *     responses:
 *       201:
 *         description: Пользователь успешно зарегистрирован
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: "#/components/schemas/RequestUser"
 *       400:
 *         description: Имя и пароль обязательны
 *       401:
 *         description: Ошибка авторизации (AuthError)
 *       500:
 *         description: Внутренняя ошибка сервера
 */
authRouter.post('/login', AuthController.login);
authRouter.post("/logout", AuthController.logout);

export {authRouter};