import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SharedModule } from '../../../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { PropertiesService } from '../../../../shared/services/properties.service';

export interface Unit {
  id: number;
  name: string;
  category: 'Residential' | 'Commercial';
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
  status: 'Occupied' | 'Vacant' | 'Maintenance';
  addedDate: string;
  imageUrl: string;
  rentStatus: 'For Rent' | 'For Sale';
}

@Component({
  selector: 'app-units-list',
  standalone: true,
  imports: [FormsModule, CommonModule, SharedTableComponent, NgSelectModule, SharedModule, RouterModule],
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
  categories: string[] = ['Residential', 'Commercial'];
  statuses: string[] = ['Occupied', 'Vacant', 'Maintenance'];
  bedsOptions: string[] = ['Studio', '1 Bed', '2 Bed', '3 Bed', '4 Bed', 'N/A'];
  rentStatuses: string[] = ['For Rent', 'For Sale'];

  // Lists for drawer dropdowns
  tagsList: string[] = ['Premium', 'Best Seller', 'Compact', 'Luxury', 'Corporate', 'Prime Location'];
  landlordsList: string[] = ['Orville Real Estate', 'Emaar Properties', 'DIFC Investments', 'Emaar Malls'];
  offPlanStatuses: string[] = ['Ready', 'Off Plan'];
  internalStatuses: string[] = ['Active', 'Draft', 'Suspended'];

  // Pagination
  pageNo = 1;
  pageSize = 6;
  totalPages = 0;
  totalRecords = 0;
  pageSizeOptions = [6, 12, 24, 48];

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
    { key: 'property', label: 'Property', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'landlord', label: 'Landlord', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'tags', label: 'Tags', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'unitType', label: 'Unit Type', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'floor', label: 'Floor Number', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'managementFee', label: 'Management Fee', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'status', label: 'Status', headerClass: 'text-start', useTemplate: true, visible: true }
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

  // Mock Units Data
  allUnits: Unit[] = [
    {
      id: 31658,
      name: 'Apartment 209',
      category: 'Residential',
      beds: '1 Bed',
      baths: '2 Bath',
      area: '1523 Sqft',
      floor: '1 Floor',
      property: 'Marina Height Towers',
      location: 'Dubai Marina, Tower A, Dubai',
      landlord: 'Orville Real Estate',
      tags: 'Premium',
      unitType: 'Apartment',
      managementFee: 'AED 600',
      status: 'Occupied',
      addedDate: 'May 26, 2026',
      imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=60',
      rentStatus: 'For Rent'
    },
    {
      id: 31659,
      name: 'Apartment 304',
      category: 'Residential',
      beds: '2 Bed',
      baths: '2 Bath',
      area: '1850 Sqft',
      floor: '3 Floor',
      property: 'Marina Height Towers',
      location: 'Dubai Marina, Tower A, Dubai',
      landlord: 'Orville Real Estate',
      tags: 'Best Seller',
      unitType: 'Apartment',
      managementFee: 'AED 750',
      status: 'Vacant',
      addedDate: 'May 28, 2026',
      imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=60',
      rentStatus: 'For Rent'
    },
    {
      id: 31660,
      name: 'Studio 105',
      category: 'Residential',
      beds: 'Studio',
      baths: '1 Bath',
      area: '850 Sqft',
      floor: '1 Floor',
      property: 'Jumeirah Living',
      location: 'JBR, Gate 2, Dubai',
      landlord: 'Emaar Properties',
      tags: 'Compact',
      unitType: 'Studio',
      managementFee: 'AED 400',
      status: 'Occupied',
      addedDate: 'June 01, 2026',
      imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&auto=format&fit=crop&q=60',
      rentStatus: 'For Rent'
    },
    {
      id: 31661,
      name: 'Penthouse 501',
      category: 'Residential',
      beds: '4 Bed',
      baths: '5 Bath',
      area: '4200 Sqft',
      floor: '50 Floor',
      property: 'Burj Khalifa Residences',
      location: 'Downtown Dubai, Dubai',
      landlord: 'Orville Real Estate',
      tags: 'Luxury',
      unitType: 'Penthouse',
      managementFee: 'AED 2500',
      status: 'Maintenance',
      addedDate: 'April 15, 2026',
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=60',
      rentStatus: 'For Sale'
    },
    {
      id: 31662,
      name: 'Office Suite 12B',
      category: 'Commercial',
      beds: 'N/A',
      baths: '2 Bath',
      area: '3100 Sqft',
      floor: '12 Floor',
      property: 'Index Tower',
      location: 'DIFC, Office Block C, Dubai',
      landlord: 'DIFC Investments',
      tags: 'Corporate',
      unitType: 'Office',
      managementFee: 'AED 1500',
      status: 'Occupied',
      addedDate: 'Jan 10, 2026',
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=60',
      rentStatus: 'For Rent'
    },
    {
      id: 31663,
      name: 'Retail Lot G-04',
      category: 'Commercial',
      beds: 'N/A',
      baths: '1 Bath',
      area: '1200 Sqft',
      floor: 'Ground',
      property: 'Dubai Marina Mall',
      location: 'Dubai Marina, Ground Floor, Dubai',
      landlord: 'Emaar Malls',
      tags: 'Prime Location',
      unitType: 'Retail',
      managementFee: 'AED 1100',
      status: 'Vacant',
      addedDate: 'March 20, 2026',
      imageUrl: 'https://images.unsplash.com/photo-1555529669-e69e7aa0db9a?w=600&auto=format&fit=crop&q=60',
      rentStatus: 'For Rent'
    }
  ];

  filteredUnits: Unit[] = [];
  paginatedUnits: Unit[] = [];

  constructor(public translate: TranslateService, private propertiesService: PropertiesService) {}

  ngOnInit(): void {
    this.loadMetrics();
    this.loadUnits();
  }

  loadMetrics() {
    const payload = {
      typeId: 5,
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
          let data = null;
          if (res.objResult.table && Array.isArray(res.objResult.table) && res.objResult.table.length > 0) {
            data = res.objResult.table[0];
          } else if (res.objResult.Table && Array.isArray(res.objResult.Table) && res.objResult.Table.length > 0) {
            data = res.objResult.Table[0];
          } else if (Array.isArray(res.objResult) && res.objResult.length > 0) {
            data = res.objResult[0];
          } else {
            data = res.objResult;
          }
          
          if (data) {
            this.metrics = {
              total: data.units ?? data.totalUnits ?? data.total_units ?? data.TotalUnits ?? this.metrics.total,
              vacant: data.vacant ?? data.available ?? data.vacantUnits ?? data.vacant_units ?? this.metrics.vacant,
              occupied: data.occupied ?? data.occupiedUnits ?? data.occupied_units ?? this.metrics.occupied,
              maintenance: data.maintainence ?? data.maintenance ?? data.maintenanceUnits ?? this.metrics.maintenance
            };
          }
        }
      },
      error: (err: any) => console.error("Error loading metrics:", err)
    });
  }

  loadUnits(): void {
    const payload = {
      userid: 1,
      company_id: 1,
      clientId: "74BB6922",
      source: "web",
      languageid: 1,
      page_no: 0,
      seqno: 0,
      search_keyword: this.searchQuery || "",
      pagecount: 200,
      filter_by: "",
      filter_list: "",
      featureid: "Units"
    };

    this.propertiesService.getUnits(payload).subscribe({
      next: (response: any) => {
        if (response && response.statusCode === "200" && response.objResult) {
          let apiUnits: any[] = [];
          if (Array.isArray(response.objResult)) {
            apiUnits = response.objResult;
          } else if (response.objResult.units && Array.isArray(response.objResult.units)) {
            apiUnits = response.objResult.units;
          } else if (response.objResult.Units && Array.isArray(response.objResult.Units)) {
            apiUnits = response.objResult.Units;
          } else if (response.objResult.unit && Array.isArray(response.objResult.unit)) {
            apiUnits = response.objResult.unit;
          } else if (response.objResult.property && Array.isArray(response.objResult.property)) {
            apiUnits = response.objResult.property;
          }

          if (apiUnits.length > 0) {
            this.allUnits = apiUnits.map((u: any) => ({
              id: u.code || u.unit_code || 31658,
              name: u.unit_no || 'Apartment',
              category: u.category || 'Residential',
              beds: u.beds || '1 Bed',
              baths: u.baths || '1 Bath',
              area: u.area || '1200 Sqft',
              floor: u.floor_no || '1 Floor',
              property: u.property_code || 'Marina Height Towers',
              location: 'Dubai Marina, Tower A, Dubai',
              landlord: u.landlord_codes || 'Orville Real Estate',
              tags: u.tags || 'Premium',
              unitType: u.unit_type || 'Apartment',
              managementFee: u.management_fee ? `AED ${u.management_fee}` : 'AED 600',
              status: u.unit_status || 'Occupied',
              addedDate: 'May 26, 2026',
              imageUrl: u.unit_image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=60',
              rentStatus: u.rent_type || 'For Rent'
            }));
          }
        }
        this.filterAndPaginate();
      },
      error: err => {
        console.error(err);
        this.filterAndPaginate();
      }
    });
  }

  filterAndPaginate(): void {
    let result = this.allUnits;

    // 1. Filter by category tabs OR selected category dropdown
    if (this.categoryFilter !== 'All') {
      result = result.filter(u => u.category === this.categoryFilter);
    } else if (this.selectedCategory) {
      result = result.filter(u => u.category === this.selectedCategory);
    }

    // 2. Filter by status dropdown
    if (this.selectedStatus) {
      result = result.filter(u => u.status === this.selectedStatus);
    }

    // 3. Filter by beds dropdown
    if (this.selectedBeds) {
      result = result.filter(u => u.beds === this.selectedBeds);
    }

    // 4. Filter by rent status dropdown
    if (this.selectedRentStatus) {
      result = result.filter(u => u.rentStatus === this.selectedRentStatus);
    }

    // 5. Drawer custom filters
    if (this.selectedTag) {
      result = result.filter(u => u.tags === this.selectedTag);
    }
    if (this.selectedLandlord) {
      result = result.filter(u => u.landlord === this.selectedLandlord);
    }
    if (this.selectedId) {
      result = result.filter(u => u.id === this.selectedId);
    }
    if (this.selectedArea) {
      result = result.filter(u => u.area.toLowerCase().includes(this.selectedArea!.toLowerCase()));
    }

    // 6. Filter by search query
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(u => 
        u.property.toLowerCase().includes(query) || 
        u.name.toLowerCase().includes(query) ||
        u.landlord.toLowerCase().includes(query)
      );
    }

    this.totalRecords = result.length;
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

  onSharedTablePageChange(event: any): void {
    this.pageNo = event.pageIndex + 1;
    this.pageSize = event.pageSize;
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
      case 'Vacant': return 'bg-danger/10 text-danger border border-danger/20';
      case 'Maintenance': return 'bg-warning/10 text-warning border border-warning/20';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
