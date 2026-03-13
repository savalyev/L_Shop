import { Request, Response, NextFunction } from "express";
import { DeliveryService } from "../services/delivery/deliveryService";
import { UsersService } from '../services/users/usersService';


export class DeliveryMiddle {

    public static createDelivery(req: Request, res: Response, next: NextFunction): void {
        const sessionId = req.cookies.sessionId;

        const user = UsersService.getBySessionId(sessionId);

        if (!user) {
            res.status(404).send({ error: "user not verificate" });
            return;
        }

        const addres = req.body.Address;

        if (!addres) {
            res.status(404).send({ error: "address not found" });
            return;
        }

        const delivery = DeliveryService.createDelivery(user.id, addres);

        if (!delivery) {
            res.status(404).send({ error: "user dont have delivery obj" });
            return;
        }

        res.locals.delivery = delivery;
        next();
    }

    public static removeDelivery(req: Request, res: Response, next: NextFunction): void {
        const sessionId = req.cookies.sessionId;

        const user = UsersService.getBySessionId(sessionId);

        if (!user) {
            res.status(404).send({ error: "user not verificate" });
            return;
        }

        const delId = req.body.deliveryId;

        if (!delId) {
            res.status(404).send({ error: "deliv not found" });
        }

        const delivery = DeliveryService.removeDelivery(delId);

        if (!delivery) {
            res.status(404).send({ error: "user dont have delivery obj" });
            return;
        }

        res.locals.delivery = delivery;
        next();
    }

    public static getDelivByUserId(req: Request, res: Response, next: NextFunction): void {

        const sessionId = req.cookies.sessionId;

        const user = UsersService.getBySessionId(sessionId);

        if (!user) {
            res.status(404).send({ error: "user not verificate" });
            return;
        }

        const userdeliveres = DeliveryService.getDelivByUserId(user.id);

        if (!userdeliveres) {
            res.status(404).send({ error: "user havent delivs" });
            return;
        }

        res.locals.userdeliveres = userdeliveres;

        next();
    }
}