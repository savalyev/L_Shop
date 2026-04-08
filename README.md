# L_Shop

Интернет-магазин | Инфа для фронта 

---

## Запуск бэкенда

```bash
cd backend
npm install
npm run dev
```

Сервер: `http://localhost:3000`

## Запуск фронта

```bash
cd frontend
npm install
npm run dev
```
Доступ: http://localhost:5173

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
| `GET` | `/api/products/fillters?...` | Товары с фильтрами (category, isAvailable, minPrice, maxPrice) ЧЕРЕЗ QUERY |
| `POST` | `/api/products` | Создать товар |
| `POST` | `/api/products/for-basket` | Получение товаров по массиву ID

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
| `GET` | `/api/users/me` | Получение пользователя по сессии |

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
| `POST` | `/api/auth/login` | Авторизация |
| `POST` | `/api/auth/logout` | Очистка сессиии |

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


 #### POST `/api/auth/login` — тело запроса

```json
{
  "login": "string",
  "password": "string",
}
```

---

### Basket - `/api/basket`

| Метод | Путь | Описание |
|-------|------|----------|
| `GET` | `/api/basket/mybasket` | Получение корзины пользователя по Cookies |
| `POST` | `/api/basket/add-to-basket` | Добавление товара в корзину по Cookies (+1) | 
| `PACTH` | `/api/basket/remove-count` | Удаление товара из корзины по Cookies (-1) |
| `DELETE` | `/api/basket/remove-all'` | Удаление всей корзины по Cookies |
| `DELETE` | `/api/basket/remove-product` | Удаление всей строчки товара из корзины |


#### POST `/api/basket/add-to-basket` — тело запроса

```json
{
  "productId": "number"
}
```

---

### Delivery - `/api/delivery`

| Метод    | Путь                             | Описание                                   |     |
| -------- | -------------------------------- | ------------------------------------------ | --- |
| `GET`    | `/api/delivery/getall`           | Получение всех доставок по userId          |     |
| `GET`    | `/api/delivery/get-all`          | Получение всех доставок по Cookies         |     |
| `POST`   | `/api/delivery/`                 | Создание новой доставки по userId          |     |
| `POST`   | `/api/delivery/createDeliv`      | Создание новой доставки по Cookies         |     |
| `DELETE` | `/api/delivery/delete-delivery'` | Удаление одной позиции доставки по userId  |     |
| `DELETE` | `/api/delivery/remove-delivery`  | Удаление одной позиции доставки по Cookies |     |
|          |                                  |                                            |     |

#### POST `/api/delivery/createDeliv` — тело запроса

```json
{
      "Address": {
        "country": "string",
        "town": "string",
        "street": "string",
        "houseNumber": "string"
    }
}
```

___________________________
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
