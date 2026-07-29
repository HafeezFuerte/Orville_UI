import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { PortfolioService } from '../../../portfolio/services/portfolio.service';
import { CommonService } from '../../../../services/common.service';

export interface Asset {
  id: string;
  assetName: string;
  model: string;
  category: string;
  property: string;
  unit: string;
  price: string;
  status: 'Operational' | 'Down';
  location: string;
}

@Component({
  selector: 'app-asset-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule, SharedTableComponent],
  templateUrl: './asset-list.component.html',
  styleUrl: './asset-list.component.scss'
})
export class AssetListComponent implements OnInit {
  private router = inject(Router);
  private portfolioService = inject(PortfolioService);
  private commonService = inject(CommonService);

  searchQuery: string = '';
  branches = ['Main Branch', 'Branch A'];
  buildings = ['All Buildings', 'Building 1'];
  isLoading: boolean = false;

  pageNo = 1;
  pageSize = 10;
  totalRecords = 0;

  tableColumns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true },
    { key: 'assetName', label: 'Asset Name', visible: true },
    { key: 'model', label: 'Model', visible: true },
    { key: 'category', label: 'Category', visible: true },
    { key: 'property', label: 'Property', visible: true },
    { key: 'unit', label: 'Unit', visible: true },
    { key: 'price', label: 'Price', visible: true },
    { key: 'status', label: 'Status', visible: true, useTemplate: true },
    { key: 'location', label: 'Location', visible: true },
    { key: 'Vendor', label: 'Vendor', visible: true },
    { key: 'PurchaseDate', label: 'Purchase Date', visible: true },
  ];

  assetData: Asset[] = [];

  get visibleColumns() {
    return this.tableColumns.filter(c => c.visible);
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    const currentUser = this.commonService.getCurrentUser();
    const payload = {
      userid: currentUser?.userId || 1,
      company_id: currentUser?.companyId || 1,
      clientId: currentUser?.clientId || "74BB6922",
      source: "web",
      languageid: 1,
      page_no: this.pageNo,
      seqno: 0,
      search_keyword: this.searchQuery,
      pagecount: this.pageSize,
      filter_by: "",
      filter_list: "",
      featureid: "ASSETS"
    };

    this.portfolioService.getMastersByPaging(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res && res.objResult && res.objResult.table) {
          this.assetData = res.objResult.table;
          this.totalRecords = res.objResult.total_records || res.objResult.table.length;
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error("Error loading assets:", err);
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

  navigateToCreate() {
    this.router.navigate(['/facility/assets/create']);
  }

  navigateToDetail(id: string) {
    this.router.navigate(['/facility/assets', id]);
  }
}
