import { Basket } from '../models/Basketmodels';
import * as fs from 'fs';
import * as path from 'path';

const filePath = path.resolve(__dirname, 'basket.json');

export class BasketDB{
    public static GetBasketUserId(userId:number){
            const file = fs.readFileSync(filePath, 'utf8');

            const allbasket: Basket[] = JSON.parse(file);

            const userbasket = allbasket.find(b=>String(b.userId)===String(userId));
            
            return userbasket;
    }
}