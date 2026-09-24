/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { SheetData, SheetRow, UserProfile, CheckRecord } from './types/sheet';
import { createInitialSheet, PRESET_USERS } from './data/defaultSheets';
import {
  formatDateKey,
  formatDayDateStamp,
  parseDateKey,
} from './utils/dateUtils';
import { exportToExcel } from './utils/excelUtils';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { ChecklistTable } from './components/ChecklistTable';
import { CalendarView } from './components/CalendarView';
import { ItemDetailsModal } from './components/ItemDetailsModal';
import { ExcelUploadModal } from './components/ExcelUploadModal';

export default function App() {
  // Today's date representation (can be advanced via simulation)
  const [currentSystemDate, setCurrentSystemDate] = useState<Date>(new Date());
  const todayDateKey = formatDateKey(currentSystemDate);

  // Selected date in the calendar / table view
  const [selectedDateKey, setSelectedDateKey] = useState<string>(todayDateKey);

  // Active user profile
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('excel_checklist_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return PRESET_USERS[0]; // Usman S.
  });

  // Sheet data state
  const [sheetData, setSheetData] = useState<SheetData>(() => {
    const saved = localStorage.getItem('excel_checklist_data_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return createInitialSheet();
  });

  // Search query
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedRowForModal, setSelectedRowForModal] = useState<SheetRow | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Persist sheet data
  useEffect(() => {
    try {
      localStorage.setItem('excel_checklist_data_v2', JSON.stringify(sheetData));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  }, [sheetData]);

  // Persist user profile
  useEffect(() => {
    try {
      localStorage.setItem('excel_checklist_user', JSON.stringify(currentUser));
    } catch (e) {
      console.warn('Failed to save user to localStorage', e);
    }
  }, [currentUser]);

  // Keep modal row state in sync if sheetData updates
  useEffect(() => {
    if (selectedRowForModal) {
      const refreshed = sheetData.rows.find((r) => r.id === selectedRowForModal.id);
      if (refreshed) {
        setSelectedRowForModal(refreshed);
      }
    }
  }, [sheetData]);

  // Handler to toggle checkbox for a row on the active date
  const handleToggleCheck = (rowId: string) => {
    const nowStamp = formatDayDateStamp(new Date());

    setSheetData((prev) => {
      let isAllCompletedNow = false;

      const updatedRows = prev.rows.map((row) => {
        if (row.id !== rowId) return row;

        const isCurrentlyChecked = !!row.dailyStatus[selectedDateKey]?.checked;
        const newDailyStatus = { ...row.dailyStatus };

        let updatedLastChecked = row.lastChecked;

        if (isCurrentlyChecked) {
          // Unchecking
          delete newDailyStatus[selectedDateKey];
          // If we uncheck today, lastChecked remains pointing to the most recent check recorded
          const remainingChecks = Object.entries(newDailyStatus)
            .filter(([_, rec]) => rec.checked)
            .sort(([dA], [dB]) => dB.localeCompare(dA));

          if (remainingChecks.length > 0) {
            updatedLastChecked = remainingChecks[0][1];
          }
        } else {
          // Checking! Auto-generate date day stamp and associate with active user name and email
          const newRecord: CheckRecord = {
            checked: true,
            timestamp: nowStamp,
            isoTimestamp: new Date().toISOString(),
            userName: currentUser.name,
            userEmail: currentUser.email,
            dateKey: selectedDateKey,
          };
          newDailyStatus[selectedDateKey] = newRecord;
          updatedLastChecked = newRecord;
        }

        return {
          ...row,
          dailyStatus: newDailyStatus,
          lastChecked: updatedLastChecked,
        };
      });

      // Check if all rows are now checked for this date
      const totalChecked = updatedRows.filter(
        (r) => !!r.dailyStatus[selectedDateKey]?.checked
      ).length;
      if (totalChecked === updatedRows.length && updatedRows.length > 0) {
        isAllCompletedNow = true;
      }

      if (isAllCompletedNow) {
        try {
          confetti({
            particleCount: 60,
            spread: 60,
            origin: { y: 0.7 },
          });
        } catch (e) {
          // ignore
        }
      }

      return {
        ...prev,
        rows: updatedRows,
        lastModified: new Date().toISOString(),
      };
    });
  };

  // Bulk check all for active date
  const handleCheckAll = () => {
    const nowStamp = formatDayDateStamp(new Date());

    setSheetData((prev) => {
      const updatedRows = prev.rows.map((row) => {
        const record: CheckRecord = {
          checked: true,
          timestamp: nowStamp,
          isoTimestamp: new Date().toISOString(),
          userName: currentUser.name,
          userEmail: currentUser.email,
          dateKey: selectedDateKey,
        };
        return {
          ...row,
          dailyStatus: {
            ...row.dailyStatus,
            [selectedDateKey]: record,
          },
          lastChecked: record,
        };
      });

      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (e) {}

      return {
        ...prev,
        rows: updatedRows,
        lastModified: new Date().toISOString(),
      };
    });
  };

  // Bulk uncheck all for active date
  const handleUncheckAll = () => {
    setSheetData((prev) => {
      const updatedRows = prev.rows.map((row) => {
        const newDailyStatus = { ...row.dailyStatus };
        delete newDailyStatus[selectedDateKey];
        return {
          ...row,
          dailyStatus: newDailyStatus,
        };
      });
      return {
        ...prev,
        rows: updatedRows,
        lastModified: new Date().toISOString(),
      };
    });
  };

  // Update notes for a row
  const handleUpdateNotes = (rowId: string, notes: string) => {
    setSheetData((prev) => ({
      ...prev,
      rows: prev.rows.map((r) => (r.id === rowId ? { ...r, notes } : r)),
    }));
  };

  // Advance system date by 1 day (simulation of next day)
  const handleAdvanceToNextDay = () => {
    const nextDate = new Date(currentSystemDate);
    nextDate.setDate(nextDate.getDate() + 1);
    setCurrentSystemDate(nextDate);
    const nextDateKey = formatDateKey(nextDate);
    setSelectedDateKey(nextDateKey);
  };

  // Reset date back to actual real-time today
  const handleResetToToday = () => {
    const actualToday = new Date();
    setCurrentSystemDate(actualToday);
    const actualKey = formatDateKey(actualToday);
    setSelectedDateKey(actualKey);
  };

  // Export current sheet to xlsx
  const handleExport = () => {
    exportToExcel(sheetData, selectedDateKey);
  };

  // Reset to default sample spreadsheet
  const handleResetSample = () => {
    if (window.confirm('Reset checklist data back to the default operational Excel template?')) {
      const initial = createInitialSheet();
      setSheetData(initial);
      setSelectedRowForModal(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased selection:bg-emerald-200">
      {/* Top Header */}
      <Header
        sheetData={sheetData}
        currentUser={currentUser}
        selectedDateKey={selectedDateKey}
        todayDateKey={todayDateKey}
        onUserChange={setCurrentUser}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        onExport={handleExport}
        onResetSample={handleResetSample}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Statistics & Filters Bar */}
        <StatsBar
          sheetData={sheetData}
          selectedDateKey={selectedDateKey}
          todayDateKey={todayDateKey}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onCheckAll={handleCheckAll}
          onUncheckAll={handleUncheckAll}
        />

        {/* The Spreadsheet / Checklist Table (Column B clickable, Column C checkbox with green highlight) */}
        <ChecklistTable
          sheetData={sheetData}
          selectedDateKey={selectedDateKey}
          todayDateKey={todayDateKey}
          searchQuery={searchQuery}
          onToggleCheck={handleToggleCheck}
          onRowClick={(row) => setSelectedRowForModal(row)}
        />

        {/* Interactive Calendar at the Bottom of the Page */}
        <section className="pt-2">
          <CalendarView
            sheetData={sheetData}
            selectedDateKey={selectedDateKey}
            todayDateKey={todayDateKey}
            onSelectDate={(dKey) => setSelectedDateKey(dKey)}
            onAdvanceToNextDay={handleAdvanceToNextDay}
            onResetToToday={handleResetToToday}
          />
        </section>
      </main>

      {/* Modals & Slide-overs */}
      <ItemDetailsModal
        row={selectedRowForModal}
        isOpen={!!selectedRowForModal}
        onClose={() => setSelectedRowForModal(null)}
        selectedDateKey={selectedDateKey}
        onToggleCheck={handleToggleCheck}
        onUpdateNotes={handleUpdateNotes}
      />

      <ExcelUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        currentUser={currentUser}
        onSheetLoaded={(newSheet) => {
          setSheetData(newSheet);
          setSelectedDateKey(todayDateKey);
        }}
      />
    </div>
  );
}
