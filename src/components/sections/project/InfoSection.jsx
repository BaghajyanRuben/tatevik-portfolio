import { motion } from 'framer-motion';
import { useScrollAnimation, scrollVariants } from '../../../hooks/useScrollAnimation';

// Single Text Section Item Component (renders topText, bulletPoints, bottomText)
const TextSectionItem = ({ section, isInView, delay = 0 }) => {
  if (!section) return null;

  const hasContent = section.topText || 
    (section.bulletPoints && section.bulletPoints.length > 0) || section.bottomText;
  
  if (!hasContent) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
      className="space-y-2"
    >
      {/* Top Text */}
      {section.topText && (
        <p className="body-md text-muted leading-snug">{section.topText}</p>
      )}

      {/* Bullet Points */}
      {section.bulletPoints && section.bulletPoints.length > 0 && (
        <ul className="space-y-1 ml-1">
          {section.bulletPoints.map((point, pointIndex) => (
            <motion.li
              key={pointIndex}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ duration: 0.3, delay: delay + 0.1 + pointIndex * 0.05 }}
              className="flex items-start gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="body-md text-muted leading-snug">{point}</span>
            </motion.li>
          ))}
        </ul>
      )}

      {/* Bottom Text */}
      {section.bottomText && (
        <p className="body-md text-foreground leading-snug">{section.bottomText}</p>
      )}
    </motion.div>
  );
};

// Left Text Section Component
const TextSectionLeft = ({ title, sections, isInView }) => {
  const hasContent = title || (sections && Array.isArray(sections) && sections.length > 0);
  if (!hasContent) return null;

  return (
    <div className="space-y-6">
      {/* Section Title */}
      {title && (
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="heading-md text-[#ababab]"
        >
          {title}
        </motion.h3>
      )}

      {/* Section Items */}
      {sections && sections.map((section, index) => (
        <TextSectionItem 
          key={index} 
          section={section} 
          isInView={isInView} 
          delay={0.15 + index * 0.1} 
        />
      ))}
    </div>
  );
};

// Right Text Section Component
const TextSectionRight = ({ title, sections, isInView }) => {
  const hasContent = title || (sections && Array.isArray(sections) && sections.length > 0);
  if (!hasContent) return null;

  return (
    <div className="space-y-6">
      {/* Section Title */}
      {title && (
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="heading-md text-[#ababab]"
        >
          {title}
        </motion.h3>
      )}

      {/* Section Items */}
      {sections && sections.map((section, index) => (
        <TextSectionItem 
          key={index} 
          section={section} 
          isInView={isInView} 
          delay={0.15 + index * 0.1} 
        />
      ))}
    </div>
  );
};

const InfoSection = ({ info, projectTitle }) => {
  const { ref, isInView } = useScrollAnimation();

  if (!info) return null;

  const { 
    title, 
    titleTextSectionLeft, 
    titleTextSectionRight, 
    textSectionLeft, 
    textSectionRight, 
    topImage, 
    bottomImage, 
    splitView 
  } = info;

  // Check if text sections have content
  const hasLeftSection = titleTextSectionLeft || (textSectionLeft && Array.isArray(textSectionLeft) && textSectionLeft.length > 0);
  const hasRightSection = titleTextSectionRight || (textSectionRight && Array.isArray(textSectionRight) && textSectionRight.length > 0);
  const hasTextSections = hasLeftSection || hasRightSection;

  // Check if there's any content to render
  const hasContent = title || hasTextSections || topImage || bottomImage;
  if (!hasContent) return null;

  // Split View Layout (images on sides, text in middle on desktop)
  if (splitView) {
    return (
      <section className="section pt-8 pb-0">
        <div className="container">
          <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={scrollVariants}
          >
            {/* Main Title - Always at the top */}
            {title && (
              <h2 className="heading-md mb-8">{title}</h2>
            )}

            {/* Split View Content */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:gap-8">
              {/* Left Image (topImage) */}
              {topImage && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="mb-6 lg:mb-0 lg:flex-1 rounded-2xl overflow-hidden"
                >
                  <img
                    src={topImage}
                    alt={`${projectTitle} - ${title || 'Section'} left`}
                    width={400}
                    height={500}
                    loading="lazy"
                    className="w-full h-auto object-cover"
                  />
                </motion.div>
              )}

              {/* Center: Text Sections - Horizontal on desktop if both exist, vertical on mobile */}
              {hasTextSections && (
                <div className={`mb-6 lg:mb-0 lg:flex-1 grid grid-cols-1 ${hasLeftSection && hasRightSection ? 'md:grid-cols-2' : ''} gap-8`}>
                  {hasLeftSection && (
                    <TextSectionLeft 
                      title={titleTextSectionLeft} 
                      sections={textSectionLeft} 
                      isInView={isInView} 
                    />
                  )}
                  {hasRightSection && (
                    <TextSectionRight 
                      title={titleTextSectionRight} 
                      sections={textSectionRight} 
                      isInView={isInView} 
                    />
                  )}
                </div>
              )}

              {/* Right Image (bottomImage) */}
              {bottomImage && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="lg:flex-1 rounded-2xl overflow-hidden"
                >
                  <img
                    src={bottomImage}
                    alt={`${projectTitle} - ${title || 'Section'} right`}
                    width={400}
                    height={500}
                    loading="lazy"
                    className="w-full h-auto object-cover"
                  />
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  // Default Layout
  return (
    <section className="section pt-8 pb-0">
      <div className="container">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={scrollVariants}
        >
          {/* Main Title - Always at the top */}
          {title && (
            <h2 className="heading-md mb-8">{title}</h2>
          )}

          {/* Top Image */}
          {topImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`rounded-2xl overflow-hidden ${hasTextSections ? 'mb-8' : ''}`}
            >
              <img
                src={topImage}
                alt={`${projectTitle} - ${title || 'Section'} top`}
                width={800}
                height={500}
                loading="lazy"
                className="w-full h-auto object-cover"
              />
            </motion.div>
          )}

          {/* Text Sections - Horizontal on desktop if both exist, vertical on mobile */}
          {hasTextSections && (
            <div className={`grid grid-cols-1 ${hasLeftSection && hasRightSection ? 'md:grid-cols-2' : ''} gap-8 lg:gap-12`}>
              {hasLeftSection && (
                <TextSectionLeft 
                  title={titleTextSectionLeft} 
                  sections={textSectionLeft} 
                  isInView={isInView} 
                />
              )}
              {hasRightSection && (
                <TextSectionRight 
                  title={titleTextSectionRight} 
                  sections={textSectionRight} 
                  isInView={isInView} 
                />
              )}
            </div>
          )}

          {/* Bottom Image */}
          {bottomImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`rounded-2xl overflow-hidden ${hasTextSections || topImage ? 'mt-10' : ''}`}
            >
              <img
                src={bottomImage}
                alt={`${projectTitle} - ${title || 'Section'} bottom`}
                width={800}
                height={500}
                loading="lazy"
                className="w-full h-auto object-cover"
              />
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default InfoSection;
