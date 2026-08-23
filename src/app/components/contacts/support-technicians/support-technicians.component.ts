import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { PropertiesService } from '../../portfolio/services/properties.service';
import { Router } from '@angular/router';
import { AuthPayload } from '../../common/store/login-auth-params/auth.models';
import { CommonService } from '../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { FilterDrawerComponent } from '../../../shared/components/filter-drawer/filter-drawer.component';
export interface Technician {
  id: number;
  code: string;
  name: string;
  email: string;
  phoneNumber: string;
  username: string;
  assignedUnits: number;
  status: string;
  workOrder: string;
  image_path: string;
}

@Component({
  selector: 'app-support-technicians',
  standalone: true,
  imports: [CommonModule, FilterDrawerComponent, FormsModule, SharedTableComponent, RouterModule, NgSelectModule, TranslateModule],
  templateUrl: './support-technicians.component.html',
  styleUrl: './support-technicians.component.scss'
})
export class SupportTechniciansComponent implements OnInit {
  private propertiesService = inject(PropertiesService);
  private router = inject(Router);
  private commonService = inject(CommonService);
  private toastr =inject(ToastrService);
  currentUser: AuthPayload | null = null;
  searchQuery: string = '';
  showColumnDropdown: boolean = false;
  openActionCode: string | number | null = null;
  statusFilter: 'All' | 'Active' | 'Blocked' = 'All';
  isLoading: boolean = false;
  isDrawerOpen = false;

  // Filter criteria
  filterName: string = '';
  filterEmail: string = '';
  filterStatus: string | null = null;

  statusOptions = ['Active', 'Inactive', 'Blocked'];

  toggleDrawer(open: boolean): void { this.isDrawerOpen = open; }

  clearFilters(): void {
    this.searchQuery = '';
    this.filterName = '';
    this.filterEmail = '';
    this.filterStatus = null;
    this.pageNo = 1;
    this.loadTechnicians();
  }

  // Pagination
  pageNo = 0;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 0;

  // Figma default: ID | Name | Email | Phone Number | Status | Action
  tableColumns = [
    { key: 'id', label: 'web.contacts.lblID', visible: true, useTemplate: true },
    { key: 'name', label: 'web.contacts.lblName', visible: true, useTemplate: true },
    { key: 'email', label: 'web.contacts.lblEmail', visible: true, useTemplate: true },
    { key: 'phoneNumber', label: 'web.contacts.lblPhoneNumber', visible: true, useTemplate: true },
    { key: 'username', label: 'web.contacts.lblUsername', visible: true, useTemplate: true },
    { key: 'assignedUnits', label: 'web.contacts.lblAssignedUnits', visible: true, useTemplate: true },
    { key: 'status', label: 'web.contacts.lblStatus', visible: true, useTemplate: true },
    { key: 'workOrder', label: 'web.contacts.lblWorkOrder', visible: true, useTemplate: true },
    { key: 'action', label: 'web.contacts.lblAction', visible: true, useTemplate: true, headerClass: 'text-center', cellClass: 'text-center' }
  ];

  get visibleColumns() {
    return this.tableColumns.filter(col => col.visible !== false);
  }

  toggleColumn(colKey: string) {
    const col = this.tableColumns.find(c => c.key === colKey);
    if (col) {
      col.visible = !col.visible;
    }
  }

  toggleAllColumns(event: any) {
    const checked = event.target.checked;
    this.tableColumns.forEach(c => c.visible = checked);
  }

  get allColumnsSelected(): boolean {
    return this.tableColumns.every(c => c.visible !== false);
  }

  technicians: Technician[] = [];
  paginatedTechnicians: Technician[] = [];

  getArabicLookupName(row: any, key: string): string {
    return row[localStorage.getItem("selectedLang") === "EN" ? key : key + '_ar'] || row[key] || '';
  }

  ngOnInit(): void {
    this.currentUser = this.commonService.getCurrentUser();
    this.loadTechnicians();
  }

