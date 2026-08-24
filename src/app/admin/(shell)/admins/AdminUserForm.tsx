'use client';

import { useActionState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AdminUserFormValues {
  email: string;
  name: string;
  role: 'ADMIN' | 'SUPERADMIN';
}

interface AdminUserFormProps {
  action: (prevState: string | undefined, formData: FormData) => Promise<string | undefined>;
  defaultValues?: AdminUserFormValues;
  submitLabel: string;
  isNew: boolean;
}

const EMPTY_VALUES: AdminUserFormValues = {
  email: '',
  name: '',
  role: 'ADMIN',
};

export function AdminUserForm(props: AdminUserFormProps) {
  const {
    action, submitLabel, isNew,
  } = props;
  const values = props.defaultValues ?? EMPTY_VALUES;
  const [errorMessage, formAction, isPending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        {isNew ? (
          <Input id="email" name="email" type="email" defaultValue={values.email} required />
        ) : (
          <Input id="email" value={values.email} disabled />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Имя</Label>
        <Input id="name" name="name" defaultValue={values.name} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="role">Роль</Label>
        <select
          id="role"
          name="role"
          defaultValue={values.role}
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
        >
          <option value="ADMIN">Админ</option>
          <option value="SUPERADMIN">Суперадмин</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">{isNew ? 'Пароль' : 'Новый пароль'}</Label>
        <Input id="password" name="password" type="password" required={isNew} />
        {isNew ? null : (
          <p className="text-sm text-muted-foreground">Оставьте пустым, чтобы не менять пароль.</p>
        )}
      </div>

      {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}

      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending ? 'Сохраняем…' : submitLabel}
      </Button>
    </form>
  );
}
