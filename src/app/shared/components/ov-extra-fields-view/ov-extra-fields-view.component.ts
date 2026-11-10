import { Component, Input, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { CommonService } from '../../../services/common.service';

export interface ExtraFieldDisplayItem {
  label: string;
  value: string;
  isEmpty: boolean;
  controlType: string;
  dependencyType?: number;
}

@Component({
  selector: 'app-ov-extra-fields-view',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './ov-extra-fields-view.component.html',
  styleUrl: './ov-extra-fields-view.component.scss',
})
export class OvExtraFieldsViewComponent implements OnInit, OnChanges {
  private commonService = inject(CommonService);

  @Input() feature: string = 'Property';
  @Input() entityCode: string = '';
  @Input() cardTitle: string = 'web.property.lblCustomFields';
  @Input() styleVariant: 'card' | 'panel' | 'ld-panel' | 'ticket' | 'invoice' = 'card';

  displayFields: ExtraFieldDisplayItem[] = [];
  isLoading = false;

  ngOnInit(): void {
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes['feature'] && !changes['feature'].firstChange) ||
      (changes['entityCode'] && !changes['entityCode'].firstChange)
    ) {
      this.loadData();
    }
  }

  loadData(): void {
    const code = String(this.entityCode || '').trim();
    if (!this.feature || !code) {
      return;
    }
    this.isLoading = true;
    forkJoin({
      defs: this.commonService.getExtraFields(this.feature),
      vals: this.commonService.getExtraFieldsData(this.feature, code),
    }).subscribe({
      next: ({ defs, vals }: any) => {
        this.isLoading = false;
        const fieldDefs = (defs?.objResult?.table || defs?.objResult?.table0 || []).filter(
          (f: any) => f.is_visible !== false
        );
        const dataRows = vals?.objResult?.table || vals?.objResult?.table0 || [];
        const data = Array.isArray(dataRows) && dataRows.length > 0 ? dataRows[0] : {};

        if (!Array.isArray(fieldDefs) || fieldDefs.length === 0) {
          this.displayFields = [];
          return;
        }

        this.displayFields = fieldDefs.map((f: any) => {
          const colName = (f.column_name || '').toLowerCase();
          let rawVal = data[f.column_name];
          if (rawVal === undefined || rawVal === null) {
            const foundKey = Object.keys(data).find((k) => k.toLowerCase() === colName);
            if (foundKey) {
              rawVal = data[foundKey];
            }
          }
          const hasVal = rawVal !== undefined && rawVal !== null && String(rawVal).trim() !== '';
          const displayVal = hasVal ? String(rawVal).trim() : (f.defaultvalue || '').trim();
          return {
            label: f.alias_name || f.field_label || f.name || f.column_name,
            value: displayVal || '',
            isEmpty: !displayVal,
            controlType: f.control_type || 'TX',
            dependencyType: Number(f.dependency_type || f.dependencyType || f.dependency_id || f.dependencyId) || 0,
          };
        });

        // Resolve lookups & checkboxes
        this.displayFields.forEach((item) => {
          if (item.controlType === 'DP' && item.dependencyType && item.dependencyType > 0 && !item.isEmpty) {
            this.commonService.getLookupOptions(item.dependencyType).subscribe((lookupRes: any) => {
              if (lookupRes?.statusCode === '200' && lookupRes.objResult?.table) {
                const opt = lookupRes.objResult.table.find(
                  (o: any) =>
                    String(o.id) === String(item.value) ||
                    String(o.code) === String(item.value) ||
                    String(o.lookup_id) === String(item.value)
                );
                if (opt) {
                  item.value = opt.name || opt.lookup_name || opt.code || item.value;
                }
              }
            });
          } else if (item.controlType === 'CK' && !item.isEmpty) {
            const v = String(item.value).toLowerCase();
            item.value = v === 'true' || v === '1' || v === 'yes' ? 'Yes' : 'No';
          }
        });
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error(`Error loading extra fields view for ${this.feature}:`, err);
      },
    });
  }
}
