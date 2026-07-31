import { Component, OnInit } from '@angular/core';
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
export interface Room {
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
  selector: 'app-rooms-list',
  standalone: true,
  imports: [FormsModule, CommonModule, SharedTableComponent, NgSelectModule, SharedModule, RouterModule],
  templateUrl: './rooms-list.component.html',
  styleUrl: './rooms-list.component.scss'
})
export class RoomsListComponent implements OnInit {
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
  pageNo = 1;
  pageSize = 5;
  totalPages = 0;
  totalRecords = 0;
  pageSizeOptions = [5, 10, 25, 50, 100];
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
    { key: 'unitcode', label: 'Unit', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'land_lord', label: 'Landlord', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'tags', label: 'Tags', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'roomType', label: 'Room Type', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'floor_no', label: 'Floor Number', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'management_fee', label: 'Management Fee', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'room_status_name', label: 'Status', headerClass: 'text-start', useTemplate: true, visible: true }
  ];

  get visibleColumns() {
    return this.tableColumns.filter(col => col.visible !== false);
  }
  getArabicLookupName(row:any,key:string){
    return row[(localStorage.getItem("selectedLang")=="EN" ? key : key+'_ar')];
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

  filteredUnits: any = [];
  paginatedUnits: any = [];
  currentUser: AuthPayload | null = null;
  constructor(public translate: TranslateService, private commonService: CommonService,public commonservice: Common_TabsService, private propertiesService: PropertiesService) {}

  ngOnInit(): void {
    this.currentUser = this.commonService.getCurrentUser();
    this.loadMetrics();
    this.loadMasterDataByType(2,4,"categories",'','');
    this.loadMasterDataByType(2,7,"statuses",'','');
    this.loadMasterDataByType(2,5,"bedsOptions",'','');
     this.loadMasterDataByType(11,0,"propertiesList",'',''); 
    this.loadRooms();
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
    const payload = {
      typeId: 6,
      filterId: 4,
      filterText: "",
      filterText1: "",
      userid: this.currentUser?.userId,
      company_id: this.currentUser?.companyId,
      clientId: this.currentUser?.clientId,
    };
    this.propertiesService.getMasterDetails(payload).subscribe({
      next: (res: any) => {
        if (res && res.objResult) {
          let  data = res.objResult.table[0]; 
          if (data) {
            this.metrics = {
              total: data.rooms,
              vacant: data.vacant ?? this.metrics.vacant,
              occupied: data.occupied  ?? this.metrics.occupied,
              maintenance: data.maintainence   ?? this.metrics.maintenance
            };
          }
        }
      },
      error: (err: any) => console.error("Error loading metrics:", err)
    });
  }

  loadRooms(): void {
    const payload = {
      userid: this.currentUser?.userId,
      company_id: this.currentUser?.companyId,
      clientId: this.currentUser?.clientId,
      source: "web",
      languageid: 1,
      page_no: 0,
      seqno: 0,
      search_keyword: this.searchQuery || "",
      pagecount: 200,
      filter_by: "",
      filter_list: "",
      featureid: "Rooms"
    };

    this.propertiesService.getUnits(payload).subscribe({
      next: (response: any) => {
        if (response && response.statusCode === "200" && response.objResult) { 
          this.allUnits=response.objResult.rooms  
        }
        this.filterAndPaginate();
      },
      error: err => {
        console.error(err);
        this.filterAndPaginate();
      }
    });
  }
  handleChildNotification(ev:any){
    if(ev.action_name=="edit")
      window.location.href='/edit-room/'+ev.code;
    else if (ev.action_name=="delete")
    {
      //this.deleteUnit(36, ev.code,'');
    }
  }
   
  filterAndPaginate(): void {
    let result = this.allUnits;

    // 1. Filter by category tabs OR selected category dropdown
    if (this.categoryFilter !== 'All') {
      result = result.filter((u:any) => u.category === this.categoryFilter);
    } else if (this.selectedCategory) {
      result = result.filter((u:any) => u.category === this.selectedCategory);
    }

    // 2. Filter by status dropdown
    if (this.selectedStatus) {
      result = result.filter((u:any) => u.room_status === this.selectedStatus);
    }

    // 3. Filter by beds dropdown
    if (this.selectedBeds) {
      result = result.filter((u:any) => u.beds_id === this.selectedBeds);
    }

    // 4. Filter by property_code   dropdown
    if (this.selectedPropertyCode) {
      result = result.filter((u:any) => u.property_code === this.selectedPropertyCode);
    }

    // 5. Drawer custom filters
    if (this.selectedTag) {
      result = result.filter((u:any) => u.tags === this.selectedTag);
    }
    if (this.selectedLandlord) {
      result = result.filter((u:any) => u.landlord === this.selectedLandlord);
    }
    if (this.selectedId) {
      result = result.filter((u:any) => u.id === this.selectedId);
    }
    if (this.selectedArea) {
      result = result.filter((u:any) => u.area.toLowerCase().includes(this.selectedArea!.toLowerCase()));
    }

    // 6. Filter by search query
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter((u:any) => 
        u.property_Name.toLowerCase().includes(query) || 
        u.room_code.toLowerCase().includes(query) ||
        u.room_no.toLowerCase().includes(query)
      );
    }

    this.totalRecords = result.length;
    
    if (!this.userChangedPageSize) {
      if (this.totalRecords <= 5) this.pageSize = 5;
      else if (this.totalRecords <= 10) this.pageSize = 10;
      else if (this.totalRecords <= 25) this.pageSize = 25;
      else if (this.totalRecords <= 50) this.pageSize = 50;
      else this.pageSize = 100;
    }

    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);

    // 7. Paginate
    const startIndex = (this.pageNo - 1) * this.pageSize;
    this.paginatedUnits = result.slice(startIndex, startIndex + this.pageSize);
  }

  setCategoryFilter(category: 'All' | 'Residential' | 'Commercial'): void {
    this.categoryFilter = category;
    this.pageNo = 1;
    this.filterAndPaginate();
  }

  setViewMode(mode: 'list' | 'grid'): void {
    this.viewMode = mode;
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'list' ? 'grid' : 'list';
  }

  toggleDrawer(open: boolean): void {
    this.isDrawerOpen = open;
  }

  onSearch(): void {
    this.pageNo = 1;
    this.filterAndPaginate();
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
    this.categoryFilter = 'All';
    this.pageNo = 1;
    this.filterAndPaginate();
  }

  trackByUnitId(index: number, unit: any): number {
    return unit.id;
  }

  onPageSizeChange(): void {
    this.pageNo = 1;
    this.userChangedPageSize = true;
    this.filterAndPaginate();
  }

  previousPage(): void {
    if (this.pageNo > 1) {
      this.pageNo--;
      this.filterAndPaginate();
    }
  }

  nextPage(): void {
    if (this.pageNo < this.totalPages) {
      this.pageNo++;
      this.filterAndPaginate();
    }
  }

  goToPage(page: number): void {
    if (page !== this.pageNo) {
      this.pageNo = page;
      this.filterAndPaginate();
    }
  }

  onSharedTablePageChange(event: { pageIndex: number; pageSize: number }): void {
    this.pageNo = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.userChangedPageSize = true;
    this.filterAndPaginate();
  }

  get startRecord(): number {
    if (this.totalRecords === 0) return 0;
    return (this.pageNo - 1) * this.pageSize + 1;
  }

  get endRecord(): number {
    const end = this.pageNo * this.pageSize;
    return end > this.totalRecords ? this.totalRecords : end;
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Occupied': return 'bg-primary/10 text-primary border border-primary/20';
      case 'Vacant': return 'bg-success/10 text-success border border-success/20';
      case 'Sold': return 'bg-danger/10 text-danger border border-danger/20';
      case 'Maintenance': return 'bg-warning/10 text-warning border border-warning/20';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
