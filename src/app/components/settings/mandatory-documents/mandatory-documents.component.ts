import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { CommonService } from '../../../services/common.service';
import { environment } from '../../../../environments/environment';

export interface MandatoryDocumentRow {
  id: number;
  lookup_id: number;
  documentType: string;
  userType: string;
}

export interface DocumentTypeOption {
  id: number;
  name: string;
}

@Component({
  selector: 'app-mandatory-documents',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './mandatory-documents.component.html',
})
export class MandatoryDocumentsComponent implements OnInit {
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private commonService = inject(CommonService);

  enabled = false;
  modalOpen = false;
  editingId: number | null = null;
  isLoading = false;

  draftDocumentTypeId: number = 2;
  draftUserType = 'Tenant';

  readonly documentTypeOptions: DocumentTypeOption[] = [
    { id: 2, name: 'Tenancy Contract' },
    { id: 3, name: 'Trade License' },
    { id: 4, name: 'Passport' },
    { id: 5, name: 'Emirates ID' },
    { id: 6, name: 'Visa' },
  ];

  readonly userTypeOptions = ['Tenant', 'Landlord', 'Both'];

  documents: MandatoryDocumentRow[] = [
    { id: 1, lookup_id: 3, documentType: 'Trade License', userType: 'Landlord' },
    { id: 2, lookup_id: 2, documentType: 'Tenancy Contract', userType: 'Tenant' },
    { id: 3, lookup_id: 4, documentType: 'Passport', userType: 'Both' },
  ];

  private nextId = 4;

  ngOnInit(): void {
    this.fetchMandatoryDocuments();
  }

  get modalTitle(): string {
    return this.editingId == null ? 'Add Mandatory Document' : 'Edit Mandatory Document';
  }

  get modalSubtitle(): string {
    return this.editingId == null
      ? 'Choose the document and who must upload it.'
      : 'Update the document and who must upload it.';
  }

  get canSave(): boolean {
    return !!this.draftDocumentTypeId && !!this.draftUserType;
  }

  // API Call: Fetch Mandatory Documents (TypeId: 2, FilterId: 1005, FilterText: "mandatory_documents")
  fetchMandatoryDocuments(): void {
    this.isLoading = true;
    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: 2,
      filterId: 1005,
      filterText: 'mandatory_documents',
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
              this.parseMandatoryDocumentsData(row.strValue);
            }
          }
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error('Failed to load mandatory documents settings', 'Error');
        console.error('Error fetching mandatory documents:', err);
      },
    });
  }

  private parseMandatoryDocumentsData(strValue: string): void {
    try {
      let parsed = JSON.parse(strValue);
      let docsArray: any[] = [];

      if (Array.isArray(parsed)) {
        docsArray = parsed;
      } else if (parsed && typeof parsed === 'object') {
        if (parsed.is_enabled !== undefined) {
          this.enabled = parsed.is_enabled === 'true' || parsed.is_enabled === true;
        }
        if (Array.isArray(parsed.documents)) {
          docsArray = parsed.documents;
        }
      }

      this.documents = docsArray.map((item: any, idx: number) => {
        const lookupId = Number(item.lookup_id) || (idx + 2);
        const match = this.documentTypeOptions.find((d) => d.id === lookupId);
        const docName = match ? match.name : `Document Type (${lookupId})`;

        let userTypeStr = 'Tenant';
        const impl = (item.implement_on || '').toLowerCase();
        if (impl === 'landlord') userTypeStr = 'Landlord';
        else if (impl === 'both') userTypeStr = 'Both';
        else if (impl === 'tenant') userTypeStr = 'Tenant';

        return {
          id: idx + 1,
          lookup_id: lookupId,
          documentType: docName,
          userType: userTypeStr,
        };
      });
      this.nextId = this.documents.length + 1;
    } catch (e) {
      console.error('Failed to parse mandatory documents JSON:', e);
    }
  }

  // API Call: Save Mandatory Documents (TypeId: 90, FilterId: 1005, FilterText: "mandatory_documents")
  updateSettings(): void {
    this.isLoading = true;
    const strValueObj = {
      is_enabled: String(this.enabled),
      documents: this.documents.map((d) => ({
        lookup_id: d.lookup_id,
        implement_on: d.userType.toLowerCase(),
      })),
    };

    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: 90,
      filterId: 1005,
      filterText: 'mandatory_documents',
      filterText1: JSON.stringify(strValueObj),
      userId: user?.userId || 1,
      clientId: user?.clientId || '74BB6922',
      companyId: user?.companyId || 1,
    };

    const url = environment.apiurl + 'api/Masters/_getMasters';
    this.http.post<any>(url, payload, { headers: this.commonService.updateHeaders() }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res && res.statusCode === '200') {
          this.toastr.success('Mandatory documents settings saved successfully!', 'Success');
          this.fetchMandatoryDocuments();
        } else {
          this.toastr.error(res?.message || 'Failed to save mandatory documents', 'Error');
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error('Failed to save mandatory documents', 'Error');
        console.error('Save mandatory documents error:', err);
      },
    });
  }

  openCreate(): void {
    this.editingId = null;
    this.draftDocumentTypeId = 2;
    this.draftUserType = 'Tenant';
    this.modalOpen = true;
  }

  openEdit(row: MandatoryDocumentRow): void {
    this.editingId = row.id;
    this.draftDocumentTypeId = row.lookup_id;
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
    const match = this.documentTypeOptions.find((d) => d.id === Number(this.draftDocumentTypeId));
    const docName = match ? match.name : `Document Type (${this.draftDocumentTypeId})`;

    if (this.editingId == null) {
      this.documents = [
        ...this.documents,
        {
          id: this.nextId++,
          lookup_id: Number(this.draftDocumentTypeId),
          documentType: docName,
          userType: this.draftUserType,
        },
      ];
    } else {
      this.documents = this.documents.map((d) =>
        d.id === this.editingId
          ? {
              ...d,
              lookup_id: Number(this.draftDocumentTypeId),
              documentType: docName,
              userType: this.draftUserType,
            }
          : d
      );
    }
    this.closeModal();
    this.updateSettings();
  }

  deleteDocument(row: MandatoryDocumentRow): void {
    this.documents = this.documents.filter((d) => d.id !== row.id);
    this.updateSettings();
  }
}
