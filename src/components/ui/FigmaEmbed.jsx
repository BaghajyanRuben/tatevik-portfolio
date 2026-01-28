import { useState } from 'react';
import { motion } from 'framer-motion';

const FigmaEmbed = ({ url, title = 'Figma Design' }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Convert Figma URL to embed URL
  const getEmbedUrl = (figmaUrl) => {
    if (!figmaUrl) return null;

    // If already an embed URL, return as is
    if (figmaUrl.includes('figma.com/embed')) {
      return figmaUrl;
    }

    // Convert file or prototype URL to embed URL
    const figmaId = figmaUrl.match(/figma\.com\/(file|proto|design)\/([a-zA-Z0-9]+)/);
    if (figmaId) {
      return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(figmaUrl)}`;
    }

    return figmaUrl;
  };

  const embedUrl = getEmbedUrl(url);

  if (!embedUrl) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="figma-embed"
    >
      {!isLoaded && (
        <div className="figma-skeleton">
          <div className="flex flex-col items-center gap-3">
            <div className="spinner" />
            <p className="text-sm text-muted">Loading Figma preview...</p>
          </div>
        </div>
      )}
      <iframe
        src={embedUrl}
        title={title}
        className="w-full aspect-video"
        allowFullScreen
        onLoad={() => setIsLoaded(true)}
        style={{ border: 'none' }}
      />
    </motion.div>
  );
};

export default FigmaEmbed;
