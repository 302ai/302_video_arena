import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { IconButton } from "@/components/ui/icon-button";

interface ZoomableImageProps {
  src?: string;
  base64?: string;
  alt: string;
  className?: string;
}

export const ZoomableImage = ({
  src,
  base64,
  alt,
  className = "",
}: ZoomableImageProps) => {
  const [scale, setScale] = useState(1);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [showDropdown, setShowDropdown] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = imageRef.current;
    if (!element) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const newScale = scale + (e.deltaY > 0 ? -0.1 : 0.1);
      setScale(Math.min(Math.max(0.5, newScale), 3));
    };

    element.addEventListener("wheel", handleWheel, { passive: false });
    return () => element.removeEventListener("wheel", handleWheel);
  }, [scale]);

  const handleDoubleClick = () => {
    setScale(1);
    setDragPosition({ x: 0, y: 0 });
  };

  return (
    <div className="relative flex min-h-[50vh] items-center justify-center">
      <div className="absolute left-1/2 top-4 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/50 p-1.5 backdrop-blur-sm">
        <IconButton
          onClick={() => setScale(Math.max(0.5, scale - 0.1))}
          variant="transparent"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </IconButton>
        <div className="relative">
          <button
            className="select-none rounded-md px-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
            onClick={() => setScale(1)}
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            {Math.round(scale * 100)}%
          </button>
          <div
            className={`absolute left-1/2 top-full mt-2 -translate-x-1/2 rounded-lg bg-black/50 py-1 shadow-lg backdrop-blur-sm transition-all duration-200 ${
              showDropdown ? "visible opacity-100" : "invisible opacity-0"
            }`}
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            {[25, 50, 75, 100, 150, 200].map((percentage) => (
              <button
                key={percentage}
                className={`block w-full whitespace-nowrap px-4 py-1 text-left text-sm text-white transition-colors hover:bg-white/10 ${Math.round(scale * 100) === percentage ? "bg-white/10" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setScale(percentage / 100);
                  setShowDropdown(false);
                }}
              >
                {percentage}%
              </button>
            ))}
          </div>
        </div>
        <IconButton
          onClick={() => setScale(Math.min(3, scale + 0.1))}
          variant="transparent"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </IconButton>
        <IconButton
          onClick={() => {
            setScale(1);
            setDragPosition({ x: 0, y: 0 });
          }}
          variant="transparent"
          title="Reset Zoom"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
            <path d="M21 3v5h-5"></path>
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
            <path d="M8 16H3v5"></path>
          </svg>
        </IconButton>
      </div>

      <motion.div
        className="relative cursor-move select-none"
        drag
        dragConstraints={{
          left: -1000,
          right: 1000,
          top: -1000,
          bottom: 1000,
        }}
        dragElastic={0.1}
        dragMomentum={false}
        animate={{
          scale: scale,
          x: dragPosition.x,
          y: dragPosition.y,
        }}
        onDragEnd={(_, info) => {
          setDragPosition({
            x: dragPosition.x + info.offset.x,
            y: dragPosition.y + info.offset.y,
          });
        }}
        style={{
          touchAction: "none",
          WebkitUserSelect: "none",
          userSelect: "none",
        }}
        onDoubleClick={handleDoubleClick}
      >
        <div ref={imageRef} style={{ touchAction: "none" }}>
          <img
            src={base64 || src || "/placeholder.svg"}
            alt={alt}
            className={`h-auto max-h-[70vh] w-auto max-w-full object-contain ${className}`}
            draggable="false"
            onDragStart={(e) => e.preventDefault()}
          />
        </div>
      </motion.div>
    </div>
  );
};
