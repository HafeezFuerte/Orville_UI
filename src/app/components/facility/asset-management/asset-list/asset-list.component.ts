import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { PortfolioService } from '../../../portfolio/services/portfolio.service';
import { CommonService } from '../../../../services/common.service';
import { FilterDrawerComponent } from '../../../../shared/components/filter-drawer/filter-drawer.component';

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
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule, TranslateModule, SharedTableComponent, FilterDrawerComponent],
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

  isDrawerOpen: boolean = false;
  filterName: string = '';
  filterCategory: any = null;
  filterStatus: any = null;
  assetCategories: any[] = [];
  statusOptions = ['Operational', 'Down'];

  pageNo = 0;
  pageSize = 10;
  totalRecords = 0;

  tableColumns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true },
    { key: 'assetName', label: 'Asset Name', visible: true },
    { key: 'model', label: 'Model', visible: true },
    { key: 'category', label: 'Category', visible: true, useTemplate: true },
    { key: 'property', label: 'Property', visible: true, useTemplate: true },
    { key: 'unit', label: 'Unit', visible: true },
    { key: 'price', label: 'Price', visible: true },
    { key: 'status', label: 'Status', visible: true, useTemplate: true },
    { key: 'location', label: 'Location', visible: true },
    { key: 'Vendor', label: 'Vendor', visible: true },
    { key: 'PurchaseDate', label: 'Purchase Date', visible: true },
  ];

  assetData: Asset[] = [];

  showColumnDropdown: boolean = false;

  toggleColumn(key: string): void {
    const col = this.tableColumns.find(c => c.key === key);
    if (col) {
      col.visible = !col.visible;
    }
  }

  toggleAllColumns(event: any): void {
    const checked = event.target.checked;
    this.tableColumns.forEach(c => c.visible = checked);
  }

  get allColumnsSelected(): boolean {
    return this.tableColumns.every(c => c.visible !== false);
  }

  get visibleColumns() {
    return this.tableColumns.filter(c => c.visible);
  }

  getArabicLookupName(row: any, key: string): string {
    return row[localStorage.getItem("selectedLang") === "EN" ? key : key + '_ar'] || row[key] || '';
  }

  ngOnInit() {
    this.loadCategories();
    this.loadData();
  }

  loadCategories() {
    this.portfolioService.getMasterByType({
      typeId: 2,
      filterId: 26,
      filterText: '',
      filterText1: ''
    }).subscribe((res: any) => {
      if (res.statusCode == 200 && res.objResult && res.objResult.table) {
        this.assetCategories = res.objResult.table.map((item: any) => ({
          id: item.id,
          name: item.lookup_name || item.name || ''
        }));
      }
    });
  }

  toggleDrawer(state: boolean) {
    this.isDrawerOpen = state;
  }

  clearFilters() {
    this.filterName = '';
    this.filterCategory = null;
    this.filterStatus = null;
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
      search_keyword: this.searchQuery || this.filterName || "",
      pagecount: this.pageSize,
      filter_by: this.filterStatus ? `status:${this.filterStatus}` : "",
      filter_list: this.filterCategory ? `category:${this.filterCategory}` : "",
      featureid: "ASSETS"
    };

    this.portfolioService.getMastersByPaging(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res && res.objResult) {
          const rawAssets = res.objResult.assets || res.objResult.table || [];
          this.assetData = rawAssets.map((item: any) => ({
            ...item,
            assetName: item.asset_name || item.assetName || '',
            Vendor: item.vendor || item.Vendor || '',
            PurchaseDate: item.purchase_date || item.PurchaseDate || ''
          })).sort((a: any, b: any) => a.id - b.id);
          this.totalRecords = res.objResult.total_records || (res.objResult.rows_info && res.objResult.rows_info[0]?.totalrecords) || this.assetData.length;
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error("Error loading assets:", err);
      }
    });
  }

  onSharedTablePageChange(event: { pageIndex: number; pageSize: number }): void {
    this.pageNo = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  onSearch() {
    this.pageNo = 0;
    this.loadData();
  }

  navigateToCreate() {
    this.router.navigate(['/facility/assets/create']);
  }

  handleEditAction(row: any) {
    if (row && (row.action_name === 'edit' || !row.action_name)) {
      localStorage.setItem('selectedAsset', JSON.stringify(row));
      this.router.navigate(['/facility/assets/edit', row.code || row.id]);
    }
  }

  navigateToDetail(id: string) {
    this.router.navigate(['/facility/assets', id]);
  }
}
