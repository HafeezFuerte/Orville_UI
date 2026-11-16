import { TranslateModule } from '@ngx-translate/core';
import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../../../../shared/shared.module';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { PropertiesService } from '../../services/properties.service';
import { PortfolioService } from '../../services/portfolio.service';
import { CommonService } from '../../../../services/common.service';
import { FilterDrawerComponent } from '../../../../shared/components/filter-drawer/filter-drawer.component';
import { portfolioStatusClass } from '../../portfolio-status.util';
import { DeleteConfirmationComponent } from '../../../../shared/components/delete-confirmation/delete-confirmation.component';
import { Common_TabsService } from '../../services/common_tabs.service';
import { ToastrService } from 'ngx-toastr';
import { BulkImportModalComponent } from '../../../../shared/components/bulk-import-modal/bulk-import-modal.component';

@Component({
  selector: 'app-properties-list',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    DeleteConfirmationComponent,
    SharedTableComponent,
    NgSelectModule,
    SharedModule,
    RouterModule,
    FilterDrawerComponent,
    TranslateModule,
    BulkImportModalComponent,
  ],
  templateUrl: './properties-list.component.html',
  styleUrl: './properties-list.component.scss'
})
export class PropertiesListComponent implements OnInit {
  readonly portfolioStatusClass = portfolioStatusClass;
  viewMode: 'list' | 'grid' = 'list';
  categoryFilter: 'All' | 'Units' | 'Rooms' = 'All';
  searchQuery: string = '';
  showColumnDropdown = false;
  isImportModalOpen = false;
  currentUser = this.commonservice.getCurrentUser();
  // Advanced Filters & Drawer States
  isDrawerOpen: boolean = false;
  selectedType: string | null = "All";
  selectedStatus: string | null = null;
  selectedTag: string | null = null;
  selectedArea: string | null = null;
  selectedId: number | null = null;
  selectedRefNo: string | null = null;
  selectedLandlord: string | null = null;
  selectedOffPlanStatus: string | null = null;
  selectedInternalStatus: string | null = null;

  // Dropdown lists
  typesList: string[] = ['Residential', 'Commercial'];
  statusesList: string[] = ['Active', 'Draft', 'Suspended'];
  tagsList: string[] = ['Premium', 'Best Seller', 'Compact', 'Luxury', 'Corporate', 'Prime Location'];
  landlordsList: string[] = ['Orville Real Estate', 'Emaar Properties', 'DIFC Investments', 'Emaar Malls'];
  offPlanStatuses: string[] = ['Yes', 'No'];
  internalStatuses: string[] = ['Active', 'Draft', 'Suspended'];

  // Table Columns Definition
  tableColumns = [
    { key: 'code', label: 'web.common.lblID', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'name', label: 'web.common.lblName', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'type_name', label: 'web.property.lblType', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'internal Status', label: 'web.property.lblInternalStatus', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'tags', label: 'web.property.lblTags', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'total_leases', label: 'web.property.lblLeases', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'contracts', label: 'web.property.lblContracts', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'total_units', label: 'web.property.lblOccupiedTotalUnits', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'occupancy_rate', label: 'web.property.lblOccupancyRate', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'action', label: 'web.property.lblAction', headerClass: 'text-start', useTemplate: true, visible: true }
  ];

  openActionCode: string | number | null = null;
  edit_code:string='';
  deleteModal:boolean=false;
  get visibleColumns() {
    return this.tableColumns.filter(col => col.visible !== false);
  }

  get allColumnsSelected() {
    return this.tableColumns.every(col => col.visible !== false);
  }

  properties: any[] = [];
  filteredProperties: any[] = [];
  paginatedProperties: any[] = [];

  pageNo = 0;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  pageSizeOptions = [5, 10, 25, 50, 100];
  userChangedPageSize = false;

  // Metrics
  metrics:any = {}

  // Dynamic Unit Types Grouped by Property
  propertyUnitTypesMap: { [key: string]: { name: string; count: number; countDisplay: string; icon: string }[] } = {};
  allUnitsList: any[] = [];
  isLoadingUnitTypes: boolean = false;
  isActionMenuUpward: boolean = false;

