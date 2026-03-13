import { ProductsService } from "../../services/products/productsService";
import { Request, Response } from "express";
import { Product } from "../../models/model";

type ProductCreateBody = Omit<Product, 'id'>;

export class ProductsController{
    static getAll(req: Request, res: Response): void {
        const data = ProductsService.getAll();
        res.send({data});
    }

    static getById(req: Request, res: Response): void {
        const idParam = req.params.id;
        const id = Number(idParam);

        if(Number.isNaN(id)){
            res.status(400).send({ error: "Invalid id"});
            return;
        }

        const item = ProductsService.getById(id);
        if(!item){
            res.status(404).send({error: "Not found"});
            return;
        }

        res.send({data: item});
    }

    static getByName(req: Request, res: Response): void {
        const name = req.query.name;

        if (typeof name !== 'string' || name.trim() === '') {
            res.status(400).json({ error: 'Query-параметр "name" обязателен' });
            return;
        }


        const product = ProductsService.getByName(name);

        if(!product){
            res.status(400).json({error: "Продукт с таким именем не найден"});
            return;
        }

        res.json({data: product});
    }

    static getByDescription(req: Request, res: Response): void {
        const description = req.query.description;

        if(typeof description !== 'string' || description.trim() === ''){
            res.status(400).json({error: "Query параметр 'description' обязателен"});
            return;
        }

        const product = ProductsService.getByDescription(description);

        if(!product){
            res.status(400).json({error: "Продукт с таким описанием не найден"});
            return;
        }

        res.json({data: product});
    }

    static getByMassId(req: Request, res: Response): void {
        const ids = req.body.ids as number[];

        if(!Array.isArray(ids)){
            res.status(400).json({error: "ids not massive"});
            return;
        }

        const products = ProductsService.getByMassId(ids);

        if(!products){
            res.status(400).json({error: "not have products"});
            return;
        }

        res.json({products});
    }

    static getAllAscending(req: Request, res: Response): void {
        const data = ProductsService.getAllAscending();
        res.json({data});
    }

    static getAllDescending(req: Request, res: Response): void {
        const data = ProductsService.getAllDescending();
        res.json({data});
    }

    static getAllFiltered(req: Request, res: Response): void{
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

    static create(req: Request<{}, any, Partial<ProductCreateBody>>, res: Response): void {
        const body = req.body as ProductCreateBody;

        const newItem = ProductsService.create(body); 
        res.status(201).json({ data: newItem });
    }
}