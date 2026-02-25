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

    static create(item: UserCreateBody): User {
        return UserDb.create(item);
    }
}