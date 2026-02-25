import { ProductDb } from "../../database/productsDB";
import { Product } from "../../models/model";
import { ProductCreateBody } from "../../models/model";

export class ProductsService {
    static getAll(){
        return ProductDb.getAll();
    }

    static getById(id: number){
        return ProductDb.getById(id);
    }

    static create(item: ProductCreateBody): Product{
        return ProductDb.create(item);
    }
}