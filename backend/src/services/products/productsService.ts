import { ProductDb } from "../../database/productsDB";

export class ProductsService {
    static getAll(){
        return ProductDb.getAll();
    }

    static getById(id: number){
        return ProductDb.getById(id);
    }

    static create(item: any){
        return ProductDb.create(item);
    }
}