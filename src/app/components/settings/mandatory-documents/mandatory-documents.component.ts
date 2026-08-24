import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface MandatoryDocumentRow {
  id: number;
  documentType: string;
  userType: string;
}

@Component({
  selector: 'app-mandatory-documents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mandatory-documents.component.html',
})
export class MandatoryDocumentsComponent {
  enabled = true;
  modalOpen = false;
  editingId: number | null = null;

  draftDocumentType = 'Tenancy Contract';
  draftUserType = 'Tenant';

  readonly documentTypeOptions = [
    'Tenancy Contract',
    'Emirates ID',
    'Trade License',
    'Passport',
    'Visa',
  ];

  readonly userTypeOptions = ['Tenant', 'Landlord'];

  documents: MandatoryDocumentRow[] = [
    { id: 1, documentType: 'Tenancy Contract', userType: 'Tenant' },
    { id: 2, documentType: 'Emirates ID', userType: 'Tenant' },
    { id: 3, documentType: 'Trade License', userType: 'Landlord' },
  ];

  private nextId = 4;

  get modalTitle(): string {
    return this.editingId == null ? 'Add Mandatory Document' : 'Edit Mandatory Document';
  }

  get modalSubtitle(): string {
    return this.editingId == null
      ? 'Choose the document and who must upload it.'
      : 'Update the document and who must upload it.';
  }

  get canSave(): boolean {
    return !!this.draftDocumentType && !!this.draftUserType;
  }

  updateSettings(): void {
    // Frontend-only: settings are local mock state.
  }

  openCreate(): void {
    this.editingId = null;
    this.draftDocumentType = 'Tenancy Contract';
    this.draftUserType = 'Tenant';
    this.modalOpen = true;
  }

  openEdit(row: MandatoryDocumentRow): void {
    this.editingId = row.id;
    this.draftDocumentType = row.documentType;
    this.draftUserType = row.userType;
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.editingId = null;
  }

  saveDocument(): void {
    if (!this.canSave) {
      return;
    }
    if (this.editingId == null) {
      this.documents = [
        ...this.documents,
        {
          id: this.nextId++,
          documentType: this.draftDocumentType,
          userType: this.draftUserType,
        },
      ];
    } else {
      this.documents = this.documents.map((d) =>
        d.id === this.editingId
          ? {
              ...d,
              documentType: this.draftDocumentType,
              userType: this.draftUserType,
            }
          : d
      );
    }
    this.closeModal();
  }

  deleteDocument(row: MandatoryDocumentRow): void {
    this.documents = this.documents.filter((d) => d.id !== row.id);
  }
}
