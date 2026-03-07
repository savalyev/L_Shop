import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/model';

type ProductCreateBody = Omit<Product, 'id'>;

export function validateProductCreate(
  req: Request<{}, any, Partial<ProductCreateBody>>,
  res: Response,
  next: NextFunction
): void {
  const body = req.body || {};

  // title
  if (typeof body.title !== 'string' || body.title.trim() === '') {
    res.status(400).json({ error: 'Поле "title" обязательно' });
    return;
  }

  // price
  if (typeof body.price !== 'number' || Number.isNaN(body.price)) {
    res.status(400).json({ error: 'Поле "price" (number) обязательно и должно быть числом' });
    return;
  }

  // isAvailable
  if (typeof body.isAvailable !== 'boolean') {
    res.status(400).json({ error: 'Поле "isAvailable" (boolean) обязательно' });
    return;
  }

  // description
  if (typeof body.description !== 'string' || body.description.trim() === '') {
    res.status(400).json({ error: 'Поле "description" (string) обязательно' });
    return;
  }

  // categories
  if (!Array.isArray(body.categories) || body.categories.some(c => typeof c !== 'string')) {
    res.status(400).json({ error: 'Поле "categories" должно быть массивом строк' });
    return;
  }

  // images.preview
  if (!body.images || typeof body.images.preview !== 'string' || body.images.preview.trim() === '') {
    res.status(400).json({ error: 'Поле "images.preview" (string) обязательно' });
    return;
  }

  // discount
  if (typeof body.discount !== 'number' || Number.isNaN(body.discount)) {
    res.status(400).json({ error: 'Поле "discount" (number) обязательно' });
    return;
  }

  if (body.delivery) {
    if (!body.delivery.startTown || typeof body.delivery.startTown !== 'object') {
      res.status(400).json({ error: 'Поле "delivery.startTown" обязательно, если есть delivery' });
      return;
    }
    if (typeof body.delivery.price !== 'number' || Number.isNaN(body.delivery.price)) {
      res.status(400).json({ error: 'Поле "delivery.price" должно быть числом' });
      return;
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
