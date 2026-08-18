'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ImageUploadFieldProps {
  name: string;
  label: string;
  folder: string;
  defaultValue?: string | null;
}

export function ImageUploadField(props: ImageUploadFieldProps) {
  const { name, label, folder, defaultValue } = props;
  const [url, setUrl] = useState(defaultValue ?? '');
  const [isUploading, setIsUploading] = useState(false);
  const inputId = `${name}-file`;

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.set('file', file);
      formData.set('folder', folder);

      const response = await fetch('/api/admin/upload', {
        method: 'POST', body: formData,
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? 'Не удалось загрузить файл');
      }

      const data = (await response.json()) as { url: string };
      setUrl(data.url);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Не удалось загрузить файл');
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={inputId}>{label}</Label>
      <input type="hidden" name={name} value={url} />
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element -- превью загруженного пользователем файла
        <img src={url} alt="" className="h-32 w-32 rounded-md border object-cover" />
      ) : null}
      <Input id={inputId} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFileChange} />
      {isUploading ? <p className="text-sm text-muted-foreground">Загрузка…</p> : null}
    </div>
  );
}