  constructor(
    public translate: TranslateService,
    private propertiesService: PropertiesService,
    private portfolioService: PortfolioService,
    private commonservice:CommonService,
    private commontabservice:Common_TabsService,
    private toastr:ToastrService
  ) {}

  getArabicLookupName(row: any, key: string): string {
    return row[localStorage.getItem("selectedLang") === "EN" ? key : key + '_ar'] || row[key] || '';
  }

  ngOnInit(): void {
    
    this.loadMetrics(4,0, '', '','');
    this.applyLocalFilters();
    this.loadProperties(); 
  }

  /*loadMetrics() {
    const payload = {
      typeId: 4,
      filterId: 4,
      filterText: "",
      filterText1: "",
      userId: 1,
      clientId: "74BB6922",
      companyId: 0
    };
    this.propertiesService.getMasterDetails(payload).subscribe({
      next: (res: any) => {
        if (res && res.objResult) {
          const data = Array.isArray(res.objResult) ? res.objResult[0] : res.objResult;
          if (data) {
            this.metrics = {
              total: data.TotalProperties || data.totalProperties || data.total_properties || this.metrics.total,
              units: data.TotalUnits || data.totalUnits || data.total_units || this.metrics.units,
              occupied: data.OccupiedUnits || data.occupiedUnits || data.occupied_units || this.metrics.occupied,
              leases: data.ActiveLeases || data.activeLeases || data.active_leases || this.metrics.leases,
              occupancy: data.OccupancyRate || data.occupancyRate || data.occupancy_rate || this.metrics.occupancy
            };
          }
        }
      },
      error: (err: any) => console.error("Error loading metrics:", err)
    });
  }*/

  
private loadMetrics(
  typeId: number,
  filterId: number,
  target: '',
  filtertext:string ='',
  filterText1:string ='', 
) {
  this.portfolioService.getMasterByType({
    typeId: typeId,
    filterId,
     filterText: filtertext,
    filterText1: filterText1 
  }).subscribe({
    next: res => {
          if (res['statusCode']  != "200") {
              return;
            }
            this.metrics = res.objResult.table[0];
     
    },
    error: console.error
  });
}

  loadProperties(append = false): void {
    const filterList: any[] = [];
    if (this.selectedType && this.selectedType !== "All") {
      filterList.push({ 'key': 'P.property_type', 'value': this.selectedType });
    } 
// if (this.categoryFilter && this.categoryFilter !== "All") {
//       filterList.push({ 'key': 'P.property_type', 'value': this.selectedType });
//     } 
    const payload = {
      userid: this.currentUser?.userId,
      company_id: this.currentUser?.companyId,
      clientId: this.currentUser?.clientId,
      source: 'web',
      languageid: 1,
      page_no: this.pageNo,
      seqno: 0,
      search_keyword: this.searchQuery || '',
      pagecount: this.pageSize, // Load all to handle advanced dashboard filters locally for interactive UX
      filter_by: this.selectedType !== 'All' ? 'P.property_type' : '', 
      filter_list: JSON.stringify(filterList),
      featureid: 'Property'
    };

    this.propertiesService.getProperties(payload).subscribe({
      next: (res: any) => { 
        if (res && res.statusCode === "200") {
        const nextBatch = res.objResult.property || [];
        this.properties = append ? [...(this.properties || []), ...nextBatch] : nextBatch;
        if(res.objResult.rows_info)
        {
          this.totalRecords=res.objResult.rows_info[0].totalrecords;
          //this.pageNo=res.objResult.rows_info[0].currentpage; 
          this.totalPages=res.objResult.rows_info[0].noofpages;
        }
         
        this.paginatedProperties = this.properties;
        this.applyLocalFilters();
        this.loadUnitsForProperties();
        }
      },
      error: err => {
        console.error(err);
      }
    });
  }

