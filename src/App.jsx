import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import { Header, Footer } from './components/layout';
import Home from './pages/Home';
import Projects from './pages/Projects';
import UIUXProjects from './pages/UIUXProjects';
import LogoProjects from './pages/LogoProjects';
import IconsProjects from './pages/IconsProjects';
import ProjectDetails from './pages/ProjectDetails';
import About from './pages/About';
import Feedback from './pages/Feedback';
import NotFound from './pages/NotFound';

const AnimatedRoutes = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/ui-ux" element={<UIUXProjects />} />
        <Route path="/projects/logo" element={<LogoProjects />} />
        <Route path="/projects/icons" element={<IconsProjects />} />
        <Route path="/project/:slug" element={<ProjectDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <AnimatedRoutes />
          <Footer />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
