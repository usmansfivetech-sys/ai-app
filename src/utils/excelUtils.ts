import * as XLSX from 'xlsx';
import { SheetData, SheetRow } from '../types/sheet';
import { formatDateKey } from './dateUtils';

/**
 * Checks if a string looks like a web URL
 */
export function extractUrl(val: string): string | undefined {
  if (!val) return undefined;
  const trimmed = val.trim();
  if (/^(https?:\/\/|www\.)[^\s/$.?#].[^\s]*$/i.test(trimmed)) {
    return trimmed.startsWith('www.') ? `https://${trimmed}` : trimmed;
  }
  // Check if string contains markdown link [label](url)
  const mdMatch = trimmed.match(/\[.*?\]\((https?:\/\/[^\s]+)\)/);
  if (mdMatch) return mdMatch[1];
  return undefined;
}

/**
 * Parse an Excel or CSV file buffer/arrayBuffer into SheetData
 */
export async function parseExcelFile(file: File): Promise<SheetData> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });

  const firstSheetName = workbook.SheetNames[0] || 'Sheet1';
  const worksheet = workbook.Sheets[firstSheetName];

  // Convert to 2D array of raw values
  const rawData: any[][] = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: '',
  });

  if (!rawData || rawData.length === 0) {
    throw new Error('The selected Excel file appears to be empty.');
  }

  // Row 0 as headers, or default if missing
  const headerRow = rawData[0] || [];
  const colAName = String(headerRow[0] || 'ID / Code').trim();
  const colBName = String(headerRow[1] || 'Item Name / Link').trim();
  const colCName = String(headerRow[2] || 'Status / Check').trim();
  const colDName = String(headerRow[3] || 'Date Stamp & User').trim();

  const additionalHeaderNames: string[] = [];
  for (let i = 4; i < headerRow.length; i++) {
    const colName = String(headerRow[i] || `Column ${i + 1}`).trim();
    if (colName) {
      additionalHeaderNames.push(colName);
    }
  }

  const rows: SheetRow[] = [];
  const todayKey = formatDateKey(new Date());

  for (let rowIndex = 1; rowIndex < rawData.length; rowIndex++) {
    const row = rawData[rowIndex];
    if (!row || row.every((c: any) => c === '' || c === undefined || c === null)) {
      continue; // Skip entirely blank rows
    }

    const colAVal = String(row[0] ?? `ITEM-${rowIndex}`).trim();
    const colBVal = String(row[1] ?? '').trim();
    const colBUrl = extractUrl(colBVal);

    // Additional columns mapping
    const additionalCols: Record<string, string | number> = {};
    additionalHeaderNames.forEach((header, idx) => {
      const cellVal = row[idx + 4];
      additionalCols[header] = cellVal !== undefined && cellVal !== null ? cellVal : '';
    });

    // Check if initial sheet already has status/timestamp
    const colCVal = row[2];
    const isCheckedInitial =
      typeof colCVal === 'boolean'
        ? colCVal
        : typeof colCVal === 'string' &&
          ['true', 'yes', 'checked', '1', 'done', 'completed'].includes(colCVal.toLowerCase());

    const colDVal = String(row[3] || '').trim();
    const initialStamp = colDVal || undefined;

    const rowId = `row-${rowIndex}-${Date.now().toString(36)}`;

    const newRow: SheetRow = {
      id: rowId,
      colA: colAVal,
      colB: colBVal || `Item ${rowIndex}`,
      colBLink: colBUrl,
      additionalCols,
      dailyStatus: {},
      notes: '',
    };

    if (isCheckedInitial || initialStamp) {
      const parts = initialStamp ? initialStamp.split('·').map((s) => s.trim()) : [];
      const timestamp = parts[0] || 'Previously Recorded';
      const userName = parts[1] || 'Imported Data';
      const userEmail = parts[2] || '';

      const initialRecord = {
        checked: isCheckedInitial,
        timestamp,
        isoTimestamp: new Date().toISOString(),
        userName,
        userEmail,
        dateKey: todayKey,
      };

      if (isCheckedInitial) {
        newRow.dailyStatus[todayKey] = initialRecord;
      }
      newRow.lastChecked = initialRecord;
    }

    rows.push(newRow);
  }

  return {
    title: file.name.replace(/\.[^/.]+$/, ''),
    sheetName: firstSheetName,
    fileName: file.name,
    headers: {
      colA: colAName,
      colB: colBName,
      colC: colCName,
      colD: colDName,
      additional: additionalHeaderNames,
    },
    rows,
    lastModified: new Date().toISOString(),
  };
}

