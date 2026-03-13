import { DeliveryDB } from "../../database/deliveryDB";
import { Delivery } from "../../models/model";
import { Address } from "../../models/model";

export class DeliveryService {

    public static createDelivery(userId: number, endAdress: Address): Delivery {
        return DeliveryDB.createDelivery(userId, endAdress);
    }

    public static removeDelivery(delId: number): Delivery[] {
        return DeliveryDB.removeDelivery(delId);
    }

    public static getDelivByUserId(userId: number): Delivery[] {
        return DeliveryDB.getDelivByUserId(userId);
    }
}