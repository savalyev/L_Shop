import { Request,Response,NextFunction } from 'express';
import { UsersService } from '../services/users/usersService';
import { BasketService } from '../services/basket/basketService';
import cookieParser from 'cookie-parser';


export class MiddleBasket{
    public static validateBasket(req:Request,res:Response,next:NextFunction){
        const sessionId = req.cookies.sessionId;

        const user = UsersService.getBySessionId(sessionId);
        if(!user){
            return res.status(400).send({error:"user not verificate"});
        }
        const basket = BasketService.GetBasketUserId(user.id);
        if(!basket){
            return res.status(400).send({error:"basket is clear"});
        }
        res.locals.basket=basket;
        next();
    }

    public static async addToBasket(req:Request, res:Response, next: NextFunction){
        const sessionId = req.cookies.sessionId;

        const user = UsersService.getBySessionId(sessionId);
        if(!user){
            return res.status(400).send({error:"user not verificate"});
        }

        const product = req.body.productId;
        if(!product){
            return res.status(400).send("product not found");
        }
        
        const basket = await BasketService.AddToBasket(user.id, product)
        res.locals.basket=basket;
        next();
    }
}