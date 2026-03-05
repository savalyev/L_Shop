import cookieParser from "cookie-parser";
import { Request, Response } from "express";
import { NextFunction } from "express";
import { error } from "node:console";
import { UsersService } from "../services/users/usersService";

function authMiddleware(req: Request, res: Response, next: NextFunction){
    const sessionId = req.cookies.sessionId;
    
    if(!sessionId){
        return res.status(400).json({error: 'Not auth'});
    }

    const user = UsersService.getBySessionId(sessionId);

    if(!user){
        return res.status(401).json({error: "Invalid session"})
    }

    res.locals.user = user;

    next();
}

export {authMiddleware};