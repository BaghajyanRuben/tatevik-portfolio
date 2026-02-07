import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useScrollAnimation, scrollVariants } from '../../../hooks/useScrollAnimation';

const ProjectGallerySection = ({ gallery, projectTitle }) => {
  const { ref, isInView } = useScrollAnimation();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!gallery || !gallery.images || gallery.images.length === 0) return null;

  const { images } = gallery;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection) => {
    const newIndex = currentIndex + newDirection;
    if (newDirection === 1) {
      setCurrentIndex(newIndex >= images.length ? 0 : newIndex);
    } else {
      setCurrentIndex(newIndex < 0 ? images.length - 1 : newIndex);
    }
    setPage([page + newDirection, newDirection]);
  };

  return (
    <section className="section py-0">
      <div className="container">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={scrollVariants}
          className="relative"
        >
          {/* Slider Container */}
          <div className="relative w-full overflow-hidden rounded-2xl bg-gray-50">
            <div className="relative aspect-[16/10] md:aspect-[16/9]">
              <AnimatePresence initial={false} custom={direction}>
                <motion.img
                  key={currentIndex}
                  src={images[currentIndex]}
                  alt={`${projectTitle} design ${currentIndex + 1}`}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading={currentIndex === 0 ? 'eager' : 'lazy'}
                />
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              {/* Left Arrow */}
              <button
                onClick={() => paginate(-1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all duration-200 hover:bg-white hover:scale-105"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>

              {/* Right Arrow */}
              <button
                onClick={() => paginate(1)}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all duration-200 hover:bg-white hover:scale-105"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {images.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setPage([index, index > currentIndex ? 1 : -1]);
                    setCurrentIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentIndex
                      ? 'bg-primary w-6'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectGallerySection;
