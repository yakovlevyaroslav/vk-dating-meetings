import { SiteHeader } from '@/components/site-header';

import { createCategory } from '../actions';
import { CategoryForm } from '../CategoryForm';

export default function NewCategoryPage() {
  return (
    <>
      <SiteHeader title="Новая категория" />
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
        <CategoryForm action={createCategory} submitLabel="Создать" />
      </div>
    </>
  );
}
