import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { PropertiesService } from '../../portfolio/services/properties.service';
import { Router } from '@angular/router';

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

  searchQuery: string = '';
  showColumnDropdown: boolean = false;
  statusFilter: 'All' | 'Active' | 'Blocked' = 'All';
  isLoading: boolean = false;

  // Pagination
  pageNo = 1;
  pageSize = 20;
  totalRecords = 0;

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

  getArabicLookupName(row: any, key: string): string {
    return row[localStorage.getItem("selectedLang") === "EN" ? key : key + '_ar'] || row[key] || '';
  }

  ngOnInit(): void {
    this.loadTechnicians();
  }

  loadTechnicians() {
    this.isLoading = true;
    const payload = {
      userid: Number(localStorage.getItem('userId')) || 1,
      company_id: Number(localStorage.getItem('companyId')) || 1,
      clientId: localStorage.getItem('clientId') || '74BB6922',
      source: 'web',
      languageid: 1,
      page_no: this.pageNo - 1,
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
        let rawList: any[] = [];
        if (Array.isArray(response)) {
          rawList = response;
        } else if (response && response.objResult) {
          if (Array.isArray(response.objResult)) rawList = response.objResult;
          else if (response.objResult.support_technicians) rawList = response.objResult.support_technicians;
          else if (response.objResult.technicians) rawList = response.objResult.technicians;
          else if (response.objResult.technician) rawList = response.objResult.technician;
        }

        this.technicians = (rawList || []).map((t: any) => ({
          id: t.id || 0,
          code: t.code || '',
          name: t.name || t.technician || (t.first_name ? (t.first_name + ' ' + (t.last_name || '')) : '') || '-',
          email: t.email_address || t.email || '-',
          phoneNumber: t.phone_number || t.phoneNumber || t.mobile_no || '-',
          username: t.username || '-',
          assignedUnits: t.assigned_units || t.assignedUnits || t.total_units || 0,
          status: t.is_active ? 'Active' : 'Blocked',
          workOrder: t.is_work_order ? 'Yes' : 'No',
          image_path: t.image_path || ''
        })).sort((a, b) => a.id - b.id);

        this.totalRecords = response?.totalCount || this.technicians.length;
        this.paginatedTechnicians = this.technicians;
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('Error fetching support technicians:', err);
      }
    });
  }

  onSearch() {
    this.pageNo = 1;
    this.loadTechnicians();
  }
  
  setStatusFilter(status: 'All' | 'Active' | 'Blocked') {
    this.statusFilter = status;
    this.pageNo = 1;
    this.loadTechnicians();
  }

  onSharedTablePageChange(event: any) {
    this.pageNo = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadTechnicians();
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
