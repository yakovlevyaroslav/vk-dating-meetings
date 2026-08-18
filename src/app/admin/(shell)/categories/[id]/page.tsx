import { notFound } from 'next/navigation';

import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { prisma } from '@/core/db/prisma';

import { deleteCategory, updateCategory } from '../actions';
import { CategoryForm } from '../CategoryForm';

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage(props: EditCategoryPageProps) {
  const { id } = await props.params;

  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    notFound();
  }

  const currentCategory = category;
  const updateCategoryWithId = updateCategory.bind(null, currentCategory.id);

  async function handleDelete() {
    'use server';
    await deleteCategory(currentCategory.id);
  }

  return (
    <>
      <SiteHeader title={category.name} />
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <CategoryForm
          action={updateCategoryWithId}
          submitLabel="Сохранить"
          defaultValues={{
            name: category.name,
            emoji: category.emoji ?? '',
          }}
        />
        <form action={handleDelete}>
          <Button type="submit" variant="destructive">
            Удалить категорию
          </Button>
        </form>
      </div>
    </>
  );
}
