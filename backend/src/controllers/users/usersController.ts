import { Request, Response } from "express";
import { UsersService } from "../../services/users/usersService";
import { UserCreateBody } from "../../models/model";


export class UsersController {

    static getAll(req: Request, res: Response): void {
        const data = UsersService.getAll();
        res.send({ data });
    }

    static getById(req: Request, res: Response): void {
        const idParam = req.params.id;
        const id = Number(idParam);

        if (Number.isNaN(id)) {
            res.status(400).send({ error: "Invalid id" });
            return;
        }

        const item = UsersService.getById(id);

        if (!item) {
            res.status(404).send({ error: "Not found" });
            return;
        }

        res.send({ data: item });
    }

    static getByName(req: Request, res: Response): void {
        const name = req.query.name;

        if (typeof name !== 'string' || name.trim() === '') {
            res.status(400).json({ error: 'Query-параметр "name" обязателен' });
            return;
        }

        const user = UsersService.getByName(name);

        if (!user) {
            res.status(404).json({ error: 'Пользователь не найден' });
            return;
        }

        res.json({ data: user });
    }
}