  applyLocalFilters(): void {
    // let result = this.properties || [];
    // if (this.selectedType) {
    //   const type = this.selectedType.toLowerCase();
    //   result = result.filter(p => (p.type_name || '').toLowerCase() === type);
    // }
    // if (this.searchQuery) {
    //   const q = this.searchQuery.toLowerCase();
    //   result = result.filter(p =>
    //     (p.name && p.name.toLowerCase().includes(q)) ||
    //     (p.code && p.code.toString().toLowerCase().includes(q)) ||
    //     (p.type_name && p.type_name.toLowerCase().includes(q)) ||
    //     (p.address_1 && p.address_1.toLowerCase().includes(q)) ||
    //     (p.tags && p.tags.toLowerCase().includes(q))
    //   );
    // }
    // this.paginatedProperties = result;
    //   result = result.filter(p => 
    //     p.name.toLowerCase().includes(q) || 
    //     p.type_name.toLowerCase().includes(q)
    //   );
    // }

    // // Apply type filter
    // if (this.selectedType) {
    //   result = result.filter(p => p.type_name === this.selectedType);
    // }

    // // Apply status filter
    // if (this.selectedStatus) {
    //   result = result.filter(p => p['internal Status'] === this.selectedStatus);
    // }

    // // Apply tag filter
    // if (this.selectedTag) {
    //   result = result.filter(p => p.tags === this.selectedTag);
    // }

    // // Apply ID filter
    // if (this.selectedId) {
    //   result = result.filter(p => p.code === this.selectedId);
    // }

    // // this.totalRecords = result.length;
    
    // // if (!this.userChangedPageSize) {
    // //   if (this.totalRecords <= 5) this.pageSize = 5;
    // //   else if (this.totalRecords <= 10) this.pageSize = 10;
    // //   else if (this.totalRecords <= 25) this.pageSize = 25;
    // //   else if (this.totalRecords <= 50) this.pageSize = 50;
    // //   else this.pageSize = 100;
    // // }
    
    // // this.totalPages = Math.ceil(this.totalRecords / this.pageSize);

    // // // Paginate
    // // const startIndex = (this.pageNo - 1) * this.pageSize;
    // this.paginatedProperties = result;
  }

  setCategoryFilter(category: 'All' | 'Units' | 'Rooms'): void {
    this.categoryFilter = category;
    this.pageNo = 0;
    this.loadProperties();
  }

  setTypeFilter(type: string | null): void {
    this.selectedType = type;
    this.pageNo=0;
    this.loadProperties();
  }

  toggleColumn(key: string): void {
    const col = this.tableColumns.find(c => c.key === key);
    if (col) {
      col.visible = col.visible === false;
    }
  }

  toggleAllColumns(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.tableColumns.forEach(col => col.visible = checked);
  }

  setViewMode(mode: 'list' | 'grid'): void {
    this.viewMode = mode;
    this.showColumnDropdown = false;
    this.openActionCode = null;
    this.pageNo = 0;
    this.loadProperties();
  }

  get canLoadMore(): boolean {
    return this.displayPage < (this.totalPages || 1);
  }

  loadMore(): void {
    if (!this.canLoadMore) return;
    this.pageNo++;
    this.loadProperties(true);
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'list' ? 'grid' : 'list';
  }

  toggleDrawer(open: boolean): void {
    this.isDrawerOpen = open;
  }

