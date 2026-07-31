import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { PortfolioService } from '../../../portfolio/services/portfolio.service';
import { CommonService } from '../../../../services/common.service';
import { Common_TabsService } from '../../../portfolio/services/common_tabs.service';
export interface WorkOrder {
  id: string;
  workOrder: string;
  property: string;
  unit: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Closed' | 'Rejected';
  vendor: string;
  category: string;
  responsiblePerson: string;
  technician: string;
  lastUpdate: string;
  createdAt: string;
  createdBy: string;
}

@Component({
  selector: 'app-work-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule, SharedTableComponent],
  templateUrl: './work-order-list.component.html',
  styleUrl: './work-order-list.component.scss'
})
export class WorkOrderListComponent implements OnInit {
  private router = inject(Router);
  private portfolioService = inject(PortfolioService);
  private commonService = inject(CommonService);
  private commontabService=inject(Common_TabsService);
  currentUser = this.commonService.getCurrentUser();
  searchQuery: string = '';
  branches = ['Main Branch', 'Branch A'];
  buildings = ['All Buildings', 'Building 1'];
  isLoading: boolean = false;

  activeTab: string = 'All';
  tabs = ['All', 'New', 'Open', 'In Progress', 'On Hold', 'Resolved', 'Rejected', 'Accepted', 'Tenant Rejected', 'Canceled', 'Re-opened'];
  metrics = {
    total: 2955,
    new: 605,
    open: 2319,
    resolved: 31,
    inprogress: 31
  };
  pageNo = 0;
  pageSize = 10;
  totalRecords = 0;
//(localStorage.getItem("selectedLang")=="EN" ? 'status_nm' : 'status_nm_ar')
  tableColumns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true },
    { key: 'title', label: 'Title', visible: true },
    { key: 'property', label: 'Property', visible: true, useTemplate: true },
    { key: 'unit', label: 'Unit', visible: true, useTemplate: true },
    { key: 'priority', label: 'Priority', visible: true, useTemplate: true },
    { key: 'status_nm', label: 'Status', visible: true, useTemplate: true },
    { key: 'vendor_name', label: 'Vendor', visible: true },
    { key: 'maintenance_name', label: 'Category', visible: true },
    { key: 'responsiblePerson', label: 'Responsible person(s)', visible: true },
    { key: 'technician_name', label: 'Technician', visible: true },
    { key: 'modified_date', label: 'Last update', visible: true },
    { key: 'created_date', label: 'Created at', visible: true },
    { key: 'created_by_name', label: 'Created by', visible: true },
    { key: 'action', label: 'Action', visible: true, useTemplate: true }
  ];

  workOrderData: WorkOrder[] = [];
  loadMetrics() {
    const payload = {
      typeId: 39,
      filterId: 0,
      filterText: "",
      filterText1: "",
      userid: this.currentUser?.userId,
      company_id: this.currentUser?.companyId,
      clientId: this.currentUser?.clientId,
    };
    this.commontabService.getMasterByType(payload).subscribe({
      next: (res: any) => {
        if (res && res.objResult) {
          let  data = res.objResult.table[0]; 
          if (data) {
            this.metrics = {
              total: data.workorders,
              open: data.open ?? this.metrics.open,
              new: data.new  ?? this.metrics.new,
              inprogress:data.inprogress  ?? this.metrics.inprogress,
              resolved: data.resolved   ?? this.metrics.resolved
            };
          }
        }
      },
      error: (err: any) => console.error("Error loading metrics:", err)
    });
  }
  get visibleColumns() {
    return this.tableColumns.filter(c => c.visible);
  }
  getArabicLookupName(row:any,key:string){
    return row[(localStorage.getItem("selectedLang")=="EN" ? key : key+'_ar')];
  } 
  ngOnInit() {
    this.loadData();
    this.loadMetrics();
  }

  loadData() {
    this.isLoading = true;
    
    const payload = {
      userid: this.currentUser?.userId || 1,
      company_id: this.currentUser?.companyId || 1,
      clientId: this.currentUser?.clientId || "74BB6922",
      source: "web",
      languageid: 1,
      page_no: this.pageNo,
      seqno: 0,
      search_keyword: this.searchQuery,
      pagecount: this.pageSize,
      filter_by: this.activeTab !== 'All' ? 'status' : '',
      filter_list: this.activeTab !== 'All' ? this.activeTab : '',
      featureid: "WORKORDERS"
    };

    this.portfolioService.getMastersByPaging(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res && res.objResult && res.objResult.workorders) {
          this.workOrderData = res.objResult.workorders;
          this.totalRecords = res.objResult.total_records || res.objResult.workorders.length;
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error("Error loading work orders:", err);
      }
    });
  }

  onSharedTablePageChange(event: { pageIndex: number; pageSize: number }): void {
    this.pageNo = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  onSearch() {
    this.pageNo = 1;
    this.loadData();
  }

  onTabChange(tab: string) {
    this.activeTab = tab;
    this.pageNo = 1;
    this.loadData();
  }

  navigateToCreate() {
    this.router.navigate(['/facility/work-orders/create']);
  }

  navigateToDetail(id: string) {
    this.router.navigate(['/facility/work-orders', id]);
  }
}
