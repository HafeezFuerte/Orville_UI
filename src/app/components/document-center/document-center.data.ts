export type DocumentAttachment =
  | 'All'
  | 'Unit'
  | 'Room'
  | 'Property'
  | 'Tenant'
  | 'Lease'
  | 'Item'
  | 'WorkOrder';

export interface CenterDocument {
  id: string;
  type: string;
  attachmentOf: Exclude<DocumentAttachment, 'All'>;
  name: string;
  status: string;
  issueDate: string;
  expiryDate: string | null;
  sharedWith: string;
  fileName: string;
  fileSize: string;
  uploadedBy: string;
}

/** Figma 5012:94474 list rows + detail file chrome from the Document Details screenshot */
export const DOCUMENT_CENTER_ROWS: CenterDocument[] = [
  {
    id: 'DOC-31658',
    type: 'Passport',
    attachmentOf: 'Tenant',
    name: 'Syeda Anam Fatima Bukhari',
    status: 'Pending',
    issueDate: '12-01-2025',
    expiryDate: null,
    sharedWith: 'Finance Team',
    fileName: 'DAS 104-PR-2 CTF AUG13-26.pdf',
    fileSize: '324 KB',
    uploadedBy: 'Jenelyn Bandoles'
  },
  {
    id: 'DOC-31659',
    type: 'Emirates ID',
    attachmentOf: 'Tenant',
    name: 'Mohammad Usama Khan',
    status: 'Approved',
    issueDate: '18-01-2025',
    expiryDate: null,
    sharedWith: 'Legal Team',
    fileName: 'Emirates-ID-Usama-Khan.pdf',
    fileSize: '218 KB',
    uploadedBy: 'Jenelyn Bandoles'
  },
  {
    id: 'DOC-31660',
    type: 'Photo',
    attachmentOf: 'Tenant',
    name: 'Ayesha Siddiqui',
    status: 'Rejected',
    issueDate: '22-01-2025',
    expiryDate: null,
    sharedWith: 'Zaid Rahman',
    fileName: 'Ayesha-Siddiqui-photo.jpg',
    fileSize: '156 KB',
    uploadedBy: 'Jenelyn Bandoles'
  },
  {
    id: 'DOC-31661',
    type: 'Visa',
    attachmentOf: 'Tenant',
    name: 'Bilal Ahmed',
    status: 'Pending',
    issueDate: '02-02-2025',
    expiryDate: null,
    sharedWith: 'Finance Team',
    fileName: 'Visa-Bilal-Ahmed.pdf',
    fileSize: '412 KB',
    uploadedBy: 'Jenelyn Bandoles'
  },
  {
    id: 'DOC-31662',
    type: 'Trade License',
    attachmentOf: 'Tenant',
    name: 'Fatima Noor',
    status: 'Approved',
    issueDate: '09-02-2025',
    expiryDate: null,
    sharedWith: 'Operations',
    fileName: 'Trade-License-Fatima-Noor.pdf',
    fileSize: '540 KB',
    uploadedBy: 'Jenelyn Bandoles'
  },
  {
    id: 'DOC-31663',
    type: 'Passport',
    attachmentOf: 'Tenant',
    name: 'Hassan Ali',
    status: 'Rejected',
    issueDate: '14-02-2025',
    expiryDate: null,
    sharedWith: 'Legal Team',
    fileName: 'Passport-Hassan-Ali.pdf',
    fileSize: '298 KB',
    uploadedBy: 'Jenelyn Bandoles'
  },
  {
    id: 'DOC-31664',
    type: 'Emirates ID',
    attachmentOf: 'Tenant',
    name: 'Maryam Zahra',
    status: 'Pending',
    issueDate: '20-02-2025',
    expiryDate: null,
    sharedWith: 'Zaid Rahman',
    fileName: 'Emirates-ID-Maryam-Zahra.pdf',
    fileSize: '204 KB',
    uploadedBy: 'Jenelyn Bandoles'
  },
  {
    id: 'DOC-31665',
    type: 'Photo',
    attachmentOf: 'Tenant',
    name: 'Omar Farooq',
    status: 'Approved',
    issueDate: '01-03-2025',
    expiryDate: null,
    sharedWith: 'Finance Team',
    fileName: 'Omar-Farooq-photo.jpg',
    fileSize: '188 KB',
    uploadedBy: 'Jenelyn Bandoles'
  },
  {
    id: 'DOC-31666',
    type: 'Lease Agreement',
    attachmentOf: 'Tenant',
    name: 'Sara Khan',
    status: 'Pending',
    issueDate: '07-03-2025',
    expiryDate: null,
    sharedWith: 'Operations',
    fileName: 'Lease-Agreement-Sara-Khan.pdf',
    fileSize: '1.2 MB',
    uploadedBy: 'Jenelyn Bandoles'
  },
  {
    id: 'DOC-31667',
    type: 'Emirates ID',
    attachmentOf: 'Tenant',
    name: 'Zain Malik',
    status: 'Rejected',
    issueDate: '11-03-2025',
    expiryDate: null,
    sharedWith: 'Legal Team',
    fileName: 'Emirates-ID-Zain-Malik.pdf',
    fileSize: '231 KB',
    uploadedBy: 'Jenelyn Bandoles'
  }
];

export function documentStatusChip(status: string): string {
  if (status === 'Approved') {
    return 'ov-outline-chip ov-outline-chip--success';
  }
  if (status === 'Rejected') {
    return 'ov-outline-chip ov-outline-chip--danger';
  }
  return 'ov-outline-chip ov-outline-chip--warning';
}

export function findCenterDocument(id: string | null): CenterDocument | undefined {
  if (!id) {
    return undefined;
  }
  return DOCUMENT_CENTER_ROWS.find((row) => row.id.toLowerCase() === id.toLowerCase());
}
