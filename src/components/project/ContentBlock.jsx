import { motion } from 'framer-motion';
import { FigmaEmbed } from '../ui';
import { useScrollAnimation, scrollVariants } from '../../hooks/useScrollAnimation';

const TextBlock = ({ title, content }) => {
  const { ref, isInView } = useScrollAnimation();

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={scrollVariants}
      className="max-w-3xl"
    >
      {title && <h2 className="heading-md mb-4">{title}</h2>}
      <p className="body-md whitespace-pre-line">{content}</p>
    </motion.div>
  );
};

const ImageBlock = ({ src, caption, projectTitle }) => {
  const { ref, isInView } = useScrollAnimation();
  const altText = caption || (projectTitle ? `${projectTitle} design detail` : '');

  return (
    <motion.figure
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={scrollVariants}
      className="rounded-2xl overflow-hidden"
    >
      <img
        src={src}
        alt={altText}
        className="w-full h-auto"
      />
      {caption && (
        <figcaption className="text-sm text-muted mt-4 text-center">
          {caption}
        </figcaption>
      )}
    </motion.figure>
  );
};

const GalleryBlock = ({ images, projectTitle }) => {
  const { ref, isInView } = useScrollAnimation();

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={scrollVariants}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {images.map((image, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="rounded-xl overflow-hidden bg-gray-100"
        >
          <img
            src={image}
            alt={projectTitle ? `${projectTitle} gallery image ${index + 1}` : `Project gallery image ${index + 1}`}
            className="w-full h-full object-cover aspect-square"
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

const FigmaBlock = ({ url, title }) => {
  const { ref, isInView } = useScrollAnimation();

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={scrollVariants}
    >
      <FigmaEmbed url={url} title={title} />
    </motion.div>
  );
};

const ContentBlock = ({ section, projectTitle }) => {
  const { type } = section;

  switch (type) {
    case 'text':
      return <TextBlock title={section.title} content={section.content} />;
    case 'image':
      return (
        <ImageBlock
          src={section.src}
          caption={section.caption}
          projectTitle={projectTitle}
        />
      );
    case 'gallery':
      return <GalleryBlock images={section.images} projectTitle={projectTitle} />;
    case 'figma':
      return <FigmaBlock url={section.url} title={section.title} />;
    default:
      return null;
  }
};

export default ContentBlock;
