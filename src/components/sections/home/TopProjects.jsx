import { ProjectGrid } from '../../home';
import DesigningSuccess from './DesigningSuccess';

const TopProjects = ({ projects }) => {
  return (
    <div className="flex flex-col gap-16">
      <ProjectGrid projects={projects} />
      <DesigningSuccess />
    </div>
  );
};

export default TopProjects;
