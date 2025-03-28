import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SwitchWithLabels } from "@/components/ui/switch/switch-with-label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  Loader2,
  Shuffle,
  Wand2,
  Upload,
  Video,
  Image as ImageIcon,
  FileText,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  generateVideo,
  pollVideoStatus,
  GenerateVideoParams,
} from "@/services/gen-video";
import { appConfigAtom, languageAtom, store } from "@/stores";
import { createScopedLogger } from "@/utils";
import { useAtom } from "jotai";
import {
  videoGenFormAtom,
  videoGenStateAtom,
} from "@/stores/slices/video_form_store";
import { toast } from "sonner";
import { useVideoHistory } from "@/hooks/db/use-video-history";
import { useState, useEffect, useRef } from "react";
import { usePrompts } from "@/hooks/swr/use-prompts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getVideoModelById,
  getVideoModelsByType,
  ModelType,
  getRandomVideoModel,
} from "@/constants/video-models";
import { VideoModelSelector } from "@/components/business/video-model-selector";

const logger = createScopedLogger("video-gen-top");

const dataUrlToFile = async (
  dataUrl: string,
  fileName: string
): Promise<File | null> => {
  try {
    const arr = dataUrl.split(",");

    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";

    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], fileName, { type: mime });
  } catch (error) {
    logger.error("Error converting data URL to file:", error);
    return null;
  }
};

interface VideoGenTopProps {
  className?: string;
}

