import { ButtonHTMLAttributes } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "transparent" | "white";
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "p-1",
  md: "p-1.5",
  lg: "p-2",
};

const variantClasses = {
  default: "bg-black/50 hover:bg-black/70",
  transparent: "hover:bg-white/10",
  white: "bg-white/10 hover:bg-white/20 text-white",
};

export const IconButton = ({
  children,
  className = "",
  variant = "default",
  size = "md",
  ...props
}: IconButtonProps) => {
  return (
    <button
      className={`${sizeClasses[size]} ${variantClasses[variant]} flex items-center justify-center rounded-full transition-colors ${className}`}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
};
