import { Router } from "express";
import { CommentsController } from "../controllers/comments/commentsController";
import { authMiddleware } from "../middlewares/authMiddleware";

const commentsRouter = Router();

commentsRouter.post('/', authMiddleware, CommentsController.addComment);
commentsRouter.get('/product/:productId', CommentsController.getComments);
commentsRouter.get('/product/:productId/avg', CommentsController.getAverageRating);

export { commentsRouter };