"use client";

import { useState, useEffect, useRef } from "react";
import { VideoGalleryProps, MediaItemType } from "./gallery";
import { VideoItem } from "./video-item";
import { Typewriter } from "@/components/ui/typewriter-text";
import { IconButton } from "@/components/ui/icon-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export const VideoGallery = ({
  videoItems,
  title,
  description,
  insertAtStart = false,
  emptyStateMessage = "No videos to display",
  onDelete,
  onDownload,
}: VideoGalleryProps) => {
  const [columns, setColumns] = useState<MediaItemType[][]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [videoHeights, setVideoHeights] = useState<{ [key: string]: number }>(
    {}
  );
  const [loadedVideos, setLoadedVideos] = useState<Set<string>>(new Set());
  const [fullscreenVideo, setFullscreenVideo] = useState<MediaItemType | null>(
    null
  );
  const [detailsVideo, setDetailsVideo] = useState<MediaItemType | null>(null);

  // Set a default height for videos
  useEffect(() => {
    const defaultHeight = 200; // Default height for video thumbnails

    const newVideoHeights: { [key: string]: number } = {};
    videoItems.forEach((item) => {
      if (!videoHeights[item.id]) {
        newVideoHeights[item.id] = defaultHeight;
      }
    });

    if (Object.keys(newVideoHeights).length > 0) {
      setVideoHeights((prev) => ({ ...prev, ...newVideoHeights }));
      setLoadedVideos((prev) => {
        const newSet = new Set(prev);
        Object.keys(newVideoHeights).forEach((id) => newSet.add(id));
        return newSet;
      });
    }
  }, [videoItems, videoHeights]);

  useEffect(() => {
    const updateColumns = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const minColumnWidth = 300; // Minimum column width for videos
      const gap = 16; // Gap between columns

      // Calculate optimal number of columns
      let numColumns = Math.floor(
        (containerWidth + gap) / (minColumnWidth + gap)
      );
      numColumns = Math.max(1, Math.min(3, numColumns)); // Limit to max 3 columns for videos

      // Calculate actual column width
      const columnWidth = Math.floor(
        (containerWidth - (numColumns - 1) * gap) / numColumns
      );

      const newColumns: MediaItemType[][] = Array.from(
        { length: numColumns },
        () => []
      );
      const columnHeights = new Array(numColumns).fill(0);

      const processedItems = videoItems.filter((item) =>
        loadedVideos.has(item.id)
      );

      if (insertAtStart && processedItems.length > 0) {
        newColumns[0].push(processedItems[0]);
        columnHeights[0] += videoHeights[processedItems[0].id] || columnWidth;
      }

      const remainingItems = insertAtStart
        ? processedItems.slice(1)
        : processedItems;
      remainingItems.forEach((item) => {
        const shortestColumnIndex = columnHeights.indexOf(
          Math.min(...columnHeights)
        );
        newColumns[shortestColumnIndex].push(item);
        columnHeights[shortestColumnIndex] +=
          videoHeights[item.id] || columnWidth;
      });

      setColumns(newColumns);
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);

    return () => {
      window.removeEventListener("resize", updateColumns);
    };
  }, [videoItems, videoHeights, insertAtStart, loadedVideos]);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8" ref={containerRef}>
      <div className="mb-8 text-center">
        <div className="space-y-2">
          <Typewriter
            text={[title, description]}
            speed={80}
            loop={true}
            delay={2000}
            className=""
          />
        </div>
      </div>

      {/* Full-screen video preview */}
      {fullscreenVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <div className="relative h-full w-full">
            <div className="absolute right-4 top-4 z-10 flex gap-2">
              {fullscreenVideo.status === "success" && (
                <IconButton
                  onClick={() => onDownload?.(fullscreenVideo)}
                  title="Download"
                  className="h-10 w-10"
                  variant="transparent"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
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
              )}
              <IconButton
                onClick={() => setFullscreenVideo(null)}
                title="Close"
                className="h-10 w-10"
                variant="transparent"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </IconButton>
            </div>
            <div className="flex h-full items-center justify-center">
              {fullscreenVideo.status === "success" && fullscreenVideo.url ? (
                <video
                  src={fullscreenVideo.url}
                  controls
                  autoPlay
                  className="max-h-full max-w-full"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <div className="text-center text-white">
                  <p>Video not available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Details Dialog */}
      <Dialog
        open={!!detailsVideo}
        onOpenChange={(open) => !open && setDetailsVideo(null)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {detailsVideo?.title || "Video Details"}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            {detailsVideo?.status === "success" && detailsVideo?.url && (
              <div className="relative overflow-hidden rounded-lg">
                <video
                  src={detailsVideo.url}
                  controls
                  className="h-auto w-full"
                  poster={
                    detailsVideo.inputType === "image"
                      ? detailsVideo.imageUrl
                      : undefined
                  }
                />
              </div>
            )}

            <div className="space-y-2">
              {detailsVideo?.tag && (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    标签:
                  </span>
                  <span>{detailsVideo.tag}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  状态:
                </span>
                <span
                  className={`${
                    detailsVideo?.status === "success"
                      ? "text-green-500"
                      : detailsVideo?.status === "failed"
                        ? "text-red-500"
                        : detailsVideo?.status === "processing"
                          ? "text-yellow-500"
                          : "text-blue-500"
                  }`}
                >
                  {detailsVideo?.status === "success"
                    ? "已完成"
                    : detailsVideo?.status === "failed"
                      ? "失败"
                      : detailsVideo?.status === "processing"
                        ? "处理中"
                        : "等待中"}
                </span>
              </div>

              {detailsVideo?.desc && (
                <div className="mt-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    描述:
                  </span>
                  <p className="mt-1 whitespace-pre-line text-gray-600 dark:text-gray-400">
                    {detailsVideo.desc}
                  </p>
                </div>
              )}

              {detailsVideo?.createdAt && (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    创建时间:
                  </span>
                  <span>
                    {new Date(detailsVideo.createdAt).toLocaleString()}
                  </span>
                </div>
              )}

              {detailsVideo?.updatedAt && (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    更新时间:
                  </span>
                  <span>
                    {new Date(detailsVideo.updatedAt).toLocaleString()}
                  </span>
                </div>
              )}

              {detailsVideo?.model && (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    模型:
                  </span>
                  <span>{detailsVideo.model}</span>
                </div>
              )}

              {detailsVideo?.taskId && (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    任务ID:
                  </span>
                  <span className="font-mono text-xs">
                    {detailsVideo.taskId}
                  </span>
                </div>
              )}

              {detailsVideo?.prompt && (
                <div className="mt-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    提示词:
                  </span>
                  <div className="mt-1 max-h-32 overflow-auto rounded-md bg-gray-100 p-3 text-sm dark:bg-gray-800">
                    <pre className="whitespace-pre-wrap font-mono text-xs">
                      {detailsVideo.prompt}
                    </pre>
                  </div>
                </div>
              )}

              {(detailsVideo?.status === "processing" ||
                detailsVideo?.status === "pending") && (
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">生成进度</span>
                    <span className="text-sm font-medium">
                      {detailsVideo.status === "processing"
                        ? "处理中..."
                        : "等待中..."}
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className={`h-2 rounded-full ${
                        detailsVideo.status === "processing"
                          ? "animate-pulse bg-yellow-500"
                          : "bg-blue-500"
                      }`}
                      style={{
                        width:
                          detailsVideo.status === "processing" ? "60%" : "10%",
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="mt-6 flex gap-2">
            {detailsVideo?.status === "success" && (
              <Button
                onClick={() => detailsVideo && onDownload?.(detailsVideo)}
                variant="outline"
              >
                下载
              </Button>
            )}
            <Button
              onClick={() => detailsVideo && onDelete?.(detailsVideo)}
              variant="destructive"
            >
              删除
            </Button>
            <Button onClick={() => setDetailsVideo(null)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-wrap gap-4">
        {videoItems.length === 0 ? (
          <div className="flex w-full items-center justify-center py-16">
            <div className="text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                {emptyStateMessage}
              </h3>
            </div>
          </div>
        ) : (
          columns.map((column, columnIndex) => (
            <div
              key={columnIndex}
              className="flex min-w-[300px] flex-1 flex-col gap-4"
            >
              {column.map((item) => (
                <div key={item.id} className="mb-4">
                  <VideoItem
                    item={item}
                    className="h-auto w-full"
                    onClick={() => setFullscreenVideo(item)}
                    onDelete={onDelete}
                    onDownload={onDownload}
                    onShowDetails={(item) => setDetailsVideo(item)}
                    showActions={true}
                    showTag={true}
                    showStatus={true}
                  />
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VideoGallery;
