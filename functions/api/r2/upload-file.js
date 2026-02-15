/**
 * Cloudflare Pages Function: Upload File to R2
 * 
 * Uses native R2 bucket binding (no AWS SDK needed).
 * Requires R2 binding named "R2_BUCKET" in Cloudflare Pages settings.
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const bucket = env.R2_BUCKET;
    const publicUrl = env.VITE_R2_PUBLIC_URL;

    if (!bucket) {
      return new Response(JSON.stringify({ 
        error: 'R2 bucket binding not configured. Add R2_BUCKET binding in Cloudflare Pages settings.' 
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }

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
    const filename = file.name.replace(/[^a-zA-Z0-9.-_]/g, '_');

    // Prepare path
    const cleanPath = targetPath.startsWith('/') ? targetPath.slice(1) : targetPath;
    const fullKey = `${cleanPath}/${filename}`;

    // Upload to R2 using native binding
    await bucket.put(fullKey, file.stream(), {
      httpMetadata: {
        contentType: file.type || 'application/octet-stream',
      },
    });

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
