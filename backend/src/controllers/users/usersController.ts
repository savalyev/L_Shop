import { Request, Response } from "express";
import { UsersService } from "../../services/users/usersService";
import { User } from "../../models/model";
import { error } from "node:console";

type UserCreateBody = Omit<User, 'id'>;

export class UsersController{
    static getAll(req: Request, res: Response){
        const data = UsersService.getAll();
        res.send({data});
    }

    static getById(req: Request, res: Response){
        const idParam = req.params.id;
        const id = Number(idParam);

        if(Number.isNaN(id)){
            return res.status(400).send({error: "Invalid id"});
        }

        const item = UsersService.getById(id);
        if(!item){
            return res.status(400).send({error: "Not found"});
        }

        res.send({data: item});
    }

    static getByName(req: Request, res: Response) {
        const name = req.query.name;

        if (typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: 'Query-параметр "name" обязателен' });
        }

        const user = UsersService.getByName(name);

        if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден' });
        }

        return res.json({ data: user });
    }

    static create(req: Request<{}, any, Partial<UserCreateBody>>, res: Response){
        const body = req.body as UserCreateBody;

        const newItem = UsersService.create(body);
        return res.status(200).json({data: newItem});
    }
}