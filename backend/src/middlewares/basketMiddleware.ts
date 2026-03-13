import { Request,Response,NextFunction } from 'express';
import { UsersService } from '../services/users/usersService';
import { BasketService } from '../services/basket/basketService';


export class MiddleBasket{
    public static validateBasket(req:Request,res:Response,next:NextFunction):void{
        const sessionId = req.cookies.sessionId;

        const user = UsersService.getBySessionId(sessionId);
        if(!user){
            res.status(401).send({error:"user not verificate"});
            return;
        }
        const basket = BasketService.GetBasketUserId(user.id);
        if(!basket){
            res.status(400).send({error:"basket is clear"})
            return;
        }
        res.locals.basket=basket;
        next();
    }

    public static async addToBasket(req:Request, res:Response, next: NextFunction): Promise<void>{
        const sessionId = req.cookies.sessionId;

        const user = UsersService.getBySessionId(sessionId);
        if(!user){
            res.status(400).send({error:"user not verificate"});
            return;
        }

        const product = req.body.productId;
        if(!product){
            res.status(400).send("product not found");
            return;
        }
        
        const basket = await BasketService.AddToBasket(user.id, product)
        res.locals.basket=basket;
        next();
    }

    public static async RemoveFromBasket(req: Request, res: Response, next: NextFunction): Promise<void>{
        const sessionId = req.cookies.sessionId;

        const user = UsersService.getBySessionId(sessionId);

        if(!user){
            res.status(400).send({error:"user not verificate"});
            return;
        }

        const product = req.body.productId;

        if(!product){
            res.status(400).send({error:"product not found"});
            return;
        }

        const basket = await BasketService.RemoveFromBasket(user.id,product);
        res.locals.basket=basket;
        next();
    }

    public static async RemoveAllBasket(req: Request, res: Response, next: NextFunction): Promise<void>{
        const sessionId = req.cookies.sessionId;

        const user = UsersService.getBySessionId(sessionId);

        if(!user){
            res.status(400).send({error:"user not verificate"});
            return;
        }

        const basket = await BasketService.RemoveAllBasket(user.id);
        res.locals.basket=basket;
        next();
    }

        public static async RemoveProductFromBasket(req: Request, res: Response, next: NextFunction): Promise<void>{
        const sessionId = req.cookies.sessionId;

        const user = UsersService.getBySessionId(sessionId);

        if(!user){
            res.status(400).send({error:"user not verificate"});
            return;
        }

        const product = req.body.productId;

        if(!product){
            res.status(400).send({error:"product not found"});
            return;
        }

        const basket = await BasketService.RemoveProductFromBasket(user.id,product);
        res.locals.basket=basket;
        next();
    }
}