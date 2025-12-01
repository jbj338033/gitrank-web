'use client';

import { ChevronDown } from 'lucide-react';
import { useState, useCallback } from 'react';
import { useClickOutside } from '@/shared/lib';

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
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useClickOutside<HTMLDivElement>(useCallback(() => setIsOpen(false), []));

  const selectedPeriod = periodOptions?.find((o) => o.value === period);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex gap-1">
        {sortOptions.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onSortChange(value)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              sort === value ? 'bg-accent text-white' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {periodOptions && onPeriodChange && (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-medium text-text-primary transition-colors hover:bg-surface-hover"
          >
            {selectedPeriod?.label}
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute right-0 top-full z-10 mt-1 min-w-full overflow-hidden rounded-lg border border-border bg-surface py-1 shadow-lg">
              {periodOptions.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => {
                    onPeriodChange(value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left text-sm transition-colors hover:bg-surface-hover ${
                    period === value ? 'font-medium text-text-primary' : 'text-text-muted'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
