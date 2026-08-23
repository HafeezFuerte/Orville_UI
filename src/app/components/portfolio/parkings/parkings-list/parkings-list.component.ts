import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SharedModule } from '../../../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { PropertiesService } from '../../services/properties.service';
import { ToastrService } from 'ngx-toastr';
import { Common_TabsService } from '../../services/common_tabs.service';
import { AuthPayload } from '../../../common/store/login-auth-params/auth.models';
import { CommonService } from '../../../../services/common.service';
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

import { FilterDrawerComponent } from '../../../../shared/components/filter-drawer/filter-drawer.component';

@Component({
  selector: 'app-parkings-list',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, SharedTableComponent, NgSelectModule, SharedModule, RouterModule, FilterDrawerComponent],
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

  selectedProperty: string | null = null;
  selectedStatus: number | null = null;
  selectedType: number | null = null;

  // Add Parking Form State
  parkingForm = {
    property_code: null,
    unit_code: null,
    parking_no: '',
    parking_type: null,
    recurring_cycle: null,status: null,
    remarks: ''
  };
 

  // Pagination
  pageNo = 0;
  pageSize = 10;
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
    { key: 'parking_status_nm', label: 'Status', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'type', label: 'Type', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'fee', label: 'Fee', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'cycle', label: 'Cycle', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'remarks', label: 'Remarks', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'created_date', label: 'Created', headerClass: 'text-start', useTemplate: true, visible: true },
    { key: 'modified_date', label: 'Updated', headerClass: 'text-start', useTemplate: true, visible: true },
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
  currentUser: AuthPayload | null = null;
  isEditMode: boolean = false;
  currentEditId: number = 0;
  currentEditCode: string = '';

  toggleDrawer(open: boolean): void {
    this.isDrawerOpen = open;
  }

  // Mock Parkings Data
  allParkings: any[] = [];

  filteredParkings: Parking[] = [];
  paginatedParkings: Parking[] = [];
  ParkingTypeList: any[] = [];
  RecurringCycleList: any[] = [];
  StatusList: any[] = [];
  propertiesList: any[] = [];
  allUnits: any[] = [];
  unitsList: any[] = [];

  constructor(
    private translate: TranslateService,
    private propertiesService: PropertiesService,
    private toastr: ToastrService,
    private commontabservice:Common_TabsService,
    private commonService:CommonService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.commonService.getCurrentUser();
    this.loadMetrics();
    this.loadParkings();
    this.loadMasterDataByType(2,12,'ParkingTypeList','','') 
    this.loadMasterDataByType(2,14,'StatusList','','') 
    this.loadMasterDataByType(2,13,'RecurringCycleList','','') 
    this.loadMasterDataByType(11,0,'propertiesList','','') 
  }

  onPropertyChange(event: any) {
    this.parkingForm.unit_code = null;
    const propertyCode = event?._safeCode || event?.code || event?.id; 
    this.unitsList=[];
    this.loadMasterDataByType(3,0,'unitsList',propertyCode,'') 
  }
 
  private loadMasterDataByType(
    typeId: number,
    filterId: number,
    target: 'propertiesList' | 'unitsList' | 'ParkingTypeList' |'StatusList' |'RecurringCycleList',
    filtertext:string,
    filterText1:string, 
  ) {
    this.commontabservice.getMasterByType({
      typeId: typeId,
      filterId,
       filterText: filtertext,
      filterText1: filterText1 
    }).subscribe({
      next: res => {
        if(res['statusCode'] == 200)
          this[target] = res.objResult.table;
       
      },
      error: console.error
    });
  }
  loadMetrics() { 
    this.commontabservice.getMasterByType({
      typeId: 7,
      filterid:0,
       filterText: '',
      filterText1: '' 
    }).subscribe({
      next: res => {
        if(res['statusCode'] == 200){
        let data = res.objResult.table[0]; 
        if (data) {
          this.metrics = {
            total: data.parkings !== undefined ? data.parkings : this.metrics.total,
            available: data.available !== undefined ? data.available : this.metrics.available,
            occupied: data.occupied !== undefined ? data.occupied : this.metrics.occupied,
            reserved: data.reserved !== undefined ? data.reserved : this.metrics.reserved
          };
        }
      }
      },
      error: console.error
    });
 
  }
 
  loadParkings() {
    const filterList: any[] = [];
    if (this.selectedProperty) {
      filterList.push({ key: 'p.property_code', value: this.selectedProperty });
    }
    if (this.selectedStatus) {
      filterList.push({ key: 'p.status', value: this.selectedStatus });
    }
    if (this.selectedType) {
      filterList.push({ key: 'p.parking_type', value: this.selectedType });
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
      featureid: "parkings"
    };

    this.propertiesService.getParkings(payload).subscribe({
      next: (response: any) => { 
        if (response && response.statusCode === "200" && response.objResult) { 
          this.allParkingsData = response.objResult.parkings || [];
          this.paginatedParkings = response.objResult.parkings || [];
          if(response.objResult.rows_info)
          {
            this.totalRecords=response.objResult.rows_info[0].totalrecords; 
            this.totalPages=response.objResult.rows_info[0].noofpages;
          }
        }
        else
          this.toastr.error("No record[s] found");

      },
      error: (err: any) => {
        console.error('Error loading parkings:', err);
        this.applyFilters();
      }
    });
  }

  allParkingsData: any[] = [];

  applyFilters(): void {
    if (!this.allParkingsData || this.allParkingsData.length === 0) {
      this.allParkingsData = [...(this.paginatedParkings || [])];
    }
    let temp = [...(this.allParkingsData || [])];
    if (this.searchQuery && this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      temp = temp.filter(p =>
        (p.property && p.property.toLowerCase().includes(q)) ||
        (p.parking_no && p.parking_no.toString().toLowerCase().includes(q)) ||
        (p.unit && p.unit.toLowerCase().includes(q)) ||
        (p.code && p.code.toString().toLowerCase().includes(q))
      );
    }
    this.paginatedParkings = temp;
  }
 
  onSearch(): void {
    this.pageNo=0;
    this.loadParkings();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedProperty = null;
    this.selectedStatus = null;
    this.selectedType = null;
    this.pageNo = 0;
    this.loadParkings();
  }
  getArabicLookupName(row:any,key:string){
    return row[(localStorage.getItem("selectedLang")=="EN" ? key : key+'_ar')];
  } 
  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'list' ? 'grid' : 'list'; 
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
        status:null,
        remarks: ''
      };
    }
  }

  editParking(row: any): void {
    this.isEditMode = true;
    this.currentEditId = row.id || 0;
    this.currentEditCode = row.code || '';
    
    // We must ensure unitsList is populated for the given property
    const propertyCode = row.property_code;
    if (propertyCode) {
      this.loadMasterDataByType(3,0,'unitsList',propertyCode,'') 
    }
    
    this.parkingForm = {
      property_code: row.property_code,
      unit_code: row.unit_code,
      parking_no: row.parking_no !== '-' ? row.parking_no : '',
      parking_type: row.parking_type,
      recurring_cycle: row.recurring_cycle,
      remarks: row.remarks !== '-' ? row.remarks : '',
      status:row.status
    };
    
    this.showAddModal = true;
  }

  saveParking(): void {
    if (!this.parkingForm.property_code || !this.parkingForm.unit_code || !this.parkingForm.parking_no || !this.parkingForm.parking_type) {
      this.toastr.warning('Please fill in all required fields.', 'Validation Error');
      return;
    }

    const payload = {
      userid: Number(this.currentUser?.userId || localStorage.getItem('userId')) || 1,
      company_id: Number(this.currentUser?.companyId || localStorage.getItem('companyId')) || 1,
      clientId: this.currentUser?.clientId || localStorage.getItem('clientId') || '74BB6922',
      source: "web",
      languageid: 1,
      id: this.isEditMode ? this.currentEditId : 0,
      property_code: this.parkingForm.property_code || '',
      unit_code: this.parkingForm.unit_code || '',
      code: this.isEditMode ? this.currentEditCode : "",
      parking_no: this.parkingForm.parking_no || '',
      parking_type: this.parkingForm.parking_type || '',
      status: this.parkingForm.status || 96, // available id
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

  handleEditAction(row: any) {
    if (row.action_name === 'edit') {
      this.editParking(row);
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

  viewParking(row: any): void {
    this.openActionCode = null;
    this.editParking(row);
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

  onPageSizeChange(event: any): void {
    this.pageNo = 0;
    this.userChangedPageSize = true;
    this.loadParkings();
  }

  previousPage(): void {
    if (this.pageNo > 0) {
      this.pageNo--;
      this.loadParkings();
    }
  }

  nextPage(): void {
    if (this.displayPage < this.totalPages) {
      this.pageNo++;
      this.loadParkings();
    }
  }

  goToPage(page: number): void {
    if (page !== this.pageNo - 1) {
      this.pageNo = page - 1;
      if (this.pageNo < 0) this.pageNo = 0;
      this.loadParkings();
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
    this.pageNo = event.pageIndex;
    this.pageSize = event.pageSize;
    this.userChangedPageSize = true;
    this.loadParkings();
  }

  trackByParkingId(index: number, item: Parking): number {
    return item.id;
  }
}
