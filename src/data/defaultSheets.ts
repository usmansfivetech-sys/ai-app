import { SheetData, SheetRow } from '../types/sheet';
import { formatDateKey } from '../utils/dateUtils';

export function createInitialSheet(): SheetData {
  const today = new Date();
  const todayKey = formatDateKey(today);

  // Yesterday date
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayKey = formatDateKey(yesterday);

  // Two days ago date
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);
  const twoDaysAgoKey = formatDateKey(twoDaysAgo);

  const sampleRows: SheetRow[] = [
    {
      id: 'row-1',
      colA: 'OPS-101',
      colB: 'https://status.cloud.google.com/summary',
      colBLink: 'https://status.cloud.google.com',
      additionalCols: {
        Department: 'Cloud Operations',
        Priority: 'High',
        Location: 'DC-West Building A',
        Interval: 'Daily - 08:00 AM',
      },
      dailyStatus: {},
      lastChecked: {
        checked: true,
        timestamp: 'Wed, Sep 23, 2026, 08:15 AM',
        isoTimestamp: `${yesterdayKey}T08:15:00.000Z`,
        userName: 'Usman S.',
        userEmail: 'usman.s.fivetech@gmail.com',
        dateKey: yesterdayKey,
      },
      notes: 'All cloud services operating with 99.99% uptime. Latency within SLA threshold.',
    },
    {
      id: 'row-2',
      colA: 'SEC-202',
      colB: 'Server Room Biometric Access Log & Temperature Audit',
      additionalCols: {
        Department: 'Physical Security',
        Priority: 'Critical',
        Location: 'Server Room 4B',
        Interval: 'Daily - Morning',
      },
      dailyStatus: {},
      lastChecked: {
        checked: true,
        timestamp: 'Wed, Sep 23, 2026, 09:20 AM',
        isoTimestamp: `${yesterdayKey}T09:20:00.000Z`,
        userName: 'Sarah Jenkins',
        userEmail: 'sarah.j@company.com',
        dateKey: yesterdayKey,
      },
      notes: 'Ambient temperature calibrated to 68°F. Biometric audit cleared.',
    },
    {
      id: 'row-3',
      colA: 'FAC-303',
      colB: 'https://www.osha.gov/workplace-safety-inspection',
      colBLink: 'https://www.osha.gov',
      additionalCols: {
        Department: 'Facilities',
        Priority: 'Medium',
        Location: 'Main Floor & Exits',
        Interval: 'Daily - Shift 1',
      },
      dailyStatus: {},
      lastChecked: {
        checked: true,
        timestamp: 'Tue, Sep 22, 2026, 04:45 PM',
        isoTimestamp: `${twoDaysAgoKey}T16:45:00.000Z`,
        userName: 'Alex Rivera',
        userEmail: 'alex.rivera@company.com',
        dateKey: twoDaysAgoKey,
      },
      notes: 'Emergency exit doors tested and unblocked. Fire panel normal.',
    },
    {
      id: 'row-4',
      colA: 'IT-404',
      colB: 'Database Backup Replication & Cold Storage Verification',
      colBLink: 'https://console.cloud.google.com/sql',
      additionalCols: {
        Department: 'Data Engineering',
        Priority: 'Critical',
        Location: 'Primary & Disaster Cluster',
        Interval: 'Daily - 07:00 AM',
      },
      dailyStatus: {},
      lastChecked: {
        checked: true,
        timestamp: 'Wed, Sep 23, 2026, 07:30 AM',
        isoTimestamp: `${yesterdayKey}T07:30:00.000Z`,
        userName: 'Usman S.',
        userEmail: 'usman.s.fivetech@gmail.com',
        dateKey: yesterdayKey,
      },
      notes: 'Snapshot checksums match integrity hash. Retention set for 90 days.',
    },
    {
      id: 'row-5',
      colA: 'QA-505',
      colB: 'Production API Endpoints Health & Error Budget Check',
      colBLink: 'https://datadoghq.com',
      additionalCols: {
        Department: 'Quality Assurance',
        Priority: 'High',
        Location: 'Edge Gateway v2',
        Interval: 'Daily - Continuous',
      },
      dailyStatus: {},
      lastChecked: {
        checked: true,
        timestamp: 'Wed, Sep 23, 2026, 11:10 AM',
        isoTimestamp: `${yesterdayKey}T11:10:00.000Z`,
        userName: 'Elena Rostova',
        userEmail: 'elena.rostova@company.com',
        dateKey: yesterdayKey,
      },
      notes: 'Error budget at 98.4%. Synthetic canary tests passing across all regions.',
    },
    {
      id: 'row-6',
      colA: 'FIN-606',
      colB: 'Payment Gateway Transaction Reconciliation & Settlement Batch',
      additionalCols: {
        Department: 'Finance & Compliance',
        Priority: 'High',
        Location: 'Stripe / Bank Wire Portal',
        Interval: 'Daily - 10:00 AM',
      },
      dailyStatus: {},
      lastChecked: {
        checked: true,
        timestamp: 'Tue, Sep 22, 2026, 05:15 PM',
        isoTimestamp: `${twoDaysAgoKey}T17:15:00.000Z`,
        userName: 'Marcus Vance',
        userEmail: 'marcus.v@company.com',
        dateKey: twoDaysAgoKey,
      },
      notes: 'Zero chargeback discrepancies. Escrow funds transferred smoothly.',
    },
    {
      id: 'row-7',
      colA: 'MED-707',
      colB: 'Emergency First Aid Kit & AED Defibrillator Readiness Check',
      additionalCols: {
        Department: 'Health & Safety',
        Priority: 'Medium',
        Location: 'Floors 1-3 Stations',
        Interval: 'Daily - Morning',
      },
      dailyStatus: {},
      lastChecked: {
        checked: true,
        timestamp: 'Wed, Sep 23, 2026, 08:45 AM',
        isoTimestamp: `${yesterdayKey}T08:45:00.000Z`,
        userName: 'Sarah Jenkins',
        userEmail: 'sarah.j@company.com',
        dateKey: yesterdayKey,
      },
      notes: 'AED battery indicator green. Trauma kit supplies restocked.',
    },
    {
      id: 'row-8',
      colA: 'NET-808',
      colB: 'https://radar.cloudflare.com',
      colBLink: 'https://radar.cloudflare.com',
      additionalCols: {
        Department: 'Network Infrastructure',
        Priority: 'High',
        Location: 'Edge POP & Router Cluster',
        Interval: 'Daily - 09:00 AM',
      },
      dailyStatus: {},
      lastChecked: {
        checked: true,
        timestamp: 'Wed, Sep 23, 2026, 09:05 AM',
        isoTimestamp: `${yesterdayKey}T09:05:00.000Z`,
        userName: 'Usman S.',
        userEmail: 'usman.s.fivetech@gmail.com',
        dateKey: yesterdayKey,
      },
      notes: 'BGP routing tables clean. DDoS mitigation filters armed.',
    },
  ];

  return {
    title: 'Daily Operations & Infrastructure Checklist',
    sheetName: 'Daily_Operations',
    fileName: 'Daily_Operations_Inspection.xlsx',
    headers: {
      colA: 'Item Code',
      colB: 'Task / Reference (Clickable)',
      colC: 'Status Checkbox',
      colD: 'Timestamp & Verified By',
      additional: ['Department', 'Priority', 'Location', 'Interval'],
    },
    rows: sampleRows,
    lastModified: new Date().toISOString(),
    uploadedBy: {
      name: 'Usman S.',
      email: 'usman.s.fivetech@gmail.com',
      timestamp: 'Initial Spreadsheet Template',
    },
  };
}

export const PRESET_USERS = [
  {
    id: 'u1',
    name: 'Usman S.',
    email: 'usman.s.fivetech@gmail.com',
    role: 'Lead Administrator',
    isAdmin: true, // Master owner who can upload & modify fixed Excel
    avatarColor: 'bg-emerald-600',
  },
  {
    id: 'u2',
    name: 'Sarah Jenkins',
    email: 'sarah.j@company.com',
    role: 'Security Supervisor',
    isAdmin: false,
    avatarColor: 'bg-indigo-600',
  },
  {
    id: 'u3',
    name: 'Alex Rivera',
    email: 'alex.rivera@company.com',
    role: 'Compliance Auditor',
    isAdmin: false,
    avatarColor: 'bg-amber-600',
  },
  {
    id: 'u4',
    name: 'Elena Rostova',
    email: 'elena.rostova@company.com',
    role: 'QA Lead',
    isAdmin: false,
    avatarColor: 'bg-sky-600',
  },
];
