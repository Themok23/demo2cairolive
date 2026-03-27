'use client';

import React, { useState } from 'react';
import { Search, X, Filter, Calendar } from 'lucide-react';
import Badge from './Badge';

export interface FilterConfig {
  id: string;
  label: string;
  type: 'select' | 'date-range' | 'search';
  options?: { value: string; label: string }[];
  value?: string | { from?: string; to?: string };
}

interface FilterBarProps {
  filters: FilterConfig[];
  onSearch?: (query: string) => void;
  onFilterChange?: (filterId: string, value: string | { from?: string; to?: string }) => void;
  onClearAll?: () => void;
  activeFilters?: Record<string, string | { from?: string; to?: string }>;
}

export default function FilterBar({
  filters,
  onSearch,
  onFilterChange,
  onClearAll,
  activeFilters = {},
}: FilterBarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{ from?: string; to?: string }>({});

  const activeFilterCount = Object.values(activeFilters).filter(
    (v) => v !== undefined && v !== ''
  ).length;

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="flex items-center gap-4">
        <div className="flex-1 flex items-center bg-white/5 border border-white/10 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-white/40 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => onSearch?.(e.target.value)}
            className="bg-transparent border-none outline-none px-2 py-1 text-sm text-white placeholder:text-white/40 w-full"
          />
        </div>

        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span className="text-sm">Filters</span>
          {activeFilterCount > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-[#E8572A] text-white text-xs font-bold rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter panel */}
      {isFilterOpen && (
        <div className="bg-[#1A1A35] border border-white/10 rounded-lg p-4 space-y-4">
          {filters.map((filter) => {
            if (filter.type === 'select') {
              return (
                <div key={filter.id}>
                  <label className="block text-sm font-medium text-white mb-2">
                    {filter.label}
                  </label>
                  <select
                    value={activeFilters[filter.id] as string || ''}
                    onChange={(e) =>
                      onFilterChange?.(filter.id, e.target.value)
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#E8572A] transition-colors"
                  >
                    <option value="">All {filter.label}</option>
                    {filter.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }

            if (filter.type === 'date-range') {
              return (
                <div key={filter.id}>
                  <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {filter.label}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={dateRange.from || ''}
                      onChange={(e) => {
                        const newRange = { ...dateRange, from: e.target.value };
                        setDateRange(newRange);
                        onFilterChange?.(filter.id, newRange);
                      }}
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#E8572A] transition-colors"
                      placeholder="From"
                    />
                    <input
                      type="date"
                      value={dateRange.to || ''}
                      onChange={(e) => {
                        const newRange = { ...dateRange, to: e.target.value };
                        setDateRange(newRange);
                        onFilterChange?.(filter.id, newRange);
                      }}
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#E8572A] transition-colors"
                      placeholder="To"
                    />
                  </div>
                </div>
              );
            }

            return null;
          })}

          {activeFilterCount > 0 && (
            <button
              onClick={() => {
                onClearAll?.();
                setDateRange({});
              }}
              className="w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}

      {/* Active filter tags */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(activeFilters).map(([filterId, value]) => {
            if (!value) return null;
            const filter = filters.find((f) => f.id === filterId);
            const label =
              typeof value === 'string'
                ? filter?.options?.find((o) => o.value === value)?.label || value
                : `${value.from || ''} to ${value.to || ''}`;

            return (
              <Badge
                key={filterId}
                variant="info"
                className="flex items-center gap-2"
              >
                {label}
                <button
                  onClick={() => onFilterChange?.(filterId, '')}
                  className="ml-1 text-white/80 hover:text-white transition-colors"
                  aria-label={`Remove ${label} filter`}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
