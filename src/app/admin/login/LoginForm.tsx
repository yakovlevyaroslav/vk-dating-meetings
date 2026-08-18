'use client';

import { useActionState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { authenticate } from './actions';

export function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Вход в админку</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required autoComplete="username" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Пароль</Label>
            <Input id="password" name="password" type="password" required autoComplete="current-password" />
          </div>
          {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? 'Входим…' : 'Войти'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
