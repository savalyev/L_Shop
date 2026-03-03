import express from 'express';
import { BasketDB } from '../../database/basketDB';

export class BasketService{
    public static GetBasketUserId(userId: number){
        return BasketDB.GetBasketUserId(userId);
    }
}