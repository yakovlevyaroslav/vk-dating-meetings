#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

if ! docker info >/dev/null 2>&1; then
  echo "Docker не запущен, запускаю Docker Desktop..."
  open -a Docker
  echo "Жду запуска Docker..."
  until docker info >/dev/null 2>&1; do
    sleep 2
  done
fi

echo "Поднимаю Postgres..."
docker compose up -d db

echo "Жду готовности Postgres..."
until docker compose exec -T db pg_isready -U vkdating >/dev/null 2>&1; do
  sleep 1
done

if [ ! -d node_modules ]; then
  echo "Устанавливаю зависимости..."
  yarn install
fi

if [ -z "$(ls -A prisma/migrations 2>/dev/null)" ]; then
  echo "Создаю первую миграцию..."
  yarn prisma migrate dev --name init
else
  echo "Накатываю миграции..."
  yarn prisma migrate deploy
fi

echo "Засеваю начальные данные..."
yarn db:seed

echo "Запускаю dev-сервер..."
exec yarn dev
