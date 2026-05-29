import { Request, Response } from "express";
import { CommentsService } from "../../services/comments/commentsService";
import { UsersService } from "../../services/users/usersService";
import { error } from "node:console";

export class CommentsController {
    static async addComment(req: Request, res: Response) {
        const sessionId = req.cookies.sessionId;
        const user = UsersService.getBySessionId(sessionId);
        if (!user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const { productId, rating, text } = req.body;
        if (!productId || !rating || !text) {
            res.status(400).json({ error: 'productId, rating, text required' });
            return;
        }

        const comment = CommentsService.addComment({
            productId: Number(productId),
            userId: user.id,
            userName: user.name,
            rating: Number(rating),
            text,
            date: new Date().toISOString()
        });

        res.status(201).json(comment);

    }

    static async getComments(req: Request, res: Response) {
        const productId = Number(req.params.productId);
        if (isNaN(productId)) {
            res.status(400).json({ error: 'Invalid productId' });
            return;
        }

        const comments = CommentsService.getCommentsByProduct(productId);
        res.json(comments);
    }

    static async getAverageRating(req: Request, res: Response) {
        const productId = Number(req.params.productId);
        if (isNaN(productId)) {
            res.status(400).json({ error: 'Invalid productId' });
            return;
        }

        const avg = CommentsService.getAverageRating(productId);
        res.json({ averageRating: avg });
    }
}