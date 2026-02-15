import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, File, Image as ImageIcon } from 'lucide-react';
import Button from './Button';

const FileUpload = ({ 
  label, 
  name,
  accept = 'image/*',
  multiple = false,
  maxSize = 10, // MB
  onChange,
  error,
  required = false,
  existingFiles = [],
  className = ''
}) => {
  const [previews, setPreviews] = useState([]);
  const [dragActive, setDragActive] = useState(false);
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

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    const validFiles = [];
    const errors = [];

    fileArray.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push({ file: file.name, error });
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      alert(errors.map(e => `${e.file}: ${e.error}`).join('\n'));
    }

    if (validFiles.length > 0) {
      const newPreviews = validFiles.map(file => ({
        file,
        preview: file.type.startsWith('image/') 
          ? URL.createObjectURL(file) 
          : null,
        name: file.name,
        size: (file.size / 1024).toFixed(2) + ' KB'
      }));

      if (multiple) {
        setPreviews(prev => [...prev, ...newPreviews]);
        onChange && onChange(name, [...previews.map(p => p.file), ...validFiles]);
      } else {
        setPreviews(newPreviews);
        onChange && onChange(name, validFiles[0]);
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (index) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    
    if (multiple) {
      onChange && onChange(name, newPreviews.map(p => p.file));
    } else {
      onChange && onChange(name, null);
    }
  };

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-primary mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
          dragActive 
            ? 'border-primary bg-primary/5' 
            : error
            ? 'border-red-500 bg-red-50'
            : 'border-primary/20 hover:border-primary/40 hover:bg-primary/5'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
        />
        
        <Upload className="mx-auto mb-2 text-muted" size={32} />
        <p className="text-sm text-primary mb-1">
          Click to upload or drag and drop
        </p>
        <p className="text-xs text-muted">
          {accept} {multiple && '(multiple files)'} • Max {maxSize}MB
        </p>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}

      {/* Preview Grid */}
      {(previews.length > 0 || existingFiles.length > 0) && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Existing Files */}
          {existingFiles.map((file, index) => (
            <motion.div
              key={`existing-${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative group"
            >
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-primary/10">
                {typeof file === 'string' && file.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <img 
                    src={file} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <File size={32} className="text-muted" />
                  </div>
                )}
              </div>
              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="inline-block px-2 py-1 text-xs bg-blue-500 text-white rounded">
                  Existing
                </span>
              </div>
            </motion.div>
          ))}

          {/* New Previews */}
          <AnimatePresence>
            {previews.map((preview, index) => (
              <motion.div
                key={`preview-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative group"
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-primary/10">
                  {preview.preview ? (
                    <img 
                      src={preview.preview} 
                      alt={preview.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <File size={32} className="text-muted" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X size={16} />
                </button>
                <div className="mt-1">
                  <p className="text-xs text-muted truncate">{preview.name}</p>
                  <p className="text-xs text-muted">{preview.size}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
