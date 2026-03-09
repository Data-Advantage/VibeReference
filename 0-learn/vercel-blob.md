# Vercel Blob

Vercel Blob is a serverless file storage solution integrated with the Vercel platform. It provides a simple API for uploading, serving, and managing files (images, documents, videos) directly from your Next.js application without needing a separate storage service like AWS S3.

## Why Vercel Blob?

- **Zero configuration**: Works out of the box with Vercel deployments
- **Global CDN**: Files are served from Vercel's edge network for fast delivery
- **Simple API**: Upload and manage files with a few lines of code
- **Serverless friendly**: No persistent connections or complex setup
- **Integrated billing**: Included in your Vercel plan

## Getting Started

### Install

```bash
npm install @vercel/blob
```

### Set Environment Variable

Add `BLOB_READ_WRITE_TOKEN` to your Vercel project settings, or create a Blob store in the Vercel dashboard.

### Upload a File (Server-Side)

```typescript
// app/api/upload/route.ts
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get('file') as File;

  const blob = await put(file.name, file, {
    access: 'public',
  });

  return NextResponse.json(blob);
  // blob.url contains the public URL of the uploaded file
}
```

### Client-Side Upload (Direct)

For large files, upload directly from the browser:

```tsx
'use client';

import { upload } from '@vercel/blob/client';

async function handleUpload(file: File) {
  const blob = await upload(file.name, file, {
    access: 'public',
    handleUploadUrl: '/api/upload-token',
  });

  console.log('Uploaded:', blob.url);
}
```

### List and Delete Files

```typescript
import { list, del } from '@vercel/blob';

// List all blobs
const { blobs } = await list();

// Delete a blob
await del('https://your-blob-url.vercel-storage.com/file.png');
```

## Common Use Cases

- User avatar uploads
- Document attachments
- Image galleries
- File sharing features
- Media storage for content management

## Resources

- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
- [Vercel Blob API Reference](https://vercel.com/docs/storage/vercel-blob/using-blob-sdk)
