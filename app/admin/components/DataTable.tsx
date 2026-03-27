'use client';

import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Loader2,
} from 'lucide-react';

export interface ColumnDef<T> {
  id: string;
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T extends Record<string, any>> {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
  selectedRows?: (T | string)[];
  onRowClick?: (row: T) => void;
  onSelectionChange?: (rows: (T | string)[]) => void;
  rowIdAccessor?: keyof T;
  pageSize?: number;
  searchQuery?: string;
  emptyMessage?: string;
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  isLoading = false,
  selectedRows = [],
  onRowClick,
  onSelectionChange,
  rowIdAccessor = 'id' as keyof T,
  pageSize = 10,
  searchQuery = '',
  emptyMessage = 'No data available',
}: DataTableProps<T>) {
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: 'asc' | 'desc';
  }>({
    key: null,
    direction: 'asc',
  });
  const [localPageSize, setLocalPageSize] = useState(pageSize);

  // Sort and filter data
  const processedData = useMemo(() => {
    let result = [...data];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((row) =>
        columns.some((col) => {
          const value =
            typeof col.accessor === 'function'
              ? col.accessor(row)
              : row[col.accessor];
          return String(value).toLowerCase().includes(query);
        })
      );
    }

    // Sort
    if (sortConfig.key) {
      result.sort((a, b) => {
        const column = columns.find((col) => col.id === sortConfig.key);
        if (!column) return 0;

        const aValue =
          typeof column.accessor === 'function'
            ? column.accessor(a)
            : a[column.accessor];
        const bValue =
          typeof column.accessor === 'function'
            ? column.accessor(b)
            : b[column.accessor];

        if (aValue == null || bValue == null) return 0;

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [data, sortConfig, searchQuery, columns]);

  // Paginate
  const totalPages = Math.ceil(processedData.length / localPageSize);
  const start = (page - 1) * localPageSize;
  const end = start + localPageSize;
  const paginatedData = processedData.slice(start, end);

  const handleSort = (columnId: string, sortable?: boolean) => {
    if (!sortable) return;

    if (sortConfig.key === columnId) {
      setSortConfig({
        key: columnId,
        direction: sortConfig.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      setSortConfig({ key: columnId, direction: 'asc' });
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = paginatedData.map((row) => row[rowIdAccessor] || row);
      const combined = [...selectedRows, ...allIds];
      const unique = Array.from(new Set(combined));
      onSelectionChange?.(unique);
    } else {
      const pageIds = paginatedData.map((row) => row[rowIdAccessor] || row);
      onSelectionChange?.(
        selectedRows.filter((id) => !pageIds.some((pageId) => pageId === id))
      );
    }
  };

  const handleSelectRow = (row: T, checked: boolean) => {
    const rowId = row[rowIdAccessor] || row;
    if (checked) {
      onSelectionChange?.([...selectedRows, rowId]);
    } else {
      onSelectionChange?.(selectedRows.filter((id) => id !== rowId));
    }
  };

  const isAllSelected =
    paginatedData.length > 0 &&
    paginatedData.every((row) =>
      selectedRows.includes(row[rowIdAccessor] || row)
    );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-[#E8572A] animate-spin" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white/60 text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-white/5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              {onSelectionChange && (
                <th className="w-12 px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#E8572A]"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.id}
                  onClick={() => handleSort(column.id, column.sortable)}
                  className={`px-4 py-3 text-left font-medium text-white/80 ${
                    column.sortable ? 'cursor-pointer hover:text-white' : ''
                  } ${column.width || ''}`}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {column.sortable && sortConfig.key === column.id && (
                      <>
                        {sortConfig.direction === 'asc' ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, rowIndex) => {
              const rowId = row[rowIdAccessor] || row;
              const isSelected = selectedRows.includes(rowId);

              return (
                <tr
                  key={rowIndex}
                  onClick={() => onRowClick?.(row)}
                  className={`border-b border-white/5 transition-colors ${
                    onRowClick ? 'cursor-pointer hover:bg-white/5' : ''
                  } ${isSelected ? 'bg-white/10' : ''}`}
                >
                  {onSelectionChange && (
                    <td className="w-12 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelectRow(row, e.target.checked);
                        }}
                        className="w-4 h-4 rounded accent-[#E8572A]"
                      />
                    </td>
                  )}
                  {columns.map((column) => {
                    const value =
                      typeof column.accessor === 'function'
                        ? column.accessor(row)
                        : row[column.accessor];

                    return (
                      <td key={column.id} className="px-4 py-3 text-white/80">
                        {column.render ? column.render(value, row) : value}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/60">Show</span>
          <select
            value={localPageSize}
            onChange={(e) => {
              setLocalPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-[#E8572A]"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm text-white/60">per page</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-white/60">
            {start + 1} - {Math.min(end, processedData.length)} of{' '}
            {processedData.length}
          </span>

          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              const pageNum = Math.max(1, page - 2) + i;
              if (pageNum > totalPages) return null;

              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-2 py-1 rounded text-sm transition-colors ${
                    page === pageNum
                      ? 'bg-[#E8572A] text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
