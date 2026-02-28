import { Request, Response } from "express";
import { AuthService } from "../../services/users/authService";
import { generateSessionId } from "../../services/users/authService";
import { UsersService } from "../../services/users/usersService";
import { error } from "node:console";

export class authController{
    static register(req:Request, res: Response){
        try {
            const {name, email, phone, password } = req.body;

            if (!name || typeof name !== 'string' || name.trim() === '') {
                return res.status(400).json({ error: 'Name is required' });
            }

            
            if (!password || typeof password !== 'string' || password.trim() === '') {
                return res.status(400).json({ error: 'Password is required' });
            }

            const user = AuthService.register({
                name: name.trim(),
                password,
                email: email || '',
                phone: phone || "",
            });

            const sessionId = generateSessionId()
            UsersService.updateSession(user.id, sessionId);

            res.cookie('sessionId', sessionId, {
                httpOnly: true,
                maxAge: 10*60*1000,
                sameSite: 'lax',
            });

            return res.status(201).json({data: user});
            
        } catch(err){
            return res.status(400).json({error: "Пользователь не найден"});
        }
    }

    static login(req: Request, res: Response){
        try{
            const {name, password} = req.body;

            if (!name || typeof name !== 'string' || name.trim() === '') {
                return res.status(400).json({ error: 'Name is required' });
            }
            if (!password || typeof password !== 'string' || password.trim() === '') {
                return res.status(400).json({ error: 'Password is required' });
            }

            const user = AuthService.login({
                name: name.trim(),
                password: password
            });

            const sessionId = generateSessionId();
            UsersService.updateSession(user.id, sessionId);

            res.cookie('sessionId', sessionId, {
                httpOnly: true,
                maxAge: 10*60*1000,
                sameSite: 'lax',
            });

            return res.status(201).json({data: user});
        } catch(err){
            return res.status(400).json({error: err});
        }
    }
}