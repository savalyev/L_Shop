import { BasketDB } from '../../database/basketDB';

export class BasketService{
    public static GetBasketUserId(userId: number){
        return BasketDB.GetBasketUserId(userId);
    }

    public static AddToBasket(userId: number,productId: number){
        return BasketDB.AddtoBasket(userId,productId);
    }
}