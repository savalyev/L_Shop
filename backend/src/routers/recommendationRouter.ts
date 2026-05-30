import { Router } from "express";
import { RecommendationController } from "../controllers/products/recommendationController";
import { authMiddleware } from "../middlewares/authMiddleware";

const recommendationRouter = Router();

/**

- @openapi
- /api/recommendations/like/{productId}:
- post:
- summary: Поставить лайк товару (учитывается для рекомендаций)
- tags:
- - Recommendations
- security:
- - cookieAuth: []
- parameters:
- - in: path
- name: productId
- required: true
- schema:
- type: integer
- description: ID товара
- responses:
- 200:
- description: Лайк сохранён
- content:
- application/json:
- schema:
- type: object
- properties:
- message:
- type: string
- example: "Liked"
- 401:
- description: Не авторизован
- 404:
- description: Товар не найден (если сервис вернёт ошибку)
*/
recommendationRouter.post('/like/:productId', authMiddleware, RecommendationController.likeProduct);

/**

- @openapi
- /api/recommendations/my:
- get:
- summary: Получить персональные рекомендации для пользователя
- tags:
- - Recommendations
- security:
- - cookieAuth: []
- responses:
- 200:
- description: Список рекомендуемых товаров
- content:
- application/json:
- schema:
- type: array
- items:
- $ref: '#/components/schemas/Product'
- 401:
- description: Не авторизован
*/
recommendationRouter.get('/my', authMiddleware, RecommendationController.getRecommendedProducts);

export { recommendationRouter };