/**
 * Export current sheet state to an actual .xlsx file
 */
export function exportToExcel(
  sheetData: SheetData,
  selectedDateKey: string
): void {
  const headers = [
    sheetData.headers.colA,
    sheetData.headers.colB,
    sheetData.headers.colC,
    sheetData.headers.colD,
    'Verifier Email',
    ...sheetData.headers.additional,
    'Row Notes',
  ];

  const dataRows = sheetData.rows.map((row) => {
    const isChecked = !!row.dailyStatus[selectedDateKey]?.checked;
    const currentStatus = row.dailyStatus[selectedDateKey];
    const lastCheck = row.lastChecked;

    let stampInfo = '';
    let emailInfo = '';
    if (isChecked && currentStatus) {
      stampInfo = `${currentStatus.timestamp} · ${currentStatus.userName}`;
      emailInfo = currentStatus.userEmail || '';
    } else if (lastCheck) {
      stampInfo = `Last: ${lastCheck.timestamp} · ${lastCheck.userName}`;
      emailInfo = lastCheck.userEmail || '';
    } else {
      stampInfo = 'Not checked';
      emailInfo = '—';
    }

    const rowCells: any[] = [
      row.colA,
      row.colB,
      isChecked ? 'Completed' : 'Pending',
      stampInfo,
      emailInfo,
    ];

    sheetData.headers.additional.forEach((header) => {
      rowCells.push(row.additionalCols[header] ?? '');
    });

    rowCells.push(row.notes || '');

    return rowCells;
  });

  const wsData = [headers, ...dataRows];
  const worksheet = XLSX.utils.aoa_to_sheet(wsData);

  // Column widths
  worksheet['!cols'] = [
    { wch: 14 }, // Col A
    { wch: 36 }, // Col B
    { wch: 16 }, // Col C (Status)
    { wch: 36 }, // Col D (Timestamp & User)
    { wch: 30 }, // Verifier Email
    ...sheetData.headers.additional.map(() => ({ wch: 20 })),
    { wch: 30 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetData.sheetName || 'Daily_Checklist');

  const outFileName = `${sheetData.title.replace(/\s+/g, '_')}_${selectedDateKey}.xlsx`;
  XLSX.writeFile(workbook, outFileName);
}

/**
 * Download a starter Excel template file
 */
export function downloadSampleTemplate(): void {
  const headers = [
    'Item ID',
    'Task / Resource (Clickable)',
    'Verification Status',
    'Date Stamp & Verified By',
    'Department',
    'Priority',
    'Standard Operating Procedure',
  ];

  const sampleRows = [
    [
      'OPS-101',
      'https://github.com/daily-ops/checklist-guide',
      '',
      '',
      'Operations',
      'High',
      'SOP-Sec-01',
    ],
    [
      'SEC-204',
      'Server Room Physical Access Log & Temperature Verification',
      '',
      '',
      'IT & Infrastructure',
      'Critical',
      'SOP-DataCenter-4',
    ],
    [
      'QA-305',
      'https://docs.google.com/spreadsheets/d/sample-qa-matrix',
      '',
      '',
      'Quality Assurance',
      'Medium',
      'ISO-9001-Sec-7',
    ],
    [
      'FAC-412',
      'Fire Extinguishers & Emergency Exit Pathways Clearance',
      '',
      '',
      'Facilities',
      'High',
      'OSHA-1910-38',
    ],
    [
      'FIN-501',
      'End of Day POS & Register Cash Balance Reconciliation',
      '',
      '',
      'Finance & Retail',
      'High',
      'Audit-Fin-2026',
    ],
  ];

  const ws = XLSX.utils.aoa_to_sheet([headers, ...sampleRows]);
  ws['!cols'] = [
    { wch: 14 },
    { wch: 42 },
    { wch: 20 },
    { wch: 32 },
    { wch: 22 },
    { wch: 14 },
    { wch: 24 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Checklist_Template');
  XLSX.writeFile(wb, 'Daily_Excel_Checklist_Template.xlsx');
}
