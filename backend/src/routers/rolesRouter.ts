import { Router } from 'express';
import { RolesController } from '../controllers/users/rolesController';
import { requireRole } from '../middlewares/roleMiddleware';

const rolesRouter = Router();

// Все маршруты требуют роль admin
rolesRouter.use(requireRole(['admin']));

/**

- @openapi
- /api/roles/grant-manager:
- post:
- summary: Назначить пользователю роль manager
- tags:
- - Roles
- security:
- - cookieAuth: []
- requestBody:
- required: true
- content:
- application/json:
- schema:
- type: object
- required:
- - userId
- properties:
- userId:
- type: integer
- example: 5
- responses:
- 200:
- description: Роль manager назначена
- content:
- application/json:
- schema:
- type: object
- properties:
- message:
- type: string
- user:
- $ref: '#/components/schemas/User'
- 400:
- description: userId обязателен
- 404:
- description: Пользователь не найден
- 401:
- description: Не авторизован
- 403:
- description: Недостаточно прав (требуется admin)
*/
rolesRouter.post('/grant-manager', RolesController.grantManager);

/**

- @openapi
- /api/roles/revoke-manager:
- post:
- summary: Лишить пользователя роли manager (вернуть роль user)
- tags:
- - Roles
- security:
- - cookieAuth: []
- requestBody:
- required: true
- content:
- application/json:
- schema:
- type: object
- required:
- - userId
- properties:
- userId:
- type: integer
- example: 5
- responses:
- 200:
- description: Роль manager снята
- content:
- application/json:
- schema:
- type: object
- properties:
- message:
- type: string
- user:
- $ref: '#/components/schemas/User'
- 400:
- description: userId обязателен
- 404:
- description: Пользователь не найден
- 401:
- description: Не авторизован
- 403:
- description: Недостаточно прав (требуется admin)
*/
rolesRouter.post('/revoke-manager', RolesController.revokeManager);

/**

- @openapi
- /api/roles/users:
- get:
- summary: Получить список всех пользователей (для администрирования)
- tags:
- - Roles
- security:
- - cookieAuth: []
- responses:
- 200:
- description: Список пользователей
- content:
- application/json:
- schema:
- type: array
- items:
- $ref: '#/components/schemas/User'
- 401:
- description: Не авторизован
- 403:
- description: Недостаточно прав (требуется admin)
*/
rolesRouter.get('/users', RolesController.getAllUsers);

export { rolesRouter };