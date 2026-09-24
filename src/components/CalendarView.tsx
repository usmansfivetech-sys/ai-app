import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { SheetData } from '../types/sheet';
import { formatDateKey, getMonthDays, parseDateKey } from '../utils/dateUtils';

interface CalendarViewProps {
  sheetData: SheetData;
  selectedDateKey: string;
  todayDateKey: string;
  onSelectDate: (dateKey: string) => void;
  onAdvanceToNextDay: () => void;
  onResetToToday: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  sheetData,
  selectedDateKey,
  todayDateKey,
  onSelectDate,
  onAdvanceToNextDay,
  onResetToToday,
}) => {
  // Calendar month view state
  const selectedDateObj = parseDateKey(selectedDateKey);
  const [viewYear, setViewYear] = useState(selectedDateObj.getFullYear());
  const [viewMonth, setViewMonth] = useState(selectedDateObj.getMonth()); // 0-indexed

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const daysGrid = getMonthDays(viewYear, viewMonth);

  // Compute daily completion rates
  const getDayStats = (dateKey: string) => {
    const totalRows = sheetData.rows.length;
    if (totalRows === 0) return { checkedCount: 0, totalRows: 0, percent: 0 };

    let checkedCount = 0;
    sheetData.rows.forEach((row) => {
      if (row.dailyStatus[dateKey]?.checked) {
        checkedCount++;
      }
    });

    const percent = Math.round((checkedCount / totalRows) * 100);
    return { checkedCount, totalRows, percent };
  };

  const selectedStats = getDayStats(selectedDateKey);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Calendar Header Bar */}
      <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50/70">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shadow-xs">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-800">
                Daily Verification Calendar
              </h2>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Auto-Reset Daily Tracker
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Checkboxes automatically uncheck each new day. Previous date stamps &amp; verifier names remain saved.
            </p>
          </div>
        </div>

        {/* Quick Simulation / Jump Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onResetToToday}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors border ${
              selectedDateKey === todayDateKey
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            Jump to Today ({todayDateKey})
          </button>

          <button
            type="button"
            onClick={onAdvanceToNextDay}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition-colors flex items-center gap-1.5 shadow-xs"
            title="Simulate advancing the calendar by 1 day to verify that checkboxes uncheck and previous stamps persist"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Simulate Next Day (+1 Day)</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Month Navigation & Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-slate-800">
              {monthNames[viewMonth]} {viewYear}
            </h3>
            <span className="text-xs text-slate-400">
              Viewing verification records
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                const now = new Date();
                setViewYear(now.getFullYear());
                setViewMonth(now.getMonth());
              }}
              className="px-2 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100"
            >
              This Month
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <div className="py-1">Sun</div>
          <div className="py-1">Mon</div>
          <div className="py-1">Tue</div>
          <div className="py-1">Wed</div>
          <div className="py-1">Thu</div>
          <div className="py-1">Fri</div>
          <div className="py-1">Sat</div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {daysGrid.map((item) => {
            const stats = getDayStats(item.dateKey);
            const isToday = item.dateKey === todayDateKey;
            const isSelected = item.dateKey === selectedDateKey;
            const hasActivity = stats.checkedCount > 0;
            const isAllCompleted = hasActivity && stats.checkedCount === stats.totalRows;

            return (
              <button
                key={item.dateKey}
                onClick={() => onSelectDate(item.dateKey)}
                className={`relative min-h-[76px] p-2 rounded-xl text-left transition-all border flex flex-col justify-between ${
                  isSelected
                    ? 'ring-2 ring-emerald-500 border-emerald-400 bg-emerald-50/40 shadow-xs'
                    : isToday
                    ? 'border-indigo-300 bg-indigo-50/30'
                    : item.isCurrentMonth
                    ? 'border-slate-200 bg-white hover:bg-slate-50/80 hover:border-slate-300'
                    : 'border-slate-100 bg-slate-50/50 text-slate-300'
                }`}
              >
                {/* Day Number and Badges */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold ${
                      isSelected
                        ? 'text-emerald-900'
                        : isToday
                        ? 'text-indigo-700'
                        : item.isCurrentMonth
                        ? 'text-slate-700'
                        : 'text-slate-400'
                    }`}
                  >
                    {item.dayNumber}
                  </span>

                  {isToday && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1 py-0.5 bg-indigo-600 text-white rounded">
                      Today
                    </span>
                  )}
                </div>

                {/* Daily Progress Stats */}
                <div className="mt-1">
                  {hasActivity ? (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span
                          className={`font-semibold ${
                            isAllCompleted ? 'text-emerald-700' : 'text-amber-700'
                          }`}
                        >
                          {stats.checkedCount}/{stats.totalRows} done
                        </span>
                        <span className="text-slate-400">{stats.percent}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isAllCompleted ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${stats.percent}%` }}
                        />
                      </div>
                    </div>
                  ) : item.isCurrentMonth ? (
                    <div className="text-[10px] text-slate-400 font-medium">
                      0/{stats.totalRows} checks
                    </div>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Day Status Summary Banner */}
        <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
              {selectedDateKey.split('-')[2]}
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-800">
                Active Table Date: <span className="text-emerald-700 font-bold">{selectedDateKey}</span>{' '}
                {selectedDateKey === todayDateKey && '(Today)'}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {selectedStats.checkedCount} of {selectedStats.totalRows} tasks checked for this day ({selectedStats.percent}%)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span>100% Complete</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span>In Progress</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" />
              <span>Pending</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
