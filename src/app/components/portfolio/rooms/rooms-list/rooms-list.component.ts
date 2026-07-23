import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SharedModule } from '../../../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { PropertiesService } from '../../services/properties.service';

export interface Room {
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
  roomType: string;
  managementFee: string;
  status: 'Occupied' | 'Vacant' | 'Maintenance';
  addedDate: string;
  imageUrl: string;
  rentStatus: 'For Rent' | 'For Sale';
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

  // Advanced Filters
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
    { key: 'property', label: 'Property', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'landlord', label: 'Landlord', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'tags', label: 'Tags', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'unitType', label: 'Room Type', headerClass: 'text-start', useTemplate: true, visible: true },
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

  // Mock Rooms Data
  allRooms: Room[] = [
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
      roomType: '1 Bedroom',
      managementFee: 'AED 600',
      status: 'Occupied',
      addedDate: 'May 26, 2026',
      imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=60',
      rentStatus: 'For Rent'
    },
    {
      id: 31659,
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
      roomType: 'Maid Room',
      managementFee: 'AED 750',
      status: 'Vacant',
      addedDate: 'May 28, 2026',
      imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=60',
      rentStatus: 'For Rent'
    },
    {
      id: 31660,
      name: 'Apartment 209',
      category: 'Residential',
      beds: '1 Bed',
      baths: '1 Bath',
      area: '1523 Sqft',
      floor: '1 Floor',
      property: 'Marina Height Towers',
      location: 'Dubai Marina, Tower A, Dubai',
      landlord: 'Orville Real Estate',
      tags: 'Premium',
      unitType: 'Apartment',
      roomType: 'Private Room',
      managementFee: 'AED 450',
      status: 'Occupied',
      addedDate: 'May 29, 2026',
      imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&auto=format&fit=crop&q=60',
      rentStatus: 'For Rent'
    }
  ];

  filteredRooms: Room[] = [];
  paginatedRooms: Room[] = [];

  constructor(
    private translate: TranslateService,
    private propertiesService: PropertiesService
  ) { }

  ngOnInit(): void {
    this.loadMetrics();
    this.loadRooms();
  }

  loadMetrics() {
    const payload = {
      typeId: 6,
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
              total: data.rooms ?? data.totalRooms ?? data.total_rooms ?? data.TotalRooms ?? this.metrics.total,
              vacant: data.vacant ?? data.available ?? data.vacantRooms ?? data.vacant_rooms ?? this.metrics.vacant,
              occupied: data.occupied ?? data.occupiedRooms ?? data.occupied_rooms ?? this.metrics.occupied,
              maintenance: data.maintainence ?? data.maintenance ?? data.maintenanceRooms ?? this.metrics.maintenance
            };
          }
        }
      },
      error: (err: any) => console.error("Error loading metrics:", err)
    });
  }

  loadRooms() {
    const payload = {
      userid: 1,
      company_id: 1,
      clientId: "74BB6922",
      source: "web",
      languageid: 1,
      page_no: 0,
      seqno: 0,
      search_keyword: this.searchQuery || "",
      pagecount: 20,
      filter_by: "",
      filter_list: "",
      featureid: "Rooms"
    };

    this.propertiesService.getRooms(payload).subscribe({
      next: (response: any) => {
        if (response && response.statusCode === "200" && response.objResult) {
          let apiRooms: any[] = [];
          if (Array.isArray(response.objResult)) {
            apiRooms = response.objResult;
          } else if (response.objResult.rooms && Array.isArray(response.objResult.rooms)) {
            apiRooms = response.objResult.rooms;
          } else if (response.objResult.Rooms && Array.isArray(response.objResult.Rooms)) {
            apiRooms = response.objResult.Rooms;
          } else if (response.objResult.room && Array.isArray(response.objResult.room)) {
            apiRooms = response.objResult.room;
          } else if (response.objResult.property && Array.isArray(response.objResult.property)) {
            apiRooms = response.objResult.property;
          }

          if (apiRooms.length > 0) {
            this.allRooms = apiRooms.map((r: any) => {
              const categoryMap: any = { 1: 'Residential', 2: 'Commercial', 3: 'Industrial' };
              const unitTypeMap: any = { 1: 'Apartment', 2: 'Villa', 3: 'Office', 4: 'Warehouse', 5: 'Retail Store' };
              
              let bedsDisplay = '-';
              if (r.beds === 0 || String(r.beds).toLowerCase() === 'studio') {
                bedsDisplay = 'Studio';
              } else if (r.beds != null) {
                bedsDisplay = `${r.beds} Bed${r.beds > 1 ? 's' : ''}`;
              }

              return {
                id: r.code ?? r.room_code ?? '-',
                name: r.room_no ?? r.name ?? '-',
                category: categoryMap[r.category] ?? r.category_name ?? r.category ?? '-',
                beds: bedsDisplay,
                baths: (r.baths != null) ? `${r.baths} Bath${r.baths > 1 ? 's' : ''}` : '-',
                area: r.area ?? '-',
                floor: (r.floor_no != null) ? `${r.floor_no} Floor` : '-',
                property: r.property_code ?? '-',
                location: r.location ?? '-',
                landlord: r.landlord_codes ?? '-',
                tags: r.tags ?? '-',
                unitType: unitTypeMap[r.unit_type] ?? r.unit_type_name ?? r.unit_type ?? '-',
                roomType: r.room_type ?? '-',
                managementFee: (r.management_fee != null) ? `AED ${r.management_fee}` : '-',
                status: r.room_status === 1 ? 'Available' : r.room_status === 2 ? 'Rented' : r.room_status === 3 ? 'Under Maintenance' : r.room_status === 4 ? 'Reserved' : (r.room_status ?? r.status ?? '-'),
                addedDate: r.created_date ?? r.addedDate ?? '-',
                imageUrl: r.room_image ?? '',
                rentStatus: r.rent_type === 1 ? 'Monthly' : r.rent_type === 2 ? 'Quarterly' : r.rent_type === 3 ? 'Bi-Annually' : r.rent_type === 4 ? 'Yearly' : (r.rent_type ?? '-')
              };
            });
          }
        }
        this.applyFilters();
      },
      error: (err) => {
        console.error('Error loading rooms:', err);
        this.applyFilters();
      }
    });
  }

  applyFilters(): void {
    let temp = [...this.allRooms];

    // Category Tabs filter
    if (this.categoryFilter !== 'All') {
      temp = temp.filter(r => r.category === this.categoryFilter);
    }

    // Search bar filter
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      temp = temp.filter(r => r.property.toLowerCase().includes(q) || r.name.toLowerCase().includes(q));
    }

    // Criteria filters
    if (this.selectedCategory) {
      temp = temp.filter(r => r.category === this.selectedCategory);
    }
    if (this.selectedStatus) {
      temp = temp.filter(r => r.status === this.selectedStatus);
    }
    if (this.selectedBeds) {
      temp = temp.filter(r => r.beds === this.selectedBeds);
    }
    if (this.selectedRentStatus) {
      temp = temp.filter(r => r.rentStatus === this.selectedRentStatus);
    }

    // Drawer filters
    if (this.selectedTag) {
      temp = temp.filter(r => r.tags === this.selectedTag);
    }
    if (this.selectedArea) {
      const areaVal = this.selectedArea.toLowerCase();
      temp = temp.filter(r => r.area.toLowerCase().includes(areaVal));
    }
    if (this.selectedId) {
      temp = temp.filter(r => r.id === this.selectedId);
    }
    if (this.selectedLandlord) {
      temp = temp.filter(r => r.landlord === this.selectedLandlord);
    }

    this.filteredRooms = temp;
    this.totalRecords = temp.length;
    
    if (!this.userChangedPageSize) {
      if (this.totalRecords <= 5) this.pageSize = 5;
      else if (this.totalRecords <= 10) this.pageSize = 10;
      else if (this.totalRecords <= 25) this.pageSize = 25;
      else if (this.totalRecords <= 50) this.pageSize = 50;
      else this.pageSize = 100;
    }

    this.pageNo = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    const start = (this.pageNo - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedRooms = this.filteredRooms.slice(start, end);
  }

  setCategoryFilter(category: 'All' | 'Residential' | 'Commercial'): void {
    this.categoryFilter = category;
    this.applyFilters();
  }

  onSearch(): void {
    this.applyFilters();
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
    this.applyFilters();
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'list' ? 'grid' : 'list';
    this.updatePagination();
  }

  toggleDrawer(open: boolean): void {
    this.isDrawerOpen = open;
  }

  onSharedTablePageChange(event: { pageIndex: number; pageSize: number }): void {
    this.pageNo = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.userChangedPageSize = true;
    this.updatePagination();
  }

  onPageSizeChange(): void {
    this.pageNo = 1;
    this.userChangedPageSize = true;
    this.updatePagination();
  }

  previousPage(): void {
    if (this.pageNo > 1) {
      this.pageNo--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.pageNo < this.totalPages) {
      this.pageNo++;
      this.updatePagination();
    }
  }

  goToPage(page: number): void {
    this.pageNo = page;
    this.updatePagination();
  }

  get pages(): number[] {
    const arr = [];
    for (let i = 1; i <= this.totalPages; i++) {
      arr.push(i);
    }
    return arr;
  }

  get startRecord(): number {
    return this.totalRecords === 0 ? 0 : (this.pageNo - 1) * this.pageSize + 1;
  }

  get endRecord(): number {
    const end = this.pageNo * this.pageSize;
    return end > this.totalRecords ? this.totalRecords : end;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Occupied': return 'bg-success/20 text-success border border-success/30';
      case 'Vacant': return 'bg-danger/20 text-danger border border-danger/30';
      default: return 'bg-warning/20 text-warning border border-warning/30';
    }
  }

  trackByRoomId(index: number, item: Room): number {
    return item.id;
  }
}
