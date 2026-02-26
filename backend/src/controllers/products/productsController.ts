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

    static getByName(req: Request, res: Response){
        const name = req.query.name;

        if (typeof name !== 'string' || name.trim() === '') {
            return res.status(400).json({ error: 'Query-параметр "name" обязателен' });
        }


        const product = ProductsService.getByName(name);

        if(!product){
            return res.status(400).json({error: "Продукт с таким именем не найден"});
        }

        res.json({data: product});
    }

    static getByDescription(req: Request, res: Response){
        const description = req.query.description;

        if(typeof description !== 'string' || description.trim() === ''){
            return res.status(400).json({error: "Query параметр 'description' обязателен"});
        }

        const product = ProductsService.getByDescription(description);

        if(!product){
            return res.status(400).json({error: "Продукт с таким описанием не найден"});
        }

        res.json({data: product});
    }

    static getAllAscending(req: Request, res: Response){
        const data = ProductsService.getAllAscending();
        res.json({data});
    }

    static getAllDescending(req: Request, res: Response){
        const data = ProductsService.getAllDescending();
        res.json({data});
    }

    static getAllFiltered(req: Request, res: Response){
        const { category, isAvailable, minPrice, maxPrice } = req.query;

        const filters = {
        category: typeof category === 'string' ? category : undefined,
        isAvailable:
            typeof isAvailable === 'string'
            ? isAvailable === 'true'
            : undefined,
        minPrice:
            typeof minPrice === 'string' ? Number(minPrice) : undefined,
        maxPrice:
            typeof maxPrice === 'string' ? Number(maxPrice) : undefined,
        };

        const data = ProductsService.getAllFiltered(filters);
        res.json({ data });
    }

    static create(req: Request<{}, any, Partial<ProductCreateBody>>, res: Response) {
        const body = req.body as ProductCreateBody;

        const newItem = ProductsService.create(body); 
        return res.status(201).json({ data: newItem });
    }
}