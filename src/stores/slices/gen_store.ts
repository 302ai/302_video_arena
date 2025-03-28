import { atom } from "jotai";

type GenState = {
  isGenerating: boolean;
  elapsedTime: number;
};

export const genStateAtom = atom<GenState>({
  isGenerating: false,
  elapsedTime: 0,
});
