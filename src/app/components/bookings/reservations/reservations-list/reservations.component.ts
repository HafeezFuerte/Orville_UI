import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { FilterDrawerComponent } from '../../../../shared/components/filter-drawer/filter-drawer.component';
import { ColumnMenuComponent } from '../../../../shared/components/column-menu/column-menu.component';
import { RESERVATION_ROWS, ReservationRow, ReservationStatus } from '../reservations.data';
import { TranslateModule } from '@ngx-translate/core';
import { Common_TabsService } from '../../../portfolio/services/common_tabs.service';
import { CommonService } from '../../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { OvPaginatorComponent } from '../../../../shared/components/ov-paginator/ov-paginator.component';
@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgSelectModule,
    SharedTableComponent,
    FilterDrawerComponent,
    ColumnMenuComponent,
    TranslateModule,
    OvPaginatorComponent
  ],
  templateUrl: './reservations.component.html'
})
export class ReservationsComponent {
  searchQuery = '';
  isDrawerOpen = false;
  showColumnDropdown = false;
  filterName = '';
  filterStatus: ReservationStatus | null = null;
  statusOptions: ReservationStatus[] = ['Confirmed', 'Pending', 'Cancelled'];
 
  pageNo = 0;
  pageSize = 10; 
  totalPages = 0;
  totalRecords = 0;
  pageSizeOptions = [5, 10, 25, 50, 100];
  allRows :any=[];

  tableColumns = [
    { key: 'code', label: 'web.bookings.reservations.colId', visible: true, useTemplate: true },
    { key: 'reservation_name', label: 'web.bookings.reservations.colName', visible: true, useTemplate: true },
    { key: 'reserver', label: 'web.bookings.reservations.colReserve', visible: true },
    { key: 'status', label: 'Status', visible: true},
    { key: 'space_name', label: 'web.bookings.reservations.colSpace', visible: true, useTemplate: true }, 
    { key: 'slot', label: 'web.bookings.reservations.colTime', visible: true },
    { key: 'reservation_date', label: 'web.bookings.reservations.colBookingDate', visible: true },
    { key: 'phone_no', label: 'web.bookings.reservations.colPhone', visible: true },
    { key: 'email_address', label: 'web.bookings.reservations.colEmail', visible: true },
    { key: 'created_date', label: 'web.bookings.reservations.colCreatedAt', visible: true },
    { key: 'action', label: 'web.bookings.reservations.colAction', visible: true, useTemplate: true }
  ];
    currentUser = this.commonService.getCurrentUser();
  constructor(private router: Router,private commontabservice:Common_TabsService,private commonService:CommonService,
    private toastr:ToastrService) {}
    ngOnInit() { 
      this.loadReservations();   
    }
  loadReservations(): void {  
    const payload = {
      userid: this.currentUser?.userId || 1,
      company_id: this.currentUser?.companyId || 1,
      clientId: this.currentUser?.clientId || "74BB6922", 
      source: 'web',
      languageid: 1,
      page_no: this.pageNo,
      seqno: 0,
      search_keyword: this.searchQuery || '',
      pagecount: this.pageSize,
      featureid: "RESERVATIONS", 
      search_columns: "P.reservation_name",
      filter_by: ""
    };

    this.commontabservice.getCommonGrid(payload).subscribe({
      next: (res: any) => { 
        if (res && res.statusCode === "200" && res.objResult) {
          const rawItems = res.objResult.reservations || res.objResult.table || [];
          this.allRows =   rawItems;
          if (res.objResult.rows_info) {
            this.totalRecords = res.objResult.rows_info[0].totalrecords; 
            this.totalPages = res.objResult.rows_info[0].noofpages;
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
         
      }
    });
  }

  get visibleColumns() {
    return this.tableColumns.filter((col) => col.visible !== false);
  }

  get filteredRows(): any[] {
    const q = this.searchQuery.trim().toLowerCase();
    return this.allRows.filter((row:any) => {
      if (this.filterName && !row.name.toLowerCase().includes(this.filterName.toLowerCase())) {
        return false;
      }
      if (this.filterStatus && row.status !== this.filterStatus) {
        return false;
      }
      if (!q) {
        return true;
      }
      return [row.id, row.name, row.reserve, row.space, row.email, row.lease].some((value) =>
        value.toLowerCase().includes(q)
      );
    });
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

  
  get pagerItems(): (number | string)[] {
    const total = this.totalPages;
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    return [1, 2, 3, 4, 5, '...', total];
  }

  goToAdd(): void {
    void this.router.navigate(['/bookings/reservations/new']);
  }

  onSearch(): void {
    this.pageNo = 0;
    this.loadReservations();
  }

  applyLocalSearch(): void {
    this.pageNo = 0;
    this.loadReservations();
  }

  applyFilters(): void {
    this.pageNo = 0;
    this.loadReservations();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.filterName = '';
    this.filterStatus = null;
    this.pageNo = 0;
  }

  toggleColumnDropdown(event: Event): void {
    event.stopPropagation();
    this.showColumnDropdown = !this.showColumnDropdown;
  }

  toggleColumn(key: string): void {
    const col = this.tableColumns.find((item) => item.key === key);
    if (col) {
      col.visible = !col.visible;
    }
  }

  toggleAllColumns(checked: boolean): void {
    this.tableColumns.forEach((col) => (col.visible = checked));
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
    this.loadReservations();
  }
  handleChildNotification(ev:any){ 
  }
  onPageSizeChange(event:any): void {
    this.pageNo = 0; 
    this.loadReservations();
  }
  onPaginatorChange(event: any): void {
    this.pageNo = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadReservations();
  }

  previousPage(): void {
    if (this.pageNo > 0) {
      this.pageNo--;
      this.loadReservations();
    }
  }

  nextPage(): void {
    if (this.displayPage < this.totalPages) {
      this.pageNo++;
      this.loadReservations();
    }
  }

  goToPage(page: number): void {
    if (page !== this.pageNo-1) {
      this.pageNo =  page-1;
      if(this.pageNo<0)
      this.pageNo=0;
      this.loadReservations();
    }
 
  }
     

  goPage(page: number): void {
    this.pageNo = Math.max(0, Math.min(page - 1, this.totalPages - 1));
  }


  @HostListener('document:click')
  onDocumentClick(): void {
    this.showColumnDropdown = false;
  }
}
