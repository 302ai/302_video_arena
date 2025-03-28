"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Shuffle, ChevronDown, Check } from "lucide-react";
import { createScopedLogger } from "@/utils";
import { useState } from "react";
import {
  VIDEO_MODEL_LIST,
  getRandomVideoModel,
  type VideoModelInfo,
  ModelType,
} from "@/constants/video-models";
import { useTranslations } from "next-intl";

const logger = createScopedLogger("video-model-selector");

const groupedVideoModels = VIDEO_MODEL_LIST.reduce(
  (acc, model) => {
    if (!acc[model.group]) {
      acc[model.group] = [];
    }
    acc[model.group].push(model);
    return acc;
  },
  {} as Record<string, VideoModelInfo[]>
);

interface VideoModelSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
  modelType?: ModelType;
  isDisabled?: boolean;
}

export function VideoModelSelector({
  value,
  onChange,
  className,
  placeholder,
  modelType = "T2V",
  isDisabled = false,
}: VideoModelSelectorProps) {
  const t = useTranslations("common");
  const [open, setOpen] = useState(false);
  const [internalRandomModel, setInternalRandomModel] = useState<string>();

  const filteredGroups: Record<string, VideoModelInfo[]> = {};
  Object.entries(groupedVideoModels).forEach(([group, models]) => {
    const filteredModels = models.filter((model) =>
      model.type.includes(modelType)
    );
    if (filteredModels.length > 0) {
      filteredGroups[group] = filteredModels;
    }
  });

  const handleSelect = (newValue: string) => {
    if (newValue === "random") {
      const randomModel = getRandomVideoModel(modelType);
      setInternalRandomModel(randomModel);
      onChange?.("random");
    } else {
      setInternalRandomModel(undefined);
      onChange?.(newValue);
    }
    setOpen(false);
  };

  const getDisplayValue = () => {
    if (value === "random") {
      return (
        <span className="flex items-center gap-2">
          <Shuffle className="h-4 w-4 shrink-0" />
          <span>{t("random")}</span>
        </span>
      );
    }

    if (value) {
      const model = VIDEO_MODEL_LIST.find((m) => m.id === value);
      if (model) {
        const Icon = model.icon;
        return (
          <span className="flex items-center gap-2">
            <Icon className="h-4 w-4 shrink-0" />
            <span>{model.name}</span>
          </span>
        );
      }
    }

    return (
      <span className="text-muted-foreground">
        {placeholder ?? t("selectModel")}
      </span>
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={isDisabled}
          className={cn(
            "w-full justify-between bg-background px-3 font-normal",
            className
          )}
        >
          {getDisplayValue()}
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-[var(--radix-popper-anchor-width)] p-0">
        <Command loop shouldFilter={true} defaultValue="" value={value}>
          <CommandInput placeholder={t("searchModels")} />
          <CommandList>
            <CommandEmpty>{t("noModelFound")}</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="random"
                onSelect={() => handleSelect("random")}
                className={cn(
                  "relative flex items-center gap-2",
                  value === "random" && "bg-accent"
                )}
              >
                <Shuffle className="h-4 w-4 shrink-0" />
                <span>{t("random")}</span>
                {value === "random" && (
                  <Check className="absolute right-2 h-4 w-4" />
                )}
              </CommandItem>
            </CommandGroup>
            {Object.entries(filteredGroups).map(([group, groupModels]) => {
              const GroupIcon = groupModels[0].icon;
              return (
                <CommandGroup
                  key={group}
                  heading={
                    <span className="flex items-center gap-2">
                      <GroupIcon className="h-4 w-4" />
                      {group}
                    </span>
                  }
                >
                  {groupModels.map((model) => (
                    <CommandItem
                      key={model.id}
                      value={model.id}
                      onSelect={() => handleSelect(model.id)}
                      className={cn(
                        "relative pl-8",
                        value === model.id && "bg-accent"
                      )}
                    >
                      <div className="flex flex-1 items-center gap-2">
                        <div
                          className={cn(
                            "flex h-4 w-4 items-center justify-center rounded border",
                            value === model.id
                              ? "border-primary bg-primary"
                              : "border-muted-foreground"
                          )}
                        >
                          {value === model.id && (
                            <Check className="h-3 w-3 text-primary-foreground" />
                          )}
                        </div>
                        <span>{model.name}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
