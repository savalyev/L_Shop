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
 *         description: Ошибка регистрации (AuthError)
 *       500:
 *         description: Внутренняя ошибка сервера
 */
authRouter.post("/register", AuthController.register);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Вход пользователя
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/LoginBody"
 *     responses:
 *       200:
 *         description: Успешный вход, сессия установлена (cookie sessionId)
 *         headers:
 *           Set-Cookie:
 *             description: HTTP cookie с идентификатором сессии
 *             schema:
 *               type: string
 *               example: "sessionId=abc123; HttpOnly; Secure; SameSite=Lax"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RequestUser"
 *       400:
 *         description: Имя и пароль обязательны или некорректны
 *       401:
 *         description: Неверное имя или пароль
 *       500:
 *         description: Внутренняя ошибка сервера
 */
authRouter.post('/login', AuthController.login);

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     summary: Выход пользователя
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Пользователь успешно вышел из системы
 *         headers:
 *           Set-Cookie:
 *             description: Очистка cookie sessionId
 *             schema:
 *               type: string
 *               example: "sessionId=; Max-Age=0; HttpOnly; Secure; SameSite=Lax"
 *       401:
 *         description: Пользователь не авторизован или сессия не найдена
 *       500:
 *         description: Внутренняя ошибка сервера
 */
authRouter.post("/logout", AuthController.logout);

export {authRouter};