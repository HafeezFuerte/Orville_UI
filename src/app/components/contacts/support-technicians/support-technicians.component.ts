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
export interface Technician {
  id: number;
  code: string;
  name: string;
  email: string;
  phoneNumber: string;
  username: string;
  assignedUnits: number;
  status: string;
  workOrder: string;
  image_path: string;
}

@Component({
  selector: 'app-support-technicians',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedTableComponent, RouterModule, NgSelectModule, TranslateModule],
  templateUrl: './support-technicians.component.html',
  styleUrl: './support-technicians.component.scss'
})
export class SupportTechniciansComponent implements OnInit {
  private propertiesService = inject(PropertiesService);
  private router = inject(Router);
  private commonService = inject(CommonService);
  private toastr =inject(ToastrService);
  currentUser: AuthPayload | null = null;
  searchQuery: string = '';
  showColumnDropdown: boolean = false;
  statusFilter: 'All' | 'Active' | 'Blocked' = 'All';
  isLoading: boolean = false;

  // Pagination
  pageNo = 0;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 0;

  tableColumns = [
    { key: 'id', label: 'web.contacts.lblID', visible: true, useTemplate: true },
    { key: 'name', label: 'web.contacts.lblName', visible: true, useTemplate: true },
    { key: 'email', label: 'web.contacts.lblEmail', visible: true, useTemplate: true },
    { key: 'phoneNumber', label: 'web.contacts.lblPhoneNumber', visible: true, useTemplate: true },
    { key: 'username', label: 'web.contacts.lblUsername', visible: true, useTemplate: true },
    { key: 'assignedUnits', label: 'web.contacts.lblAssignedUnits', visible: true, useTemplate: true },
    { key: 'status', label: 'web.contacts.lblStatus', visible: true, useTemplate: true },
    { key: 'workOrder', label: 'web.contacts.lblWorkOrder', visible: true, useTemplate: true }
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

  technicians: Technician[] = [];
  paginatedTechnicians: Technician[] = [];

  ngOnInit(): void {
    this.currentUser = this.commonService.getCurrentUser();
    this.loadTechnicians();
  }

  loadTechnicians() {
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
      featureid: 'SUPPORT_TECHNICIANS'
    };

    this.propertiesService.getTenants(payload).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response && response.statusCode === "200" && response.objResult) { 
          this.paginatedTechnicians=response.objResult.support_technicians  
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
        this.isLoading = false;
        console.error('Error fetching support technicians:', err);
      }
    });
  }

  onSearch() {
    this.pageNo = 0;
    this.loadTechnicians();
  }
  
  setStatusFilter(status: 'All' | 'Active' | 'Blocked') {
    this.statusFilter = status;
    this.pageNo = 0;
    this.loadTechnicians();
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
    this.loadTechnicians();
  }
  
  getStatusClass(status: string) {
    switch(status) {
      case 'Active': return 'bg-success/10 text-success';
      case 'Blocked': return 'bg-danger/10 text-danger';
      default: return 'bg-gray-100 text-gray-600';
    }
  }

  handleEditAction(row: any) {
    if (row.action_name === 'edit') {
      this.router.navigate(['/contacts/support-technicians/edit-support-technician', row.code]);
    } else if (row.action_name === 'delete') {
      console.log('Delete support technician clicked', row.id);
    }
  }

  getInitials(name: string): string {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    return parts[0].charAt(0) + (parts.length > 1 ? parts[1].charAt(0) : '');
  }
}
