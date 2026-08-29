# Деплой на VPS (Ubuntu)

Пошаговая инструкция по выгрузке проекта «Места неслучайных свиданий» на чистый VPS с Ubuntu 22.04/24.04, настройке базы данных, запуску и обслуживанию.

Стек: Next.js 16 (App Router) + Prisma 7 + PostgreSQL, авторизация в админке через Auth.js (credentials), файлы (фото мест/маршрутов) хранятся на диске сервера в `public/uploads`.

---

## 0. Что потребуется заранее

- VPS с Ubuntu 22.04 или 24.04, доступ по SSH с правами sudo.
- Домен (или поддомен), A-запись которого указывает на IP VPS — нужен для нормальной работы HTTPS. Без домена сайт можно поднять по IP, но без SSL.
- Ключ API Яндекс.Карт (`NEXT_PUBLIC_YANDEX_MAPS_API_KEY`) — https://yandex.ru/maps-api/docs/js-api/common/connection/typescript.html
- (опционально) ID счётчиков Яндекс.Метрики и MyTracker — если не заданы, трекеры просто не подключаются, сайт работает без них.

---

## 1. Базовая подготовка сервера

Подключитесь по SSH и обновите систему:

```bash
sudo apt update && sudo apt upgrade -y
```

Создайте отдельного пользователя для приложения (не работайте под root):

```bash
sudo adduser deploy
sudo usermod -aG sudo deploy
su - deploy
```

Дальше все команды выполняются от имени `deploy`, если не указано иное.

### Firewall

```bash
sudo apt install -y ufw
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## 2. Node.js 22

Проект собран и проверен на Node 22. Ставим через NodeSource:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v   # v22.x
```

Yarn (в проекте используется yarn.lock):

```bash
sudo npm install -g yarn
yarn -v
```

---

## 3. PostgreSQL: установка, база, пользователь, права

```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable --now postgresql
```

Создайте пользователя БД и саму базу (замените `ВАШ_ПАРОЛЬ` на свой надёжный пароль):

```bash
sudo -u postgres psql <<'SQL'
CREATE USER vkdating WITH PASSWORD 'ВАШ_ПАРОЛЬ';
CREATE DATABASE vkdating OWNER vkdating;
GRANT ALL PRIVILEGES ON DATABASE vkdating TO vkdating;
SQL
```

По умолчанию Postgres слушает только `localhost` (`/etc/postgresql/*/main/postgresql.conf`, `listen_addresses = 'localhost'`) — это нормально и безопасно, так как приложение и БД будут на одном сервере. Открывать порт 5432 наружу не нужно (в ufw он не разрешён — и не должен быть).

Строка подключения для `.env`:

```
DATABASE_URL="postgresql://vkdating:ВАШ_ПАРОЛЬ@localhost:5432/vkdating?schema=public"
```

---

## 4. Выгрузка кода на сервер

### Вариант А — через git (рекомендуется)

Репозиторий уже на GitHub. На сервере:

```bash
sudo apt install -y git
cd ~
git clone https://github.com/yakovlevyaroslav/vk-dating-meetings.git app
cd app
git checkout main   # или develop — смотря какую ветку деплоите
```

Для приватного репозитория настройте доступ (deploy key или personal access token) — см. https://docs.github.com/en/authentication/connecting-to-github-with-ssh

### Вариант Б — вручную (rsync/scp)

Если репозиторий недоступен с сервера, залейте проект с локальной машины (без `node_modules`, `.next`, `.git` — они не нужны/будут пересозданы):

```bash
rsync -avz --exclude node_modules --exclude .next --exclude .git \
  /Users/yakovlev/Desktop/Freelance/PRhub/vk-project-august/ \
  deploy@ВАШ_IP:~/app/
```

---

## 5. Переменные окружения

В корне проекта на сервере создайте `.env` (за образец — `.env.example`):

```bash
cd ~/app
cp .env.example .env
nano .env
```

Заполните:

```
DATABASE_URL="postgresql://vkdating:ВАШ_ПАРОЛЬ@localhost:5432/vkdating?schema=public"

AUTH_SECRET="сгенерировать командой ниже"
AUTH_TRUST_HOST=true

ADMIN_SEED_EMAIL="ваш-email@example.com"
ADMIN_SEED_PASSWORD="надёжный-пароль-админа"

NEXT_PUBLIC_YANDEX_MAPS_API_KEY="ключ из кабинета Яндекс.Карт"

NEXT_PUBLIC_YANDEX_METRIKA_ID=""
NEXT_PUBLIC_MY_TRACKER_ID=""
```

Сгенерировать `AUTH_SECRET`:

