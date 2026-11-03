import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown, Filter, RotateCcw } from 'lucide-react';
import { FilterOptions, SortOption } from '../App';
import { debounce } from '../utils';

interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (newFilters: FilterOptions) => void;
  genres: string[];
  totalResults: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  genres,
  totalResults,
}) => {
  const [searchTermInput, setSearchTermInput] = useState(filters.searchTerm);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // Áp dụng debounce 300ms cho ô tìm kiếm theo yêu cầu kỹ thuật
  const debouncedSearchUpdate = useMemo(
    () =>
      debounce((val: string) => {
        onFilterChange({
          ...filters,
          searchTerm: val,
        });
      }, 300),
    [filters, onFilterChange]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTermInput(val);
    debouncedSearchUpdate(val);
  };

  const clearSearch = () => {
    setSearchTermInput('');
    onFilterChange({
      ...filters,
      searchTerm: '',
    });
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      genre: e.target.value,
    });
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      durationRange: e.target.value as FilterOptions['durationRange'],
    });
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      dataSource: e.target.value as FilterOptions['dataSource'],
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      sortBy: e.target.value as SortOption,
    });
  };

  const resetFilters = () => {
    setSearchTermInput('');
    onFilterChange({
      searchTerm: '',
      genre: 'all',
      durationRange: 'all',
      dataSource: 'all',
      sortBy: 'newest',
    });
  };

  const isFiltered =
    filters.searchTerm !== '' ||
    filters.genre !== 'all' ||
    filters.durationRange !== 'all' ||
    filters.dataSource !== 'all' ||
    filters.sortBy !== 'newest';

  useEffect(() => {
    setSearchTermInput(filters.searchTerm);
  }, [filters.searchTerm]);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80 mb-8 transition-all">
      {/* Primary search row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTermInput}
            onChange={handleInputChange}
            placeholder="Tìm kiếm theo tên bài hát, nghệ sĩ, album hoặc lời bài hát..."
            className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50/50 hover:bg-white transition-colors"
            aria-label="Tìm kiếm bài hát"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          {searchTermInput && (
            <button
              onClick={clearSearch}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 absolute right-3 top-2.5 transition-colors"
              aria-label="Xóa từ khóa tìm kiếm"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Genre Selector */}
          <div className="relative min-w-[130px] sm:min-w-[150px]">
            <select
              value={filters.genre}
              onChange={handleGenreChange}
              className="w-full appearance-none pl-3 pr-8 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700 cursor-pointer"
              aria-label="Lọc theo thể loại"
            >
              <option value="all">Tất cả thể loại</option>
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
          </div>

          {/* Quick Sort Selector */}
          <div className="relative min-w-[130px] sm:min-w-[150px]">
            <select
              value={filters.sortBy}
              onChange={handleSortChange}
              className="w-full appearance-none pl-3 pr-8 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700 cursor-pointer"
              aria-label="Sắp xếp danh sách bài hát"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="name-asc">Tên A &rarr; Z</option>
              <option value="name-desc">Tên Z &rarr; A</option>
              <option value="duration-asc">Thời lượng ngắn nhất</option>
              <option value="duration-desc">Thời lượng dài nhất</option>
              <option value="rating-desc">Đánh giá cao nhất</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
          </div>

          {/* Advanced toggle button */}
          <button
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className={`p-2.5 rounded-xl border transition-colors flex items-center justify-center ${
              isAdvancedOpen || filters.durationRange !== 'all' || filters.dataSource !== 'all'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'border-slate-300 text-slate-600 hover:bg-slate-50'
            }`}
            title="Lọc nâng cao"
            aria-label="Mở rộng bộ lọc nâng cao"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Advanced Filters Expandable Panel */}
      {isAdvancedOpen && (
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 animate-in fade-in duration-150">
          {/* Duration Filter */}
          <div>
            <label htmlFor="duration-filter" className="block text-xs font-semibold text-slate-600 mb-1.5">
              Thời lượng bài hát
            </label>
            <select
              id="duration-filter"
              value={filters.durationRange}
              onChange={handleDurationChange}
              className="w-full py-2 px-3 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Tất cả thời lượng</option>
              <option value="short">Ngắn (&lt; 3 phút)</option>
              <option value="medium">Trung bình (3 - 4 phút)</option>
              <option value="long">Dài (&gt; 4 phút)</option>
            </select>
          </div>

          {/* Data Source Filter */}
          <div>
            <label htmlFor="source-filter" className="block text-xs font-semibold text-slate-600 mb-1.5">
              Nguồn dữ liệu
            </label>
            <select
              id="source-filter"
              value={filters.dataSource}
              onChange={handleSourceChange}
              className="w-full py-2 px-3 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Tất cả bài hát</option>
              <option value="custom">Bài hát cá nhân tự tạo (CRUD)</option>
              <option value="system">Dữ liệu hệ thống & iTunes</option>
            </select>
          </div>

          {/* Reset Filters & Summary */}
          <div className="flex items-end justify-between sm:justify-start gap-3">
            <button
              onClick={resetFilters}
              disabled={!isFiltered}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              aria-label="Đặt lại toàn bộ bộ lọc"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đặt lại bộ lọc</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter status row */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
        <p>
          Tìm thấy <span className="font-bold text-emerald-700">{totalResults}</span> bài hát phù hợp
        </p>
        {isFiltered && (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
            Đang áp dụng bộ lọc nâng cao
          </span>
        )}
      </div>
    </div>
  );
};
