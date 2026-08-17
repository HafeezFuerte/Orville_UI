export type DownloadFileType = 'All' | 'Excel' | 'PDF';

export type DownloadStatus = 'Pending' | 'Approved' | 'Rejected';

export interface DownloadJob {
  jobId: string;
  inspectionId: string | null;
  type: Exclude<DownloadFileType, 'All'>;
  document: string;
  unit: string | null;
  generatedBy: string;
  email: string;
  requestedAt: string;
  status: DownloadStatus;
  fileSize: string;
  failReason: string | null;
}

export function downloadStatusChip(status: string): string {
  if (status === 'Approved') {
    return 'ov-outline-chip ov-outline-chip--success';
  }
  if (status === 'Rejected') {
    return 'ov-outline-chip ov-outline-chip--danger';
  }
  return 'ov-outline-chip ov-outline-chip--warning';
}

/** Screenshot Download Center rows + mixed statuses for the detail states */
export const DOWNLOAD_CENTER_JOBS: DownloadJob[] = [
  {
    jobId: '53479',
    inspectionId: null,
    type: 'Excel',
    document: 'original_vs_received_rent_report_2026-08-17 07:59:19 +0000.xls',
    unit: 'Saraya Plaza 205-PR-3',
    generatedBy: 'Aniq Ahmed',
    email: 'aniqahmed087@gmail.com',
    requestedAt: '17-08-2026',
    status: 'Approved',
    fileSize: '30.0 KB',
    failReason: null
  },
  {
    jobId: '53480',
    inspectionId: null,
    type: 'PDF',
    document: 'landlord_statement_2026-08-10.pdf',
    unit: 'Saraya Plaza 205-PR-3',
    generatedBy: 'Finance Bot',
    email: 'finance@orville.local',
    requestedAt: '10-08-2026',
    status: 'Pending',
    fileSize: '—',
    failReason: null
  },
  {
    jobId: '53481',
    inspectionId: 'ZrBgmyNOf26q29VU8pLv',
    type: 'Excel',
    document: 'monthly_closing_report_crm_2026-08-09.xls',
    unit: null,
    generatedBy: 'Asif Asif',
    email: 'asif@orville.local',
    requestedAt: '09-08-2026',
    status: 'Rejected',
    fileSize: '—',
    failReason: 'The report could not be generated because the date range returned no records.'
  },
  {
    jobId: '53482',
    inspectionId: null,
    type: 'PDF',
    document: 'vat_invoices_all_properties_2026-08-09.pdf',
    unit: null,
    generatedBy: 'Finance Bot',
    email: 'finance@orville.local',
    requestedAt: '09-08-2026',
    status: 'Approved',
    fileSize: '128 KB',
    failReason: null
  },
  {
    jobId: '53483',
    inspectionId: null,
    type: 'Excel',
    document: 'all_leases_export_2026-08-08.xls',
    unit: 'Marina Gate 12-B',
    generatedBy: 'Asif Asif',
    email: 'asif@orville.local',
    requestedAt: '08-08-2026',
    status: 'Pending',
    fileSize: '—',
    failReason: null
  },
  {
    jobId: 'f43aae26650',
    inspectionId: null,
    type: 'PDF',
    document: 'agent_performance_2026-08-08.pdf',
    unit: null,
    generatedBy: 'Finance Bot',
    email: 'finance@orville.local',
    requestedAt: '08-08-2026',
    status: 'Rejected',
    fileSize: '—',
    failReason: 'Generation failed while writing the PDF. Try again from Reports.'
  },
  {
    jobId: '53485',
    inspectionId: 'Kq91mLp22aX8nR04',
    type: 'Excel',
    document: 'net_revenue_by_property_2026-08-07.xls',
    unit: 'Downtown Views 804',
    generatedBy: 'Asif Asif',
    email: 'asif@orville.local',
    requestedAt: '07-08-2026',
    status: 'Approved',
    fileSize: '86.4 KB',
    failReason: null
  },
  {
    jobId: '53486',
    inspectionId: null,
    type: 'PDF',
    document: 'landlord_consolidated_statement_2026-08-07.pdf',
    unit: 'Saraya Plaza 205-PR-3',
    generatedBy: 'Finance Bot',
    email: 'finance@orville.local',
    requestedAt: '07-08-2026',
    status: 'Pending',
    fileSize: '—',
    failReason: null
  },
  {
    jobId: '53487',
    inspectionId: null,
    type: 'Excel',
    document: 'property_units_overview_2026-08-06.xls',
    unit: null,
    generatedBy: 'Asif Asif',
    email: 'asif@orville.local',
    requestedAt: '06-08-2026',
    status: 'Approved',
    fileSize: '54.2 KB',
    failReason: null
  },
  {
    jobId: '53488',
    inspectionId: 'ZrBgmyNOf26q29VU8pLv',
    type: 'PDF',
    document: 'assets_by_property_2026-08-06.pdf',
    unit: 'Marina Gate 12-B',
    generatedBy: 'Finance Bot',
    email: 'finance@orville.local',
    requestedAt: '06-08-2026',
    status: 'Rejected',
    fileSize: '—',
    failReason: 'The source file was rejected because required property data is incomplete.'
  }
];

export function findDownloadJob(id: string | null): DownloadJob | undefined {
  if (!id) {
    return undefined;
  }
  return DOWNLOAD_CENTER_JOBS.find((job) => job.jobId.toLowerCase() === id.toLowerCase());
}
