/**
 * Cloudflare Pages Function: List R2 Files
 * 
 * Uses native R2 bucket binding (no AWS SDK needed).
 * Requires R2 binding named "R2_BUCKET" in Cloudflare Pages settings.
 */

export async function onRequestGet(context) {
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

    // Get path from query params
    const url = new URL(request.url);
    const prefix = url.searchParams.get('path') || 'images/projects';
    let cleanPrefix = prefix.startsWith('/') ? prefix.slice(1) : prefix;
    
    // Ensure prefix ends with / for proper directory listing
    if (!cleanPrefix.endsWith('/')) {
      cleanPrefix = cleanPrefix + '/';
    }

    // List objects in R2 using native binding
    const listed = await bucket.list({
      prefix: cleanPrefix,
      delimiter: '/',
    });

    // Parse folders from delimitedPrefixes
    const folders = (listed.delimitedPrefixes || [])
      .map(p => {
        const folderPath = p.endsWith('/') ? p.slice(0, -1) : p;
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

    // Parse files from objects
    const files = (listed.objects || [])
      .filter(item => !item.key.endsWith('/') && !item.key.endsWith('.folder'))
      .map(item => ({
        name: item.key.split('/').pop(),
        path: `/${item.key}`,
        url: `${publicUrl}/${item.key}`,
        size: item.size,
        modified: item.uploaded,
        type: 'file',
        isImage: /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(item.key),
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
