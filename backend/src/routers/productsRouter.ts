import {Router} from 'express';
import { ProductsController } from '../controllers/products/productsController';
import { validateProductCreate } from '../middlewares/validateProduct';

const productsRouter = Router();


//GET запрос, получение всех продуктов
productsRouter.get('/', ProductsController.getAll);

//GET запрос, получение продукта по имени
productsRouter.get("/by-name", ProductsController.getByName);

//GET запрос, получение продукта по описанию
productsRouter.get("/by-description", ProductsController.getByDescription);

//GET запрос, получение продуктов по возрастанию цены
productsRouter.get("/ascending", ProductsController.getAllAscending);

//GET запрос, получение продуктов по убыванию цены
productsRouter.get("/descending", ProductsController.getAllDescending);

//GET запрос, получение продуктов по фильтрам
productsRouter.get("/fillters", ProductsController.getAllFiltered);

// GET запрос, получение продукта по ID
productsRouter.get('/:id', ProductsController.getById);

//POST запрос, создание продукта
productsRouter.post('/', validateProductCreate, ProductsController.create);

export {productsRouter};