import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc,
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import projectsData from '../data/projects.json';

const COLLECTION_NAME = 'projects';

// Get all projects (with fallback to JSON)
export const getAllProjects = async () => {
  try {
    // Get ALL documents without ordering first
    const allDocsQuery = query(collection(db, COLLECTION_NAME));
    const allDocsSnapshot = await getDocs(allDocsQuery);
    
    console.log('📊 Total projects in Firestore:', allDocsSnapshot.size);
    
    // Now try ordering by 'order' field (for custom ordering)
    let querySnapshot;
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        orderBy('order', 'asc')
      );
      querySnapshot = await getDocs(q);
      console.log('✅ Using order field, returned:', querySnapshot.size, 'projects');
      
      // If fewer results than total, some projects are missing 'order' field
      if (querySnapshot.size < allDocsSnapshot.size) {
        console.warn('⚠️ Some projects missing order field!', 
          'Total:', allDocsSnapshot.size, 
          'With order:', querySnapshot.size
        );
        // Use all docs instead
        querySnapshot = allDocsSnapshot;
      }
    } catch (orderError) {
      // If 'order' field doesn't exist or no index, fall back to createdAt
      console.log('⚠️ No order field or index, using createdAt ordering');
      try {
        const q = query(
          collection(db, COLLECTION_NAME),
          orderBy('createdAt', 'desc')
        );
        querySnapshot = await getDocs(q);
        console.log('✅ Using createdAt ordering, returned:', querySnapshot.size, 'projects');
      } catch (createdAtError) {
        console.warn('⚠️ createdAt ordering failed too, using unordered');
        querySnapshot = allDocsSnapshot;
      }
    }
    
    if (querySnapshot.empty) {
      // Fallback to JSON if no projects in Firebase
      console.log('⚠️ No projects in Firebase, using JSON fallback');
      return projectsData.projects;
    }
    
    const projects = [];
    querySnapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() });
    });
    
    console.log('✅ Fetched projects from Firebase:', projects.length, 'projects');
    
    return projects;
  } catch (error) {
    console.error('Error fetching projects from Firebase, using JSON fallback:', error);
    // Fallback to JSON on error
    return projectsData.projects;
  }
};

// Get single project by ID (with fallback to JSON)
export const getProjectById = async (id) => {
  try {
    // Try to find in Firebase first
    const q = query(
      collection(db, COLLECTION_NAME),
      where('id', '==', id)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const docData = querySnapshot.docs[0];
      return { id: docData.id, ...docData.data() };
    }
    
    // Fallback to JSON
    console.log('Project not found in Firebase, using JSON fallback');
    return projectsData.projects.find(p => p.id === id);
  } catch (error) {
    console.error('Error fetching project from Firebase, using JSON fallback:', error);
    // Fallback to JSON on error
    return projectsData.projects.find(p => p.id === id);
  }
};

// Get published projects only
export const getPublishedProjects = async () => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      // Fallback to JSON
      console.log('No published projects in Firebase, using JSON fallback');
      return projectsData.projects;
    }
    
    const projects = [];
    querySnapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() });
    });
    return projects;
  } catch (error) {
    console.error('Error fetching published projects, using JSON fallback:', error);
    return projectsData.projects;
  }
};

// Add new project (admin only)
export const addProject = async (projectData, filePaths, adminEmail) => {
  try {
    // Get current max order value
    let maxOrder = 0;
    try {
      const allProjects = await getAllProjects();
      maxOrder = Math.max(0, ...allProjects.map(p => p.order || 0));
    } catch (e) {
      console.warn('Could not get max order, using 0');
    }
    
    // No file uploads - just save paths directly
    const projectToSave = {
      ...projectData,
      thumbnail: filePaths.thumbnail || projectData.thumbnail || '',
      heroImage: filePaths.heroImage || projectData.heroImage || '',
      heroMockups: filePaths.heroMockups || projectData.heroMockups || [],
      gallery: {
        images: filePaths.gallery || projectData.gallery?.images || []
      },
      status: projectData.status || 'published',
      order: maxOrder + 1, // Add order field
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: adminEmail,
      updatedBy: adminEmail
    };
    
    // Update infoSections with image paths
    if (projectToSave.infoSections && filePaths.infoSections) {
      projectToSave.infoSections = projectToSave.infoSections.map((section, index) => {
        const sectionPaths = filePaths.infoSections[index] || {};
        return {
          ...section,
          topImage: sectionPaths.topImage || section.topImage || '',
          bottomImage: sectionPaths.bottomImage || section.bottomImage || ''
        };
      });
    }
    
    // Remove any undefined values (Firestore doesn't accept them)
    const cleanedProject = removeUndefined(projectToSave);
    
    console.log('💾 Saving project to Firestore:', cleanedProject);
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), cleanedProject);
    
    console.log('✅ Project saved successfully! Firestore ID:', docRef.id);
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding project:', error);
    throw new Error(error.message || 'Failed to add project.');
  }
};

