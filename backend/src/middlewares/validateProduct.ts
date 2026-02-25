import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/model';

type ProductCreateBody = Omit<Product, 'id'>;

export function validateProductCreate(
    req: Request<{}, any, Partial<ProductCreateBody>>,
    res: Response,
    next: NextFunction
){
    const body = req.body || {};

    // title
    if (typeof body.title !== 'string' || body.title.trim() === '') {
      return res.status(400).json({ error: 'Поле "title" обязательно' });
    }

    // price
    if (typeof body.price !== 'number' || Number.isNaN(body.price)) {
      return res.status(400).json({ error: 'Поле "price" (number) обязательно и должно быть числом' });
    }

    // isAvailable
    if (typeof body.isAvailable !== 'boolean') {
      return res.status(400).json({ error: 'Поле "isAvailable" (boolean) обязательно' });
    }

    // description
    if (typeof body.description !== 'string' || body.description.trim() === '') {
      return res.status(400).json({ error: 'Поле "description" (string) обязательно' });
    }

    // categories
    if (!Array.isArray(body.categories) || body.categories.some(c => typeof c !== 'string')) {
      return res.status(400).json({ error: 'Поле "categories" должно быть массивом строк' });
    }

    // images.preview
    if (!body.images || typeof body.images.preview !== 'string' || body.images.preview.trim() === '') {
      return res.status(400).json({ error: 'Поле "images.preview" (string) обязательно' });
    }

    // discount
    if (typeof body.discount !== 'number' || Number.isNaN(body.discount)) {
      return res.status(400).json({ error: 'Поле "discount" (number) обязательно' });
    }

    if (body.delivery) {
      if (!body.delivery.startTown || typeof body.delivery.startTown !== 'object') {
        return res.status(400).json({ error: 'Поле "delivery.startTown" обязательно, если есть delivery' });
      }
      if (typeof body.delivery.price !== 'number' || Number.isNaN(body.delivery.price)) {
        return res.status(400).json({ error: 'Поле "delivery.price" должно быть числом' });
    }
  }

    req.body = {
      ...body,
      title: body.title.trim(),
      description: body.description.trim(),
      categories: body.categories,
      images: {
        preview: body.images.preview.trim(),
        gallery: body.images.gallery ?? [],
      },
      isAvailable: body.isAvailable,
      discount: body.discount,
    };

    return next();
}
