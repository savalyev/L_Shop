import { Request, Response, NextFunction } from 'express';
import { User } from '../models/model';

type UserCreateBody = Omit<User, "id">;

export function validateUserCreate(
    req: Request<{}, any, Partial<UserCreateBody>>,
    res: Response,
    next: NextFunction
){
    const body = req.body || {};

    //name
    if(typeof body.name !== 'string' || body.name.trim() === ''){
        return res.status(400).json({error: "Поле name обязательно"});
    }

    //password
    if(typeof body.password !== 'string' || body.password.trim() === ""){
        return res.status(400).json({error: "Поле password обязательно"});
    }

    req.body = {
        ...body,
        name: body.name.trim(),
        password: body.password.trim(),
    };

    return next();
}