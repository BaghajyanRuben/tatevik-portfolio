import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, EyeOff, Search, ArrowUpDown } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/ui/Button';
import { ToastContainer } from '../../components/ui/Toast';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../contexts/AuthContext';
import { 
  getAllProjects, 
  deleteProject, 
  toggleProjectStatus 
} from '../../services/projectService';
import SEO from '../../components/SEO';

const ManageProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [processing, setProcessing] = useState(false);
  const { toasts, removeToast, showSuccess, showError } = useToast();
  const { currentUser } = useAuth();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getAllProjects();
      console.log('📋 ManageProjects: Fetched', data.length, 'projects');
      setProjects(data);
      setFilteredProjects(data);
    } catch (error) {
      showError(error.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    let filtered = [...projects];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(project =>
        project.categories?.includes(filterCategory)
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(project =>
        project.status === filterStatus
      );
    }

    setFilteredProjects(filtered);
  }, [searchQuery, filterCategory, filterStatus, projects]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone and will delete all project files.`)) {
      return;
    }

    setProcessing(true);
    try {
      await deleteProject(id);
      showSuccess('Project deleted successfully!');
      await fetchProjects();
    } catch (error) {
      showError(error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    if (!currentUser?.email) {
      showError('Authentication error. Please login again.');
      return;
    }

    setProcessing(true);
    try {
      const result = await toggleProjectStatus(id, currentUser.email);
      showSuccess(`Project ${result.status === 'published' ? 'published' : 'unpublished'} successfully!`);
      await fetchProjects();
    } catch (error) {
      showError(error.message);
    } finally {
      setProcessing(false);
    }
  };

  const stats = {
    total: projects.length,
    published: projects.filter(p => p.status === 'published').length,
    draft: projects.filter(p => p.status === 'draft').length,
    featured: projects.filter(p => p.top).length
  };

  const categories = ['all', ...new Set(projects.flatMap(p => p.categories || []))];

  return (
    <AdminLayout>
      <SEO title="Manage Projects" noindex />
      
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="heading-lg mb-2">Manage Projects</h1>
          <p className="body-md text-muted">View, edit, and manage all portfolio projects</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/projects/reorder">
            <Button variant="secondary">
              <ArrowUpDown size={18} className="mr-2" />
              Reorder
            </Button>
          </Link>
          <Link to="/admin/projects/add">
            <Button variant="primary">
              <Plus size={18} className="mr-2" />
              Add Project
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="soft-card">
              <div className="h-20 animate-pulse bg-primary/5 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="soft-card"
          >
            <p className="text-sm text-muted mb-1">Total Projects</p>
            <p className="text-3xl font-bold text-primary">{stats.total}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="soft-card"
          >
            <p className="text-sm text-muted mb-1">Published</p>
            <p className="text-3xl font-bold text-green-600">{stats.published}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="soft-card"
          >
            <p className="text-sm text-muted mb-1">Drafts</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.draft}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="soft-card"
          >
            <p className="text-sm text-muted mb-1">Featured</p>
            <p className="text-3xl font-bold text-blue-600">{stats.featured}</p>
          </motion.div>
        </div>
      )}

      {/* Filters */}
      <div className="soft-card mb-6">
        <div className="grid md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={18} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 rounded-lg border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 rounded-lg border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Projects List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="soft-card">
              <div className="h-32 animate-pulse bg-primary/5 rounded"></div>
            </div>
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="soft-card text-center py-12">
          <p className="text-muted mb-4">No projects found</p>
          <Link to="/admin/projects/add">
            <Button variant="primary">
              <Plus size={18} className="mr-2" />
              Add Your First Project
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="soft-card hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row gap-4">
                {/* Thumbnail */}
                <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {project.thumbnail ? (
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted">
                      No Image
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-lg mb-1 truncate">{project.title}</h3>
                      <p className="text-sm text-muted mb-2 truncate">{project.subtitle}</p>
                    </div>
                    
                    {/* Status & Featured Badges */}
                    <div className="flex gap-2 ml-2">
                      {project.top && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                          Featured
                        </span>
                      )}
                      <span className={`px-2 py-1 text-xs rounded ${
                        project.status === 'published' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {project.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.categories?.map(category => (
                      <span key={category} className="px-2 py-1 text-xs bg-primary/10 text-primary rounded">
                        {category}
                      </span>
                    ))}
                  </div>

                  {(project.industry || project.client) && (
                    <p className="text-xs text-muted mb-3">
                      {project.industry && `Industry: ${project.industry}`}
                      {project.industry && project.client && ' • '}
                      {project.client && `Client: ${project.client}`}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => navigate(`/admin/projects/edit/${project.id}`)}
                      disabled={processing}
                      className="text-sm"
                    >
                      <Edit2 size={14} className="mr-1" />
                      Edit
                    </Button>
                    
                    <Button
                      variant="ghost"
                      onClick={() => handleToggleStatus(project.id, project.status)}
                      disabled={processing}
                      className="text-sm"
                    >
                      {project.status === 'published' ? (
                        <>
                          <EyeOff size={14} className="mr-1" />
                          Unpublish
                        </>
                      ) : (
                        <>
                          <Eye size={14} className="mr-1" />
                          Publish
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      onClick={() => window.open(`/project/${project.id}`, '_blank')}
                      className="text-sm"
                    >
                      <Eye size={14} className="mr-1" />
                      View
                    </Button>
                    
                    <Button
                      variant="ghost"
                      onClick={() => handleDelete(project.id, project.title)}
                      disabled={processing}
                      className="text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={14} className="mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </AdminLayout>
  );
};

export default ManageProjects;
