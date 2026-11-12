import { TranslateModule } from '@ngx-translate/core';
import { Component, ElementRef, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PageEvent } from '@angular/material/paginator';
import { CommonService } from '../../../services/common.service';
import { Common_TabsService } from '../../portfolio/services/common_tabs.service';
import { environment } from '../../../../environments/environment';
import { OvPaginatorComponent } from '../../../shared/components/ov-paginator/ov-paginator.component';
import {
  EMAIL_TEMPLATE_TARGETS,
  EmailTemplateColumnDef,
  EmailTemplateRow,
  EmailTemplateTarget,
} from './email-templates.data';

type TargetFilter = 'all' | EmailTemplateTarget;
type SortKey = 'name' | 'target';
type SortDir = 'asc' | 'desc';

@Component({
  selector: 'app-email-templates',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, OvPaginatorComponent, TranslateModule],
  templateUrl: './email-templates.component.html',
  styleUrl: './email-templates.component.scss',
})
export class EmailTemplatesComponent implements OnInit {
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private commonService = inject(CommonService);
  private router = inject(Router);

  searchQuery = '';
  columnSearch = '';
  targetFilter: TargetFilter = 'all';
  showColumns = false;
  openMenuId: number | null = null;
  isLoading = false;
  isSaving = false;

  sortKey: SortKey = 'name';
  sortDir: SortDir = 'asc';
  pageSize = 10;
  pageIndex = 0;

  // Zero static mock data by default
  rows: EmailTemplateRow[] = [];

  readonly targets = EMAIL_TEMPLATE_TARGETS;

  columns: EmailTemplateColumnDef[] = [
    { key: 'name', label: 'Name', visible: true },
    { key: 'target', label: 'Target', visible: true },
    { key: 'actions', label: 'Actions', visible: true },
  ];

  private static readonly STORAGE_KEY = 'orville_email_templates';

  constructor(
    private readonly host: ElementRef<HTMLElement>,
    private commonTabsService: Common_TabsService
  ) {}

  ngOnInit(): void {
    this.purgeLegacyMockData();
    this.fetchEmailTemplates();
  }

