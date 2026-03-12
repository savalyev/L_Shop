import { DeliveryController } from "../controllers/delivary/delivaryController";
import { DelivaryMiddle } from "../middlewares/delivaryMiddleware";
import { Request, Response, Router } from "express";

export const delivaryRouter = Router();

delivaryRouter.get('/getall',DeliveryController.GetDelivByUserId);
delivaryRouter.post('/',DeliveryController.CreateDelivary);
delivaryRouter.delete('/delete-delivery',DeliveryController.RemoveDelivary);


delivaryRouter.get('/get-all',DelivaryMiddle.GetDelivByUserId,(req: Request, res: Response) => {
    res.json(res.locals.userdeliveres);
});
delivaryRouter.post('/createDeliv',DelivaryMiddle.CreateDelivary,(req: Request, res: Response) => {
    res.json(res.locals.delivary);
});
delivaryRouter.delete('/remove-delivery',DelivaryMiddle.RemoveDelivary,(req: Request, res: Response) => {
    res.json(res.locals.delivary);
});