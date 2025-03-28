"use client";
import { cn } from "@/lib/utils";
import { isOutsideDeployMode } from "@/utils/302";
import { isAuthPath } from "@/utils/path";
import { usePathname } from "next/navigation";
import { forwardRef } from "react";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeSwitcher } from "./theme-switcher";
import { ToolInfo } from "./tool-info";
import ChatToggler from "./chat-toggler";
import { ModelPkGuide } from "./model-pk-guide";
import { GithubLink } from "./github-link";

type HeaderProps = {
  className?: string;
};

const Header = forwardRef<HTMLDivElement, HeaderProps>(({ className }, ref) => {
  const pathname = usePathname();
  return (
    <header className={cn("fixed right-0 top-0 z-50", className)}>
      <div
        ref={ref}
        className={cn("flex items-center justify-end gap-2 p-2", className)}
      >
        {!isAuthPath(pathname) && !isOutsideDeployMode() && <ToolInfo />}
        <ModelPkGuide />
        <ChatToggler />
        <GithubLink />
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>
    </header>
  );
});

Header.displayName = "AppHeader";

export default Header;
