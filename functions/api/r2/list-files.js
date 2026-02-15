/**
 * Cloudflare Pages Function: List R2 Files
 * 
 * This function lists files and folders in the R2 bucket.
 * It runs as a serverless function in production.
 */

import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

export async function onRequestGet(context) {
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

    // Get path from query params
    const url = new URL(request.url);
    const prefix = url.searchParams.get('path') || 'images/projects';
    let cleanPrefix = prefix.startsWith('/') ? prefix.slice(1) : prefix;
    
    // Ensure prefix ends with / for proper directory listing
    if (!cleanPrefix.endsWith('/')) {
      cleanPrefix = cleanPrefix + '/';
    }

    // List objects in R2
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: cleanPrefix,
      Delimiter: '/',
    });

    const response = await r2Client.send(command);

    // Parse folders
    const folders = (response.CommonPrefixes || [])
      .map(p => {
        const folderPath = p.Prefix.slice(0, -1);
        const folderName = folderPath.split('/').pop();
        return {
          name: folderName,
          path: `/${folderPath}`,
          type: 'folder',
        };
      })
      .filter(folder => {
        const currentPathWithoutSlash = `/${cleanPrefix.slice(0, -1)}`;
        return folder.path !== currentPathWithoutSlash;
      });

    // Parse files
    const files = (response.Contents || [])
      .filter(item => !item.Key.endsWith('/') && !item.Key.endsWith('.folder'))
      .map(item => ({
        name: item.Key.split('/').pop(),
        path: `/${item.Key}`,
        url: `${publicUrl}/${item.Key}`,
        size: item.Size,
        modified: item.LastModified,
        type: 'file',
        isImage: /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(item.Key),
      }));

    return new Response(JSON.stringify({ 
      files, 
      folders, 
      currentPath: `/${cleanPrefix.slice(0, -1)}` 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('R2 list error:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
