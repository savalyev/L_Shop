import { AuthService, AuthError, generateSessionId } from '../../src/services/users/authService';
import { UsersService } from '../../src/services/users/usersService';
import * as bcrypt from 'bcryptjs';
import { User } from '../../src/models/model';

jest.mock('../../src/services/users/usersService');
jest.mock('bcryptjs');

const mockedUsersService = UsersService as jest.Mocked<typeof UsersService>;
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
beforeEach(() => {
jest.resetAllMocks();
});

describe('register', () => {
it('should create new user if name not taken', () => {
mockedUsersService.getByName.mockReturnValue(undefined);
const fakeUser: User = { id: 1, name: 'newuser', password: 'hash', email: '', phone: '', role: 'user' };
mockedUsersService.create.mockReturnValue(fakeUser);
mockedBcrypt.hashSync.mockReturnValue('hash');

const user = AuthService.register({ name: 'newuser', password: 'pass', email: 'e@ma.il', phone: '+123' });
expect(user.id).toBe(1);
expect(mockedUsersService.create).toHaveBeenCalledWith(expect.objectContaining({ password: 'hash' }));
});

it('should throw AuthError if user exists', () => {
const existingUser: User = { id: 1, name: 'existing', password: 'old', email: '', phone: '', role: 'user' };
mockedUsersService.getByName.mockReturnValue(existingUser);
expect(() => AuthService.register({ name: 'existing', password: 'pass', email: '', phone: '' })).toThrow(AuthError);
});
});

describe('login', () => {
it('should return user if name and password match', () => {
const fakeUser: User = { id: 1, name: 'test', password: 'hash', email: '', phone: '', role: 'user' };
mockedUsersService.getByName.mockReturnValue(fakeUser);
mockedBcrypt.compareSync.mockReturnValue(true);
const user = AuthService.login({ name: 'test', password: 'pass', email: '', phone: '' });
expect(user).toBe(fakeUser);
});

it('should try email if name not found', () => {
mockedUsersService.getByName.mockReturnValue(undefined);
const emailUser: User = { id: 2, name: 'byemail', password: 'hash', email: 'e@ma.il', phone: '', role: 'user' };
mockedUsersService.getByEmail.mockReturnValue(emailUser);
mockedBcrypt.compareSync.mockReturnValue(true);
const user = AuthService.login({ name: 'e@ma.il', password: 'pass', email: '', phone: '' });
expect([user.name](https://user.name)).toBe('byemail');
});

it('should throw AuthError if password incorrect', () => {
const fakeUser: User = { id: 1, name: 'test', password: 'hash', email: '', phone: '', role: 'user' };
mockedUsersService.getByName.mockReturnValue(fakeUser);
mockedBcrypt.compareSync.mockReturnValue(false);
expect(() => AuthService.login({ name: 'test', password: 'wrong', email: '', phone: '' })).toThrow(AuthError);
});
});

describe('generateSessionId', () => {
it('should return 32 character hex string', () => {
const sid = generateSessionId();
expect(sid).toMatch(/^[a-f0-9]{32}$/);
});
});
});