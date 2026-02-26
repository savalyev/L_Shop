import * as fs from "fs";
import * as path from 'path';
import { Product } from "../models/model";

const filePath = path.resolve(__dirname, 'products.json');

function readData(): Product[] {
    try {
        if (!fs.existsSync(filePath)) {
            console.warn(`Файл ${filePath} не найден, возвращаю []`);
            return [];
        }
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed as Product[] : [];
    } catch (err) {
        console.error('Ошибка чтения JSON:', err);
        return [];
    }
}

export class ProductDb{
    static getAll(){
        return readData();
    }

    static getById(id: number){
        const data = readData();
        return data.find((f: Product) => f.id === id);
    }

    static getByName(name: string){
        const data = readData();
        const normalized = name.trim().toLowerCase();

        return data.filter((p: Product) => p.title.toLowerCase().includes(normalized)
  );
    }

    static getByDescription(description: string){
        const data = readData();
        const normalized = description.trim().toLocaleLowerCase();


        return data.filter((p: Product) => p.description.toLocaleLowerCase().includes(normalized));
    }

    // по возрастанию цены
    static getAllAscending() {
    const data = readData();
    return [...data].sort((a, b) => a.price - b.price);
    }

    // по убыванию цены
    static getAllDescending() {
    const data = readData();
    return [...data].sort((a, b) => b.price - a.price);
    }

    static getAllFiltered(options: {
        category?: string;
        isAvailable?: boolean;
        minPrice?: number;
        maxPrice?: number;
    }): Product[] {
        let data = ProductDb.getAll();

        if (options.category) {
        data = data.filter(p =>
            p.categories.some(c => c.toLowerCase() === options.category!.toLowerCase())
        );
        }

        if (options.isAvailable !== undefined) {
        data = data.filter(p => p.isAvailable === options.isAvailable);
        }

        if (options.minPrice !== undefined) {
        const min = options.minPrice;
        data = data.filter(p => p.price >= min);
        }

        if (options.maxPrice !== undefined) {
        const max = options.maxPrice;
        data = data.filter(p => p.price <= max);
        }

        return data;
    }


    static create(item: Partial<Product>): Product { 
        const data = readData();
        const maxId = data.length > 0 
            ? data.reduce((m, f) => Math.max(m, f.id || 0), 0) 
            : 0;
        const newItem: Product = {
            id: maxId + 1,
            title: item.title || '',
            price: item.price || 0,
            isAvailable: item.isAvailable ?? true,
            description: item.description || '',
            categories: item.categories || [],
            images: { preview: item.images?.preview || '' },
            discount: item.discount || 0,
        };
        data.push(newItem);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        return newItem;
    }
}