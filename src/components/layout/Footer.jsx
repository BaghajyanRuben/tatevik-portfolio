import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="py-12 mt-auto border-t border-primary/10"
    >
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted">
            {currentYear} Portfolio. All rights reserved.
          </p>
          <p className="text-sm text-muted">
            Designed & Built with care
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
