export type History = {
  id: string;
  rawPrompt: string;
  taskId: string;
  shouldOptimize: boolean;
  duration: number;
  fps?: number;
  videos: {
    url: string;
    prompt: string;
    model: string;
    status: "pending" | "processing" | "success" | "failed";
  }[];
  inputType: "text" | "image" | "video";
  inputUrl?: string; // URL for input image or video if applicable
  endImageUrl?: string; // URL for end image if applicable
  type: "gen" | "pk";
  createdAt: number;
};

export type AddHistory = Omit<History, "id" | "createdAt">;
