import express, { Application, Request, Response } from 'express';

const app: Application = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Первый HTTP запрос');
});

app.get('/user', (req: Request, res: Response) => {
  res.send("Тут микрочелик...")
})

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});