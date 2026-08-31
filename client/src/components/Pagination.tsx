import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <button type="button" onClick={() => onPageChange(page - 1)} disabled={page === 1} className="rounded-lg border border-(--border) bg-(--surface) p-2 text-(--text-secondary) hover:bg-(--surface-hover) hover:text-(--text) disabled:cursor-not-allowed disabled:opacity-40" aria-label="Previous page">
        <ChevronLeft size={18} />
      </button>
      <span className="px-3 text-sm font-medium text-(--text-secondary)">
        Page {page} of {totalPages}
      </span>
      <button type="button" onClick={() => onPageChange(page + 1)} disabled={page === totalPages} className="rounded-lg border border-(--border) bg-(--surface) p-2 text-(--text-secondary) hover:bg-(--surface-hover) hover:text-(--text) disabled:cursor-not-allowed disabled:opacity-40" aria-label="Next page">
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
