/**
 * Cloudflare Pages Function: Delete File from R2
 * 
 * This function deletes files or folders from the R2 bucket.
 * It runs as a serverless function in production.
 */

import { S3Client, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

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
    const { path: itemPath } = body;

    if (!itemPath) {
      return new Response(JSON.stringify({ 
        error: 'Path is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const cleanKey = itemPath.startsWith('/') ? itemPath.slice(1) : itemPath;

    // Check if it's a folder
    if (itemPath.endsWith('/')) {
      // List all objects with this prefix
      const listCommand = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: cleanKey,
      });

      const listResponse = await r2Client.send(listCommand);

      if (listResponse.Contents && listResponse.Contents.length > 1) {
        return new Response(JSON.stringify({ 
          error: 'Cannot delete non-empty folder. Please delete contents first.' 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Delete folder marker
      const deleteCommand = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: `${cleanKey}.folder`,
      });
      await r2Client.send(deleteCommand);
    } else {
      // Delete single file
      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: cleanKey,
      });
      await r2Client.send(command);
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Deleted successfully from R2'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('R2 delete error:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
