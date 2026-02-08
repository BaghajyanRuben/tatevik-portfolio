import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

const DatePicker = ({ 
  label, 
  name, 
  value, 
  onChange, 
  error, 
  required = false,
  disabled = false,
  className = '',
  placeholder = ''
}) => {
  // Format value from "Jan 2024" to "2024-01" for input
  const formatValueForInput = (val) => {
    if (!val) return '';
    
    // If already in YYYY-MM format, return as is
    if (/^\d{4}-\d{2}$/.test(val)) return val;
    
    // If in "MMM YYYY" format, convert to YYYY-MM
    const months = {
      'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
      'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
      'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    };
    
    const parts = val.split(' ');
    if (parts.length === 2 && months[parts[0]]) {
      return `${parts[1]}-${months[parts[0]]}`;
    }
    
    return val;
  };

  // Format value from "2024-01" to "Jan 2024" for display/storage
  const formatValueForDisplay = (val) => {
    if (!val) return '';
    
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    const [year, month] = val.split('-');
    const monthIndex = parseInt(month, 10) - 1;
    
    if (year && months[monthIndex]) {
      return `${months[monthIndex]} ${year}`;
    }
    
    return val;
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;
    const displayValue = formatValueForDisplay(inputValue);
    
    // Call parent onChange with formatted value
    onChange({
      target: {
        name,
        value: displayValue
      }
    });
  };

  const inputValue = formatValueForInput(value);

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-primary mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <motion.input
          whileFocus={{ scale: 1.01 }}
          type="month"
          id={name}
          name={name}
          value={inputValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`w-full px-4 py-3 pr-12 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 ${
            error 
              ? 'border-red-500 focus:ring-red-500/20' 
              : 'border-primary/20 focus:ring-primary/20 focus:border-primary'
          } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary/40">
          <Calendar size={20} />
        </div>
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
    </div>
  );
};

export default DatePicker;
