import { Response,Request } from "express";
import { DeliveryService } from "../../services/delivary/delivaryService";

export class DeliveryController{
    public static async CreateDelivary(req: Request, res: Response): Promise<void>{
        try{
            const userId = req.body.userId;

            if(!userId){
                res.status(400).send({error:"user not found"});
                return;
            }

            const addres = req.body.Address;

            if(!addres){
                res.status(400).send({error:"addres not found"});
                return;
            }

            const delivary = await DeliveryService.CreateDelivary(userId,addres);
            res.status(200).send(delivary);
        }
        catch(err){
            res.status(404).send({error: err});
        }
    }

    public static async RemoveDelivary(req: Request, res: Response): Promise<void>{
        try{

            const userId = req.body.userId;

            if(!userId){
                res.status(400).send({error:"user not found"});
                return;
            }

            const delId = req.body.deliveryId;

            if(!delId){
                res.status(400).send({error:"deliv not found"});
            }

            const alldelivary = await DeliveryService.RemoveDelivary(delId);

            res.status(200).send(alldelivary);

        }
        catch(err){
            res.status(404).send({error:err});
        }
    }

    public static async GetDelivByUserId(req: Request, res: Response): Promise<void>{
        try{
            const userId = req.body.userId;

            if(!userId){
                console.log("fafa");
                res.status(400).send({error:"user not found"});
                return;
            }

            const userdeliveres = await DeliveryService.GetDelivByUserId(userId);

            res.status(200).send(userdeliveres);
        }
        catch(err){
            res.status(404).send({error: err});
        }
    }
}