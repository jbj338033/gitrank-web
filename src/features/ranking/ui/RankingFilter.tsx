'use client';

interface FilterOption {
  value: string;
  label: string;
}

interface RankingFilterProps {
  sort: string;
  onSortChange: (value: string) => void;
  sortOptions: FilterOption[];
  period?: string;
  onPeriodChange?: (value: string) => void;
  periodOptions?: FilterOption[];
}

export function RankingFilter({
  sort,
  onSortChange,
  sortOptions,
  period,
  onPeriodChange,
  periodOptions,
}: RankingFilterProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex gap-1">
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
      {periodOptions && onPeriodChange && (
        <div className="flex rounded-full border border-border p-0.5">
          {periodOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onPeriodChange(option.value)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                period === option.value
                  ? 'bg-surface-hover text-text-primary'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
