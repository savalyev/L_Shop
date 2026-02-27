import express, { Application, Request, Response } from 'express';
import { productsRouter } from './routers/productsRouter';
import { userRouter } from './routers/usersRouter';
import { authRouter } from './routers/authRouter';
import cookieParser from 'cookie-parser';


const app: Application = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());
app.use('/api/products', productsRouter);
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
