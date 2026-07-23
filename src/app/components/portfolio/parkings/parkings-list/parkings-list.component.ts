import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SharedModule } from '../../../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { PropertiesService } from '../../services/properties.service';
import { ToastrService } from 'ngx-toastr';

export interface Parking {
  id: number;
  parkingNo: string;
  property: string;
  location: string;
  unit: string;
  type: 'Free' | 'Chargeable';
  fee: string;
  cycle: 'Fixed' | 'Daily' | 'Weekly' | 'Monthly';
  remarks: string;
  createdDate: string;
  updatedDate: string;
}

@Component({
  selector: 'app-parkings-list',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, SharedTableComponent, NgSelectModule, SharedModule, RouterModule],
  templateUrl: './parkings-list.component.html',
  styleUrl: './parkings-list.component.scss'
})
export class ParkingsListComponent implements OnInit {
  viewMode: 'list' | 'grid' = 'list';
  searchQuery: string = '';
  
  // Modal & Drawer Visibility State
  showAddModal = false;
  isDrawerOpen = false;
  showColumnDropdown = false;

  // Add Parking Form State
  parkingForm = {
    property_code: null,
    unit_code: null,
    parking_no: '',
    parking_type: null,
    recurring_cycle: null,
    remarks: ''
  };

  parkingTypes = [
    { id: 1, name: 'Free' },
    { id: 2, name: 'Chargeable' }
  ];

  recurringCycles = [
    { id: 1, name: 'Fixed' },
    { id: 2, name: 'Daily' },
    { id: 3, name: 'Weekly' },
    { id: 4, name: 'Monthly' }
  ];

  // Pagination
  pageNo = 1;
  pageSize = 5;
  totalPages = 0;
  totalRecords = 0;
  pageSizeOptions = [5, 10, 25, 50, 100];
  userChangedPageSize = false;

  // Metrics
  metrics = {
    total: 955,
    available: 60,
    occupied: 885,
    reserved: 10
  };

