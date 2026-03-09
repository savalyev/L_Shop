import {Product} from './model'

export interface Basket{
    id: number;
    userId: number | string;
    basket: BasketProducts[];
}

interface BasketProducts{
    count: number;
    products: Product;
}