// Helper: Remove undefined values from object (Firestore doesn't accept undefined)
const removeUndefined = (obj) => {
  const cleaned = {};
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    if (value !== undefined) {
      if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        cleaned[key] = removeUndefined(value);
      } else {
        cleaned[key] = value;
      }
    }
  });
  return cleaned;
};

// Update existing project (admin only)
export const updateProject = async (id, projectData, filePaths, adminEmail) => {
  try {
    // Get the Firestore document ID
    const q = query(
      collection(db, COLLECTION_NAME),
      where('id', '==', id)
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error('Project not found');
    }
    
    const docId = querySnapshot.docs[0].id;
    
    // No file uploads - just use paths
    const projectToUpdate = {
      ...projectData,
      thumbnail: filePaths.thumbnail || projectData.thumbnail || '',
      heroImage: filePaths.heroImage || projectData.heroImage || '',
      heroMockups: filePaths.heroMockups || projectData.heroMockups || [],
      gallery: {
        images: filePaths.gallery || projectData.gallery?.images || []
      },
      updatedAt: serverTimestamp(),
      updatedBy: adminEmail
    };
    
    // Update infoSections with image paths
    if (projectToUpdate.infoSections && filePaths.infoSections) {
      projectToUpdate.infoSections = projectToUpdate.infoSections.map((section, index) => {
        const sectionPaths = filePaths.infoSections[index] || {};
        return {
          ...section,
          topImage: sectionPaths.topImage || section.topImage || '',
          bottomImage: sectionPaths.bottomImage || section.bottomImage || ''
        };
      });
    }
    
    // Remove any undefined values (Firestore doesn't accept them)
    const cleanedProject = removeUndefined(projectToUpdate);
    
    const projectRef = doc(db, COLLECTION_NAME, docId);
    await updateDoc(projectRef, cleanedProject);
    
    return { success: true };
  } catch (error) {
    console.error('Error updating project:', error);
    throw new Error(error.message || 'Failed to update project.');
  }
};

// Delete project (admin only)
// Note: This only deletes the Firestore document, not the local files
// Files should be managed manually through the file browser
export const deleteProject = async (id) => {
  try {
    // Get the Firestore document ID
    const q = query(
      collection(db, COLLECTION_NAME),
      where('id', '==', id)
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error('Project not found');
    }
    
    const docId = querySnapshot.docs[0].id;
    
    // Delete Firestore document
    // Note: Local files remain in public/images/projects/
    const projectRef = doc(db, COLLECTION_NAME, docId);
    await deleteDoc(projectRef);
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting project:', error);
    throw new Error(error.message || 'Failed to delete project.');
  }
};

// Toggle project status (admin only)
export const toggleProjectStatus = async (id, adminEmail) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('id', '==', id)
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error('Project not found');
    }
    
    const docId = querySnapshot.docs[0].id;
    const currentData = querySnapshot.docs[0].data();
    const newStatus = currentData.status === 'published' ? 'draft' : 'published';
    
    const projectRef = doc(db, COLLECTION_NAME, docId);
    await updateDoc(projectRef, {
      status: newStatus,
      updatedAt: serverTimestamp(),
      updatedBy: adminEmail
    });
    
    return { success: true, status: newStatus };
  } catch (error) {
    console.error('Error toggling project status:', error);
    throw new Error('Failed to update project status.');
  }
};

// Update project order (for drag-and-drop reordering)
export const updateProjectsOrder = async (projectsWithOrder, adminEmail) => {
  try {
    const batch = [];
    
    for (const project of projectsWithOrder) {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('id', '==', project.id)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id;
        const projectRef = doc(db, COLLECTION_NAME, docId);
        
        batch.push(
          updateDoc(projectRef, {
            order: project.order,
            updatedAt: serverTimestamp(),
            updatedBy: adminEmail
          })
        );
      }
    }
    
    await Promise.all(batch);
    return { success: true };
  } catch (error) {
    console.error('Error updating projects order:', error);
    throw new Error(error.message || 'Failed to update projects order.');
  }
};
