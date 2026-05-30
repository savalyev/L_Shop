import { UserDb } from "../../database/usersDB";
import { User } from "../../models/model";

export class RolesService {
    static setRole(userId: number, role: 'user' | 'manager' | 'admin'): User | undefined {
        const users = UserDb.getAll();
        const index = users.findIndex(r => r.id == userId);

        if(index === -1) return undefined;

        users[index].role = role;

        const fs = require('fs');
        const path = require('path');
        const filePath = path.resolve(__dirname, '../../database/users.json');
        fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
        
        return users[index];
    }

}