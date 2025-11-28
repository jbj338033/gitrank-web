'use client';

interface SortOption {
  value: string;
  label: string;
}

interface RankingFilterProps {
  sort: string;
  onSortChange: (value: string) => void;
  sortOptions: SortOption[];
}

export function RankingFilter({
  sort,
  onSortChange,
  sortOptions,
}: RankingFilterProps) {
  return (
    <div className="flex gap-2">
      {sortOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => onSortChange(option.value)}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
            sort === option.value
              ? 'bg-accent text-white'
              : 'text-text-muted hover:text-text-primary'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