  // Columns definition for the shared table component
  tableColumns = [
    { key: 'id', label: 'ID', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'parkingNo', label: 'Parking No.', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'property', label: 'Property', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'unit', label: 'Unit', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'type', label: 'Type', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'fee', label: 'Fee', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'cycle', label: 'Cycle', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'remarks', label: 'Remarks', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'createdDate', label: 'Created', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'updatedDate', label: 'Updated', headerClass: 'text-start', useTemplate: true, visible: true }
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

  isEditMode: boolean = false;
  currentEditId: number = 0;
  currentEditCode: string = '';

  toggleDrawer(open: boolean): void {
    this.isDrawerOpen = open;
  }

  // Mock Parkings Data
  allParkings: Parking[] = [];

  filteredParkings: Parking[] = [];
  paginatedParkings: Parking[] = [];

  propertiesList: any[] = [];
  allUnits: any[] = [];
  unitsList: any[] = [];

  constructor(
    private translate: TranslateService,
    private propertiesService: PropertiesService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadMetrics();
    this.loadParkings();
    this.loadProperties();
    this.loadUnits();
  }

  onPropertyChange(event: any) {
    this.parkingForm.unit_code = null;
    const propertyCode = event?._safeCode || event?.code || event?.id;
    
    if (propertyCode) {
      this.unitsList = this.allUnits.filter(u => u.property_code === propertyCode || u.propertyCode === propertyCode || u.property_id === propertyCode);
    } else {
      this.unitsList = [...this.allUnits];
    }
  }

  loadUnits() {
    const payload = {
      userid: 1,
      company_id: 1,
      clientId: "74BB6922",
      source: 'web',
      languageid: 1,
      page_no: 0,
      seqno: 0,
      search_keyword: '',
      pagecount: 100,
      filter_by: '',
      featureid: 'Units'
    };
    this.propertiesService.getUnits(payload).subscribe({
      next: (response: any) => {
        let apiUnits: any[] = [];
        if (Array.isArray(response)) {
          apiUnits = response;
        } else if (response && response.objResult) {
          if (Array.isArray(response.objResult)) apiUnits = response.objResult;
          else if (response.objResult.unit) apiUnits = response.objResult.unit;
          else if (response.objResult.units) apiUnits = response.objResult.units;
          else if (response.objResult.Unit) apiUnits = response.objResult.Unit;
          else if (response.objResult.Units) apiUnits = response.objResult.Units;
        }

        if (Array.isArray(apiUnits) && apiUnits.length > 0) {
          this.allUnits = apiUnits.map((u: any) => ({
            ...u,
            _safeCode: u.unit_code || u.code || String(u.id || ''),
            displayName: `${u.unit_code || u.code || u.id || ''} - ${u.unit_no || u.name || ''}`
          }));
          this.unitsList = [...this.allUnits];
        }
      },
      error: (err: any) => {
        console.error('Error loading units:', err);
      }
    });
  }

  loadMetrics() {
    const payload = {
      typeId: 7,
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
              total: data.parkings !== undefined ? data.parkings : this.metrics.total,
              available: data.available !== undefined ? data.available : this.metrics.available,
              occupied: data.occupied !== undefined ? data.occupied : this.metrics.occupied,
              reserved: data.maintainence !== undefined ? data.maintainence : this.metrics.reserved
            };
          }
        }
      },
      error: (err: any) => console.error("Error loading metrics:", err)
    });
  }

  loadParkings() {
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
      featureid: "parkings"
    };

    this.propertiesService.getParkings(payload).subscribe({
      next: (response: any) => {
        if (response && response.statusCode === "200" && response.objResult) {
          let apiParkings: any[] = [];
          if (Array.isArray(response.objResult)) {
            apiParkings = response.objResult;
          } else if (response.objResult.parkings && Array.isArray(response.objResult.parkings)) {
            apiParkings = response.objResult.parkings;
          } else if (response.objResult.Parkings && Array.isArray(response.objResult.Parkings)) {
            apiParkings = response.objResult.Parkings;
          } else if (response.objResult.parking && Array.isArray(response.objResult.parking)) {
            apiParkings = response.objResult.parking;
          }

          if (apiParkings.length > 0) {
            this.allParkings = apiParkings.map((p: any) => ({
              id: p.code ?? p.parking_no ?? '-',
              parkingNo: p.parking_no ?? '-',
              property: p.property ?? p.property_name ?? '-',
              location: p.location ?? '-',
              unit: p.unit_code ?? '-',
              type: String(p.parking_type) === '1' ? 'Free' : String(p.parking_type) === '2' ? 'Chargeable' : p.parking_type === 'Free' ? 'Free' : p.parking_type === 'Chargeable' ? 'Chargeable' : (p.parking_type_nm ?? p.parking_type ?? '-'),
              fee: (p.fee != null) ? (p.fee == 0 ? 'AED 0.00' : `AED ${p.fee}`) : '-',
              cycle: String(p.recurring_cycle) === '1' ? 'Fixed' : String(p.recurring_cycle) === '2' ? 'Daily' : String(p.recurring_cycle) === '3' ? 'Weekly' : String(p.recurring_cycle) === '4' ? 'Monthly' : p.recurring_cycle === 'Fixed' ? 'Fixed' : p.recurring_cycle === 'Daily' ? 'Daily' : p.recurring_cycle === 'Weekly' ? 'Weekly' : p.recurring_cycle === 'Monthly' ? 'Monthly' : (p.recurring_cycle_nm ?? p.recurring_cycle ?? '-'),
              remarks: p.remarks ?? '-',
              createdDate: p.createdDate ?? p.created_date ?? '-',
              updatedDate: p.updatedDate ?? p.updated_date ?? '-',
              raw_property_code: p.property_code,
              raw_unit_code: p.unit_code,
              raw_parking_type: p.parking_type,
              raw_recurring_cycle: p.recurring_cycle,
              raw_id: p.id,
              raw_code: p.code
            }));
          }
        } else {
          this.allParkings = [];
        }
        this.applyFilters();
      },
      error: (err: any) => {
        console.error('Error loading parkings:', err);
        this.applyFilters();
      }
    });
  }

  loadProperties() {
    const payload = {
      userid: 1,
      company_id: 1,
      clientId: "74BB6922",
      source: 'web',
      languageid: 1,
      page_no: 0,
      seqno: 0,
      search_keyword: '',
      pagecount: 100,
      filter_by: '',
      featureid: 'Property'
    };
    this.propertiesService.getProperties(payload).subscribe({
      next: (response: any) => {
        let apiProps: any[] = [];
        if (Array.isArray(response)) {
          apiProps = response;
        } else if (response && response.objResult) {
          if (Array.isArray(response.objResult)) apiProps = response.objResult;
          else if (response.objResult.property) apiProps = response.objResult.property;
          else if (response.objResult.properties) apiProps = response.objResult.properties;
          else if (response.objResult.Property) apiProps = response.objResult.Property;
          else if (response.objResult.Properties) apiProps = response.objResult.Properties;
        }

        if (Array.isArray(apiProps) && apiProps.length > 0) {
          this.propertiesList = apiProps.map((p: any) => ({
            ...p,
            _safeCode: p.code || String(p.id),
            displayName: `${p.code || p.id} - ${p.name}`
          }));
        }
      },
      error: (err: any) => {
        console.error('Error loading properties:', err);
      }
    });
  }

  applyFilters(): void {
    let temp = [...this.allParkings];

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      temp = temp.filter(p => p.property.toLowerCase().includes(q) || p.parkingNo.toLowerCase().includes(q) || p.unit.toLowerCase().includes(q));
    }

    this.filteredParkings = temp;
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
    this.paginatedParkings = this.filteredParkings.slice(start, end);
  }

  onSearch(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.applyFilters();
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'list' ? 'grid' : 'list';
    this.updatePagination();
  }

  toggleAddModal(open: boolean): void {
    this.showAddModal = open;
    if (!open) {
      this.isEditMode = false;
      this.currentEditId = 0;
      this.currentEditCode = '';
      this.parkingForm = {
        property_code: null,
        unit_code: null,
        parking_no: '',
        parking_type: null,
        recurring_cycle: null,
        remarks: ''
      };
    }
  }

  editParking(row: any): void {
    this.isEditMode = true;
    this.currentEditId = row.raw_id || 0;
    this.currentEditCode = row.raw_code || '';
    
    // We must ensure unitsList is populated for the given property
    const propertyCode = row.raw_property_code;
    if (propertyCode) {
      this.unitsList = this.allUnits.filter(u => u.property_code === propertyCode || u.propertyCode === propertyCode || u.property_id === propertyCode);
    }
    
    this.parkingForm = {
      property_code: row.raw_property_code,
      unit_code: row.raw_unit_code,
      parking_no: row.parkingNo !== '-' ? row.parkingNo : '',
      parking_type: row.raw_parking_type,
      recurring_cycle: row.raw_recurring_cycle,
      remarks: row.remarks !== '-' ? row.remarks : ''
    };
    
    this.showAddModal = true;
  }

  saveParking(): void {
    if (!this.parkingForm.property_code || !this.parkingForm.unit_code || !this.parkingForm.parking_no || !this.parkingForm.parking_type) {
      this.toastr.warning('Please fill in all required fields.', 'Validation Error');
      return;
    }

    const payload = {
      userid: 1,
      company_id: 1,
      clientId: "74BB6922",
      source: "web",
      languageid: 1,
      id: this.isEditMode ? this.currentEditId : 0,
      property_code: this.parkingForm.property_code || '',
      unit_code: this.parkingForm.unit_code || '',
      code: this.isEditMode ? this.currentEditCode : "",
      parking_no: this.parkingForm.parking_no || '',
      parking_type: this.parkingForm.parking_type || '',
      status: 1,
      room_code: "",
      rooom_code: "",
      recurring_cycle: this.parkingForm.recurring_cycle || 0,
      remarks: this.parkingForm.remarks || ""
    };

    this.propertiesService.addParking(payload).subscribe({
      next: (res: any) => {
        this.toastr.success(`Parking ${this.isEditMode ? 'updated' : 'created'} successfully.`, 'Success');
        this.toggleAddModal(false);
        this.loadParkings();
      },
      error: (err: any) => {
        console.error('Failed to save parking:', err);
        this.toastr.error('Failed to save parking.', 'Error');
      }
    });
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

  getTypeClass(type: string): string {
    return type === 'Free' ? 'bg-light text-gray-600 border border-gray-200' : 'bg-primary/10 text-primary border border-primary/20';
  }

  trackByParkingId(index: number, item: Parking): number {
    return item.id;
  }
}
