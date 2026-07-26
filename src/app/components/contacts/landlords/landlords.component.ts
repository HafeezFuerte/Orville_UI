import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { PropertiesService } from '../../portfolio/services/properties.service';
import { Router } from '@angular/router';

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

  ngOnInit(): void {
    this.loadLandlords();
  }

  loadLandlords() {
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
      featureid: 'Landlords'
    };

    this.propertiesService.getTenants(payload).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        let rawList: any[] = [];
        if (Array.isArray(response)) {
          rawList = response;
        } else if (response && response.objResult) {
          if (Array.isArray(response.objResult)) rawList = response.objResult;
          else if (response.objResult.landlords) rawList = response.objResult.landlords;
          else if (response.objResult.landlord) rawList = response.objResult.landlord;
        }

        this.landlords = (rawList || []).map((t: any) => ({
          id: t.id || 0,
          code: t.code || '',
          name: t.landlord || t.name || t.tenant || '',
          email: t.email_address || t.email || '-',
          phoneNumber: t.phone_number || t.phoneNumber || '-',
          company: t.company_name || t.company || '-',
          noOfProperties: t.no_of_properties || t.noOfProperties || t.total_properties || 0,
          unitsRooms: t.units_rooms || t.unitsRooms || '-',
          country: t.country || t.country_name || '-',
          tag: t.tag || t.tags || '-',
          status: t.is_active ? 'Active' : 'Blocked',
          image_path: t.image_path || ''
        })).sort((a, b) => a.id - b.id);

        this.totalRecords = response?.totalCount || this.landlords.length;
        this.paginatedLandlords = this.landlords;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching landlords:', err);
      }
    });
  }

  onSearch() {
    this.pageNo = 1;
    this.loadLandlords();
  }
  
  setStatusFilter(status: 'All' | 'Active' | 'Blocked') {
    this.statusFilter = status;
    this.pageNo = 1;
    this.loadLandlords();
  }

  onSharedTablePageChange(event: any) {
    this.pageNo = event.pageIndex + 1;
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
