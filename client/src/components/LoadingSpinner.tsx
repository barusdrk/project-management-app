interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export default function LoadingSpinner({ size = "md", text = "Loading..." }: LoadingSpinnerProps) {
  const sizes = { sm: "h-4 w-4 border-2", md: "h-6 w-6 border-2", lg: "h-10 w-10 border-4" };

  return (
    <div className="flex items-center justify-center gap-3 py-8" role="status" aria-live="polite">
      <div className={`${sizes[size]} animate-spin rounded-full border-(--border) border-t-(--accent)`} />
      {text && <span className="text-sm text-(--text-secondary)">{text}</span>}
    </div>
  );
}
