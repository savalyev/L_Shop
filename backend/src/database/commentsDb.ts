import * as fs from 'fs';
import * as path from 'path';
import { Comment } from '../models/model';

const filePath = path.resolve(__dirname, "comments.json");

function readComments(): Comment[] {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath, 'utf-8');
    if(!data.trim()) return [];
    return JSON.parse(data);
}

function writeComments(comments: Comment[]) {
    fs.writeFileSync(filePath, JSON.stringify(comments, null, 2));
}

export class CommentDb {
    static addComment(comment: Omit<Comment, 'id'>): Comment {
        const comments = readComments();
        const newId = comments.length ? Math.max(...comments.map(c => c.id)) + 1 : 1;
        const newComment = { ...comment, id: newId };
        comments.push(newComment);
        writeComments(comments);
        return newComment;
    }

    static getCommentsByProduct(productId: number): Comment[] {
        const comments = readComments();
        return comments.filter(c => c.productId === productId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    static getAverageRating(productId: number): number {
        const comments = readComments().filter(c => c.productId === productId);
        if (comments.length === 0) return 0;
        const sum = comments.reduce((acc, c) => acc + c.rating, 0);
        return sum / comments.length;
    }
}

