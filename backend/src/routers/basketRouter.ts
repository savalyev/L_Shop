import { Router } from 'express';
import { BasketController } from '../controllers/basket/basketController';
import { authMiddleware } from '../middlewares/authMiddleware';

const basketRouter = Router();

// леха, исправь эту хуйню пожалуйста

//GET запрос, получение корзины пользователя по Cookies
basketRouter.get('/mybasket', authMiddleware, BasketController.getBasket);

//POST запрос, добавление товара из корзины по Cookies (+1)
basketRouter.post('/add-to-basket', authMiddleware, BasketController.addToBasket);

//PATCH запрос, удаление товара из корзины по Cookies (-1)
basketRouter.patch('/remove-count', authMiddleware, BasketController.removeFromBasket);

//DELETE запрос, удаление всей корзины по Cookies
basketRouter.delete('/remove-all', authMiddleware, BasketController.removeAllBasket);

//DELETE запрос, удаление всей строчки товара из корзины 
basketRouter.delete('/remove-product', authMiddleware, BasketController.removeProduct);

export { basketRouter };
