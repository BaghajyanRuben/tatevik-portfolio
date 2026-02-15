/**
 * Cloudflare Pages Function: Create Folder in R2
 * 
 * This function creates a folder marker in the R2 bucket.
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

    // Parse request body
    const body = await request.json();
    const { folderName, parentPath } = body;

    if (!folderName || !/^[a-zA-Z0-9-_]+$/.test(folderName)) {
      return new Response(JSON.stringify({ 
        error: 'Invalid folder name. Use only letters, numbers, hyphens, and underscores.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const parent = parentPath || 'images/projects';
    const cleanParent = parent.startsWith('/') ? parent.slice(1) : parent;
    const folderKey = `${cleanParent}/${folderName}/.folder`;

    // Create folder marker
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: folderKey,
      Body: new Uint8Array(0),
      ContentType: 'application/x-empty',
    });

    await r2Client.send(command);

    return new Response(JSON.stringify({ 
      success: true, 
      path: `/${cleanParent}/${folderName}`,
      message: 'Folder created successfully' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('R2 create folder error:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
