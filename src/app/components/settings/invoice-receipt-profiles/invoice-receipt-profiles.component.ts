import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { CommonService } from '../../../services/common.service';
import { environment } from '../../../../environments/environment';
import {
  DEFAULT_INVOICE_RECEIPT_PROFILES,
  EMPTY_INVOICE_RECEIPT_PROFILE,
  IRP_CITIES_BY_STATE,
  IRP_COUNTRIES,
  IRP_STATES_BY_COUNTRY,
  InvoiceReceiptProfile,
} from './invoice-receipt-profiles.data';

@Component({
  selector: 'app-invoice-receipt-profiles',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './invoice-receipt-profiles.component.html',
  styleUrl: './invoice-receipt-profiles.component.scss',
})
export class InvoiceReceiptProfilesComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private commonService = inject(CommonService);

  searchQuery = '';
  modalOpen = false;
  editingId: number | null = null;
  isDuplicate = false;
  dropActive = false;
  isLoading = false;

  draft: Omit<InvoiceReceiptProfile, 'id'> = { ...EMPTY_INVOICE_RECEIPT_PROFILE };
  rows: InvoiceReceiptProfile[] = [];

  readonly countries = IRP_COUNTRIES;
  private nextId = 1;
  private selectedLogoFile: File | null = null;

  get filteredRows(): InvoiceReceiptProfile[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      return this.rows;
    }
    return this.rows.filter(
      (row) =>
        row.name.toLowerCase().includes(q) ||
        row.city.toLowerCase().includes(q) ||
        row.address1.toLowerCase().includes(q) ||
        row.country.toLowerCase().includes(q)
    );
  }

  get countLabel(): string {
    const n = this.filteredRows.length;
    return `${n} profile${n === 1 ? '' : 's'}`;
  }

  get modalTitle(): string {
    if (this.isDuplicate) {
      return 'Duplicate Invoice/Receipt Profile';
    }
    return this.editingId == null ? 'New Invoice/Receipt Profile' : 'Edit Invoice/Receipt Profile';
  }

  get canSave(): boolean {
    return this.draft.name.trim().length > 0;
  }

  get stateOptions(): string[] {
    if (!this.draft.country) {
      return [];
    }
    return IRP_STATES_BY_COUNTRY[this.draft.country] ?? [];
  }

  get cityOptions(): string[] {
    if (!this.draft.state) {
      return [];
    }
    return IRP_CITIES_BY_STATE[this.draft.state] ?? [];
  }

  ngOnInit(): void {
    this.fetchProfiles();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  // API Call: Fetch Profiles (TypeId: 2, FilterId: 1005, FilterText: "invoice_receipt_profiles")
  fetchProfiles(): void {
    this.isLoading = true;
    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: 2,
      filterId: 1005,
      filterText: 'invoice_receipt_profiles',
      filterText1: '',
      userId: user?.userId || 1,
      clientId: user?.clientId || '74BB6922',
      companyId: user?.companyId || 1,
    };

    const url = environment.apiurl + 'api/Masters/_getMasters';
    this.http.post<any>(url, payload, { headers: this.commonService.updateHeaders() }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res && res.statusCode === '200' && res.objResult) {
          const records = res.objResult.table || res.objResult.table0 || res.objResult;
          if (Array.isArray(records) && records.length > 0) {
            const row = records[0];
            if (row.strValue) {
              try {
                const parsed = JSON.parse(row.strValue);
                if (Array.isArray(parsed)) {
                  this.rows = parsed;
                  const maxId = this.rows.reduce((max, r) => (r.id > max ? r.id : max), 0);
                  this.nextId = maxId + 1;
                  return;
                }
              } catch (e) {
                console.error('Failed to parse invoice_receipt_profiles strValue:', e);
              }
            }
          }
        }
        // Fallback if no records found
        this.rows = DEFAULT_INVOICE_RECEIPT_PROFILES.map((r) => ({ ...r }));
        this.nextId = 2;
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error('Failed to load invoice receipt profiles', 'Error');
        console.error('Error fetching invoice receipt profiles:', err);
      },
    });
  }

  openCreate(): void {
    this.editingId = null;
    this.isDuplicate = false;
    this.selectedLogoFile = null;
    this.draft = { ...EMPTY_INVOICE_RECEIPT_PROFILE };
    this.modalOpen = true;
  }

  openEdit(row: InvoiceReceiptProfile): void {
    this.editingId = row.id;
    this.isDuplicate = false;
    this.selectedLogoFile = null;
    this.draft = { ...row };
    this.modalOpen = true;
  }

  duplicate(row: InvoiceReceiptProfile): void {
    this.editingId = null;
    this.isDuplicate = true;
    this.selectedLogoFile = null;
    this.draft = {
      ...row,
      name: `${row.name} (Copy)`,
    };
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.isDuplicate = false;
    this.dropActive = false;
    this.selectedLogoFile = null;
  }

  onCountryChange(): void {
    const states = this.stateOptions;
    if (!states.includes(this.draft.state)) {
      this.draft.state = '';
      this.draft.city = '';
    }
  }

  onStateChange(): void {
    const cities = this.cityOptions;
    if (cities.length > 0 && !cities.includes(this.draft.city)) {
      this.draft.city = '';
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.applyLogoFile(file);
    input.value = '';
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dropActive = false;
    const file = event.dataTransfer?.files?.[0];
    this.applyLogoFile(file);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dropActive = true;
  }

  onDragLeave(): void {
    this.dropActive = false;
  }

  removeLogo(): void {
    this.selectedLogoFile = null;
    this.draft.logoName = '';
    this.draft.logoUrl = '';
  }

  // Upload image file if selected
  private uploadLogoFile(): Observable<string> {
    if (!this.selectedLogoFile) {
      return new Observable((observer) => {
        observer.next(this.draft.logoUrl);
        observer.complete();
      });
    }

    const user = this.commonService.getCurrentUser();
    const reqObject = {
      userId: user?.userId || 1,
      clientId: user?.clientId || '74BB6922',
      company_id: user?.companyId || 1,
      source: 'web',
      languageid: 1,
      code: '',
      entity_id: '1',
      entity: 'InvoiceReceiptProfile',
      document_type: 28,
      document_no: 'IRP-' + Math.floor(Math.random() * 1000000),
      issue_date: new Date().toISOString().substring(0, 10),
      expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
      issuing_authority: 'System',
      share_with_tenants: true,
      status: 33,
      share_with_landlords: true,
    };

    const formData = new FormData();
    formData.append('reqObject', JSON.stringify(reqObject));
    formData.append('file_path', this.selectedLogoFile);

    const url = environment.apiurl + 'api/Masters/save_documents';
    return new Observable((observer) => {
      this.http.post<any>(url, formData, { headers: this.commonService.updateHeaders() }).subscribe({
        next: (res) => {
          let uploadedUrl = '';
          if (res && (res.statusCode === '200' || res.statusCode === 200)) {
            uploadedUrl =
              res.objResult?.file_path ||
              (Array.isArray(res.objResult?.table) ? res.objResult.table[0]?.file_path : '') ||
              '';
          }
          observer.next(uploadedUrl || this.draft.logoUrl);
          observer.complete();
        },
        error: (err) => {
          console.error('Failed to upload profile logo:', err);
          observer.next(this.draft.logoUrl);
          observer.complete();
        },
      });
    });
  }

  save(): void {
    if (!this.canSave) {
      return;
    }
    this.isLoading = true;
    this.uploadLogoFile().subscribe({
      next: (logoUrl) => {
        const payload: Omit<InvoiceReceiptProfile, 'id'> = {
          ...this.draft,
          name: this.draft.name.trim(),
          email: this.draft.email.trim(),
          phone: this.draft.phone.trim(),
          vat: this.draft.vat.trim(),
          address1: this.draft.address1.trim(),
          address2: this.draft.address2.trim(),
          city: this.draft.city.trim(),
          postcode: this.draft.postcode.trim(),
          footer: this.draft.footer.trim(),
          logoUrl: logoUrl,
        };

        let updatedRows: InvoiceReceiptProfile[];
        if (this.editingId == null) {
          updatedRows = [...this.rows, { id: this.nextId++, ...payload }];
        } else {
          updatedRows = this.rows.map((row) =>
            row.id === this.editingId ? { ...row, ...payload } : row
          );
        }
        this.closeModal();
        this.saveProfilesBackend(updatedRows);
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error('Failed to save profile logo', 'Error');
        console.error('Save profile logo error:', err);
      },
    });
  }

  deleteProfile(row: InvoiceReceiptProfile): void {
    const updatedRows = this.rows.filter((r) => r.id !== row.id);
    this.saveProfilesBackend(updatedRows);
  }

  // API Call: Save / Update Profiles (TypeId: 90, FilterId: 1005, FilterText: "invoice_receipt_profiles")
  private saveProfilesBackend(rowsToSave: InvoiceReceiptProfile[]): void {
    this.isLoading = true;
    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: 90,
      filterId: 1005,
      filterText: 'invoice_receipt_profiles',
      filterText1: JSON.stringify(rowsToSave),
      userId: user?.userId || 1,
      clientId: user?.clientId || '74BB6922',
      companyId: user?.companyId || 1,
    };

    const url = environment.apiurl + 'api/Masters/_getMasters';
    this.http.post<any>(url, payload, { headers: this.commonService.updateHeaders() }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res && res.statusCode === '200') {
          this.toastr.success('Invoice & Receipt profiles updated successfully!', 'Success');
          this.selectedLogoFile = null;
          this.fetchProfiles();
        } else {
          this.toastr.error(res?.message || 'Failed to update invoice receipt profiles', 'Error');
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error('Failed to update invoice receipt profiles', 'Error');
        console.error('Save invoice receipt profiles error:', err);
      },
    });
  }

  private applyLogoFile(file?: File): void {
    if (!file || !file.type.startsWith('image/')) {
      return;
    }
    this.selectedLogoFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.draft.logoName = file.name;
      this.draft.logoUrl = String(reader.result ?? '');
    };
    reader.readAsDataURL(file);
  }
}

