import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/admin/ProtectedRoute';
import { Header, Footer } from './components/layout';
import Home from './pages/Home';
import Projects from './pages/Projects';
import UIUXProjects from './pages/UIUXProjects';
import LogoProjects from './pages/LogoProjects';
import IconsProjects from './pages/IconsProjects';
import ProjectDetails from './pages/ProjectDetails';
import About from './pages/About';
import Feedback from './pages/Feedback';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageFeedback from './pages/admin/ManageFeedback';
import AddFeedback from './pages/admin/AddFeedback';
import ManageProjects from './pages/admin/ManageProjects';
import AddProject from './pages/admin/AddProject';
import EditProject from './pages/admin/EditProject';
import ReorderProjects from './pages/admin/ReorderProjects';
import NotFound from './pages/NotFound';

const AnimatedRoutes = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/ui-ux" element={<UIUXProjects />} />
        <Route path="/projects/logo" element={<LogoProjects />} />
        <Route path="/projects/icons" element={<IconsProjects />} />
        <Route path="/project/:slug" element={<ProjectDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/feedback" element={<Feedback />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/feedbacks" 
          element={
            <ProtectedRoute>
              <ManageFeedback />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/add" 
          element={
            <ProtectedRoute>
              <AddFeedback />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/projects" 
          element={
            <ProtectedRoute>
              <ManageProjects />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/projects/add" 
          element={
            <ProtectedRoute>
              <AddProject />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/projects/edit/:id" 
          element={
            <ProtectedRoute>
              <EditProject />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/projects/reorder" 
          element={
            <ProtectedRoute>
              <ReorderProjects />
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Header />}
      <AnimatedRoutes />
      {!isAdminRoute && <Footer />}
    </div>
  );
};

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
