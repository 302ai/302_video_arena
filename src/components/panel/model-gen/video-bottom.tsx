import { VideoGallery } from "../../../components/ui/gallery/video-gallery";
import { getVideoModelById } from "@/constants/video-models";
import { useVideoHistory } from "@/hooks/db/use-video-history";
import { useMonitorMessage } from "@/hooks/global/use-monitor-message";
import { useTranslations } from "next-intl";
import { MediaItemType } from "../../../components/ui/gallery/gallery";
import { useCallback, useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";
export interface VideoItem {
  id: string;
  title: string;
  desc: string;
  url: string;
  tag: string;
  historyId: string;
  status: "pending" | "processing" | "success" | "failed";
  taskId: string;
  inputType: "text" | "image" | "video";
  imageUrl?: string;
}

export function VideoGenBottom() {
  const t = useTranslations("modelGen");
  const tCommon = useTranslations("common");
  const [page, setPage] = useState(1);
  const [videoItems, setVideoItems] = useState<VideoItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 5;
  const { videoHistory, history, deleteHistory } = useVideoHistory(
    page,
    pageSize,
    "gen"
  );
  const { handleDownload } = useMonitorMessage();

  useEffect(() => {
    if (!videoHistory) return;

    const processedItems = videoHistory.flatMap((history) =>
      history.videos.map((video, index) => ({
        id: `${history.id}-${index}`,
        title: t("gallery.promptTitle"),
        desc: history.rawPrompt,
        url: video.url,
        tag: getVideoModelById(video.model)?.alias || "",
        historyId: history.id,
        status: video.status,
        taskId: history.taskId,
        inputType: history.inputType,
        imageUrl: history.inputUrl,
      }))
    );

    setVideoItems(processedItems);
    setIsLoading(false);
  }, [videoHistory, page, t]);

  const handleDelete = useCallback(
    (item: MediaItemType) => {
      if (item.historyId) {
        deleteHistory(item.historyId);

        setVideoItems((prev) =>
          prev.filter((videoItem) => videoItem.historyId !== item.historyId)
        );
      }
    },
    [deleteHistory]
  );

  const handleDownloadVideo = useCallback(
    (item: MediaItemType) => {
      if (item.url) {
        const filename =
          item.url.split("/").pop() ||
          `${item.desc?.slice(0, 10) || "video"}.mp4`;
        const toastId = toast.loading(tCommon("downloading.start"));

        handleDownload(item.url, filename, (info) => {
          const speedKB = info.speed / 1024;
          const speedText =
            speedKB > 1024
              ? `${(speedKB / 1024).toFixed(1)} MB/s`
              : `${speedKB.toFixed(1)} KB/s`;

          const remainingMinutes = Math.floor(info.remainingTime / 60);
          const remainingSeconds = Math.floor(info.remainingTime % 60);
          const remainingText =
            remainingMinutes > 0
              ? `${remainingMinutes}m ${remainingSeconds}s`
              : `${remainingSeconds}s`;

          toast.loading(
            `${tCommon("downloading.progress")}: ${info.progress.toFixed(1)}%\n` +
              `${tCommon("downloading.speed")}: ${speedText}\n` +
              `${tCommon("downloading.remaining")}: ${remainingText}`,
            { id: toastId }
          );
        }).then((result) => {
          if (result.success) {
            toast.success(tCommon("downloading.complete"), { id: toastId });
          } else {
            toast.error(tCommon("downloading.error", { error: result.error }), {
              id: toastId,
            });
          }
        });
      }
    },
    [handleDownload]
  );

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || (history && newPage > history.totalPages)) return;
    setIsLoading(true);
    setPage(newPage);
  };

  const renderPaginationItems = () => {
    if (!history || !history.totalPages) return null;

    const totalPages = history.totalPages;
    const items = [];

    const pagesToShow = new Set([
      1,
      totalPages,
      page,
      Math.min(page + 1, totalPages),
      Math.max(page - 1, 1),
    ]);

    for (let i = 1; i <= totalPages; i++) {
      if (pagesToShow.has(i)) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(i);
              }}
              isActive={page === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      } else if (
        (i === 2 && page > 3) ||
        (i === totalPages - 1 && page < totalPages - 2)
      ) {
        items.push(
          <PaginationItem key={`ellipsis-${i}`}>
            <span className="flex h-9 w-9 items-center justify-center">
              ...
            </span>
          </PaginationItem>
        );

        if (i === 2) i = page - 2;
        if (i === totalPages - 1) i = totalPages - 1;
      }
    }

    return items;
  };

  return (
    <div className="rounded-lg border">
      <VideoGallery
        videoItems={videoItems}
        title={t("gallery.videoTitle") || "Video Gallery"}
        description={t("gallery.videoDescription") || "Your generated videos"}
        emptyStateMessage={
          t("gallery.emptyVideoMessage") || "No videos generated yet"
        }
        insertAtStart
        onDelete={handleDelete}
        onDownload={handleDownloadVideo}
      />

      {/* Pagination controls */}
      {history && history.totalPages > 1 && (
        <div className="py-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page - 1);
                  }}
                  aria-disabled={page <= 1}
                  className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                >
                  {tCommon("pagination.previous")}
                </PaginationPrevious>
              </PaginationItem>

              {renderPaginationItems()}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page + 1);
                  }}
                  aria-disabled={history && page >= history.totalPages}
                  className={
                    history && page >= history.totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                >
                  {tCommon("pagination.next")}
                </PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="my-4 flex h-10 w-full items-center justify-center">
          <div className="animate-pulse text-muted-foreground">
            {t("gallery.loading") || "Loading..."}
          </div>
        </div>
      )}
    </div>
  );
}
