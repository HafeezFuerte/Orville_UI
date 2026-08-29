export type ImportProcessStatus = 'Fully Imported' | 'Partial' | 'Failed' | 'Processing';

export interface ImportLogRow {
  id: string;
  code: string;
  importedAt: string;
  importType: string;
  totalRecords: number;
  jobId: string;
  file: string;
  status: ImportProcessStatus;
}

export interface ImportDetailLine {
  srNo: number;
  excelRowId: number;
  infoType: 'Property' | 'Landlord' | 'Unit' | 'Tenant' | 'Vendor' | 'Other';
  infoValue: string;
  recordId: string;
}

export const IMPORT_LOG_ROWS: ImportLogRow[] = [
  {
    id: '68',
    code: '68',
    importedAt: '14-Jul-2026 11:34 AM',
    importType: 'Rental',
    totalRecords: 581,
    jobId: 'a7f3c91e-2b4d-4e8a-9c1f-6d0e5b8a3f21',
    file: 'rental_import_july.xlsx',
    status: 'Fully Imported',
  },
  {
    id: '67',
    code: '67',
    importedAt: '14-Jul-2026 09:12 AM',
    importType: 'Tenant',
    totalRecords: 64,
    jobId: 'b2e8d04f-9a1c-4f7b-8d2e-1c5a9f0b7e33',
    file: 'tenants_batch_02.csv',
    status: 'Fully Imported',
  },
  {
    id: '66',
    code: '66',
    importedAt: '13-Jul-2026 04:48 PM',
    importType: 'Landlord',
    totalRecords: 42,
    jobId: 'c9d1a55b-3e70-48cf-b6a2-0f8e4d2c1a90',
    file: 'landlords_q3.xlsx',
    status: 'Partial',
  },
  {
    id: '65',
    code: '65',
    importedAt: '12-Jul-2026 02:05 PM',
    importType: 'Unit',
    totalRecords: 210,
    jobId: 'd4f6e22a-1b89-4c3d-9e70-2a1b8c5d6e47',
    file: 'units_master.csv',
    status: 'Processing',
  },
  {
    id: '64',
    code: '64',
    importedAt: '11-Jul-2026 10:22 AM',
    importType: 'Vendor',
    totalRecords: 18,
    jobId: 'e1a0b77c-5d2f-41a8-8c9b-3e4f5a6b7c80',
    file: 'vendors_update.xlsx',
    status: 'Failed',
  },
];

const UNIT_CODES = [
  '113-PR-1',
  '113-PR-2',
  '114-PR-1',
  '201-PR-1',
  '201-PR-2',
  '305-A',
  '402-B',
  '501-C',
  '612-D',
  '701-E',
];

function buildRentalDetailLines(): ImportDetailLine[] {
  const lines: ImportDetailLine[] = [];
  let sr = 1;
  let excelRow = 1;

  // Match screenshot pattern: Property, Landlord, then many Units from excel rows
  lines.push({
    srNo: sr++,
    excelRowId: 1,
    infoType: 'Property',
    infoValue: 'Buteena',
    recordId: '4794',
  });
  lines.push({
    srNo: sr++,
    excelRowId: 2,
    infoType: 'Landlord',
    infoValue: 'rental@orvillerealestate.com',
    recordId: '17782',
  });

  excelRow = 3;
  let recordBase = 18001;
  while (lines.length < 581) {
    const unit = UNIT_CODES[(sr - 1) % UNIT_CODES.length];
    const suffix = Math.floor((sr - 1) / UNIT_CODES.length);
    lines.push({
      srNo: sr,
      excelRowId: excelRow,
      infoType: 'Unit',
      infoValue: suffix === 0 ? unit : `${unit}-${suffix}`,
      recordId: String(recordBase++),
    });
    sr += 1;
    // Keep a few lines sharing the same excel row id (like screenshot)
    if (sr % 3 !== 0) {
      excelRow += 1;
    }
  }

  return lines;
}

export const IMPORT_DETAIL_LINES: Record<string, ImportDetailLine[]> = {
  '68': buildRentalDetailLines(),
};

export function getImportLog(id: string | null): ImportLogRow {
  return IMPORT_LOG_ROWS.find((row) => row.id === id || row.code === id) || IMPORT_LOG_ROWS[0];
}

export function getImportDetailLines(id: string | null): ImportDetailLine[] {
  const key = id || '68';
  if (IMPORT_DETAIL_LINES[key]) {
    return IMPORT_DETAIL_LINES[key];
  }
  // Lightweight fallback for other imports
  const parent = getImportLog(key);
  return Array.from({ length: Math.min(parent.totalRecords, 120) }, (_, i) => ({
    srNo: i + 1,
    excelRowId: i + 1,
    infoType: 'Other' as const,
    infoValue: `${parent.importType} record ${i + 1}`,
    recordId: String(1000 + i),
  }));
}
