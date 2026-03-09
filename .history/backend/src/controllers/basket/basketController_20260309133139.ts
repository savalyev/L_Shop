import { Request, Response } from "express";
import { BasketService } from '../../services/basket/basketService';
import { Basket } from '../../models/Basketmodels';

export class BasketController {
    public static async GetBasket(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.userId;
            if (!userId) {
                res.status(400).send({ error: "Обязательный параметр userId не указан" });
                return;
            }
            const userbasket = await BasketService.GetBasketUserId(Number(userId));
            if (!userbasket) {
                res.status(404).send({ error: 'Корзина пользователя не найдена' });
                return;
            }
            res.status(200).send(userbasket);
        }
        catch (err) {
            res.status(404).send({ error: "Ошибка корзины" })
        }
    }

    public static async AddToBasket(req: Request, res: Response):Promise<Basket|undefined>{
        try{
            const userId = req.body.userId;

            if(!userId){
                res.status(400).send({error: "Пользователь не найден"});
                return;
            }

            const productId = req.body.productId;

            if(!productId){
                res.status(400).send({error: "Товар не найден"});
                return;
            }

            const userbasket  = await BasketService.AddToBasket(userId,productId);
            
            return userbasket;
        }
        catch(err){
            res.status(404).send({error: "Ошибка корзиные"});
        }
    }

}

