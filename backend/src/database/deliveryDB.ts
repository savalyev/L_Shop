import { BasketDB } from '../database/basketDB';
import { ProductDb } from '../database/productsDB';
import { Delivery, Address } from '../models/model';
import * as fs from 'fs';
import * as path from 'path';

const filepathDelivery = path.resolve(__dirname, 'delivery.json');

/**
 * Класс для управления доставками пользователей через JSON-файл.
 */
export class DeliveryDB {

    /**
     * Читает и возвращает все существующие доставки из файла `delivery.json`.
     * @returns {Delivery[]} Массив всех оформленных доставок.
     * @throws {Error} Если файл пуст или данные некорректны.
     * @private
     */
    private static getAll(): Delivery[] {
        const file = fs.readFileSync(filepathDelivery, 'utf-8');
        const allDelivery: Delivery[] | undefined = JSON.parse(file);

        if (!allDelivery) {
            throw new Error("Error in delivery file");
        }

        return allDelivery;
    }

    /**
     * Получает список всех доставок конкретного пользователя.
     * @param {number} userId - Идентификатор пользователя.
     * @returns {Delivery[]} Массив доставок, принадлежащих пользователю.
     * @throws {Error} Если у пользователя нет доставок (в текущей реализации фильтр всегда возвращает массив, даже пустой, но ошибка выбросится, если filter вернет falsy значение).
     */
    public static getDelivByUserId(userId: number): Delivery[] {
        const alldelivery = this.getAll();
        const userdeliveres = alldelivery.filter(d => d.basket.userId === userId);

        if (!userdeliveres) {
            throw new Error("User hasn't deliveries");
        }

        return userdeliveres;
    }

    /**
     * Оформляет новую доставку для пользователя на основе его текущей корзины.
     * Рассчитывает общую стоимость доставки и примерную дату прибытия в зависимости от адреса.
     * После успешного оформления корзина пользователя полностью очищается.
     * 
     * @param {number} userId - Идентификатор пользователя, оформляющего заказ.
     * @param {Address} endAdress - Конечный адрес доставки.
     * @returns {Delivery} Созданный объект доставки.
     * @throws {Error} Если корзина пользователя не найдена или пуста.
     */
    public static createDelivery(userId: number, endAdress: Address): Delivery {
        const userbasket = BasketDB.GetBasketUserId(userId);

        if (!userbasket) {
            throw new Error("Basket not found");
        }
        if (userbasket.basket.length === 0) {
            throw new Error("Basket is clear");
        }

        const allproduct = ProductDb.getAll();

        // Расчет стоимости доставки
        let cost: number = 0;
        for (const item of userbasket.basket) {
            const product = allproduct.find(p => Number(p.id) === Number(item.productId));
            if (product && product.delivery && product.delivery.price) {
                cost += product.delivery.price;
            }
        }

        // Расчет времени доставки (в днях)
        let days: number = 1;
        for (const item of userbasket.basket) {
            const product = allproduct.find(p => Number(p.id) === Number(item.productId));

            // Логика: если город совпадает -> 1 день. 
            // Если страна совпадает -> от 1 до 3 дней. 
            // Иначе -> от 6 до 15 дней.
            if (endAdress.town && product?.delivery?.startTown.town && endAdress.town.toLowerCase() === product?.delivery?.startTown.town.toLowerCase()) {
                days = 1;
            }
            else if (endAdress.country && product?.delivery?.startTown.country && endAdress.country.toLowerCase() === product?.delivery?.startTown.country.toLowerCase()) {
                days = (Math.random() * (3 - 1 + 1) + 1);
            }
            else {
                days = (Math.random() * (15 - 6 + 1) + 1);
            }
        }

        const alldelivery = this.getAll();
        const maxId: number = alldelivery.length + 1;

        // Вычисляем конечную дату доставки
        const now = new Date();
        now.setDate(now.getDate() + days);

        const newDelivery: Delivery = {
            id: maxId,
            endadress: endAdress,
            endDate: now,
            basket: userbasket,
            cost: cost
        };

        // Очищаем корзину после оформления заказа
        BasketDB.RemoveAllBasket(userId);

        alldelivery.push(newDelivery);
        fs.writeFileSync(filepathDelivery, JSON.stringify(alldelivery, null, 2));

        return newDelivery;
    }

    /**
     * Удаляет доставку по ее ID.
     * @param {number} delId - Идентификатор удаляемой доставки.
     * @returns {Delivery[]} Обновленный список всех доставок.
     * @throws {Error} Если доставка с указанным ID не найдена в базе.
     */
    public static removeDelivery(delId: number): Delivery[] {
        const allDelivery = this.getAll();
        const delivery = allDelivery.filter(d => d.id !== delId);

        if (!delivery) {
            throw new Error("Delivery obj not found");
        }

        if (allDelivery.length === delivery.length) {
            throw new Error("Obj delivery wasn't deleted");
        }

        fs.writeFileSync(filepathDelivery, JSON.stringify(delivery, null, 2));

        return delivery;
    }

    /**
     * Автоматически удаляет все просроченные (завершенные) доставки из базы данных.
     * Сравнивает текущую дату с датой `endDate` каждой доставки.
     */
    public static updateDelivery(): void {
        const file = fs.readFileSync(filepathDelivery, 'utf-8');
        const alldelivery: Delivery[] = JSON.parse(file);

        const Datenow = new Date();
        
        // Оставляем только те доставки, срок которых еще не истек
        const newdel: Delivery[] = alldelivery.filter(d => Datenow < new Date(d.endDate));
        
        fs.writeFileSync(filepathDelivery, JSON.stringify(newdel, null, 2));
    }
}