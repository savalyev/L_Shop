import request from 'supertest';
import { app } from '../../src/index';

describe('Roles API (requires admin)', () => {
let adminAgent: any;
let userAgent: any;
let testUserId: number;

beforeAll(async () => {
adminAgent = request.agent(app);
// Предполагается, что в базе есть admin с паролем admin
await adminAgent.post('/api/auth/login').send({ login: 'admin', password: 'admin' });
userAgent = request.agent(app);
await userAgent.post('/api/auth/register').send({ name: 'reguser', password: 'pass', email: 'r@u.com', phone: '+555' });
await userAgent.post('/api/auth/login').send({ login: 'reguser', password: 'pass' });
const meRes = await userAgent.get('/api/users/me');
testUserId = meRes.body.id;
});

describe('POST /api/roles/grant-manager', () => {
it('should allow admin to grant manager role', async () => {
const res = await adminAgent.post('/api/roles/grant-manager').send({ userId: testUserId });
expect(res.statusCode).toBe(200);
expect(res.body.user.role).toBe('manager');
});

it('should deny non-admin user', async () => {
const res = await userAgent.post('/api/roles/grant-manager').send({ userId: testUserId });
expect(res.statusCode).toBe(403);
});

it('should return 400 if userId missing', async () => {
const res = await adminAgent.post('/api/roles/grant-manager').send({});
expect(res.statusCode).toBe(400);
});
});

describe('POST /api/roles/revoke-manager', () => {
it('should revoke manager role', async () => {
const res = await adminAgent.post('/api/roles/revoke-manager').send({ userId: testUserId });
expect(res.statusCode).toBe(200);
expect(res.body.user.role).toBe('user');
});
});

describe('GET /api/roles/users', () => {
it('should return list of users for admin', async () => {
const res = await adminAgent.get('/api/roles/users');
expect(res.statusCode).toBe(200);
expect(Array.isArray(res.body)).toBe(true);
});

it('should deny non-admin', async () => {
const res = await userAgent.get('/api/roles/users');
expect(res.statusCode).toBe(403);
});
});
});