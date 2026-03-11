import { Router, Request, Response } from 'express';
import { BasketController } from '../controllers/basket/basketController';
import { MiddleBasket } from '../middlewares/basketMiddleware';
import { basename } from 'path';

const basketRouter = Router();

basketRouter.patch('/remove',BasketController.RemoveFromBasket);

basketRouter.delete('/remove-prod',BasketController.RemoveProductFromBasket);

basketRouter.delete('/clear-basket',BasketController.RemoveAllBasket);

basketRouter.post('/',BasketController.AddToBasket);
//------MiddleWares
basketRouter.get('/mybasket',MiddleBasket.validateBasket, (req: Request, res: Response) => {
    res.json(res.locals.basket);
    });

basketRouter.post('/add-to-basket',MiddleBasket.addToBasket,(req:Request, res:Response)=>{
    res.json(res.locals.basket);
});

basketRouter.patch('/remove-count',MiddleBasket.RemoveFromBasket,(req: Request, res: Response) =>{
    res.json(res.locals.basket);
});

basketRouter.delete('/remove-all',MiddleBasket.RemoveAllBasket,(req: Request, res: Response) =>{
    res.json(res.locals.basket);
});

basketRouter.delete('/remove-product',MiddleBasket.RemoveProductFromBasket,(req: Request, res: Response) =>{
    res.json(res.locals.basket);
});
//-------
basketRouter.get('/:userId',BasketController.GetBasket);


basketRouter.get('/:userId',BasketController.GetBasket);

export { basketRouter };