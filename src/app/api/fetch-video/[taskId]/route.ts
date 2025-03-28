import { env } from "@/env";
import { createScopedLogger } from "@/utils";
import { NextRequest } from "next/server";

const logger = createScopedLogger("fetch-video");

export async function GET(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const { taskId } = params;
    const authHeader = request.headers.get("Authorization");

    if (!taskId) {
      return Response.json(
        {
          error: {
            err_code: 400,
            message: "Task ID is required",
            message_cn: "需要任务ID",
            message_en: "Task ID is required",
            message_ja: "タスクIDが必要です",
            type: "MISSING_TASK_ID",
          },
        },
        { status: 400 }
      );
    }

    logger.info(`Fetching video status for task: ${taskId}`);

    // Make request to 302.ai video fetch API
    const response = await fetch(
      `https://api.302.ai/302/video/fetch/${taskId}`,
      {
        method: "GET",
        headers: {
          Authorization: authHeader || `Bearer ${env.NEXT_PUBLIC_302_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      logger.error("302.ai API error:", errorData);
      return Response.json(
        {
          error: {
            err_code: response.status,
            message: errorData.message || "Failed to fetch video status",
            message_cn: "获取视频状态失败",
            message_en: "Failed to fetch video status",
            message_ja: "動画のステータス取得に失敗しました",
            type: "VIDEO_FETCH_ERROR",
          },
        },
        { status: response.status }
      );
    }

    const result = await response.json();
    logger.info("Video fetch result:", result);

    // Normalize the status to ensure consistent values
    let normalizedStatus = result.status?.toLowerCase() || "processing";

    // Map 302.ai status values to our application's status values
    if (normalizedStatus === "completed" || normalizedStatus === "success") {
      normalizedStatus = "success";
    } else if (normalizedStatus === "failed" || normalizedStatus === "fail") {
      normalizedStatus = "fail";
    } else if (normalizedStatus === "queued" || normalizedStatus === "queue") {
      normalizedStatus = "queue";
    } else {
      normalizedStatus = "processing";
    }

    return Response.json({
      url: result.url || result.data?.video?.url || "",
      status: normalizedStatus,
      data: result.data || result,
    });
  } catch (error) {
    logger.error(error);

    // Handle different types of errors
    let errorMessage = "Failed to fetch video status";
    let errorCode = 500;

    if (error instanceof Error) {
      errorMessage = error.message;
      // You can add specific error code mapping here if needed
      if ("code" in error && typeof (error as any).code === "number") {
        errorCode = (error as any).code;
      }
    }

    return Response.json(
      {
        error: {
          err_code: errorCode,
          message: errorMessage,
          message_cn: "获取视频状态失败",
          message_en: "Failed to fetch video status",
          message_ja: "動画のステータス取得に失敗しました",
          type: "VIDEO_FETCH_ERROR",
        },
      },
      { status: errorCode }
    );
  }
}
