import { ContentBlock } from '../../project';

const ProjectContent = ({ sections }) => {
  return (
    <section className="section">
      <div className="container space-y-16">
        {sections.map((section, index) => (
          <ContentBlock key={index} section={section} />
        ))}
      </div>
    </section>
  );
};

export default ProjectContent;
