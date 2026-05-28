import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/model';

type ProductCreateBody = Omit<Product, 'id'>;

/**
 * Middleware для валидации и очистки данных при создании нового продукта.
 * Проверяет наличие и типы всех обязательных полей (title, price, description и т.д.).
 * Если данные невалидны, возвращает статус 400 Bad Request с описанием ошибки.
 * В случае успеха очищает данные (удаляет пробелы по краям) и передает управление контроллеру.
 *
 * @param {Request<{}, any, Partial<ProductCreateBody>>} req - Объект запроса Express.
 * @param {Response} res - Объект ответа Express.
 * @param {NextFunction} next - Функция для перехода к следующему обработчику.
 */
export function validateProductCreate(
  req: Request<{}, any, Partial<ProductCreateBody>>,
  res: Response,
  next: NextFunction
): void {
  const body = req.body || {};

  // Валидация названия (title)
  if (typeof body.title !== 'string' || body.title.trim() === '') {
    res.status(400).json({ error: 'Поле "title" (строка) обязательно и не должно быть пустым' });
    return;
  }

  // Валидация цены (price)
  if (typeof body.price !== 'number' || Number.isNaN(body.price)) {
    res.status(400).json({ error: 'Поле "price" обязательно и должно быть валидным числом' });
    return;
  }

  // Валидация статуса наличия (isAvailable)
  if (typeof body.isAvailable !== 'boolean') {
    res.status(400).json({ error: 'Поле "isAvailable" (boolean) обязательно' });
    return;
  }

  // Валидация описания (description)
  if (typeof body.description !== 'string' || body.description.trim() === '') {
    res.status(400).json({ error: 'Поле "description" (строка) обязательно и не должно быть пустым' });
    return;
  }

  // Валидация категорий (categories)
  if (!Array.isArray(body.categories) || body.categories.some(c => typeof c !== 'string')) {
    res.status(400).json({ error: 'Поле "categories" обязательно и должно быть массивом строк' });
    return;
  }

  // Валидация изображений (images.preview)
  if (!body.images || typeof body.images.preview !== 'string' || body.images.preview.trim() === '') {
    res.status(400).json({ error: 'Поле "images.preview" (строка) обязательно' });
    return;
  }

  // Валидация скидки (discount)
  if (typeof body.discount !== 'number' || Number.isNaN(body.discount)) {
    res.status(400).json({ error: 'Поле "discount" обязательно и должно быть валидным числом' });
    return;
  }

  // Валидация данных о доставке (если они переданы)
  if (body.delivery) {
    if (!body.delivery.startTown || typeof body.delivery.startTown !== 'object') {
      res.status(400).json({ error: 'Поле "delivery.startTown" обязательно и должно быть объектом, если указан блок delivery' });
      return;
    }
    if (typeof body.delivery.price !== 'number' || Number.isNaN(body.delivery.price)) {
      res.status(400).json({ error: 'Поле "delivery.price" должно быть числом' });
      return;
    }
  }

  // Санитизация (очистка) данных
  // Перезаписываем req.body строгим объектом, чтобы контроллер получил идеальные данные
  req.body = {
    ...body,
    title: body.title.trim(),
    description: body.description.trim(),
    categories: body.categories,
    images: {
      preview: body.images.preview.trim(),
      gallery: body.images.gallery ?? [], // Если галереи нет, по умолчанию ставим пустой массив
    },
    isAvailable: body.isAvailable,
    discount: body.discount,
  };

  // Передаем управление следующему обработчику (контроллеру)
  next();
}