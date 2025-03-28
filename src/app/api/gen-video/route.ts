import { APICallError, generateText } from "ai";
import { createAI302 } from "@302ai/ai-sdk";
import prompts from "@/constants/prompts";
import { env } from "@/env";
import { createScopedLogger } from "@/utils";
import { NextRequest } from "next/server";

const logger = createScopedLogger("gen-video");

const ERROR_MESSAGES = {
  API_KEY_REQUIRED: {
    message: "API key is required",
    message_cn: "需要API密钥",
    message_en: "API key is required",
    message_ja: "APIキーが必要です",
    type: "AUTHORIZATION_ERROR",
  },
  VIDEO_GENERATION_FAILED: {
    message: "Failed to generate video",
    message_cn: "生成视频失败",
    message_en: "Failed to generate video",
    message_ja: "動画の生成に失敗しました",
    type: "VIDEO_GENERATION_ERROR",
  },
};

interface VideoGenerationRequest {
  prompt?: string;
  image?: string | File;
  end_image?: string | File;
  video?: string | File;
  shouldOptimize?: boolean;
  duration?: number;
  fps?: number;
  models: string[]; // 模型数组
  model?: string; // 保留向后兼容
}

/**
 * Create error response with consistent format
 */
function createErrorResponse(status: number, errorData: any) {
  const baseError = ERROR_MESSAGES.VIDEO_GENERATION_FAILED;
  logger.error(errorData, typeof errorData);

  return Response.json(
    {
      error: {
        err_code: status,
        message: errorData?.error?.message || baseError.message,
        message_cn: errorData?.error?.message_cn || baseError.message_cn,
        message_en: errorData?.error?.message_en || baseError.message_en,
        message_ja: errorData?.error?.message_ja || baseError.message_ja,
        type: baseError.type,
      },
    },
    { status }
  );
}

/**
 * Process request data from either FormData or JSON
 */
async function processRequestData(request: NextRequest): Promise<{
  requestData: VideoGenerationRequest;
  originalFormData: FormData | null;
  contentType: string;
}> {
  const contentType = request.headers.get("content-type") || "";
  let requestData: VideoGenerationRequest;
  let originalFormData: FormData | null = null;

  if (contentType.includes("multipart/form-data")) {
    originalFormData = await request.formData();
    const formDataObject = Object.fromEntries(
      originalFormData.entries()
    ) as any;

    if (formDataObject.models && typeof formDataObject.models === "string") {
      try {
        formDataObject.models = JSON.parse(formDataObject.models);
      } catch (e) {
        formDataObject.models = [formDataObject.models];
      }
    } else if (formDataObject.model && !formDataObject.models) {
      formDataObject.models = [formDataObject.model];
    } else if (!formDataObject.models) {
      formDataObject.models = [];
    }

    if (formDataObject.duration) {
      formDataObject.duration = parseInt(String(formDataObject.duration), 10);
    }
    if (formDataObject.fps) {
      formDataObject.fps = parseInt(String(formDataObject.fps), 10);
    }

    requestData = formDataObject;
  } else {
    const jsonData = await request.json();

    if (jsonData.model && !jsonData.models) {
      jsonData.models = Array.isArray(jsonData.model)
        ? jsonData.model
        : [jsonData.model];
    } else if (!jsonData.models) {
      jsonData.models = [];
    }

    requestData = jsonData;
  }

  return { requestData, originalFormData, contentType };
}

/**
 * Optimize prompt using AI if requested
 */
async function optimizePrompt(prompt: string, apiKey: string): Promise<string> {
  try {
    const ai302 = createAI302({
      apiKey,
      baseURL: env.NEXT_PUBLIC_API_URL,
    });

    const { text } = await generateText({
      model: ai302.chatModel("gpt-4o"),
      prompt: prompts.optimizeVideo.compile({ input: prompt }),
    });
    return text;
  } catch (error) {
    logger.error("Failed to optimize prompt:", error);

    return prompt;
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization") || "";
    const apiKey = authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : "";

    if (!apiKey) {
      return Response.json(
        { error: { ...ERROR_MESSAGES.API_KEY_REQUIRED, err_code: 401 } },
        { status: 401 }
      );
    }

    const { requestData, originalFormData, contentType } =
      await processRequestData(request);
    const {
      prompt,
      image,
      end_image,
      video,
      shouldOptimize,
      duration,
      fps,
      models,
    } = requestData;

    if (!models || models.length === 0) {
      return createErrorResponse(400, {
        message: "At least one model is required",
      });
    }

    const optimizedPrompt =
      prompt && shouldOptimize ? await optimizePrompt(prompt, apiKey) : prompt;

    const generationPromises = models.map(async (model) => {
      try {
        if (contentType.includes("multipart/form-data") && originalFormData) {
          const newFormData = new FormData();

          if (optimizedPrompt) {
            newFormData.append("prompt", optimizedPrompt);
          }

          newFormData.append("model", model); // 使用单个模型
          if (duration) newFormData.append("duration", duration.toString());
          if (fps) newFormData.append("fps", fps.toString());

          for (const field of ["image", "end_image", "video"]) {
            if (originalFormData.has(field)) {
              newFormData.append(field, originalFormData.get(field) as Blob);
            }
          }

          const response = await fetch(
            `${env.NEXT_PUBLIC_API_URL}/302/video/create`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${apiKey}`,
              },
              body: newFormData,
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            return { model, error: errorData, status: response.status };
          }

          return {
            model,
            data: await response.json(),
            status: response.status,
          };
        } else {
          const requestBody: Record<string, any> = { model };

          if (optimizedPrompt) requestBody.prompt = optimizedPrompt;
          if (image) requestBody.image = image;
          if (end_image) requestBody.end_image = end_image;
          if (video) requestBody.video = video;
          if (duration) requestBody.duration = duration;
          if (fps) requestBody.fps = fps;

          const response = await fetch(
            `${env.NEXT_PUBLIC_API_URL}/302/video/create`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(requestBody),
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            return { model, error: errorData, status: response.status };
          }

          return {
            model,
            data: await response.json(),
            status: response.status,
          };
        }
      } catch (error) {
        logger.error(`Error generating video with model ${model}:`, error);
        return {
          model,
          error:
            error instanceof Error
              ? { message: error.message }
              : { message: "Unknown error" },
          status: 500,
        };
      }
    });

    const results = await Promise.all(generationPromises);

    const successResults = results.filter((result) => !result.error);
    const failedResults = results.filter((result) => result.error);

    logger.info(
      `Video generation tasks created: ${successResults.length} succeeded, ${failedResults.length} failed`
    );

    if (successResults.length === 0 && failedResults.length > 0) {
      return createErrorResponse(
        failedResults[0].status,
        failedResults[0].error
      );
    }

    return Response.json({
      tasks: successResults.map((result) => ({
        task_id: result.data.task_id,
        model: result.model,
        data: result.data,
      })),
      failed:
        failedResults.length > 0
          ? failedResults.map((result) => ({
              model: result.model,
              error: result.error,
            }))
          : undefined,
    });
  } catch (error) {
    logger.error(error);

    if (error instanceof APICallError) {
      return Response.json(error.responseBody, { status: 500 });
    }

    let errorStatus = 500;
    let errorMessage = ERROR_MESSAGES.VIDEO_GENERATION_FAILED.message;

    if (error instanceof Error) {
      errorMessage = error.message;
      if ("code" in error && typeof (error as any).code === "number") {
        errorStatus = (error as any).code;
      }
    }

    return createErrorResponse(errorStatus, { message: errorMessage });
  }
}
