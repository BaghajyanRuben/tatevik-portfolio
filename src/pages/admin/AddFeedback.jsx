import { useState } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import StarRating from '../../components/ui/StarRating';
import DatePicker from '../../components/ui/DatePicker';
import Button from '../../components/ui/Button';
import { ToastContainer } from '../../components/ui/Toast';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../contexts/AuthContext';
import { addFeedbackByAdmin } from '../../services/feedbackService';
import SEO from '../../components/SEO';

const AddFeedback = () => {
  const [formData, setFormData] = useState({
    clientName: '',
    projectTitle: '',
    rating: 0,
    startDate: '',
    endDate: '',
    feedback: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toasts, removeToast, showSuccess, showError } = useToast();
  const { currentUser } = useAuth();

  // Get current date in YYYY-MM format for max date
  const getCurrentMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };

  // Convert "MMM YYYY" to "YYYY-MM" for comparison
  const convertToComparableDate = (dateStr) => {
    if (!dateStr) return null;
    const months = {
      'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
      'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
      'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    };
    const parts = dateStr.split(' ');
    if (parts.length === 2 && months[parts[0]]) {
      return `${parts[1]}-${months[parts[0]]}`;
    }
    return dateStr;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client name is required';
    }

    if (!formData.projectTitle.trim()) {
      newErrors.projectTitle = 'Project title is required';
    }

    if (formData.rating === 0) {
      newErrors.rating = 'Please select a rating';
    }

    if (!formData.startDate.trim()) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate.trim()) {
      newErrors.endDate = 'End date is required';
    }

    // Validate end date is not before start date
    if (formData.startDate && formData.endDate) {
      const startDateStr = convertToComparableDate(formData.startDate);
      const endDateStr = convertToComparableDate(formData.endDate);
      if (startDateStr && endDateStr && endDateStr < startDateStr) {
        newErrors.endDate = 'End date cannot be before start date';
      }
    }

    if (!formData.feedback.trim()) {
      newErrors.feedback = 'Feedback message is required';
    } else if (formData.feedback.trim().length < 20) {
      newErrors.feedback = 'Feedback should be at least 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!currentUser?.email) {
      showError('Authentication error. Please login again.');
      return;
    }

    setIsSubmitting(true);

    try {
      await addFeedbackByAdmin(formData, currentUser.email);
      
      setFormData({
        clientName: '',
        projectTitle: '',
        rating: 0,
        startDate: '',
        endDate: '',
        feedback: ''
      });
      setErrors({});
      
      showSuccess('Feedback added and approved successfully!');
    } catch (error) {
      showError(error.message || 'Failed to add feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <SEO title="Add Feedback" noindex />
      
      <div className="mb-8">
        <h1 className="heading-lg mb-2">Add New Feedback</h1>
        <p className="body-md text-muted">Manually add feedback that will be automatically approved</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="soft-card max-w-3xl mb-8"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Client Name"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              error={errors.clientName}
              placeholder="John Doe"
              required
            />

            <Input
              label="Project Title"
              name="projectTitle"
              value={formData.projectTitle}
              onChange={handleChange}
              error={errors.projectTitle}
              placeholder="My Awesome Project"
              required
            />
          </div>

          <StarRating
            label="Rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            error={errors.rating}
            required
          />

          <div className="grid md:grid-cols-2 gap-4">
            <DatePicker
              label="Project Start Date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              error={errors.startDate}
              max={getCurrentMonth()}
              required
            />

            <DatePicker
              label="Project End Date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              error={errors.endDate}
              min={formData.startDate ? convertToComparableDate(formData.startDate) : undefined}
              max={getCurrentMonth()}
              required
            />
          </div>

          <Textarea
            label="Feedback Message"
            name="feedback"
            value={formData.feedback}
            onChange={handleChange}
            error={errors.feedback}
            placeholder="Enter the client's feedback..."
            rows={6}
            required
          />

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setFormData({
                  clientName: '',
                  projectTitle: '',
                  rating: 0,
                  startDate: '',
                  endDate: '',
                  feedback: ''
                });
                setErrors({});
              }}
            >
              Clear Form
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="min-w-[150px]"
            >
              {isSubmitting ? 'Adding...' : 'Add Feedback'}
            </Button>
          </div>
        </form>
      </motion.div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </AdminLayout>
  );
};

export default AddFeedback;
