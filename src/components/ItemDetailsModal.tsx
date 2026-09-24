import React, { useState } from 'react';
import { X, ExternalLink, Calendar, User, Clock, CheckCircle2, Circle, FileText, Save } from 'lucide-react';
import { SheetRow } from '../types/sheet';

interface ItemDetailsModalProps {
  row: SheetRow | null;
  isOpen: boolean;
  onClose: () => void;
  selectedDateKey: string;
  onToggleCheck: (rowId: string) => void;
  onUpdateNotes: (rowId: string, notes: string) => void;
}

export const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({
  row,
  isOpen,
  onClose,
  selectedDateKey,
  onToggleCheck,
  onUpdateNotes,
}) => {
  if (!isOpen || !row) return null;

  const currentCheck = row.dailyStatus[selectedDateKey];
  const isCheckedToday = !!currentCheck?.checked;
  const lastCheck = row.lastChecked;

  const [notesText, setNotesText] = useState(row.notes || '');
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const handleSaveNotes = () => {
    onUpdateNotes(row.id, notesText);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2000);
  };

  // Compile check history
  const historyEntries = Object.entries(row.dailyStatus)
    .filter(([_, record]) => record.checked)
    .sort(([dateA], [dateB]) => dateB.localeCompare(dateA));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-semibold px-2 py-1 bg-slate-200 text-slate-800 rounded">
              {row.colA}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Column B Inspection &amp; Details
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Main Title & Action */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Column B (Fixed Excel Reference)
            </label>
            <div className="text-lg font-semibold text-slate-900 leading-snug break-words">
              {row.colB}
            </div>

            {row.colBLink && (
              <div className="mt-2.5">
                <a
                  href={row.colBLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 hover:text-emerald-800 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Attached Resource Link</span>
                </a>
              </div>
            )}
          </div>

          {/* Quick Check Action Banner */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              isCheckedToday
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-semibold uppercase tracking-wider">
                  Verification Status ({selectedDateKey})
                </div>
                <div className="text-sm font-medium flex items-center gap-2">
                  {isCheckedToday ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Verified &amp; Checked Today</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4 text-slate-400" />
                      <span>Pending Daily Verification</span>
                    </>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onToggleCheck(row.id)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5 ${
                  isCheckedToday
                    ? 'bg-white text-emerald-700 border border-emerald-300 hover:bg-emerald-50'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {isCheckedToday ? 'Uncheck For Today' : 'Verify & Check Now'}
              </button>
            </div>

            {/* Current or Last Stamp Display */}
            <div className="mt-3 pt-3 border-t border-slate-200/60 text-xs flex flex-wrap items-center gap-y-1 gap-x-4 text-slate-600">
              {isCheckedToday && currentCheck ? (
                <>
                  <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Checked: {currentCheck.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                    <User className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      By: {currentCheck.userName}
                      {currentCheck.userEmail ? ` (${currentCheck.userEmail})` : ''}
                    </span>
                  </div>
                </>
              ) : lastCheck ? (
                <>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Last Check: {lastCheck.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <User className="w-3.5 h-3.5" />
                    <span>
                      By: {lastCheck.userName}
                      {lastCheck.userEmail ? ` (${lastCheck.userEmail})` : ''}
                    </span>
                  </div>
                </>
              ) : (
                <span className="text-slate-400 italic">No previous check recorded</span>
              )}
            </div>
          </div>

          {/* Additional Columns Grid */}
          {Object.keys(row.additionalCols).length > 0 && (
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Additional Excel Attributes
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(row.additionalCols).map(([key, val]) => (
                  <div
                    key={key}
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex flex-col"
                  >
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                      {key}
                    </span>
                    <span className="font-medium text-slate-800 mt-0.5">{String(val) || '—'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes & Operational Remarks */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Notes &amp; Observations</span>
              </label>
              {isSavedNotice && (
                <span className="text-[11px] text-emerald-600 font-medium">Saved</span>
              )}
            </div>
            <textarea
              rows={3}
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="Add verification notes, inspection findings, or equipment serial numbers..."
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={handleSaveNotes}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Notes</span>
              </button>
            </div>
          </div>

          {/* Verification Audit Log */}
          {historyEntries.length > 0 && (
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Daily Verification History
              </label>
              <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-40 overflow-y-auto">
                {historyEntries.map(([dKey, record]) => (
                  <div
                    key={dKey}
                    className="p-2.5 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-medium text-slate-700">{dKey}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500">{record.timestamp}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-slate-800">{record.userName}</div>
                      {record.userEmail && (
                        <div className="text-[10px] text-slate-400 font-mono">{record.userEmail}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
