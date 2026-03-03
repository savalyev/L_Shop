import { Request,Response } from "express";
import { Basket } from '../../models/Basketmodels';
import * as fs from 'fs';
import * as path from 'path';


export class BasketController{
    public static async  GetBasket(req: Request, res: Response): Promise<void>{
        try{
            const userId = req.query.userId || req.params.userId;
        }
        catch(err){
            res.status(404).send({error:"not found"})
        }
    }
}

