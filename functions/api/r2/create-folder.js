/**
 * Cloudflare Pages Function: Create Folder in R2
 * 
 * Uses native R2 bucket binding (no AWS SDK needed).
 * Requires R2 binding named "R2_BUCKET" in Cloudflare Pages settings.
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const bucket = env.R2_BUCKET;

    if (!bucket) {
      return new Response(JSON.stringify({ 
        error: 'R2 bucket binding not configured. Add R2_BUCKET binding in Cloudflare Pages settings.' 
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }

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

    // Create folder marker using native binding
    await bucket.put(folderKey, new Uint8Array(0), {
      httpMetadata: {
        contentType: 'application/x-empty',
      },
    });

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
