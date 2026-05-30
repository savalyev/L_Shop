import { Router } from "express";
import { CommentsController } from "../controllers/comments/commentsController";
import { authMiddleware } from "../middlewares/authMiddleware";

const commentsRouter = Router();

/**

- @openapi
- /api/comments:
- post:
- summary: Добавить комментарий к товару
- tags:
- - Comments
- security:
- - cookieAuth: []
- requestBody:
- required: true
- content:
- application/json:
- schema:
- type: object
- required:
- - productId
- - rating
- - text
- properties:
- productId:
- type: integer
- example: 2
- rating:
- type: integer
- minimum: 1
- maximum: 5
- example: 5
- text:
- type: string
- example: "Отличный товар!"
- responses:
- 201:
- description: Комментарий успешно добавлен
- content:
- application/json:
- schema:
- $ref: '#/components/schemas/Comment'
- 400:
- description: Неверные данные (productId, rating, text обязательны)
- 401:
- description: Не авторизован
*/
commentsRouter.post('/', authMiddleware, CommentsController.addComment);

/**

- @openapi
- /api/comments/product/{productId}:
- get:
- summary: Получить все комментарии к товару
- tags:
- - Comments
- parameters:
- - in: path
- name: productId
- required: true
- schema:
- type: integer
- description: ID товара
- responses:
- 200:
- description: Список комментариев
- content:
- application/json:
- schema:
- type: array
- items:
- $ref: '#/components/schemas/Comment'
- 400:
- description: Неверный productId
*/
commentsRouter.get('/product/:productId', CommentsController.getComments);

/**

- @openapi
- /api/comments/product/{productId}/avg:
- get:
- summary: Получить средний рейтинг товара
- tags:
- - Comments
- parameters:
- - in: path
- name: productId
- required: true
- schema:
- type: integer
- responses:
- 200:
- description: Средний рейтинг
- content:
- application/json:
- schema:
- type: object
- properties:
- averageRating:
- type: number
- example: 4.5
- 400:
- description: Неверный productId
*/
commentsRouter.get('/product/:productId/avg', CommentsController.getAverageRating);

export { commentsRouter };