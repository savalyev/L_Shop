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