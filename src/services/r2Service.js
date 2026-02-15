import { 
  PutObjectCommand, 
  ListObjectsV2Command, 
  DeleteObjectCommand,
  HeadObjectCommand 
} from '@aws-sdk/client-s3';
import { r2Client, r2Config, getR2PublicUrl } from '../config/r2';

// Upload file to R2
export const uploadToR2 = async (file, path) => {
  try {
    // Construct the key (path in R2)
    const key = path.startsWith('/') ? path.slice(1) : path;
    const fileName = file.name.replace(/[^a-zA-Z0-9.-_]/g, '_');
    const fullKey = `${key}/${fileName}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to R2
    const command = new PutObjectCommand({
      Bucket: r2Config.bucketName,
      Key: fullKey,
      Body: buffer,
      ContentType: file.type,
      Metadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
      },
    });

    await r2Client.send(command);

    // Return public URL
    const publicUrl = getR2PublicUrl(fullKey);
    
    return {
      success: true,
      path: `/${fullKey}`,
      url: publicUrl,
      key: fullKey,
    };
  } catch (error) {
    console.error('Error uploading to R2:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
};

// List files in R2 directory
export const listR2Files = async (prefix = 'images/projects') => {
  try {
    const cleanPrefix = prefix.startsWith('/') ? prefix.slice(1) : prefix;
    
    const command = new ListObjectsV2Command({
      Bucket: r2Config.bucketName,
      Prefix: cleanPrefix,
      Delimiter: '/',
    });

    const response = await r2Client.send(command);

    // Parse folders (CommonPrefixes)
    const folders = (response.CommonPrefixes || []).map(prefix => {
      const folderPath = prefix.Prefix.slice(0, -1); // Remove trailing /
      const folderName = folderPath.split('/').pop();
      return {
        name: folderName,
        path: `/${folderPath}`,
        type: 'folder',
      };
    });

    // Parse files (Contents)
    const files = (response.Contents || [])
      .filter(item => !item.Key.endsWith('/')) // Skip folder markers
      .map(item => ({
        name: item.Key.split('/').pop(),
        path: `/${item.Key}`,
        url: getR2PublicUrl(item.Key),
        size: item.Size,
        modified: item.LastModified,
        type: 'file',
        isImage: /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(item.Key),
      }));

    return {
      files,
      folders,
      currentPath: `/${cleanPrefix}`,
    };
  } catch (error) {
    console.error('Error listing R2 files:', error);
    throw new Error(`Failed to list files: ${error.message}`);
  }
};

// Delete file from R2
export const deleteFromR2 = async (key) => {
  try {
    const cleanKey = key.startsWith('/') ? key.slice(1) : key;
    
    const command = new DeleteObjectCommand({
      Bucket: r2Config.bucketName,
      Key: cleanKey,
    });

    await r2Client.send(command);

    return { success: true };
  } catch (error) {
    console.error('Error deleting from R2:', error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
};

// Create folder in R2 (by uploading empty marker)
export const createR2Folder = async (folderPath) => {
  try {
    const cleanPath = folderPath.startsWith('/') ? folderPath.slice(1) : folderPath;
    const folderKey = cleanPath.endsWith('/') ? cleanPath : `${cleanPath}/`;

    // Create folder by uploading a .folder marker
    const command = new PutObjectCommand({
      Bucket: r2Config.bucketName,
      Key: `${folderKey}.folder`,
      Body: Buffer.from(''),
      ContentType: 'application/x-empty',
      Metadata: {
        type: 'folder-marker',
        createdAt: new Date().toISOString(),
      },
    });

    await r2Client.send(command);

    return {
      success: true,
      path: `/${folderKey}`,
    };
  } catch (error) {
    console.error('Error creating R2 folder:', error);
    throw new Error(`Failed to create folder: ${error.message}`);
  }
};

// Check if file exists in R2
export const checkR2FileExists = async (key) => {
  try {
    const cleanKey = key.startsWith('/') ? key.slice(1) : key;
    
    const command = new HeadObjectCommand({
      Bucket: r2Config.bucketName,
      Key: cleanKey,
    });

    await r2Client.send(command);
    return true;
  } catch (error) {
    if (error.name === 'NotFound') {
      return false;
    }
    throw error;
  }
};
