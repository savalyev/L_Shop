import * as fs from 'fs';
import * as path from 'path';
import { ProductDb } from '../../database/productsDB';
import { ProductTag, UserTagPreference } from '../../models/model';

const tagsFilePath = path.resolve(__dirname, '../../database/tags.json');
const userTagsFilePath = path.resolve(__dirname, "../../database/user_tags.json");

function readProductTags(): ProductTag[] {
    if (!fs.existsSync(tagsFilePath)) return [];
    return JSON.parse(fs.readFileSync(tagsFilePath, 'utf-8'));
}

function writeProductTags(data: ProductTag[]) {
    fs.writeFileSync(tagsFilePath, JSON.stringify(data, null, 2));
}

function readUserTags(): UserTagPreference[] {
    if (!fs.existsSync(userTagsFilePath)) return [];
    return JSON.parse(fs.readFileSync(userTagsFilePath, 'utf-8'));
}

function writeUserTags(data: UserTagPreference[]) {
    fs.writeFileSync(userTagsFilePath, JSON.stringify(data, null, 2));
}

export class RecommendationSerive {
    static addProductTags(productId: number, tags: string[]) {
        const productTags = readProductTags();
        const existing = productTags.find(p => p.productId === productId);
        if (existing) {
            existing.tags = [...new Set([...existing.tags, ...tags])];
        } else {
            productTags.push({ productId, tags });
        }
        writeProductTags(productTags);
    }

    static likeProduct(userId: number, productId: number) {
        const productTags = readProductTags().find(p => p.productId === productId);
        if (!productTags) return;

        let userPrefs = readUserTags();
        let userPref = userPrefs.find(u => u.userId === userId);

        if (!userPref) {
            userPref = { userId, tagWeights: {}, lastUpdated: new Date().toISOString() };
            userPrefs.push(userPref);
        }

        for (const tag of productTags.tags) {
            userPref.tagWeights[tag] = (userPref.tagWeights[tag] || 0) + 1;
        }

        userPref.lastUpdated = new Date().toISOString();
        writeUserTags(userPrefs);
    }

    static getRecommendedProducts(userId: number, limit: number = 6): number[] {
        const userPrefs = readUserTags().find(u => u.userId === userId);
        if (!userPrefs) return [];

        const last = new Date(userPrefs.lastUpdated);
        const daysDiff = (Date.now() - last.getTime()) / (1000 * 3600 * 24);
        if (daysDiff > 3) {
            for (const tag in userPrefs.tagWeights) {
                userPrefs.tagWeights[tag] = Math.max(0, userPrefs.tagWeights[tag] - Math.floor(daysDiff));
            }
            writeUserTags(readUserTags().map(u => u.userId === userId ? userPrefs : u));
        }

        const sortedTags = Object.entries(userPrefs.tagWeights).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([tag]) => tag);
        if (sortedTags.length === 0) return [];

        const allProducts = ProductDb.getAll();
        const productScores: Record<number, number> = {};

        for (const product of allProducts) {
            const prodTags = readProductTags().find(p => p.productId === product.id)?.tags || [];
            let score = 0;
            for (const tag of prodTags) {
                if (sortedTags.includes(tag)) score += userPrefs.tagWeights[tag] || 0;
            }
            if (score > 0) productScores[product.id] = score;
        }

        const sorted = Object.entries(productScores).sort((a, b) => b[1] - a[1]).map(([id]) => Number(id));

        return sorted.slice(0, limit);
    }
}