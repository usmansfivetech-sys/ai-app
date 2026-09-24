import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  CheckSquare,
  Square,
  Search,
  Filter,
  Info,
} from 'lucide-react';
import { SheetData } from '../types/sheet';

interface StatsBarProps {
  sheetData: SheetData;
  selectedDateKey: string;
  todayDateKey: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onCheckAll: () => void;
  onUncheckAll: () => void;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  sheetData,
  selectedDateKey,
  todayDateKey,
  searchQuery,
  onSearchChange,
  onCheckAll,
  onUncheckAll,
}) => {
  const total = sheetData.rows.length;
  const completed = sheetData.rows.filter(
    (r) => !!r.dailyStatus[selectedDateKey]?.checked
  ).length;
  const pending = total - completed;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const isToday = selectedDateKey === todayDateKey;

  return (
    <div className="space-y-3">
      {/* Notice Banner explaining daily uncheck & stamp persistence */}
      <div className="p-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border border-emerald-200/80 rounded-xl flex items-center justify-between gap-3 text-xs text-slate-700 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Shared Excel Spreadsheet:</strong> Visible and usable by all team members. Each person&apos;s email acts as their identity; ticking Column C highlights the row in green and auto-generates their name, email, and date/time stamp. Checkboxes reset fresh each day while previous stamps remain preserved.
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Email-Verified Stamps</span>
        </div>
      </div>

      {/* Progress & Controls Card */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        {/* Metric counts */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-sm">
              {percent}%
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-800">
                {completed} of {total} Verified
              </div>
              <div className="text-[11px] text-slate-500">
                {isToday ? "Today's Completion Rate" : `Status for ${selectedDateKey}`}
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4 border-l border-slate-200 pl-6 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Completed</span>
              <span className="font-bold text-emerald-700 text-sm">{completed}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Pending</span>
              <span className="font-bold text-amber-700 text-sm">{pending}</span>
            </div>
          </div>
        </div>

        {/* Search & Bulk Controls */}
        <div className="flex items-center gap-2.5 flex-1 max-w-md justify-end">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search items, links, codes..."
              className="w-full text-xs pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
            />
          </div>

          <button
            type="button"
            onClick={onCheckAll}
            className="px-2.5 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
            title="Mark all items checked for this date"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Check All</span>
          </button>

          <button
            type="button"
            onClick={onUncheckAll}
            className="px-2.5 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            title="Reset check state for this date"
          >
            <Square className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Uncheck All</span>
          </button>
        </div>
      </div>
    </div>
  );
};
