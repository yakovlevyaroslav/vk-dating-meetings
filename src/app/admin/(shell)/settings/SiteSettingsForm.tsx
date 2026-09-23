'use client';

import { useActionState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SiteSettingsFormValues {
  showRoutesSection: boolean;
  showBonusesSection: boolean;
  suggestPlaceUrl: string;
}

interface SiteSettingsFormProps {
  action: (prevState: string | undefined, formData: FormData) => Promise<string | undefined>;
  defaultValues: SiteSettingsFormValues;
}

export function SiteSettingsForm(props: SiteSettingsFormProps) {
  const { action, defaultValues } = props;
  const [errorMessage, formAction, isPending] = useActionState(action, undefined);
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !isPending && !errorMessage) {
      toast.success('Настройки сохранены');
    }
    wasPending.current = isPending;
  }, [isPending, errorMessage]);

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-6">
      <label className="flex w-fit items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="showRoutesSection"
          defaultChecked={defaultValues.showRoutesSection}
          className="size-4"
        />
        Показывать блок «Маршруты»
      </label>

      <label className="flex w-fit items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="showBonusesSection"
          defaultChecked={defaultValues.showBonusesSection}
          className="size-4"
        />
        Показывать блок «Бонусы»
      </label>

      <div className="flex flex-col gap-2">
        <Label htmlFor="suggestPlaceUrl">Ссылка кнопки «Предложить место»</Label>
        <Input
          key={defaultValues.suggestPlaceUrl}
          id="suggestPlaceUrl"
          name="suggestPlaceUrl"
          defaultValue={defaultValues.suggestPlaceUrl}
          placeholder="https://…"
        />
        <p className="text-sm text-muted-foreground">
          Если не заполнено — кнопка не показывается на сайте.
        </p>
      </div>

      {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}

      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending ? 'Сохраняем…' : 'Сохранить'}
      </Button>
    </form>
  );
}
