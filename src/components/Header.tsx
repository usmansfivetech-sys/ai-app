import React from 'react';
import {
  FileSpreadsheet,
  Upload,
  Download,
  RotateCcw,
  Sparkles,
  Calendar,
  CheckCircle,
} from 'lucide-react';
import { SheetData, UserProfile } from '../types/sheet';
import { UserSwitcher } from './UserSwitcher';

interface HeaderProps {
  sheetData: SheetData;
  currentUser: UserProfile;
  selectedDateKey: string;
  todayDateKey: string;
  onUserChange: (user: UserProfile) => void;
  onOpenUpload: () => void;
  onExport: () => void;
  onResetSample: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  sheetData,
  currentUser,
  selectedDateKey,
  todayDateKey,
  onUserChange,
  onOpenUpload,
  onExport,
  onResetSample,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Sheet title */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 truncate">
                  {sheetData.title}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  Active Spreadsheet
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 truncate">
                <span className="text-slate-700 font-medium">{sheetData.fileName}</span>
                <span>·</span>
                <span className="text-emerald-700 font-medium">Col B Clickable</span>
                <span>·</span>
                <span>Col C Daily Checkbox</span>
                {sheetData.uploadedBy && (
                  <>
                    <span>·</span>
                    <span className="text-slate-400 hidden md:inline">
                      Uploaded by: {sheetData.uploadedBy.name} ({sheetData.uploadedBy.email})
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons & User profile */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* User switcher */}
            <UserSwitcher
              currentUser={currentUser}
              onUserChange={onUserChange}
            />

            {/* Upload / Replace Sheet Button */}
            <button
              type="button"
              onClick={onOpenUpload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors shadow-2xs text-slate-800 bg-white border border-slate-300 hover:bg-slate-50"
              title="Upload or replace Excel spreadsheet (.xlsx, .xls, .csv)"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden md:inline">Upload Excel</span>
            </button>

            {/* Export Button */}
            <button
              type="button"
              onClick={onExport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-2xs"
              title="Export current verification sheet with timestamps to Excel"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export .xlsx</span>
            </button>

            {/* Reset sample button */}
            <button
              type="button"
              onClick={onResetSample}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              title="Reset checklist to default operational spreadsheet"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
