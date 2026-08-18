'use client';

import { useActionState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CategoryFormValues {
  name: string;
  emoji: string;
}

interface CategoryFormProps {
  action: (prevState: string | undefined, formData: FormData) => Promise<string | undefined>;
  defaultValues?: CategoryFormValues;
  submitLabel: string;
}

const EMPTY_VALUES: CategoryFormValues = {
  name: '',
  emoji: '',
};

export function CategoryForm(props: CategoryFormProps) {
  const { action, submitLabel } = props;
  const values = props.defaultValues ?? EMPTY_VALUES;
  const [errorMessage, formAction, isPending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Название</Label>
        <Input id="name" name="name" defaultValue={values.name} placeholder="Кафе, парк, музей…" required />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="emoji">Эмодзи</Label>
        <Input id="emoji" name="emoji" defaultValue={values.emoji} placeholder="☕️" className="w-24" />
      </div>

      {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}

      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending ? 'Сохраняем…' : submitLabel}
      </Button>
    </form>
  );
}
