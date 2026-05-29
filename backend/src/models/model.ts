import { Basket } from '../models/Basketmodels';

export interface User {
    id: number;
    name: string;
    password: string;
    email?: string;
    phone?: string;
    sessionId?: string;
    role?: 'user' | 'manager' | 'admin';
}

export type Address = {
    country?: string;
    town?: string;
    street?: string;
    houseNumber?: string;
}

export interface Product{
    id: number;
    title: string;
    price: number;
    isAvailable: boolean;
    description: string;
    categories: string[];
    images: {
        preview: string;
        gallery?: string[];
    };
    delivery?:{
        startTown: Address;
        earlyDate: Date;
        price: number;
    };
    discount: number;

}

export interface Delivery{
    id: number,
    endadress: Address;
    endDate: Date;
    basket:Basket;
    cost: number;
}

export interface Comment {
  id: number;
  productId: number;
  userId: number;
  userName: string;
  rating: number;
  text: string;
  date: string;
}

export type ProductCreateBody = Omit<Product, 'id'>;
export type UserCreateBody = Omit<User, 'id'>;