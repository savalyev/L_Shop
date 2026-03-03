import express from 'express';
import { Basket } from '../models/Basketmodels';
import * as fs from 'fs';
import * as path from 'path';

export class BasketDB{
    public static GetBasketUserId(userId:number){
         const dbpath = path.join(__dirname,'basket.json');
            const file = fs.readFileSync(dbpath,'utf8');
            const allbasket: Basket[] = JSON.parse(file);
            const userbasket = allbasket.find(b=>String(b.userId)===String(userId));
            return userbasket;
    }
}