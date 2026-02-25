import express, { Application, Request, Response } from 'express';
import { productsRouter } from './routers/productsRouter';


const app: Application = express();
const PORT = 3000;

app.use(express.json());
app.use('/api/products', productsRouter);



app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
