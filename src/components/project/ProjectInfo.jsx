import { motion } from 'framer-motion';

const ProjectInfo = ({ info }) => {
  const { role, tools, type, year } = info;

  const infoItems = [
    { label: 'Role', value: role },
    { label: 'Tools', value: tools.join(', ') },
    { label: 'Type', value: type },
    { label: 'Year', value: year },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="py-12 border-y border-primary/10"
    >
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {infoItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
            >
              <p className="text-sm text-muted mb-1">{item.label}</p>
              <p className="font-medium text-primary">{item.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default ProjectInfo;
