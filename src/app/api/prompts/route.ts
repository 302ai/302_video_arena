import { ImagePrompt, getRandomPrompts } from "@/constants/image-prompts";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const count = parseInt(searchParams.get("count") || "1", 10);

    const prompts = getRandomPrompts(count);

    return Response.json({
      data: prompts,
      error: null,
    });
  } catch (error) {
    return Response.json(
      {
        data: null,
        error: {
          message: "Failed to get prompts",
          message_cn: "获取提示词失败",
          message_en: "Failed to get prompts",
          message_ja: "プロンプトの取得に失敗しました",
          type: "PROMPT_FETCH_ERROR",
        },
      },
      { status: 500 }
    );
  }
}
