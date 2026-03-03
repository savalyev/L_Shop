import { Router } from 'express'
import { BasketController } from '../controllers/basket/basketController';

const basketRouter = Router();

basketRouter.get('/:userId',BasketController.GetBasket);

export { basketRouter };