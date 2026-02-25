import { ProductsService } from "../../services/products/productsService";
import { Request, Response } from "express";
import { Product } from "../../models/model";

type ProductCreateBody = Omit<Product, 'id'>;

export class ProductsController{
    static getAll(req: Request, res: Response){
        const data = ProductsService.getAll();
        res.send({data});
    }

    static getById(req: Request, res: Response){
        const idParam = req.params.id;
        const id = Number(idParam);

        if(Number.isNaN(id)){
            return res.status(400).send({ error: "Invalid id"});
        }

        const item = ProductsService.getById(id);
        if(!item){
            return res.status(404).send({error: "Not found"});
        }

        res.send({data: item});
    }

    static create(req: Request<{}, any, Partial<ProductCreateBody>>, res: Response) {
        const body = req.body as ProductCreateBody;

        const newItem = ProductsService.create(body); 
        return res.status(201).json({ data: newItem });
    }
}