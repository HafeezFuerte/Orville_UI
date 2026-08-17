import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SharedModule } from '../../../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { PropertiesService } from '../../services/properties.service';
import { Common_TabsService } from '../../services/common_tabs.service';
import { CommonService } from '../../../../services/common.service';
import { AuthPayload } from '../../../common/store/login-auth-params/auth.models';
import { ToastrService } from 'ngx-toastr';
import { FilterDrawerComponent } from '../../../../shared/components/filter-drawer/filter-drawer.component';
export interface Unit {
  id: number;
  name: string;
  category: string;
  beds: string;
  baths: string;
  area: string;
  floor: string;
  property: string;
  location: string;
  landlord: string;
  tags: string;
  unitType: string;
  managementFee: string;
  status: string;
  addedDate: string;
  imageUrl: string;
  rentStatus: string;
}

@Component({
  selector: 'app-units-list',
  standalone: true,
  imports: [FormsModule, CommonModule, SharedTableComponent, NgSelectModule, SharedModule, RouterModule, FilterDrawerComponent],
  templateUrl: './units-list.component.html',
  styleUrl: './units-list.component.scss'
})
export class UnitsListComponent implements OnInit {
  viewMode: 'list' | 'grid' = 'list';
  categoryFilter: 'All' | 'Residential' | 'Commercial' = 'All';
  searchQuery: string = '';
 
  // Advanced Filters (Search Criteria Panel)
  selectedCategory: string | null = null;
  selectedStatus: string | null = null;
  selectedBeds: string | null = null;
  selectedRentStatus: string | null = null;
  selectedPropertyCode: string | null = null;
  // Drawer Visibility State
  isDrawerOpen: boolean = false;
  showColumnDropdown: boolean = false;
 
  // Drawer Custom Filters
  selectedTag: string | null = null;
  selectedArea: string | null = null;
  selectedId: number | null = null;
  selectedRefNo: string | null = null;
  selectedOffPlanStatus: string | null = null;
  selectedLandlord: string | null = null;
  selectedInternalStatus: string | null = null;
  pageSizeOptions = [5, 10, 25, 50, 100];
  // Dropdown lists
  categories: any[] = []; 
  statuses: any[] = []; 
  bedsOptions: any[] = [];
  propertiesList: any[] = [];
  rentStatuses: any[] = [
    { id: 1, name: 'For Rent' },
    { id: 2, name: 'For Sale' } 
  ];

  // Lists for drawer dropdowns
  tagsList: string[] = ['Premium', 'Best Seller', 'Compact', 'Luxury', 'Corporate', 'Prime Location'];
  landlordsList: string[] = ['Orville Real Estate', 'Emaar Properties', 'DIFC Investments', 'Emaar Malls'];
  offPlanStatuses: string[] = ['Ready', 'Off Plan'];
  internalStatuses: string[] = ['Active', 'Draft', 'Suspended'];

  // Pagination
  pageNo = 0;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0; 
  userChangedPageSize = false;

  // Metrics
  metrics = {
    total: 2955,
    vacant: 605,
    occupied: 2319,
    maintenance: 31
  };

  // Columns definition for the shared table component
  tableColumns = [
    { key: 'id', label: 'ID', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'name', label: 'Name', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'category', label: 'Category', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'beds', label: 'Beds', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'property_Name', label: 'Property', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'land_lord', label: 'Landlord', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'tags', label: 'Tags', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'unitType', label: 'Unit Type', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'floor_no', label: 'Floor Number', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'management_fee', label: 'Management Fee', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'unit_status_name', label: 'Status', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'action', label: 'Action', headerClass: 'text-start', useTemplate: true, visible: true }
  ];

  openActionCode: string | number | null = null;

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

  // Mock Units Data
  allUnits: any = [];
  selectedLang :any=localStorage.getItem("selectedLang");
  filteredUnits: any = [];
  paginatedUnits: any = [];
  currentUser: AuthPayload | null = null;
  constructor(public translate: TranslateService,private toastr:ToastrService, private commonService: CommonService,public commonservice: Common_TabsService, private propertiesService: PropertiesService) {}

  getArabicLookupName(row: any, key: string): string {
    return row[localStorage.getItem("selectedLang") === "EN" ? key : key + '_ar'] || row[key] || '';
  }

