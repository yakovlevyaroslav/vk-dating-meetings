# Места неслучайных свиданий

Лендинг с картой мест и маршрутов для свиданий (VK Знакомства) + админ-панель для их наполнения.

Next.js 16 (App Router, Turbopack) · Prisma 7 · PostgreSQL · Auth.js.

## Локальная разработка

```bash
cp .env.example .env   # заполнить переменные окружения
./start.sh             # поднимает Postgres в Docker, накатывает миграции, сидирует данные, запускает dev-сервер
```

Либо вручную:

```bash
docker compose up -d db
yarn install
npx prisma migrate deploy
yarn db:seed
yarn dev
```

Сайт — http://localhost:3000, админка — http://localhost:3000/admin/login.

## Полезные команды

```bash
yarn typecheck     # проверка типов
yarn lint          # eslint
yarn build         # прод-сборка
yarn db:studio     # Prisma Studio — просмотр БД
```

## Деплой

Полная инструкция по выгрузке на VPS (Ubuntu) — в [DEPLOY.md](./DEPLOY.md): установка Postgres, переменные окружения, сборка, запуск через PM2, nginx + SSL, добавление админов, бэкапы.
