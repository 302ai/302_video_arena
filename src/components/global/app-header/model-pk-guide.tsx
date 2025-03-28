import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HelpCircle } from "lucide-react";
import { useTranslations } from "next-intl";

function GuideSection({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      {title && (
        <h3 className="text-base font-medium text-purple-500/90">{title}</h3>
      )}
      <div className="space-y-1.5 text-sm text-muted-foreground">
        {children}
      </div>
    </div>
  );
}

export function ModelPkGuide() {
  const t = useTranslations("global.model_pk_guide");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          aria-label={t("trigger.label")}
          variant="icon"
          size="roundIconSm"
          className="hover:bg-purple-500/10"
        >
          <HelpCircle className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader className="space-y-4 pb-4">
          <DialogTitle className="text-xl font-medium text-purple-500">
            {t("title")}
          </DialogTitle>
          <div className="space-y-2">
            <p className="text-sm">{t("description")}</p>
            <p className="text-xs font-medium text-destructive">
              {t("warning")}
            </p>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <GuideSection>
            <p>{t("voting.description")}</p>
            <p>{t("voting.ranking")}</p>
          </GuideSection>

          <GuideSection title={t("image_generation.title")}>
            <p>{t("image_generation.description")}</p>
          </GuideSection>

          <GuideSection title={t("prompt_optimization.title")}>
            <p>{t("prompt_optimization.description")}</p>
            <p>{t("prompt_optimization.translation")}</p>
          </GuideSection>
        </div>
      </DialogContent>
    </Dialog>
  );
}
