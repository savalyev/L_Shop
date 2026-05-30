import request from 'supertest';
import { app } from '../../src/index';

describe('Auth API', () => {
let agent: any;

beforeAll(() => {
agent = request.agent(app);
});

describe('POST /api/auth/register', () => {
it('should register a new user', async () => {
const res = await agent
.post('/api/auth/register')
.send({
name: 'testuser',
password: 'testpass',
email: 'test@example.com',
phone: '+1234567890'
});
expect(res.statusCode).toBe(201);
expect(res.body.data).toHaveProperty('name', 'testuser');
expect(res.body.data).not.toHaveProperty('password');
});

it('should return 400 if name or password missing', async () => {
const res = await agent.post('/api/auth/register').send({ name: 'onlyname' });
expect(res.statusCode).toBe(400);
});

it('should return 401 if user already exists', async () => {
await agent.post('/api/auth/register').send({ name: 'duplicate', password: '123' });
const res = await agent.post('/api/auth/register').send({ name: 'duplicate', password: '456' });
expect(res.statusCode).toBe(401);
});
});

describe('POST /api/auth/login', () => {
beforeEach(async () => {
await agent.post('/api/auth/register').send({ name: 'loginuser', password: 'secret', email: 'login@ex.com', phone: '+111' });
});

it('should login with name and password', async () => {
const res = await agent.post('/api/auth/login').send({ login: 'loginuser', password: 'secret' });
expect(res.statusCode).toBe(200);
expect(res.headers['set-cookie']).toBeDefined();
});

it('should login with email and password', async () => {
const res = await agent.post('/api/auth/login').send({ login: 'login@ex.com', password: 'secret' });
expect(res.statusCode).toBe(200);
});

it('should return 401 on wrong password', async () => {
const res = await agent.post('/api/auth/login').send({ login: 'loginuser', password: 'wrong' });
expect(res.statusCode).toBe(401);
});

it('should return 400 if login or password missing', async () => {
const res = await agent.post('/api/auth/login').send({ login: 'only' });
expect(res.statusCode).toBe(400);
});
});

describe('POST /api/auth/logout', () => {
it('should clear session cookie', async () => {
await agent.post('/api/auth/register').send({ name: 'logoutuser', password: 'pass', email: 'l@o.com', phone: '+222' });
const loginRes = await agent.post('/api/auth/login').send({ login: 'logoutuser', password: 'pass' });
const cookie = loginRes.headers['set-cookie'];
const logoutRes = await agent.post('/api/auth/logout').set('Cookie', cookie as string[]);
expect(logoutRes.statusCode).toBe(200);
const setCookie = logoutRes.headers['set-cookie'];
expect(setCookie).toBeDefined();
expect((setCookie as string[])[0]).toContain('sessionId=;');
});
});
});