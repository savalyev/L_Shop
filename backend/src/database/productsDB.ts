import * as fs from "fs";
import * as path from 'path';
import { Product } from "../models/model";

const filePath = path.resolve(__dirname, 'products.json');

/**
 * Безопасно читает данные из JSON-файла с продуктами.
 * Если файл не существует или поврежден, возвращает пустой массив.
 * @returns {Product[]} Массив продуктов.
 */
function readData(): Product[] {
    try {
        if (!fs.existsSync(filePath)) {
            console.warn(`Файл ${filePath} не найден, возвращаю []`);
            return [];
        }
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed: Product[] = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed as Product[] : [];
    } catch (err) {
        console.error('Ошибка чтения JSON:', err);
        return [];
    }
}

/**
 * Класс для работы с базой данных продуктов (через JSON-файл).
 */
export class ProductDb {
    
    /**
     * Получает список всех продуктов.
     * @returns {Product[]} Массив всех продуктов.
     */
    static getAll(): Product[] {
        return readData();
    }

    /**
     * Находит продукт по его уникальному идентификатору.
     * @param {number} id - Идентификатор продукта.
     * @returns {Product | undefined} Найденный продукт или undefined, если не найден.
     */
    static getById(id: number): Product | undefined {
        const data = readData();
        return data.find((f: Product) => f.id === id);
    }

    /**
     * Ищет продукты, в названии которых содержится указанная строка.
     * Поиск не зависит от регистра (case-insensitive).
     * @param {string} name - Строка для поиска в названии.
     * @returns {Product[]} Массив найденных продуктов.
     */
    static getByName(name: string): Product[] {
        const data = readData();
        const normalized = name.trim().toLowerCase();
        return data.filter((p: Product) => p.title.toLowerCase().includes(normalized));
    }

    /**
     * Ищет продукты, в описании которых содержится указанная строка.
     * Поиск не зависит от регистра.
     * @param {string} description - Строка для поиска в описании.
     * @returns {Product[]} Массив найденных продуктов.
     */
    static getByDescription(description: string): Product[] {
        const data = readData();
        const normalized = description.trim().toLowerCase();
        return data.filter((p: Product) => p.description.toLowerCase().includes(normalized));
    }

    /**
     * Получает список продуктов по массиву их идентификаторов.
     * Используется для корзины, чтобы загрузить данные сразу нескольких товаров.
     * @param {number[]} ids - Массив идентификаторов продуктов.
     * @returns {Product[]} Массив найденных продуктов.
     */
    static getByMassId(ids: number[]): Product[] {
        const data = readData();
        return data.filter(p => ids.includes(p.id));
    }

    /**
     * Возвращает все продукты, отсортированные по возрастанию цены (от дешевых к дорогим).
     * @returns {Product[]} Отсортированный массив продуктов.
     */
    static getAllAscending(): Product[] {
        const data = readData();
        return [...data].sort((a, b) => a.price - b.price);
    }

    /**
     * Возвращает все продукты, отсортированные по убыванию цены (от дорогих к дешевым).
     * @returns {Product[]} Отсортированный массив продуктов.
     */
    static getAllDescending(): Product[] {
        const data = readData();
        return [...data].sort((a, b) => b.price - a.price);
    }

    /**
     * Возвращает продукты, отфильтрованные по заданным параметрам (категория, наличие, цена).
     * Фильтры применяются последовательно.
     * @param {Object} options - Объект с параметрами фильтрации.
     * @returns {Product[]} Отфильтрованный массив продуктов.
     */
    static getAllFiltered(options: {
        category?: string;
        isAvailable?: boolean;
        minPrice?: number;
        maxPrice?: number;
    }): Product[] {
        let data = ProductDb.getAll();

        if (options.category) {
            data = data.filter(p =>
                // Используем p.categories?.some, чтобы избежать ошибки, если у товара нет категорий
                p.categories?.some(c => c.toLowerCase() === options.category!.toLowerCase())
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

    /**
     * Создает новый продукт, автоматически присваивает ему следующий ID и сохраняет в JSON-файл.
     * @param {Partial<Product>} item - Данные нового продукта (могут быть неполными).
     * @returns {Product} Созданный продукт со всеми обязательными полями.
     */
    static create(item: Partial<Product>): Product { 
        const data = readData();
        
        // Вычисляем максимальный ID. Если база пуста, начнем с 0.
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