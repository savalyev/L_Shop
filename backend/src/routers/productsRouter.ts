import {Router} from 'express';
import { ProductsController } from '../controllers/products/productsController';
import { validateProductCreate } from '../middlewares/validateProduct';

const productsRouter = Router();


//GET запрос, получение всех продуктов
productsRouter.get('/', ProductsController.getAll);

// GET запрос, получение продукта по ID
productsRouter.get('/:id', ProductsController.getById);

//POST запрос, создание продукта
productsRouter.post('/', validateProductCreate, ProductsController.create);

export {productsRouter};