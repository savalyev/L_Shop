import { DeliveryController } from "../controllers/delivery/deliveryController";
import { DeliveryMiddle } from "../middlewares/deliveryMiddleware";
import { Request, Response, Router } from "express";

export const deliveryRouter = Router();

deliveryRouter.get('/getall', DeliveryController.getDelivByUserId);

deliveryRouter.post('/', DeliveryController.createDelivery);

deliveryRouter.delete('/delete-delivery', DeliveryController.removeDelivery);

deliveryRouter.get('/get-all', DeliveryMiddle.getDelivByUserId, (req: Request, res: Response) => {
    res.json(res.locals.userdeliveres);
});

deliveryRouter.post('/createDeliv', DeliveryMiddle.createDelivery, (req: Request, res: Response) => {
    res.json(res.locals.delivary);
});

deliveryRouter.delete('/remove-delivery', DeliveryMiddle.removeDelivery, (req: Request, res: Response) => {
    res.json(res.locals.delivary);
});