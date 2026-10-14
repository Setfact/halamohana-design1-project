'use client';

import { useState, useMemo, type ReactNode } from 'react';
import { Search, ChevronLeft, ChevronRight, Eye, EyeOff, Edit, Trash2 } from 'lucide-react';

export type ColumnDef<T> = {
  header: string;
  accessorKey?: keyof T;
  render?: (row: T, index: number) => ReactNode;
  width?: string;
};

type DataTableProps<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  searchKey?: keyof T | ((row: T) => string);
  searchPlaceholder?: string;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onToggleVisibility?: (row: T) => void;
  getVisibility?: (row: T) => boolean;
  extraActions?: (row: T) => ReactNode;
  emptyMessage?: string;
  itemsPerPage?: number;
};

export function DataTable<T extends { id?: string | number }>({
  data,
  columns,
  searchKey,
  searchPlaceholder = 'Search items...',
  onEdit,
  onDelete,
  onToggleVisibility,
  getVisibility,
  extraActions,
  emptyMessage = 'No records found.',
  itemsPerPage = 10,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const query = search.toLowerCase();
    return data.filter((item) => {
      if (typeof searchKey === 'function') {
        return searchKey(item).toLowerCase().includes(query);
      }
      if (searchKey && item[searchKey]) {
        return String(item[searchKey]).toLowerCase().includes(query);
      }
      return JSON.stringify(item).toLowerCase().includes(query);
    });
  }, [data, search, searchKey]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const hasActionColumn = onEdit || onDelete || onToggleVisibility || extraActions;

  return (
    <div className="admin-table-wrapper">
      {/* Table Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
        <div className="admin-search-box" style={{ width: 280 }}>
          <Search size={16} color="#9ca3af" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div style={{ fontSize: 13, color: 'var(--admin-text-muted)' }}>
          Showing <strong>{filteredData.length}</strong> entries
        </div>
      </div>

      {/* Table Element */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} style={{ width: col.width }}>
                  {col.header}
                </th>
              ))}
              {hasActionColumn && <th style={{ width: '130px', textAlign: 'center' }}>Action</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (hasActionColumn ? 1 : 0)} style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIdx) => {
                const isVisible = getVisibility ? getVisibility(row) : true;
                return (
                  <tr key={row.id ?? rowIdx}>
                    {columns.map((col, colIdx) => (
                      <td key={colIdx}>
                        {col.render
                          ? col.render(row, (currentPage - 1) * itemsPerPage + rowIdx + 1)
                          : col.accessorKey
                          ? String(row[col.accessorKey] ?? '-')
                          : '-'}
                      </td>
                    ))}
                    {hasActionColumn && (
                      <td style={{ textAlign: 'center' }}>
                        <div className="admin-actions-cell" style={{ justifyContent: 'center' }}>
                          {onToggleVisibility && (
                            <button
                              type="button"
                              className={`admin-btn-icon ${isVisible ? 'view' : ''}`}
                              onClick={() => onToggleVisibility(row)}
                              title={isVisible ? 'Hide from website' : 'Make visible on website'}
                            >
                              {isVisible ? <Eye size={15} /> : <EyeOff size={15} color="#9ca3af" />}
                            </button>
                          )}
                          {onEdit && (
                            <button
                              type="button"
                              className="admin-btn-icon edit"
                              onClick={() => onEdit(row)}
                              title="Edit item"
                            >
                              <Edit size={15} />
                            </button>
                          )}
                          {extraActions && extraActions(row)}
                          {onDelete && (
                            <button
                              type="button"
                              className="admin-btn-icon delete"
                              onClick={() => onDelete(row)}
                              title="Delete item"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18 }}>
          <div style={{ fontSize: 13, color: 'var(--admin-text-muted)' }}>
            Page {currentPage} of {totalPages}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              type="button"
              className="admin-btn-icon"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              style={{ opacity: currentPage <= 1 ? 0.4 : 1, cursor: currentPage <= 1 ? 'not-allowed' : 'pointer' }}
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`admin-btn-icon ${currentPage === idx + 1 ? 'view' : ''}`}
                style={{
                  fontWeight: currentPage === idx + 1 ? 700 : 400,
                  backgroundColor: currentPage === idx + 1 ? 'var(--admin-green)' : undefined,
                  color: currentPage === idx + 1 ? '#fff' : undefined,
                }}
                onClick={() => setCurrentPage(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}
            <button
              type="button"
              className="admin-btn-icon"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              style={{ opacity: currentPage >= totalPages ? 0.4 : 1, cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
