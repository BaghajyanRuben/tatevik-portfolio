import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function fileManagementPlugin() {
  return {
    name: 'file-management',
    configureServer(server) {
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

      // List files and folders in a directory
      server.middlewares.use('/api/list-files', (req, res) => {
        try {
          const url = new URL(req.url, `http://${req.headers.host}`);
          const dirPath = url.searchParams.get('path') || '/images/projects';
          const fullPath = path.join(process.cwd(), 'public', dirPath);

          if (!fs.existsSync(fullPath)) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ files: [], folders: [] }));
            return;
          }

          const items = fs.readdirSync(fullPath, { withFileTypes: true });
          
          const files = items
            .filter(item => item.isFile())
            .map(item => {
              const filePath = path.join(fullPath, item.name);
              const stats = fs.statSync(filePath);
              return {
                name: item.name,
                path: path.join(dirPath, item.name).replace(/\\/g, '/'),
                size: stats.size,
                modified: stats.mtime,
                isImage: /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(item.name)
              };
            });

          const folders = items
            .filter(item => item.isDirectory())
            .map(item => ({
              name: item.name,
              path: path.join(dirPath, item.name).replace(/\\/g, '/')
            }));

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ files, folders, currentPath: dirPath }));
        } catch (error) {
          console.error('List files error:', error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        }
      });

      // Create new folder
      server.middlewares.use('/api/create-folder', (req, res) => {
        if (req.method !== 'POST') {
          res.writeHead(405);
          res.end();
          return;
        }

        try {
          const { folderName, parentPath } = req.body;
          
          // Validate folder name
          if (!folderName || !/^[a-zA-Z0-9-_]+$/.test(folderName)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
              error: 'Invalid folder name. Use only letters, numbers, hyphens, and underscores.' 
            }));
            return;
          }

          const fullPath = path.join(
            process.cwd(), 
            'public', 
            parentPath || '/images/projects', 
            folderName
          );

          if (fs.existsSync(fullPath)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Folder already exists' }));
            return;
          }

          fs.mkdirSync(fullPath, { recursive: true });
          
          const newPath = path.join(parentPath || '/images/projects', folderName).replace(/\\/g, '/');
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            success: true, 
            path: newPath,
            message: 'Folder created successfully' 
          }));
        } catch (error) {
          console.error('Create folder error:', error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        }
      });

      // Upload file
      server.middlewares.use('/api/upload-file', (req, res) => {
        if (req.method !== 'POST') {
          res.writeHead(405);
          res.end();
          return;
        }

        try {
          let data = [];
          let boundary = '';
          
          // Get boundary from content-type
          const contentType = req.headers['content-type'] || '';
          const boundaryMatch = contentType.match(/boundary=(.+)$/);
          if (boundaryMatch) {
            boundary = '--' + boundaryMatch[1];
          }

          req.on('data', chunk => {
            data.push(chunk);
          });

          req.on('end', () => {
            try {
              const buffer = Buffer.concat(data);
              const parts = buffer.toString('binary').split(boundary);
              
              let targetPath = '/images/projects';
              let fileData = null;
              let filename = '';

              // Parse multipart form data
              parts.forEach(part => {
                if (part.includes('name="path"')) {
                  const pathMatch = part.match(/\r\n\r\n(.+)\r\n/);
                  if (pathMatch) targetPath = pathMatch[1].trim();
                }
                if (part.includes('name="file"')) {
                  const filenameMatch = part.match(/filename="(.+?)"/);
                  if (filenameMatch) filename = filenameMatch[1];
                  
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
              
              const fullPath = path.join(process.cwd(), 'public', targetPath);
              if (!fs.existsSync(fullPath)) {
                fs.mkdirSync(fullPath, { recursive: true });
              }

              const filePath = path.join(fullPath, filename);
              fs.writeFileSync(filePath, fileData, 'binary');

              const relativePath = path.join(targetPath, filename).replace(/\\/g, '/');
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ 
                success: true, 
                path: relativePath,
                message: 'File uploaded successfully'
              }));
            } catch (error) {
              console.error('Upload processing error:', error);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: error.message }));
            }
          });
        } catch (error) {
          console.error('Upload error:', error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        }
      });

      // Delete file or folder
      server.middlewares.use('/api/delete-file', (req, res) => {
        if (req.method !== 'POST') {
          res.writeHead(405);
          res.end();
          return;
        }

        try {
          const { path: itemPath } = req.body;
          
          if (!itemPath || itemPath === '/images/projects' || itemPath === '/images') {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Cannot delete root folders' }));
            return;
          }

          const fullPath = path.join(process.cwd(), 'public', itemPath);

          if (!fs.existsSync(fullPath)) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'File or folder not found' }));
            return;
          }

          const stats = fs.statSync(fullPath);
          
          if (stats.isDirectory()) {
            // Check if folder is empty
            const contents = fs.readdirSync(fullPath);
            if (contents.length > 0) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ 
                error: 'Cannot delete non-empty folder. Please delete contents first.' 
              }));
              return;
            }
            fs.rmdirSync(fullPath);
          } else {
            fs.unlinkSync(fullPath);
          }

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            success: true,
            message: 'Deleted successfully'
          }));
        } catch (error) {
          console.error('Delete error:', error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        }
      });
    }
  };
}
