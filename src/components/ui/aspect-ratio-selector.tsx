import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useId } from "react";

export interface AspectRatio {
  width: number;
  height: number;
  label?: string;
}

interface AspectRatioSelectorProps {
  ratios: AspectRatio[];
  value?: AspectRatio;
  onChange?: (ratio: AspectRatio) => void;
  className?: string;
  placeholder?: string;
}

export function AspectRatioSelector({
  ratios,
  value,
  onChange,
  className,
  placeholder,
}: AspectRatioSelectorProps) {
  const id = useId();

  const handleValueChange = (newValue: string) => {
    const selectedRatio = ratios.find(
      (ratio) => `${ratio.width}:${ratio.height}` === newValue
    );
    if (selectedRatio) {
      onChange?.(selectedRatio);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Select
        defaultValue={`${value?.width}:${value?.height}`}
        onValueChange={handleValueChange}
      >
        <SelectTrigger
          id={id}
          className="h-9 ps-3 [&>span]:flex [&>span]:items-center [&>span]:gap-2"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {ratios.map((ratio) => {
            const ratioValue = `${ratio.width}:${ratio.height}`;
            const label = ratio.label || ratioValue;

            return (
              <SelectItem
                key={ratioValue}
                value={ratioValue}
                className="[&>span]:flex [&>span]:items-center [&>span]:gap-2"
              >
                <span className="flex items-center gap-2">
                  <div className="relative h-4 w-4 shrink-0">
                    <div
                      className="absolute inset-0 border border-current opacity-60"
                      style={{
                        aspectRatio: `${ratio.width} / ${ratio.height}`,
                        width: ratio.width >= ratio.height ? "100%" : "auto",
                        height: ratio.height >= ratio.width ? "100%" : "auto",
                      }}
                    />
                  </div>
                  <span className="block font-medium">{label}</span>
                </span>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
