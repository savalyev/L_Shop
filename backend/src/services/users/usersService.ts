import { UserDb } from "../../database/usersDB";
import { User } from "../../models/model";
import { UserCreateBody } from "../../models/model";

export class UsersService {
    static getAll(){
        return UserDb.getAll();
    }

    static getById(id: number){
        return UserDb.getById(id);
    }

    static getByName(name: string){
        return UserDb.getByName(name);
    }

    static getByPhone(phone: string): User | undefined {
        return UserDb.getByPhone(phone);
    }

    static getByEmail(email: string): User | undefined {
        return UserDb.getByEmail(email);
    }

    static updateSession(userId: number, sessionId: string) {
        return UserDb.updateSession(userId, sessionId);
    }

    static getBySessionId(sessionId: string){
        return UserDb.getBySessionId(sessionId);
    }

    static create(item: UserCreateBody): User {
        return UserDb.create(item);
    }

    static logout(sessionId: string){
        return UserDb.logout(sessionId);
    }
}