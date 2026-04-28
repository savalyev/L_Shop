import { Request, Response, NextFunction } from 'express';
import { User } from '../models/model';

type UserCreateBody = Omit<User, "id">;

/**
 * Middleware для проверки и очистки данных при регистрации (создании) нового пользователя.
 * Проверяет наличие всех обязательных полей (name, password, email, phone) 
 * и убеждается, что они не состоят из одних пробелов.
 * В случае ошибки возвращает статус 400 (Bad Request).
 * В случае успеха очищает строки от пробелов по краям (санитизация) и передает данные дальше.
 *
 * @param {Request<{}, any, Partial<UserCreateBody>>} req - Объект запроса Express.
 * @param {Response} res - Объект ответа Express.
 * @param {NextFunction} next - Функция для перехода к следующему обработчику.
 */
export function validateUserCreate(
    req: Request<{}, any, Partial<UserCreateBody>>,
    res: Response,
    next: NextFunction
): void {
    const body = req.body || {};

    // Валидация имени (name)
    if (typeof body.name !== 'string' || body.name.trim() === '') {
        res.status(400).json({ error: "Поле 'name' обязательно и не должно быть пустым" });
        return;
    }

    // Валидация пароля (password)
    if (typeof body.password !== 'string' || body.password.trim() === "") {
        res.status(400).json({ error: "Поле 'password' обязательно и не должно быть пустым" });
        return;
    }

    // Валидация электронной почты (email)
    if (typeof body.email !== 'string' || body.email.trim() === "") {
        res.status(400).json({ error: "Поле 'email' обязательно и не должно быть пустым" });
        return;
    }

    // Валидация телефона (phone)
    if (typeof body.phone !== 'string' || body.phone.trim() === "") {
        res.status(400).json({ error: "Поле 'phone' обязательно и не должно быть пустым" });
        return;
    }

    // Санитизация (очистка) данных
    // Удаляем лишние пробелы по краям, чтобы в БД не попали имена вроде " Иван  "
    req.body = {
        ...body,
        name: body.name.trim(),
        password: body.password.trim(),
        email: body.email.trim(),
        phone: body.phone.trim()
    };

    // Передаем управление следующему обработчику (контроллеру)
    next();
}