# L_Shop

Интернет-магазин. Проект в разработке.

**Стек:** Node.js · TypeScript · Express · React

---

## Запуск бэкенда

```bash
cd backend
npm install
npm run dev
```

Сервер: `http://localhost:3000`

---

## API Reference

### Products — `/api/products`

| Метод | Путь | Описание |
|-------|------|----------|
| `GET` | `/api/products` | Все товары |
| `GET` | `/api/products/:id` | Товар по ID |
| `GET` | `/api/products/by-name?name=` | Поиск по названию |
| `GET` | `/api/products/by-description?description=` | Поиск по описанию |
| `GET` | `/api/products/ascending` | Все товары, цена ↑ |
| `GET` | `/api/products/descending` | Все товары, цена ↓ |
| `GET` | `/api/products/fillters?...` | Товары с фильтрами |
| `POST` | `/api/products` | Создать товар |

#### POST `/api/products` — тело запроса

```json
{
  "title": "string",
  "price": 100,
  "isAvailable": true,
  "description": "string",
  "categories": ["string"],
  "images": {
    "preview": "url",
    "gallery": ["url"]
  },
  "discount": 0,
  "delivery": {
    "startTown": {
      "country": "string",
      "town": "string",
      "street": "string",
      "houseNumber": "string"
    },
    "earlyDate": "2025-01-01T00:00:00.000Z",
    "price": 10
  }
}
```

> `delivery`, `gallery` и все поля внутри `startTown` — опциональны.

---

### Users — `/api/users`

| Метод | Путь | Описание |
|-------|------|----------|
| `GET` | `/api/users` | Все пользователи |
| `GET` | `/api/users/:id` | Пользователь по ID |
| `GET` | `/api/users/by-name?name=` | Поиск по имени |
| `POST` | `/api/users` | Создать пользователя |

#### POST `/api/users` — тело запроса

```json
{
  "name": "string",
  "password": "string",
  "email": "string",
  "phone": "string"
}
```

> `email` и `phone` — опциональны.

---

### Auth - `/api/auth`

| Метод | Путь | Описание |
|-------|------|----------|
| `POST` | `/api/auth/register` | Регистрация |

#### POST `/api/register` — тело запроса

```json
{
  "name": "string",
  "password": "string",
  "email": "string",
  "phone": "string"
}
```

> `email` и `phone` — опциональны.

---

## Структура бэкенда

```
backend/src/
├── controllers/     # обработка запросов
├── database/        # подключение к БД
├── middlewares/     # валидация входящих данных
├── models/          # TypeScript-интерфейсы
├── routers/         # маршруты
├── services/        # бизнес-логика
└── index.ts         # точка входа
```
