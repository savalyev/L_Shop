import { BasketDB } from '../database/basketDB';
import { ProductDb } from '../database/productsDB';
import { Delivery, Address } from '../models/model';
import * as fs from 'fs';
import * as path from 'path';

const filepathDelivery = path.resolve(__dirname, 'delivery.json');

export class DeliveryDB {

    private static getAll(): Delivery[] {

        const file = fs.readFileSync(filepathDelivery, 'utf-8');

        const allDelivery: Delivery[] | undefined = JSON.parse(file);

        if (!allDelivery) {
            throw new Error("Error in delivert file");
        }

        return allDelivery;
    }

    public static getDelivByUserId(userId: number): Delivery[] {
        const alldelivery = this.getAll();

        const userdeliveres = alldelivery.filter(d => d.basket.userId === userId);

        if (!userdeliveres) {
            throw new Error("user haven`t delivereses");
        }

        return userdeliveres;
    }

    public static createDelivery(userId: number, endAdress: Address): Delivery {
        const userbasket = BasketDB.GetBasketUserId(userId);

        if (!userbasket) {
            throw new Error("Basket not found");
        }
        if (userbasket.basket.length === 0) {
            throw new Error("Basket is clear");
        }

        const allproduct = ProductDb.getAll();

        let cost: number = 0;
        for (const item of userbasket.basket) {

            const product = allproduct.find(p => Number(p.id) === Number(item.productId));

            if (product && product.delivery && product.delivery.price)
                cost += product.delivery.price;
        }

        let days: number = 1;

        for (const item of userbasket.basket) {

            const product = allproduct.find(p => Number(p.id) === Number(item.productId));

            for (let i: number = 0; i < allproduct.length; i++) {
                if (endAdress.town && product?.delivery?.startTown.town && endAdress.town.toLowerCase() === product?.delivery?.startTown.town.toLowerCase()) {
                    days = 1;
                }
                else if (endAdress.country && product?.delivery?.startTown.country && endAdress.country.toLowerCase() === product?.delivery?.startTown.country.toLowerCase()) {
                    days = (Math.random() * (3 - 1 + 1) + 1);
                }
                else {
                    days = (Math.random() * (15 - 6 + 1) + 1);
                }
            }
        }

        const alldelivery = this.getAll();

        let maxId: number;
        maxId = alldelivery.length + 1;

        const now = new Date();
        now.setDate(now.getDate() + days);

        const Delivery: Delivery = {
            id: maxId,
            endadress: endAdress,
            endDate: now,
            basket: userbasket,
            cost: cost
        }

        BasketDB.RemoveAllBasket(userId);

        alldelivery.push(Delivery);

        fs.writeFileSync(filepathDelivery, JSON.stringify(alldelivery, null, 2));

        return Delivery;
    }

    public static removeDelivery(delId: number): Delivery[] {
        const allDelivery = this.getAll();

        const delivery = allDelivery.filter(d => d.id !== delId);

        if (!delivery) {
            throw new Error("delivery obj not found");
        }

        if (allDelivery.length === delivery.length) {
            throw new Error("obj delivery wasnt del");
        }

        fs.writeFileSync(filepathDelivery, JSON.stringify(delivery, null, 2));

        return delivery;
    }

    public static updateDelivery() {
        const file = fs.readFileSync(filepathDelivery, 'utf-8');

        const alldelivery: Delivery[] = JSON.parse(file);

        let newdel: Delivery[];
        const Datenow = new Date();

        newdel = alldelivery.filter(d => Datenow < new Date(d.endDate));
        fs.writeFileSync(filepathDelivery, JSON.stringify(newdel, null, 2));
    }

}