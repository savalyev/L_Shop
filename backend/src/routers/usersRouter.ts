import { Router } from "express";
import { UsersController } from "../controllers/users/usersController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { Request, Response } from "express";

const userRouter = Router();

//GET запрос, получение всех пользователей
userRouter.get("/", UsersController.getAll);

//GET запрос, получение пользователя по Name
userRouter.get("/by-name", UsersController.getByName);

//GET запрос, получение пользователя по куки
userRouter.get("/me", authMiddleware, (req: Request, res: Response) => {
    res.json(res.locals.user);
});

//GET запрос, получение пользователя по ID
userRouter.get("/:id", UsersController.getById);

export {userRouter};
