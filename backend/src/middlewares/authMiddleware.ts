import { Request, Response } from "express";
import { NextFunction } from "express";
import { UsersService } from "../services/users/usersService";

function authMiddleware(req: Request, res: Response, next: NextFunction): void{
    const sessionId = req.cookies.sessionId;
    
    if(!sessionId){
        res.status(400).json({error: 'Not auth'});
        return;
    }

    const user = UsersService.getBySessionId(sessionId);

    if(!user){
        res.status(401).json({error: "Invalid session"});
        return;
    }

    res.locals.user = user;

    next();
}

export {authMiddleware};