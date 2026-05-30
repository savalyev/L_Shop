import * as fs from "fs";
import * as path from 'path';
import { User } from "../models/model";

const filePath = path.resolve(__dirname, "users.json");

/**
 * Безопасно читает данные из JSON-файла с пользователями.
 * Если файл не существует или поврежден, возвращает пустой массив.
 * @returns {User[]} Массив пользователей.
 */
function readData(): User[] {
    try {
        if (!fs.existsSync(filePath)) {
            console.warn(`Файл ${filePath} не найден, возвращаю []`);
            return [];
        }
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed: User[] = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed as User[] : [];
    } catch (e) {
        console.error("Ошибка чтения JSON user: ", e);
        return [];
    }
}

/**
 * Класс для работы с базой данных пользователей (через JSON-файл).
 */
export class UserDb {
    /**
     * Получает список всех пользователей.
     * @returns {User[]} Массив всех пользователей.
     */
    static getAll(): User[] {
        return readData();
    }

    /**
     * Находит пользователя по его уникальному идентификатору (ID).
     * @param {number} id - Идентификатор пользователя.
     * @returns {User | undefined} Найденный пользователь или undefined.
     */
    static getById(id: number): User | undefined {
        const data = readData();
        return data.find((f: User) => f.id === id);
    }

    /**
     * Находит пользователя по имени.
     * @param {string} name - Имя пользователя.
     * @returns {User | undefined} Найденный пользователь или undefined.
     */
    static getByName(name: string): User | undefined {
        const data = readData();
        return data.find((f: User) => f.name === name);
    }

    /**
     * Находит пользователя по номеру телефона.
     * @param {string} phone - Номер телефона пользователя.
     * @returns {User | undefined} Найденный пользователь или undefined.
     */
    static getByPhone(phone: string): User | undefined {
        const data = readData();
        return data.find((f: User) => f.phone === phone);
    }

    /**
     * Находит пользователя по email.
     * @param {string} email - Email пользователя.
     * @returns {User | undefined} Найденный пользователь или undefined.
     */
    static getByEmail(email: string): User | undefined {
        const data = readData();
        return data.find((f: User) => f.email === email);
    }

    /**
     * Обновляет идентификатор сессии (sessionId) для пользователя при входе в систему.
     * @param {number} userId - Идентификатор пользователя.
     * @param {string} sessionId - Новый идентификатор сессии.
     * @returns {User | undefined} Обновленный пользователь или undefined, если не найден.
     */
    static updateSession(userId: number, sessionId: string): User | undefined {
        const data = readData();
        const index = data.findIndex(u => u.id === userId);
        
        if (index === -1) return undefined;

        data[index].sessionId = sessionId;
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');

        return data[index];
    }

    /**
     * Находит пользователя по его идентификатору сессии.
     * Используется для аутентификации пользователей через cookie.
     * @param {string} sessionId - Идентификатор сессии.
     * @returns {User | undefined} Найденный пользователь или undefined.
     */
    static getBySessionId(sessionId: string): User | undefined {
        const data = readData();
        return data.find((f: User) => f.sessionId === sessionId);
    }

    /**
     * Создает нового пользователя, автоматически присваивает ему ID и сохраняет в файл.
     * @param {Partial<User>} item - Данные нового пользователя из формы регистрации.
     * @returns {User} Созданный пользователь.
     */
    static create(item: Partial<User>): User {
        const data = readData();
        const maxId = data.length > 0
            ? data.reduce((m, f) => Math.max(m, f.id || 0), 0) 
            : 0;
            
        const newItem: User = {
            id: maxId + 1,
            name: item.name || "",
            password: item.password || "",
            email: item.email || "",
            phone: item.phone || "",
            role: 'user'
        };
        
        data.push(newItem);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        return newItem;
    }

    /**
     * Удаляет сессию пользователя (выход из системы/logout).
     * @param {string} sessionId - Идентификатор сессии, которую нужно удалить.
     */
    static logout(sessionId: string): void {
        const data = readData();
        const index = data.findIndex(item => item.sessionId === sessionId);

        // ВАЖНОЕ ИСПРАВЛЕНИЕ: проверяем, что сессия найдена, чтобы не вызвать ошибку undefined
        if (index !== -1) {
            data[index].sessionId = "";
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        }
    }
}