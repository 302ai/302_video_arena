import { useState, useCallback, useEffect } from "react";
import { ImagePrompt } from "@/constants/image-prompts";
import ky from "ky";

interface PromptsResponse {
  data: ImagePrompt[] | null;
  error: {
    message: string;
    message_cn: string;
    message_en: string;
    message_ja: string;
    type: string;
  } | null;
}

export function usePrompts(count: number = 1) {
  const [prompts, setPrompts] = useState<ImagePrompt[]>([]);
  const [error, setError] = useState<PromptsResponse["error"]>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPrompts = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await ky
        .get(`api/prompts?count=${count}`)
        .json<PromptsResponse>();
      setPrompts(response.data || []);
      setError(null);
    } catch (err) {
      setPrompts([]);
      setError({
        message: "Failed to get prompts",
        message_cn: "获取提示词失败",
        message_en: "Failed to get prompts",
        message_ja: "プロンプトの取得に失敗しました",
        type: "PROMPT_FETCH_ERROR",
      });
    } finally {
      setIsLoading(false);
    }
  }, [count]);

  useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  return {
    prompts,
    error,
    isLoading,
    refresh: fetchPrompts,
  };
}
