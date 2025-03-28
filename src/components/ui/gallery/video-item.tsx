"use client";

import { VideoItemProps } from "./gallery";
import { IconButton } from "@/components/ui/icon-button";
import { Tag } from "@/components/ui/tag";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Slider } from "@/components/ui/slider";

export const VideoItem = ({
  item,
  className = "",
  onClick,
  onDelete,
  onDownload,
  onShowDetails,
  showActions = true,
  showTag = true,
  showStatus = true,
}: VideoItemProps) => {
  const t = useTranslations("modelGen.gallery");
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Check if fullscreen is supported
  const fullScreenEnabled =
    typeof document !== "undefined" &&
    (document.fullscreenEnabled ||
      (document as any).webkitFullscreenEnabled ||
      (document as any).mozFullScreenEnabled ||
      (document as any).msFullscreenEnabled);

  // Handle video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setProgress(video.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      video.currentTime = 0;
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  // Monitor fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        !!(
          document.fullscreenElement ||
          (document as any).webkitFullscreenElement ||
          (document as any).mozFullScreenElement ||
          (document as any).msFullscreenElement
        )
      );
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
    };
  }, []);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(item);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownload?.(item);
  };

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const handleProgressChange = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
      setProgress(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.volume = value[0];
      setVolume(value[0]);
      setIsMuted(value[0] === 0);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.muted = false;
        videoRef.current.volume = volume || 0.5;
        setVolume(videoRef.current.volume);
        setIsMuted(false);
      } else {
        videoRef.current.muted = true;
        setIsMuted(true);
      }
    }
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();

    const container = videoContainerRef.current;
    if (!container) return;

    try {
      if (!isFullscreen) {
        if (container.requestFullscreen) {
          container.requestFullscreen();
        } else if ((container as any).webkitRequestFullscreen) {
          (container as any).webkitRequestFullscreen();
        } else if ((container as any).mozRequestFullScreen) {
          (container as any).mozRequestFullScreen();
        } else if ((container as any).msRequestFullscreen) {
          (container as any).msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          (document as any).msExitFullscreen();
        }
      }
    } catch (error) {
      console.error("Error toggling fullscreen:", error);
    }
  };

  const handleVideoClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only trigger parent onClick if not clicking on controls
    if (e.target === videoRef.current) {
      onClick?.(e);
    }
  };

  const getStatusColor = () => {
    switch (item.status) {
      case "success":
        return "bg-green-500";
      case "failed":
        return "bg-red-500";
      case "processing":
        return "bg-yellow-500";
      case "pending":
      default:
        return "bg-blue-500";
    }
  };

  const getStatusText = () => {
    switch (item.status) {
      case "success":
        return t("status.ready");
      case "failed":
        return t("status.failed");
      case "processing":
        return t("status.processing");
      case "pending":
      default:
        return t("status.pending");
    }
  };

  // Format time as mm:ss
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  // Show a placeholder for videos that are still processing
  const isVideoReady = item.status === "success" && item.url;

  return (
    <div
      className={`relative overflow-hidden rounded-lg ${className}`}
      onClick={handleVideoClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setShowControls(false);
      }}
    >
      {showTag && item.tag && (
        <div className="absolute left-3 top-3 z-10 drop-shadow-md">
          <Tag>{item.tag}</Tag>
        </div>
      )}

      {showStatus && item.status && (
        <div className="absolute right-3 top-3 z-10 drop-shadow-md">
          <Badge
            variant="outline"
            className={`${getStatusColor()} font-medium text-white`}
          >
            {getStatusText()}
          </Badge>
        </div>
      )}

      {isVideoReady ? (
        <div className="relative" ref={videoContainerRef}>
          <video
            ref={videoRef}
            src={item.url}
            className={`h-auto w-full cursor-pointer object-cover ${isFullscreen ? "h-full" : ""}`}
            controls={false}
            loop
            muted={isMuted}
            playsInline
            poster={item.inputType === "image" ? item.imageUrl : undefined}
            onClick={(e) => {
              e.stopPropagation();
              setShowControls(!showControls);
            }}
          />

          {/* Custom video controls */}
          {isHovering && (
            <div
              className="absolute bottom-0 left-0 right-0 z-30 bg-black/60 p-3"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Progress bar */}
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xs text-white">
                  {formatTime(progress)}
                </span>
                <Slider
                  value={[progress]}
                  min={0}
                  max={duration || 100}
                  step={0.01}
                  onValueChange={handleProgressChange}
                  className="flex-grow"
                />
                <span className="text-xs text-white">
                  {formatTime(duration)}
                </span>
              </div>

              {/* Control buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IconButton
                    onClick={handlePlayPause}
                    title={isPlaying ? t("actions.pause") : t("actions.play")}
                    className="h-8 w-8"
                  >
                    {isPlaying ? (
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
                        <rect x="6" y="4" width="4" height="16" />
                        <rect x="14" y="4" width="4" height="16" />
                      </svg>
                    ) : (
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
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    )}
                  </IconButton>

                  <IconButton
                    onClick={toggleMute}
                    title={isMuted ? t("actions.unmute") : t("actions.mute")}
                    className="h-8 w-8"
                  >
                    {isMuted ? (
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
                        <path d="M11 5L6 9H2v6h4l5 4V5z" />
                        <line x1="23" y1="9" x2="17" y2="15" />
                        <line x1="17" y1="9" x2="23" y2="15" />
                      </svg>
                    ) : (
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
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                      </svg>
                    )}
                  </IconButton>

                  <div className="relative ml-1 flex w-20 items-center">
                    <Slider
                      value={[isMuted ? 0 : volume || 0.5]}
                      min={0}
                      max={1}
                      step={0.01}
                      onValueChange={handleVolumeChange}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  {fullScreenEnabled && (
                    <IconButton
                      onClick={toggleFullscreen}
                      title={
                        isFullscreen
                          ? t("actions.exitFullscreen")
                          : t("actions.fullscreen")
                      }
                      className="h-8 w-8"
                    >
                      {isFullscreen ? (
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
                          <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                        </svg>
                      ) : (
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
                          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                        </svg>
                      )}
                    </IconButton>
                  )}

                  {showActions && (
                    <>
                      <IconButton
                        onClick={handleDownload}
                        title={t("actions.download")}
                        className="h-8 w-8"
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
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                      </IconButton>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          onShowDetails?.(item);
                        }}
                        title={t("actions.details")}
                        className="h-8 w-8"
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
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="16" x2="12" y2="12" />
                          <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                      </IconButton>
                      <IconButton
                        onClick={handleDelete}
                        title={t("actions.delete")}
                        className="h-8 w-8"
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
                          <path d="M3 6h18" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </IconButton>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="relative">
          <div className="flex h-48 w-full items-center justify-center bg-gray-100 dark:bg-gray-800">
            {item.status === "failed" ? (
              <div className="text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-auto h-12 w-12 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                  {t("status.generationFailed")}
                </p>
              </div>
            ) : (
              <div className="text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-auto h-12 w-12 animate-pulse text-gray-400"
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
                <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                  {item.status === "processing"
                    ? t("status.processingVideo")
                    : t("status.waitingToStart")}
                </p>
              </div>
            )}
          </div>

          {/* Add action buttons for non-ready videos */}
          {isHovering && showActions && (
            <div className="absolute bottom-0 left-0 right-0 z-30 flex justify-end gap-2 bg-black/40 p-3">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onShowDetails?.(item);
                }}
                title={t("actions.details")}
                className="h-8 w-8"
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
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </IconButton>
              <IconButton
                onClick={handleDelete}
                title={t("actions.delete")}
                className="h-8 w-8"
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
                  <path d="M3 6h18" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </IconButton>
            </div>
          )}
        </div>
      )}

      {/* Video info overlay - only shown when hovering but not showing controls */}
      {isHovering && !isVideoReady && (
        <div className="absolute inset-0 bg-black/50">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="line-clamp-1 text-lg font-semibold text-white drop-shadow-md">
              {item.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm text-white drop-shadow-md">
              {item.desc}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
