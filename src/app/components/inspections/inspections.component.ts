import { Component, OnInit,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule,Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select'; 
import { TranslateModule, TranslateService } from '@ngx-translate/core';  
import { CommonService } from '../../services/common.service';
import { Common_TabsService } from '../portfolio/services/common_tabs.service';
import { ToastrService } from 'ngx-toastr';
import { SharedTableComponent } from '../../shared/components/shared-table/shared-table.component';
import { FilterDrawerComponent } from '../../shared/components/filter-drawer/filter-drawer.component';
import { DeleteConfirmationComponent } from '../../shared/components/delete-confirmation/delete-confirmation.component';
@Component({
  selector: 'app-inspections',
  standalone: true,
  imports: [CommonModule, FormsModule,DeleteConfirmationComponent, RouterModule, NgSelectModule, TranslateModule, SharedTableComponent, FilterDrawerComponent],
  templateUrl: './inspections.component.html',
  styleUrls: []
})
export class InspectionsComponent implements OnInit {
  isLoading = false;
  activeFilter: 'All' | 'Scheduled' | 'Not Scheduled' = 'All';
  searchQuery = '';
  isDrawerOpen = false;
  isColumnDropdownOpen = false;
  private router = inject(Router); 
  private commonService = inject(CommonService);
  private commontabService = inject(Common_TabsService);
  private toastr = inject(ToastrService);
  public translate = inject(TranslateService);
  currentUser = this.commonService.getCurrentUser();
  statusTabs: { id: 'All' | 'Scheduled' | 'Not Scheduled'; labelKey: string }[] = [
    { id: 'All', labelKey: 'web.inspections.list.tabAll' },
    { id: 'Scheduled', labelKey: 'web.inspections.list.tabScheduled' },
    { id: 'Not Scheduled', labelKey: 'web.inspections.list.tabNotScheduled' }
  ];

  // Filter properties from sidebar
  filterTags = '';
  filterArea = '';
  filterId = '';
  filterRefNo = '';
  filterOffPlanStatus = null;
  filterLandlord = '';
  filterInternalStatus = null; 
  deleteModal:boolean=false;
  workorderid:string='';
  activeTab: string = 'All';
  pageNo = 0;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 0;
  offPlanStatuses = ['Yes', 'No'];
  internalStatuses = ['Completed', 'Pending', 'Scheduled'];
  openActionCode: string | null = null;
  // Table row data
  inspectionsData :any[] = [];

//  filteredData = [...this.inspectionsData];

  // Column checkbox list matching Figma column selector
  columns = [
    { key: 'id', label: 'web.inspections.list.colId', visible: true, useTemplate: true },
    { key: 'inspection_date_time', label: 'web.inspections.add.dateTime', visible: true },
    { key: 'status', label: 'web.inspections.list.colStatus', visible: true, useTemplate: true },
    { key: 'inspection_type', label: 'web.inspections.list.colType', visible: true, useTemplate: true },
    { key: 'inspection_scope', label: 'web.inspections.add.inspectionScope', visible: true, useTemplate: true },
    { key: 'property', label: 'web.inspections.list.colProperty', visible: true, useTemplate: true },
    { key: 'unit', label: 'web.inspections.list.colUnit', visible: true, useTemplate: true }, 
    { key: 'inspector', label: 'web.inspections.add.inspector', visible: true, useTemplate: true },
    { key: 'created_date', label: 'web.inspections.list.colCreated', visible: true },
    { key: 'action', label: 'web.inspections.list.colAction', visible: true, useTemplate: true }
  ];

  // Dropdown menu state
  activeActionRow: any = null;

  ngOnInit() {
    this.applyFilters();
    this.loadData();
  }

  get visibleColumns() {
    return this.columns.filter(c => c.visible !== false);
  }
  toggleRowAction(code: string | undefined, event?: Event): void {
    event?.stopPropagation();
    if (!code) {
      return;
    }
    this.openActionCode = this.openActionCode === code ? null : code;
  }
 

  priorityClass(priority?: string): string {
    const value = (priority || '').toLowerCase();
    if (value === 'high') {
      return 'ov-status--blocked';
    }
    if (value === 'medium') {
      return 'ov-status--warning';
    }
    if (value === 'low') {
      return 'ov-status--active';
    }
    return 'ov-status--soft';
  }
  getArabicLookupName(row:any,key:string){
    return row[(localStorage.getItem("selectedLang")=="EN" ? key : key+'_ar')];
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

  get allColumnsVisible() {
    return this.columns.every(c => c.visible !== false);
  }
  loadLookup(Typeid:number,filterId: number, targetProperty: string, filterText: string) {
    this.commontabService.getMasterByType({
      typeId: Typeid,
      filterId: filterId,
      filterText: filterText,
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult.table) {
          if(Typeid==71){
            this.toastr.success("Successfully marked as inactive");
            this.workorderid='';
            this.loadData();
        }
        // else{
        //   this.tabs.push({"id":"All","name":"All"}); 
        //   this.tabs.push(...res.objResult.table); 
        // }
        }
        else
        this.toastr.error(this.translate.instant('web.common.lblNoRecordsFound'));
      },
      error: (err) => {
        console.error(`Error fetching lookup ${filterId}:`, err);
      }
    });
  }
  loadData() {
    this.isLoading = true;
    var filterList=[];
     
    if (this.activeTab && this.activeTab!="All") {
      filterList.push({'key':'P.status','value': this.activeTab});
    }
    const payload = {
      userid: this.currentUser?.userId || 1,
      company_id: this.currentUser?.companyId || 1,
      clientId: this.currentUser?.clientId || "74BB6922",
      source: "web",
      languageid: 1,
      page_no: this.pageNo,
      seqno: 0,
      search_keyword: this.searchQuery,
      pagecount: this.pageSize,
      filter_by: this.activeTab !== 'All' ? 'status' : '',
      filter_list: JSON.stringify(filterList),
      featureid: "INSPECTIONS"
    };

    this.commontabService.getCommonGrid(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res && res.objResult && res.objResult.inspections) {
          this.inspectionsData = res.objResult.inspections || []; 
          if(res.objResult.rows_info)
          {
            this.totalRecords=res.objResult.rows_info[0].totalrecords; 
            this.totalPages=res.objResult.rows_info[0].noofpages;
          }
           
        }else
        this.toastr.error(this.translate.instant('web.common.lblNoRecordsFound'));
      },
      error: (err) => {
        this.isLoading = false;
        console.error("Error loading work orders:", err);
      }
    });
  }
  deleteWorkorder(id: string): void { 
    this.deleteModal=!this.deleteModal;  
    this.workorderid=id;
  } 
  deleterecord(){
    this.deleteModal=false;
    this.loadLookup(71,21, '', this.workorderid);
  }
  closeModal(){
    this.deleteModal=false;
  }
  navigateToCreate() {
    this.router.navigate(['/inspections/add-inspection']);
  }

  handleEditAction(row: any) {
    this.router.navigate(['/inspections/edit-inspection', row.code]);
  }

  navigateToDetail(id: string) {
    this.router.navigate(['/inspections/inspection-details', id]);
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
    this.loadData();
  }

  onSearch() {
    this.pageNo = 0;
    this.loadData();
  }
  get startRecord(): number {
    return this.pageNo * this.pageSize + 1;
  }

  get endRecord(): number {
    const end = (this.pageNo + 1) * this.pageSize;
    return end > this.totalRecords ? this.totalRecords : end;
  }

  get pages(): number[] {
    const pagesArray: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.pageNo - 1);
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pagesArray.push(i);
    }
    return pagesArray;
  }

  get pageSizeOptions(): number[] {
    return [10, 20, 50, 100];
  }

  previousPage(): void {
    if (this.pageNo > 0) {
      this.pageNo--;
      this.loadData();
    }
  }

  nextPage(): void {
    if (this.pageNo < this.totalPages - 1) {
      this.pageNo++;
      this.loadData();
    }
  }

  goToPage(page: number): void {
    this.pageNo = page - 1;
    this.loadData();
  }

  onPageSizeChange(event: any): void {
    this.pageSize = +event.target.value;
    this.pageNo = 0;
    this.loadData();
  }
  onTabChange(tab: any) {
    this.activeTab = tab?.id;
    this.pageNo = 0;
    this.loadData();
  }
  filterByStatus(tab: 'All' | 'Scheduled' | 'Not Scheduled') {
    this.activeFilter = tab;
    this.applyFilters();
  }

  applyFilters() {
    let temp = [...this.inspectionsData];

    // Status tabs filter
    if (this.activeFilter === 'Scheduled') {
      temp = temp.filter(x => x.scheduled === 'Yes');
    } else if (this.activeFilter === 'Not Scheduled') {
      temp = temp.filter(x => x.scheduled === 'No');
    }

    // Keyword search
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      temp = temp.filter(x => 
        x.name.toLowerCase().includes(query) || 
        x.property.toLowerCase().includes(query) || 
        x.unit.toLowerCase().includes(query)
      );
    }

    // Sidebar search filters
    if (this.filterId) {
      temp = temp.filter(x => x.id.includes(this.filterId));
    }
    if (this.filterInternalStatus) {
      temp = temp.filter(x => x.status === this.filterInternalStatus);
    }

    this.inspectionsData = temp;
  }

  resetFilters() {
    this.filterTags = '';
    this.filterArea = '';
    this.filterId = '';
    this.filterRefNo = '';
    this.filterOffPlanStatus = null;
    this.filterLandlord = '';
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

  closeActionMenu() {
    this.activeActionRow = null;
  }
}
