import { useState, useEffect } from 'react';
import { getApprovedFeedbacks } from '../services/feedbackService';

export const useFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getApprovedFeedbacks();
      setFeedbacks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return { feedbacks, loading, error, refetch: fetchFeedbacks };
};
