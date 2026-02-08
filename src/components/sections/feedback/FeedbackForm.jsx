import { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '../../ui/Input';
import Textarea from '../../ui/Textarea';
import StarRating from '../../ui/StarRating';
import DatePicker from '../../ui/DatePicker';
import Button from '../../ui/Button';
import { submitFeedback } from '../../../services/feedbackService';

const FeedbackForm = ({ onSuccess, onError }) => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Name is required';
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

    setIsSubmitting(true);

    try {
      await submitFeedback(formData);
      
      // Reset form
      setFormData({
        clientName: '',
        projectTitle: '',
        rating: 0,
        startDate: '',
        endDate: '',
        feedback: ''
      });
      setErrors({});
      
      if (onSuccess) {
        onSuccess('Thank you for your feedback! It will be reviewed and published shortly.');
      }
    } catch (error) {
      if (onError) {
        onError(error.message || 'Failed to submit feedback. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="soft-card max-w-3xl mx-auto pb-8"
    >
      <h2 className="heading-md mb-2">Share Your Experience</h2>
      <p className="body-sm text-muted mb-6">
        Your feedback helps showcase the quality of work and builds trust with potential clients.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Your Name"
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
            required
          />

          <DatePicker
            label="Project End Date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            error={errors.endDate}
            required
          />
        </div>

        <Textarea
          label="Your Feedback"
          name="feedback"
          value={formData.feedback}
          onChange={handleChange}
          error={errors.feedback}
          placeholder="Share your experience working together..."
          rows={5}
          required
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="min-w-[150px]"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default FeedbackForm;
