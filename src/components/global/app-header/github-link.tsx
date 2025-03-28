import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";

interface Props {
  className?: string;
}

export function GithubLink({ className }: Props) {
  const t = useTranslations();

  return (
    <Button
      aria-label={t("global.header.github_link.label")}
      variant="icon"
      size="roundIconSm"
      className={cn(className)}
      asChild
    >
      <a
        href="https://github.com/302ai/302_video_arena"
        target="_blank"
        rel="noopener noreferrer"
      >
        <GitHubLogoIcon className="size-4" />
      </a>
    </Button>
  );
}
