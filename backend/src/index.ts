import express, { Application, Request, Response } from 'express';
import { productsRouter } from './routers/productsRouter';
import { userRouter } from './routers/usersRouter';
import { authRouter } from './routers/authRouter';
import { basketRouter } from './routers/basketRouter';
import { deliveryRouter } from './routers/deliveryRouter';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';


const app: Application = express();
const PORT = 3000;

app.use(cors({
  origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
  credentials: true
}));

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'L_Shop API',
      version: '1.0.0',
      description: 'Документация API для лабораторной работы'
    },
    servers: [
      {
        url: 'http://localhost:3000'
      }
    ]
  },
  apis: ['src/routers/*.ts', './controllers/*.ts', "src/docs/*.yaml"]
};

const swaggerSpec = swaggerJSDoc(options);


app.use(express.json());
app.use(cookieParser());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/products', productsRouter);
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/basket', basketRouter);
app.use('/api/delivery', deliveryRouter);

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
