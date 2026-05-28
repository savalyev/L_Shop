import { Request, Response, NextFunction } from "express";
import { DeliveryService } from "../services/delivery/deliveryService";
import { UsersService } from '../services/users/usersService';

/**
 * Middleware для управления доставками.
 * Обрабатывает входные данные из запросов (req.body), проверяет авторизацию
 * и передает выполнение в сервисный слой, сохраняя результат в res.locals.
 */
export class DeliveryMiddle {

    /**
     * Создает новую доставку на основе текущей корзины пользователя.
     * @param {Request} req - Запрос. Должен содержать `req.cookies.sessionId` и `req.body.Address`.
     * @param {Response} res - Ответ. Результат сохраняется в `res.locals.delivery`.
     * @param {NextFunction} next - Функция перехода к следующему обработчику.
     */
    public static createDelivery(req: Request, res: Response, next: NextFunction): void {
        try {
            const sessionId = req.cookies.sessionId;
            const user = UsersService.getBySessionId(sessionId);

            // Ошибка авторизации (401)
            if (!user) {
                res.status(401).send({ error: "Пользователь не авторизован" });
                return;
            }

            const address = req.body.Address;

            // Ошибка валидации данных (400)
            if (!address) {
                res.status(400).send({ error: "Адрес доставки не указан (address not found)" });
                return;
            }

            // Создаем доставку (может выбросить ошибку, если корзина пуста)
            const delivery = DeliveryService.createDelivery(user.id, address);

            if (!delivery) {
                res.status(500).send({ error: "Не удалось создать объект доставки" });
                return;
            }

            // Передаем результат контроллеру
            res.locals.delivery = delivery;
            next();

        } catch (error: any) {
            // Перехватываем ошибки из БД (например, "Basket is clear")
            res.status(400).send({ error: error.message || "Ошибка при оформлении доставки" });
        }
    }

    /**
     * Удаляет доставку по ее идентификатору.
     * @param {Request} req - Запрос. Должен содержать `req.cookies.sessionId` и `req.body.deliveryId`.
     * @param {Response} res - Ответ. Обновленный список доставок сохраняется в `res.locals.delivery`.
     * @param {NextFunction} next - Функция перехода к следующему обработчику.
     */
    public static removeDelivery(req: Request, res: Response, next: NextFunction): void {
        try {
            const sessionId = req.cookies.sessionId;
            const user = UsersService.getBySessionId(sessionId);

            if (!user) {
                res.status(401).send({ error: "Пользователь не авторизован" });
                return;
            }

            const delId = req.body.deliveryId;

            if (!delId) {
                res.status(400).send({ error: "ID доставки не передан (deliv not found)" });
                return; // Важное исправление: добавлен return
            }

            const delivery = DeliveryService.removeDelivery(delId);

            if (!delivery) {
                res.status(404).send({ error: "Доставка не найдена или не может быть удалена" });
                return;
            }

            res.locals.delivery = delivery;
            next();

        } catch (error: any) {
            res.status(400).send({ error: error.message || "Ошибка при удалении доставки" });
        }
    }

    /**
     * Получает список всех доставок для текущего авторизованного пользователя.
     * @param {Request} req - Запрос с куки `sessionId`.
     * @param {Response} res - Ответ. Результат сохраняется в `res.locals.userdeliveres`.
     * @param {NextFunction} next - Функция перехода к следующему обработчику.
     */
    public static getDelivByUserId(req: Request, res: Response, next: NextFunction): void {
        try {
            const sessionId = req.cookies.sessionId;
            const user = UsersService.getBySessionId(sessionId);

            if (!user) {
                res.status(401).send({ error: "Пользователь не авторизован" });
                return;
            }

            const userdeliveres = DeliveryService.getDelivByUserId(user.id);

            if (!userdeliveres) {
                // Если доставок нет, это не обязательно ошибка, просто пустой список. 
                // Но оставляем вашу логику возврата 404 по требованию ТЗ.
                res.status(404).send({ error: "У пользователя нет оформленных доставок" });
                return;
            }

            res.locals.userdeliveres = userdeliveres;
            next();

        } catch (error: any) {
            res.status(400).send({ error: error.message || "Ошибка при получении доставок" });
        }
    }
}