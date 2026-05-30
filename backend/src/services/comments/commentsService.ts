import { CommentDb } from "../../database/commentsDb";
import { Comment } from "../../models/model";

export class CommentsService{
    static addComment(comment: Omit<Comment, 'id'>): Comment {
        return CommentDb.addComment(comment);
        }
    
        static getCommentsByProduct(productId: number): Comment[] {
            return CommentDb.getCommentsByProduct(productId);
        }
    
        static getAverageRating(productId: number): number {
            return CommentDb.getAverageRating(productId);
        }
}