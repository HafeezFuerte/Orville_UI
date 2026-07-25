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
  imports: [CommonModule, FormsModule, SharedTableComponent, RouterModule, NgSelectModule, TranslateModule],
  templateUrl: './all-contacts.component.html',
  styleUrl: './all-contacts.component.scss'
})
export class AllContactsComponent implements OnInit {
  searchQuery: string = '';
  showColumnDropdown: boolean = false; 
  // Pagination
  pageNo = 1;
  pageSize = 10;
  totalRecords = 150;
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
  getInitials = function (name:any) {
    if (!name) return '';

    const parts = name.trim().split(/\s+/);

    return parts[0].charAt(0) +
           (parts.length > 1 ? parts[1].charAt(0) : '');
};
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
  
        if(res['statusCode'] == 200)
          this[target] = res.objResult.table;
           this.paginatedContacts=this.contacts;
           this.updatePagination();
          callback?.();
       
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

  contacts:any= [];

  paginatedContacts: any = [];

  ngOnInit(): void {
    this.loadMasterDataByType(32,0, 'contacts', '','');
    
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
        c.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
        c.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        c.id.toString().includes(this.searchQuery)
      );
    }
    this.totalRecords = filtered.length;
    
    this.paginatedContacts = filtered;
  }

  getStatusClass(status: string) {
    switch(status) {
      case 'Active': return 'bg-success/10 text-success';
      case 'Blocked': return 'bg-danger/10 text-danger';
      default: return 'bg-gray-100 text-gray-600';
    }
  }
}