  loadTechnicians() {
    this.isLoading = true;
    const payload = {
      userid: this.currentUser?.userId,
      company_id: this.currentUser?.companyId,
      clientId: this.currentUser?.clientId,
      source: 'web',
      languageid: 1,
      page_no: this.pageNo,
      seqno: 0,
      search_keyword: this.searchQuery || '',
      pagecount: this.pageSize,
      filter_by: this.statusFilter !== 'All' ? this.statusFilter : '',
      filter_list: '',
      featureid: 'SUPPORT_TECHNICIANS'
    };

    this.propertiesService.getTenants(payload).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response && response.statusCode === "200" && response.objResult) { 
          this.allTechniciansData = response.objResult.support_technicians || [];
          this.paginatedTechnicians = response.objResult.support_technicians || [];
          if(response.objResult.rows_info)
          {
            this.totalRecords=response.objResult.rows_info[0].totalrecords; 
            this.totalPages=response.objResult.rows_info[0].noofpages;
          }
        }
        else
          this.toastr.error("No record[s] found"); 
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('Error fetching support technicians:', err);
      }
    });
  }

  allTechniciansData: any[] = [];

  applyLocalSearch(): void {
    if (!this.allTechniciansData || this.allTechniciansData.length === 0) {
      this.allTechniciansData = [...(this.paginatedTechnicians || [])];
    }
    let temp = [...(this.allTechniciansData || [])];
    if (this.searchQuery && this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      temp = temp.filter((t: any) =>
        (t.name && t.name.toLowerCase().includes(q)) ||
        (t.email_address && t.email_address.toLowerCase().includes(q)) ||
        (t.email && t.email.toLowerCase().includes(q)) ||
        (t.phone_number && t.phone_number.toLowerCase().includes(q)) ||
        (t.phone && t.phone.toLowerCase().includes(q)) ||
        (t.username && t.username.toLowerCase().includes(q)) ||
        (t.code && t.code.toString().toLowerCase().includes(q))
      );
    }
    this.paginatedTechnicians = temp;
  }

  onSearch() {
    this.pageNo = 0;
    this.loadTechnicians();
  }

  setStatusFilter(status: 'All' | 'Active' | 'Blocked') {
    this.statusFilter = status;
    this.pageNo = 0;
    this.loadTechnicians();
  }

  onSharedTablePageChange(event: any) {
    if(event.pageIndex>this.pageNo){
      this.pageNo = this.pageNo + 1;
      }
      else{
        this.pageNo = this.pageNo - 1;
      }
      if(this.pageNo<0)
      this.pageNo=0;
      this.pageSize = event.pageSize;  
    this.loadTechnicians();
  }

  handleEditAction(row: any) {
    if (row.action_name === 'edit') {
      this.router.navigate(['/contacts/support-technicians/edit-support-technician', row.code]);
    } else if (row.action_name === 'delete') {
      console.log('Delete support technician clicked', row.id);
    }
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.openActionCode = null;
    this.showColumnDropdown = false;
  }

  toggleColumnDropdown(event: Event): void {
    event.stopPropagation();
    this.openActionCode = null;
    this.showColumnDropdown = !this.showColumnDropdown;
  }

  toggleRowAction(code: string | number, event: Event): void {
    event.stopPropagation();
    this.showColumnDropdown = false;
    this.openActionCode = this.openActionCode === code ? null : code;
  }

  editTechnician(code: string | number): void {
    this.openActionCode = null;
    this.router.navigate(['/contacts/support-technicians/edit-support-technician', code]);
  }

  statusLabel(row: any): string {
    return this.getArabicLookupName(row, 'status') || row?.status || '-';
  }

  isActiveStatus(row: any): boolean {
    return (this.statusLabel(row) || '').toLowerCase() === 'active';
  }

  isBlockedStatus(row: any): boolean {
    const value = (this.statusLabel(row) || '').toLowerCase();
    return value === 'blocked' || value === 'inactive';
  }

  get displayPage(): number {
    return this.pageNo + 1;
  }

  get startRecord(): number {
    if (this.totalRecords === 0) return 0;
    return this.pageNo * this.pageSize + 1;
  }

  get endRecord(): number {
    const end = (this.pageNo + 1) * this.pageSize;
    return end > this.totalRecords ? this.totalRecords : end;
  }

  get pagerItems(): (number | string)[] {
    const total = this.totalPages || 1;
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    return [1, 2, 3, 4, 5, '...', total];
  }

  onPageSizeChange(): void {
    this.pageNo = 0;
    this.loadTechnicians();
  }

  previousPage(): void {
    if (this.pageNo > 0) {
      this.pageNo--;
      this.loadTechnicians();
    }
  }

  nextPage(): void {
    if (this.displayPage < (this.totalPages || 1)) {
      this.pageNo++;
      this.loadTechnicians();
    }
  }

  goToPage(page: number): void {
    const target = page - 1;
    if (target >= 0 && target < (this.totalPages || 1) && target !== this.pageNo) {
      this.pageNo = target;
      this.loadTechnicians();
    }
  }

  getInitials(name: string): string {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    return parts[0].charAt(0) + (parts.length > 1 ? parts[1].charAt(0) : '');
  }
}
