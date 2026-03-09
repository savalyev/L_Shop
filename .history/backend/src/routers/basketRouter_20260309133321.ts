import { Router, Request, Response } from 'express';
import { BasketController } from '../controllers/basket/basketController';
import { MiddleBasket } from '../middlewares/basketMiddleware';

const basketRouter = Router();

basketRouter.get('/mybasket',MiddleBasket.validateBasket, (req: Request, res: Response) => {
    res.json(res.locals.basket);
    });

basketRouter.get('/:userId',BasketController.GetBasket);

basketRouter.post('/',BasketController.AddToBasket);

basketRouter.post('/add-to-basket',MiddleBasket.addToBasket,(req:Request, res:Response)=>{
    res.json(res.locals.basket);
});

export { basketRouter };