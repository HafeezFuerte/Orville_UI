import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { PropertiesService } from '../../portfolio/services/properties.service';
import { Router } from '@angular/router';
import { AuthPayload } from '../../common/store/login-auth-params/auth.models';
import { CommonService } from '../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
export interface Landlord {
  id: number;
  code: string;
  name: string;
  email: string;
  phoneNumber: string;
  company: string;
  noOfProperties: number;
  unitsRooms: string;
  country: string;
  tag: string;
  status: string;
  image_path: string;
}

@Component({
  selector: 'app-landlords',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedTableComponent, RouterModule, NgSelectModule, TranslateModule],
  templateUrl: './landlords.component.html',
  styleUrl: './landlords.component.scss'
})
export class LandlordsComponent implements OnInit {
  private propertiesService = inject(PropertiesService);
  private router = inject(Router);
  private commonService = inject(CommonService);
  currentUser: AuthPayload | null = null;
  searchQuery: string = '';
  showColumnDropdown: boolean = false;
  statusFilter: 'All' | 'Active' | 'Blocked' = 'All';
  isLoading: boolean = false;
  private toastr = inject(ToastrService);
  isDrawerOpen = false;

  // Filter criteria
  filterName: string = '';
  filterEmail: string = '';
  filterStatus: string | null = null;

  statusOptions = ['Active', 'Inactive', 'Blocked'];

  toggleDrawer(open: boolean): void { this.isDrawerOpen = open; }

  clearFilters(): void {
    this.searchQuery = '';
    this.filterName = '';
    this.filterEmail = '';
    this.filterStatus = null;
    this.pageNo = 1;
    this.loadLandlords();
  }

  // Pagination
  pageNo = 0;
  pageSize = 10;
  totalRecords = 0;
  totalPages=0;
  tableColumns = [
    { key: 'id', label: 'web.contacts.lblID', visible: true, useTemplate: true },
    { key: 'name', label: 'web.contacts.lblName', visible: true, useTemplate: true },
    { key: 'email', label: 'web.contacts.lblEmail', visible: true, useTemplate: true },
    { key: 'phoneNumber', label: 'web.contacts.lblPhoneNumber', visible: true, useTemplate: true },
    { key: 'company', label: 'web.contacts.lblCompany', visible: true, useTemplate: true },
    { key: 'noOfProperties', label: 'web.contacts.lblNoOfProperties', visible: true, useTemplate: true },
    { key: 'unitsRooms', label: 'web.contacts.lblUnitsRooms', visible: true, useTemplate: true },
    { key: 'country', label: 'web.contacts.lblCountry', visible: true, useTemplate: true },
    { key: 'tag', label: 'web.contacts.lblTag', visible: true, useTemplate: true }
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

  landlords: Landlord[] = [];
  paginatedLandlords: Landlord[] = [];

  getArabicLookupName(row: any, key: string): string {
    return row[localStorage.getItem("selectedLang") === "EN" ? key : key + '_ar'] || row[key] || '';
  }

  ngOnInit(): void {
    this.currentUser = this.commonService.getCurrentUser();
    this.loadLandlords();
  }

  loadLandlords() {
    this.isLoading = true;
    const payload = {
      userid: this.currentUser?.userId,
      company_id: this.currentUser?.companyId,
      clientId: this.currentUser?.clientId,
      source: 'web',
      languageid: 1,
      page_no: this.pageNo,
      seqno: 0,
      search_keyword: this.searchQuery || '',
      pagecount: this.pageSize,
      filter_by: this.statusFilter !== 'All' ? this.statusFilter : '',
      filter_list: '',
      featureid: 'LANDLORDS'
    };

    this.propertiesService.getTenants(payload).subscribe({
      next: (response: any) => {
        this.isLoading = false; 
        if (response && response.statusCode === "200" && response.objResult) { 
          this.paginatedLandlords=response.objResult.landlords  
          if(response.objResult.rows_info)
          {
            this.totalRecords=response.objResult.rows_info[0].totalrecords; 
            this.totalPages=response.objResult.rows_info[0].noofpages;
          }
        }
        else
          this.toastr.error("No record[s] found");
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching landlords:', err);
      }
    });
  }

  onSearch() {
    this.pageNo = 0;
    this.loadLandlords();
  }
  
  setStatusFilter(status: 'All' | 'Active' | 'Blocked') {
    this.statusFilter = status;
    this.pageNo = 0;
    this.loadLandlords();
  }

  onSharedTablePageChange(event: any) {
   
    if(event.pageIndex>this.pageNo){
      this.pageNo = this.pageNo + 1;
      }
      else{
        this.pageNo = this.pageNo - 1;
      }
      if(this.pageNo<0)
      this.pageNo=0;
      this.pageSize = event.pageSize; 
    this.loadLandlords();
  }

  handleEditAction(row: any) {
    if (row.action_name === 'edit') {
      this.router.navigate(['/contacts/landlords/edit-landlord', row.code]);
    } else if (row.action_name === 'delete') {
      console.log('Delete landlord clicked', row.id);
    }
  }

  getInitials(name: string): string {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    return parts[0].charAt(0) + (parts.length > 1 ? parts[1].charAt(0) : '');
  }
}
