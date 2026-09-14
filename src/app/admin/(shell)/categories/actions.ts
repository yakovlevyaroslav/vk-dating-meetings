'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { prisma } from '@/core/db/prisma';

function readCategoryFields(formData: FormData) {
  const priorityRaw = Number(formData.get('priority'));

  return {
    name: String(formData.get('name') ?? '').trim(),
    emoji: String(formData.get('emoji') ?? '').trim() || null,
    priority: Number.isFinite(priorityRaw) ? priorityRaw : 0,
  };
}

export async function createCategory(_prevState: string | undefined, formData: FormData) {
  const fields = readCategoryFields(formData);

  if (!fields.name) {
    return 'Укажите название категории';
  }

  const existing = await prisma.category.findUnique({
    where: {
      name: fields.name,
    },
  });

  if (existing) {
    return 'Такая категория уже существует';
  }

  await prisma.category.create({
    data: fields,
  });

  revalidatePath('/admin/categories');
  redirect('/admin/categories');
}

export async function updateCategory(categoryId: string, _prevState: string | undefined, formData: FormData) {
  const fields = readCategoryFields(formData);

  if (!fields.name) {
    return 'Укажите название категории';
  }

  const existing = await prisma.category.findUnique({
    where: {
      name: fields.name,
    },
  });

  if (existing && existing.id !== categoryId) {
    return 'Такая категория уже существует';
  }

  await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: fields,
  });

  revalidatePath('/admin/categories');
  redirect('/admin/categories');
}

export async function deleteCategory(categoryId: string) {
  await prisma.category.delete({
    where: {
      id: categoryId,
    },
  });

  revalidatePath('/admin/categories');
  redirect('/admin/categories');
}
