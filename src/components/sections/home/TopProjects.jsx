import { ProjectGrid } from '../../home';
import DesigningSuccess from './DesigningSuccess';

const TopProjects = ({ projects }) => {
  const topProjects = projects.filter((project) => project.top === true);

  return (
    <div className="flex flex-col gap-16">
      <ProjectGrid projects={topProjects} />
      <DesigningSuccess />
    </div>
  );
};

export default TopProjects;
