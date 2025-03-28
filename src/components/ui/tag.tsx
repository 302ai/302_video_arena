interface TagProps {
  children: React.ReactNode;
  className?: string;
}

export const Tag = ({ children, className = "" }: TagProps) => {
  return (
    <div className="inline-flex items-center rounded-lg bg-black/50 px-2.5 py-1 shadow-[0_2px_8px_rgba(0,0,0,0.3)] ring-1 ring-black/10 backdrop-blur-md">
      <span
        className={`text-xs font-medium tracking-wide text-white drop-shadow-sm ${className}`}
      >
        {children}
      </span>
    </div>
  );
};