  ngOnInit(): void {
    this.currentUser = this.commonService.getCurrentUser();
    this.loadMetrics();
    this.loadMasterDataByType(2,4,"categories",'','');
    this.loadMasterDataByType(2,7,"statuses",'','');
    this.loadMasterDataByType(2,5,"bedsOptions",'','');
     this.loadMasterDataByType(11,0,"propertiesList",'',''); 
    this.loadUnits();
  }

    loadMasterDataByType(
    typeId: number,
    filterId: number,
    target: 'categories' | 'statuses' | 'bedsOptions' | 'propertiesList',
    filtertext:string ='',
    filterText1:string ='', 
    callback?:()=>void
  ) {
    this.commonservice.getMasterByType({
      typeId: typeId,
      filterId,
      filterText: filtertext,
      filterText1: filterText1 
    }).subscribe({
      next: res => {
  
        if(res['statusCode'] == 200)
          this[target] = res.objResult.table;
          callback?.();
       
      },
      error: (err) => {
    console.log('Full Error:', err);
  }
    });
  }
  loadMetrics() { 
    this.commonservice.getMasterByType({
      typeId: 5,
      filterId:0,
      filterText: '',
      filterText1: '' 
    }).subscribe({
      next: res => {
  
        if(res['statusCode'] == 200){
        let  data = res.objResult.table[0]; 
          
        if (data) {
          this.metrics = {
            total: data.units ?? this.metrics.total,
            vacant: data.vacant  ?? this.metrics.vacant,
            occupied: data.occupied ?? this.metrics.occupied,
            maintenance: data.maintenance ?? this.metrics.maintenance
          };
        }
      }
      },
      error: (err) => {
    console.log('Full Error:', err);
  }
    }); 
    
  }

  loadUnits(append = false): void {

    var filterList=[];
     
    if (this.selectedCategory) {
      filterList.push({'key':'category','value': this.selectedCategory});
    }
    if (this.selectedStatus) {
      filterList.push({'key':'P.unit_status','value': this.selectedStatus});
    }
    if (this.selectedBeds) {
      filterList.push({'key':'P.beds','value': this.selectedBeds});
    }
    if (this.selectedPropertyCode) {
      filterList.push({'key':'P.property_code','value': this.selectedPropertyCode});
    } 

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
      filter_by: "",
      filter_list: JSON.stringify(filterList),
      featureid: "Units"
    };

