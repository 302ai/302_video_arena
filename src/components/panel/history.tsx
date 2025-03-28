"use client";

import { useVideoHistory } from "@/hooks/db/use-video-history";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash2, Trophy, Download } from "lucide-react";
import { getVideoModelById } from "@/constants/video-models";
import { useState } from "react";
import { History as HistoryType } from "@/db/types";
import { useMonitorMessage } from "@/hooks/global/use-monitor-message";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface VideoPkHistory extends HistoryType {
  winner?: number;
}

export default function History() {
  const t = useTranslations("history");
  const commonT = useTranslations("common");
  const [page, setPage] = useState(1);
  const { history, deleteHistory } = useVideoHistory(page);
  const { handleDownload } = useMonitorMessage();

  if (!history) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        {t("loading")}
      </div>
    );
  }

  return (
    <div className="flex size-full flex-col gap-4">
      <div className="@container">
        <div className="rounded-lg border bg-card text-card-foreground focus-within:border-transparent focus-within:ring-1 focus-within:ring-violet-500">
          <div className="grid gap-4 p-4">
            {history.items.map((record) => {
              const item = record as VideoPkHistory;
              return (
                <div
                  key={item.id}
                  className="group relative rounded-lg border bg-background p-4"
                >
                  {/* 头部信息 */}
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {item.type === "pk" ? t("typePk") : t("typeGen")}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(item.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100"
                      onClick={() => deleteHistory(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* 提示词 */}
                  <div className="mb-4">
                    <div className="text-xs text-muted-foreground">
                      {t("prompt")}
                    </div>
                    <div className="mt-1 text-sm">{item.rawPrompt}</div>
                  </div>

                  {/* 视频展示 */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {item.videos?.map((video, index) => (
                      <div key={index} className="space-y-2">
                        <div
                          className={cn(
                            "group/video relative aspect-video w-full overflow-hidden rounded-lg border",
                            item.winner === index && "ring-2 ring-primary"
                          )}
                        >
                          {video.status === "success" && video.url ? (
                            <video
                              src={video.url}
                              controls
                              className="size-full object-contain"
                              loop
                              playsInline
                            >
                              Your browser does not support the video tag.
                            </video>
                          ) : video.status === "pending" ||
                            video.status === "processing" ? (
                            <div className="flex h-full items-center justify-center text-muted-foreground">
                              {t("processing")}
                            </div>
                          ) : (
                            <div className="flex h-full items-center justify-center text-destructive">
                              {t("failed")}
                            </div>
                          )}

                          {/* 视频数量指示器 */}
                          {index === 0 &&
                            item.videos &&
                            item.videos.length > 1 && (
                              <div className="absolute left-2 top-2 rounded-md bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm">
                                {item.videos.length} {t("videoCount")}
                              </div>
                            )}
                          {item.winner === index && (
                            <div className="absolute right-2 top-2 rounded-full bg-primary p-1 text-primary-foreground">
                              <Trophy className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                        <div
                          className={cn(
                            "text-center text-sm font-medium",
                            item.winner === index &&
                              "flex items-center justify-center gap-1 text-primary"
                          )}
                        >
                          {item.winner === index && (
                            <Trophy className="h-4 w-4" />
                          )}
                          {getVideoModelById(video.model)?.name || video.model}
                        </div>
                        {video.status === "success" && video.url && (
                          <div className="flex justify-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDownload(
                                  video.url,
                                  `${item.rawPrompt?.slice(0, 10) || "video"}.mp4`
                                )
                              }
                              className="gap-1"
                            >
                              <Download className="h-3 w-3" />
                              {t("download")}
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* PK结果 */}
                  {item.winner !== undefined && item.videos && (
                    <div className="mt-2 text-center text-sm text-muted-foreground">
                      {item.winner === -1
                        ? t("tie")
                        : t("winner", {
                            model:
                              getVideoModelById(item.videos[item.winner].model)
                                ?.name || item.videos[item.winner].model,
                          })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {history.totalPages > 1 && (
            <div className="border-t px-4 py-3 pb-20 @lg:pb-3">
              <Pagination>
                <PaginationContent className="gap-1">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className={cn(
                        page === 1 && "pointer-events-none opacity-50"
                      )}
                      aria-label={commonT("pagination.previous")}
                    >
                      <span>{commonT("pagination.previous")}</span>
                    </PaginationPrevious>
                  </PaginationItem>
                  {Array.from(
                    { length: history.totalPages },
                    (_, i) => i + 1
                  ).map((pageNumber) => {
                    if (
                      pageNumber === 1 ||
                      pageNumber === history.totalPages ||
                      (pageNumber >= page - 1 && pageNumber <= page + 1)
                    ) {
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            onClick={() => setPage(pageNumber)}
                            isActive={page === pageNumber}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }

                    if (
                      pageNumber === 2 ||
                      pageNumber === history.totalPages - 1
                    ) {
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationEllipsis>
                            <span className="sr-only">
                              {commonT("pagination.more_pages")}
                            </span>
                          </PaginationEllipsis>
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setPage((p) => Math.min(history.totalPages, p + 1))
                      }
                      className={cn(
                        page === history.totalPages &&
                          "pointer-events-none opacity-50"
                      )}
                      aria-label={commonT("pagination.next")}
                    >
                      <span>{commonT("pagination.next")}</span>
                    </PaginationNext>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
