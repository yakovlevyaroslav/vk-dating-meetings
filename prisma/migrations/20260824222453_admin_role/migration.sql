-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('SUPERADMIN', 'ADMIN');

-- AlterTable
ALTER TABLE "AdminUser" ADD COLUMN     "role" "AdminRole" NOT NULL DEFAULT 'ADMIN';

-- До этой миграции все админы создавались только через сид-скрипт (единственный бутстрап-механизм),
-- поэтому все существующие учётки становятся SUPERADMIN — иначе некому будет выдавать права дальше
UPDATE "AdminUser" SET "role" = 'SUPERADMIN';
