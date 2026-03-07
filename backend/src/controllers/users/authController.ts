import { Request, Response } from "express";
import { AuthService } from "../../services/users/authService";
import { generateSessionId } from "../../services/users/authService";
import { UsersService } from "../../services/users/usersService";
import { error } from "node:console";

export class authController {
    static register(req: Request, res: Response): void {
        try {
            const { name, email, phone, password } = req.body;

            if (!name || typeof name !== 'string' || name.trim() === '') {
                res.status(400).json({ error: 'Name is required' });
                return;
            }


            if (!password || typeof password !== 'string' || password.trim() === '') {
                res.status(400).json({ error: 'Password is required' });
                return;
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
                maxAge: 10 * 60 * 1000,
                sameSite: 'lax',
            });

            res.status(201).json({ data: user });

        } catch (err) {
            res.status(400).json({ error: "Пользователь не найден" });
            return;
        }
    }

    static login(req: Request, res: Response): void {
        try {
            const { login, password } = req.body;

            if (!login || typeof login !== 'string' || login.trim() === '') {
                res.status(400).json({ error: 'Name is required' });
                return;
            }
            if (!password || typeof password !== 'string' || password.trim() === '') {
                res.status(400).json({ error: 'Password is required' });
                return;
            }

            const user = AuthService.login({
                name: login.trim(),
                password: password
            });

            if(!user){
                res.status(400).json({error: "Пользователь не найден"});
                return;
            }

            const sessionId = generateSessionId();
            UsersService.updateSession(user.id, sessionId);

            res.cookie('sessionId', sessionId, {
                httpOnly: true,
                maxAge: 10 * 60 * 1000,
                sameSite: 'lax',
            });

            res.status(201).json({ data: user });

        } catch (err) {
            res.status(400).json({ error: err });
            return;
        }
    }

    static logout(req: Request, res: Response): void {
        const sessionId = req.cookies.sessionId;

        if(typeof sessionId !== 'string' || !sessionId){
            res.status(400).json({error: "Invalid session"});
            return;
        }

        if (sessionId) {
            AuthService.logout(sessionId);
        }

        res.clearCookie('sessionId', {
            httpOnly: true,
            maxAge: 0,
            sameSite: 'lax'
        });

        res.status(200).json({ message: 'logout выполнен' });
    }
}