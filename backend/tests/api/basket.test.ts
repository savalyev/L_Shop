import request from 'supertest';
import { app } from '../../src/index';

describe('Basket API', () => {
let agent: any;
let productId: number;

beforeAll(async () => {
agent = request.agent(app);
await agent.post('/api/auth/register').send({ name: 'baskettest', password: 'pass', email: 'b@t.com', phone: '+333' });
await agent.post('/api/auth/login').send({ login: 'baskettest', password: 'pass' });
const productsRes = await agent.get('/api/products');
if (productsRes.body.data && productsRes.body.data.length) {
productId = productsRes.body.data[0].id;
} else {
productId = 1;
}
});

describe('GET /api/basket/mybasket', () => {
it('should return basket for authenticated user', async () => {
const res = await agent.get('/api/basket/mybasket');
expect(res.statusCode).toBe(200);
expect(res.body).toHaveProperty('id');
expect(res.body).toHaveProperty('basket');
});

it('should return 401 if not authenticated', async () => {
const newAgent = request.agent(app);
const res = await newAgent.get('/api/basket/mybasket');
expect(res.statusCode).toBe(401);
});
});

describe('POST /api/basket/add-to-basket', () => {
it('should add product to basket', async () => {
if (!productId) return;
const res = await agent.post('/api/basket/add-to-basket').send({ productId });
expect(res.statusCode).toBe(201);
expect(res.body.userbasket.basket.length).toBeGreaterThan(0);
});

it('should return 400 if productId missing', async () => {
const res = await agent.post('/api/basket/add-to-basket').send({});
expect(res.statusCode).toBe(400);
});

it('should increase quantity when adding same product again', async () => {
if (!productId) return;
await agent.post('/api/basket/add-to-basket').send({ productId });
const basketRes = await agent.get('/api/basket/mybasket');
const item = basketRes.body.basket.find((i: any) => i.productId === productId);
const initialCount = item?.count || 0;
await agent.post('/api/basket/add-to-basket').send({ productId });
const newBasketRes = await agent.get('/api/basket/mybasket');
const newItem = newBasketRes.body.basket.find((i: any) => i.productId === productId);
expect(newItem.count).toBe(initialCount + 1);
});
});

describe('PATCH /api/basket/remove-count', () => {
it('should decrease quantity by 1', async () => {
if (!productId) return;
await agent.post('/api/basket/add-to-basket').send({ productId });
await agent.post('/api/basket/add-to-basket').send({ productId });
const res = await agent.patch('/api/basket/remove-count').send({ productId });
expect(res.statusCode).toBe(200);
const basketRes = await agent.get('/api/basket/mybasket');
const item = basketRes.body.basket.find((i: any) => i.productId === productId);
expect(item.count).toBe(1);
});

it('should remove product when count becomes 0', async () => {
if (!productId) return;
await agent.post('/api/basket/add-to-basket').send({ productId });
await agent.patch('/api/basket/remove-count').send({ productId });
const basketRes = await agent.get('/api/basket/mybasket');
const item = basketRes.body.basket.find((i: any) => i.productId === productId);
expect(item).toBeUndefined();
});
});

describe('DELETE /api/basket/remove-product', () => {
it('should completely remove product from basket', async () => {
if (!productId) return;
await agent.post('/api/basket/add-to-basket').send({ productId });
await agent.post('/api/basket/add-to-basket').send({ productId });
const res = await agent.delete('/api/basket/remove-product').send({ productId });
expect(res.statusCode).toBe(200);
const basketRes = await agent.get('/api/basket/mybasket');
const item = basketRes.body.basket.find((i: any) => i.productId === productId);
expect(item).toBeUndefined();
});
});
});