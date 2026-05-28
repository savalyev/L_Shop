import { Router } from "express";
import { UsersController } from "../controllers/users/usersController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { Request, Response } from "express";

const userRouter = Router();

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Получить всех пользователей
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Список пользователей успешно получен
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
userRouter.get("/", UsersController.getAll);

/**
 * @openapi
 * /api/users/by-name:
 *   get:
 *     summary: Получить пользователя по имени
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Имя пользователя
 *         example: "Kirill" 
 *     responses:
 *       200:
 *         description: Пользователь с совпадающим именем
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Query-параметр "name" обязателен
 */
userRouter.get("/by-name", UsersController.getByName);

/**
 * @openapi
 * /api/users/me:
 *   get:
 *     summary: Получить пользователя по Cookies
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Пользователь найденый по Cookies
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Cookies не существует
 *       401:
 *         description: Некорректные Cookies
 */
userRouter.get("/me", authMiddleware, (req: Request, res: Response) => {
    res.json(res.locals.user);
});

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Получить пользователя по ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Уникальный идентификатор пользователя
 *         example: 1
 *     responses:
 *       200:
 *         description: Пользователь найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Пользователь с таким ID не найден
 */
userRouter.get("/:id", UsersController.getById);

export {userRouter};
