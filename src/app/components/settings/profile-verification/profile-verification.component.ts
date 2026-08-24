import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DEFAULT_LANDLORD_FIELD_IDS,
  DEFAULT_TENANT_FIELD_IDS,
  LANDLORD_FIELD_OPTIONS,
  ProfileFieldOption,
  ProfileVerificationTab,
  TENANT_FIELD_OPTIONS,
} from './profile-verification.data';

@Component({
  selector: 'app-profile-verification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-verification.component.html',
  styleUrl: './profile-verification.component.scss',
})
export class ProfileVerificationComponent {
  enabled = true;
  verificationMessage =
    'Please complete your profile verification by providing the required information before continuing.';
  messageSaved = false;

  activeTab: ProfileVerificationTab = 'landlord';
  fieldSearch = '';

  landlordFieldIds = [...DEFAULT_LANDLORD_FIELD_IDS];
  tenantFieldIds = [...DEFAULT_TENANT_FIELD_IDS];

  modalOpen = false;
  modalSearch = '';
  draftFieldIds: string[] = [];

  readonly landlordOptions = LANDLORD_FIELD_OPTIONS;
  readonly tenantOptions = TENANT_FIELD_OPTIONS;

  get roleLabel(): string {
    return this.activeTab === 'landlord' ? 'Landlord' : 'Tenant';
  }

  get fieldOptions(): ProfileFieldOption[] {
    return this.activeTab === 'landlord' ? this.landlordOptions : this.tenantOptions;
  }

  get selectedFieldIds(): string[] {
    return this.activeTab === 'landlord' ? this.landlordFieldIds : this.tenantFieldIds;
  }

  get selectedFields(): ProfileFieldOption[] {
    const ids = this.selectedFieldIds;
    return this.fieldOptions.filter((f) => ids.includes(f.id));
  }

  get filteredSelectedFields(): ProfileFieldOption[] {
    const q = this.fieldSearch.trim().toLowerCase();
    if (!q) {
      return this.selectedFields;
    }
    return this.selectedFields.filter((f) => f.label.toLowerCase().includes(q));
  }

  get modalTitle(): string {
    return `Edit ${this.roleLabel} Mandatory Fields`;
  }

  get modalFilteredOptions(): ProfileFieldOption[] {
    const q = this.modalSearch.trim().toLowerCase();
    if (!q) {
      return this.fieldOptions;
    }
    return this.fieldOptions.filter((f) => f.label.toLowerCase().includes(q));
  }

  get allDraftSelected(): boolean {
    const opts = this.modalFilteredOptions;
    return opts.length > 0 && opts.every((f) => this.draftFieldIds.includes(f.id));
  }

  get someDraftSelected(): boolean {
    if (this.allDraftSelected) {
      return false;
    }
    return this.modalFilteredOptions.some((f) => this.draftFieldIds.includes(f.id));
  }

  setTab(tab: ProfileVerificationTab): void {
    this.activeTab = tab;
    this.fieldSearch = '';
  }

  saveMessage(): void {
    this.messageSaved = true;
    window.setTimeout(() => {
      this.messageSaved = false;
    }, 2500);
  }

  removeField(id: string): void {
    if (this.activeTab === 'landlord') {
      this.landlordFieldIds = this.landlordFieldIds.filter((x) => x !== id);
    } else {
      this.tenantFieldIds = this.tenantFieldIds.filter((x) => x !== id);
    }
  }

  openEditFields(): void {
    this.draftFieldIds = [...this.selectedFieldIds];
    this.modalSearch = '';
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.modalSearch = '';
  }

  isDraftSelected(id: string): boolean {
    return this.draftFieldIds.includes(id);
  }

  toggleDraftField(id: string): void {
    if (!this.enabled) {
      return;
    }
    if (this.draftFieldIds.includes(id)) {
      this.draftFieldIds = this.draftFieldIds.filter((x) => x !== id);
    } else {
      this.draftFieldIds = [...this.draftFieldIds, id];
    }
  }

  toggleSelectAllDraft(): void {
    if (!this.enabled) {
      return;
    }
    const visibleIds = this.modalFilteredOptions.map((f) => f.id);
    if (this.allDraftSelected) {
      this.draftFieldIds = this.draftFieldIds.filter((id) => !visibleIds.includes(id));
    } else {
      const next = new Set(this.draftFieldIds);
      for (const id of visibleIds) {
        next.add(id);
      }
      this.draftFieldIds = [...next];
    }
  }

  saveFields(): void {
    if (!this.enabled) {
      return;
    }
    if (this.activeTab === 'landlord') {
      this.landlordFieldIds = [...this.draftFieldIds];
    } else {
      this.tenantFieldIds = [...this.draftFieldIds];
    }
    this.closeModal();
  }
}
