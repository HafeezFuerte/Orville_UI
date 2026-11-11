import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommonService } from '../../../services/common.service';
import { Common_TabsService } from '../../portfolio/services/common_tabs.service';

interface DropdownItem {
  code: string;
  name: string;
}

@Component({
  selector: 'app-add-inspection',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NgSelectModule, TranslateModule],
  templateUrl: './add-inspection.component.html',
  styleUrls: []
})
export class AddInspectionComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private commonService = inject(CommonService);
  private commontabService = inject(Common_TabsService);
  private toastr = inject(ToastrService);
  public translate = inject(TranslateService);

  inspectionForm!: FormGroup;

  editCode: string | null = null;
  isEdit = false;
  isLoadingDetails = false;
  isSubmitting = false;
  inspectionStatus = 'Scheduled';

  currentUser = this.commonService.getCurrentUser();
  private valueChangesSub?: Subscription;
  private routeSub?: Subscription;

  inspectionTypes: { id: string; name: string }[] = [
    { id: 'Move Out', name: 'Move Out' },
    { id: 'Move In', name: 'Move In' },
    { id: 'Routine', name: 'Routine' },
    { id: 'Dispute', name: 'Dispute' }
  ];

  properties: DropdownItem[] = [];
  units: DropdownItem[] = [];
  leases: DropdownItem[] = [];
  assets: DropdownItem[] = [];
  inspectors: DropdownItem[] = [];

  // Real-time summary values bindable to form valueChanges
  summaryScope = 'Both';
  summaryType = '-';
  summaryProperty = '-';
  summaryUnit = '-';
  summaryAsset = '-';
  summaryInspector = '-';

  ngOnInit() {
    this.initForm();
    this.loadLookups();

    this.routeSub = this.route.paramMap.subscribe(params => {
      const code = params.get('code');
      if (code) {
        this.editCode = code;
        this.isEdit = true;
        this.loadInspectionDetails(code);
      }
    });
  }

  ngOnDestroy() {
    this.valueChangesSub?.unsubscribe();
    this.routeSub?.unsubscribe();
  }

  private initForm() {
    this.inspectionForm = this.fb.group({
      inspectionType: [null, Validators.required],
      inspectionDateTime: ['', Validators.required],
      scope: ['both'],
      property: [null],
      unit: [null],
      lease: [null],
      asset: [null],
      inspector: [null, Validators.required],
      note: ['']
    });

    this.valueChangesSub = this.inspectionForm.valueChanges.subscribe(val => {
      this.updateSummary(val);
    });
  }

  private updateSummary(val: any) {
    if (!val) return;
    const scope = (val.scope || 'both').toLowerCase();
    this.summaryScope = scope === 'both' ? 'Both' : (scope === 'unit' ? 'Unit' : 'Asset');

    const matchedType = this.inspectionTypes.find(t => t.id === val.inspectionType || t.name === val.inspectionType);
    this.summaryType = matchedType ? matchedType.name : (val.inspectionType || '-');

    const matchedProp = this.properties.find(p => p.code === val.property || p.name === val.property);
    this.summaryProperty = matchedProp ? matchedProp.name : (val.property || '-');

    const matchedUnit = this.units.find(u => u.code === val.unit || u.name === val.unit);
    this.summaryUnit = matchedUnit ? matchedUnit.name : (val.unit || '-');

    const matchedAsset = this.assets.find(a => a.code === val.asset || a.name === val.asset);
    this.summaryAsset = matchedAsset ? matchedAsset.name : (val.asset || '-');

    const matchedInspector = this.inspectors.find(i => i.code === val.inspector || i.name === val.inspector);
    this.summaryInspector = matchedInspector ? matchedInspector.name : (val.inspector || '-');
  }

  // Load master lookups from API
  private loadLookups() {
    // 1. Properties (typeId: 70, filterId: 2)
    this.commontabService.getMasterByType({
      typeId: 70,
      filterId: 2,
      filterText: '',
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res?.statusCode == 200 && res?.objResult?.table) {
          const list: DropdownItem[] = res.objResult.table.map((p: any) => ({
            code: String(p.code || p.id),
            name: p.name || p.property_name || p.code
          }));
          this.mergeDropdownItems('properties', list);
          this.updateSummary(this.inspectionForm.value);
        }
      },
      error: err => console.error('Error loading properties lookup:', err)
    });

    // 2. Inspectors / Technicians (typeId: 70, filterId: 6)
    this.commontabService.getMasterByType({
      typeId: 70,
      filterId: 6,
      filterText: '',
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res?.statusCode == 200 && res?.objResult?.table) {
          const list: DropdownItem[] = res.objResult.table.map((w: any) => ({
            code: String(w.code || w.id),
            name: w.name || w.full_name || w.code
          }));
          this.mergeDropdownItems('inspectors', list);
          this.updateSummary(this.inspectionForm.value);
        }
      },
      error: err => console.error('Error loading inspectors lookup:', err)
    });

    // 3. Assets (typeId: 70, filterId: 7 or standard assets)
    this.commontabService.getMasterByType({
      typeId: 70,
      filterId: 7,
      filterText: '',
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res?.statusCode == 200 && res?.objResult?.table) {
          const list: DropdownItem[] = res.objResult.table.map((a: any) => ({
            code: String(a.code || a.id),
            name: a.name || a.asset_name || a.code
          }));
          this.mergeDropdownItems('assets', list);
          this.updateSummary(this.inspectionForm.value);
        }
      },
      error: err => console.error('Error loading assets lookup:', err)
    });

    // 4. Leases (typeId: 53, filterId: 0)
    this.loadLeases();
  }

  loadUnitsForProperty(propertyCode: string) {
    if (!propertyCode) {
      this.units = [];
      return;
    }
    this.commontabService.getMasterByType({
      typeId: 44,
      filterId: 0,
      filterText: propertyCode,
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res?.statusCode == 200 && res?.objResult?.table) {
          const list: DropdownItem[] = res.objResult.table.map((u: any) => ({
            code: String(u.code || u.unit_code || u.id),
            name: u.name || u.unit_no || u.unit_code || u.code
          }));
          this.mergeDropdownItems('units', list);
          this.updateSummary(this.inspectionForm.value);
        }
      },
      error: err => console.error('Error loading units lookup:', err)
    });
  }

  loadLeases(propertyCode?: string) {
    this.commontabService.getMasterByType({
      typeId: 53,
      filterId: 0,
      filterText: propertyCode || '',
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res?.statusCode == 200 && res?.objResult?.table) {
          const list: DropdownItem[] = res.objResult.table.map((l: any) => ({
            code: String(l.code || l.lease_code || l.id),
            name: l.name || l.lease_number || l.code || l.id
          }));
          this.mergeDropdownItems('leases', list);
          this.updateSummary(this.inspectionForm.value);
        }
      },
      error: err => console.error('Error loading leases lookup:', err)
    });
  }

  onPropertyChange(event: any) {
    const propertyCode = event?.code || event || this.inspectionForm.get('property')?.value;
    this.inspectionForm.patchValue({ unit: null });
    if (propertyCode) {
      this.loadUnitsForProperty(String(propertyCode));
      this.loadLeases(String(propertyCode));
    } else {
      this.units = [];
    }
  }

  loadInspectionDetails(code: string) {
    this.isLoadingDetails = true;
    const currentUser = this.commonService.getCurrentUser();
    const payload = {
      typeId: 100,
      filterId: 0,
      filterText: code,
      filterText1: '',
      userId: currentUser?.userId || 1,
      clientId: currentUser?.clientId || '74BB6922',
      companyId: currentUser?.companyId || 1
    };

    this.commontabService.getMasterByType(payload).subscribe({
      next: (res: any) => {
        this.isLoadingDetails = false;
        if (res && res.objResult) {
          const details = res.objResult.inspection_dtls || res.objResult.table || res.objResult;
          if (Array.isArray(details) && details.length > 0) {
            const data = details[0];
            this.inspectionStatus = data.status || 'Scheduled';

            // Ensure property is present in dropdown
            const propCode = String(data.property_code || data.property || '');
            const propName = data.property || data.property_name || propCode;
            if (propCode) {
              this.ensureItemInList('properties', propCode, propName);
              this.loadUnitsForProperty(propCode);
            }

            // Ensure unit is present in dropdown
            const unitCode = String(data.unit_code || data.unit || '');
            const unitName = data.unit || data.unit_no || unitCode;
            if (unitCode) {
              this.ensureItemInList('units', unitCode, unitName);
            }

            // Ensure inspector is present in dropdown
            const inspectorVal = String(data.inspector_id || data.inspector || '');
            const inspectorName = data.inspector || inspectorVal;
            if (inspectorVal) {
              this.ensureItemInList('inspectors', inspectorVal, inspectorName);
            }

            // Ensure asset is present in dropdown
            const assetVal = String(data.asset_id || data.asset || '');
            const assetName = data.asset || data.asset_name || assetVal;
            if (assetVal) {
              this.ensureItemInList('assets', assetVal, assetName);
            }

            // Ensure lease is present in dropdown
            const leaseVal = String(data.lease_id || data.lease || '');
            const leaseName = data.lease || leaseVal;
            if (leaseVal) {
              this.ensureItemInList('leases', leaseVal, leaseName);
            }

            // Ensure inspection type is present
            const typeVal = data.inspection_type_text || data.inspection_type;
            if (typeVal && !this.inspectionTypes.some(t => t.id === typeVal || t.name === typeVal)) {
              this.inspectionTypes.push({ id: typeVal, name: typeVal });
            }

            const rawScope = String(data.inspection_scope || 'both').toLowerCase();
            const scopeVal = rawScope.includes('unit') ? 'unit' : (rawScope.includes('asset') ? 'asset' : 'both');

            this.inspectionForm.patchValue({
              inspectionType: typeVal || null,
              inspectionDateTime: this.formatForDateTimeLocal(data.inspection_date_time),
              scope: scopeVal,
              property: propCode || null,
              unit: unitCode || null,
              lease: leaseVal || null,
              asset: assetVal || null,
              inspector: inspectorVal || null,
              note: data.details || data.note || ''
            });

            this.updateSummary(this.inspectionForm.value);
          }
        }
      },
      error: (err) => {
        this.isLoadingDetails = false;
        console.error('Error loading inspection details:', err);
        this.toastr.error('Failed to load inspection details');
      }
    });
  }

  private ensureItemInList(listKey: 'properties' | 'units' | 'leases' | 'assets' | 'inspectors', code: string, name: string) {
    if (!code) return;
    const list = this[listKey];
    if (!list.some(item => item.code === code || item.name === code)) {
      list.push({ code, name: name || code });
    }
  }

  private mergeDropdownItems(listKey: 'properties' | 'units' | 'leases' | 'assets' | 'inspectors', incoming: DropdownItem[]) {
    const existing = this[listKey];
    incoming.forEach(inc => {
      if (!existing.some(e => e.code === inc.code)) {
        existing.push(inc);
      }
    });
  }

  formatForDateTimeLocal(dateStr: string | null | undefined): string {
    if (!dateStr) return '';
    try {
      const dt = new Date(dateStr);
      if (isNaN(dt.getTime())) return '';
      const pad = (n: number) => n < 10 ? '0' + n : '' + n;
      const y = dt.getFullYear();
      const m = pad(dt.getMonth() + 1);
      const d = pad(dt.getDate());
      const hours = pad(dt.getHours());
      const minutes = pad(dt.getMinutes());
      return `${y}-${m}-${d}T${hours}:${minutes}`;
    } catch {
      return '';
    }
  }

  formatSummaryDate(dateVal: string | null | undefined): string {
    if (!dateVal) return '-';
    try {
      const dt = new Date(dateVal);
      if (isNaN(dt.getTime())) return dateVal;
      const pad = (n: number) => n < 10 ? '0' + n : '' + n;
      return `${pad(dt.getDate())}-${pad(dt.getMonth() + 1)}-${dt.getFullYear()} ${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
    } catch {
      return dateVal;
    }
  }

  onSubmit() {
    if (this.inspectionForm.invalid) {
      this.inspectionForm.markAllAsTouched();
      this.toastr.warning(
        this.translate.instant('web.common.msgFillRequiredFields') || 'Please fill in all required fields'
      );
      return;
    }

    this.isSubmitting = true;
    const formVal = this.inspectionForm.value;
    const currentUser = this.commonService.getCurrentUser();

    const payload = {
      source: 'web',
      languageid: 1,
      userid: currentUser?.userId || 1,
      company_id: currentUser?.companyId || 1,
      clientId: currentUser?.clientId || '74BB6922',
      code: this.editCode || '',
      inspection_type: formVal.inspectionType || '',
      inspection_date_time: formVal.inspectionDateTime || '',
      inspection_scope: formVal.scope || 'both',
      property_code: formVal.property || '',
      unit_code: formVal.unit || '',
      lease_id: formVal.lease || '',
      asset_id: formVal.asset || '',
      inspector_id: formVal.inspector || '',
      details: formVal.note || '',
      status: this.inspectionStatus || 'Scheduled'
    };

    this.commontabService.saveInspection(payload).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        if (res && (res.statusCode == 200 || res.statusCode == '200' || res.isSuccess || res.status === 200 || res.message === 'Success')) {
          const successMsg = this.isEdit
            ? (this.translate.instant('web.common.msgRecordUpdated') || 'Inspection updated successfully')
            : (this.translate.instant('web.common.msgRecordSaved') || 'Inspection created successfully');
          this.toastr.success(successMsg);
          this.router.navigate(['/inspections/list']);
        } else {
          const msg = res?.message || (this.isEdit ? 'Failed to update inspection' : 'Failed to create inspection');
          this.toastr.error(msg);
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error saving inspection:', err);
        // If server responded with a handled message
        const errMsg = err?.error?.message || err?.message || 'Error occurred while saving inspection';
        this.toastr.error(errMsg);
      }
    });
  }
}
