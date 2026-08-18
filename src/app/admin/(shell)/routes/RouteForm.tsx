'use client';

import { useActionState } from 'react';

import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { type StopDraft, RouteStopsField } from './RouteStopsField';

interface RouteFormValues {
  cityId: string;
  name: string;
  description: string;
  image: string | null;
  typeEmoji: string;
  typeLabel: string;
  isPublished: boolean;
  stops: StopDraft[];
}

interface PlaceOption {
  id: string;
  name: string;
  venues: { id: string; name: string }[];
}

interface RouteFormProps {
  action: (prevState: string | undefined, formData: FormData) => Promise<string | undefined>;
  cities: { id: string; name: string }[];
  places: PlaceOption[];
  defaultValues?: RouteFormValues;
  submitLabel: string;
}

const EMPTY_VALUES: RouteFormValues = {
  cityId: '',
  name: '',
  description: '',
  image: null,
  typeEmoji: '',
  typeLabel: '',
  isPublished: true,
  stops: [],
};

export function RouteForm(props: RouteFormProps) {
  const { action, cities, places, submitLabel } = props;
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
        <Textarea id="description" name="description" defaultValue={values.description} rows={4} />
      </div>

      <ImageUploadField name="image" label="Фото" folder="routes" defaultValue={values.image} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="typeEmoji">Вид маршрута — эмодзи</Label>
          <Input id="typeEmoji" name="typeEmoji" defaultValue={values.typeEmoji} placeholder="🚶" maxLength={8} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="typeLabel">Вид маршрута — текст</Label>
          <Input id="typeLabel" name="typeLabel" defaultValue={values.typeLabel} placeholder="Пешая прогулка" />
        </div>
      </div>

      <label className="flex w-fit items-center gap-2 text-sm">
        <input type="checkbox" name="isPublished" defaultChecked={values.isPublished} className="size-4" />
        Опубликовано
      </label>

      <div className="flex flex-col gap-2">
        <Label>Остановки маршрута</Label>
        <RouteStopsField places={places} cities={cities} defaultStops={values.stops} />
      </div>

      {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}

      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending ? 'Сохраняем…' : submitLabel}
      </Button>
    </form>
  );
}
