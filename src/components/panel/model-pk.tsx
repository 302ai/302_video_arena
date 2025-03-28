import { useEffect } from "react";
import ModelPkTop from "./model-pk/top";
import ModelPkBottom from "./model-pk/bottom";
import { useTranslations } from "next-intl";
import { useAtom, useAtomValue } from "jotai";
import { videoPkStateAtom } from "@/stores/slices/video_pk_store";
import { generateVideo, pollVideoStatus } from "@/services/gen-video";
import { appConfigAtom, store } from "@/stores";
import { createScopedLogger } from "@/utils";
import { toast } from "sonner";
import { useVideoHistory } from "@/hooks/db/use-video-history";
import { videoPKFormAtom } from "@/stores/slices/video_pk_store";
import {
  getRandomVideoModel,
  getVideoModelById,
} from "@/constants/video-models";
import { db } from "@/db";
import { useConfig } from "@/hooks/config";
import {
  calculateInitialLeaderboard,
  updateLeaderboard,
} from "@/utils/leaderboard";

const logger = createScopedLogger("model-pk");

export default function ModelPk() {
  const t = useTranslations("modelPk");
  const [pkState, setPkState] = useAtom(videoPkStateAtom);
  const pkForm = useAtomValue(videoPKFormAtom);
  const { fetchConfig, updateConfigValues, isReady } = useConfig();

  const {
    addHistory,
    videoHistory,
    updateVideoStatus,
    updateVideoUrl,
    updateTaskId,
    updateHistory,
    deleteHistory,
  } = useVideoHistory(1, 10, "pk");

  const currentPkHistory = videoHistory?.find(
    (h) => h.id === pkState.historyId
  );
  const leftVideo = currentPkHistory?.videos?.[0];
  const rightVideo = currentPkHistory?.videos?.[1];

  const updateCloudConfig = async (winner: number) => {
    if (!isReady || !currentPkHistory) return;
    try {
      const config = await fetchConfig();
      const currentLeaderboard = config.config.leaderboard || [];

      if (winner >= 0) {
        const newLeaderboard = updateLeaderboard(currentLeaderboard, {
          modelA: leftVideo?.model || "",
          modelB: rightVideo?.model || "",
          winner:
            winner === 0 ? leftVideo?.model || "" : rightVideo?.model || "",
        });

        await updateConfigValues(
          {
            leaderboard: newLeaderboard,
          },
          config.version
        );
      }
    } catch (error) {
      logger.error("Failed to update cloud config:", error);
      toast.error(t("error.update_leaderboard_failed"));
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (pkState.isGenerating) {
      timer = setInterval(() => {
        setPkState((prev) => ({
          ...prev,
          elapsedTime: {
            left:
              leftVideo?.status === "success" || leftVideo?.status === "failed"
                ? prev.elapsedTime.left
                : prev.elapsedTime.left + 1,
            right:
              rightVideo?.status === "success" ||
              rightVideo?.status === "failed"
                ? prev.elapsedTime.right
                : prev.elapsedTime.right + 1,
          },
        }));
      }, 1000);
    } else {
      setPkState((prev) => ({
        ...prev,
        elapsedTime: { left: 0, right: 0 },
      }));
    }
    return () => clearInterval(timer);
  }, [pkState.isGenerating, setPkState, leftVideo?.status, rightVideo?.status]);

  useEffect(() => {
    if (pkState.historyId && pkState.isGenerating) {
      const leftStatus = leftVideo?.status;
      const rightStatus = rightVideo?.status;

      if (
        (leftStatus === "success" || leftStatus === "failed") &&
        (rightStatus === "success" || rightStatus === "failed")
      ) {
        logger.info("Both videos have final status, updating PK state");
        setPkState((prev) => ({
          ...prev,
          isGenerating: false,
          currentStatus: "idle",
        }));
      }
    }
  }, [
    pkState.historyId,
    pkState.isGenerating,
    leftVideo?.status,
    rightVideo?.status,
  ]);

  const startVideoPolling = async (
    historyId: string,
    taskId: string,
    videoIndex: number,
    apiKey: string
  ) => {
    await updateTaskId(historyId, taskId);

    try {
      const result = await pollVideoStatus(
        taskId,
        apiKey,
        (status) => {
          logger.info(`Video ${videoIndex} polling status: ${status}`);

          if (status === "success") {
            updateVideoStatus(historyId, videoIndex, "success");
          } else if (status === "fail") {
            updateVideoStatus(historyId, videoIndex, "failed");
            toast.error(
              videoIndex === 0
                ? t("error.left_generate_failed")
                : t("error.right_generate_failed")
            );
          }
        },
        60, // Max attempts
        3000, // Initial interval (3 seconds)
        30000 // Max interval (30 seconds)
      );

      if (result.status === "success" && result.url) {
        await updateVideoUrl(historyId, videoIndex, result.url);
      }
    } catch (error) {
      logger.error(`Video ${videoIndex} polling error:`, error);
      updateVideoStatus(historyId, videoIndex, "failed");
      toast.error(
        videoIndex === 0
          ? t("error.left_generate_failed")
          : t("error.right_generate_failed")
      );
    }
  };

  const handleGenerate = async () => {
    const { apiKey } = store.get(appConfigAtom);
    if (!pkForm.prompt) {
      toast.error(t("error.no_prompt"));
      return;
    }
    if (!pkForm.leftModel || !pkForm.rightModel) {
      toast.error(t("error.no_model"));
      return;
    }
    if (!apiKey) {
      toast.error(t("error.no_api_key"));
      return;
    }

    let actualLeftModel = pkForm.leftModel;
    let actualRightModel = pkForm.rightModel;

    if (pkForm.leftDisplay === "random") {
      const randomModel = getRandomVideoModel("T2V");
      actualLeftModel = randomModel;
    }
    if (pkForm.rightDisplay === "random") {
      const randomModel = getRandomVideoModel("T2V");
      actualRightModel = randomModel;
    }

    const leftModelInfo = getVideoModelById(actualLeftModel);
    const rightModelInfo = getVideoModelById(actualRightModel);
    logger.info(`Left model: ${leftModelInfo?.name} (${actualLeftModel})`);
    logger.info(`Right model: ${rightModelInfo?.name} (${actualRightModel})`);

    setPkState((prev) => ({
      ...prev,
      historyId: null,
      isGenerating: true,
      currentStatus: "generating",
      elapsedTime: {
        left: 0,
        right: 0,
      },
    }));

    try {
      const historyId = await addHistory({
        rawPrompt: pkForm.prompt,
        shouldOptimize: pkForm.isOptimized,
        duration: pkForm.duration,
        fps: pkForm.fps,
        type: "pk",
        videos: [
          {
            url: "",
            prompt: pkForm.prompt,
            model: actualLeftModel,
            status: "pending",
          },
          {
            url: "",
            prompt: pkForm.prompt,
            model: actualRightModel,
            status: "pending",
          },
        ],
        taskId: "",
        inputType: "text",
      });

      setPkState((prev) => ({
        ...prev,
        historyId,
      }));

      try {
        const result = await generateVideo({
          prompt: pkForm.prompt,
          models: [actualLeftModel, actualRightModel], // 传入两个模型
          duration: pkForm.duration,
          fps: pkForm.fps,
          shouldOptimize: pkForm.isOptimized,
          apiKey: apiKey || "",
        });

        if (result.tasks && result.tasks.length > 0) {
          const leftTask = result.tasks.find(
            (task) => task.model === actualLeftModel
          );
          if (leftTask && leftTask.task_id) {
            startVideoPolling(historyId, leftTask.task_id, 0, apiKey);
          } else {
            updateVideoStatus(historyId, 0, "failed");
            toast.error(t("error.left_generate_failed"));
          }

          const rightTask = result.tasks.find(
            (task) => task.model === actualRightModel
          );
          if (rightTask && rightTask.task_id) {
            startVideoPolling(historyId, rightTask.task_id, 1, apiKey);
          } else {
            updateVideoStatus(historyId, 1, "failed");
            toast.error(t("error.right_generate_failed"));
          }

          if (!leftTask && !rightTask) {
            setPkState((prev) => ({
              ...prev,
              isGenerating: false,
              currentStatus: "idle",
            }));
          }
        } else {
          updateVideoStatus(historyId, 0, "failed");
          updateVideoStatus(historyId, 1, "failed");

          setPkState((prev) => ({
            ...prev,
            isGenerating: false,
            currentStatus: "idle",
          }));
        }
      } catch (error) {
        logger.error(`Video generation error: `, error);

        updateVideoStatus(historyId, 0, "failed");
        updateVideoStatus(historyId, 1, "failed");

        setPkState((prev) => ({
          ...prev,
          isGenerating: false,
          currentStatus: "idle",
        }));
      }
    } catch (error) {
      logger.error(`generateVideo error: `, error);

      setPkState((prev) => ({
        ...prev,
        isGenerating: false,
        currentStatus: "idle",
      }));
    }
  };

  return (
    <div className="flex size-full flex-col gap-4">
      <div className="@container">
        <div className="rounded-lg border bg-card text-card-foreground">
          <div className="grid gap-4 p-4">
            <ModelPkTop onGenerate={handleGenerate} />
            <ModelPkBottom updateCloudConfig={updateCloudConfig} />
          </div>
        </div>
      </div>
    </div>
  );
}
