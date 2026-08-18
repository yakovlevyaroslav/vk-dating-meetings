import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { NextResponse } from 'next/server';

import { auth } from '@/core/auth/auth';

const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const MAX_SIZE_BYTES = 10 * 1024 * 1024;

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({
      error: 'Unauthorized',
    }, {
      status: 401,
    });
  }

  const formData = await request.formData();
  const file = formData.get('file');
  const folder = formData.get('folder');

  if (!(file instanceof File)) {
    return NextResponse.json({
      error: 'file is required',
    }, {
      status: 400,
    });
  }

  const extension = ALLOWED_TYPES[file.type];

  if (!extension) {
    return NextResponse.json({
      error: 'Unsupported file type',
    }, {
      status: 400,
    });
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({
      error: 'File too large',
    }, {
      status: 400,
    });
  }

  const safeFolder = typeof folder === 'string' && /^[a-z0-9-]+$/.test(folder) ? folder : 'misc';
  const filename = `${randomUUID()}.${extension}`;

  const uploadDir = path.join(process.cwd(), 'public', 'uploads', safeFolder);
  await mkdir(uploadDir, {
    recursive: true,
  });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), buffer);

  return NextResponse.json({
    url: `/uploads/${safeFolder}/${filename}`,
  });
}
