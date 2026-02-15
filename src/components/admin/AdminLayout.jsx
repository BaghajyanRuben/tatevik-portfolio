import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, LayoutDashboard, MessageSquare, Plus, FolderKanban, FileText, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import { useState } from 'react';

const AdminLayout = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/admin/login');
    }
  };

  const navItems = [
    { 
      path: '/admin/dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      description: 'Overview & statistics'
    },
    { 
      path: '/admin/projects', 
      label: 'Manage Projects', 
      icon: FolderKanban,
      description: 'View & edit projects'
    },
    { 
      path: '/admin/projects/add', 
      label: 'Add Project', 
      icon: FileText,
      description: 'Create new project'
    },
    { 
      path: '/admin/feedbacks', 
      label: 'Manage Feedbacks', 
      icon: MessageSquare,
      description: 'View feedback messages'
    },
    { 
      path: '/admin/add', 
      label: 'Add Feedback', 
      icon: Plus,
      description: 'Create test feedback'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-primary/10 z-30 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } w-64 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-primary/10">
          <Link 
            to="/admin/dashboard" 
            className="font-bold text-xl text-primary block"
            onClick={() => setSidebarOpen(false)}
          >
            Admin Portal
          </Link>
          <p className="text-xs text-muted mt-1">Portfolio Management</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-3">
            {navItems.map(({ path, label, icon: Icon, description }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-start gap-3 px-4 py-3 rounded-lg transition-all ${
                  location.pathname === path
                    ? 'bg-primary text-white shadow-md'
                    : 'text-primary/70 hover:bg-primary/5 hover:text-primary'
                }`}
              >
                <Icon size={20} className="mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{label}</div>
                  <div className={`text-xs mt-0.5 ${
                    location.pathname === path ? 'text-white/80' : 'text-muted'
                  }`}>
                    {description}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-primary/10">
          <div className="mb-3 px-2">
            <div className="text-xs text-muted mb-1">Logged in as</div>
            <div className="text-sm font-medium text-primary truncate">
              {currentUser?.email}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-red-600 hover:bg-red-50"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header (Mobile) */}
        <header className="lg:hidden bg-white border-b border-primary/10 sticky top-0 z-10">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-primary/5 rounded-lg transition-colors"
            >
              <Menu size={24} className="text-primary" />
            </button>
            <Link to="/admin/dashboard" className="font-bold text-lg text-primary">
              Admin Portal
            </Link>
            <div className="w-10" /> {/* Spacer for center alignment */}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
