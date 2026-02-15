import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, CheckCircle, Clock, Plus, FolderKanban, FileText, Eye } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/ui/Button';
import { getAllFeedbacks } from '../../services/feedbackService';
import { getAllProjects } from '../../services/projectService';
import SEO from '../../components/SEO';

const AdminDashboard = () => {
  const [feedbackStats, setFeedbackStats] = useState({
    total: 0,
    approved: 0,
    pending: 0
  });
  const [projectStats, setProjectStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    featured: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch feedback stats
        const feedbacks = await getAllFeedbacks();
        setFeedbackStats({
          total: feedbacks.length,
          approved: feedbacks.filter(f => f.status === 'approved').length,
          pending: feedbacks.filter(f => f.status === 'pending').length
        });

        // Fetch project stats
        const projects = await getAllProjects();
        setProjectStats({
          total: projects.length,
          published: projects.filter(p => p.status === 'published').length,
          draft: projects.filter(p => p.status === 'draft').length,
          featured: projects.filter(p => p.top).length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const feedbackStatCards = [
    { label: 'Total Feedbacks', value: feedbackStats.total, icon: MessageSquare, color: 'blue' },
    { label: 'Approved', value: feedbackStats.approved, icon: CheckCircle, color: 'green' },
    { label: 'Pending Review', value: feedbackStats.pending, icon: Clock, color: 'yellow' }
  ];

  const projectStatCards = [
    { label: 'Total Projects', value: projectStats.total, icon: FolderKanban, color: 'purple' },
    { label: 'Published', value: projectStats.published, icon: Eye, color: 'green' },
    { label: 'Drafts', value: projectStats.draft, icon: FileText, color: 'yellow' },
    { label: 'Featured', value: projectStats.featured, icon: CheckCircle, color: 'blue' }
  ];

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600'
  };

  return (
    <AdminLayout>
      <SEO title="Admin Dashboard" noindex />
      
      <div className="mb-8">
        <h1 className="heading-lg mb-2">Dashboard</h1>
        <p className="body-md text-muted">Overview of your portfolio management</p>
      </div>

      {/* Projects Section */}
      <div className="mb-8">
        <h2 className="heading-md mb-4">Projects</h2>
        {loading ? (
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="soft-card">
                <div className="h-24 animate-pulse bg-primary/5 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            {projectStatCards.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="soft-card"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-primary">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                    <stat.icon size={24} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        <div className="grid md:grid-cols-2 gap-4">
          <Link to="/admin/projects">
            <Button variant="primary" className="w-full justify-center">
              <FolderKanban size={18} className="mr-2" />
              Manage Projects
            </Button>
          </Link>
          <Link to="/admin/projects/add">
            <Button variant="secondary" className="w-full justify-center">
              <FileText size={18} className="mr-2" />
              Add New Project
            </Button>
          </Link>
        </div>
      </div>

      {/* Feedbacks Section */}
      <div>
        <h2 className="heading-md mb-4">Feedbacks</h2>
        {loading ? (
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="soft-card">
                <div className="h-24 animate-pulse bg-primary/5 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            {feedbackStatCards.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="soft-card"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-primary">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                    <stat.icon size={24} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        <div className="grid md:grid-cols-2 gap-4">
          <Link to="/admin/feedbacks">
            <Button variant="primary" className="w-full justify-center">
              <MessageSquare size={18} className="mr-2" />
              Manage Feedbacks
            </Button>
          </Link>
          <Link to="/admin/add">
            <Button variant="secondary" className="w-full justify-center">
              <Plus size={18} className="mr-2" />
              Add New Feedback
            </Button>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
