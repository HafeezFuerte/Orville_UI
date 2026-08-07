import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule,TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PortfolioService } from '../../portfolio/services/portfolio.service';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { FilterDrawerComponent } from '../../../shared/components/filter-drawer/filter-drawer.component';

export interface Contact {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  contact_type: string;
  status: string;
  code: string;
}

@Component({
  selector: 'app-all-contacts',
  standalone: true,
  imports: [CommonModule, FilterDrawerComponent, FormsModule, SharedTableComponent, RouterModule, NgSelectModule, TranslateModule],
  templateUrl: './all-contacts.component.html',
  styleUrl: './all-contacts.component.scss'
})
export class AllContactsComponent implements OnInit {
  searchQuery: string = '';
  showColumnDropdown: boolean = false; 
  isDrawerOpen = false;

  // Filter criteria properties
  selectedTag: string | null = null;
  selectedArea: string | null = null;
  selectedId: number | null = null;
  selectedRefNo: string | null = null;
  selectedOffPlanStatus: string | null = null;
  selectedLandlord: string | null = null;
  selectedInternalStatus: string | null = null;

  // Filter dropdown lists
  tagsList: string[] = ['Premium', 'Best Seller', 'Compact', 'Luxury', 'Corporate', 'Prime Location'];
  landlordsList: string[] = ['Orville Real Estate', 'Emaar Properties', 'DIFC Investments', 'Emaar Malls'];
  offPlanStatuses: string[] = ['Ready', 'Off Plan'];
  internalStatuses: string[] = ['Active', 'Draft', 'Suspended'];

  // Pagination
  pageNo = 1;
  pageSize = 10;
  totalRecords = 0;

  toggleDrawer(open: boolean): void {
    this.isDrawerOpen = open;
  }

  constructor(public translate: TranslateService, 
    private formBuilder: FormBuilder, 
    private route: ActivatedRoute,
    private store: Store,
    private portfolioService: PortfolioService,
    private toastr:ToastrService,
    private router: Router
  ){}

  tableColumns = [
    { key: 'id', label: 'web.contacts.lblID', visible: true, useTemplate: true },
    { key: 'name', label: 'web.contacts.lblName', visible: true, useTemplate: true },
    { key: 'email', label: 'web.contacts.lblEmail', visible: true, useTemplate: true },
    { key: 'phoneNumber', label: 'web.contacts.lblPhoneNumber', visible: true, useTemplate: true },
    { key: 'contact_type', label: 'web.contacts.lblContactType', visible: true, useTemplate: true },
    { key: 'status', label: 'web.contacts.lblStatus', visible: true, useTemplate: true }
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

  getInitials(name: string): string {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    return parts[0].charAt(0) + (parts.length > 1 ? parts[1].charAt(0) : '');
  }

  private loadMasterDataByType(
    typeId: number,
    filterId: number,
    target: 'contacts' ,
    filtertext:string ='',
    filterText1:string ='', 
    callback?:()=>void
  ) {
    this.portfolioService.getMasterByType({
      typeId: typeId,
      filterId,
      filterText: filtertext,
      filterText1: filterText1 
    }).subscribe({
      next: res => {
        if(res['statusCode'] == 200) {
          this.contacts = res.objResult.table || [];
          this.paginatedContacts = this.contacts;
          this.updatePagination();
          callback?.();
        }
      },
      error: (err) => {
        console.log('Full Error:', err);
      }
    });
  }

  toggleAllColumns(event: any) {
    const checked = event.target.checked;
    this.tableColumns.forEach(c => c.visible = checked);
  }

  get allColumnsSelected(): boolean {
    return this.tableColumns.every(c => c.visible !== false);
  }

  contacts: any[] = [];
  paginatedContacts: any[] = [];

  ngOnInit(): void {
    this.loadMasterDataByType(32, 0, 'contacts', '', '');
  }

  onSearch() {
    this.pageNo = 1;
    this.updatePagination();
  }

  onSharedTablePageChange(event: any) {
    this.pageNo = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.updatePagination();
  }

  updatePagination() {
    let filtered = this.contacts;
    if (this.searchQuery) {
      filtered = filtered.filter((c:any) => 
        (c.name && c.name.toLowerCase().includes(this.searchQuery.toLowerCase())) || 
        (c.email && c.email.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
        (c.id && c.id.toString().includes(this.searchQuery))
      );
    }
    if (this.selectedId) {
      filtered = filtered.filter((c:any) => c.id === this.selectedId);
    }
    if (this.selectedTag) {
      filtered = filtered.filter((c:any) => c.tag === this.selectedTag || c.tags === this.selectedTag);
    }
    if (this.selectedLandlord) {
      filtered = filtered.filter((c:any) => c.landlord === this.selectedLandlord || c.company === this.selectedLandlord);
    }
    if (this.selectedInternalStatus) {
      filtered = filtered.filter((c:any) => c.status === this.selectedInternalStatus);
    }

    this.totalRecords = filtered.length;
    
    const startIndex = (this.pageNo - 1) * this.pageSize;
    this.paginatedContacts = filtered.slice(startIndex, startIndex + this.pageSize);
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedTag = null;
    this.selectedArea = null;
    this.selectedId = null;
    this.selectedRefNo = null;
    this.selectedOffPlanStatus = null;
    this.selectedLandlord = null;
    this.selectedInternalStatus = null;
    this.pageNo = 1;
    this.updatePagination();
  }
}
