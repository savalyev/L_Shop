import { Request, Response, NextFunction } from "express";
import { UsersService } from "../services/users/usersService";

/**
 * Middleware (промежуточный слой) для проверки авторизации пользователя.
 * Проверяет наличие cookie `sessionId` и ищет пользователя по этой сессии в БД.
 * Если пользователь найден, сохраняет его данные в `res.locals.user` для дальнейшего использования в роутах.
 * 
 * @param {Request} req - Объект запроса (должен содержать `req.cookies`).
 * @param {Response} res - Объект ответа Express.
 * @param {NextFunction} next - Функция для передачи управления следующему обработчику.
 */
function authMiddleware(req: Request, res: Response, next: NextFunction): void {
    const sessionId = req.cookies.sessionId;
    
    // Если куки нет, пользователь вообще не вошел в систему
    if (!sessionId) {
        res.status(401).json({ error: 'Не авторизован (отсутствует токен сессии)' });
        return;
    }

    // Ищем пользователя по сессии
    const user = UsersService.getBySessionId(sessionId);

    // Если кука есть, но такого пользователя нет (сессия устарела или удалена)
    if (!user) {
        // Заставляем браузер клиента удалить недействительную куку
        res.clearCookie('sessionId');
        res.status(401).json({ error: "Недействительная сессия. Пожалуйста, войдите снова." });
        return;
    }

    // Сохраняем данные пользователя в локальные переменные ответа (res.locals).
    // Теперь любой контроллер после этого middleware сможет получить к ним доступ.
    res.locals.user = user;

    // Передаем управление следующему обработчику (контроллеру)
    next();
}

export { authMiddleware };