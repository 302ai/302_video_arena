import { useState } from "react";
import { motion } from "framer-motion";

interface ImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src?: string;
  base64?: string;
  alt: string;
  className?: string;
  aspectRatio?: number;
}

export const Image = ({
  src,
  base64,
  alt,
  className = "",
  aspectRatio,
  ...props
}: ImageProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const imageSrc = base64 || src || "/placeholder.svg";

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
      )}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <img
          src={imageSrc}
          alt={alt}
          className={`transition-opacity duration-300 ${className}`}
          style={aspectRatio ? { aspectRatio } : undefined}
          loading="lazy"
          decoding="async"
          fetchPriority="high"
          draggable="false"
          onLoad={() => setIsLoading(false)}
          onDragStart={handleDragStart}
          {...props}
        />
      </motion.div>
    </div>
  );
};
