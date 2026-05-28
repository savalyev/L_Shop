import { Request, Response } from 'express';
import { RolesService } from '../../services/users/rolesService';
import { UsersService } from '../../services/users/usersService';

export class RolesController {
    static async grantManager(req: Request, res: Response) {
        const { userId } = req.body;
        if (!userId) {
            res.status(400).json({ error: 'userId required' });
            return;
        }
        const user = UsersService.getById(Number(userId));
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        const updated = RolesService.setRole(user.id, 'manager');
        res.json({ message: 'Manager role granted', user: updated });
    }

    static async revokeManager(req: Request, res: Response) {
        const { userId } = req.body;
        if (!userId) {
            res.status(400).json({ error: 'userId required' });
            return;
        }
        const user = UsersService.getById(Number(userId));
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        const updated = RolesService.setRole(user.id, 'user');
        res.json({ message: 'Manager role revoked', user: updated });
    }

    static async getAllUsers(req: Request, res: Response) {
        const users = UsersService.getAll();
        res.json(users);
    }
}