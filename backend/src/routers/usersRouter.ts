import { Router } from "express";
import { UsersController } from "../controllers/users/usersController";
import { validateUserCreate } from "../middlewares/validateUser";

const userRouter = Router();

//GET запрос, получение всех пользователей
userRouter.get("/", UsersController.getAll);

//GET запрос, получение пользователя по Name
userRouter.get("/by-name", UsersController.getByName);

//GET запрос, получение пользователя по ID
userRouter.get("/:id", UsersController.getById);


//POST запрос, создание пользователя
userRouter.post("/", validateUserCreate, UsersController.create);

export {userRouter};
