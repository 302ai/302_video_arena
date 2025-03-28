import { atomWithStorage, createJSONStorage } from "jotai/utils";

type UiStore = {
  activeTab: string;
};

export const uiStoreAtom = atomWithStorage<UiStore>(
  "uiStore",
  {
    activeTab: "model-pk",
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
