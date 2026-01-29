import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Works with AWS S3, Cloudflare R2, MinIO, or any S3-compatible storage.
// Configure via env vars:
//   STORAGE_ENDPOINT    - e.g. https://<account>.r2.cloudflarestorage.com (R2) or omit for AWS
//   STORAGE_REGION      - e.g. auto (R2) or us-east-1 (AWS)
//   STORAGE_ACCESS_KEY  - access key ID
//   STORAGE_SECRET_KEY  - secret access key
//   STORAGE_BUCKET      - bucket name
//   STORAGE_PUBLIC_URL  - optional CDN/public URL prefix

const endpoint = process.env.STORAGE_ENDPOINT;
const region = process.env.STORAGE_REGION || 'us-east-1';
const accessKeyId = process.env.STORAGE_ACCESS_KEY || '';
const secretAccessKey = process.env.STORAGE_SECRET_KEY || '';
const bucket = process.env.STORAGE_BUCKET || 'prepcoach-recordings';
const publicUrl = process.env.STORAGE_PUBLIC_URL;

const isConfigured = Boolean(accessKeyId && secretAccessKey);

let s3Client: S3Client | null = null;

function getClient(): S3Client {
  if (!s3Client) {
    s3Client = new S3Client({
      region,
      ...(endpoint ? { endpoint, forcePathStyle: true } : {}),
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }
  return s3Client;
}

export function isStorageConfigured(): boolean {
  return isConfigured;
}

/**
 * Generate a presigned URL for direct client-side upload.
 */
export async function getUploadUrl(
  key: string,
  contentType: string,
  expiresIn = 3600
): Promise<string> {
  const client = getClient();
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(client, command, { expiresIn });
}

/**
 * Generate a presigned URL for downloading/streaming a file.
 */
export async function getDownloadUrl(
  key: string,
  expiresIn = 3600
): Promise<string> {
  if (publicUrl) {
    return `${publicUrl}/${key}`;
  }
  const client = getClient();
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  return getSignedUrl(client, command, { expiresIn });
}

/**
 * Upload a buffer directly from the server.
 */
export async function uploadFile(
  key: string,
  body: Buffer | Uint8Array,
  contentType: string
): Promise<string> {
  const client = getClient();
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
  return publicUrl ? `${publicUrl}/${key}` : key;
}

/**
 * Delete a file from storage.
 */
export async function deleteFile(key: string): Promise<void> {
  const client = getClient();
  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );
}

/**
 * Generate a storage key for a recording file.
 */
export function recordingKey(
  userId: string,
  recordingId: string,
  type: 'audio' | 'video' | 'screen',
  extension = 'webm'
): string {
  return `recordings/${userId}/${recordingId}/${type}.${extension}`;
}
