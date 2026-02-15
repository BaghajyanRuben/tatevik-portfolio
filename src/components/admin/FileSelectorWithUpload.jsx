import { useState } from 'react';
import { FolderOpen, X } from 'lucide-react';
import Button from '../ui/Button';
import FileBrowserModal from './FileBrowserModal';

const FileSelectorWithUpload = ({ 
  label,
  name,
  value, // Current file path or array of paths
  onChange,
  multiple = false,
  required = false,
  error,
  targetPath = '/images/projects'
}) => {
  const [showBrowser, setShowBrowser] = useState(false);

  const handleBrowserSelect = (paths) => {
    onChange({ target: { name, value: paths } });
    setShowBrowser(false);
  };

  const handleRemove = (pathToRemove) => {
    if (multiple) {
      const newPaths = value.filter(p => p !== pathToRemove);
      onChange({ target: { name, value: newPaths } });
    } else {
      onChange({ target: { name, value: '' } });
    }
  };

  const currentPaths = multiple 
    ? (Array.isArray(value) ? value : [])
    : (value ? [value] : []);

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-primary mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Action Button */}
      <div className="mb-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => setShowBrowser(true)}
          className="w-full"
        >
          <FolderOpen size={16} className="mr-2" />
          Browse & Upload Files
        </Button>
      </div>

      {/* Selected Files Preview */}
      {currentPaths.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-3">
          {currentPaths.map((pathOrUrl, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-primary/10">
                <img 
                  src={pathOrUrl} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback for broken images
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemove(pathOrUrl)}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
              <div className="mt-1">
                <p className="text-xs text-muted truncate">
                  {pathOrUrl.includes('r2.dev') 
                    ? pathOrUrl.split('/').pop() 
                    : pathOrUrl.split('/').pop()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {currentPaths.length === 0 && (
        <div className="border-2 border-dashed border-primary/20 rounded-lg p-6 text-center text-muted text-sm">
          No file selected. Click "Browse Existing" or "Upload New" to select files.
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}

      {/* Browser Modal */}
      {showBrowser && (
        <FileBrowserModal
          isOpen={showBrowser}
          onClose={() => setShowBrowser(false)}
          onSelect={handleBrowserSelect}
          multiple={multiple}
          title={label || 'Browse & Upload Files'}
        />
      )}
    </div>
  );
};

export default FileSelectorWithUpload;
