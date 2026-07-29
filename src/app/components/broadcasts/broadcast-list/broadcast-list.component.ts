import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { PortfolioService } from '../../portfolio/services/portfolio.service';
import { CommonService } from '../../../services/common.service';

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
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule, TranslateModule, SharedTableComponent],
  templateUrl: './broadcast-list.component.html',
  styleUrl: './broadcast-list.component.scss'
})
export class BroadcastListComponent implements OnInit {
  private router = inject(Router);
  private portfolioService = inject(PortfolioService);
  private commonService = inject(CommonService);

  searchQuery: string = '';
  showColumnDropdown: boolean = false;
  showFilterPanel: boolean = false;
  isLoading: boolean = false;

  pageNo = 1;
  pageSize = 20;
  totalRecords = 0;

  branches = ['Main Branch', 'Branch A'];
  buildings = ['All Buildings', 'Building 1', 'Building 2'];

  tableColumns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true },
    { key: 'subject', label: 'Subject', visible: true },
    { key: 'preview', label: 'Preview', visible: true, useTemplate: true },
    { key: 'status', label: 'Status', visible: true, useTemplate: true },
    { key: 'broadcastType', label: 'Broadcast Type', visible: true },
    { key: 'sendTo', label: 'Send To', visible: true },
    { key: 'scheduled', label: 'Scheduled', visible: true, useTemplate: true },
    { key: 'date', label: 'Date', visible: true },
    { key: 'createdAt', label: 'Created At', visible: true },
    { key: 'updatedAt', label: 'Updated At', visible: true },
    { key: 'action', label: 'Action', visible: true, useTemplate: true },
  ];

  broadcastData: Broadcast[] = [];

  get visibleColumns() {
    return this.tableColumns.filter(c => c.visible);
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
      clientId: currentUser?.clientId || "74BB6922",
      source: "web",
      languageid: 1,
      page_no: this.pageNo,
      seqno: 0,
      search_keyword: this.searchQuery,
      pagecount: this.pageSize,
      filter_by: "",
      filter_list: "",
      featureid: "BROADCASTS"
    };

    this.portfolioService.getMastersByPaging(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res && res.objResult && res.objResult.table) {
          this.broadcastData = res.objResult.table;
          this.totalRecords = res.objResult.total_records || res.objResult.table.length;
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error("Error loading broadcasts:", err);
      }
    });
  }

  onSharedTablePageChange(event: { pageIndex: number; pageSize: number }): void {
    this.pageNo = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  onSearch() {
    this.pageNo = 1;
    this.loadData();
  }

  navigateToDetail(id: string) {
    this.router.navigate(['/broadcasts', id]);
  }

  navigateToCreate() {
    this.router.navigate(['/broadcasts/create']);
  }

  toggleColumn(col: any) {
    col.visible = !col.visible;
  }
}
