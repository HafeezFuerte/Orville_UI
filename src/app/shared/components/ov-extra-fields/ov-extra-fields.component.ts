import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, of, forkJoin } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-ov-extra-fields',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './ov-extra-fields.component.html',
  styleUrl: './ov-extra-fields.component.scss',
})
export class OvExtraFieldsComponent implements OnInit, OnChanges {
  private commonService = inject(CommonService);

  @Input() feature: string = 'Property';
  @Input() entityCode: string | null | undefined = '';
  @Input() isEdit: boolean = false;
  @Input() cardTitle: string = 'web.property.lblCustomFields';
  @Input() cardSubtitle: string = 'web.property.lblAdditionalFieldsSpecificToProperty';

  @Output() valuesChange = new EventEmitter<{ [key: string]: any }>();

  extraFields: any[] = [];
  extraFieldValues: { [key: string]: any } = {};
  lookupOptionsMap: { [key: number]: any[] } = {};
  fileNamesMap: { [key: string]: string } = {};
  selectedFilesMap: { [key: string]: File } = {};
  imagePreviewMap: { [key: string]: string } = {};
  isLoading = false;

  ngOnInit(): void {
    this.loadExtraFields();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['feature'] && !changes['feature'].firstChange) {
      this.loadExtraFields();
    } else if (changes['entityCode'] && !changes['entityCode'].firstChange && this.entityCode) {
      this.loadExtraFieldsData();
    }
  }

  loadExtraFields(): void {
    if (!this.feature) return;
    this.isLoading = true;
    this.commonService.getExtraFields(this.feature).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res?.statusCode === '200' && res.objResult) {
          const fields = res.objResult.table || res.objResult.table0 || [];
          this.extraFields = Array.isArray(fields)
            ? fields.filter((f: any) => f.is_visible !== false)
            : [];

          // Initialize default values & load lookups
          this.extraFields.forEach((f: any) => {
            const def = (f.defaultvalue ?? '').trim();
            if (def && def.toLowerCase() !== (f.column_name || '').trim().toLowerCase() && !this.extraFieldValues[f.column_name]) {
              this.extraFieldValues[f.column_name] = def;
            }
            if (f.control_type === 'DP' && (f.dependency_type || f.dependencyType || f.dependency_id)) {
              this.loadLookupOptionsForField(f.dependency_type || f.dependencyType || f.dependency_id);
            }
          });

          if (this.entityCode) {
            this.loadExtraFieldsData();
          }
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error(`Error loading extra fields for ${this.feature}:`, err);
      },
    });
  }

  loadExtraFieldsData(): void {
    const code = String(this.entityCode || '').trim();
    if (!this.feature || !code) return;
    this.commonService.getExtraFieldsData(this.feature, code).subscribe({
      next: (res: any) => {
        if (res?.statusCode === '200' && res.objResult) {
          const rows = res.objResult.table || res.objResult.table0 || [];
          if (Array.isArray(rows) && rows.length > 0) {
            const data = rows[0];
            this.extraFields.forEach((f: any) => {
              const colName = (f.column_name || '').toLowerCase();
              let rawVal = data[f.column_name];
              if (rawVal === undefined || rawVal === null) {
                const foundKey = Object.keys(data).find((k) => k.toLowerCase() === colName);
                if (foundKey) {
                  rawVal = data[foundKey];
                }
              }
              if (rawVal !== undefined && rawVal !== null && rawVal !== '') {
                this.extraFieldValues[f.column_name] = rawVal;
              } else {
                const def = (f.defaultvalue ?? '').trim();
                if (def && def.toLowerCase() !== (f.column_name || '').trim().toLowerCase() && !this.extraFieldValues[f.column_name]) {
                  this.extraFieldValues[f.column_name] = def;
                }
              }
            });
            this.valuesChange.emit(this.extraFieldValues);
          }
        }
      },
      error: (err: any) => console.error(`Error loading extra fields data for ${this.feature}:`, err),
    });
  }

  loadLookupOptionsForField(typeId: any): void {
    const tid = Number(typeId) || 0;
    if (!tid || this.lookupOptionsMap[tid]) return;
    this.commonService.getLookupOptions(tid).subscribe({
      next: (res: any) => {
        if (res?.statusCode === '200' && res.objResult?.table) {
          this.lookupOptionsMap[tid] = res.objResult.table.map((item: any) => ({
            id: item.id ?? item.country_id ?? item.state_id ?? item.city_id ?? 0,
            name: item.name || item.lookup_name || item.code || '',
            code: item.code || '',
          }));
        }
      },
      error: (err: any) => console.error('Failed to load lookup options for field:', err),
    });
  }

  getLookupOptions(typeId: any): any[] {
    const tid = Number(typeId) || 0;
    return this.lookupOptionsMap[tid] || [];
  }

  getProbableValuesList(val: string): string[] {
    if (!val) return [];
    return val.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
  }

  onFileSelected(event: Event, colName: string, isImage = false): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFilesMap[colName] = file;
      this.fileNamesMap[colName] = file.name;
      this.extraFieldValues[colName] = file.name;
      if (isImage) {
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreviewMap[colName] = reader.result as string;
        };
        reader.readAsDataURL(file);
      }
      this.onValueChange();
    }
  }

  onValueChange(): void {
    this.valuesChange.emit(this.extraFieldValues);
  }

  hasFields(): boolean {
    return Array.isArray(this.extraFields) && this.extraFields.length > 0;
  }

  getSerializedPairs(): string {
    if (!this.extraFields || this.extraFields.length === 0) return '';
    return this.extraFields
      .map((f: any) => {
        const val = (this.extraFieldValues[f.column_name] ?? f.defaultvalue ?? '').toString().replace(/'/g, "''");
        return `${f.column_name}='${val}'`;
      })
      .join(',');
  }

  save(entityCode?: string): Observable<any> {
    const code = entityCode || this.entityCode;
    if (!code || !this.hasFields()) {
      return of(null);
    }

    const fileCols = Object.keys(this.selectedFilesMap);
    const user = this.commonService.getCurrentUser();

    // If no physical files were selected to upload, directly save extra fields data
    if (fileCols.length === 0) {
      return this.executeSaveExtraFieldsData(code);
    }

    // Upload each physical file in a loop via save_documents
    const uploadObservables = fileCols.map((colName) => {
      const file = this.selectedFilesMap[colName];
      const request = {
        userId: Number(user?.userId) || 1,
        clientId: user?.clientId || '74BB6922',
        company_id: Number(user?.companyId) || 1,
        source: 'web',
        languageid: 1,
        code: '',
        entity_id: code,
        entity: this.feature,
        document_type: 0,
        document_no: '',
        issue_date: '',
        expiry_date: '',
        issuing_authority: '',
        share_with_tenants: false,
        share_with_landlords: false,
      };
      const formData = new FormData();
      formData.append('reqObject', JSON.stringify(request));
      formData.append('file_path', file);

      return this.commonService.saveAttachment(formData).pipe(
        map((res: any) => {
          const savedPath =
            res?.objResult?.file_path ||
            res?.objResult?.table?.[0]?.file_path ||
            res?.objResult?.table?.[0]?.filename ||
            res?.objResult?.table?.[0]?.file_name ||
            res?.objResult?.table?.[0]?.url ||
            file.name;
          this.extraFieldValues[colName] = savedPath;
          return savedPath;
        }),
        catchError((err: any) => {
          console.error(`Error uploading custom field file for ${colName}:`, err);
          this.extraFieldValues[colName] = file.name;
          return of(file.name);
        })
      );
    });

    return forkJoin(uploadObservables).pipe(
      switchMap(() => this.executeSaveExtraFieldsData(code))
    );
  }

  private executeSaveExtraFieldsData(code: string): Observable<any> {
    const pairs = this.getSerializedPairs();
    const user = this.commonService.getCurrentUser();
    const payload = {
      clientId: user?.clientId || '74BB6922',
      source: 'web',
      languageid: 1,
      entity: this.feature,
      entity_code: code,
      extrafields_data: pairs,
    };
    return this.commonService.saveExtraFieldData(payload);
  }
}