export default function VideoGenTop({ className }: VideoGenTopProps) {
  const t = useTranslations("modelGen");

  const isFormValid = () => {
    switch (selectedTab) {
      case "T2V":
        return !!videoGenForm.prompt;
      case "I2V":
        return (
          (!!videoGenForm.imageFile || !!videoGenForm.imageUrl) &&
          !!videoGenForm.prompt
        );
      case "I2V_END":
        return (
          (!!videoGenForm.imageFile || !!videoGenForm.imageUrl) &&
          (!!videoGenForm.endImageFile || !!videoGenForm.endImageUrl) &&
          !!videoGenForm.prompt
        );
      case "V2V":
        return (
          (!!videoGenForm.videoFile || !!videoGenForm.videoUrl) &&
          !!videoGenForm.prompt
        );
      default:
        return false;
    }
  };
  const [videoGenForm, setVideoGenForm] = useAtom(videoGenFormAtom);
  const [genState, setGenState] = useAtom(videoGenStateAtom);
  const { addHistory, updateTaskId, updateVideoStatus, updateVideoUrl } =
    useVideoHistory();
  const { prompts, refresh } = usePrompts(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const endImageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [selectedTab, setSelectedTab] = useState<ModelType>("T2V");
  const [availableModels, setAvailableModels] = useState(
    getVideoModelsByType("T2V")
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [endPreviewUrl, setEndPreviewUrl] = useState<string | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [currentHistoryId, setCurrentHistoryId] = useState<string | null>(null);
  const pollingInitiatedRef = useRef(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (genState.isGenerating) {
      timer = setInterval(() => {
        setGenState((prev) => ({
          ...prev,
          elapsedTime: prev.elapsedTime + 1,
        }));
      }, 1000);

      if (genState.taskId) {
        sessionStorage.setItem("video_generation_task_id", genState.taskId);
        if (currentHistoryId) {
          sessionStorage.setItem(
            "video_generation_history_id",
            currentHistoryId
          );
        }
        sessionStorage.setItem(
          "video_generation_status",
          genState.currentStatus
        );
      }
    } else {
      setGenState((prev) => ({ ...prev, elapsedTime: 0 }));

      if (
        genState.currentStatus === "success" ||
        genState.currentStatus === "failed"
      ) {
        sessionStorage.removeItem("video_generation_task_id");
        sessionStorage.removeItem("video_generation_history_id");
        sessionStorage.removeItem("video_generation_status");
      }
    }
    return () => clearInterval(timer);
  }, [
    genState.isGenerating,
    genState.taskId,
    genState.currentStatus,
    currentHistoryId,
    setGenState,
  ]);

  useEffect(() => {
    const savedTaskId = sessionStorage.getItem("video_generation_task_id");
    const savedHistoryId = sessionStorage.getItem(
      "video_generation_history_id"
    );
    const savedStatus = sessionStorage.getItem("video_generation_status");

    if (
      savedTaskId &&
      savedStatus === "polling" &&
      !pollingInitiatedRef.current
    ) {
      logger.info(
        `Restoring polling from session storage for task ID: ${savedTaskId}`
      );

      setGenState((prev) => ({
        ...prev,
        isGenerating: true,
        currentStatus: "polling",
        taskId: savedTaskId,
      }));

      if (savedHistoryId) {
        setCurrentHistoryId(savedHistoryId);
      }

      const { apiKey } = store.get(appConfigAtom);
      if (apiKey) {
        pollingInitiatedRef.current = true;

        pollVideoStatus(
          savedTaskId,
          apiKey,
          (status) => {
            logger.info(`Restored video polling status: ${status}`);

            if (status === "success") {
              if (savedHistoryId) {
                updateVideoStatus(savedHistoryId, 0, "success");
              }
            } else if (status === "fail") {
              if (savedHistoryId) {
                updateVideoStatus(savedHistoryId, 0, "failed");
              }
            }
          },
          60, // Max attempts
          3000, // Initial interval (3 seconds)
          30000 // Max interval (30 seconds)
        )
          .then(async (result) => {
            if (result.status === "success" && result.url) {
              if (savedHistoryId) {
                await updateVideoUrl(savedHistoryId, 0, result.url);
              }
              setGenState((prev) => ({
                ...prev,
                isGenerating: false,
                currentStatus: "success",
                videoUrl: result.url,
              }));

              sessionStorage.removeItem("video_generation_task_id");
              sessionStorage.removeItem("video_generation_history_id");
              sessionStorage.removeItem("video_generation_status");
            } else {
              setGenState((prev) => ({
                ...prev,
                isGenerating: false,
                currentStatus: "failed",
              }));

              sessionStorage.removeItem("video_generation_task_id");
              sessionStorage.removeItem("video_generation_history_id");
              sessionStorage.removeItem("video_generation_status");
            }
            pollingInitiatedRef.current = false;
          })
          .catch((error) => {
            logger.error(`Restored polling error:`, error);
            setGenState((prev) => ({
              ...prev,
              isGenerating: false,
              currentStatus: "failed",
            }));
            pollingInitiatedRef.current = false;

            sessionStorage.removeItem("video_generation_task_id");
            sessionStorage.removeItem("video_generation_history_id");
            sessionStorage.removeItem("video_generation_status");
          });
      }
    }
  }, []);

  useEffect(() => {
    const models = getVideoModelsByType(selectedTab);
    setAvailableModels(models);

    const currentModel = videoGenForm.model;
    const modelExists = models.some((m) => m.id === currentModel);

    if (!modelExists && models.length > 0) {
      setVideoGenForm((prev) => ({
        ...prev,
        model: models[0].id,
      }));
    }

    setVideoGenForm((prev) => ({
      ...prev,
      inputType:
        selectedTab === "T2V"
          ? "text"
          : selectedTab === "I2V" || selectedTab === "I2V_END"
            ? "image"
            : "video",
    }));
  }, [selectedTab, setVideoGenForm, videoGenForm.model]);

  const handleModelChange = (value: string) => {
    logger.info(`handleModelChange: model=${value}`);

    let modelToUse = value;
    if (value === "random") {
      modelToUse = getRandomVideoModel(selectedTab);
    }

    setVideoGenForm((prev) => ({
      ...prev,
      model: modelToUse,
    }));
  };

  const handleRandomPrompt = () => {
    if (prompts.length > 0) {
      const prompt = prompts[0];
      setVideoGenForm((prev) => ({
        ...prev,
        prompt: prompt[store.get(languageAtom) as keyof typeof prompt],
      }));
    }
    refresh();
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "endImage" | "video"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "image" || type === "endImage") {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;

        if (type === "image") {
          setPreviewUrl(dataUrl);
          localStorage.setItem("videoGenImageUrl", dataUrl);
          setVideoGenForm((prev) => ({
            ...prev,
            imageFile: file,
            imageUrl: dataUrl,
          }));
        } else if (type === "endImage") {
          setEndPreviewUrl(dataUrl);
          localStorage.setItem("videoGenEndImageUrl", dataUrl);
          setVideoGenForm((prev) => ({
            ...prev,
            endImageFile: file,
            endImageUrl: dataUrl,
          }));
        }
      };
      reader.readAsDataURL(file);
    } else if (type === "video") {
      const url = URL.createObjectURL(file);
      setVideoPreviewUrl(url);
      setVideoGenForm((prev) => ({
        ...prev,
        videoFile: file,
        videoUrl: url,
      }));
    }
  };

  useEffect(() => {
    const savedImageUrl = localStorage.getItem("videoGenImageUrl");
    const savedEndImageUrl = localStorage.getItem("videoGenEndImageUrl");

    if (savedImageUrl) {
      setPreviewUrl(savedImageUrl);

      if (savedImageUrl.startsWith("data:")) {
        dataUrlToFile(savedImageUrl, "start-image.png").then((file) => {
          if (file) {
            setVideoGenForm((prev) => ({
              ...prev,
              imageFile: file,
              imageUrl: savedImageUrl,
            }));
            logger.info(
              "Converted imageUrl from localStorage to File:",
              file.name,
              file.type
            );
          } else {
            setVideoGenForm((prev) => ({
              ...prev,
              imageUrl: savedImageUrl,
            }));
            logger.warn("Failed to convert localStorage imageUrl to File");
          }
        });
      } else {
        setVideoGenForm((prev) => ({
          ...prev,
          imageUrl: savedImageUrl,
        }));
      }
    }

    if (savedEndImageUrl) {
      setEndPreviewUrl(savedEndImageUrl);

      if (savedEndImageUrl.startsWith("data:")) {
        dataUrlToFile(savedEndImageUrl, "end-image.png").then((file) => {
          if (file) {
            setVideoGenForm((prev) => ({
              ...prev,
              endImageFile: file,
              endImageUrl: savedEndImageUrl,
            }));
            logger.info(
              "Converted endImageUrl from localStorage to File:",
              file.name,
              file.type
            );
          } else {
            setVideoGenForm((prev) => ({
              ...prev,
              endImageUrl: savedEndImageUrl,
            }));
            logger.warn("Failed to convert localStorage endImageUrl to File");
          }
        });
      } else {
        setVideoGenForm((prev) => ({
          ...prev,
          endImageUrl: savedEndImageUrl,
        }));
      }
    }
  }, [setVideoGenForm]);

  const handleGenerate = async () => {
    const { apiKey } = store.get(appConfigAtom);
    let historyId: string | null = null;

    if (!isFormValid()) {
      switch (selectedTab) {
        case "T2V":
          if (!videoGenForm.prompt) {
            toast.error(t("error.no_prompt") || "Please enter a prompt");
          }
          break;
        case "I2V":
          if (!videoGenForm.imageFile && !videoGenForm.imageUrl) {
            toast.error(t("error.no_image") || "Please upload an image");
          } else if (!videoGenForm.prompt) {
            toast.error(t("error.no_prompt") || "Please enter a prompt");
          }
          break;
        case "I2V_END":
          if (!videoGenForm.imageFile && !videoGenForm.imageUrl) {
            toast.error(
              t("error.no_start_image") || "Please upload a start image"
            );
          } else if (!videoGenForm.endImageFile && !videoGenForm.endImageUrl) {
            toast.error(
              t("error.no_end_image") || "Please upload an end image"
            );
          } else if (!videoGenForm.prompt) {
            toast.error(t("error.no_prompt") || "Please enter a prompt");
          }
          break;
        case "V2V":
          if (!videoGenForm.videoFile && !videoGenForm.videoUrl) {
            toast.error(t("error.no_video") || "Please upload a video");
          } else if (!videoGenForm.prompt) {
            toast.error(t("error.no_prompt") || "Please enter a prompt");
          }
          break;
        default:
          toast.error(
            t("error.invalidForm") || "Please fill the form correctly"
          );
      }
      return;
    }

    if (!videoGenForm.model) {
      toast.error(t("error.no_model") || "Please select a model");
      return;
    }

    setGenState((prev) => ({
      ...prev,
      isGenerating: true,
      currentStatus: "generating",
    }));

    try {
      historyId = await addHistory({
        rawPrompt: videoGenForm.prompt,
        taskId: "",
        shouldOptimize: videoGenForm.isOptimized,
        duration: videoGenForm.duration,
        fps: videoGenForm.fps,
        type: "gen",
        inputType: videoGenForm.inputType,
        inputUrl: videoGenForm.imageUrl || videoGenForm.videoUrl,
        endImageUrl: videoGenForm.endImageUrl,
        videos: [
          {
            url: "",
            prompt: videoGenForm.prompt,
            model: videoGenForm.model,
            status: "pending",
          },
        ],
      });

      setCurrentHistoryId(historyId);

      const params: GenerateVideoParams = {
        prompt: videoGenForm.prompt,
        shouldOptimize: videoGenForm.isOptimized,
        duration: videoGenForm.duration,
        fps: videoGenForm.fps,
        models: [videoGenForm.model],
        apiKey: apiKey || "",
      };

      if (videoGenForm.inputType === "image") {
        if (videoGenForm.imageFile) {
          params.image = videoGenForm.imageFile;
          logger.info(
            "Using original image file:",
            videoGenForm.imageFile instanceof File
          );
        } else if (
          videoGenForm.imageUrl &&
          videoGenForm.imageUrl.startsWith("data:")
        ) {
          const imageFile = await dataUrlToFile(
            videoGenForm.imageUrl,
            "start-image.png"
          );
          if (imageFile) {
            params.image = imageFile;
            logger.info(
              "Using converted image file:",
              imageFile instanceof File,
              imageFile.name,
              imageFile.type
            );
          } else {
            params.image = videoGenForm.imageUrl;
            logger.warn(
              "Failed to convert image URL to file, using URL directly"
            );
          }
        } else {
          params.image = videoGenForm.imageUrl;
          logger.info("Using image URL:", videoGenForm.imageUrl);
        }

        const model = getVideoModelById(videoGenForm.model);
        if (model?.supportsEndImage) {
          if (videoGenForm.endImageFile) {
            params.endImage = videoGenForm.endImageFile;
            logger.info(
              "Using original end image file:",
              videoGenForm.endImageFile instanceof File
            );
          } else if (
            videoGenForm.endImageUrl &&
            videoGenForm.endImageUrl.startsWith("data:")
          ) {
            const endImageFile = await dataUrlToFile(
              videoGenForm.endImageUrl,
              "end-image.png"
            );
            if (endImageFile) {
              params.endImage = endImageFile;
              logger.info(
                "Using converted end image file:",
                endImageFile instanceof File,
                endImageFile.name,
                endImageFile.type
              );
            } else {
              params.endImage = videoGenForm.endImageUrl;
              logger.warn(
                "Failed to convert end image URL to file, using URL directly"
              );
            }
          } else {
            params.endImage = videoGenForm.endImageUrl;
            logger.info("Using end image URL:", videoGenForm.endImageUrl);
          }
        }
      } else if (videoGenForm.inputType === "video") {
        if (videoGenForm.videoFile) {
          params.video = videoGenForm.videoFile;
          logger.info(
            "Using original video file:",
            videoGenForm.videoFile instanceof File
          );
        } else {
          params.video = videoGenForm.videoUrl;
          logger.info("Using video URL:", videoGenForm.videoUrl);
        }
      }

      const res = await generateVideo(params);
      logger.info(`generateVideo res: `, res);

      const taskId = res.tasks?.[0]?.task_id;

      if (!taskId) {
        throw new Error("No task ID returned from video generation");
      }

      if (historyId) {
        await updateTaskId(historyId, taskId);
      }

      setGenState((prev) => ({
        ...prev,
        taskId: taskId,
        currentStatus: "polling",
      }));

      if (historyId) {
        await updateVideoStatus(historyId, 0, "processing");
      }

      pollingInitiatedRef.current = true;

      pollVideoStatus(
        taskId,
        apiKey || "",
        (status) => {
          logger.info(`Video status: ${status}`);

          if (status === "success") {
            if (historyId) {
              updateVideoStatus(historyId, 0, "success");
            }
          } else if (status === "fail") {
            if (historyId) {
              updateVideoStatus(historyId, 0, "failed");
            }
          }
        },
        60, // Max attempts
        3000, // Initial interval (3 seconds)
        30000 // Max interval (30 seconds)
      )
        .then(async (result) => {
          if (result.status === "success" && result.url) {
            logger.info(
              `Video generation successful. URL: ${result.url.substring(0, 30)}...`
            );
            logger.info(`Updating history ID: ${historyId} with URL`);

            if (historyId) {
              try {
                await updateVideoUrl(historyId, 0, result.url);
                logger.info(
                  `Successfully updated history with video URL for ID: ${historyId}`
                );
              } catch (e) {
                logger.error(`Failed to update video URL in history:`, e);
              }
            } else {
              logger.error(
                `History ID not found when trying to update video URL`
              );
            }

            setGenState((prev) => ({
              ...prev,
              isGenerating: false,
              currentStatus: "success",
              videoUrl: result.url,
            }));
          } else {
            const idToUpdate = historyId || currentHistoryId;
            if (idToUpdate) {
              try {
                await updateVideoStatus(idToUpdate, 0, "failed");
                logger.info(
                  `Updated history status to failed for ID: ${idToUpdate}`
                );
              } catch (e) {
                logger.error(`Failed to update history status: `, e);
              }
            } else {
              logger.error("No history ID available to update status");
            }
            setGenState((prev) => ({
              ...prev,
              isGenerating: false,
              currentStatus: "failed",
            }));
          }
          pollingInitiatedRef.current = false;
        })
        .catch(async (error) => {
          logger.error(`pollVideoStatus error: `, error);

          const idToUpdate = historyId || currentHistoryId;

          try {
            if (idToUpdate) {
              await updateVideoStatus(idToUpdate, 0, "failed");
              logger.info(
                `Updated history status to failed for ID: ${idToUpdate}`
              );
            } else {
              logger.error("No history ID available to update status");
            }
          } catch (e) {
            logger.error(`Failed to update history status: `, e);
          }

          setGenState((prev) => ({
            ...prev,
            isGenerating: false,
            currentStatus: "failed",
          }));

          pollingInitiatedRef.current = false;
        });
    } catch (error) {
      logger.error(`generateVideo error: `, error);

      const idToUpdate = historyId || currentHistoryId;

      try {
        if (idToUpdate) {
          await updateVideoStatus(idToUpdate, 0, "failed");
          logger.info(`Updated history status to failed for ID: ${idToUpdate}`);
        } else {
          logger.error("No history ID available to update status");
        }
      } catch (e) {
        logger.error(`Failed to update history status: `, e);
      }

      setGenState((prev) => ({
        ...prev,
        isGenerating: false,
        currentStatus: "failed",
      }));

      pollingInitiatedRef.current = false;
    }
  };

  const renderInputSection = () => {
    switch (selectedTab) {
      case "T2V":
        return (
          <div className="relative flex min-h-[300px] flex-1 flex-col p-4 @[600px]:min-h-[400px]">
            <Textarea
              value={videoGenForm.prompt}
              onChange={(e) =>
                setVideoGenForm((prev) => ({
                  ...prev,
                  prompt: e.target.value,
                }))
              }
              className="min-h-[250px] flex-1 resize-none border-none shadow-none focus-visible:ring-0"
              placeholder={
                t("promptPlaceholder") ||
                "Enter a prompt to generate a video..."
              }
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute bottom-6 right-6 h-8 w-8 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              onClick={handleRandomPrompt}
            >
              <Shuffle className="h-4 w-4" />
            </Button>
          </div>
        );

      case "I2V":
        return (
          <div className="relative flex min-h-[200px] flex-1 flex-col gap-4 p-4 @[600px]:min-h-0">
            <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-xl border border-dashed bg-muted/5 p-6 transition-colors hover:bg-muted/10">
              {previewUrl ? (
                <div className="relative mx-auto w-full max-w-xs">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-auto w-full rounded-lg object-cover shadow-md"
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute right-2 top-2 opacity-90 hover:opacity-100"
                    onClick={() => {
                      setPreviewUrl(null);
                      setVideoGenForm((prev) => ({
                        ...prev,
                        imageFile: null,
                        imageUrl: "",
                      }));
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }

                      localStorage.removeItem("videoGenImageUrl");
                    }}
                  >
                    {t("remove")}
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted/20">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="text-base font-medium">
                      {t("uploadImage") ||
                        "Upload an image to generate a video"}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t("supportedFormats") || "Supports JPG, PNG, WEBP"}
                    </p>
                  </div>
                </>
              )}

              <div className="flex gap-2">
                <Button
                  variant={previewUrl ? "outline" : "default"}
                  onClick={() => fileInputRef.current?.click()}
                  className={previewUrl ? "" : "px-6"}
                  size={previewUrl ? "default" : "lg"}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {previewUrl ? t("changeImage") : t("uploadImage")}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "image")}
                />
              </div>
            </div>

            <div className="mt-2">
              <Label className="mb-2 block text-sm font-medium">
                {t("prompt") || "Prompt"}
              </Label>
              <Textarea
                value={videoGenForm.prompt}
                onChange={(e) =>
                  setVideoGenForm((prev) => ({
                    ...prev,
                    prompt: e.target.value,
                  }))
                }
                className="min-h-[80px] resize-none"
                placeholder={
                  t("i2vPromptPlaceholder") ||
                  "Enter a prompt to guide the video generation..."
                }
              />
            </div>
          </div>
        );

      case "I2V_END":
        return (
          <div className="relative flex min-h-[200px] flex-1 flex-col gap-4 p-4 @[600px]:min-h-0">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Start image */}
              <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-xl border border-dashed bg-muted/5 p-4 transition-colors hover:bg-muted/10">
                <Label className="text-sm font-medium">{t("startImage")}</Label>
                {previewUrl ? (
                  <div className="relative w-full max-w-xs">
                    <img
                      src={previewUrl}
                      alt="Start Image"
                      className="h-auto w-full rounded-lg object-cover shadow-md"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute right-2 top-2 opacity-90 hover:opacity-100"
                      onClick={() => {
                        setPreviewUrl(null);
                        setVideoGenForm((prev) => ({
                          ...prev,
                          imageFile: null,
                          imageUrl: "",
                        }));
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }

                        localStorage.removeItem("videoGenImageUrl");
                      }}
                    >
                      {t("remove")}
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/20">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        {t("uploadStartImage")}
                      </p>
                    </div>
                  </>
                )}

                <Button
                  size="sm"
                  variant={previewUrl ? "outline" : "default"}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-2 h-3 w-3" />
                  {previewUrl ? t("change") : t("upload")}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "image")}
                />
              </div>

              {/* End image */}
              <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-xl border border-dashed bg-muted/5 p-4 transition-colors hover:bg-muted/10">
                <Label className="text-sm font-medium">{t("endImage")}</Label>
                {endPreviewUrl ? (
                  <div className="relative w-full max-w-xs">
                    <img
                      src={endPreviewUrl}
                      alt="End Image"
                      className="h-auto w-full rounded-lg object-cover shadow-md"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute right-2 top-2 opacity-90 hover:opacity-100"
                      onClick={() => {
                        setEndPreviewUrl(null);
                        setVideoGenForm((prev) => ({
                          ...prev,
                          endImageFile: null,
                          endImageUrl: "",
                        }));
                        if (endImageInputRef.current) {
                          endImageInputRef.current.value = "";
                        }

                        localStorage.removeItem("videoGenEndImageUrl");
                      }}
                    >
                      {t("remove")}
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/20">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        {t("uploadEndImage")}
                      </p>
                    </div>
                  </>
                )}

                <Button
                  size="sm"
                  variant={endPreviewUrl ? "outline" : "default"}
                  onClick={() => endImageInputRef.current?.click()}
                >
                  <Upload className="mr-2 h-3 w-3" />
                  {endPreviewUrl ? t("change") : t("upload")}
                </Button>
                <input
                  ref={endImageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "endImage")}
                />
              </div>
            </div>

            <div className="mt-2">
              <Label className="mb-2 block text-sm font-medium">
                {t("prompt") || "Prompt"}
              </Label>
              <Textarea
                value={videoGenForm.prompt}
                onChange={(e) =>
                  setVideoGenForm((prev) => ({
                    ...prev,
                    prompt: e.target.value,
                  }))
                }
                className="min-h-[80px] resize-none"
                placeholder={
                  t("i2vEndPromptPlaceholder") ||
                  "Enter a prompt to guide the video generation..."
                }
              />
            </div>
          </div>
        );

      case "V2V":
        return (
          <div className="relative flex min-h-[200px] flex-1 flex-col gap-4 p-4 @[600px]:min-h-0">
            <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-xl border border-dashed bg-muted/5 p-6 transition-colors hover:bg-muted/10">
              {videoPreviewUrl ? (
                <div className="relative mx-auto w-full max-w-xs">
                  <video
                    src={videoPreviewUrl}
                    controls
                    className="h-auto w-full rounded-lg shadow-md"
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute right-2 top-2 opacity-90 hover:opacity-100"
                    onClick={() => {
                      setVideoPreviewUrl(null);
                      setVideoGenForm((prev) => ({
                        ...prev,
                        videoFile: null,
                        videoUrl: "",
                      }));
                      if (videoInputRef.current) {
                        videoInputRef.current.value = "";
                      }

                      URL.revokeObjectURL(videoPreviewUrl);
                    }}
                  >
                    {t("remove")}
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted/20">
                    <Video className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="text-base font-medium">
                      {t("uploadVideo") || "Upload a video to transform"}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t("supportedVideoFormats") || "Supports MP4, WEBM"}
                    </p>
                  </div>
                </>
              )}

              <div className="flex gap-2">
                <Button
                  variant={videoPreviewUrl ? "outline" : "default"}
                  onClick={() => videoInputRef.current?.click()}
                  className={videoPreviewUrl ? "" : "px-6"}
                  size={videoPreviewUrl ? "default" : "lg"}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {videoPreviewUrl ? t("changeVideo") : t("uploadVideo")}
                </Button>
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "video")}
                />
              </div>
            </div>

            <div className="mt-2">
              <Label className="mb-2 block text-sm font-medium">
                {t("prompt") || "Transformation Prompt"}
              </Label>
              <Textarea
                value={videoGenForm.prompt}
                onChange={(e) =>
                  setVideoGenForm((prev) => ({
                    ...prev,
                    prompt: e.target.value,
                  }))
                }
                className="min-h-[80px] resize-none"
                placeholder={
                  t("v2vPromptPlaceholder") ||
                  "Describe how you want to transform the video..."
                }
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const selectedModel = getVideoModelById(videoGenForm.model);

  return (
    <div className="@container">
      <div
        className={cn(
          "flex size-full min-h-[300px] flex-col overflow-hidden rounded-lg border focus-within:border-transparent focus-within:ring-1 focus-within:ring-violet-500 @[600px]:flex-row dark:focus-within:ring-violet-500",
          className
        )}
      >
        <Tabs
          value={selectedTab}
          onValueChange={(value) => setSelectedTab(value as ModelType)}
          className="flex-1"
        >
          <div className="flex border-b">
            <TabsList className="h-10 w-full justify-start rounded-none border-b bg-transparent p-0">
              <TabsTrigger
                value="T2V"
                className="relative h-10 rounded-none border-b-2 border-b-transparent bg-transparent px-4 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                <FileText className="mr-2 h-4 w-4" />
                {t("tabs.textToVideo")}
              </TabsTrigger>
              <TabsTrigger
                value="I2V"
                className="relative h-10 rounded-none border-b-2 border-b-transparent bg-transparent px-4 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                {t("tabs.imageToVideo")}
              </TabsTrigger>
              <TabsTrigger
                value="I2V_END"
                className="relative h-10 rounded-none border-b-2 border-b-transparent bg-transparent px-4 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                {t("tabs.startEndImages")}
              </TabsTrigger>
              <TabsTrigger
                value="V2V"
                className="relative h-10 rounded-none border-b-2 border-b-transparent bg-transparent px-4 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                <Video className="mr-2 h-4 w-4" />
                {t("tabs.videoToVideo")}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="T2V" className="flex flex-1 flex-col">
            {renderInputSection()}
          </TabsContent>
          <TabsContent value="I2V" className="flex flex-1 flex-col">
            {renderInputSection()}
          </TabsContent>
          <TabsContent value="I2V_END" className="flex flex-1 flex-col">
            {renderInputSection()}
          </TabsContent>
          <TabsContent value="V2V" className="flex flex-1 flex-col">
            {renderInputSection()}
          </TabsContent>
        </Tabs>

        <div className="flex flex-col gap-4 border-t bg-muted/10 p-4 @[600px]:w-[280px] @[600px]:border-l @[600px]:border-t-0">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">
              {t("model") || "Model"}
            </Label>
            <VideoModelSelector
              value={videoGenForm.model}
              onChange={handleModelChange}
              modelType={selectedTab}
              isDisabled={genState.isGenerating}
              placeholder={t("modelPlaceholder") || "Select a model"}
            />
            {selectedModel && (
              <p className="mt-1 text-xs text-muted-foreground">
                {t(selectedModel.description)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">
                {t("duration") || "Duration"}
              </Label>
              <span className="text-sm font-medium">
                {videoGenForm.duration}s
              </span>
            </div>
            <Slider
              value={[videoGenForm.duration]}
              min={1}
              max={30}
              step={1}
              onValueChange={(value) =>
                setVideoGenForm((prev) => ({ ...prev, duration: value[0] }))
              }
              disabled={selectedModel?.supportsDuration === false}
              className="my-1"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">{t("fps") || "FPS"}</Label>
              <span className="text-sm font-medium">{videoGenForm.fps}</span>
            </div>
            <Slider
              value={[videoGenForm.fps]}
              min={15}
              max={60}
              step={1}
              onValueChange={(value) =>
                setVideoGenForm((prev) => ({ ...prev, fps: value[0] }))
              }
              disabled={selectedModel?.supportsFps === false}
              className="my-1"
            />
          </div>

          <div className="flex items-center justify-between py-1">
            <Label htmlFor="optimize-prompt" className="text-sm font-medium">
              {t("optimize") || "Optimize Prompt"}
            </Label>
            <SwitchWithLabels
              checked={videoGenForm.isOptimized}
              onCheckedChange={(value) =>
                setVideoGenForm((prev) => ({ ...prev, isOptimized: value }))
              }
              onLabel={t("yes") || "Yes"}
              offLabel={t("no") || "No"}
            />
          </div>

          <Button
            onClick={handleGenerate}
            className="mt-auto w-full gap-2"
            disabled={genState.isGenerating || !isFormValid()}
            size="lg"
          >
            {genState.isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {genState.currentStatus === "generating"
                  ? t("generating") || "Generating"
                  : t("processing") || "Processing"}
                {genState.elapsedTime}s
              </>
            ) : (
              <>
                <Wand2 className="h-5 w-5" />
                {t("generateVideo") || "Generate Video"}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
