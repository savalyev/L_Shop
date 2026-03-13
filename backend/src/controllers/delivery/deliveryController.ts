import { Response, Request } from "express";
import { DeliveryService } from "../../services/delivery/deliveryService";

export class DeliveryController {

    public static async createDelivery(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.body.userId;

            if (!userId) {
                res.status(404).send({ error: "user not found" });
                return;
            }

            const address = req.body.Address;

            if (!address) {
                res.status(404).send({ error: "addres not found" });
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
                res.status(404).send({ error: "user not found" });
                return;
            }

            const delId = req.body.deliveryId;

            if (!delId) {
                res.status(404).send({ error: "deliv not found" });
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
                res.status(404).send({ error: "user not found" });
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