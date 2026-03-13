import { Request, Response } from "express";
import { BasketService } from '../../services/basket/basketService';

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
            res.status(500).send({ error: "Ошибка корзины" })
        }
    }

    public static async AddToBasket(req: Request, res: Response): Promise<void> {
        try {
            const userId = Number(req.body.userId);

            if (!userId) {
                res.status(404).send({ error: "Пользователь не найден" });
                return;
            }

            const productId = Number(req.body.productId);

            if (!productId) {
                res.status(404).send({ error: "Товар не найден" });
                return;
            }

            const userbasket = await BasketService.AddToBasket(userId, productId);

            res.status(201).send({ userbasket });
        }
        catch (err) {
            res.status(500).send({ error: err });
        }
    }

    public static RemoveFromBasket(req: Request, res: Response): void {
        try {
            const userId = Number(req.body.userId);

            if (!userId) {
                res.status(404).send({ error: "user not found" });
                return;
            }

            const productId = Number(req.body.productId);

            if (!productId) {
                res.status(404).send({ error: "product not found" });
            }

            const userbasket = BasketService.RemoveFromBasket(userId, productId);

            res.status(200).send(userbasket);
        }
        catch (err) {
            res.status(500).send({ error: err });
        }
    }

    public static RemoveProductFromBasket(req: Request, res: Response): void {
        try {
            const userId = Number(req.body.userId);

            if (!userId) {
                res.status(404).send({ error: "user not found" });
                return;
            }

            const productId = Number(req.body.productId);

            if (!productId) {
                res.status(404).send({ error: "product not found" });
            }

            const userbasket = BasketService.RemoveProductFromBasket(userId, productId);

            res.status(200).send(userbasket);
        }
        catch (err) {
            res.status(500).send({ error: err });
        }

    }

    public static RemoveAllBasket(req: Request, res: Response): void {
        try {
            const userId = Number(req.body.userId);

            if (!userId) {
                res.status(404).send({ error: "user not found" });
                return;
            }

            const productId = Number(req.body.productId);

            if (!productId) {
                res.status(404).send({ error: "product not found" });
            }

            const userbasket = BasketService.RemoveAllBasket(userId);

            res.status(200).send(userbasket);
        }
        catch (err) {
            res.status(500).send({ error: err });
        }

    }

}

