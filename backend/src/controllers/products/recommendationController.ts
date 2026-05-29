import { Request, Response } from "express";
import { UsersService } from "../../services/users/usersService";
import { RecommendationSerive } from "../../services/products/recommendationService";
import { error } from "node:console";

export class RecommendationController {
    static likeProduct(req: Request, res: Response) {
        const sessionId = req.cookies.sessionId;
        const user = UsersService.getBySessionId(sessionId);
        if (!user) {
            return res.status(401).json({ error: 'Unauhorized' });
        }

        const productId = Number(req.params.productId);
        RecommendationSerive.likeProduct(user.id, productId);
        res.json({ message: "Liked" });
    }

    static getRecommendedProducts(req: Request, res: Response) {
        const sessionId = req.cookies.sessionId;
        const user = UsersService.getBySessionId(sessionId);
        if (!user) {
            return res.status(401).json({ error: 'Unauhorized' });
        }

        const recommendedIds = RecommendationSerive.getRecommendedProducts(user.id);
        const products = recommendedIds.map(id => require('../../database/productsDB').ProductDb.getById(id)).filter(p => p);
        res.json(products);
    }
}