import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SwitchWithLabels } from "@/components/ui/switch/switch-with-label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Loader2, Shuffle, Wand2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAtom } from "jotai";
import { videoPkStateAtom } from "@/stores/slices/video_pk_store";
import { languageAtom, store } from "@/stores";
import { videoPKFormAtom } from "@/stores/slices/video_pk_store";
import { usePrompts } from "@/hooks/swr/use-prompts";

interface ModelPkTopProps {
  className?: string;
  onGenerate: () => Promise<void>;
}

export default function ModelPkTop({ className, onGenerate }: ModelPkTopProps) {
  const t = useTranslations("modelPk");
  const [pkState] = useAtom(videoPkStateAtom);
  const [pkForm, setPkForm] = useAtom(videoPKFormAtom);
  const { prompts, refresh } = usePrompts(1);

  const handleRandomPrompt = () => {
    if (prompts.length > 0) {
      const prompt = prompts[0];
      setPkForm((prev) => ({
        ...prev,
        prompt: prompt[store.get(languageAtom) as keyof typeof prompt],
      }));
    }
    refresh();
  };

  const calculateRemainingTime = () => {
    const baseTime = 10; // 基础处理时间（秒）
    const durationFactor = pkForm.duration / 5; // 时长因子
    const fpsFactor = pkForm.fps / 24; // 帧率因子

    return Math.round(baseTime * durationFactor * fpsFactor);
  };

  return (
    <div className="@container">
      <div
        className={cn(
          "flex size-full min-h-[200px] flex-col overflow-hidden rounded-lg border focus-within:border-transparent focus-within:ring-1 focus-within:ring-violet-500 @[600px]:flex-row dark:focus-within:ring-violet-500",
          className
        )}
      >
        <div className="relative min-h-[200px] flex-1 @[600px]:min-h-0">
          <Textarea
            id="model-pk-top"
            value={pkForm.prompt}
            onChange={(e) =>
              setPkForm((prev) => ({ ...prev, prompt: e.target.value }))
            }
            className="absolute inset-0 border-none pr-10 shadow-none [resize:none] focus-visible:ring-0"
            placeholder={t("promptPlaceholder")}
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute bottom-2 right-2 h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={handleRandomPrompt}
          >
            <Shuffle className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-col gap-4 border-t p-4 @[600px]:w-[200px] @[600px]:border-l @[600px]:border-t-0">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">{t("duration")}</Label>
              <div className="text-sm font-medium">{pkForm.duration}s</div>
            </div>
            <Slider
              value={[pkForm.duration]}
              min={1}
              max={15}
              step={1}
              onValueChange={(values) =>
                setPkForm((prev) => ({ ...prev, duration: values[0] }))
              }
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">{t("fps")}</Label>
              <div className="text-sm font-medium">{pkForm.fps} FPS</div>
            </div>
            <Slider
              value={[pkForm.fps]}
              min={12}
              max={30}
              step={6}
              onValueChange={(values) =>
                setPkForm((prev) => ({ ...prev, fps: values[0] }))
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="model-pk-top" className="text-sm">
              {t("optimize")}
            </Label>
            <SwitchWithLabels
              checked={pkForm.isOptimized}
              onCheckedChange={(isOptimized) =>
                setPkForm((prev) => ({ ...prev, isOptimized }))
              }
              onLabel={t("yes")}
              offLabel={t("no")}
            />
          </div>
          <Button
            onClick={onGenerate}
            className="mt-auto w-full gap-2"
            disabled={pkState.isGenerating}
            size="lg"
          >
            {pkState.isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {pkState.currentStatus && pkState.currentStatus !== "generating"
                  ? t("processing")
                  : t("generating")}{" "}
                {pkState.elapsedTime.left}s
              </>
            ) : (
              <>
                <Wand2 className="h-5 w-5" />
                {t("generate")}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
