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

    static getByName(name: string){
        return ProductDb.getByName(name);
    }

    static getByDescription(description: string){
        return ProductDb.getByDescription(description);
    }

    static getAllAscending(){
        return ProductDb.getAllAscending();
    }

    static  getAllDescending(){
        return ProductDb.getAllDescending();
    }

    static getAllFiltered(options: {
        category?: string;
        isAvailable?: boolean;
        minPrice?: number;
        maxPrice?: number;}){
        return ProductDb.getAllFiltered(options);
    }

    static create(item: ProductCreateBody): Product{
        return ProductDb.create(item);
    }
}