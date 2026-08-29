import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { FilterDrawerComponent } from '../../../shared/components/filter-drawer/filter-drawer.component';
import { Common_TabsService } from '../../portfolio/services/common_tabs.service';
import { AuthPayload } from '../../common/store/login-auth-params/auth.models';
import { CommonService } from '../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
export interface Litigation {
  id: string;
  name: string;
  details: string;
  legalFirm: string;
  caseDate: string;
  status: 'Open' | 'Closed' | 'Pending';
  escalationOption: number;
  property: string;
  unit: string;
  lease: string;
  unitBlocked: 'Yes' | 'No';
  tenantBlocked: 'Yes' | 'No';
  hearingsCount: number;
  attachmentsCount: number;
  notesCount: number;
  internalStatus: string;
}

@Component({
  selector: 'app-litigations',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule, TranslateModule, SharedTableComponent, FilterDrawerComponent],
  templateUrl: './litigations.component.html',
  styleUrls: []
})
export class LitigationsComponent implements OnInit {
  private commonService =inject(CommonService);
  private commontabservice =inject(Common_TabsService);
  private toastr=inject(ToastrService);
  searchQuery: string = '';
  isLoading: boolean = false;
  activeStatusFilter: string = 'All';
  showColumnDropdown = false;
  isDrawerOpen: boolean = false;
  currentUser: AuthPayload | null = this.commonService.getCurrentUser();
  // Filter models
  filterLegalFirm: string | null = null;
  filterProperty: string | null = null;
  filterUnitBlocked: string | null = null;
  filterTenantBlocked: string | null = null;

  // Filter option lists
  legalFirmsList: string[] = ['Smith & Partners', 'Legal Associates LLC', 'Justice Legal Consultants', 'Elite Law Firm', 'Prime Legal Services'];
  propertiesList: string[] = ['Sunrise Apartments', 'Green Heights', 'Oak Residency', 'City Center Plaza', 'River View Towers'];
  blockedStatusList: string[] = ['Yes', 'No'];

  pageNo = 0;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  pageSizeOptions = [5, 10, 25, 50, 100];
  
  tableColumns = [
    { key: 'code', label: 'ID', visible: true, useTemplate: true },
    { key: 'case_name', label: 'Name', visible: true },
    { key: 'details', label: 'Details', visible: true },
    { key: 'legal_firm', label: 'Legal Firm', visible: true },
    { key: 'case_date', label: 'Case Date', visible: true },
    { key: 'status_nm', label: 'Status', visible: true, useTemplate: true },
    { key: 'escalation_option', label: 'Escalation Option', visible: true},
    { key: 'property', label: 'Property', visible: true, useTemplate: true },
    { key: 'unit_no', label: 'Unit', visible: true, useTemplate: true },
    { key: 'active_lease', label: 'Lease', visible: true, useTemplate: true },
    { key: 'tenant', label: 'Tenant', visible: true, useTemplate: true },
    { key: 'unitBlocked', label: 'Unit Blocked', visible: true, useTemplate: true },
    { key: 'tenantBlocked', label: 'Tenant Blocked', visible: true, useTemplate: true },
    { key: 'hearingsCount', label: 'Hearings Count', visible: true, useTemplate: true },
    { key: 'attachmentsCount', label: 'Attachments Count', visible: true, useTemplate: true },
    { key: 'notesCount', label: 'Notes Count', visible: true, useTemplate: true },
    { key: 'internalStatus', label: 'Internal Statuses', visible: true }
  ];

  litigationsData:any= [];

  filteredData: Litigation[] = [];

  ngOnInit() {
    this.loadlegalcases();
    this.applyFilters();
  }
  getArabicLookupName(row:any,key:string){ 
    return row[(localStorage.getItem("selectedLang")=="EN" ? key : key+'_ar')];
  } 
  loadlegalcases() {
    const filterList: any[] = [];
    if (this.activeStatusFilter && this.activeStatusFilter !== "All") {
      filterList.push({ 'key': 'P.status', 'value': this.activeStatusFilter });
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
      filter_by: this.activeStatusFilter !== 'All' ? 'status' : '',
      filter_list: JSON.stringify(filterList),
      featureid: "LEGAL_CASES"
    };

    this.commontabservice.getCommonGrid(payload).subscribe({
      next: (response: any) => { 
        if (response && response.statusCode === "200" && response.objResult) {  
          this.litigationsData = response.objResult.legal_cases || []; 
          if (response.objResult.rows_info) {
            this.totalRecords = response.objResult.rows_info[0].totalrecords; 
            this.totalPages = response.objResult.rows_info[0].noofpages;
          }
        } else {
          this.litigationsData = []; 
          this.totalRecords = 0;
          this.totalPages = 0;
          this.toastr.error("No record[s] found");
        }
      },
      error: (err: any) => {
       
        this.litigationsData = []; 
        this.totalRecords = 0;
        this.totalPages = 0;
      }
    });
  }
  get visibleColumns() {
    return this.tableColumns.filter(c => c.visible);
  }

  get allColumnsSelected(): boolean {
    return this.tableColumns.every(c => c.visible);
  }

  toggleColumn(key: string) {
    const col = this.tableColumns.find(c => c.key === key);
    if (col) {
      col.visible = !col.visible;
    }
  }

  toggleAllColumns(event: any) {
    const checked = event.target.checked;
    this.tableColumns.forEach(c => c.visible = checked);
  }

  setStatusFilter(status: string) {
    this.activeStatusFilter = status;
    this.applyFilters();
  }

  applyFilters() {
    let temp = [...this.litigationsData];

    // Status filter
    if (this.activeStatusFilter !== 'All') {
      temp = temp.filter(item => item.status.toLowerCase() === this.activeStatusFilter.toLowerCase());
    }

    // Search query
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      temp = temp.filter(item => 
        item.case_name.toLowerCase().includes(q) || 
        item.code.toLowerCase().includes(q) ||
        item.legal_firm.toLowerCase().includes(q)
      );
    }

    // Drawer Filters
    if (this.filterLegalFirm) {
      temp = temp.filter(item => item.legalFirm === this.filterLegalFirm);
    }
    if (this.filterProperty) {
      temp = temp.filter(item => item.property === this.filterProperty);
    }
    if (this.filterUnitBlocked) {
      temp = temp.filter(item => item.unitBlocked === this.filterUnitBlocked);
    }
    if (this.filterTenantBlocked) {
      temp = temp.filter(item => item.tenantBlocked === this.filterTenantBlocked);
    }

    this.filteredData = temp;
    this.totalRecords = this.filteredData.length;
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
    this.pageNo = event.pageIndex;
    this.pageSize = event.pageSize; 
    this.loadlegalcases();
  }
  clearFilters() {
    this.filterLegalFirm = null;
    this.filterProperty = null;
    this.filterUnitBlocked = null;
    this.filterTenantBlocked = null;
    this.applyFilters();
  }

  onPageChange(event: any) {
    // Shared table pagination trigger hook
  }
}
