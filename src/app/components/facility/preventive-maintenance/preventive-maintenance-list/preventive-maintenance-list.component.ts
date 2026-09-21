import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { ColumnMenuComponent } from '../../../../shared/components/column-menu/column-menu.component';
import {
  PM_ROWS,
  PmPriority,
  PmStatus,
  PreventiveMaintenanceRow
} from '../preventive-maintenance.data';
import { CommonService } from '../../../../services/common.service';
import { Common_TabsService } from '../../../portfolio/services/common_tabs.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core'; 
@Component({
  selector: 'app-preventive-maintenance-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SharedTableComponent, ColumnMenuComponent],
  templateUrl: './preventive-maintenance-list.component.html',
  styleUrl: './preventive-maintenance-list.component.scss'
})
export class PreventiveMaintenanceListComponent { 

  searchQuery = '';
  showColumnDropdown = false;
  pageIndex = 0; 
  pageNo = 0;
  pageSize = 10; 
  totalPages = 0;
  totalRecords = 0;
  pageSizeOptions = [5, 10, 25, 50, 100];
  allRows:any[]=[];
  currentUser = this.commonservice.getCurrentUser();  
  openRowActionId: string | null = null;
  rowMenuStyle: Record<string, string> | null = null;

  tableColumns = [
    { key: 'code', label: 'ID', visible: true, useTemplate: true, width: '90px' },
    { key: 'title', label: 'Title', visible: true, useTemplate: true, width: '160px' },
    { key: 'name', label: 'Trigger', visible: true, width: '180px' },
    { key: 'status_nm', label: 'Status', visible: true, useTemplate: true, width: '110px' }, 
    { key: 'schedule', label: 'Schedule', visible: true, width: '100px' },
    { key: 'nextSchedule', label: 'Next Schedule', visible: true, width: '120px' },
    { key: 'property', label: 'Property', visible: true,useTemplate: true, width: '180px' },
    { key: 'unitcode', label: 'Unit', visible: true,useTemplate: true, width: '140px' },
    { key: 'catergory_nm', label: 'Category', visible: true, width: '150px' },
    { key: 'vendor', label: 'Vendor', visible: true,useTemplate: true, width: '150px' },
    { key: 'asset_name', label: 'Asset', visible: true, useTemplate: true,width: '120px' },
    { key: 'common_area', label: 'Common Area', visible: true, width: '130px' },
    { key: 'lastWorkOrder', label: 'Last work Order', visible: true, width: '130px' },
    { key: 'created_date', label: 'Created At', visible: true, width: '150px' },
    { key: 'action', label: 'Action', visible: true, useTemplate: true, width: '70px' }
  ];
  constructor(private router:Router ,private toastr: ToastrService, private commontabservice: Common_TabsService,
    private commonservice: CommonService,public translate: TranslateService) {}

  ngOnInit() {
    
    this.loadTickets();   
  }
  get visibleColumns() {
    return this.tableColumns.filter((c) => c.visible !== false);
  }
  loadTickets() {
    const filterList: any[] = [];
   
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
      filter_by: '',
      filter_list: JSON.stringify(filterList),
      featureid: "PREVENTIVE_MAINTENANCE"
    };

