import { Request, Response } from "express";
import { BasketService } from '../../services/basket/basketService';

export class BasketController {

    public static async getBasket(req: Request, res: Response): Promise<void> {
        try {

            const user = res.locals.user;

            const userbasket = await BasketService.GetBasketUserId(Number(user?.id));

            if (!userbasket) {
                res.status(404).send({ error: 'Корзина пользователя не найдена' });
                return;
            }

            res.status(200).send(userbasket);
        }
        catch (err) {
            res.status(500).send({ error: "Ошибка корзины" })
        }
    }

    public static async addToBasket(req: Request, res: Response): Promise<void> {
        try {

            const user = res.locals.user;

            const productId = Number(req.body.productId);

            if (!productId) {
                res.status(404).send({ error: "Товар не найден" });
                return;
            }

            const userbasket = await BasketService.AddToBasket(Number(user?.id), productId);

            res.status(201).send({ userbasket });
        }
        catch (err) {
            res.status(500).send({ error: err });
        }
    }

    public static removeFromBasket(req: Request, res: Response): void {
        try {

            const user = res.locals.user;

            const productId = Number(req.body.productId);

            if (!productId) {
                res.status(404).send({ error: "product not found" });
            }

            const userbasket = BasketService.RemoveFromBasket(Number(user?.id), productId);

            res.status(200).send(userbasket);
        }
        catch (err) {
            res.status(500).send({ error: err });
        }
    }

    public static removeProduct(req: Request, res: Response): void {
        try {

            const user = res.locals.user;

            const productId = Number(req.body.productId);

            if (!productId) {
                res.status(404).send({ error: "product not found" });
            }

            const userbasket = BasketService.RemoveProductFromBasket(Number(user?.id), productId);

            res.status(200).send(userbasket);
        }
        catch (err) {
            res.status(500).send({ error: err });
        }

    }

    public static removeAllBasket(req: Request, res: Response): void {
        try {

            const user = res.locals.user;

            const productId = Number(req.body.productId);

            if (!productId) {
                res.status(404).send({ error: "product not found" });
            }

            const userbasket = BasketService.RemoveAllBasket(Number(user?.id));

            res.status(200).send(userbasket);
        }
        catch (err) {
            res.status(500).send({ error: err });
        }

    }

}

