import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { PortfolioService } from '../../portfolio/services/portfolio.service';
import { CommonService } from '../../../services/common.service';
import { FilterDrawerComponent } from '../../../shared/components/filter-drawer/filter-drawer.component';

export interface Broadcast {
  id: string;
  subject: string;
  preview: string;
  status: 'Published' | 'Draft';
  broadcastType: string;
  sendTo: string;
  scheduled: boolean;
  date: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-broadcast-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule, TranslateModule, SharedTableComponent, FilterDrawerComponent],
  templateUrl: './broadcast-list.component.html',
  styleUrl: './broadcast-list.component.scss'
})
export class BroadcastListComponent implements OnInit {
  private router = inject(Router);
  private portfolioService = inject(PortfolioService);
  private commonService = inject(CommonService);

  searchQuery: string = '';
  showColumnDropdown: boolean = false;
  showFilterDrawer: boolean = false;
  isLoading: boolean = false;
  openActionCode: string | null = null;

  pageNo = 0;
  pageSize = 20;
  totalRecords = 0;

  /** Figma 2574:68703 — ID, Subject, Preview, Status, Broadcast Type, Sendable, Scheduled, Date, Created At, Updated At, Action */
  tableColumns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true },
    { key: 'subject', label: 'Subject', visible: true },
    { key: 'preview', label: 'Preview', visible: true, useTemplate: true },
    { key: 'status', label: 'Status', visible: true, useTemplate: true },
    { key: 'type', label: 'Broadcast Type', visible: true, useTemplate: true },
    { key: 'contact', label: 'Sendable', visible: true, useTemplate: true },
    { key: 'scheduled', label: 'Scheduled', visible: true, useTemplate: true },
    { key: 'scheduled_date', label: 'Date', visible: true },
    { key: 'created_date', label: 'Created At', visible: true },
    { key: 'modified_date', label: 'Updated At', visible: true },
    { key: 'action', label: 'Action', visible: true, useTemplate: true },
  ];

  broadcastData: Broadcast[] = [];

  get visibleColumns() {
    return this.tableColumns.filter(c => c.visible);
  }

  get allColumnsSelected(): boolean {
    return this.tableColumns.every(c => c.visible !== false);
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showColumnDropdown = false;
    this.openActionCode = null;
  }

  toggleDrawer(show: boolean) {
    this.showFilterDrawer = show;
  }

  toggleRowAction(code: string | undefined, event?: Event): void {
    event?.stopPropagation();
    if (!code) {
      return;
    }
    this.openActionCode = this.openActionCode === code ? null : code;
  }

  rowActionKey(row: any): string {
    return String(row?.code ?? row?.id ?? '');
  }

  getArabicLookupName(row: any, key: string): string {
    return row[localStorage.getItem('selectedLang') === 'EN' ? key : key + '_ar'] || row[key] || '';
  }

  statusLabel(row: any): string {
    return this.getArabicLookupName(row, 'status_text') || row?.status_text || row?.status || '-';
  }

  isPublished(row: any): boolean {
    const label = String(this.statusLabel(row)).toLowerCase();
    if (label.includes('draft')) {
      return false;
    }
    if (label.includes('publish')) {
      return true;
    }
    // Legacy numeric status from earlier list styling
    return row?.status === 108;
  }

  typeLabel(row: any): string {
    return this.getArabicLookupName(row, 'type')
      || row?.type
      || row?.broadcast_type_text
      || row?.broadcast_type
      || '-';
  }

  /** Figma “Sendable” — API may expose contact / send_to_type / sendable */
  sendableLabel(row: any): string {
    return this.getArabicLookupName(row, 'contact')
      || row?.contact
      || row?.sendable
      || row?.send_to_type
      || row?.send_to
      || row?.sendTo
      || '-';
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    const currentUser = this.commonService.getCurrentUser();
    const payload = {
      userid: currentUser?.userId || 1,
      company_id: currentUser?.companyId || 1,
      clientId: currentUser?.clientId || '74BB6922',
      source: 'web',
      languageid: 1,
      page_no: this.pageNo,
      seqno: 0,
      search_keyword: this.searchQuery,
      pagecount: this.pageSize,
      filter_by: '',
      filter_list: '',
      featureid: 'BROADCASTS'
    };

    this.portfolioService.getMastersByPaging(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res && res.objResult && res.objResult.broadcasts) {
          this.allBroadcastsData = res.objResult.broadcasts || [];
          this.broadcastData = res.objResult.broadcasts;
          this.totalRecords = res.objResult.total_records || res.objResult.broadcasts.length;
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error loading broadcasts:', err);
      }
    });
  }

  allBroadcastsData: Broadcast[] = [];

  applyLocalSearch(): void {
    if (!this.allBroadcastsData || this.allBroadcastsData.length === 0) {
      this.allBroadcastsData = [...(this.broadcastData || [])];
    }
    let temp = [...(this.allBroadcastsData || [])];
    if (this.searchQuery && this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      temp = temp.filter((b: any) =>
        (b.subject && b.subject.toLowerCase().includes(q)) ||
        (b.broadcastType && b.broadcastType.toLowerCase().includes(q)) ||
        (b.sendTo && b.sendTo.toLowerCase().includes(q)) ||
        (b.code && b.code.toString().toLowerCase().includes(q)) ||
        (b.id && b.id.toString().toLowerCase().includes(q))
      );
    }
    this.broadcastData = temp;
  }

  onSharedTablePageChange(event: { pageIndex: number; pageSize: number }): void {
    this.pageNo = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  onSearch() {
    this.pageNo = 0;
    this.loadData();
  }

  navigateToDetail(id: string) {
    this.router.navigate(['/broadcasts', id]);
  }

  navigateToCreate() {
    this.router.navigate(['/broadcasts/create']);
  }

  navigateToEdit(id: string) {
    this.router.navigate(['/broadcasts/create'], { queryParams: { editId: id } });
  }

  toggleAllColumns(event: any): void {
    const checked = event.target.checked;
    this.tableColumns.forEach(c => c.visible = checked);
  }

  toggleColumn(key: string): void {
    const col = this.tableColumns.find(c => c.key === key);
    if (col) {
      col.visible = !col.visible;
    }
  }
}
