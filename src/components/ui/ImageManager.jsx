import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, GripVertical } from 'lucide-react';
import Button from './Button';

const ImageManager = ({ 
  label,
  images = [], // Array of URLs (strings) or File objects
  onChange,
  maxImages = 20,
  maxSize = 10, // MB
  error,
  required = false,
  className = ''
}) => {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const validateFile = (file) => {
    const maxBytes = maxSize * 1024 * 1024;
    if (file.size > maxBytes) {
      return `File size must be less than ${maxSize}MB`;
    }
    
    if (!file.type.startsWith('image/')) {
      return 'File must be an image';
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
      const remainingSlots = maxImages - images.length;
      const filesToAdd = validFiles.slice(0, remainingSlots);
      
      if (validFiles.length > remainingSlots) {
        alert(`Only ${remainingSlots} more images can be added (max ${maxImages})`);
      }
      
      onChange([...images, ...filesToAdd]);
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

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);
    
    setDraggedIndex(index);
    onChange(newImages);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const getImageUrl = (image) => {
    if (typeof image === 'string') {
      return image; // Existing URL
    } else if (image instanceof File) {
      return URL.createObjectURL(image);
    }
    return null;
  };

  const isExistingImage = (image) => typeof image === 'string' && image.startsWith('http');

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-primary mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
          <span className="ml-2 text-xs text-muted">
            ({images.length}/{maxImages})
          </span>
        </label>
      )}

      {/* Upload Area */}
      {images.length < maxImages && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 mb-4 ${
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
            accept="image/*"
            multiple
            onChange={handleChange}
            className="hidden"
          />
          
          <Upload className="mx-auto mb-2 text-muted" size={32} />
          <p className="text-sm text-primary mb-1">
            Click to upload or drag and drop images
          </p>
          <p className="text-xs text-muted">
            PNG, JPG, GIF, WEBP • Max {maxSize}MB per file
          </p>
        </div>
      )}

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {images.map((image, index) => {
              const imageUrl = getImageUrl(image);
              const isExisting = isExistingImage(image);
              
              return (
                <motion.div
                  key={`${imageUrl}-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`relative group cursor-move ${
                    draggedIndex === index ? 'opacity-50' : ''
                  }`}
                >
                  {/* Drag Handle */}
                  <div className="absolute top-2 left-2 p-1 bg-white/90 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <GripVertical size={16} className="text-gray-600" />
                  </div>

                  {/* Image */}
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-primary/10">
                    {imageUrl && (
                      <img 
                        src={imageUrl} 
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Status Badge */}
                  {isExisting && (
                    <div className="absolute top-2 right-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="inline-block px-2 py-1 text-xs bg-blue-500 text-white rounded">
                        Existing
                      </span>
                    </div>
                  )}

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                  >
                    <X size={16} />
                  </button>

                  {/* Index */}
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                    #{index + 1}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {images.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-primary/20 rounded-lg">
          <p className="text-muted text-sm">No images added yet</p>
        </div>
      )}
    </div>
  );
};

export default ImageManager;
