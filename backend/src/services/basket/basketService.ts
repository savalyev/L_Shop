import { BasketDB } from '../../database/basketDB';
import { Basket } from '../../models/Basketmodels';

export class BasketService{
    public static GetBasketUserId(userId: number):Basket|undefined{
        return BasketDB.GetBasketUserId(userId);
    }

    public static AddToBasket(userId: number,productId: number):Basket{
        return BasketDB.AddtoBasket(userId,productId);
    }

    public static RemoveFromBasket(userId: number, productId: number): Basket{
        return BasketDB.RemoveFromBasket(userId,productId);
    }

    public static RemoveAllBasket(userId: number): Basket{
        return BasketDB.RemoveAllBasket(userId);
    }

    public static RemoveProductFromBasket(userId: number, productId: number): Basket{
        return BasketDB.RemoveProductBasket(userId,productId);
    }
}