```bash
npx --yes auth secret --raw
# либо
openssl rand -base64 32
```

`AUTH_TRUST_HOST=true` обязателен, когда приложение стоит за reverse-proxy (nginx) — иначе Auth.js будет отклонять запросы, не доверяя заголовкам хоста.

`ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD` — учётка первого администратора (суперадмина), создаётся на шаге сидирования (см. ниже). Остальных админов и смену паролей после этого можно делать прямо в админке — см. раздел «Добавление и смена админов».

---

## 6. Установка зависимостей, миграции, сборка

```bash
cd ~/app
yarn install --frozen-lockfile

# накатить все миграции на чистую базу
npx prisma migrate deploy

# сгенерировать Prisma Client (папка src/generated/prisma не хранится в git)
npx prisma generate

# создать города и первого админа
yarn db:seed

# продакшн-сборка
yarn build
```

Если что-то из этого упадёт с ошибкой подключения к БД — проверьте `DATABASE_URL` и что `postgresql` запущен (`sudo systemctl status postgresql`).

---

## 7. Запуск через PM2

PM2 держит процесс живым, перезапускает при падении и после перезагрузки сервера.

```bash
sudo npm install -g pm2

cd ~/app
pm2 start yarn --name vk-dating -- start
pm2 save
pm2 startup systemd -u deploy --hp /home/deploy
```

Последняя команда выведет одну `sudo`-команду — выполните её, она пропишет автозапуск PM2 при старте сервера.

Приложение слушает `localhost:3000`. Полезные команды:

```bash
pm2 status
pm2 logs vk-dating
pm2 restart vk-dating
```

---

## 8. Nginx: reverse proxy + HTTPS

```bash
sudo apt install -y nginx
```

Создайте конфиг `/etc/nginx/sites-available/vk-dating`:

