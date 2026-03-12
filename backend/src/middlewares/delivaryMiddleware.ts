import { Request, Response, NextFunction } from "express";
import { DeliveryService } from "../services/delivary/delivaryService";
import { UsersService } from '../services/users/usersService';


export class DelivaryMiddle {
    public static CreateDelivary(req: Request, res: Response, next: NextFunction): void {
        const sessionId = req.cookies.sessionId;

        const user = UsersService.getBySessionId(sessionId);

        if (!user) {
            res.status(404).send({ error: "user not verificate" });
            return;
        }

        const addres = req.body.Address;

        if(!addres){
            res.status(404).send({error:"address not found"});
            return;
        }

        const delivary = DeliveryService.CreateDelivary(user.id, addres);

        if(!delivary){
            res.status(404).send({error:"user dont have delivary obj"});
            return;
        }

        res.locals.delivary = delivary;
        next();
    }

        public static RemoveDelivary(req: Request, res: Response, next: NextFunction): void {
        const sessionId = req.cookies.sessionId;

        const user = UsersService.getBySessionId(sessionId);

        if (!user) {
            res.status(404).send({ error: "user not verificate" });
            return;
        }

        const delId = req.body.deliveryId;

        if(!delId){
            res.status(400).send({error:"deliv not found"});
        }

        const delivary = DeliveryService.RemoveDelivary(delId);

        if(!delivary){
            res.status(404).send({error:"user dont have delivary obj"});
            return;
        }

        res.locals.delivary = delivary;
        next();
    }

    public static GetDelivByUserId(req: Request, res: Response, next: NextFunction): void{

        const sessionId = req.cookies.sessionId;

        const user = UsersService.getBySessionId(sessionId);

        if(!user){
            res.status(400).send({error:"user not verificate"});
            return;
        }

        const userdeliveres = DeliveryService.GetDelivByUserId(user.id);

        if(!userdeliveres){
            res.status(400).send({error:"user havent delivs"});
            return;
        }

        res.locals.userdeliveres = userdeliveres;

        next();
    }
}