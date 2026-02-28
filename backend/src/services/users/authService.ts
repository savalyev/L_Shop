import * as bcrypt from 'bcryptjs'; 
import crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

import { UsersService } from "./usersService";
import { User, UserCreateBody } from "../../models/model";

export class UserExistsError extends Error {
  constructor(message = 'User already exists') {
    super(message);
    this.name = message ;
  }
}

function hashPasswordSync(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function generateSessionId(): string {
    return crypto.randomBytes(16).toString('hex');
}

export class AuthService{
    static register(item: UserCreateBody){
         const user = UsersService.getByName(item.name);

         if(user){
            throw new UserExistsError();
         }

         const passwordHash = hashPasswordSync(item.password);

           const newUser = UsersService.create({
            ...item,
            password: passwordHash,
        });
         return newUser;
    }

    static login(item: UserCreateBody){
        const user = UsersService.getByName(item.name);

        if(!user){
          throw new UserExistsError("Пользователь не найден");
        }

        const isValid = bcrypt.compareSync(item.password, user.password);

        if(!isValid){
          throw new UserExistsError("Пароль не верный!");
        }

        return user;
    }
}