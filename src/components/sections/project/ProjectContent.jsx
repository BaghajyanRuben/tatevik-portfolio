import { ContentBlock } from '../../project';

const ProjectContent = ({ sections, projectTitle }) => {
  return (
    <section className="section">
      <div className="container space-y-16">
        {sections.map((section, index) => (
          <ContentBlock key={index} section={section} projectTitle={projectTitle} />
        ))}
      </div>
    </section>
  );
};

export default ProjectContent;
