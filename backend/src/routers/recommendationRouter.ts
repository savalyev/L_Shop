import { Router } from "express";
import { RecommendationController } from "../controllers/products/recommendationController";
import { authMiddleware } from "../middlewares/authMiddleware";

const recommendationRouter = Router();

recommendationRouter.post('/like/:productId', authMiddleware, RecommendationController.likeProduct);
recommendationRouter.get('/my', authMiddleware, RecommendationController.getRecommendedProducts);

export { recommendationRouter };