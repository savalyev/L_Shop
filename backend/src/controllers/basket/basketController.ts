import { Request,Response } from "express";
import { Basket } from '../../models/Basketmodels';
import { BasketService } from '../../services/basket/basketService';
import * as fs from 'fs';
import * as path from 'path';


export class BasketController{
    public static async  GetBasket(req: Request, res: Response): Promise<void>{
        try{
            const userId = req.params.userId;
            if(!userId){
                res.status(400).send({error:"userId не указан"});
                return;
            }
            const userbasket = await BasketService.GetBasketUserId(Number(userId));
            if(!userbasket){
                res.status(404).send({error:'not found'});
                return;
            }
            res.status(200).send(userbasket);
        }
        catch(err){
            res.status(404).send({error:"not found BasketController"})
        }
    }
}

