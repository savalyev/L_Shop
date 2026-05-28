import { DeliveryController } from "../controllers/delivery/deliveryController";
import { DeliveryMiddle } from "../middlewares/deliveryMiddleware";
import { Request, Response, Router } from "express";

export const deliveryRouter = Router();

/**
 * @openapi
 * /api/delivery/getall:
 *   get:
 *     summary: Получить доставки по ID пользователя
 *     tags:
 *       - Delivery
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Список доставок пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Delivery"
 *       400:
 *         description: userId is required
 *       500:
 *         description: Внутренняя ошибка сервера
 */
deliveryRouter.get('/getall', DeliveryController.getDelivByUserId);

/**
 * @openapi
 * /api/delivery:
 *   post:
 *     summary: Создать доставку по ID пользователя
 *     tags:
 *       - Delivery
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - Address
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               Address:
 *                 $ref: "#/components/schemas/Address"
 *     responses:
 *       201:
 *         description: Доставка успешно создана
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Delivery"
 *       400:
 *         description: userId or address is required
 *       500:
 *         description: Внутренняя ошибка сервера
 */
deliveryRouter.post('/', DeliveryController.createDelivery);

/**
 * @openapi
 * /api/delivery/delete-delivery:
 *   delete:
 *     summary: Удалить доставку по ID пользователя и ID доставки
 *     tags:
 *       - Delivery
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - deliveryId
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               deliveryId:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       200:
 *         description: Список доставок после удаления
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Delivery"
 *       400:
 *         description: userId or deliveryId is required
 *       500:
 *         description: Внутренняя ошибка сервера
 */
deliveryRouter.delete('/delete-delivery', DeliveryController.removeDelivery);

/**
 * @openapi
 * /api/delivery/get-all:
 *   get:
 *     summary: Получить доставки текущего пользователя (по sessionId)
 *     description: Требуется cookie sessionId. Пользователь определяется по сессии.
 *     tags:
 *       - Delivery
 *     responses:
 *       200:
 *         description: Список доставок текущего пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Delivery"
 *       404:
 *         description: user not verificate или user havent delivs
 *       500:
 *         description: Внутренняя ошибка сервера
 */
deliveryRouter.get('/get-all', DeliveryMiddle.getDelivByUserId, (req: Request, res: Response) => {
    res.json(res.locals.userdeliveres);
});

/**
 * @openapi
 * /api/delivery/createDeliv:
 *   post:
 *     summary: Создать доставку для текущего пользователя (по sessionId)
 *     description: Требуется cookie sessionId. ID пользователя берётся из сессии.
 *     tags:
 *       - Delivery
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Address
 *             properties:
 *               Address:
 *                 $ref: "#/components/schemas/Adress"
 *     responses:
 *       200:
 *         description: Доставка создана, возвращён объект доставки
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Delivery"
 *       404:
 *         description: user not verificate / address not found / user dont have delivery obj
 *       500:
 *         description: Внутренняя ошибка сервера
 */
deliveryRouter.post('/createDeliv', DeliveryMiddle.createDelivery, (req: Request, res: Response) => {
    res.json(res.locals.delivary);
});

/**
 * @openapi
 * /api/delivery/remove-delivery:
 *   delete:
 *     summary: Удалить доставку текущего пользователя (по sessionId)
 *     description: Требуется cookie sessionId. Удаляет доставку по deliveryId из тела.
 *     tags:
 *       - Delivery
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deliveryId
 *             properties:
 *               deliveryId:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       200:
 *         description: Доставка удалена, возвращён объект/список доставок
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Delivery"
 *       404:
 *         description: user not verificate / deliv not found / user dont have delivery obj
 *       500:
 *         description: Внутренняя ошибка сервера
 */
deliveryRouter.delete('/remove-delivery', DeliveryMiddle.removeDelivery, (req: Request, res: Response) => {
    res.json(res.locals.delivary);
});