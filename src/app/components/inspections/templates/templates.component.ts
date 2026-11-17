import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { FilterDrawerComponent } from '../../../shared/components/filter-drawer/filter-drawer.component';
import { Common_TabsService } from '../../portfolio/services/common_tabs.service';
import { CommonService } from '../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule, TranslateModule, SharedTableComponent, FilterDrawerComponent],
  templateUrl: './templates.component.html',
  styleUrls: []
})
export class TemplatesComponent implements OnInit {
  private translate = inject(TranslateService);
  private commontabservice = inject(Common_TabsService);
  private commonservice = inject(CommonService);
  private toastr = inject(ToastrService);
  isLoading = false;
  activeFilter: 'All' | 'Admin' | 'User' = 'All';
  searchQuery = '';
  // Pagination
  pageNo = 0;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0; 
  isDrawerOpen = false;
  isColumnDropdownOpen = false;

  statusTabs: { id: 'All' | 'Admin' | 'User'; labelKey: string }[] = [
    { id: 'All', labelKey: 'web.inspections.templates.tabAll' },
    { id: 'Admin', labelKey: 'web.inspections.templates.tabAdminTemplate' },
    { id: 'User', labelKey: 'web.inspections.templates.tabUserTemplate' }
  ];
  currentUser = this.commonservice.getCurrentUser(); 
  // Filter properties
  filterCreatedBy: any = null;
  filterTemplateName = '';
  filterTag: string | null = null;
  filterArea: string | null = null;
  filterId: any = null;
  filterRefNo: string | null = null;
  filterOffPlanStatus: string | null = null;
  filterLandlord: string | null = null;
  filterInternalStatus: string | null = null;

  createdByOptions = ['Admin', 'User'];

  // Table row data
  templatesData : any=[];

  filteredData = [...this.templatesData];

  columns = [
    { key: 'code', label: 'ID', labelKey: 'web.inspections.templates.colId', visible: true, useTemplate: true },
    { key: 'template_name', label: 'Template Name', labelKey: 'web.inspections.templates.colTemplateName', visible: true, useTemplate: true },
    { key: 'created_by', label: 'Created By', labelKey: 'web.inspections.templates.colCreatedBy', visible: true, useTemplate: true },
    { key: 'created_date', label: 'Created At', labelKey: 'web.inspections.templates.colCreatedAt', visible: true },
    { key: 'action', label: 'Action', labelKey: 'web.inspections.templates.colAction', visible: true, useTemplate: true }
  ];

  activeActionRow: any = null;

  ngOnInit() {
    this.updateColumnLabels();
    this.translate.onLangChange.subscribe(() => {
      this.updateColumnLabels();
    });
    this.applyFilters();
    this.loadTemplates();
  }

  private updateColumnLabels() {
    this.columns.forEach(col => {
      if (col.labelKey) {
        col.label = this.translate.instant(col.labelKey);
      }
    });
  }

  get visibleColumns() {
    return this.columns.filter(c => c.visible !== false);
  }

  get allColumnsVisible() {
    return this.columns.every(c => c.visible !== false);
  }

  toggleColumnDropdown() {
    this.isColumnDropdownOpen = !this.isColumnDropdownOpen;
  }

  toggleColumn(col: any) {
    col.visible = !(col.visible !== false);
  }

  toggleAllColumns(event: any) {
    const isChecked = event.target.checked;
    this.columns.forEach(c => c.visible = isChecked);
  }

  filterByCreatedBy(tab: 'All' | 'Admin' | 'User') {
    this.activeFilter = tab;
    this.applyFilters();
  }
  loadTemplates(): void {

    
    const payload = {
      userid: this.currentUser?.userId,
      company_id: this.currentUser?.companyId,
      clientId: this.currentUser?.clientId,
      source: "web",
      languageid: 1,
      page_no: this.pageNo,
      seqno: 0, 
      search_keyword: this.searchQuery || "",
      pagecount: this.pageSize,
      filter_by:   "",
      filter_list:"",
      featureid: "INSPECTION_TEMPLATES"
    };

    this.commontabservice.getCommonGrid(payload).subscribe({
      next: (response: any) => {
        if (response && response.statusCode === "200" && response.objResult) { 
          const nextBatch = response.objResult.inspection_templates || [];
          this.templatesData = nextBatch; 
          if(response.objResult.rows_info)
          {
            this.totalRecords=response.objResult.rows_info[0].totalrecords; 
            this.totalPages=response.objResult.rows_info[0].noofpages;
          }
        }
        else
          this.toastr.error(this.translate.instant('web.common.lblNoRecordsFound'));
      },
      error: err => {
        console.error(err);
      }
    });
  }

  applyFilters() {
    let temp = [...this.templatesData];

    // Tabs filter
    if (this.activeFilter === 'Admin') {
      temp = temp.filter(x => x.createdBy === 'Admin');
    } else if (this.activeFilter === 'User') {
      temp = temp.filter(x => x.createdBy === 'User');
    }

    // Search query
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      temp = temp.filter(x => x.templateName.toLowerCase().includes(query));
    }

    // Drawer filters
    if (this.filterCreatedBy) {
      temp = temp.filter(x => x.createdBy === this.filterCreatedBy);
    }
    if (this.filterTemplateName) {
      temp = temp.filter(x => x.templateName.toLowerCase().includes(this.filterTemplateName.toLowerCase()));
    }

    this.filteredData = temp;
  }

  resetFilters() {
    this.filterCreatedBy = null;
    this.filterTemplateName = '';
    this.filterTag = null;
    this.filterArea = null;
    this.filterId = null;
    this.filterRefNo = null;
    this.filterOffPlanStatus = null;
    this.filterLandlord = null;
    this.filterInternalStatus = null;
    this.applyFilters();
  }

  toggleActionMenu(row: any, event: MouseEvent) {
    event.stopPropagation();
    if (this.activeActionRow === row) {
      this.activeActionRow = null;
    } else {
      this.activeActionRow = row;
    }
  }

  get displayPage(): number {
    return this.pageNo + 1;
  }

  get pagerItems(): (number | string)[] {
    const total = this.totalPages || 1;
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    return [1, 2, 3, 4, 5, '...', total];
  }

  get startRecord(): number {
    if (this.totalRecords === 0) return 0;
    return (this.displayPage - 1) * this.pageSize + 1;
  }

  get endRecord(): number {
    const end = this.displayPage * this.pageSize;
    return end > this.totalRecords ? this.totalRecords : end;
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onPageSizeChange(event:any): void {
    this.pageNo = 0; 
    this.loadTemplates();
  }

  previousPage(): void {
    if (this.pageNo > 0) {
      this.pageNo--;
      this.loadTemplates();
    }
  }

  nextPage(): void {
    if (this.displayPage < this.totalPages) {
      this.pageNo++;
      this.loadTemplates();
    }
  }

  goToPage(page: number): void {
    if (page !== this.pageNo-1) {
      this.pageNo = page-1;
      if(this.pageNo<0)
      this.pageNo=0;
      this.loadTemplates();
    }
  }
  onSharedTablePageChange(event: { pageIndex: number; pageSize: number }): void {
   
    if(event.pageIndex>this.pageNo){
      this.pageNo = this.pageNo + 1;
      }
      else{
        this.pageNo = this.pageNo - 1;
      }
      if(this.pageNo<0)
      this.pageNo=0;
      this.pageSize = event.pageSize; 
    this.loadTemplates();
  } 

  closeActionMenu() {
    this.activeActionRow = null;
  }
}
