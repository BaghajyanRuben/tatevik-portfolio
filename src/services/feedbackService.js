import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

const COLLECTION_NAME = 'feedbacks';

// Submit new feedback (public - status: pending)
export const submitFeedback = async (feedbackData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...feedbackData,
      status: 'pending',
      submittedAt: serverTimestamp(),
      approvedAt: null,
      approvedBy: null
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw new Error('Failed to submit feedback. Please try again.');
  }
};

// Get only approved feedbacks (public)
export const getApprovedFeedbacks = async () => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('status', '==', 'approved'),
      orderBy('approvedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const feedbacks = [];
    querySnapshot.forEach((doc) => {
      feedbacks.push({ id: doc.id, ...doc.data() });
    });
    return feedbacks;
  } catch (error) {
    console.error('Error fetching approved feedbacks:', error);
    throw new Error('Failed to load feedbacks.');
  }
};

// Get all feedbacks (admin only)
export const getAllFeedbacks = async () => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('submittedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const feedbacks = [];
    querySnapshot.forEach((doc) => {
      feedbacks.push({ id: doc.id, ...doc.data() });
    });
    return feedbacks;
  } catch (error) {
    console.error('Error fetching all feedbacks:', error);
    // Try without ordering as fallback (in case of missing index)
    try {
      const fallbackQuery = query(collection(db, COLLECTION_NAME));
      const fallbackSnapshot = await getDocs(fallbackQuery);
      const feedbacks = [];
      fallbackSnapshot.forEach((doc) => {
        feedbacks.push({ id: doc.id, ...doc.data() });
      });
      console.log('✅ Fetched feedbacks without ordering:', feedbacks.length);
      return feedbacks;
    } catch (fallbackError) {
      console.error('Error fetching feedbacks (fallback):', fallbackError);
      return [];
    }
  }
};

// Get feedbacks by status (admin only)
export const getFeedbacksByStatus = async (status) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('status', '==', status),
      orderBy('submittedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const feedbacks = [];
    querySnapshot.forEach((doc) => {
      feedbacks.push({ id: doc.id, ...doc.data() });
    });
    return feedbacks;
  } catch (error) {
    console.error('Error fetching feedbacks by status:', error);
    throw new Error('Failed to load feedbacks.');
  }
};

// Approve feedback (admin only)
export const approveFeedback = async (feedbackId, adminEmail) => {
  try {
    const feedbackRef = doc(db, COLLECTION_NAME, feedbackId);
    await updateDoc(feedbackRef, {
      status: 'approved',
      approvedAt: serverTimestamp(),
      approvedBy: adminEmail
    });
    return { success: true };
  } catch (error) {
    console.error('Error approving feedback:', error);
    throw new Error('Failed to approve feedback.');
  }
};

// Reject/Delete feedback (admin only)
export const deleteFeedback = async (feedbackId) => {
  try {
    const feedbackRef = doc(db, COLLECTION_NAME, feedbackId);
    await deleteDoc(feedbackRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting feedback:', error);
    throw new Error('Failed to delete feedback.');
  }
};

// Add feedback by admin (auto-approved)
export const addFeedbackByAdmin = async (feedbackData, adminEmail) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...feedbackData,
      status: 'approved',
      submittedAt: serverTimestamp(),
      approvedAt: serverTimestamp(),
      approvedBy: adminEmail
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding feedback:', error);
    throw new Error('Failed to add feedback.');
  }
};
