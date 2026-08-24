import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface AttachmentTypeRow {
  id: number;
  name: string;
  hasIssueDate: boolean;
  hasExpiryDate: boolean;
  hasNumber: boolean;
  hasIssuingAuthority: boolean;
  hasFutureIssueDate: boolean;
  renewAttachment: boolean;
  attachmentsCount: number;
  expiryReminderDays: number;
}

@Component({
  selector: 'app-attachment-types',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './attachment-types.component.html',
})
export class AttachmentTypesComponent {
  searchQuery = '';
  modalOpen = false;
  editingId: number | null = null;

  draftName = '';
  draftExpiryReminder = 0;
  draftHasIssueDate = false;
  draftHasExpiryDate = false;
  draftHasNumber = false;
  draftHasIssuingAuthority = false;
  draftHasFutureIssueDate = false;
  draftRenewAttachment = false;

  rows: AttachmentTypeRow[] = [
    {
      id: 929,
      name: 'Tenancy Contract',
      hasIssueDate: true,
      hasExpiryDate: true,
      hasNumber: true,
      hasIssuingAuthority: true,
      hasFutureIssueDate: true,
      renewAttachment: false,
      attachmentsCount: 5479,
      expiryReminderDays: 0,
    },
    {
      id: 1018,
      name: 'Visa',
      hasIssueDate: true,
      hasExpiryDate: true,
      hasNumber: true,
      hasIssuingAuthority: true,
      hasFutureIssueDate: true,
      renewAttachment: false,
      attachmentsCount: 234,
      expiryReminderDays: 0,
    },
    {
      id: 1019,
      name: 'Passport',
      hasIssueDate: true,
      hasExpiryDate: true,
      hasNumber: true,
      hasIssuingAuthority: true,
      hasFutureIssueDate: true,
      renewAttachment: false,
      attachmentsCount: 412,
      expiryReminderDays: 0,
    },
    {
      id: 1020,
      name: 'ID',
      hasIssueDate: true,
      hasExpiryDate: true,
      hasNumber: true,
      hasIssuingAuthority: true,
      hasFutureIssueDate: true,
      renewAttachment: false,
      attachmentsCount: 891,
      expiryReminderDays: 0,
    },
    {
      id: 1021,
      name: 'Photo',
      hasIssueDate: false,
      hasExpiryDate: false,
      hasNumber: false,
      hasIssuingAuthority: false,
      hasFutureIssueDate: false,
      renewAttachment: false,
      attachmentsCount: 156,
      expiryReminderDays: 0,
    },
    {
      id: 1022,
      name: 'Document',
      hasIssueDate: false,
      hasExpiryDate: false,
      hasNumber: false,
      hasIssuingAuthority: false,
      hasFutureIssueDate: false,
      renewAttachment: false,
      attachmentsCount: 3201,
      expiryReminderDays: 0,
    },
    {
      id: 1023,
      name: 'After Image',
      hasIssueDate: false,
      hasExpiryDate: false,
      hasNumber: false,
      hasIssuingAuthority: false,
      hasFutureIssueDate: false,
      renewAttachment: false,
      attachmentsCount: 88,
      expiryReminderDays: 0,
    },
    {
      id: 1024,
      name: 'Before Image',
      hasIssueDate: false,
      hasExpiryDate: false,
      hasNumber: false,
      hasIssuingAuthority: false,
      hasFutureIssueDate: false,
      renewAttachment: false,
      attachmentsCount: 92,
      expiryReminderDays: 0,
    },
    {
      id: 1025,
      name: 'Trade License',
      hasIssueDate: true,
      hasExpiryDate: true,
      hasNumber: true,
      hasIssuingAuthority: true,
      hasFutureIssueDate: true,
      renewAttachment: false,
      attachmentsCount: 67,
      expiryReminderDays: 0,
    },
  ];

  private nextId = 1100;

  get filteredRows(): AttachmentTypeRow[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      return this.rows;
    }
    return this.rows.filter(
      (row) =>
        row.name.toLowerCase().includes(q) || String(row.id).includes(q)
    );
  }

  get countLabel(): string {
    const n = this.filteredRows.length;
    return `${n} type${n === 1 ? '' : 's'}`;
  }

  get modalTitle(): string {
    return this.editingId == null ? 'New Document Type' : 'Edit Document Type';
  }

  get canSave(): boolean {
    return this.draftName.trim().length > 0 && this.draftExpiryReminder >= 0;
  }

  openCreate(): void {
    this.editingId = null;
    this.draftName = '';
    this.draftExpiryReminder = 0;
    this.draftHasIssueDate = false;
    this.draftHasExpiryDate = false;
    this.draftHasNumber = false;
    this.draftHasIssuingAuthority = false;
    this.draftHasFutureIssueDate = false;
    this.draftRenewAttachment = false;
    this.modalOpen = true;
  }

  openEdit(row: AttachmentTypeRow): void {
    this.editingId = row.id;
    this.draftName = row.name;
    this.draftExpiryReminder = row.expiryReminderDays;
    this.draftHasIssueDate = row.hasIssueDate;
    this.draftHasExpiryDate = row.hasExpiryDate;
    this.draftHasNumber = row.hasNumber;
    this.draftHasIssuingAuthority = row.hasIssuingAuthority;
    this.draftHasFutureIssueDate = row.hasFutureIssueDate;
    this.draftRenewAttachment = row.renewAttachment;
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.editingId = null;
  }

  saveType(): void {
    if (!this.canSave) {
      return;
    }
    const name = this.draftName.trim();
    if (this.editingId == null) {
      this.rows = [
        {
          id: this.nextId++,
          name,
          hasIssueDate: this.draftHasIssueDate,
          hasExpiryDate: this.draftHasExpiryDate,
          hasNumber: this.draftHasNumber,
          hasIssuingAuthority: this.draftHasIssuingAuthority,
          hasFutureIssueDate: this.draftHasFutureIssueDate,
          renewAttachment: this.draftRenewAttachment,
          attachmentsCount: 0,
          expiryReminderDays: this.draftExpiryReminder,
        },
        ...this.rows,
      ];
    } else {
      this.rows = this.rows.map((r) =>
        r.id === this.editingId
          ? {
              ...r,
              name,
              hasIssueDate: this.draftHasIssueDate,
              hasExpiryDate: this.draftHasExpiryDate,
              hasNumber: this.draftHasNumber,
              hasIssuingAuthority: this.draftHasIssuingAuthority,
              hasFutureIssueDate: this.draftHasFutureIssueDate,
              renewAttachment: this.draftRenewAttachment,
              expiryReminderDays: this.draftExpiryReminder,
            }
          : r
      );
    }
    this.closeModal();
  }

  deleteType(row: AttachmentTypeRow): void {
    this.rows = this.rows.filter((r) => r.id !== row.id);
  }
}
