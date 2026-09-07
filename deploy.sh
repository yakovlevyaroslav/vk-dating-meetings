#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

if [ ! -f .env ]; then
  echo "Не найден .env в $(pwd) — прерываю, чтобы не пересобрать проект без конфигурации." >&2
  exit 1
fi

echo "Забираю обновления из git..."
git pull

echo "Устанавливаю зависимости..."
yarn install --frozen-lockfile

echo "Накатываю миграции БД..."
npx prisma migrate deploy

echo "Генерирую Prisma Client..."
npx prisma generate

echo "Собираю проект..."
export NEXT_DEPLOYMENT_ID="$(git rev-parse --short HEAD)"
yarn build

echo "Перезапускаю приложение..."
if pm2 describe vk-dating > /dev/null 2>&1; then
  pm2 restart vk-dating
else
  echo "Процесс vk-dating не найден в PM2 — запускаю впервые."
  pm2 start yarn --name vk-dating -- start
fi
pm2 save

echo "Готово. Статус:"
pm2 status vk-dating
