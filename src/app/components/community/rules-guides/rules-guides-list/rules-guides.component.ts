import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { FilterDrawerComponent } from '../../../../shared/components/filter-drawer/filter-drawer.component';
import { ColumnMenuComponent } from '../../../../shared/components/column-menu/column-menu.component';
import { GUIDE_ROWS, GuideRow } from '../rules-guides.data';
import { CommonService } from '../../../../services/common.service';
import { Common_TabsService } from '../../../portfolio/services/common_tabs.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core'; 
import { DeleteConfirmationComponent } from '../../../../shared/components/delete-confirmation/delete-confirmation.component';
@Component({
  selector: 'app-rules-guides',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SharedTableComponent,
    FilterDrawerComponent,
    ColumnMenuComponent,DeleteConfirmationComponent

  ],
  templateUrl: './rules-guides.component.html',
  styleUrl: './rules-guides.component.scss'
})
export class RulesGuidesComponent {
  searchQuery = '';
  isDrawerOpen = false;
  showColumnDropdown = false;
  filterName = '';
  filterProperty = '';
  deleteModal:boolean=false;
  e_code:string='';
  pageIndex = 0; 
  pageNo = 0;
  pageSize = 10; 
  totalPages = 0;
  totalRecords = 0;
  pageSizeOptions = [5, 10, 25, 50, 100];
  allRows:any[]=[];
  currentUser = this.commonservice.getCurrentUser();  
  openRowActionId: string | null = null;
  openRowActionRow: any | null = null;
  rowMenuStyle: { top: string; left: string } | null = null;

  tableColumns = [
    {
      key: 'code',
      label: 'ID',
      visible: true,
      useTemplate: true,
      width: '110px',
      headerClass: 'text-start sticky left-0 z-[2] bg-white dark:bg-bodybg',
      cellClass: 'sticky left-0 z-[1] bg-white dark:bg-bodybg'
    },
    {
      key: 'name',
      label: 'Guide Name',
      visible: true,
      useTemplate: true,
      width: '260px'
    },
    { key: 'entity_type', label: 'Entity', visible: true, width: '240px',      useTemplate: true },
    { key: 'entity_name', label: 'Entity Name', visible: true, width: '240px',      useTemplate: true, },
    { key: 'created_date', label: 'Date', visible: true, width: '140px' },
    { key: 'action', label: 'Action', visible: true, useTemplate: true, width: '80px' }
  ];

  constructor(private router:Router ,private toastr: ToastrService, private commontabservice: Common_TabsService,
    private commonservice: CommonService,public translate: TranslateService) {}

  get visibleColumns() {
    return this.tableColumns.filter((col) => col.visible !== false);
  }
  deleteguideline(id: string): void {
    this.closeRowMenu();
    this.deleteModal=!this.deleteModal;  
    this.e_code=id;
  }
  deleterecord(){
    this.deleteModal=false;
    this.loadLookup(71,3, '', this.e_code);
  }
  closeModal(){
    this.deleteModal=false;
  }
  ngOnInit() {
    
    this.loadGuidlines();   
  }
  loadLookup(Typeid:number,filterId: number, targetProperty: string, filterText: string) {
    this.commontabservice.getMasterByType({
      typeId: Typeid,
      filterId: filterId,
      filterText: filterText,
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult.table) { 
          if(Typeid==71){
            this.toastr.success("Successfully marked as inactive");
            this.e_code='';
            this.loadGuidlines();
        } 
        }
        else
        this.toastr.error("No record[s] found");
      },
      error: (err) => {
        console.error(`Error fetching lookup ${filterId}:`, err);
      }
    });
  }
  
  loadGuidlines() {
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
      filter_by:  '',
      filter_list: '',
      featureid: "ENTITY_GUIDELINES"
    };

    this.commontabservice.getCommonGrid(payload).subscribe({
      next: (response: any) => { 
        if (response && response.statusCode === "200" && response.objResult) { 
          this.allRows = response.objResult.entity_guidelines || []; 
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
        console.error('Error loading leases:', err);
        this.allRows = []; 
        this.totalRecords = 0;
        this.totalPages = 0;
      }
    });
  }
  get filteredRows(): GuideRow[] {
    const q = this.searchQuery.trim().toLowerCase();
    return this.allRows.filter((row) => {
      if (this.filterName && !row.name.toLowerCase().includes(this.filterName.toLowerCase())) {
        return false;
      }
      if (this.filterProperty && !row.property.toLowerCase().includes(this.filterProperty.toLowerCase())) {
        return false;
      }
      if (!q) {
        return true;
      }
      return [row.id, row.name, row.property, row.date].some((value) =>
        String(value).toLowerCase().includes(q)
      );
    });
  }

  

  get displayPage(): number {
    return this.pageIndex + 1;
  }

  get startRecord(): number {
    return this.totalRecords ? this.pageIndex * this.pageSize + 1 : 0;
  }

  get endRecord(): number {
    return Math.min((this.pageIndex + 1) * this.pageSize, this.totalRecords);
  }

  get paginatedRows(): GuideRow[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
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

  goToAdd(): void {
    void this.router.navigate(['/community/rules-guides/new']);
  }

  onSearch(): void {
    this.pageIndex = 0;
  }

  applyFilters(): void {
    this.pageIndex = 0;
    this.isDrawerOpen = false;
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.filterName = '';
    this.filterProperty = '';
    this.pageNo = 0;
    this.loadGuidlines();
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
    this.loadGuidlines();
  }
  handleChildNotification(ev:any){ 
  }
  onPageSizeChange(event:any): void {
    this.pageNo = 0; 
    this.loadGuidlines();
  }

  previousPage(): void {
    if (this.pageNo > 0) {
      this.pageNo--;
      this.loadGuidlines();
    }
  }

  nextPage(): void {
    if (this.displayPage < this.totalPages) {
      this.pageNo++;
      this.loadGuidlines();
    }
  }

  goToPage(page: number): void {
    if (page !== this.pageNo-1) {
      this.pageNo =  page-1;
      if(this.pageNo<0)
      this.pageNo=0;
      this.loadGuidlines();
    }
 
  }
  toggleRowAction(row: GuideRow, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.showColumnDropdown = false;

    if (this.openRowActionId === row.id) {
      this.closeRowMenu();
      return;
    }

    const target = event.currentTarget as HTMLElement | null;
    if (!target) {
      return;
    }

    const rect = target.getBoundingClientRect();
    const menuWidth = 168;
    const menuHeight = 130;
    const gap = 4;
    const left = Math.max(8, Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 8));
    let top = rect.bottom + gap;
    if (top + menuHeight > window.innerHeight) {
      top = Math.max(8, rect.top - gap - menuHeight);
    }

    this.rowMenuStyle = {
      top: `${Math.round(top)}px`,
      left: `${Math.round(left)}px`
    };
    this.openRowActionId = row.id;
    this.openRowActionRow = row;
  }

  onRowView(row: any | null): void {
    if (!row) return;
    this.closeRowMenu();
    void this.router.navigate(['/community/rules-guides', row.code]);
  }

  onRowEdit(row: any | null): void {
    this.closeRowMenu();
    void this.router.navigate(['/community/rules-guides/edit', row.code]);
  }

  onRowDelete(): void {
    this.closeRowMenu();
  }

  closeRowMenu(): void {
    this.openRowActionId = null;
    this.openRowActionRow = null;
    this.rowMenuStyle = null;
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.closeRowMenu();
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showColumnDropdown = false;
    this.closeRowMenu();
  }
}
