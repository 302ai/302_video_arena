import ky, { HTTPError } from "ky";
import { emitter } from "@/utils/mitt";
import { store, languageAtom } from "@/stores";
import { langToCountry } from "@/utils/302";
import { ModelType } from "@/constants/video-models";

export interface GenerateVideoParams {
  prompt?: string;
  image?: File | string; // File for upload or string for URL/base64
  endImage?: File | string;
  video?: File | string;
  shouldOptimize?: boolean;
  duration?: number;
  fps?: number;
  model?: string; // 单个模型参数，保留向后兼容
  models?: string[]; // 新增多模型参数
  apiKey: string;
}

export interface GenerateVideoResult {
  tasks: {
    task_id: string;
    model: string;
    data: any;
  }[];
  failed?: {
    model: string;
    error: any;
  }[];
}

export interface FetchVideoResult {
  url: string;
  status: "success" | "fail" | "queue" | "processing";
  data: any; // Original response data
  error?: {
    err_code: number;
    message: string;
    message_cn?: string;
    message_en?: string;
    message_ja?: string;
    type?: string;
  };
}

export const generateVideo = async ({
  prompt,
  image,
  endImage,
  video,
  shouldOptimize,
  duration,
  fps,
  model,
  models,
  apiKey,
}: GenerateVideoParams): Promise<GenerateVideoResult> => {
  try {
    const modelsToUse = models || (model ? [model] : []);

    if (modelsToUse.length === 0) {
      throw new Error("At least one model is required");
    }

    const isImageFile =
      image &&
      (image instanceof File ||
        Object.prototype.toString.call(image) === "[object File]");
    const isEndImageFile =
      endImage &&
      (endImage instanceof File ||
        Object.prototype.toString.call(endImage) === "[object File]");
    const isVideoFile =
      video &&
      (video instanceof File ||
        Object.prototype.toString.call(video) === "[object File]");

    const hasFiles =
      isImageFile ||
      isEndImageFile ||
      isVideoFile ||
      (image && typeof image !== "string") ||
      (endImage && typeof endImage !== "string") ||
      (video && typeof video !== "string");

    console.log("gen-video.ts: Parameters received:");
    console.log(`image type: ${typeof image}, is File: ${isImageFile}`);
    if (image)
      console.log(
        `image details:`,
        isImageFile ? `File: ${(image as File).name}` : "Not a File"
      );
    console.log(
      `endImage type: ${typeof endImage}, is File: ${isEndImageFile}`
    );
    console.log(`video type: ${typeof video}, is File: ${isVideoFile}`);
    console.log(`hasFiles: ${hasFiles}`);
    console.log(`models: ${modelsToUse.join(", ")}`);

    let requestBody: any;

    if (hasFiles || image || endImage || video) {
      const formData = new FormData();
      console.log("Using FormData for this request");

      if (prompt) {
        formData.append("prompt", prompt);
      }

      formData.append("models", JSON.stringify(modelsToUse));

      if (image) {
        if (isImageFile) {
          console.log("Appending image as File");
          formData.append("image", image as File);
        } else if (typeof image === "string") {
          console.log("Appending image as string");
          formData.append("image", image);
        } else {
          try {
            if (image && typeof image === "object") {
              const objKeys = Object.keys(image);
              console.log("Image object keys:", objKeys);

              if (
                objKeys.includes("name") &&
                objKeys.includes("type") &&
                objKeys.includes("size")
              ) {
                console.log("Object looks like a File, forcing cast to File");
                formData.append("image", image as unknown as File);
              } else {
                console.log("Falling back to stringify");
                formData.append("image", JSON.stringify(image));
              }
            } else {
              formData.append("image", String(image));
            }
          } catch (e) {
            console.error("Error handling image object:", e);
            formData.append("image", String(image));
          }
        }
      }

      if (endImage) {
        if (isEndImageFile) {
          console.log("Appending end_image as File");
          formData.append("end_image", endImage as File);
        } else if (typeof endImage === "string") {
          console.log("Appending end_image as string");
          formData.append("end_image", endImage);
        } else {
          console.warn(
            "EndImage is not a File or string but:",
            Object.prototype.toString.call(endImage)
          );
          try {
            if (endImage && typeof endImage === "object") {
              const objKeys = Object.keys(endImage);
              console.log("EndImage object keys:", objKeys);

              if (
                objKeys.includes("name") &&
                objKeys.includes("type") &&
                objKeys.includes("size")
              ) {
                console.log("Object looks like a File, forcing cast to File");
                formData.append("end_image", endImage as unknown as File);
              } else {
                console.log("Falling back to stringify");
                formData.append("end_image", JSON.stringify(endImage));
              }
            } else {
              formData.append("end_image", String(endImage));
            }
          } catch (e) {
            console.error("Error handling endImage object:", e);
            formData.append("end_image", String(endImage));
          }
        }
      }

      if (video) {
        if (isVideoFile) {
          console.log("Appending video as File");
          formData.append("video", video as File);
        } else if (typeof video === "string") {
          console.log("Appending video as string");
          formData.append("video", video);
        } else {
          console.warn(
            "Video is not a File or string but:",
            Object.prototype.toString.call(video)
          );
          try {
            if (video && typeof video === "object") {
              const objKeys = Object.keys(video);
              console.log("Video object keys:", objKeys);

              if (
                objKeys.includes("name") &&
                objKeys.includes("type") &&
                objKeys.includes("size")
              ) {
                console.log("Object looks like a File, forcing cast to File");
                formData.append("video", video as unknown as File);
              } else {
                console.log("Falling back to stringify");
                formData.append("video", JSON.stringify(video));
              }
            } else {
              formData.append("video", String(video));
            }
          } catch (e) {
            console.error("Error handling video object:", e);
            formData.append("video", String(video));
          }
        }
      }

      if (duration) {
        formData.append("duration", duration.toString());
      }

      if (fps) {
        formData.append("fps", fps.toString());
      }

      if (shouldOptimize !== undefined) {
        formData.append("shouldOptimize", shouldOptimize.toString());
      }

      requestBody = formData;
    } else {
      requestBody = {
        prompt,
        image,
        end_image: endImage,
        video,
        duration,
        fps,
        shouldOptimize,
        models: modelsToUse,
      };
    }

    const res = await ky.post("/api/gen-video", {
      timeout: 300000, // 5 minutes timeout
      [hasFiles ? "body" : "json"]: requestBody,
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const responseData: any = await res.json();

    if (responseData.error) {
      const uiLanguage = store.get(languageAtom);
      if (uiLanguage) {
        const countryCode = langToCountry(uiLanguage);
        const messageKey =
          countryCode === "en" ? "message" : `message_${countryCode}`;
        const message = responseData.error[messageKey];
        emitter.emit("ToastError", {
          code: responseData.error.err_code,
          message,
        });
      }
      throw new Error(responseData.error.message || "Failed to generate video");
    }

    return responseData as GenerateVideoResult;
  } catch (error) {
    if (error instanceof Error) {
      const uiLanguage = store.get(languageAtom);

      if (error instanceof HTTPError) {
        try {
          const errorData = await error.response.json();
          if (errorData.error && uiLanguage) {
            const countryCode = langToCountry(uiLanguage);
            const messageKey =
              countryCode === "en" ? "message" : `message_${countryCode}`;
            const message = errorData.error[messageKey];
            emitter.emit("ToastError", {
              code: errorData.error.err_code,
              message,
            });
          }
        } catch {
          emitter.emit("ToastError", {
            code: error.response.status,
            message: error.message,
          });
        }
      } else {
        emitter.emit("ToastError", {
          code: 500,
          message: error.message,
        });
      }
    }
    throw error; // Re-throw the error for the caller to handle if needed
  }
};

export const fetchVideo = async (
  taskId: string,
  apiKey: string
): Promise<FetchVideoResult> => {
  try {
    const res = await ky.get(`/api/fetch-video/${taskId}`, {
      timeout: 30000, // 30 seconds timeout
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    return res.json<FetchVideoResult>();
  } catch (error) {
    if (error instanceof Error) {
      const uiLanguage = store.get(languageAtom);

      if (error instanceof HTTPError) {
        try {
          const errorData = await error.response.json();
          if (errorData && errorData.error) {
            return {
              url: "",
              status: "fail",
              data: errorData,
              error: errorData.error,
            };
          }
        } catch {}
      } else {
      }
    }
    throw error; // Re-throw the error for the caller to handle if needed
  }
};

export const getModelInputType = (modelId: string): ModelType => {
  if (modelId.includes("t2v")) {
    return "T2V";
  } else if (modelId.includes("i2v")) {
    return "I2V";
  } else if (modelId.includes("v2v")) {
    return "V2V";
  }

  return "T2V";
};

export const pollVideoStatus = async (
  taskId: string,
  apiKey: string,
  onStatusUpdate?: (status: string) => void,
  maxAttempts = 60, // Default to 60 attempts
  initialInterval = 3000, // Start with 3 seconds between checks
  maxInterval = 30000 // Maximum interval of 30 seconds
): Promise<FetchVideoResult> => {
  let attempts = 0;
  let errorShown = false; // 用于跟踪是否已显示错误
  let currentInterval = initialInterval;

  const getLocalizedErrorMessage = (
    error: any,
    countryCode: string
  ): string => {
    if (!error || !error.message) return "Unknown error";

    if (countryCode === "en") {
      return error.message_en || error.message;
    } else if (countryCode === "cn") {
      return error.message_cn || error.message;
    } else if (countryCode === "ja") {
      return error.message_ja || error.message;
    }

    return error.message;
  };

  const poll = async (): Promise<FetchVideoResult> => {
    attempts++;

    try {
      const result = await fetchVideo(taskId, apiKey);

      if (result.error) {
        if (onStatusUpdate) {
          onStatusUpdate("fail");
        }

        if (!errorShown) {
          errorShown = true;
          const uiLanguage = store.get(languageAtom);
          if (uiLanguage && result.error) {
            const countryCode = langToCountry(uiLanguage);
            const message = getLocalizedErrorMessage(result.error, countryCode);

            emitter.emit("ToastError", {
              code: result.error.err_code || 500,
              message,
            });
          }
        }

        return {
          url: "",
          status: "fail",
          data: result,
          error: result.error,
        };
      }

      if (result.data && result.data.error) {
        if (onStatusUpdate) {
          onStatusUpdate("fail");
        }

        if (!errorShown) {
          errorShown = true;
          const uiLanguage = store.get(languageAtom);
          if (uiLanguage && result.data.error) {
            const countryCode = langToCountry(uiLanguage);
            const message = getLocalizedErrorMessage(
              result.data.error,
              countryCode
            );

            emitter.emit("ToastError", {
              code: result.data.error.err_code || 500,
              message,
            });
          }
        }

        return {
          url: "",
          status: "fail",
          data: result.data,
        };
      }

      if (onStatusUpdate) {
        onStatusUpdate(result.status);
      }

      if (result.status === "success" || result.status === "fail") {
        return result;
      }

      if (attempts >= maxAttempts) {
        if (!errorShown) {
          errorShown = true;
          emitter.emit("ToastError", {
            code: 408,
            message: "Maximum polling attempts reached",
          });
        }
        throw new Error("Maximum polling attempts reached");
      }

      currentInterval = Math.min(currentInterval * 1.5, maxInterval);

      await new Promise((resolve) => setTimeout(resolve, currentInterval));

      return poll();
    } catch (error) {
      if (error instanceof Error && "response" in error) {
        try {
          const errorResponse = await (error as any).response.json();

          if (errorResponse && errorResponse.error) {
            if (onStatusUpdate) {
              onStatusUpdate("fail");
            }

            if (!errorShown) {
              errorShown = true;
              const uiLanguage = store.get(languageAtom);
              if (uiLanguage && errorResponse.error) {
                const countryCode = langToCountry(uiLanguage);
                const message = getLocalizedErrorMessage(
                  errorResponse.error,
                  countryCode
                );

                emitter.emit("ToastError", {
                  code: errorResponse.error.err_code || 500,
                  message,
                });
              }
            }

            return {
              url: "",
              status: "fail",
              data: errorResponse,
            };
          }
        } catch (parseError) {
          if (onStatusUpdate) {
            onStatusUpdate("fail");
          }

          if (!errorShown) {
            errorShown = true;
            emitter.emit("ToastError", {
              code: 500,
              message: "Failed to parse error response",
            });
          }

          return {
            url: "",
            status: "fail",
            data: { error: { message: "Failed to parse error response" } },
          };
        }
      }

      if (onStatusUpdate) {
        onStatusUpdate("fail");
      }

      if (!errorShown) {
        errorShown = true;
        emitter.emit("ToastError", {
          code: 500,
          message:
            error instanceof Error
              ? error.message
              : "Unknown error during polling",
        });
      }

      return {
        url: "",
        status: "fail",
        data: {
          error: {
            message:
              error instanceof Error
                ? error.message
                : "Unknown error during polling",
          },
        },
      };
    }
  };

  return poll();
};
