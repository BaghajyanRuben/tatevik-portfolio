import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Folder, File, Image as ImageIcon, Search, FolderPlus, Upload, Trash2, ArrowLeft } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { listFiles, createFolder, deleteFile, uploadFile } from '../../api/fileManagement';

const FileBrowserModal = ({ 
  isOpen, 
  onClose, 
  onSelect,
  multiple = false,
  title = 'Select Files'
}) => {
  const [currentPath, setCurrentPath] = useState('/images/projects');
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      loadDirectory(currentPath);
    }
  }, [isOpen, currentPath]);

  const loadDirectory = async (path) => {
    setLoading(true);
    setError('');
    try {
      const data = await listFiles(path);
      console.log('📂 Loaded directory:', path, data);
      setFiles(data.files || []);
      setFolders(data.folders || []);
    } catch (err) {
      setError('Failed to load directory: ' + err.message);
      console.error('Load directory error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFolderClick = (folderPath) => {
    console.log('🗂️ Clicking folder:', { folderPath, currentPath });
    if (folderPath === currentPath) {
      console.warn('⚠️ Folder path same as current path, not navigating');
      return;
    }
    setCurrentPath(folderPath);
    setSelectedItems([]);
  };

  const handleFileClick = (file) => {
    if (multiple) {
      setSelectedItems(prev => {
        const isSelected = prev.some(item => item.path === file.path);
        if (isSelected) {
          return prev.filter(item => item.path !== file.path);
        } else {
          return [...prev, file];
        }
      });
    } else {
      setSelectedItems([file]);
    }
  };

  const handleBackClick = () => {
    const parentPath = currentPath.split('/').slice(0, -1).join('/') || '/images/projects';
    setCurrentPath(parentPath);
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      setError('Folder name cannot be empty');
      return;
    }

    if (!/^[a-zA-Z0-9-_]+$/.test(newFolderName)) {
      setError('Folder name can only contain letters, numbers, hyphens, and underscores');
      return;
    }

    try {
      await createFolder(newFolderName, currentPath);
      setNewFolderName('');
      setShowCreateFolder(false);
      setError('');
      await loadDirectory(currentPath);
    } catch (err) {
      setError(err.message || 'Failed to create folder');
    }
  };

  const handleDelete = async (itemPath, isFolder) => {
    const confirmMessage = isFolder 
      ? 'Are you sure you want to delete this folder? It must be empty.'
      : 'Are you sure you want to delete this file?';
    
    if (!window.confirm(confirmMessage)) return;

    try {
      await deleteFile(itemPath);
      await loadDirectory(currentPath);
      setSelectedItems(prev => prev.filter(item => item.path !== itemPath));
    } catch (err) {
      setError(err.message || 'Failed to delete');
    }
  };

  const handleFileUpload = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    console.log('📤 Starting upload from path:', currentPath);
    
    setUploading(true);
    setError('');
    
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        setUploadProgress(`Uploading ${i + 1}/${selectedFiles.length}: ${file.name}`);
        
        await uploadFile(file, currentPath);
      }
      
      setUploadProgress('');
      await loadDirectory(currentPath);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err.message || 'Failed to upload files');
    } finally {
      setUploading(false);
      setUploadProgress('');
    }
  };

  const handleSelect = () => {
    if (selectedItems.length === 0) return;
    
    if (multiple) {
      // Return URLs if available, otherwise paths
      onSelect(selectedItems.map(item => item.url || item.path));
    } else {
      onSelect(selectedItems[0].url || selectedItems[0].path);
    }
    onClose();
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-medium">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Toolbar */}
          <div className="p-4 border-b space-y-3">
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="secondary"
                onClick={() => setShowCreateFolder(true)}
                disabled={uploading}
                className="text-sm"
              >
                <FolderPlus size={16} className="mr-2" />
                New Folder
              </Button>
              
              <Button
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="text-sm"
              >
                <Upload size={16} className="mr-2" />
                Upload Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              <Button
                variant="secondary"
                onClick={handleBackClick}
                disabled={currentPath === '/images/projects' || uploading}
                className="text-sm"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back
              </Button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={18} />
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Current Path */}
            <div className="text-sm text-muted">
              <span className="font-medium">Current:</span> {currentPath}
            </div>
          </div>

          {/* Create Folder Dialog */}
          {showCreateFolder && (
            <div className="p-4 bg-blue-50 border-b">
              <div className="flex gap-2">
                <Input
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Folder name (letters, numbers, -, _)"
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
                  className="flex-1"
                />
                <Button variant="primary" onClick={handleCreateFolder}>
                  Create
                </Button>
                <Button variant="ghost" onClick={() => {
                  setShowCreateFolder(false);
                  setNewFolderName('');
                  setError('');
                }}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="px-4 py-2 bg-red-50 border-b text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Upload Progress */}
          {uploading && uploadProgress && (
            <div className="px-4 py-2 bg-blue-50 border-b text-blue-600 text-sm">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                {uploadProgress}
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-2 text-muted">Loading...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {/* Folders */}
                {filteredFolders.map((folder) => (
                  <div
                    key={folder.path}
                    className="relative group"
                  >
                    <div
                      onClick={() => handleFolderClick(folder.path)}
                      className="flex flex-col items-center p-4 border-2 border-primary/20 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                      <Folder size={48} className="text-blue-500 mb-2" />
                      <p className="text-sm text-center truncate w-full">{folder.name}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(folder.path, true);
                      }}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}

                {/* Files */}
                {filteredFiles.map((file) => {
                  const isSelected = selectedItems.some(item => item.path === file.path);
                  return (
                    <div
                      key={file.path}
                      className="relative group"
                    >
                      <div
                        onClick={() => handleFileClick(file)}
                        className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          isSelected
                            ? 'border-primary bg-primary/10'
                            : 'border-primary/20 hover:border-primary hover:bg-primary/5'
                        }`}
                      >
                        {file.isImage ? (
                          <img
                            src={file.url || file.path}
                            alt={file.name}
                            className="w-full h-24 object-cover rounded mb-2"
                          />
                        ) : (
                          <File size={48} className="text-gray-400 mb-2" />
                        )}
                        <p className="text-xs text-center truncate w-full">{file.name}</p>
                        <p className="text-xs text-muted">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(file.path, false);
                        }}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}

                {filteredFiles.length === 0 && filteredFolders.length === 0 && (
                  <div className="col-span-full text-center py-12 text-muted">
                    {searchQuery ? 'No items found' : 'This folder is empty'}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-muted">
              {selectedItems.length > 0 && (
                <span>Selected: {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''}</span>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSelect}
                disabled={selectedItems.length === 0}
              >
                Select ({selectedItems.length})
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FileBrowserModal;
