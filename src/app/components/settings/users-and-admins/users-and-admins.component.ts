import { Component, HostListener,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterModule } from '@angular/router';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component'; 
import { CommonService } from '../../../services/common.service'; 
import { Common_TabsService } from '../../portfolio/services/common_tabs.service';
import { ToastrService } from 'ngx-toastr';
import {
  MOCK_SETTINGS_USERS,
  SettingsUserRow,
  UserKind,
  UserStatus,
} from './users-and-admins.data';

type MainTab = 'users' | 'admins' | 'technicians';
type StatusFilter = 'all' | UserStatus;

@Component({
  selector: 'app-users-and-admins',
  standalone: true,
  imports: [CommonModule,RouterModule,SharedTableComponent, FormsModule],
  templateUrl: './users-and-admins.component.html',
})
export class UsersAndAdminsComponent {
  private router = inject(Router); 
  private commontabservice=inject(Common_TabsService);
  private commonservice = inject(CommonService);
  private toastr=inject(ToastrService);
  mainTab: MainTab = 'users';
  statusFilter: StatusFilter = 'all';
  searchQuery = '';
  roleFilter = '';
  openActionCode: string | number | null = null;
  isRoleDropdownOpen = false;
  isLoading=false;
  pageIndex = 0; 
  pageNo = 0;
  pageSize = 10; 
  totalPages = 0;
  totalRecords = 0;
  pageSizeOptions = [5, 10, 25, 50, 100];
  allRows:any[]=[];
  currentUser = this.commonservice.getCurrentUser();  
  @HostListener('document:click')
  closeRoleDropdown() {
    this.isRoleDropdownOpen = false;
  }

  users: SettingsUserRow[] = [...MOCK_SETTINGS_USERS];

  readonly mainTabs: { id: MainTab; label: string }[] = [
    { id: 'users', label: 'Users' },
    { id: 'admins', label: 'Admins' },
    { id: 'technicians', label: 'Support Technicians' },
  ];

  readonly statusTabs: { id: StatusFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'blocked', label: 'Blocked' },
  ];

  readonly roleOptions = [
    'Collector',
    'Inspector',
    'Manager',
    'Accountant',
    'Admin',
    'Support Technician',
  ];
  tableColumns = [
    { key: 'id', label: 'web.contacts.lblID', visible: true, useTemplate: true },
    { key: 'name', label: 'User Details', visible: true, useTemplate: true },
    { key: 'username', label: 'web.contacts.lblUsername', visible: true},
    { key: 'phone', label: 'web.contacts.lblPhoneNumber', visible: true, useTemplate: true },
    { key: 'role_name', label: 'Role', visible: true },
    { key: 'assignedUnits', label: 'Last Login', visible: true, useTemplate: true },
    { key: 'assignedUnits', label: 'web.contacts.lblAssignedUnits', visible: true}, 
    { key: 'action', label: 'web.contacts.lblAction', visible: true, useTemplate: true, headerClass: 'text-center', cellClass: 'text-center' }
  ];

  get visibleColumns() {
    return this.tableColumns.filter(col => col.visible !== false);
  }
  constructor() {}
  ngOnInit() {
    
    this.loadUsers();   
  }
  loadUsers() {
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
      featureid: "USERS"
    };

    this.commontabservice.getCommonGrid(payload).subscribe({
      next: (response: any) => {  
        if (response && response.statusCode === "200" && response.objResult) { 
          this.allRows = response.objResult.users || []; 
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
  get pagerItems(): (number | string)[] {
    const total = this.totalPages || 1;
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    return [1, 2, 3, 4, 5, '...', total];
  }
  get pageTitle(): string {
    switch (this.mainTab) {
      case 'admins':
        return 'Admins';
      case 'technicians':
        return 'Support Technicians';
      default:
        return 'Users';
    }
  }

  get addLabel(): string {
    switch (this.mainTab) {
      case 'admins':
        return 'Add New Admin';
      case 'technicians':
        return 'Add New Technician';
      default:
        return 'Add New User';
    }
  }

  get kindForTab(): UserKind {
    switch (this.mainTab) {
      case 'admins':
        return 'admin';
      case 'technicians':
        return 'technician';
      default:
        return 'user';
    }
  }

  get filteredRows(): SettingsUserRow[] {
    const kind = this.kindForTab;
    const q = this.searchQuery.trim().toLowerCase();
    return this.users.filter((row) => {
      if (row.kind !== kind) {
        return false;
      }
      if (this.statusFilter !== 'all' && row.status !== this.statusFilter) {
        return false;
      }
      if (this.roleFilter && row.role !== this.roleFilter) {
        return false;
      }
      if (!q) {
        return true;
      }
      return (
        row.name.toLowerCase().includes(q) ||
        row.email.toLowerCase().includes(q) ||
        row.username.toLowerCase().includes(q) ||
        row.phone.toLowerCase().includes(q) ||
        row.role.toLowerCase().includes(q)
      );
    });
  }

  get countLabel(): string {
    const n = this.filteredRows.length;
    const noun =
      this.mainTab === 'admins'
        ? 'admin'
        : this.mainTab === 'technicians'
          ? 'technician'
          : 'user';
    return `${n} ${noun}${n === 1 ? '' : 's'}`;
  }

  setMainTab(tab: MainTab): void {
    this.mainTab = tab;
    this.statusFilter = 'all';
    this.roleFilter = '';
    this.searchQuery = '';
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

  get paginatedRows(): any[] {
    const start = this.pageNo * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  onSearch(): void {
    this.pageNo = 0;
    this.loadUsers();
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
    this.loadUsers();
  }
  handleChildNotification(ev:any){ 
  }
  onPageSizeChange(event:any): void {
    this.pageNo = 0; 
    this.loadUsers();
  }

  previousPage(): void {
    if (this.pageNo > 0) {
      this.pageNo--;
      this.loadUsers();
    }
  }

  nextPage(): void {
    if (this.displayPage < this.totalPages) {
      this.pageNo++;
      this.loadUsers();
    }
  }

  goToPage(page: number): void {
    if (page !== this.pageNo-1) {
      this.pageNo =  page-1;
      if(this.pageNo<0)
      this.pageNo=0;
      this.loadUsers();
    }
 
  }
  openNew(): void {
    this.router.navigate(['/settings/users-and-admins/new'], {
      queryParams: { type: this.kindForTab },
    });
  }
  toggleRowAction(code: string | number, event: Event): void {
    event.stopPropagation(); 
    this.openActionCode = this.openActionCode === code ? null : code;
  }
  
  statusLabel(row: any): string {
    return this.commonservice.getArabicLookupName(row, 'status') || row?.status || '-';
  }

  isActiveStatus(row: any): boolean {
    return (this.statusLabel(row) || '').toLowerCase() === 'active';
  }

  isBlockedStatus(row: any): boolean {
    const value = (this.statusLabel(row) || '').toLowerCase();
    return value === 'blocked' || value === 'inactive';
  }
  openEdit(row: any): void {
    this.router.navigate(['/settings/users-and-admins', row.code]);
  }
  getInitials(name: string): string {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    return parts[0].charAt(0) + (parts.length > 1 ? parts[1].charAt(0) : '');
  }
  toggleBlock(row: SettingsUserRow): void {
    this.users = this.users.map((u) =>
      u.id === row.id
        ? { ...u, status: u.status === 'active' ? 'blocked' : 'active' }
        : u
    );
  }
}
