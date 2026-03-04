import { Router } from "express";
import { UsersController } from "../controllers/users/usersController";
import { validateUserCreate } from "../middlewares/validateUser";
import { authMiddleware } from "../middlewares/authMiddleware";
import { Request, Response } from "express";

const userRouter = Router();

//GET запрос, получение всех пользователей
userRouter.get("/", UsersController.getAll);

//GET запрос, получение пользователя по Name
userRouter.get("/by-name", UsersController.getByName);

//GET запрос, получение пользователя по куки
userRouter.get("/me", authMiddleware, (req: Request, res: Response) => {
    res.json((req as any).user);
});

//GET запрос, получение пользователя по ID
userRouter.get("/:id", UsersController.getById);

//POST запрос, создание пользователя
userRouter.post("/", validateUserCreate, UsersController.create);

//POST запрос, логаут юзера
userRouter.post("/logout", UsersController.logout);

export {userRouter};
