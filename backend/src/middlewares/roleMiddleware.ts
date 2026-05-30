import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../services/users/usersService';

/**

- Фабрика middleware для проверки роли пользователя.
- Проверяет сессию и убеждается, что роль пользователя входит в разрешённый список.
- 
- @param {string[]} roles - Массив допустимых ролей (например, ['admin', 'manager']).
- @returns {(req: Request, res: Response, next: NextFunction) => void} Middleware-функция.
- 
- @example
- // Применить к маршруту, доступному только админам
- router.post('/admin-only', requireRole(['admin']), someHandler);
*/
export function requireRole(roles: string[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const sessionId = req.cookies.sessionId;
        if (!sessionId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const user = UsersService.getBySessionId(sessionId);
        if (!user) {
            res.status(401).json({ error: 'Invalid session' });
            return;
        }
        if (!roles.includes(user.role || 'user')) {
            res.status(403).json({ error: 'Forbidden: insufficient rights' });
            return;
        }
        res.locals.user = user;
        next();
    };
}