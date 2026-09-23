-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN     "suggestPlaceUrl" TEXT;

-- Переносим ранее захардкоженную в коде ссылку кнопки «Предложить место» в настройки,
-- чтобы после деплоя кнопка не пропала с сайта
UPDATE "SiteSettings" SET "suggestPlaceUrl" = 'https://app.pthwy.ru/hUvS0' WHERE "id" = 'main';
