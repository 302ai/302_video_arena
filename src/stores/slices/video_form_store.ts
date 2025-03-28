import { atomWithStorage, createJSONStorage } from "jotai/utils";

export type VideoInputType = "text" | "image" | "video";

export type VideoGenForm = {
  prompt: string;
  model: string;
  duration: number;
  fps: number;
  isOptimized: boolean;
  inputType: VideoInputType;
  imageFile?: File | null;
  endImageFile?: File | null;
  videoFile?: File | null;
  imageUrl?: string;
  endImageUrl?: string;
  videoUrl?: string;
  taskId?: string;
};

export const videoGenFormAtom = atomWithStorage<VideoGenForm>(
  "videoGenForm",
  {
    prompt: "",
    model: "runway_gen3_t2v", // Default to a text-to-video model
    duration: 5, // Default duration in seconds
    fps: 24, // Default fps
    isOptimized: true,
    inputType: "text", // Default to text input
    imageFile: null,
    endImageFile: null,
    videoFile: null,
    imageUrl: "",
    endImageUrl: "",
    videoUrl: "",
  },
  createJSONStorage(() =>
    typeof window !== "undefined"
      ? sessionStorage
      : {
          getItem: () => null,
          setItem: () => null,
          removeItem: () => null,
        }
  ),
  {
    getOnInit: true,
  }
);

export type VideoGenState = {
  isGenerating: boolean;
  elapsedTime: number;
  currentStatus: "idle" | "generating" | "polling" | "success" | "failed";
  videoUrl: string;
  taskId: string;
};

export const videoGenStateAtom = atomWithStorage<VideoGenState>(
  "videoGenState",
  {
    isGenerating: false,
    elapsedTime: 0,
    currentStatus: "idle",
    videoUrl: "",
    taskId: "",
  },
  createJSONStorage(() =>
    typeof window !== "undefined"
      ? sessionStorage
      : {
          getItem: () => null,
          setItem: () => null,
          removeItem: () => null,
        }
  ),
  {
    getOnInit: true,
  }
);
