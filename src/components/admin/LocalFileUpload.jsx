import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, File, Check } from 'lucide-react';
import Button from '../ui/Button';
import { uploadFile } from '../../api/fileManagement';

const LocalFileUpload = ({ 
  onUploadComplete, 
  targetPath = '/images/projects',
  accept = 'image/*',
  maxSize = 10 // MB
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const inputRef = useRef(null);

  const validateFile = (file) => {
    const maxBytes = maxSize * 1024 * 1024;
    if (file.size > maxBytes) {
      return `File size must be less than ${maxSize}MB`;
    }
    
    if (accept && !file.type.match(accept.replace('*', '.*'))) {
      return `File type must be ${accept}`;
    }
    
    return null;
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSelectedFile(file);
    setError('');
    setSuccess(false);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError('');

    try {
      const result = await uploadFile(selectedFile, targetPath);
      setSuccess(true);
      
      // Call callback with the uploaded file path
      if (onUploadComplete) {
        onUploadComplete(result.path);
      }

      // Reset after a delay
      setTimeout(() => {
        setSelectedFile(null);
        setPreview(null);
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    setError('');
    setSuccess(false);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* File Input */}
      <div
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
          error 
            ? 'border-red-500 bg-red-50' 
            : success
            ? 'border-green-500 bg-green-50'
            : 'border-primary/20 hover:border-primary/40 hover:bg-primary/5'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {success ? (
          <div className="flex flex-col items-center">
            <Check className="text-green-600 mb-2" size={48} />
            <p className="text-green-600 font-medium">Upload successful!</p>
          </div>
        ) : (
          <>
            <Upload className="mx-auto mb-2 text-muted" size={32} />
            <p className="text-sm text-primary mb-1">
              Click to select a file
            </p>
            <p className="text-xs text-muted">
              {accept} • Max {maxSize}MB
            </p>
          </>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
        >
          {error}
        </motion.div>
      )}

      {/* Preview and Upload */}
      <AnimatePresence>
        {selectedFile && !success && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {/* Preview */}
            <div className="flex items-start gap-3 p-3 border border-primary/20 rounded-lg bg-white">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded"
                />
              ) : (
                <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded">
                  <File size={32} className="text-gray-400" />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                <p className="text-xs text-muted">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
                <p className="text-xs text-muted">
                  Upload to: {targetPath}
                </p>
              </div>

              <button
                onClick={handleClear}
                className="p-2 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                disabled={uploading}
              >
                <X size={18} />
              </button>
            </div>

            {/* Upload Button */}
            <div className="flex gap-2">
              <Button
                variant="primary"
                onClick={handleUpload}
                disabled={uploading}
                className="flex-1"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={16} className="mr-2" />
                    Upload File
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                onClick={handleClear}
                disabled={uploading}
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info */}
      <div className="text-xs text-muted">
        <p>Target folder: {targetPath}</p>
      </div>
    </div>
  );
};

export default LocalFileUpload;
