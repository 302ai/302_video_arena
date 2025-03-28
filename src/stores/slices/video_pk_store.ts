import { getRandomVideoModel } from "@/constants/video-models";
import { atomWithStorage, createJSONStorage } from "jotai/utils";

export interface VideoPkState {
  historyId: string | null;
  isGenerating: boolean;
  elapsedTime: {
    left: number;
    right: number;
  };
  currentStatus: "idle" | "generating" | "polling" | "success" | "failed";
}

export const videoPkStateAtom = atomWithStorage<VideoPkState>(
  "videoPkState",
  {
    historyId: null,
    isGenerating: false,
    elapsedTime: {
      left: 0,
      right: 0,
    },
    currentStatus: "idle",
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

type VideoPKForm = {
  prompt: string;
  duration: number;
  fps: number;
  isOptimized: boolean;
  leftModel: string;
  leftDisplay: string;
  rightModel: string;
  rightDisplay: string;
};

export const videoPKFormAtom = atomWithStorage<VideoPKForm>(
  "videoPKForm",
  (() => {
    const leftModel = getRandomVideoModel("T2V");
    return {
      prompt: "",
      duration: 5,
      fps: 24,
      isOptimized: true,
      leftModel: leftModel,
      leftDisplay: "random",
      rightModel: getRandomVideoModel("T2V"),
      rightDisplay: "random",
    };
  })(),
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
