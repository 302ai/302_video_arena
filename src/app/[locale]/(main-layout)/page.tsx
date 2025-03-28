"use client";

import { Suspense, lazy, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createScopedLogger } from "@/utils/logger";
import { useAtom } from "jotai";
import { uiStoreAtom } from "@/stores/slices/ui_store";
import { useTranslations } from "next-intl";

const logger = createScopedLogger("Home");

const ModelPk = lazy(() => import("@/components/panel/model-pk"));
const ModelGen = lazy(() => import("@/components/panel/model-gen"));
const LeaderBoard = lazy(() => import("@/components/panel/leader-board"));
const History = lazy(() => import("@/components/panel/history"));

export default function Home() {
  const t = useTranslations("tabs");

  useEffect(() => {
    logger.info("Hello, Welcome to 302.AI");
  }, []);

  const [uiStore, setUiStore] = useAtom(uiStoreAtom);

  return (
    <div className="grid flex-1">
      <div className="container mx-auto h-full max-w-[1280px] px-2">
        <Tabs
          defaultValue={uiStore.activeTab}
          value={uiStore.activeTab}
          onValueChange={(value) =>
            setUiStore((prev) => ({ ...prev, activeTab: value }))
          }
          className="flex size-full flex-col"
        >
          <TabsList className="h-auto w-fit rounded-none border-b border-border bg-transparent p-0">
            <TabsTrigger
              value="model-pk"
              className="relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
            >
              {t("modelPk")}
            </TabsTrigger>
            <TabsTrigger
              value="model-gen"
              className="relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
            >
              {t("modelGen")}
            </TabsTrigger>
            <TabsTrigger
              value="leader-board"
              className="relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
            >
              {t("leaderBoard")}
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
            >
              {t("history")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="model-pk" className="flex-1">
            <Suspense
              fallback={<div className="p-4 text-center">{t("loading")}</div>}
            >
              <ModelPk />
            </Suspense>
          </TabsContent>
          <TabsContent value="model-gen">
            <Suspense
              fallback={<div className="p-4 text-center">{t("loading")}</div>}
            >
              <ModelGen />
            </Suspense>
          </TabsContent>
          <TabsContent value="leader-board">
            <Suspense
              fallback={<div className="p-4 text-center">{t("loading")}</div>}
            >
              <LeaderBoard />
            </Suspense>
          </TabsContent>
          <TabsContent value="history">
            <Suspense
              fallback={<div className="p-4 text-center">{t("loading")}</div>}
            >
              <History />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
