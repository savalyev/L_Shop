import {Router} from 'express';
import { ProductsController } from '../controllers/products/productsController';
import { validateProductCreate } from '../middlewares/productMiddleware';

const productsRouter = Router();


/**
 * @openapi
 * /api/products:
 *   get:
 *     summary: Получить все товары
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Список товаров успешно получен
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
productsRouter.get('/', ProductsController.getAll);

/**
 * @openapi
 * /api/products/by-name:
 *   get:
 *     summary: Получить продукт по названию
 *     tags:
 *       - Products
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Название товара или его часть
 *         example: "Gaming Mouse" 
 *     responses:
 *       200:
 *         description: Список товаров с совпадающим названием
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       400:
 *         description: Query-параметр "name" обязателен
 */
productsRouter.get("/by-name", ProductsController.getByName);

/**
 * @openapi
 * /api/products/by-description:
 *   get:
 *     summary: Получить продукт по описанию
 *     tags:
 *       - Products
 *     parameters:
 *       - in: query
 *         name: description
 *         required: true
 *         schema:
 *           type: string
 *         description: Ключевое слово из описания товара
 *         example: "беспроводная" 
 *     responses:
 *       200:
 *         description: Список товаров с совпадающим описанием
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       400:
 *         description: Query-параметр "description" обязателен
 */
productsRouter.get("/by-description", ProductsController.getByDescription);

/**
 * @openapi
 * /api/products/ascending:
 *   get:
 *     summary: Получить все товары, отсортированные по возрастанию цены
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Список товаров от дешёвых к дорогим
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
productsRouter.get("/ascending", ProductsController.getAllAscending);

/**
 * @openapi
 * /api/products/descending:
 *   get:
 *     summary: Получить все товары, отсортированные по убыванию цены
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Список товаров от дорогих к дешевым
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
productsRouter.get("/descending", ProductsController.getAllDescending);

/**
 * @openapi
 * /api/products/fillters:
 *   get:
 *     summary: Получить товары по фильтрам
 *     tags:
 *       - Products
 *     parameters:
 *       - in: query
 *         name: category
 *         required: false
 *         schema:
 *           type: string
 *         description: Категория товара
 *         example: "gaming"
 *       - in: query
 *         name: minPrice
 *         required: false
 *         schema:
 *           type: number
 *         description: Минимальная цена
 *         example: 10
 *       - in: query
 *         name: maxPrice
 *         required: false
 *         schema:
 *           type: number
 *         description: Максимальная цена
 *         example: 500
 *       - in: query
 *         name: isAvailable
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Фильтр по наличию товара
 *         example: true
 *     responses:
 *       200:
 *         description: Список товаров, соответствующих фильтрам
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       400:
 *         description: Некорректные параметры фильтрации
 */
productsRouter.get("/fillters", ProductsController.getAllFiltered);

/**
 * @openapi
 * /api/products/{id}:
 *   get:
 *     summary: Получить продукт по ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Уникальный идентификатор товара
 *         example: 5
 *     responses:
 *       200:
 *         description: Товар найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Некорретный ID
 *       404:
 *         description: Товар с таким ID не найден
 */
productsRouter.get('/:id', ProductsController.getById);

/**
 * @openapi
 * /api/products:
 *   post:
 *     summary: Создать новый товар
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductCreateBody'
 *     responses:
 *       201:
 *         description: Товар успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Ошибка валидации — некорректные данные в теле запроса
 */
productsRouter.post('/', validateProductCreate, ProductsController.create);

/**
 * @openapi
 * /api/products/for-basket:
 *   post:
 *     summary: Получить товары по массиву ID (для корзины)
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [101, 102, 105]
 *     responses:
 *       200:
 *         description: Список товаров по переданным ID
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       400:
 *         description: Массив ids не передан или пустой
 */
productsRouter.post("/for-basket", ProductsController.getByMassId);

export {productsRouter};