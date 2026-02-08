import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, CheckCircle, Clock, Plus } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/ui/Button';
import { getAllFeedbacks } from '../../services/feedbackService';
import SEO from '../../components/SEO';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const feedbacks = await getAllFeedbacks();
        setStats({
          total: feedbacks.length,
          approved: feedbacks.filter(f => f.status === 'approved').length,
          pending: feedbacks.filter(f => f.status === 'pending').length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Feedbacks', value: stats.total, icon: MessageSquare, color: 'blue' },
    { label: 'Approved', value: stats.approved, icon: CheckCircle, color: 'green' },
    { label: 'Pending Review', value: stats.pending, icon: Clock, color: 'yellow' }
  ];

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600'
  };

  return (
    <AdminLayout>
      <SEO title="Admin Dashboard" noindex />
      
      <div className="mb-8">
        <h1 className="heading-lg mb-2">Dashboard</h1>
        <p className="body-md text-muted">Overview of feedback submissions</p>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="soft-card">
              <div className="h-24 animate-pulse bg-primary/5 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
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

      <div className="soft-card">
        <h2 className="heading-md mb-4">Quick Actions</h2>
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