```nginx
server {
    listen 80;
    server_name ваш-домен.ru www.ваш-домен.ru;

    client_max_body_size 15m;

    location /uploads/ {
        alias /home/deploy/app/public/uploads/;
        access_log off;
        expires 30d;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

`client_max_body_size 15m` — важно: форма загрузки фото в админке принимает файлы до 10 МБ, nginx по умолчанию режет на 1 МБ.

**Блок `location /uploads/` обязателен** — фото загружаются в `public/uploads` уже во время работы приложения (после сборки), а Next.js в этой версии знает только о файлах, которые лежали в `public/` на момент `yarn build`. Если пустить `/uploads/*` через `proxy_pass` вместе со всем остальным, Next.js будет возвращать 404 на любое фото, загруженное после последней сборки. Отдавать эти файлы должен напрямую nginx, в обход приложения. Путь в `alias` укажите свой — под пользователем `deploy` это `/home/deploy/app/public/uploads/`, если работаете под `root` — `/root/app/public/uploads/` (обязательно с завершающим слэшем в обоих местах).

Если работаете под `root` (домашняя папка `/root` по умолчанию имеет права `700` — воркер nginx под `www-data` физически не может в неё зайти, даже если у файлов внутри права на чтение открыты), дайте nginx право пройти через неё:

```bash
sudo chmod o+x /root
```

Это не открывает содержимое `/root` на просмотр — только позволяет "проходить" дальше по известному пути. Для пользователя `deploy` (создан в шаге 1) обычно так делать не нужно — домашняя папка обычного пользователя в Ubuntu по умолчанию доступна для прохода.

Проверить, что nginx реально отдаёт файл (а не проксирует в приложение):
```bash
curl -I https://ваш-домен.ru/uploads/places/имя-файла.jpg
```
Ответ `200 OK` без заголовков `x-nextjs-*` — значит, отдаёт nginx. Если `403 Forbidden` — проблема в правах на директории по пути, найти обрыв поможет:
```bash
namei -l /home/deploy/app/public/uploads/places/имя-файла.jpg
```

```bash
sudo ln -s /etc/nginx/sites-available/vk-dating /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### SSL через Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d ваш-домен.ru -d www.ваш-домен.ru
```

Certbot сам допишет `listen 443 ssl` в конфиг и настроит редирект с 80 на 443. Автопродление уже включено как systemd-таймер (`sudo systemctl status certbot.timer`).

Проверьте сайт: `https://ваш-домен.ru`.

---

## 9. Добавление и смена админов

Есть два уровня доступа:

- **Суперадмин** — видит в сайдбаре раздел «Админы» (`/admin/admins`) и может создавать, удалять администраторов и менять им роль/пароль.
- **Админ** — доступ ко всему остальному контенту (Места, Маршруты, Категории, Города, Настройки), но не может управлять другими админами.

Первый администратор (`ADMIN_SEED_EMAIL`/`ADMIN_SEED_PASSWORD` из `.env`) создаётся сид-скриптом и всегда получает роль **суперадмин** — это единственный бутстрап-механизм, дальше всё делается через UI.

Добавить нового админа: `/admin/admins` → «Добавить админа» → email, имя, пароль, роль.

Сменить пароль или роль существующему админу: открыть его в списке `/admin/admins`, поле «Новый пароль» — оставить пустым, если менять не нужно.

Встроенные ограничения (защита от блокировки доступа):

- нельзя удалить свою собственную учётку;
- нельзя удалить или понизить в роли последнего оставшегося суперадмина.

Если суперадмин один и забыл пароль (крайний случай, когда зайти в UI уже нельзя) — сбросить пароль напрямую через `yarn db:seed` с новым паролем для того же email:

```bash
sudo -u postgres psql -d vkdating -c "DELETE FROM \"AdminUser\" WHERE email = 'email@example.com';"
cd ~/app
ADMIN_SEED_EMAIL="email@example.com" ADMIN_SEED_PASSWORD="новый-пароль" yarn db:seed
```

Посмотреть список текущих админов из БД:

```bash
sudo -u postgres psql -d vkdating -c 'SELECT email, name, role, "createdAt" FROM "AdminUser";'
```

Админка доступна по адресу `/admin/login`.

---

## 10. Хранение загруженных файлов

Фото мест/маршрутов, загруженные через админку, сохраняются на диск сервера в `~/app/public/uploads/...` (не в БД и не в облако). Это значит:

- Эта папка **не в git** (см. `.gitignore`) — при обновлении кода (`git pull`) она не пострадает, но и не переносится автоматически на другой сервер.
- При переезде на новый VPS не забудьте скопировать `public/uploads` вместе с базой данных.
- Регулярно включайте эту папку в бэкапы (см. ниже).

---

## 11. Обновление проекта после изменений

После любых изменений — обновили код через git, поменяли `.env`, что угодно — запускайте один скрипт:

```bash
cd ~/app
./deploy.sh
```

Он сам сделает `git pull`, поставит зависимости, накатит миграции, соберёт проект и перезапустит PM2. `prisma migrate deploy` безопасно применяет только новые миграции, ничего не спрашивает и не трогает данные. Если сборка (`yarn build`) упадёт с ошибкой — скрипт остановится до `pm2 restart`, и старая рабочая версия останется запущенной, сайт не ляжет.

Если поменяли только `.env` и код не трогали — тоже просто гоняйте `./deploy.sh`: `git pull` без новых коммитов ничего не сломает, а пересборка нужна, если менялась любая переменная с префиксом `NEXT_PUBLIC_*` (они запекаются в сборку на этапе `yarn build`, простого рестарта недостаточно). Переменные без этого префикса (`DATABASE_URL`, `AUTH_SECRET` и т.д.) подхватились бы и одним рестартом, но проще всегда гонять один и тот же скрипт, не разбираясь каждый раз, какая именно переменная менялась.

---

## 12. Бэкапы

Минимальный вариант — ежедневный дамп БД и архив загрузок в cron:

```bash
mkdir -p ~/backups
crontab -e
```

Добавить строку (бэкап в 4 утра, хранить точки входа вручную/через отдельный скрипт ротации):

```
0 4 * * * pg_dump -U vkdating -h localhost vkdating | gzip > /home/deploy/backups/db_$(date +\%F).sql.gz
0 4 * * * tar -czf /home/deploy/backups/uploads_$(date +\%F).tar.gz -C /home/deploy/app/public uploads
```

Для `pg_dump` без интерактивного пароля добавьте строку в `~/.pgpass` (`localhost:5432:vkdating:vkdating:ВАШ_ПАРОЛЬ`, права `chmod 600 ~/.pgpass`).

---

## 13. Восстановление БД из дампа (если понадобится)

```bash
gunzip -c /home/deploy/backups/db_ДАТА.sql.gz | psql -U vkdating -h localhost vkdating
```

---

## Чек-лист после первого деплоя

- [ ] `https://ваш-домен.ru` открывается, есть замок SSL
- [ ] `/moscow` и `/saintp` показывают карту и места
- [ ] `/admin/login` пускает по `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD`
- [ ] Загрузка фото в админке (Места/Маршруты) работает и файл реально сохраняется в `public/uploads`
- [ ] `pm2 status` — процесс `vk-dating` в статусе `online`
- [ ] `pm2 startup` подтверждён — процесс поднимется сам после перезагрузки сервера (проверить `sudo reboot` и зайти повторно)