    this.commontabservice.getCommonGrid(payload).subscribe({
      next: (response: any) => {  
        if (response && response.statusCode === "200" && response.objResult) { 
          this.allRows = response.objResult.preventive_maintenance || []; 
          if (response.objResult.rows_info) {
            this.totalRecords = response.objResult.rows_info[0].totalrecords; 
            this.totalPages = response.objResult.rows_info[0].noofpages;
          }
        } else {
          this.allRows = []; 
          this.totalRecords = 0;
          this.totalPages = 0;
          this.toastr.error("No record[s] found");
        }
      },
      error: (err: any) => { 
        this.allRows = []; 
        this.totalRecords = 0;
        this.totalPages = 0;
      }
    });
  }
  get filteredRows(): PreventiveMaintenanceRow[] {
    let rows = [...this.allRows];
    const q = this.searchQuery.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.trigger.toLowerCase().includes(q) ||
          r.property.toLowerCase().includes(q) ||
          r.unit.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.vendor.toLowerCase().includes(q)
      );
    }
    return rows;
  }

   
  get displayPage(): number {
    return this.pageNo + 1;
  }

  get startRecord(): number {
    return this.totalRecords ? this.pageNo * this.pageSize + 1 : 0;
  }

  get endRecord(): number {
    return Math.min((this.pageNo + 1) * this.pageSize, this.totalRecords);
  }

  get paginatedRows(): PreventiveMaintenanceRow[] {
    const start = this.pageNo * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  onSearch(): void {
    this.pageNo = 0;
    this.loadTickets();
  }

  onSharedTablePageChange(event: any): void {
    
    if(event.pageIndex>this.pageNo){
    this.pageNo = this.pageNo + 1;
    }
    else{
      this.pageNo = this.pageNo - 1;
    }
    if(this.pageNo<0)
    this.pageNo=0;
    this.pageSize = event.pageSize; 
    this.loadTickets();
  }
  handleChildNotification(ev:any){ 
  }
  onPageSizeChange(event:any): void {
    this.pageNo = 0; 
    this.loadTickets();
  }

  previousPage(): void {
    if (this.pageNo > 0) {
      this.pageNo--;
      this.loadTickets();
    }
  }

  nextPage(): void {
    if (this.displayPage < this.totalPages) {
      this.pageNo++;
      this.loadTickets();
    }
  }

  goToPage(page: number): void {
    if (page !== this.pageNo-1) {
      this.pageNo =  page-1;
      if(this.pageNo<0)
      this.pageNo=0;
      this.loadTickets();
    }
 
  }
  toggleColumn(key: string): void {
    const col = this.tableColumns.find((c) => c.key === key);
    if (col && key !== 'action') {
      col.visible = !col.visible;
    }
  }

  toggleAllColumns(visible: boolean): void {
    this.tableColumns.forEach((col) => {
      if (col.key !== 'action') {
        col.visible = visible;
      }
    });
  }

  toggleColumnDropdown(event: Event): void {
    event.stopPropagation();
    this.showColumnDropdown = !this.showColumnDropdown;
  }

  statusClass(status: PmStatus): string {
    switch (status) {
      case 'New':
        return 'pm-chip pm-chip--primary';
      case 'Open':
        return 'pm-chip pm-chip--info';
      case 'In Progress':
        return 'pm-chip pm-chip--warning';
      case 'On Hold':
        return 'pm-chip pm-chip--soft';
      case 'Resolved':
        return 'pm-chip pm-chip--success';
      default:
        return 'pm-chip pm-chip--soft';
    }
  }

  priorityClass(priority: PmPriority): string {
    switch (priority) {
      case 'High':
        return 'pm-chip pm-chip--danger';
      case 'Medium':
        return 'pm-chip pm-chip--soft';
      case 'Low':
        return 'pm-chip pm-chip--info';
      default:
        return 'pm-chip pm-chip--soft';
    }
  }
  get pagerItems(): (number | string)[] {
    const total = this.totalPages;
    const current = this.displayPage;
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const items: (number | string)[] = [1];
    if (current > 3) {
      items.push('...');
    }
    for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
      items.push(p);
    }
    if (current < total - 2) {
      items.push('...');
    }
    items.push(total);
    return items;
  }
  navigateToDetail(id: string): void {
    this.closeRowAction();
    this.router.navigate(['/facility/preventive-maintenance', id]);
  }

  navigateToEdit(id:string): void {
    this.closeRowAction();
    this.router.navigate(['/facility/create-preventive-maintenance/create',id]);
  }
  toggleRowAction(id: string, event: MouseEvent): void {
    event.stopPropagation();
    if (this.openRowActionId === id) {
      this.closeRowAction();
      return;
    }
    const btn = event.currentTarget as HTMLElement;
    const rect = btn.getBoundingClientRect();
    this.rowMenuStyle = {
      position: 'fixed',
      top: `${rect.bottom + 4}px`,
      left: `${Math.max(8, rect.right - 160)}px`,
      zIndex: '1200'
    };
    this.openRowActionId = id;
  }

  closeRowAction(): void {
    this.openRowActionId = null;
    this.rowMenuStyle = null;
  }

  navigateToCreate(): void {
    this.closeRowAction();
    this.router.navigate(['/facility/preventive-maintenance/create']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (target?.closest('[data-pm-action]')) {
      return;
    }
    this.closeRowAction();
    if (!target?.closest('[data-pm-columns]')) {
      this.showColumnDropdown = false;
    }
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  onViewportChange(): void {
    if (this.openRowActionId) {
      this.closeRowAction();
    }
  }
}
