import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3';

export default function r2ManagementPlugin(env = {}) {
  let r2Client;
  let bucketName;
  let publicUrl;
  let isConfigured = false;

  return {
    name: 'r2-management',
    configureServer(server) {
      // Get R2 credentials from passed environment
      const accountId = env.VITE_R2_ACCOUNT_ID;
      const accessKeyId = env.VITE_R2_ACCESS_KEY_ID;
      const secretAccessKey = env.VITE_R2_SECRET_ACCESS_KEY;
      bucketName = env.VITE_R2_BUCKET_NAME;
      publicUrl = env.VITE_R2_PUBLIC_URL;

      console.log('\n🔍 Checking R2 Configuration...');
      console.log('Account ID:', accountId ? '✓ Found' : '✗ Missing');
      console.log('Access Key:', accessKeyId ? '✓ Found' : '✗ Missing');
      console.log('Secret Key:', secretAccessKey ? '✓ Found' : '✗ Missing');
      console.log('Bucket Name:', bucketName ? '✓ Found' : '✗ Missing');
      console.log('Public URL:', publicUrl ? '✓ Found' : '✗ Missing');

      if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
        console.warn('\n⚠️  R2 credentials not fully configured!');
        console.warn('   File management will use local fallback.');
        console.warn('   Add all R2 credentials to .env.local\n');
        return;
      }

      try {
        r2Client = new S3Client({
          region: 'auto',
          endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
          credentials: {
            accessKeyId,
            secretAccessKey,
          },
        });
        isConfigured = true;
        console.log('\n✅ R2 client initialized successfully!');
        console.log(`   Bucket: ${bucketName}`);
        console.log(`   Public URL: ${publicUrl}\n`);
      } catch (error) {
        console.error('\n❌ Failed to initialize R2 client:', error.message);
        return;
      }

      // Middleware to parse JSON bodies
      server.middlewares.use((req, res, next) => {
        if (req.headers['content-type']?.includes('application/json')) {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              req.body = JSON.parse(body);
            } catch (e) {
              req.body = {};
            }
            next();
          });
        } else {
          next();
        }
      });

      // List files and folders in R2
      server.middlewares.use('/api/r2/list-files', async (req, res) => {
        if (!isConfigured) {
          res.writeHead(503, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'R2 not configured' }));
          return;
        }
        
        try {
          const url = new URL(req.url, `http://${req.headers.host}`);
          const prefix = url.searchParams.get('path') || 'images/projects';
          let cleanPrefix = prefix.startsWith('/') ? prefix.slice(1) : prefix;
          
          // Ensure prefix ends with / for proper directory listing
          if (!cleanPrefix.endsWith('/')) {
            cleanPrefix = cleanPrefix + '/';
          }

          console.log('🔍 Listing R2 with prefix:', cleanPrefix);

          const command = new ListObjectsV2Command({
            Bucket: bucketName,
            Prefix: cleanPrefix,
            Delimiter: '/',
          });

          const response = await r2Client.send(command);

          console.log(`📂 R2 List for "${cleanPrefix}":`, {
            folders: response.CommonPrefixes?.length || 0,
            files: response.Contents?.length || 0,
            prefixes: response.CommonPrefixes?.map(p => p.Prefix)
          });

          // Parse folders - filter out self-referential folders
          const folders = (response.CommonPrefixes || [])
            .map(p => {
              const folderPath = p.Prefix.slice(0, -1); // Remove trailing /
              const folderName = folderPath.split('/').pop();
              console.log('  Folder:', { prefix: p.Prefix, folderPath, folderName, cleanPrefix: cleanPrefix.slice(0, -1) });
              return {
                name: folderName,
                path: `/${folderPath}`,
                type: 'folder',
              };
            })
            .filter(folder => {
              // Filter out folders that point to the current path
              const currentPathWithoutSlash = `/${cleanPrefix.slice(0, -1)}`;
              const isCurrentPath = folder.path === currentPathWithoutSlash;
              if (isCurrentPath) {
                console.log('  ⚠️ Skipping self-referential folder:', folder.path);
              }
              return !isCurrentPath;
            });

          // Parse files
          const allContents = response.Contents || [];
          console.log('  All Contents:', allContents.map(c => ({ Key: c.Key, Size: c.Size })));
          
          const files = allContents
            .filter(item => {
              const isFolder = item.Key.endsWith('/') || item.Key.endsWith('.folder');
              const isEmpty = item.Size === 0 && item.Key.endsWith('.folder');
              if (isFolder || isEmpty) {
                console.log('  ⏭️ Skipping folder marker:', item.Key);
                return false;
              }
              return true;
            })
            .map(item => {
              console.log('  ✅ File:', item.Key);
              return {
                name: item.Key.split('/').pop(),
                path: `/${item.Key}`,
                url: `${publicUrl}/${item.Key}`,
                size: item.Size,
                modified: item.LastModified,
                type: 'file',
                isImage: /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(item.Key),
              };
            });

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            files, 
            folders, 
            currentPath: `/${cleanPrefix.slice(0, -1)}` // Remove trailing slash for frontend
          }));
        } catch (error) {
          console.error('R2 list error:', error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        }
      });

      // Create folder in R2
      server.middlewares.use('/api/r2/create-folder', async (req, res) => {
        if (req.method !== 'POST') {
          res.writeHead(405);
          res.end();
          return;
        }

        if (!isConfigured) {
          res.writeHead(503, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'R2 not configured' }));
          return;
        }

        try {
          const { folderName, parentPath } = req.body;

          if (!folderName || !/^[a-zA-Z0-9-_]+$/.test(folderName)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
              error: 'Invalid folder name. Use only letters, numbers, hyphens, and underscores.' 
            }));
            return;
          }

          const parent = parentPath || 'images/projects';
          const cleanParent = parent.startsWith('/') ? parent.slice(1) : parent;
          const folderKey = `${cleanParent}/${folderName}/.folder`;

          const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: folderKey,
            Body: Buffer.from(''),
            ContentType: 'application/x-empty',
          });

          await r2Client.send(command);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            success: true, 
            path: `/${cleanParent}/${folderName}`,
            message: 'Folder created successfully' 
          }));
        } catch (error) {
          console.error('R2 create folder error:', error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        }
      });

      // Upload file to R2
      server.middlewares.use('/api/r2/upload-file', async (req, res) => {
        if (req.method !== 'POST') {
          res.writeHead(405);
          res.end();
          return;
        }

        if (!isConfigured) {
          res.writeHead(503, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'R2 not configured' }));
          return;
        }

        try {
          let data = [];
          let boundary = '';

          const contentType = req.headers['content-type'] || '';
          const boundaryMatch = contentType.match(/boundary=(.+)$/);
          if (boundaryMatch) {
            boundary = '--' + boundaryMatch[1];
          }

          req.on('data', chunk => {
            data.push(chunk);
          });

          req.on('end', async () => {
            try {
              const buffer = Buffer.concat(data);
              const parts = buffer.toString('binary').split(boundary);

              let targetPath = 'images/projects';
              let fileData = null;
              let filename = '';
              let contentType = 'application/octet-stream';

              // Parse multipart form data
              parts.forEach(part => {
                if (part.includes('name="path"')) {
                  const pathMatch = part.match(/\r\n\r\n(.+)\r\n/);
                  if (pathMatch) targetPath = pathMatch[1].trim();
                }
                if (part.includes('name="file"')) {
                  const filenameMatch = part.match(/filename="(.+?)"/);
                  if (filenameMatch) filename = filenameMatch[1];

                  const typeMatch = part.match(/Content-Type: (.+?)\r\n/);
                  if (typeMatch) contentType = typeMatch[1];

                  const dataStart = part.indexOf('\r\n\r\n') + 4;
                  const dataEnd = part.lastIndexOf('\r\n');
                  if (dataStart > 3 && dataEnd > dataStart) {
                    fileData = buffer.slice(
                      buffer.indexOf(part, 'binary') + dataStart,
                      buffer.indexOf(part, 'binary') + dataEnd
                    );
                  }
                }
              });

              if (!fileData || !filename) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'No file provided' }));
                return;
              }

              // Sanitize filename
              filename = filename.replace(/[^a-zA-Z0-9.-_]/g, '_');

              const cleanPath = targetPath.startsWith('/') ? targetPath.slice(1) : targetPath;
              const fullKey = `${cleanPath}/${filename}`;

              console.log('📤 Uploading to R2:', {
                targetPath,
                cleanPath,
                fullKey,
                filename
              });

              // Upload to R2
              const command = new PutObjectCommand({
                Bucket: bucketName,
                Key: fullKey,
                Body: fileData,
                ContentType: contentType,
              });

              await r2Client.send(command);

              const filePublicUrl = `${publicUrl}/${fullKey}`;

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ 
                success: true, 
                path: `/${fullKey}`,
                url: filePublicUrl,
                message: 'File uploaded successfully to R2'
              }));
            } catch (error) {
              console.error('R2 upload processing error:', error);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: error.message }));
            }
          });
        } catch (error) {
          console.error('R2 upload error:', error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        }
      });

      // Delete file from R2
      server.middlewares.use('/api/r2/delete-file', async (req, res) => {
        if (req.method !== 'POST') {
          res.writeHead(405);
          res.end();
          return;
        }

        if (!isConfigured) {
          res.writeHead(503, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'R2 not configured' }));
          return;
        }

        try {
          const { path: itemPath } = req.body;

          if (!itemPath) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Path is required' }));
            return;
          }

          const cleanKey = itemPath.startsWith('/') ? itemPath.slice(1) : itemPath;

          // Check if it's a folder (ends with / or is a prefix)
          if (itemPath.endsWith('/')) {
            // List all objects with this prefix
            const listCommand = new ListObjectsV2Command({
              Bucket: bucketName,
              Prefix: cleanKey,
            });

            const listResponse = await r2Client.send(listCommand);

            if (listResponse.Contents && listResponse.Contents.length > 1) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ 
                error: 'Cannot delete non-empty folder. Please delete contents first.' 
              }));
              return;
            }

            // Delete folder marker if exists
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

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            success: true,
            message: 'Deleted successfully from R2'
          }));
        } catch (error) {
          console.error('R2 delete error:', error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        }
      });
    }
  };
}
