import { UserDb } from "../../database/usersDB";
import { User } from "../../models/model";
import { UserCreateBody } from "../../models/model";

export class UsersService {
    static getAll(): User[] {
        return UserDb.getAll();
    }

    static getById(id: number): User | undefined {
        return UserDb.getById(id);
    }

    static getByName(name: string): User | undefined {
        return UserDb.getByName(name);
    }

    static getByPhone(phone: string): User | undefined {
        return UserDb.getByPhone(phone);
    }

    static getByEmail(email: string): User | undefined {
        return UserDb.getByEmail(email);
    }

    static updateSession(userId: number, sessionId: string): User | undefined {
        return UserDb.updateSession(userId, sessionId);
    }

    static getBySessionId(sessionId: string): User | undefined {
        return UserDb.getBySessionId(sessionId);
    }

    static create(item: UserCreateBody): User {
        return UserDb.create(item);
    }

    static logout(sessionId: string): void {
        return UserDb.logout(sessionId);
    }
}