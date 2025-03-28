import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GalleryModalProps } from "@/components/ui/gallery/gallery";
import { Modal } from "@/components/ui/modal";
import { ZoomableImage } from "@/components/ui/gallery/zoomable-image";
import { IconButton } from "@/components/ui/icon-button";
import { Tag } from "@/components/ui/tag";
import { createPortal } from "react-dom";

export const GalleryModal = ({
  selectedItem,
  isOpen,
  onClose,
  setSelectedItem,
  mediaItems,
  onDelete,
  onDownload,
  showDelete = true,
}: GalleryModalProps) => {
  const [dockPosition, setDockPosition] = useState({ x: 0, y: 0 });
  const VISIBLE_COUNT = 5;
  const MIDDLE_INDEX = Math.floor(VISIBLE_COUNT / 2);

  // 计算可见范围，使选中项尽可能在中间
  const calculateVisibleRange = (selectedIndex: number) => {
    let start = selectedIndex - MIDDLE_INDEX;
    let end = start + VISIBLE_COUNT;

    // 处理边界情况
    if (start < 0) {
      start = 0;
      end = Math.min(VISIBLE_COUNT, mediaItems.length);
    } else if (end > mediaItems.length) {
      end = mediaItems.length;
      start = Math.max(0, end - VISIBLE_COUNT);
    }

    return { start, end };
  };

  const [visibleRange, setVisibleRange] = useState(() => {
    const selectedIndex = mediaItems.findIndex(
      (item) => item.id === selectedItem.id
    );
    return calculateVisibleRange(selectedIndex);
  });

  useEffect(() => {
    const selectedIndex = mediaItems.findIndex(
      (item) => item.id === selectedItem.id
    );
    setVisibleRange(calculateVisibleRange(selectedIndex));
  }, [selectedItem.id, mediaItems]);

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    const selectedIndex = mediaItems.findIndex(
      (item) => item.id === selectedItem.id
    );
    const prevIndex = Math.max(0, selectedIndex - 1);
    setSelectedItem(mediaItems[prevIndex]);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const selectedIndex = mediaItems.findIndex(
      (item) => item.id === selectedItem.id
    );
    const nextIndex = Math.min(mediaItems.length - 1, selectedIndex + 1);
    setSelectedItem(mediaItems[nextIndex]);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(selectedItem);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownload?.(selectedItem);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        className="group w-full max-w-4xl"
      >
        {/* Tag */}
        {selectedItem.tag && (
          <div className="absolute left-4 top-4 z-[60]">
            <Tag>{selectedItem.tag}</Tag>
          </div>
        )}

        {/* Actions */}
        <div className="absolute bottom-4 right-4 z-[60] flex gap-2">
          <IconButton onClick={handleDownload} title="Download">
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
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </IconButton>
          {showDelete && (
            <IconButton onClick={handleDelete} title="Delete">
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
                <path d="M3 6h18" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </IconButton>
          )}
        </div>

        <ZoomableImage
          src={selectedItem.url}
          base64={selectedItem.base64}
          alt={selectedItem.title}
        />

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <h3 className="text-xl font-semibold text-white">
            {selectedItem.title}
          </h3>
          <p className="mt-1 text-sm text-white/80">{selectedItem.desc}</p>
        </div>
      </Modal>

      {isOpen &&
        createPortal(
          <AnimatePresence>
            <motion.div
              drag
              dragMomentum={false}
              dragElastic={0.1}
              initial={{ x: "-50%", y: 20, opacity: 0 }}
              animate={{ x: "-50%", y: 0, opacity: 1 }}
              exit={{ x: "-50%", y: 20, opacity: 0 }}
              style={{
                position: "fixed",
                left: "50%",
                bottom: "24px",
                zIndex: 110,
                touchAction: "none",
                transform: `translate(-50%, 0) translate(${dockPosition.x}px, ${dockPosition.y}px)`,
              }}
              onDragEnd={(_, info) => {
                setDockPosition((prev) => ({
                  x: prev.x + info.offset.x,
                  y: prev.y + info.offset.y,
                }));
              }}
            >
              <motion.div className="relative cursor-grab rounded-full border border-white/20 bg-white/10 p-2 shadow-lg backdrop-blur-xl active:cursor-grabbing">
                <div className="flex items-center space-x-2">
                  {visibleRange.start > 0 && (
                    <IconButton onClick={handlePrevious} variant="white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </IconButton>
                  )}
                  {mediaItems
                    .slice(visibleRange.start, visibleRange.end)
                    .map((item) => (
                      <motion.div
                        key={item.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedItem(item);
                        }}
                        className={`group relative h-10 w-10 cursor-pointer overflow-hidden rounded-full transition-all duration-300 hover:z-10 ${selectedItem.id === item.id ? "scale-110 shadow-lg ring-2 ring-white" : "hover:ring-2 hover:ring-white/50"} `}
                        initial={false}
                        animate={{
                          scale: selectedItem.id === item.id ? 1.1 : 1,
                        }}
                        whileHover={{ scale: 1.1 }}
                      >
                        <img
                          src={item.base64 || item.url || "/placeholder.svg"}
                          alt={item.title}
                          className="h-full w-full object-cover"
                          draggable="false"
                          onDragStart={(e) => e.preventDefault()}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                      </motion.div>
                    ))}
                  {visibleRange.end < mediaItems.length && (
                    <IconButton onClick={handleNext} variant="white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </IconButton>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
    </>
  );
};
