import { Request, Response } from "express";
import { AuthService } from "../../services/users/authService";
import { generateSessionId } from "../../services/users/authService";
import { UsersService } from "../../services/users/usersService";
import { DeliveryDB } from "../../database/deliveryDB";
import { AuthError } from "../../services/users/authService";



export class AuthController {
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
                secure: true
            });

            const { password: _password, sessionId: _sessionId, ...safeUser } = user;

            res.status(201).json({ data: safeUser });

        } catch (err) {
            if (err instanceof AuthError) {
                res.status(401).json({ error: err.message });
            } else {
                console.error(err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
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


            const sessionId = generateSessionId();
            UsersService.updateSession(user.id, sessionId);

            res.cookie('sessionId', sessionId, {
                httpOnly: true,
                maxAge: 10 * 60 * 1000,
                sameSite: 'lax',
                secure: true
            });

            DeliveryDB.updateDelivery();

            const { password: _password, sessionId: _sessionId, ...safeUser } = user;

            res.status(200).json({ data: safeUser });

        } catch (err) {
            if (err instanceof AuthError) {
                res.status(401).json({ error: err.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
            return;
        }
    }

    static logout(req: Request, res: Response): void {
        const sessionId = req.cookies.sessionId;

        if (typeof sessionId !== 'string' || !sessionId) {
            res.status(400).json({ error: "Invalid session" });
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