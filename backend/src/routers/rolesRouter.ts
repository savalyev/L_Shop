import { Router } from 'express';
import { RolesController } from '../controllers/users/rolesController';
import { requireRole } from '../middlewares/roleMiddleware';

const rolesRouter = Router();

rolesRouter.use(requireRole(['admin']));

rolesRouter.post('/grant-manager', RolesController.grantManager);
rolesRouter.post('/revoke-manager', RolesController.revokeManager);
rolesRouter.get('/users', RolesController.getAllUsers);

export { rolesRouter };