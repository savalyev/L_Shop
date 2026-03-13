import { Response, Request } from "express";
import { DeliveryService } from "../../services/delivery/deliveryService";

export class DeliveryController {

    public static async createDelivery(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.body.userId;

            if (!userId) {
                res.status(400).send({ error: "userId is required" });
                return;
            }

            const address = req.body.Address;

            if (!address) {
                res.status(400).send({ error: "address is required" });
                return;
            }

            const delivary = await DeliveryService.createDelivery(userId, address);
            res.status(201).send(delivary);
        }
        catch (err) {
            res.status(500).send({ error: err });
        }
    }

    public static async removeDelivery(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.body.userId;

            if (!userId) {
                res.status(400).send({ error: "userId is required" });
                return;
            }

            const delId = req.body.deliveryId;

            if (!delId) {
                res.status(400).send({ error: "deliveryId is required" });
                return;
            }

            const alldelivary = await DeliveryService.removeDelivery(delId);

            res.status(200).send(alldelivary);

        }
        catch (err) {
            res.status(500).send({ error: err });
        }
    }

    public static async getDelivByUserId(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.body.userId;

            if (!userId) {
                res.status(400).send({ error: "userId is required" });
                return;
            }

            const userdeliveres = await DeliveryService.getDelivByUserId(userId);

            res.status(200).send(userdeliveres);
        }
        catch (err) {
            res.status(500).send({ error: err });
        }
    }
}