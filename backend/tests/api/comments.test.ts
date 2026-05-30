import request from 'supertest';
import { app } from '../../src/index';

describe('Comments API', () => {
let agent: any;
let productId: number;

beforeAll(async () => {
agent = request.agent(app);
await agent.post('/api/auth/register').send({ name: 'commenter', password: 'pass', email: 'c@c.com', phone: '+444' });
await agent.post('/api/auth/login').send({ login: 'commenter', password: 'pass' });
const productsRes = await agent.get('/api/products');
productId = productsRes.body.data?.[0]?.id || 1;
});

describe('POST /api/comments', () => {
it('should add comment when authenticated', async () => {
const res = await agent.post('/api/comments').send({
productId,
rating: 5,
text: 'Great product!'
});
expect(res.statusCode).toBe(201);
expect(res.body).toHaveProperty('id');
expect(res.body.rating).toBe(5);
});

it('should return 400 if productId, rating or text missing', async () => {
const res = await agent.post('/api/comments').send({ productId, rating: 5 });
expect(res.statusCode).toBe(400);
});

it('should return 401 if not authenticated', async () => {
const newAgent = request.agent(app);
const res = await newAgent.post('/api/comments').send({ productId, rating: 3, text: 'hi' });
expect(res.statusCode).toBe(401);
});
});

describe('GET /api/comments/product/:productId', () => {
it('should return comments for product', async () => {
const res = await agent.get(`/api/comments/product/${productId}`);
expect(res.statusCode).toBe(200);
expect(Array.isArray(res.body)).toBe(true);
});

it('should return 400 for invalid productId', async () => {
const res = await agent.get('/api/comments/product/abc');
expect(res.statusCode).toBe(400);
});
});

describe('GET /api/comments/product/:productId/avg', () => {
it('should return average rating', async () => {
const res = await agent.get(`/api/comments/product/${productId}/avg`);
expect(res.statusCode).toBe(200);
expect(res.body).toHaveProperty('averageRating');
expect(typeof res.body.averageRating).toBe('number');
});
});
});