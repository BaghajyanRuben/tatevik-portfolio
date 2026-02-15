import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import Button from './Button';

const DynamicArrayInput = ({ 
  label,
  items = [],
  onChange,
  renderItem,
  addButtonText = 'Add Item',
  emptyMessage = 'No items added',
  required = false,
  error,
  minItems = 0,
  maxItems = 100,
  showReorder = true,
  className = ''
}) => {
  const handleAdd = () => {
    if (items.length < maxItems) {
      onChange([...items, '']);
    }
  };

  const handleRemove = (index) => {
    if (items.length > minItems) {
      const newItems = items.filter((_, i) => i !== index);
      onChange(newItems);
    }
  };

  const handleChange = (index, value) => {
    const newItems = [...items];
    newItems[index] = value;
    onChange(newItems);
  };

  const handleMoveUp = (index) => {
    if (index > 0) {
      const newItems = [...items];
      [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
      onChange(newItems);
    }
  };

  const handleMoveDown = (index) => {
    if (index < items.length - 1) {
      const newItems = [...items];
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
      onChange(newItems);
    }
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-primary mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="space-y-3">
        <AnimatePresence>
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8 border-2 border-dashed border-primary/20 rounded-lg"
            >
              <p className="text-muted text-sm">{emptyMessage}</p>
            </motion.div>
          ) : (
            items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-start gap-2"
              >
                {/* Reorder Buttons */}
                {showReorder && items.length > 1 && (
                  <div className="flex flex-col gap-1 pt-2">
                    <button
                      type="button"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className={`p-1 rounded hover:bg-gray-100 transition-colors ${
                        index === 0 ? 'opacity-30 cursor-not-allowed' : ''
                      }`}
                      title="Move up"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveDown(index)}
                      disabled={index === items.length - 1}
                      className={`p-1 rounded hover:bg-gray-100 transition-colors ${
                        index === items.length - 1 ? 'opacity-30 cursor-not-allowed' : ''
                      }`}
                      title="Move down"
                    >
                      <ChevronDown size={16} />
                    </button>
                  </div>
                )}

                {/* Item Content */}
                <div className="flex-1">
                  {renderItem ? (
                    renderItem(item, index, (value) => handleChange(index, value))
                  ) : (
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleChange(index, e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      placeholder={`Item ${index + 1}`}
                    />
                  )}
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  disabled={items.length <= minItems}
                  className={`p-3 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors mt-0 ${
                    items.length <= minItems ? 'opacity-30 cursor-not-allowed' : ''
                  }`}
                  title="Remove"
                >
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Add Button */}
      <div className="mt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={handleAdd}
          disabled={items.length >= maxItems}
          className="w-full justify-center"
        >
          <Plus size={18} className="mr-2" />
          {addButtonText}
        </Button>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default DynamicArrayInput;