    this.propertiesService.getUnits(payload).subscribe({
      next: (response: any) => {
        if (response && response.statusCode === "200" && response.objResult) { 
          const nextBatch = response.objResult.units || [];
          this.paginatedUnits = append ? [...(this.paginatedUnits || []), ...nextBatch] : nextBatch;
          if(response.objResult.rows_info)
          {
            this.totalRecords=response.objResult.rows_info[0].totalrecords; 
            this.totalPages=response.objResult.rows_info[0].noofpages;
          }
        }
        else
          this.toastr.error("No record[s] found");
        //this.filterAndPaginate();
      },
      error: err => {
        console.error(err);
        //this.filterAndPaginate();
      }
    });
  }

  filterAndPaginate(): void {
    // let result = this.allUnits;

    // // 1. Filter by category tabs OR selected category dropdown
    // if (this.categoryFilter !== 'All') {
    //   result = result.filter((u:any) => u.category === this.categoryFilter);
    // } else if (this.selectedCategory) {
    //   result = result.filter((u:any) => u.category === this.selectedCategory);
    // }

    // // 2. Filter by status dropdown
    // if (this.selectedStatus) {
    //   result = result.filter((u:any) => u.unit_status === this.selectedStatus);
    // }

    // // 3. Filter by beds dropdown
    // if (this.selectedBeds) {
    //   result = result.filter((u:any) => u.beds_id === this.selectedBeds);
    // }

    // // 4. Filter by property_code   dropdown
    // if (this.selectedPropertyCode) {
    //   result = result.filter((u:any) => u.property_code === this.selectedPropertyCode);
    // }

    // // 5. Drawer custom filters
    // if (this.selectedTag) {
    //   result = result.filter((u:any) => u.tags === this.selectedTag);
    // }
    // if (this.selectedLandlord) {
    //   result = result.filter((u:any) => u.landlord === this.selectedLandlord);
    // }
    // if (this.selectedId) {
    //   result = result.filter((u:any) => u.id === this.selectedId);
    // }
    // if (this.selectedArea) {
    //   result = result.filter((u:any) => u.area.toLowerCase().includes(this.selectedArea!.toLowerCase()));
    // }

    // // 6. Filter by search query
    // if (this.searchQuery) {
    //   const query = this.searchQuery.toLowerCase();
    //   result = result.filter((u:any) => 
    //     u.property_Name.toLowerCase().includes(query) || 
    //     u.unit_code.toLowerCase().includes(query) ||
    //     u.unit_no.toLowerCase().includes(query)
    //   );
    // }

    // this.totalRecords = result.length;
    
    // if (!this.userChangedPageSize) {
    //   if (this.totalRecords <= 5) this.pageSize = 5;
    //   else if (this.totalRecords <= 10) this.pageSize = 10;
    //   else if (this.totalRecords <= 25) this.pageSize = 25;
    //   else if (this.totalRecords <= 50) this.pageSize = 50;
    //   else this.pageSize = 100;
    // }

    // this.totalPages = Math.ceil(this.totalRecords / this.pageSize);

    // // 7. Paginate
    // const startIndex = (this.pageNo - 1) * this.pageSize;
    // this.paginatedUnits = result.slice(startIndex, startIndex + this.pageSize);
  }

  setCategoryFilter(category: 'All' | 'Residential' | 'Commercial'): void {
    this.categoryFilter = category;
    this.pageNo = 1;
    this.filterAndPaginate();
  }

  setViewMode(mode: 'list' | 'grid'): void {
    this.viewMode = mode;
    this.showColumnDropdown = false;
    this.openActionCode = null;
    this.pageNo = 0;
    this.loadUnits();
  }

  get canLoadMore(): boolean {
    return this.displayPage < (this.totalPages || 1);
  }

  loadMore(): void {
    if (!this.canLoadMore) return;
    this.pageNo++;
    this.loadUnits(true);
  }

  isActiveGridStatus(status: string | null | undefined): boolean {
    const value = (status || '').toLowerCase();
    return !value || value === 'active' || value.includes('active');
  }

  toggleViewMode(): void {
    this.setViewMode(this.viewMode === 'list' ? 'grid' : 'list');
  }

  toggleDrawer(open: boolean): void {
    this.isDrawerOpen = open;
  }

  onSearch(): void {
    this.pageNo = 0;
    this.loadUnits();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = null;
    this.selectedStatus = null;
    this.selectedBeds = null;
    this.selectedRentStatus = null;
    this.selectedTag = null;
    this.selectedArea = null;
    this.selectedId = null;
    this.selectedRefNo = null;
    this.selectedOffPlanStatus = null;
    this.selectedLandlord = null;
    this.selectedInternalStatus = null;
    this.selectedPropertyCode=null;
    this.categoryFilter = 'All';
    this.pageNo = 0;
    this.loadUnits();
  }

  trackByUnitId(index: number, unit: any): number {
    return unit.id;
  }
 
  handleChildNotification(ev:any){
    if(ev.action_name=="edit")
      window.location.href='/edit-unit/'+ev.code;
    else if (ev.action_name=="delete")
    {
      //this.deleteUnit(ev.code);
    }
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.openActionCode = null;
  }

  toggleRowAction(code: string | number, event: Event): void {
    event.stopPropagation();
    this.openActionCode = this.openActionCode === code ? null : code;
  }

  viewUnit(code: string | number): void {
    this.openActionCode = null;
    window.location.href = '/units/' + code;
  }

  editUnit(code: string | number): void {
    this.openActionCode = null;
    window.location.href = '/edit-unit/' + code;
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
    this.userChangedPageSize = true;
    this.loadUnits();
  }

  previousPage(): void {
    if (this.pageNo > 0) {
      this.pageNo--;
      this.loadUnits();
    }
  }

  nextPage(): void {
    if (this.displayPage < this.totalPages) {
      this.pageNo++;
      this.loadUnits();
    }
  }

  goToPage(page: number): void {
    if (page !== this.pageNo-1) {
      this.pageNo = page-1;
      if(this.pageNo<0)
      this.pageNo=0;
      this.loadUnits();
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
      this.userChangedPageSize = true;
    this.loadUnits();
  } 
}
