import { Basket } from '../models/Basketmodels';
import { Product } from '../models/model';
import * as fs from 'fs';
import * as path from 'path';

const filePath = path.resolve(__dirname, 'basket.json');
const filePathProduct = path.resolve(__dirname, 'products.json');

function getData(): Basket[] {
    const file = fs.readFileSync(filePath, 'utf-8');

    const allbasket: Basket[] = JSON.parse(file);

    return allbasket;
}

function getDataProduct(): Product[] {
    const file = fs.readFileSync(filePathProduct, 'utf-8');

    const allproducts: Product[] = JSON.parse(file);

    return allproducts;
}

export class BasketDB {

    public static GetBasketUserId(userId: number):Basket|undefined {

        const allbasket: Basket[] = getData();

        const userbasket = allbasket.find(b => String(b.userId) === String(userId));

        return userbasket;
    }

    private static CreatBasket(userId: number): Basket {
        const allbasket: Basket[] = getData();

        let maxId:number = allbasket.length + 1;

        const userBasket: Basket = {
            id: maxId,
            userId: userId,
            basket: []
        };

        allbasket.push(userBasket);
        fs.writeFileSync(filePath, JSON.stringify(allbasket, null, 2));

        return userBasket;
    }


    public static async AddtoBasket(userId: number, productId: number):Promise<Basket> {

        let userbasket:Basket | undefined = this.GetBasketUserId(userId);

        if (!userbasket) {
            userbasket = this.CreatBasket(userId);
        }

        const allproduct: Product[] = getDataProduct();
        let product:Product | undefined = allproduct.find(product => product.id === productId);

        if (!product) {
            throw new Error("Product not found");
        }

        const existproduct = userbasket.basket.find(prod => prod.products?.id === product.id);

        if (existproduct) {
            existproduct.count += 1;
        }
        else {

            const BasketProduct = {
                count: 1,
                products: product
            }

            userbasket.basket.push(BasketProduct);
        }

        const allbasket: Basket[] = getData();
        const index = allbasket.findIndex(basket => String(basket.userId) === String(userId));

        if (index !== -1) {
            allbasket[index] = userbasket;
        }
        else {
            allbasket.push(userbasket);
        }

        fs.writeFileSync(filePath, JSON.stringify(allbasket, null, 2));

        return userbasket;
    }
}