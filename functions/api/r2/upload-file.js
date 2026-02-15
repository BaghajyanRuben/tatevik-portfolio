/**
 * Cloudflare Pages Function: Upload File to R2
 * 
 * This function uploads files to the R2 bucket.
 * It runs as a serverless function in production.
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    // Get R2 credentials from environment
    const accountId = env.VITE_R2_ACCOUNT_ID;
    const accessKeyId = env.VITE_R2_ACCESS_KEY_ID;
    const secretAccessKey = env.VITE_R2_SECRET_ACCESS_KEY;
    const bucketName = env.VITE_R2_BUCKET_NAME;
    const publicUrl = env.VITE_R2_PUBLIC_URL;

    if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
      return new Response(JSON.stringify({ 
        error: 'R2 credentials not configured' 
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Initialize R2 client
    const r2Client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('file');
    const targetPath = formData.get('path') || 'images/projects';

    if (!file) {
      return new Response(JSON.stringify({ 
        error: 'No file provided' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Sanitize filename
    let filename = file.name.replace(/[^a-zA-Z0-9.-_]/g, '_');

    // Prepare path
    const cleanPath = targetPath.startsWith('/') ? targetPath.slice(1) : targetPath;
    const fullKey = `${cleanPath}/${filename}`;

    // Get file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Upload to R2
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fullKey,
      Body: buffer,
      ContentType: file.type || 'application/octet-stream',
    });

    await r2Client.send(command);

    const filePublicUrl = `${publicUrl}/${fullKey}`;

    return new Response(JSON.stringify({ 
      success: true, 
      path: `/${fullKey}`,
      url: filePublicUrl,
      message: 'File uploaded successfully to R2'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('R2 upload error:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
