'use client';

import { useActionState } from 'react';

import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { type VenueDraft, PlaceVenuesField } from './PlaceVenuesField';

interface PlaceFormValues {
  cityId: string;
  name: string;
  description: string;
  categoryId: string;
  thumbnailImage: string | null;
  largeImage: string | null;
  linkUrl: string;
  promoDescription: string;
  promoCode: string;
  priority: string;
  isPublished: boolean;
  hasBonus: boolean;
  venues: VenueDraft[];
}

interface PlaceFormProps {
  action: (prevState: string | undefined, formData: FormData) => Promise<string | undefined>;
  cities: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  defaultValues?: PlaceFormValues;
  submitLabel: string;
}

const EMPTY_VALUES: PlaceFormValues = {
  cityId: '',
  name: '',
  description: '',
  categoryId: '',
  thumbnailImage: null,
  largeImage: null,
  linkUrl: '',
  promoDescription: '',
  promoCode: '',
  priority: '0',
  isPublished: true,
  hasBonus: false,
  venues: [],
};

export function PlaceForm(props: PlaceFormProps) {
  const { action, cities, categories, submitLabel } = props;
  const values = props.defaultValues ?? EMPTY_VALUES;
  const [errorMessage, formAction, isPending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="cityId">Город</Label>
        <select
          id="cityId"
          name="cityId"
          defaultValue={values.cityId}
          required
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
        >
          <option value="" disabled>
            Выберите город
          </option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Название</Label>
        <Input id="name" name="name" defaultValue={values.name} required />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Описание</Label>
        <Textarea id="description" name="description" defaultValue={values.description} rows={4} maxLength={200} />
        <p className="text-sm text-muted-foreground">Не более 200 символов.</p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="categoryId">Категория</Label>
        <select
          id="categoryId"
          name="categoryId"
          defaultValue={values.categoryId}
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
        >
          <option value="">Без категории</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ImageUploadField
          name="thumbnailImage"
          label="Миниатюра (для списка)"
          folder="places"
          defaultValue={values.thumbnailImage}
        />
        <ImageUploadField
          name="largeImage"
          label="Большое изображение (для карточки)"
          folder="places"
          defaultValue={values.largeImage}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="linkUrl">Ссылка «Подробнее»</Label>
        <Input id="linkUrl" name="linkUrl" type="url" defaultValue={values.linkUrl} placeholder="https://…" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="promoDescription">Промокод — описание</Label>
          <Textarea id="promoDescription" name="promoDescription" defaultValue={values.promoDescription} rows={2} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="promoCode">Промокод</Label>
          <Input id="promoCode" name="promoCode" defaultValue={values.promoCode} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="flex w-fit items-center gap-2 text-sm">
          <input type="checkbox" name="hasBonus" defaultChecked={values.hasBonus} className="size-4" />
          Показывать бонус иконку, активировать промокод
        </label>
        <p className="text-sm text-muted-foreground">
          Применяется сразу ко всем точкам сети, даже если у самой точки не отмечено или не заполнено.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="priority">Приоритет в выдаче</Label>
        <Input
          id="priority"
          name="priority"
          type="number"
          step={1}
          defaultValue={values.priority}
          className="w-32"
        />
        <p className="text-sm text-muted-foreground">
          Чем выше значение, тем выше место в списке. При равном приоритете — по алфавиту.
        </p>
      </div>

      <label className="flex w-fit items-center gap-2 text-sm">
        <input type="checkbox" name="isPublished" defaultChecked={values.isPublished} className="size-4" />
        Опубликовано
      </label>

      <div className="flex flex-col gap-2">
        <Label>Точки на карте</Label>
        <PlaceVenuesField defaultVenues={values.venues} />
      </div>

      {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}

      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending ? 'Сохраняем…' : submitLabel}
      </Button>
    </form>
  );
}
