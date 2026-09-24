import React from 'react';
import {
  ExternalLink,
  Check,
  Clock,
  User,
  Info,
  ChevronRight,
  FileText,
  AlertTriangle,
  History,
} from 'lucide-react';
import { SheetData, SheetRow } from '../types/sheet';

interface ChecklistTableProps {
  sheetData: SheetData;
  selectedDateKey: string;
  todayDateKey: string;
  searchQuery: string;
  onToggleCheck: (rowId: string) => void;
  onRowClick: (row: SheetRow) => void;
}

export const ChecklistTable: React.FC<ChecklistTableProps> = ({
  sheetData,
  selectedDateKey,
  todayDateKey,
  searchQuery,
  onToggleCheck,
  onRowClick,
}) => {
  const isToday = selectedDateKey === todayDateKey;

  // Filter rows based on search
  const filteredRows = sheetData.rows.filter((row) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const matchColA = row.colA.toLowerCase().includes(query);
    const matchColB = row.colB.toLowerCase().includes(query);
    const matchNotes = (row.notes || '').toLowerCase().includes(query);
    const matchAdditional = Object.values(row.additionalCols).some((val) =>
      String(val).toLowerCase().includes(query)
    );
    return matchColA || matchColB || matchNotes || matchAdditional;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Table Title Bar */}
      <div className="px-6 py-3.5 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-xs text-slate-700 uppercase tracking-wider">
            Excel Spreadsheet Records
          </span>
          <span className="text-slate-400">·</span>
          <span className="text-xs text-slate-500">
            {filteredRows.length} {filteredRows.length === 1 ? 'row' : 'rows'}
          </span>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 inline-block" />
            <span>Checked row highlights green</span>
          </span>
          <span className="flex items-center gap-1.5">
            <ExternalLink className="w-3 h-3 text-sky-600" />
            <span>Column B is clickable</span>
          </span>
        </div>
      </div>

      {/* Spreadsheet Container with horizontal scroll */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100/80 text-slate-600 font-semibold select-none">
              {/* Row index counter */}
              <th className="py-3 px-3 w-12 text-center text-slate-400 text-[11px] font-mono">
                #
              </th>

              {/* Column A */}
              <th className="py-3 px-4 font-semibold min-w-[120px]">
                {sheetData.headers.colA || 'Item Code'}
              </th>

              {/* Column B - Clickable! */}
              <th className="py-3 px-4 font-semibold min-w-[280px]">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <span>{sheetData.headers.colB || 'Task / Reference (Clickable)'}</span>
                  <span className="text-[10px] text-sky-600 font-normal bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">
                    Clickable
                  </span>
                </div>
              </th>

              {/* Column C - Checkbox */}
              <th className="py-3 px-4 font-semibold w-36 text-center">
                <div className="flex items-center justify-center gap-1.5 text-emerald-800">
                  <Check className="w-3.5 h-3.5" />
                  <span>{sheetData.headers.colC || 'Status'}</span>
                </div>
              </th>

              {/* Column D - Date Day Stamp & User Name */}
              <th className="py-3 px-4 font-semibold min-w-[280px]">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{sheetData.headers.colD || 'Date Day Stamp & User Name'}</span>
                </div>
              </th>

              {/* Additional Columns from Excel */}
              {sheetData.headers.additional.map((header) => (
                <th
                  key={header}
                  className="py-3 px-4 font-semibold text-slate-600 min-w-[140px]"
                >
                  {header}
                </th>
              ))}

              {/* Action column */}
              <th className="py-3 px-4 font-semibold text-right w-24">
                Details
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {filteredRows.length === 0 ? (
              <tr>
                <td
                  colSpan={5 + sheetData.headers.additional.length}
                  className="py-12 text-center text-slate-400 text-xs"
                >
                  No matching Excel rows found. Try adjusting your search query.
                </td>
              </tr>
            ) : (
              filteredRows.map((row, index) => {
                const currentStatus = row.dailyStatus[selectedDateKey];
                const isCheckedToday = !!currentStatus?.checked;
                const lastCheck = row.lastChecked;

                return (
                  <tr
                    key={row.id}
                    className={`group transition-colors duration-150 ${
                      isCheckedToday
                        ? 'bg-emerald-50/80 hover:bg-emerald-100/80 border-l-4 border-l-emerald-600'
                        : 'bg-white hover:bg-slate-50 border-l-4 border-l-transparent'
                    }`}
                  >
                    {/* Index */}
                    <td className="py-3 px-3 text-center text-slate-400 font-mono text-[11px]">
                      {index + 1}
                    </td>

                    {/* Column A (Item Code / Fixed Data) */}
                    <td className="py-3 px-4 font-mono font-medium text-slate-700">
                      <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200/80 inline-block">
                        {row.colA}
                      </span>
                    </td>

                    {/* Column B (Clickable!) */}
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => onRowClick(row)}
                        className="text-left w-full group/btn focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded p-1 -m-1"
                        title="Click to view details, inspect history, or open link"
                      >
                        <div className="flex items-start gap-1.5">
                          <span
                            className={`font-semibold transition-colors ${
                              isCheckedToday
                                ? 'text-emerald-950 group-hover/btn:text-emerald-700'
                                : 'text-slate-800 group-hover/btn:text-emerald-700'
                            } underline-offset-2 hover:underline`}
                          >
                            {row.colB}
                          </span>
                          {row.colBLink ? (
                            <ExternalLink className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover/btn:text-slate-600 shrink-0 mt-0.5 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                          )}
                        </div>
                        {row.notes && (
                          <div className="text-[11px] text-slate-500 mt-0.5 truncate max-w-sm">
                            {row.notes}
                          </div>
                        )}
                      </button>
                    </td>

                    {/* Column C (The Checkbox - Highlight row in green on check!) */}
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => onToggleCheck(row.id)}
                        className={`w-7 h-7 mx-auto rounded-lg flex items-center justify-center transition-all shadow-xs cursor-pointer border ${
                          isCheckedToday
                            ? 'bg-emerald-600 border-emerald-600 text-white scale-105 ring-2 ring-emerald-300'
                            : 'bg-white border-slate-300 hover:border-emerald-500 text-transparent hover:text-slate-300'
                        }`}
                        title={
                          isCheckedToday
                            ? `Checked for ${selectedDateKey}. Click to uncheck.`
                            : `Click to verify & auto-generate date day stamp`
                        }
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </button>
                    </td>

                    {/* Column D (Date Day Stamp & User Name / Email) */}
                    <td className="py-3 px-4">
                      {isCheckedToday && currentStatus ? (
                        // Checked for active day -> Live updated timestamp & user name & email
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5 font-semibold text-emerald-900 text-xs">
                            <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{currentStatus.timestamp}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 mt-0.5 font-medium">
                            <User className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span className="font-semibold">{currentStatus.userName}</span>
                            {currentStatus.userEmail && (
                              <span className="text-[10px] text-emerald-600/80 font-mono hidden sm:inline">
                                ({currentStatus.userEmail})
                              </span>
                            )}
                          </div>
                        </div>
                      ) : lastCheck ? (
                        // Unchecked for today -> Stamp will remain from the last check and user name visible!
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                            <History className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="font-medium">{lastCheck.timestamp}</span>
                            <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-1 py-0.2 rounded">
                              Last Check
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                            <User className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="font-medium text-slate-700">{lastCheck.userName}</span>
                            {lastCheck.userEmail && (
                              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                                ({lastCheck.userEmail})
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="text-slate-400 italic text-xs">
                          — No verification recorded —
                        </div>
                      )}
                    </td>

                    {/* Additional columns */}
                    {sheetData.headers.additional.map((header) => (
                      <td key={header} className="py-3 px-4 text-slate-600">
                        {String(row.additionalCols[header] ?? '—')}
                      </td>
                    ))}

                    {/* Action button */}
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onRowClick(row)}
                        className="px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="px-6 py-3 border-t border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-3">
        <div>
          Showing {filteredRows.length} of {sheetData.rows.length} total rows
        </div>
        <div className="flex items-center gap-2">
          <span>Active Verifier:</span>
          <span className="font-semibold text-slate-800">Column C Checkbox applies active user</span>
        </div>
      </div>
    </div>
  );
};
