import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  FileSpreadsheet,
  Download,
  AlertCircle,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { parseExcelFile, downloadSampleTemplate } from '../utils/excelUtils';
import { SheetData, UserProfile } from '../types/sheet';

interface ExcelUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSheetLoaded: (sheet: SheetData) => void;
  currentUser: UserProfile;
}

export const ExcelUploadModal: React.FC<ExcelUploadModalProps> = ({
  isOpen,
  onClose,
  onSheetLoaded,
  currentUser,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleProcessFile = async (file: File) => {
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const parsedSheet = await parseExcelFile(file);
      // Attach uploader identity
      parsedSheet.uploadedBy = {
        name: currentUser.name,
        email: currentUser.email,
        timestamp: new Date().toLocaleString(),
      };
      onSheetLoaded(parsedSheet);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err.message ||
          'Failed to process Excel file. Please ensure it is a valid .xlsx, .xls, or .csv file.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleProcessFile(file);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleProcessFile(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-semibold text-slate-800">
              Upload or Replace Excel Spreadsheet
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Active Uploader Identity Notice */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-900">
            <Users className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Active Uploader Identity:</span> Signing and uploading as{' '}
              <span className="font-semibold text-emerald-950">{currentUser.name}</span> (
              <span className="font-mono font-semibold">{currentUser.email}</span>). The uploaded spreadsheet will be shared and instantly accessible to all users.
            </div>
          </div>

          {/* Drag & Drop Area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-7 text-center transition-all cursor-pointer ${
              isDragging
                ? 'border-emerald-500 bg-emerald-50/50 scale-[0.99]'
                : 'border-slate-300 hover:border-emerald-400 hover:bg-slate-50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileInputChange}
              accept=".xlsx,.xls,.csv"
              className="hidden"
            />
            <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 shadow-inner bg-emerald-50 text-emerald-600">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div className="text-sm font-medium text-slate-800">
              {isLoading
                ? 'Processing Excel file...'
                : 'Drop your Excel file here, or click to browse'}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Supports Microsoft Excel (.xlsx, .xls) and CSV spreadsheets
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Column structure guide */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-2">
            <div className="font-semibold text-slate-700">Excel Sheet Architecture:</div>
            <div className="grid grid-cols-2 gap-2 text-slate-600 text-[11px]">
              <div>
                <span className="font-semibold text-slate-800">Column A:</span> Item Code / ID
              </div>
              <div>
                <span className="font-semibold text-slate-800">Column B:</span> Link or Item Name (Clickable)
              </div>
              <div>
                <span className="font-semibold text-slate-800">Column C:</span> Verification Checkbox
              </div>
              <div>
                <span className="font-semibold text-slate-800">Column D+:</span> Auto Date Stamp &amp; Verifier Email
              </div>
            </div>
          </div>

          {/* Download Sample Template */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={downloadSampleTemplate}
              className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Excel Template (.xlsx)</span>
            </button>
          </div>
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
