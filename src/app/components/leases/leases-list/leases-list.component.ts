import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { FilterDrawerComponent } from '../../../shared/components/filter-drawer/filter-drawer.component';
import { Common_TabsService } from '../../portfolio/services/common_tabs.service';
import { AuthPayload } from '../../common/store/login-auth-params/auth.models';
import { CommonService } from '../../../services/common.service';
import { ToastrService } from 'ngx-toastr';

export interface Lease {
  id: string;
  code: string;
  leaseName: string;
  tenant: string;
  legalCase: string;
  unit: string;
  property: string;
  status: 'Draft' | 'Active' | 'Completed' | 'Pending Approvals';
  rent: number;
  startDate: string;
}

@Component({
  selector: 'app-leases-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule, TranslateModule, SharedTableComponent, FilterDrawerComponent],
  templateUrl: './leases-list.component.html',
  styleUrl: './leases-list.component.scss'
})
export class LeasesListComponent implements OnInit {
  private router = inject(Router);
 private commontabservice = inject(Common_TabsService);
 private commonService =inject(CommonService);
 private toastr=inject(ToastrService);
  searchQuery: string = '';
  isLoading: boolean = false;
  activeStatusFilter: string = 'All';
  isDrawerOpen: boolean = false;
  currentUser: AuthPayload | null = this.commonService.getCurrentUser();
  showColumnDropdown = false;
  openActionId: string | null = null;
  filterTenant: string = '';
  filterProperty: string = '';
  filterStatus: string | null = null;
  statusOptions = ['Active', 'Draft', 'Completed', 'Pending Approvals'];

  pageNo = 0;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  pageSizeOptions = [5, 10, 25, 50, 100];

