import { DeliveryDB } from "../../database/deliveryDB";
import { Delivery } from "../../models/model";
import { Address } from "../../models/model";

export class DeliveryService{
    public static CreateDelivary(userId: number, endAdress: Address): Delivery{
        return DeliveryDB.CreateDelivety(userId, endAdress);
    }

    public static RemoveDelivary(delId: number): Delivery[]{
        return DeliveryDB.RemoveDelivary(delId);
    }

    public static GetDelivByUserId(userId: number): Delivery[]{
        return DeliveryDB.GetDelivByUserId(userId);
    }
}