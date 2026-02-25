import * as fs from "fs";
import * as path from 'path';
import { User } from "../models/model";

const filePath = path.resolve(__dirname, "users.json");

function readData(): User[] {
    try{
        if(!fs.existsSync(filePath)){
            console.warn(`Файл ${filePath} не найден, возращаю []`);
            return [];
        }
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed as User[] : [];
    } catch (e){
        console.error("Ошибка чтения JSON user: ", e);
        return[];
    }
}

export class UserDb{
    static getAll(){
        return readData();
    }

    static getById(id: number){
        const data = readData();
        return data.find((f: User) => f.id === id);
    }

    static getByName(name: string){
        const data = readData();
        return data.find((f: User) => f.name === name);
    }

    static create(item: Partial<User>): User {
        const data = readData();
        const maxId = data.length > 0
            ? data.reduce((m, f) => Math.max(m, f.id || 0), 0) : 0;
        const newItem: User = {
            id: maxId + 1,
            name: item.name || "",
            password: item.password || "",
            email: item.email || "",
            phone: item.phone || "",
        };
        data.push(newItem);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        return newItem;
    }
}