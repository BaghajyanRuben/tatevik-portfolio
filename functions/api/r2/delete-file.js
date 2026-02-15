/**
 * Cloudflare Pages Function: Delete File from R2
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
      // List all objects with this prefix to check if empty
      const listed = await bucket.list({ prefix: cleanKey });

      if (listed.objects && listed.objects.length > 1) {
        return new Response(JSON.stringify({ 
          error: 'Cannot delete non-empty folder. Please delete contents first.' 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Delete folder marker
      await bucket.delete(`${cleanKey}.folder`);
    } else {
      // Delete single file
      await bucket.delete(cleanKey);
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
