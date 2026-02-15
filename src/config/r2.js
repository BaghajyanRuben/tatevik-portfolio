import { S3Client } from '@aws-sdk/client-s3';

// Cloudflare R2 Configuration
export const r2Config = {
  accountId: import.meta.env.VITE_R2_ACCOUNT_ID,
  accessKeyId: import.meta.env.VITE_R2_ACCESS_KEY_ID,
  secretAccessKey: import.meta.env.VITE_R2_SECRET_ACCESS_KEY,
  bucketName: import.meta.env.VITE_R2_BUCKET_NAME,
  publicUrl: import.meta.env.VITE_R2_PUBLIC_URL,
};

// Create S3 client for R2 (R2 is S3-compatible)
export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${r2Config.accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: r2Config.accessKeyId,
    secretAccessKey: r2Config.secretAccessKey,
  },
});

// Helper: Get public URL for an R2 object
export const getR2PublicUrl = (key) => {
  // Remove leading slash if present
  const cleanKey = key.startsWith('/') ? key.slice(1) : key;
  return `${r2Config.publicUrl}/${cleanKey}`;
};

// Helper: Extract key from public URL
export const extractR2Key = (url) => {
  if (!url) return '';
  if (!url.startsWith(r2Config.publicUrl)) return url;
  return url.replace(r2Config.publicUrl + '/', '');
};

export default r2Client;