  /**
   * Purge any static mockup data (e.g. legacy 123 items without real user-saved content)
   */
  private purgeLegacyMockData(): void {
    try {
      const cached = localStorage.getItem(EmailTemplatesComponent.STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          // Keep only legitimate user-created or API-fetched templates (must have body format or explicit user-saved tag)
          const validOnly = parsed.filter(
            (item: any) =>
              item &&
              (item.is_user_saved === true ||
               (typeof item.format === 'string' && item.format.trim().length > 0) ||
               (item.feature && item.subject))
          );
          this.rows = validOnly;
          localStorage.setItem(EmailTemplatesComponent.STORAGE_KEY, JSON.stringify(validOnly));
          return;
        }
      }
    } catch (e) {
      console.error('Failed to parse cached email_templates:', e);
      localStorage.removeItem(EmailTemplatesComponent.STORAGE_KEY);
    }
    this.rows = [];
  }

  private getLocalValidTemplates(): EmailTemplateRow[] {
    try {
      const cached = localStorage.getItem(EmailTemplatesComponent.STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (item: any) =>
              item &&
              (item.is_user_saved === true ||
               (typeof item.format === 'string' && item.format.trim().length > 0) ||
               (item.feature && item.subject))
          );
        }
      }
    } catch {}
    return [];
  }

  fetchEmailTemplates(): void {
    this.isLoading = true;
    const user = this.commonService.getCurrentUser();

    // Use typeId: 104 for fetching email/SMS template records
    const mastersPayload = {
      typeId: 104,
      filterId: 0,
      filterText: this.searchQuery || '',
      filterText1: '',
      userId: Number(user?.userId) || 1,
      clientId: user?.clientId || '74BB6922',
      companyId: Number(user?.companyId) || 1,
    };

    this.commonTabsService.getMasterByType(mastersPayload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        let apiRows: EmailTemplateRow[] = [];
        if (res && (res.statusCode === 200 || res.statusCode === '200') && res.objResult) {
          const rawItems = res.objResult.table || res.objResult.table0 || res.objResult.email_templates || res.objResult;
          if (Array.isArray(rawItems) && rawItems.length > 0) {
            apiRows = rawItems.map((r: any, idx: number) => {
              const feat = (r.feature || '').toUpperCase();
              const derivedTarget = r.target || (
                feat.includes('TENANT') ? 'Tenant' :
                feat.includes('LANDLORD') || feat.includes('OWNER') ? 'Landlord' :
                feat.includes('VENDOR') ? 'Vendor' : 'Property Manager'
              );

              return {
                id: r.id || r.code || idx + 1,
                name: r.template_name || r.name || 'Untitled Template',
                target: derivedTarget,
                code: r.code || String(r.id || ''),
                feature: r.feature || '',
                subject: r.subject || '',
                to_address: r.to_address || '',
                bcc_address: r.bcc_address || '',
                format: r.format || '',
                template_type: r.template_type ?? 0,
                format_type: r.format_type ?? 0,
                is_user_saved: true
              };
            });
          }
        }

        const local = this.getLocalValidTemplates();
        const merged = [...local];
        for (const item of apiRows) {
          if (!merged.some(m => (m.code && m.code === item.code) || (m.name && m.name === item.name))) {
            merged.push(item);
          }
        }
        this.rows = merged;
        localStorage.setItem(EmailTemplatesComponent.STORAGE_KEY, JSON.stringify(merged));
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('Error fetching email templates with typeId: 104:', err);
        this.rows = this.getLocalValidTemplates();
      }
    });
  }

  get totalCount(): number {
    return this.rows.length;
  }

  get targetTabs(): { id: TargetFilter; label: string; count?: number }[] {
    return [
      { id: 'all', label: 'All' },
      ...this.targets.map((t) => ({
        id: t as TargetFilter,
        label: t,
        count: this.rows.filter((r) => r.target === t).length,
      })),
    ];
  }

  get filteredRows(): EmailTemplateRow[] {
    const q = this.searchQuery.trim().toLowerCase();
    let list = this.rows.filter((row) => {
      if (this.targetFilter !== 'all' && row.target !== this.targetFilter) {
        return false;
      }
      if (!q) {
        return true;
      }
      return (
        row.name.toLowerCase().includes(q) ||
        row.target.toLowerCase().includes(q) ||
        (row.feature ? row.feature.toLowerCase().includes(q) : false) ||
        (row.description ? row.description.toLowerCase().includes(q) : false)
      );
    });

    const dir = this.sortDir === 'asc' ? 1 : -1;
    list = [...list].sort((a, b) => {
      const av = String(a[this.sortKey] || '');
      const bv = String(b[this.sortKey] || '');
      return av.localeCompare(bv, undefined, { sensitivity: 'base' }) * dir;
    });
    return list;
  }

  get totalFiltered(): number {
    return this.filteredRows.length;
  }

  get pagedRows(): EmailTemplateRow[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  get tableGridTemplate(): string {
    const parts: string[] = [];
    if (this.isColumnVisible('name')) {
      parts.push('minmax(280px, 2fr)');
    }
    if (this.isColumnVisible('target')) {
      parts.push('minmax(180px, 1fr)');
    }
    if (this.isColumnVisible('actions')) {
      parts.push('72px');
    }
    return parts.join(' ');
  }

  navigateToAdd(): void {
    this.router.navigate(['/settings/email-templates/new']);
  }

  editTemplate(row: EmailTemplateRow): void {
    this.openMenuId = null;
    const code = row.code || row.id;
    this.router.navigate(['/settings/email-templates/edit', code], {
      state: { templateData: row }
    });
  }

  get filteredColumns(): EmailTemplateColumnDef[] {
    const q = this.columnSearch.trim().toLowerCase();
    if (!q) {
      return this.columns;
    }
    return this.columns.filter((c) => c.label.toLowerCase().includes(q));
  }

  get allColumnsSelected(): boolean {
    return this.columns.every((c) => c.visible);
  }

  get emptyMessage(): string {
    return 'No email templates found. Click "+ Add Template" to create one.';
  }

  isColumnVisible(key: string): boolean {
    return this.columns.find((c) => c.key === key)?.visible !== false;
  }

  descriptionDisplay(value?: string): string {
    return (value && value.trim()) ? value : '—';
  }

  setTargetFilter(id: TargetFilter): void {
    this.targetFilter = id;
    this.pageIndex = 0;
    this.openMenuId = null;
  }

  toggleSort(key: SortKey): void {
    if (this.sortKey === key) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDir = 'asc';
    }
  }

  onSearchChange(): void {
    this.pageIndex = 0;
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.openMenuId = null;
  }

  toggleColumns(): void {
    this.showColumns = !this.showColumns;
    if (this.showColumns) {
      this.columnSearch = '';
      this.openMenuId = null;
    }
  }

  closeColumns(): void {
    this.showColumns = false;
  }

  toggleSelectAllColumns(checked: boolean): void {
    this.columns = this.columns.map((c) => ({ ...c, visible: checked }));
  }

  clearColumns(): void {
    this.columns = this.columns.map((c) => ({
      ...c,
      visible: c.key === 'name' || c.key === 'actions',
    }));
  }

  toggleRowMenu(id: number, event: MouseEvent): void {
    event.stopPropagation();
    this.showColumns = false;
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!this.host.nativeElement.contains(target)) {
      this.showColumns = false;
      this.openMenuId = null;
      return;
    }
    if (this.showColumns && !target.closest('[data-columns-dropdown]')) {
      this.showColumns = false;
    }
    if (this.openMenuId !== null && !target.closest('[data-row-menu]')) {
      this.openMenuId = null;
    }
  }
}