  onSearch(): void {
    this.pageNo = 0;
    this.loadProperties();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedType = null;
    this.selectedStatus = null;
    this.selectedTag = null;
    this.selectedArea = null;
    this.selectedId = null;
    this.selectedRefNo = null;
    this.selectedLandlord = null;
    this.selectedOffPlanStatus = null;
    this.selectedInternalStatus = null;
    this.categoryFilter = 'All';
    this.pageNo = 0;
    this.loadProperties();
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
    this.userChangedPageSize = true;
    this.loadProperties();
  }
  handleChildNotification(ev:any){
    if(ev.action_name=="edit")
      window.location.href='/edit-property/'+ev.code;
    else if (ev.action_name=="delete")
    {
      this.deleteModal=!this.deleteModal;  
      this.edit_code=ev.code;
    }
  }
  deleterecord(){
    this.deleteModal=false;
    this.loadLookup(71,7, '', this.edit_code);
  }
  closeModal(){
    this.deleteModal=false;
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
            if(res.objResult.table[0].error_code=="-300"){
              this.toastr.error(res.objResult.table[0].msg);
              return;
            }
            else{
              this.toastr.success(this.translate.instant('web.common.msgMarkedInactiveSuccess'));
              this.edit_code='';
              this.loadProperties();
              this.pageNo=0;
              setTimeout(() => {
                window.location.reload();
              }, 2000);
            }
          
        } 
        }
        else
        this.toastr.error(this.translate.instant('web.common.lblNoRecordsFound'));
      },
      error: (err) => {
        console.error(`Error fetching lookup ${filterId}:`, err);
      }
    });
  }
  @HostListener('document:click')
  onDocumentClick(): void {
    this.openActionCode = null;
    this.isActionMenuUpward = false;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.openActionCode = null;
    this.isActionMenuUpward = false;
  }

  toggleRowAction(code: string | number, event: Event): void {
    event.stopPropagation();
    if (this.openActionCode === code) {
      this.openActionCode = null;
      this.isActionMenuUpward = false;
      return;
    }
    this.openActionCode = code;

    const btn = (event.currentTarget || event.target) as HTMLElement | null;
    if (btn) {
      const rect = btn.getBoundingClientRect();
      const menuHeight = 175; // Approximate action menu height (View, Edit, Publish/Unpublish, Delete)

      // Space below button relative to browser viewport
      const spaceBelowWindow = window.innerHeight - rect.bottom;

      // Space below button relative to scrollable table container (.table-vertical-scroll / .table-responsive)
      let spaceBelowContainer = Infinity;
      let spaceAboveContainer = Infinity;
      const scrollParent = btn.closest('.table-responsive, .table-vertical-scroll, .box') as HTMLElement | null;
      if (scrollParent) {
        const parentRect = scrollParent.getBoundingClientRect();
        spaceBelowContainer = parentRect.bottom - rect.bottom;
        spaceAboveContainer = rect.top - parentRect.top;
      }

      const spaceBelow = Math.min(spaceBelowWindow, spaceBelowContainer);
      // If there's not enough space below (< menuHeight) and there is room above, open above the 3 dots
      this.isActionMenuUpward = spaceBelow < menuHeight && (spaceAboveContainer > 80 || rect.top > menuHeight);
    } else {
      this.isActionMenuUpward = false;
    }
  }

  viewProperty(code: string | number): void {
    this.openActionCode = null;
    this.isActionMenuUpward = false;
    window.location.href = '/properties/' + code;
  }

  editProperty(code: string | number): void {
    this.openActionCode = null;
    this.isActionMenuUpward = false;
    window.location.href = '/edit-property/' + code;
  }

  togglePublishProperty(row: any): void {
    this.openActionCode = null;
    this.isActionMenuUpward = false;
    const isCurrentlyPublished = !!row.is_published;
    const flg = isCurrentlyPublished ? 18 : 17;

    this.commontabservice.getMasterByType({
      typeId: 71,
      filterId: flg,
      filterText: row.code,
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res?.statusCode == 200 || res?.statusCode === '200') {
          if (res.objResult?.table?.[0]?.error_code == '-300') {
            this.toastr.error(res.objResult.table[0].msg);
            return;
          }
          const serverMsg = res.objResult?.table?.[0]?.msg || res?.message;
          if (flg === 17) {
            this.toastr.success(serverMsg || 'Property published successfully');
          } else {
            this.toastr.success(serverMsg || 'Property unpublished successfully');
          }
          row.is_published = isCurrentlyPublished ? 0 : 1;
        } else {
          this.toastr.error(res?.message || 'Failed to update publish status');
        }
      },
      error: () => {
        this.toastr.error('Failed to update publish status');
      }
    });
  }

  isCommercialType(row: any): boolean {
    return String(this.getArabicLookupName(row, 'type_name') || '').toLowerCase().includes('commercial');
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
    this.loadProperties();
  }

  previousPage(): void {
    if (this.pageNo > 0) {
      this.pageNo--;
      this.loadProperties();
    }
  }

  nextPage(): void {
    if (this.displayPage < this.totalPages) {
      this.pageNo++;
      this.loadProperties();
    }
  }

  goToPage(page: number): void {
    if (page !== this.pageNo-1) {
      this.pageNo =  page-1;
      if(this.pageNo<0)
      this.pageNo=0;
      this.loadProperties();
    }
  }

  openImportModal(): void {
    this.isImportModalOpen = true;
  }

  onImportCompleted(): void {
    this.loadProperties();
    this.loadMetrics(4, 0, '', '', '');
  }

  loadUnitsForProperties(): void {
    const user = this.commonservice.getCurrentUser();
    const payload = {
      userid: user?.userId || 1,
      company_id: user?.companyId || 1,
      clientId: user?.clientId || '',
      source: 'web',
      languageid: 1,
      page_no: 0,
      seqno: 0,
      search_keyword: '',
      pagecount: 5000,
      filter_by: '',
      filter_list: '[]',
      featureid: 'Units'
    };

    this.isLoadingUnitTypes = true;
    this.propertiesService.getUnits(payload).subscribe({
      next: (res: any) => {
        this.isLoadingUnitTypes = false;
        if (res && res.statusCode === '200' && res.objResult && Array.isArray(res.objResult.units)) {
          this.allUnitsList = res.objResult.units;
          this.processUnitsData(this.allUnitsList);
        } else {
          this.fetchUnitsPerPropertyFallback();
        }
      },
      error: (err: any) => {
        this.isLoadingUnitTypes = false;
        console.error('Error fetching units for properties:', err);
        this.fetchUnitsPerPropertyFallback();
      }
    });
  }

  processUnitsData(units: any[]): void {
    const newMap: { [key: string]: { name: string; count: number; countDisplay: string; icon: string }[] } = {};

    this.properties.forEach(property => {
      const propCode = String(property.code || '').trim().toLowerCase();
      const propId = property.id ? String(property.id).trim() : '';
      const propName = String(property.name || '').trim().toLowerCase();

      // Find units matching this property
      const propUnits = units.filter((u: any) => {
        const uCode = String(u.property_code || u.propertyCode || '').trim().toLowerCase();
        const uId = u.property_id || u.propertyId ? String(u.property_id || u.propertyId).trim() : '';
        const uName = String(u.property_Name || u.property_name || u.property || '').trim().toLowerCase();

        return (
          (propCode && uCode && propCode === uCode) ||
          (propId && uId && propId === uId) ||
          (propName && uName && propName === uName)
        );
      });

      const typeCounts: { [typeName: string]: number } = {};
      propUnits.forEach((u: any) => {
        const typeName = this.resolveUnitTypeName(u);
        if (typeName) {
          typeCounts[typeName] = (typeCounts[typeName] || 0) + 1;
        }
      });

      const list = Object.keys(typeCounts).map(name => {
        const count = typeCounts[name];
        return {
          name,
          count,
          countDisplay: count < 10 ? '0' + count : String(count),
          icon: this.getUnitTypeIcon(name)
        };
      });

      list.sort((a, b) => this.compareUnitTypes(a.name, b.name));

      if (property.code) newMap[String(property.code)] = list;
      if (property.id) newMap[String(property.id)] = list;
      if (propName) newMap[propName] = list;
    });

    this.propertyUnitTypesMap = { ...this.propertyUnitTypesMap, ...newMap };

    // Targeted fallback for any property with total_units > 0 that found 0 matching units
    this.properties.forEach(p => {
      const codeKey = String(p.code || '');
      const idKey = String(p.id || '');
      const nameKey = String(p.name || '').trim().toLowerCase();
      const hasUnits = (this.propertyUnitTypesMap[codeKey]?.length || 0) > 0 ||
                       (this.propertyUnitTypesMap[idKey]?.length || 0) > 0 ||
                       (this.propertyUnitTypesMap[nameKey]?.length || 0) > 0;
      if (!hasUnits && (Number(p.total_units) > 0 || p.code)) {
        this.fetchUnitsForSingleProperty(p);
      }
    });
  }

  fetchUnitsForSingleProperty(property: any): void {
    if (!property?.code) return;
    const propKey = String(property.code);
    this.portfolioService.getMasterByType({
      typeId: 13,
      filterId: 0,
      filterText: property.code,
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res?.statusCode === '200' && res?.objResult?.units_info) {
          const unitsInfo = res.objResult.units_info;
          const typeCounts: { [typeName: string]: number } = {};
          unitsInfo.forEach((u: any) => {
            const typeName = this.resolveUnitTypeName(u);
            if (typeName) {
              typeCounts[typeName] = (typeCounts[typeName] || 0) + 1;
            }
          });
          const list = Object.keys(typeCounts).map(name => ({
            name,
            count: typeCounts[name],
            countDisplay: typeCounts[name] < 10 ? '0' + typeCounts[name] : String(typeCounts[name]),
            icon: this.getUnitTypeIcon(name)
          }));
          list.sort((a, b) => this.compareUnitTypes(a.name, b.name));
          this.propertyUnitTypesMap[propKey] = list;
          if (property.id) this.propertyUnitTypesMap[String(property.id)] = list;
          if (property.name) this.propertyUnitTypesMap[String(property.name).trim().toLowerCase()] = list;
        }
      },
      error: () => {}
    });
  }

  private fetchUnitsPerPropertyFallback(): void {
    if (!this.properties || this.properties.length === 0) return;
    this.properties.forEach(property => {
      if (property?.code && (!this.propertyUnitTypesMap[String(property.code)] || this.propertyUnitTypesMap[String(property.code)].length === 0)) {
        this.fetchUnitsForSingleProperty(property);
      }
    });
  }

  getUnitTypesForProperty(property: any): { name: string; count: number; countDisplay: string; icon: string }[] {
    if (!property) return [];
    const codeKey = String(property.code || '').trim();
    if (codeKey && this.propertyUnitTypesMap[codeKey]) {
      return this.propertyUnitTypesMap[codeKey];
    }
    const idKey = String(property.id || '').trim();
    if (idKey && this.propertyUnitTypesMap[idKey]) {
      return this.propertyUnitTypesMap[idKey];
    }
    const nameKey = String(property.name || '').trim().toLowerCase();
    if (nameKey && this.propertyUnitTypesMap[nameKey]) {
      return this.propertyUnitTypesMap[nameKey];
    }
    return [];
  }

  private resolveUnitTypeName(unit: any): string {
    const lang = localStorage.getItem('selectedLang') || 'EN';
    
    // 1. Check unit_type_name
    const typeName = lang === 'AR' && unit.unit_type_name_ar ? unit.unit_type_name_ar : (unit.unit_type_name || '');
    if (typeName && typeof typeName === 'string' && typeName.trim() && isNaN(Number(typeName))) {
      return typeName.trim();
    }

    // 2. Check unit_beds_name
    const bedsName = lang === 'AR' && unit.unit_beds_name_ar ? unit.unit_beds_name_ar : (unit.unit_beds_name || '');
    if (bedsName && typeof bedsName === 'string' && bedsName.trim() && isNaN(Number(bedsName))) {
      return bedsName.trim();
    }

    // 3. Check beds numeric/string
    if (unit.beds !== undefined && unit.beds !== null && unit.beds !== '' && unit.beds !== 'N/A') {
      const bedsStr = String(unit.beds).trim();
      if (bedsStr.toLowerCase().includes('bed') || bedsStr.toLowerCase().includes('studio')) {
        return bedsStr;
      }
      if (!isNaN(Number(bedsStr))) {
        const num = Number(bedsStr);
        return num === 0 ? 'Studio' : (num === 1 ? '1 bedroom' : `${num} bedroom`);
      }
      return bedsStr;
    }

    // 4. Check unit_type if string
    if (unit.unit_type && typeof unit.unit_type === 'string' && isNaN(Number(unit.unit_type))) {
      return unit.unit_type.trim();
    }

    // 5. Check category_name
    if (unit.category_name && typeof unit.category_name === 'string') {
      return unit.category_name.trim();
    }

    return 'Unit';
  }

  private getUnitTypeIcon(typeName: string): string {
    const lower = (typeName || '').toLowerCase();
    if (
      lower.includes('villa') ||
      lower.includes('commercial') ||
      lower.includes('office') ||
      lower.includes('retail') ||
      lower.includes('shop') ||
      lower.includes('warehouse') ||
      lower.includes('building') ||
      lower.includes('mall')
    ) {
      return 'assets/images/property-grid/building.svg';
    }
    return 'assets/images/property-grid/bed.svg';
  }

  private compareUnitTypes(a: string, b: string): number {
    const getRank = (str: string): number => {
      const s = (str || '').toLowerCase();
      if (s.includes('studio')) return 0;
      const match = s.match(/(\d+)/);
      if (match) {
        return parseInt(match[1], 10);
      }
      return 100;
    };

    const rankA = getRank(a);
    const rankB = getRank(b);

    if (rankA !== rankB) {
      return rankA - rankB;
    }
    return a.localeCompare(b);
  }
}
