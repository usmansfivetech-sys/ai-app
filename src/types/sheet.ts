export interface CheckRecord {
  checked: boolean;
  timestamp: string; // Formatted day date time stamp e.g. "Thu, Sep 24, 2026, 07:05 AM"
  isoTimestamp: string;
  userName: string;
  userEmail: string; // Email identity of the user
  dateKey: string; // YYYY-MM-DD
}

export interface SheetRow {
  id: string;
  colA: string; // Column A (ID, Code, Area, or Index)
  colB: string; // Column B (Clickable reference, title, link, action)
  colBLink?: string; // Optional URL if colB is or contains a link
  additionalCols: Record<string, string | number>;
  // Map of dateKey ("YYYY-MM-DD") to check status on that day
  dailyStatus: Record<string, CheckRecord>;
  // Last recorded check across history
  lastChecked?: CheckRecord;
  notes?: string;
}

export interface SheetData {
  title: string;
  sheetName: string;
  fileName: string;
  headers: {
    colA: string;
    colB: string;
    colC: string;
    colD: string;
    additional: string[];
  };
  rows: SheetRow[];
  lastModified: string;
  uploadedBy?: {
    name: string;
    email: string;
    timestamp: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  isAdmin: boolean; // Only specific admin users can upload or change the fixed Excel file
  avatarColor: string;
}
