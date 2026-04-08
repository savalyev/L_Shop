import { Router } from 'express';
import { BasketController } from '../controllers/basket/basketController';
import { authMiddleware } from '../middlewares/authMiddleware';

const basketRouter = Router();

/**
 * @openapi
 * /api/basket/mybasket:
 *   get:
 *     summary: Получить корзину текущего пользователя
 *     description: Требуется cookies sessionId
 *     tags:
 *       - Basket
 *     responses:
 *       200:
 *         description: Корзина пользователя успешно получена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Basket"     
 *       400:
 *         description: Пользователь не авторизован (sessionId отсутствует)
 *       401:
 *         description: Сессия недействительна
 *       404:
 *         description: Корзина пользователя не найдена
 *       500:
 *         description: Внутренняя ошибка сервера      
 */
basketRouter.get('/mybasket', authMiddleware, BasketController.getBasket);

/**
 * @openapi
 * /api/basket/add-to-basket:
 *   post:
 *     summary: Добавить товар в корзину (увеличить количество на 1)
 *     description: Требуется cookie sessionId. Товар указывается по ID.
 *     tags:
 *       - Basket
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       201:
 *         description: Товар добавлен в корзину
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userbasket:
 *                   $ref: "#/components/schemas/Basket"
 *       400:
 *         description: Товар не найден (productId не передан или некорректен)
 *       401:
 *         description: Сессия недействительна
 *       500:
 *         description: Внутренняя ошибка сервера      
 *   
 */
basketRouter.post('/add-to-basket', authMiddleware, BasketController.addToBasket);

/**
 * @openapi
 * /api/basket/remove-count:
 *   patch:
 *     summary: Уменьшить количество товара на 1
 *     description: Требуется cookie sessionId. Если количество становится 0, товар может быть удалён из корзины.
 *     tags:
 *       - Basket
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       201:
 *         description: Количество товара уменьшено, возвращена обновлённая корзина
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userbasket:
 *                   $ref: "#/components/schemas/Basket"
 *       400:
 *         description: Товар не найден (productId не передан или некорректен)
 *       401:
 *         description: Сессия недействительна
 *       500:
 *         description: Внутренняя ошибка сервера      
 *   
 */
basketRouter.patch('/remove-count', authMiddleware, BasketController.removeFromBasket);

/**
 * @openapi
 * /api/basket/remove-all:
 *   delete:
 *     summary: Удалить все товары из корзины
 *     description: Требуется cookie sessionId.
 *     tags:
 *       - Basket
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 101
 *     responses:
 *       200:
 *         description: Корзина очищена, возвращено итоговое состояние (может быть пустым)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Basket"
 *       400:
 *         description: productId не передан или некорректен
 *       401:
 *         description: Сессия недействительна
 *       500:
 *         description: Внутренняя ошибка сервера
 */
basketRouter.delete('/remove-all', authMiddleware, BasketController.removeAllBasket);

/**
 * @openapi
 * /api/basket/remove-product:
 *   delete:
 *     summary: Удалить товар из корзины полностью
 *     description: Требуется cookie sessionId. Удаляет все единицы указанного товара.
 *     tags:
 *       - Basket
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 101
 *     responses:
 *       200:
 *         description: Товар удалён из корзины, возвращена обновлённая корзина
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Basket"
 *       400:
 *         description: product not found (productId не передан или некорректен)
 *       401:
 *         description: Сессия недействительна
 *       500:
 *         description: Внутренняя ошибка сервера
 */
basketRouter.delete('/remove-product', authMiddleware, BasketController.removeProduct);

export { basketRouter };
