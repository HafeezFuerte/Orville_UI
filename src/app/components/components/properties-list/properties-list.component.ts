import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../../../shared/shared.module';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { PropertiesService } from '../../../shared/services/properties.service';

@Component({
  selector: 'app-properties-list',
  standalone: true,
  imports: [FormsModule, CommonModule, SharedTableComponent, NgSelectModule, SharedModule, RouterModule],
  templateUrl: './properties-list.component.html',
  styleUrl: './properties-list.component.scss'
})
export class PropertiesListComponent implements OnInit {
  viewMode: 'list' | 'grid' = 'list';
  categoryFilter: 'All' | 'Units' | 'Rooms' = 'All';
  searchQuery: string = '';

  // Advanced Filters & Drawer States
  isDrawerOpen: boolean = false;
  selectedType: string | null = null;
  selectedStatus: string | null = null;
  selectedTag: string | null = null;
  selectedArea: string | null = null;
  selectedId: number | null = null;
  selectedRefNo: string | null = null;
  selectedLandlord: string | null = null;

  // Dropdown lists
  typesList: string[] = ['Residential', 'Commercial'];
  statusesList: string[] = ['Active', 'Draft', 'Suspended'];
  tagsList: string[] = ['Premium', 'Best Seller', 'Compact', 'Luxury', 'Corporate', 'Prime Location'];
  landlordsList: string[] = ['Orville Real Estate', 'Emaar Properties', 'DIFC Investments', 'Emaar Malls'];

  // Table Columns Definition
  tableColumns = [
    { key: 'id', label: 'ID', headerClass: 'text-start', useTemplate: true },
    { key: 'name', label: 'Name', headerClass: 'text-start', useTemplate: true },
    { key: 'type_name', label: 'Type', headerClass: 'text-start', useTemplate: true },
    { key: 'internal Status', label: 'Internal Status', headerClass: 'text-start', useTemplate: true },
    { key: 'tags', label: 'Tags', headerClass: 'text-start', useTemplate: true },
    { key: 'total_leases', label: 'Leases', headerClass: 'text-start', useTemplate: true },
    { key: 'contracts', label: 'Contracts', headerClass: 'text-start', useTemplate: true },
    { key: 'total_units', label: 'Occupied/Total Units', headerClass: 'text-start', useTemplate: true },
    { key: 'occupancy_rate', label: 'Occupancy Rate', headerClass: 'text-start', useTemplate: true }
  ];

  properties: any[] = [
    {
      id: 31658,
      name: 'Marina Heights Towers',
      type_name: 'Residential',
      'internal Status': 'Active',
      tags: 'Premium',
      total_leases: 44,
      contracts: 2,
      occupied_units: 42,
      total_units: 54,
      location: 'Dubai Marina, Tower A, Dubai',
      landlord: 'Orville Real Estate'
    },
    {
      id: 31659,
      name: 'Jumeirah Living',
      type_name: 'Residential',
      'internal Status': 'Active',
      tags: 'Best Seller',
      total_leases: 12,
      contracts: 1,
      occupied_units: 10,
      total_units: 12,
      location: 'Jumeirah, Dubai',
      landlord: 'Emaar Properties'
    },
    {
      id: 31660,
      name: 'Burj Khalifa Residences',
      type_name: 'Residential',
      'internal Status': 'Active',
      tags: 'Luxury',
      total_leases: 50,
      contracts: 5,
      occupied_units: 48,
      total_units: 50,
      location: 'Downtown Dubai, Dubai',
      landlord: 'Orville Real Estate'
    },
    {
      id: 31661,
      name: 'Index Tower',
      type_name: 'Commercial',
      'internal Status': 'Active',
      tags: 'Corporate',
      total_leases: 25,
      contracts: 3,
      occupied_units: 20,
      total_units: 25,
      location: 'DIFC, Dubai',
      landlord: 'DIFC Investments'
    },
    {
      id: 31662,
      name: 'Dubai Marina Mall',
      type_name: 'Commercial',
      'internal Status': 'Active',
      tags: 'Prime Location',
      total_leases: 30,
      contracts: 4,
      occupied_units: 28,
      total_units: 30,
      location: 'Dubai Marina, Dubai',
      landlord: 'Emaar Malls'
    }
  ];
  filteredProperties: any[] = [];
  paginatedProperties: any[] = [];

  pageNo = 1;
  pageSize = 5;
  totalPages = 0;
  totalRecords = 0;
  pageSizeOptions = [5, 10, 25, 50, 100];

  // Metrics
  metrics = {
    total: 17,
    units: 2955,
    occupied: 2319,
    leases: 2319,
    occupancy: 78.4
  };

  constructor(public translate: TranslateService, private propertiesService: PropertiesService) {}

  ngOnInit(): void {
    this.applyLocalFilters();
  }

  loadProperties(): void {
    const payload = {
      userid: 1,
      company_id: 1,
      clientId: "74BB6922",
      source: 'web',
      languageid: 1,
      page_no: this.pageNo,
      seqno: 0,
      search_keyword: this.searchQuery || '',
      pagecount: 100, // Load all to handle advanced dashboard filters locally for interactive UX
      filter_by: this.categoryFilter !== 'All' ? this.categoryFilter : '',
      featureid: 'Property'
    };

    this.propertiesService.getProperties(payload).subscribe({
      next: (response: any) => {
        this.properties = response.objResult.property || [];
        this.applyLocalFilters();
      },
      error: err => {
        console.error(err);
      }
    });
  }

  applyLocalFilters(): void {
    let result = this.properties;

    // Apply text search
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.type_name.toLowerCase().includes(q)
      );
    }

    // Apply type filter
    if (this.selectedType) {
      result = result.filter(p => p.type_name === this.selectedType);
    }

    // Apply status filter
    if (this.selectedStatus) {
      result = result.filter(p => p['internal Status'] === this.selectedStatus);
    }

    // Apply tag filter
    if (this.selectedTag) {
      result = result.filter(p => p.tags === this.selectedTag);
    }

    // Apply ID filter
    if (this.selectedId) {
      result = result.filter(p => p.id === this.selectedId);
    }

    this.totalRecords = result.length;
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);

    // Paginate
    const startIndex = (this.pageNo - 1) * this.pageSize;
    this.paginatedProperties = result.slice(startIndex, startIndex + this.pageSize);
  }

  setCategoryFilter(category: 'All' | 'Units' | 'Rooms'): void {
    this.categoryFilter = category;
    this.pageNo = 1;
    this.loadProperties();
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
    this.applyLocalFilters();
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
    this.categoryFilter = 'All';
    this.pageNo = 1;
    this.loadProperties();
  }

  onSharedTablePageChange(event: any): void {
    this.pageNo = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.applyLocalFilters();
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

  onPageSizeChange(): void {
    this.pageNo = 1;
    this.applyLocalFilters();
  }

  previousPage(): void {
    if (this.pageNo > 1) {
      this.pageNo--;
      this.applyLocalFilters();
    }
  }

  nextPage(): void {
    if (this.pageNo < this.totalPages) {
      this.pageNo++;
      this.applyLocalFilters();
    }
  }

  goToPage(page: number): void {
    if (page !== this.pageNo) {
      this.pageNo = page;
      this.applyLocalFilters();
    }
  }
}