  tableColumns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true },
    { key: 'active_lease', label: 'Lease Name', visible: true, useTemplate: true },
    { key: 'tenant', label: 'Tenant', visible: true, useTemplate: true },
    { key: 'legal_case', label: 'Legal Case', visible: true },
    { key: 'unit_code', label: 'Unit', visible: true, useTemplate: true },
    { key: 'property', label: 'Property', visible: true, useTemplate: true },
    { key: 'status_nm', label: 'Status', visible: true, useTemplate: true },
    { key: 'rent_amount', label: 'Rent'+' ('+ this.currentUser?.currencyCode + ' )', visible: true, useTemplate: true },
    { key: 'start_date', label: 'Start Date', visible: true },
    { key: 'action', label: 'Action', visible: true, useTemplate: true, headerClass: 'text-center', cellClass: 'text-center' }
  ];

  metrics = {
    revenue: 'AED 4.3 M',
    totalLeases: 24183,
    activeLeases: 18420,
    draftLeases: 3240,
    expiringLeases: 420
  };
  tabs:any[]=[];
  allLeases: any[]=[];

  filteredLeases: Lease[] = [];
  paginatedLeases: Lease[] = [];

  ngOnInit() {
    
    this.loadLeases();
    this.loadMetrics();
    this.loadLookup(24, 'tabs', 'lookup_name');
  }
  getArabicLookupName(row:any,key:string){
    return row[(localStorage.getItem("selectedLang")=="EN" ? key : key+'_ar')];
  } 
  loadLeases() {
    const filterList: any[] = [];
    if (this.activeStatusFilter && this.activeStatusFilter!="All") {
      filterList.push({'key':'P.status','value': this.activeStatusFilter});
    }
    // if (this.selectedStatus) {
    //   filterList.push({ key: 'p.status', value: this.selectedStatus });
    // }
    // if (this.selectedType) {
    //   filterList.push({ key: 'p.parking_type', value: this.selectedType });
    // }

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
      filter_by: this.activeStatusFilter !== 'All' ? 'status' : '',
      filter_list: JSON.stringify(filterList),
      featureid: "leases"
    };

    this.commontabservice.getCommonGrid(payload).subscribe({
      next: (response: any) => { 
        if (response && response.statusCode === "200" && response.objResult) { 
          this.allLeases=response.objResult.leases  
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
        console.error('Error loading parkings:', err);
        this.applyFilters();
      }
    });
  }
  transform(value: number, decimals: number = 2): string {
    if (value === null || isNaN(value)) return value.toString();
    if (value < 1000) return value.toString();

    // Suffixes mapped by their mathematical tier (powers of 1000)
    const suffixes = ['', 'K', 'M', 'B', 'T'];
    const tier = Math.floor(Math.log10(Math.abs(value)) / 3);

    // If the tier exceeds our array, default to the highest available suffix
    const selectedTier = Math.min(tier, suffixes.length - 1);
    
    const suffix = suffixes[selectedTier];
    const scale = Math.pow(10, selectedTier * 3);
    const scaled = value / scale;

    // Formats numbers cleanly (e.g., removes redundant .00 trailing zeros)
    return scaled.toFixed(decimals).replace(/\.00$/, '') + suffix;
  }
  loadLookup(filterId: number, targetProperty: string, nameField: string) {
    this.commontabservice.getMasterByType({
      typeId: 2,
      filterId: filterId,
      filterText: '',
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult.table) {
          this.tabs.push({"id":"All","name":"All"}); 
          this.tabs.push(...res.objResult.table); 
        }
        else
        this.toastr.error("No record[s] found");
      },
      error: (err) => {
        console.error(`Error fetching lookup ${filterId}:`, err);
      }
    });
  }
  loadMetrics() { 
    this.commontabservice.getMasterByType({
      typeId: 43,
      filterid:0,
       filterText: '',
      filterText1: '' 
    }).subscribe({
      next: res => {
        if(res['statusCode'] == 200){
        let data = res.objResult.table[0]; 
        if (data) {
          this.metrics = {
            totalLeases: data.total_leases !== undefined ? data.total_leases : this.metrics.totalLeases,
            revenue: data.revene !== undefined ? this.currentUser?.currencyCode + ' ' + this.transform(data.revene) : this.metrics.revenue,
            activeLeases: data.active_leases !== undefined ? data.active_leases : this.metrics.activeLeases,
            draftLeases: data.draft !== undefined ? data.draft : this.metrics.draftLeases,
            expiringLeases: data.expiring_leases !== undefined ? data.expiring_leases : this.metrics.expiringLeases
          };
        }
      }
      },
      error: console.error
    });
 
  }
 
  applyFilters() {
    this.filteredLeases = this.allLeases.filter(lease => {
      if (this.activeStatusFilter !== 'All' && lease.status !== this.activeStatusFilter) {
        return false;
      }
      if (this.filterTenant && !lease.tenant.toLowerCase().includes(this.filterTenant.toLowerCase())) {
        return false;
      }
      if (this.filterProperty && !lease.property.toLowerCase().includes(this.filterProperty.toLowerCase())) {
        return false;
      }
      if (this.filterStatus && lease.status !== this.filterStatus) {
        return false;
      }
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        return (
          lease.leaseName.toLowerCase().includes(query) ||
          lease.tenant.toLowerCase().includes(query) ||
          lease.property.toLowerCase().includes(query) ||
          lease.unit.toLowerCase().includes(query) ||
          lease.id.includes(query)
        );
      }
      return true;
    });
    this.totalRecords = this.filteredLeases.length;
    this.totalPages = Math.max(1, Math.ceil(this.totalRecords / this.pageSize) || 1);
    if (this.pageNo >= this.totalPages) {
      this.pageNo = Math.max(0, this.totalPages - 1);
    }
    this.updatePaginatedLeases();
  }

  private updatePaginatedLeases(): void {
    const start = this.pageNo * this.pageSize;
    this.paginatedLeases = this.filteredLeases.slice(start, start + this.pageSize);
  }

  setStatusFilter(status: string) {
    this.activeStatusFilter = status;
    this.pageNo = 0;
    this.applyFilters();
  }
  onTabChange(tab: any) {
    this.activeStatusFilter = tab?.id;
    this.pageNo = 0;
    this.loadLeases();
  }

  onSearch() {
    this.pageNo = 0;
    this.loadLeases();
  }

  clearFilters() {
    this.filterTenant = '';
    this.filterProperty = '';
    this.filterStatus = null;
    this.searchQuery = '';
    this.loadLeases();
  }

  navigateToCreate() {
    this.router.navigate(['/leases/create']);
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
    this.pageNo = event.pageIndex;
    this.pageSize = event.pageSize; 
    this.loadLeases();
  }

  get visibleColumns() {
    return this.tableColumns.filter(c => c.visible !== false);
  }

  get allColumnsSelected(): boolean {
    return this.tableColumns.every(c => c.visible !== false);
  }

  toggleColumn(colKey: string): void {
    const col = this.tableColumns.find(c => c.key === colKey);
    if (col) {
      col.visible = !col.visible;
    }
  }

  toggleAllColumns(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.tableColumns.forEach(c => (c.visible = checked));
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.openActionId = null;
    this.showColumnDropdown = false;
  }

  toggleColumnDropdown(event: Event): void {
    event.stopPropagation();
    this.openActionId = null;
    this.showColumnDropdown = !this.showColumnDropdown;
  }

  toggleRowAction(id: string, event: Event): void {
    event.stopPropagation();
    this.showColumnDropdown = false;
    this.openActionId = this.openActionId === id ? null : id;
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
    this.applyFilters();
  }

  previousPage(): void {
    if (this.pageNo > 0) {
      this.pageNo--;
      this.updatePaginatedLeases();
    }
  }

  nextPage(): void {
    if (this.displayPage < (this.totalPages || 1)) {
      this.pageNo++;
      this.updatePaginatedLeases();
    }
  }

  goToPage(page: number): void {
    const target = page - 1;
    if (target >= 0 && target < (this.totalPages || 1) && target !== this.pageNo) {
      this.pageNo = target;
      this.updatePaginatedLeases();
    }
  }
}
