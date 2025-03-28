"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useId } from "react";
import { useState } from "react";

interface SwitchWithLabelsProps {
  initialChecked?: boolean;
  onLabel?: string;
  offLabel?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export function SwitchWithLabels({
  initialChecked = true,
  onLabel = "On",
  offLabel = "Off",
  checked: controlledChecked,
  onCheckedChange,
}: SwitchWithLabelsProps) {
  const id = useId();
  const [internalChecked, setInternalChecked] =
    useState<boolean>(initialChecked);

  const checked = controlledChecked ?? internalChecked;

  const handleCheckedChange = (value: boolean) => {
    setInternalChecked(value);
    onCheckedChange?.(value);
  };

  return (
    <div>
      <div className="relative inline-grid h-9 grid-cols-[1fr_1fr] items-center text-sm font-medium">
        <Switch
          id={id}
          checked={checked}
          onCheckedChange={handleCheckedChange}
          className="peer absolute inset-0 h-[inherit] w-auto rounded-lg data-[state=checked]:bg-violet-600 data-[state=unchecked]:bg-muted dark:data-[state=checked]:bg-violet-500 [&_span]:z-10 [&_span]:h-full [&_span]:w-1/2 [&_span]:rounded-md [&_span]:transition-transform [&_span]:duration-300 [&_span]:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] data-[state=checked]:[&_span]:translate-x-full rtl:data-[state=checked]:[&_span]:-translate-x-full"
        />
        {/* OFF Label */}
        <span className="min-w-78 pointer-events-none relative ms-0.5 flex items-center justify-center px-2 text-center text-muted-foreground transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:invisible peer-data-[state=unchecked]:translate-x-full rtl:peer-data-[state=unchecked]:-translate-x-full">
          <span className="text-[10px] font-medium uppercase">{offLabel}</span>
        </span>
        {/* ON Label */}
        <span className="min-w-78 pointer-events-none relative me-0.5 flex items-center justify-center px-2 text-center transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] peer-data-[state=unchecked]:invisible peer-data-[state=checked]:-translate-x-full peer-data-[state=checked]:text-white rtl:peer-data-[state=checked]:translate-x-full">
          <span className="text-[10px] font-medium uppercase">{onLabel}</span>
        </span>
      </div>

      <Label htmlFor={id} className="sr-only">
        Labeled switch
      </Label>
    </div>
  );
}
