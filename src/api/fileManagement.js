// API functions for file management (Cloudflare R2)

const USE_R2 = import.meta.env.VITE_R2_ACCOUNT_ID ? true : false;
const API_PREFIX = USE_R2 ? '/api/r2' : '/api';

export const listFiles = async (dirPath = '/images/projects') => {
  try {
    const response = await fetch(`${API_PREFIX}/list-files?path=${encodeURIComponent(dirPath)}`);
    if (!response.ok) {
      throw new Error('Failed to list files');
    }
    return await response.json();
  } catch (error) {
    console.error('List files error:', error);
    throw error;
  }
};

export const createFolder = async (folderName, parentPath = '/images/projects') => {
  try {
    const response = await fetch(`${API_PREFIX}/create-folder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ folderName, parentPath }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create folder');
    }
    
    return data;
  } catch (error) {
    console.error('Create folder error:', error);
    throw error;
  }
};

export const uploadFile = async (file, targetPath = '/images/projects') => {
  try {
    console.log('📤 Client uploading:', { file: file.name, targetPath, API_PREFIX });
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', targetPath);

    const response = await fetch(`${API_PREFIX}/upload-file`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to upload file');
    }

    return data;
  } catch (error) {
    console.error('Upload file error:', error);
    throw error;
  }
};

export const deleteFile = async (filePath) => {
  try {
    const response = await fetch(`${API_PREFIX}/delete-file`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path: filePath }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete file');
    }

    return data;
  } catch (error) {
    console.error('Delete file error:', error);
    throw error;
  }
};
