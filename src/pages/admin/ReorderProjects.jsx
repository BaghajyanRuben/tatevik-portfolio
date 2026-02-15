import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GripVertical, Save, X } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/ui/Button';
import { ToastContainer } from '../../components/ui/Toast';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../contexts/AuthContext';
import { getAllProjects, updateProjectsOrder } from '../../services/projectService';
import SEO from '../../components/SEO';

// Sortable Item Component
const SortableItem = ({ project }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 p-4 bg-white border border-primary/10 rounded-lg ${
        isDragging ? 'shadow-lg z-10' : ''
      }`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-2 hover:bg-primary/5 rounded transition-colors"
      >
        <GripVertical size={20} className="text-muted" />
      </div>

      {/* Thumbnail */}
      {project.thumbnail && (
        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-16 h-16 object-cover rounded"
        />
      )}

      {/* Project Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-primary truncate">{project.title}</h3>
        <p className="text-sm text-muted truncate">{project.subtitle || project.id}</p>
      </div>

      {/* Status Badge */}
      <div className="flex-shrink-0">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            project.status === 'published'
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {project.status === 'published' ? 'Published' : 'Draft'}
        </span>
      </div>
    </div>
  );
};

const ReorderProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { toasts, removeToast, showSuccess, showError } = useToast();
  const { currentUser } = useAuth();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getAllProjects();
      
      // Assign order if not present
      const projectsWithOrder = data.map((project, index) => ({
        ...project,
        order: project.order !== undefined ? project.order : index
      }));
      
      // Sort by order
      projectsWithOrder.sort((a, b) => a.order - b.order);
      
      setProjects(projectsWithOrder);
    } catch (error) {
      showError(error.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setProjects((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newArray = arrayMove(items, oldIndex, newIndex);
        
        // Update order values
        return newArray.map((item, index) => ({
          ...item,
          order: index
        }));
      });
      
      setHasChanges(true);
    }
  };

  const handleSave = async () => {
    if (!currentUser?.email) {
      showError('Authentication error. Please login again.');
      return;
    }

    setSaving(true);
    try {
      const projectsWithNewOrder = projects.map((project, index) => ({
        id: project.id,
        order: index
      }));

      await updateProjectsOrder(projectsWithNewOrder, currentUser.email);
      showSuccess('Project order saved successfully!');
      setHasChanges(false);
    } catch (error) {
      showError(error.message || 'Failed to save order');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges && !window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
      return;
    }
    navigate('/admin/projects');
  };

  if (loading) {
    return (
      <AdminLayout>
        <SEO title="Reorder Projects - Admin" noIndex />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-muted">Loading projects...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <SEO title="Reorder Projects - Admin" noIndex />
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="heading-lg mb-2">Reorder Projects</h1>
            <p className="body-md text-muted">
              Drag and drop to reorder projects. The order will be reflected on the public site.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">You have unsaved changes</p>
              <p className="text-xs text-blue-700">Save your changes to update the project order</p>
            </div>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2"
            >
              <Save size={16} />
              {saving ? 'Saving...' : 'Save Order'}
            </Button>
            <Button
              variant="ghost"
              onClick={handleCancel}
              disabled={saving}
            >
              <X size={16} className="mr-2" />
              Cancel
            </Button>
          </motion.div>
        )}

        {!hasChanges && (
          <div className="flex justify-end mb-6">
            <Button
              variant="ghost"
              onClick={handleCancel}
            >
              Back to Projects
            </Button>
          </div>
        )}

        {/* Projects List */}
        {projects.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-primary/20 rounded-lg">
            <p className="text-muted">No projects to reorder</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={projects.map(p => p.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {projects.map((project) => (
                  <SortableItem key={project.id} project={project} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {/* Info Box */}
        <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="font-medium text-sm mb-2">💡 Tips:</h3>
          <ul className="text-sm text-muted space-y-1 list-disc list-inside">
            <li>Drag projects using the grip handle (⋮⋮) on the left</li>
            <li>The order you set here will be reflected on the home page</li>
            <li>Don't forget to click "Save Order" to apply your changes</li>
          </ul>
        </div>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </AdminLayout>
  );
};

export default ReorderProjects;
