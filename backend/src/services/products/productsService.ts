import { ProductDb } from "../../database/productsDB";
import { Product } from "../../models/model";
import { ProductCreateBody } from "../../models/model";

export class ProductsService {
    static getAll(): Product[]{
        return ProductDb.getAll();
    }

    static getById(id: number): Product | undefined {
        return ProductDb.getById(id);
    }

    static getByName(name: string): Product[] | undefined {
        return ProductDb.getByName(name);
    }

    static getByDescription(description: string): Product[] | undefined {
        return ProductDb.getByDescription(description);
    }

    static getByMassId(ids: number[]): Product[] | undefined {
        return ProductDb.getByMassId(ids);
    }

    static getAllAscending(): Product[] {
        return ProductDb.getAllAscending();
    }

    static  getAllDescending(): Product[] {
        return ProductDb.getAllDescending();
    }

    static getAllFiltered(options: {
        category?: string;
        isAvailable?: boolean;
        minPrice?: number;
        maxPrice?: number;}): Product[] {
        return ProductDb.getAllFiltered(options);
    }

    static create(item: ProductCreateBody): Product {
        return ProductDb.create(item);
    }
}