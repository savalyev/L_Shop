import { BasketDB } from '../../database/basketDB';
import { Basket } from '../../models/Basketmodels';

export class BasketService{
    public static GetBasketUserId(userId: number):Basket|undefined{
        return BasketDB.GetBasketUserId(userId);
    }

    public static AddToBasket(userId: number,productId: number):Promise<Basket>{
        return BasketDB.AddtoBasket(userId,productId);
    }
}