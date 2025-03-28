import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  SkipForward,
  ArrowLeftFromLine,
  ArrowRightFromLine,
  Download,
  Loader2,
  Medal,
  Play,
} from "lucide-react";
import { VideoModelSelector } from "@/components/business/video-model-selector";
import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { createScopedLogger } from "@/utils";
import {
  getVideoModelById,
  getRandomVideoModel,
} from "@/constants/video-models";
import { useAtom, useAtomValue } from "jotai";
import { videoPkStateAtom } from "@/stores/slices/video_pk_store";
import { videoPKFormAtom } from "@/stores/slices/video_pk_store";
import { motion } from "framer-motion";
import { useVideoHistory } from "@/hooks/db/use-video-history";
import { useMonitorMessage } from "@/hooks/global/use-monitor-message";
import { IconButton } from "@/components/ui/icon-button";
import { History } from "@/db/types";

const logger = createScopedLogger("model-pk-bottom");

interface ModelPkBottomProps {
  className?: string;
  updateCloudConfig: (winner: number) => Promise<void>;
}

interface VideoWithStatus {
  url: string;
  model: string;
  prompt: string;
  status: "pending" | "processing" | "success" | "failed";
}

interface VideoPkHistory extends History {
  winner?: number;
}

export default function ModelPkBottom({
  className,
  updateCloudConfig,
}: ModelPkBottomProps) {
  const t = useTranslations("modelPk");
  const pkState = useAtomValue(videoPkStateAtom);
  const [pkForm, setPkForm] = useAtom(videoPKFormAtom);
  const { videoHistory, updateHistory } = useVideoHistory(1, 10, "pk");
  const { handleDownload } = useMonitorMessage();
  const leftVideoRef = useRef<HTMLVideoElement>(null);
  const rightVideoRef = useRef<HTMLVideoElement>(null);

  const currentPkHistory = videoHistory?.find(
    (h) => h.id === pkState.historyId
  ) as VideoPkHistory | undefined;

  const leftVideo = currentPkHistory?.videos?.[0] as
    | VideoWithStatus
    | undefined;
  const rightVideo = currentPkHistory?.videos?.[1] as
    | VideoWithStatus
    | undefined;
  const hasVoted = currentPkHistory?.winner !== undefined;
  const winner = currentPkHistory?.winner;

  const handleModelChange = (side: "left" | "right", value: string) => {
    const displayValue = value;
    const modelValue = value;

    logger.info(`handleModelChange: side=${side}, model=${modelValue}`);
    if (side === "left") {
      setPkForm((prev) => ({
        ...prev,
        leftDisplay: displayValue,
        leftModel: modelValue,
      }));

      if (
        pkForm.rightDisplay === "random" ||
        pkForm.rightModel === modelValue
      ) {
        const newRightModel = getRandomVideoModel("T2V");
        setPkForm((prev) => ({
          ...prev,
          rightModel: newRightModel,
          rightDisplay:
            pkForm.rightModel === modelValue ? "random" : prev.rightDisplay,
        }));
      }
    } else {
      setPkForm((prev) => ({
        ...prev,
        rightDisplay: displayValue,
        rightModel: modelValue,
      }));

      if (pkForm.leftDisplay === "random" || pkForm.leftModel === modelValue) {
        const newLeftModel = getRandomVideoModel("T2V");
        setPkForm((prev) => ({
          ...prev,
          leftModel: newLeftModel,
          leftDisplay:
            pkForm.leftModel === modelValue ? "random" : prev.leftDisplay,
        }));
      }
    }
  };

  const handleVote = async (side: "left" | "right") => {
    if (!pkState.historyId) return;
    const winner = side === "left" ? 0 : 1;
    await updateHistory(pkState.historyId, {
      winner,
    } as any);
    await updateCloudConfig(winner);
  };

  const handleSkip = async () => {
    if (!pkState.historyId) return;
    await updateHistory(pkState.historyId, {
      winner: -1, // -1 represents skip
    } as any);
    await updateCloudConfig(-1);
  };

  const renderVideo = (
    video: VideoWithStatus | undefined,
    side: "left" | "right"
  ) => {
    if (!video) return null;

    if (video.status === "pending" || video.status === "processing") {
      return (
        <div className="absolute inset-0 m-4 rounded border border-dashed border-muted-foreground/50">
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin" />
              <div>{pkState.elapsedTime[side]}s</div>
            </div>
          </div>
        </div>
      );
    }

    if (video.status === "failed") {
      return (
        <div className="absolute inset-0 m-4 rounded border border-dashed border-destructive/50">
          <div className="absolute inset-0 flex items-center justify-center text-destructive">
            {side === "left" ? t("leftModelFailed") : t("rightModelFailed")}
          </div>
        </div>
      );
    }

    return (
      <div className="relative size-full">
        <video
          ref={side === "left" ? leftVideoRef : rightVideoRef}
          src={video.url}
          controls
          className="size-full object-contain"
          loop
          playsInline
        >
          Your browser does not support the video tag.
        </video>
        {hasVoted && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            {((side === "left" && winner === 0) ||
              (side === "right" && winner === 1)) && (
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 rounded-full bg-green-500/20 px-6 py-2 text-green-500">
                  <Medal className="h-6 w-6" />
                  <span className="text-2xl font-bold">{t("winner")}</span>
                </div>
              </div>
            )}
          </div>
        )}
        {hasVoted && (
          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <span className="rounded bg-black/50 px-2 py-1 text-sm text-white">
              {getVideoModelById(video.model)?.name}
            </span>
            <IconButton
              onClick={() =>
                handleDownload(
                  video.url,
                  `${video.prompt?.slice(0, 10) || side}.mp4`
                )
              }
              title="Download"
            >
              <Download className="h-4 w-4" />
            </IconButton>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid gap-4 @container @sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-sm">{t("leftModel")}</Label>
          <VideoModelSelector
            value={pkForm.leftDisplay}
            onChange={(value) => handleModelChange("left", value)}
            modelType="T2V"
            isDisabled={pkState.isGenerating}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm">{t("rightModel")}</Label>
          <VideoModelSelector
            value={pkForm.rightDisplay}
            onChange={(value) => handleModelChange("right", value)}
            modelType="T2V"
            isDisabled={pkState.isGenerating}
          />
        </div>
      </div>

      <div className="grid gap-4 @container @sm:grid-cols-2">
        <div className="relative aspect-video rounded-lg border">
          {renderVideo(leftVideo, "left")}
        </div>
        <div className="relative aspect-video rounded-lg border">
          {renderVideo(rightVideo, "right")}
        </div>
      </div>

      {!hasVoted &&
        leftVideo?.status === "success" &&
        rightVideo?.status === "success" && (
          <div className="flex gap-2">
            <Button
              onClick={() => handleVote("left")}
              size="sm"
              className="flex-1 gap-2"
            >
              <ArrowLeftFromLine className="h-4 w-4" />
              {t("leftWins")}
            </Button>
            <Button
              variant="secondary"
              onClick={handleSkip}
              size="sm"
              className="gap-2"
            >
              <SkipForward className="h-4 w-4" />
              {t("skip")}
            </Button>
            <Button
              onClick={() => handleVote("right")}
              size="sm"
              className="flex-1 gap-2"
            >
              {t("rightWins")}
              <ArrowRightFromLine className="h-4 w-4" />
            </Button>
          </div>
        )}
    </div>
  );
}
