import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { PortfolioService } from '../../../portfolio/services/portfolio.service';
import { CommonService } from '../../../../services/common.service';
import { FilterDrawerComponent } from '../../../../shared/components/filter-drawer/filter-drawer.component';
import { ToastrService } from 'ngx-toastr';
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
  private toastr=inject(ToastrService);

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
  pageIndex = 0; 
  pageNo = 0;
  pageSize = 10; 
  totalPages = 0;
  totalRecords = 0;
  pageSizeOptions = [5, 10, 25, 50, 100];
  allRows:any[]=[];
  currentUser = this.commonService.getCurrentUser();  

  tableColumns = [
    { key: 'code', label: 'ID', visible: true, useTemplate: true },
    { key: 'asset_name', label: 'Asset Name', visible: true, useTemplate: true },
    { key: 'model', label: 'Model', visible: true },
    { key: 'category', label: 'Category', visible: true, useTemplate: true },
    { key: 'property', label: 'Property', visible: true, useTemplate: true },
    { key: 'unit', label: 'Unit', visible: true, useTemplate: true },
    { key: 'price', label: 'Price' + ' (' + this.currentUser?.currencyCode +' )', visible: true }, 
    { key: 'purchase_date', label: 'Purchase Date', visible: true },
    { key: 'vendor', label: 'Vendor', visible: true },
    { key: 'worker', label: 'Worker', visible: true }, 
    { key: 'action', label: 'Action', visible: true, useTemplate: true },
  ];

  assetData: Asset[] = [];

  showColumnDropdown: boolean = false;
  openActionCode: string | null = null;

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showColumnDropdown = false;
    this.openActionCode = null;
  }

  toggleRowAction(code: string | undefined, event?: Event): void {
    event?.stopPropagation();
    if (!code) {
      return;
    }
    this.openActionCode = this.openActionCode === code ? null : code;
  }

  rowActionKey(row: any): string {
    return String(row?.code ?? row?.id ?? '');
  }

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
    const payload = {
      userid: this.currentUser?.userId || 1,
      company_id: this.currentUser?.companyId || 1,
      clientId: this.currentUser?.clientId || "74BB6922",
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
      next: (response: any) => {
        this.isLoading = false;
        if (response && response.objResult) {
          this.allRows = response.objResult.assets || []; 
          if (response.objResult.rows_info) {
            this.totalRecords = response.objResult.rows_info[0].totalrecords; 
            this.totalPages = response.objResult.rows_info[0].noofpages;
          }
        } else {
          this.allRows = []; 
          this.totalRecords = 0;
          this.totalPages = 0;
          this.toastr.error("No record[s] found");
        } 
         
      },
      error: (err) => {
        this.isLoading = false;
        console.error("Error loading assets:", err);
      }
    });
  }
  get displayPage(): number {
    return this.pageNo + 1;
  }

  get startRecord(): number {
    return this.totalRecords ? this.pageNo * this.pageSize + 1 : 0;
  }

  get endRecord(): number {
    return Math.min((this.pageNo + 1) * this.pageSize, this.totalRecords);
  }
  onPageSizeChange(event:any): void {
    this.pageNo = 0; 
    this.loadData();
  }

  previousPage(): void {
    if (this.pageNo > 0) {
      this.pageNo--;
      this.loadData();
    }
  }

  nextPage(): void {
    if (this.displayPage < this.totalPages) {
      this.pageNo++;
      this.loadData();
    }
  }

  goToPage(page: number): void {
    if (page !== this.pageNo-1) {
      this.pageNo =  page-1;
      if(this.pageNo<0)
      this.pageNo=0;
      this.loadData();
    }
 
  }
  allAssetsData: Asset[] = [];

  applyLocalSearch(): void {
    if (!this.allAssetsData || this.allAssetsData.length === 0) {
      this.allAssetsData = [...(this.assetData || [])];
    }
    let temp = [...(this.allAssetsData || [])];
    if (this.searchQuery && this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      temp = temp.filter(a =>
        (a.assetName && a.assetName.toLowerCase().includes(q)) ||
        (a.model && a.model.toLowerCase().includes(q)) ||
        (a.category && a.category.toLowerCase().includes(q)) ||
        (a.property && a.property.toLowerCase().includes(q)) ||
        (a.unit && a.unit.toLowerCase().includes(q)) ||
        (a.id && a.id.toString().toLowerCase().includes(q))
      );
    }
    this.assetData = temp;
  }

 
  onSharedTablePageChange(event: any): void {
    
    if(event.pageIndex>this.pageNo){
    this.pageNo = this.pageNo + 1;
    }
    else{
      this.pageNo = this.pageNo - 1;
    }
    if(this.pageNo<0)
    this.pageNo=0;
    this.pageSize = event.pageSize; 
    this.loadData();
  }
  get pagerItems(): (number | string)[] {
    const total = this.totalPages;
    const current = this.displayPage;
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const items: (number | string)[] = [1];
    if (current > 3) {
      items.push('...');
    }
    for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
      items.push(p);
    }
    if (current < total - 2) {
      items.push('...');
    }
    items.push(total);
    return items;
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
