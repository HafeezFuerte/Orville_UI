import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { ColumnMenuComponent } from '../../../../shared/components/column-menu/column-menu.component';
import { InventoryRow } from '../inventory.data';
import { PortfolioService } from '../../../portfolio/services/portfolio.service';
import { Common_TabsService } from '../../../portfolio/services/common_tabs.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SharedTableComponent, ColumnMenuComponent],
  templateUrl: './inventory-list.component.html',
  styleUrl: './inventory-list.component.scss'
})
export class InventoryListComponent implements OnInit {
  private router = inject(Router);
  private commontabservice = inject(Common_TabsService);
  private portfolioService = inject(PortfolioService);
  private commonService = inject(CommonService);

  searchQuery = '';
  showColumnDropdown = false;
  pageIndex = 0;
  pageSize = 10;
  allRows: InventoryRow[] = [];
  propertiesMap: Record<string, string> = {};
  openRowActionId: string | null = null;
  rowMenuStyle: Record<string, string> | null = null;
  isLoading = false;
  totalRecordsCount = 0;
  totalPagesCount = 0;

  tableColumns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true, width: '80px' },
    { key: 'itemName', label: 'Item Name', visible: true, width: '160px' },
    { key: 'partNumber', label: 'Part Number', visible: true, width: '140px' },
    { key: 'category', label: 'Category', visible: true, useTemplate: true, width: '120px' },
    { key: 'subcategory', label: 'Subcategory', visible: true, width: '120px' },
    { key: 'cost', label: 'Cost', visible: true, useTemplate: true, width: '120px' },
    { key: 'threshold', label: 'Threshold', visible: true, width: '100px' },
    { key: 'stockType', label: 'Stock Type', visible: true, useTemplate: true, width: '120px' },
    { key: 'placedDate', label: 'Placed Date', visible: true, width: '120px' },
    { key: 'expiration', label: 'Expiration', visible: true, useTemplate: true, width: '180px' },
    { key: 'vendor', label: 'Vendor', visible: true, width: '140px' },
    { key: 'locations', label: 'Locations', visible: true, width: '100px' },
    { key: 'action', label: 'Action', visible: true, useTemplate: true, width: '70px' }
  ];

  ngOnInit(): void {
    this.loadProperties();
    this.loadInventory();
  }

  loadProperties(): void {
    const currentUser = this.commonService.getCurrentUser();
    this.portfolioService.getMasterByType({
      typeId: 11,
      filterId: 0,
      filterText: '',
      filterText1: '',
      userId: currentUser?.userId || 1,
      clientId: currentUser?.clientId || "74BB6922",
      companyId: currentUser?.companyId || 1
    }).subscribe({
      next: (res: any) => {
        if (res && (res.statusCode == 200 || res.statusCode == '200') && res.objResult && res.objResult.table) {
          res.objResult.table.forEach((p: any) => {
            const code = p.code || p.property_code || p.id;
            const name = p.name || p.property || p.code;
            if (code) {
              this.propertiesMap[String(code)] = String(name);
            }
          });
          this.updateLocationsInRows();
        }
      },
      error: (err) => console.error('Error loading properties map:', err)
    });
  }

  formatDateString(dateStr: string): string {
    if (!dateStr || dateStr === 'N/A' || dateStr === '-') return dateStr || '-';
    try {
      const dt = new Date(dateStr);
      if (isNaN(dt.getTime())) return dateStr;
      const d = String(dt.getDate()).padStart(2, '0');
      const m = String(dt.getMonth() + 1).padStart(2, '0');
      const y = dt.getFullYear();
      return `${d}-${m}-${y}`;
    } catch {
      return dateStr;
    }
  }

  resolveLocation(item: any): string {
    const itemCode = String(item.code || item.id || '');
    let localExtra: any = {};
    if (itemCode) {
      try {
        const saved = localStorage.getItem(`inventory_extra_${itemCode}`);
        if (saved) localExtra = JSON.parse(saved);
      } catch (e) {}
    }

    const rawLoc = item.location_name || item.property_name || item.unit_name || item.property || item.location || item.locations || localExtra.propertyName || localExtra.locationName || '';
    if (!rawLoc) return '-';

    if (this.propertiesMap[String(rawLoc)]) {
      return this.propertiesMap[String(rawLoc)];
    }

    if (localExtra.propertyName || localExtra.locationName) {
      return localExtra.propertyName || localExtra.locationName;
    }

    return String(rawLoc);
  }

  updateLocationsInRows(): void {
    if (!this.allRows || !this.allRows.length) return;
    this.allRows = this.allRows.map(row => ({
      ...row,
      locations: this.propertiesMap[row.locations] || row.locations
    }));
  }

  loadInventory(): void {
    this.isLoading = true;
    const currentUser = this.commonService.getCurrentUser();
    const payload = {
      userid: currentUser?.userId || 1,
      company_id: currentUser?.companyId || 1,
      clientId: currentUser?.clientId || "74BB6922",
      clientID: currentUser?.clientId || "74BB6922",
      source: 'web',
      languageid: 1,
      page_no: this.pageIndex,
      seqno: 0,
      search_keyword: this.searchQuery || '',
      pagecount: this.pageSize,
      feature: "INVENTORY_ITEMS",
      featureid: "INVENTORY_ITEMS",
      search_columns: "P.item_name,P.location",
      filter_by: ""
    };

    this.commontabservice.getCommonGrid(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res && (res.statusCode === "200" || res.statusCode == 200) && res.objResult) {
          const rawItems = res.objResult.inventory_items || res.objResult.inventory || res.objResult.table || [];
          this.allRows = rawItems.map((item: any) => {
            const itemCode = String(item.code || item.id || '');
            let localExtra: any = {};
            if (itemCode) {
              try {
                const saved = localStorage.getItem(`inventory_extra_${itemCode}`);
                if (saved) localExtra = JSON.parse(saved);
              } catch (e) {}
            }

            const expVal = item.expiry_date || item.expiration || localExtra.expirationDate || 'N/A';
            const placedVal = item.placed_date || item.placedDate || localExtra.placedDate || '-';

            return {
              id: itemCode,
              itemName: item.item_name || item.name || item.itemName || localExtra.itemName || '-',
              partNumber: item.part_no || item.part_number || item.partNumber || localExtra.partNumber || '-',
              category: item.category_name || item.category || localExtra.category || '-',
              subcategory: item.subcategory_name || item.subcategory || localExtra.subcategory || 'N/A',
              cost: (item.item_cost !== undefined || item.cost !== undefined || localExtra.cost !== undefined)
                ? `AED ${Number(item.item_cost ?? item.cost ?? localExtra.cost ?? 0).toFixed(2)}`
                : 'AED 0.00',
              threshold: item.qty_threshold || item.minimum_qty || item.threshold || localExtra.minimumQty || 'N/A',
              stockType: item.stock_type || item.stockType || item.source || 'Non-Stock',
              placedDate: this.formatDateString(placedVal),
              expiration: this.formatDateString(expVal),
              expiringSoon: !!item.expiring_soon || !!item.expiringSoon || false,
              vendor: item.vendor_name || item.vendor || item.vendor_code || localExtra.vendor || 'N/A',
              locations: this.resolveLocation(item)
            };
          });

          if (res.objResult.rows_info && res.objResult.rows_info[0]) {
            this.totalRecordsCount = res.objResult.rows_info[0].totalrecords;
            this.totalPagesCount = res.objResult.rows_info[0].noofpages;
          } else {
            this.totalRecordsCount = this.allRows.length;
            this.totalPagesCount = Math.max(1, Math.ceil(this.totalRecordsCount / this.pageSize));
          }
        } else {
          this.allRows = [];
          this.totalRecordsCount = 0;
          this.totalPagesCount = 0;
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error("Error loading inventory:", err);
        this.allRows = [];
        this.totalRecordsCount = 0;
        this.totalPagesCount = 0;
      }
    });
  }

  get visibleColumns() {
    return this.tableColumns.filter((c) => c.visible !== false);
  }

  get filteredRows(): InventoryRow[] {
    return this.allRows;
  }

  get totalRecords(): number {
    return this.totalRecordsCount;
  }

  get totalPages(): number {
    return Math.max(1, this.totalPagesCount || 1);
  }

  get displayPage(): number {
    return this.pageIndex + 1;
  }

  get startRecord(): number {
    return this.totalRecords ? this.pageIndex * this.pageSize + 1 : 0;
  }

  get endRecord(): number {
    return Math.min((this.pageIndex + 1) * this.pageSize, this.totalRecords);
  }

  get pagerItems(): (number | string)[] {
    const total = this.totalPages;
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    return [1, 2, 3, 4, 5, '...', total];
  }

  get paginatedRows(): InventoryRow[] {
    return this.allRows;
  }

  onSearch(): void {
    this.pageIndex = 0;
    this.loadInventory();
  }

  onPageSizeChange(): void {
    this.pageIndex = 0;
    this.loadInventory();
  }

  previousPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex -= 1;
      this.loadInventory();
    }
  }

  nextPage(): void {
    if (this.displayPage < this.totalPages) {
      this.pageIndex += 1;
      this.loadInventory();
    }
  }

  goPage(page: number): void {
    const target = page - 1;
    if (target >= 0 && target < this.totalPages && target !== this.pageIndex) {
      this.pageIndex = target;
      this.loadInventory();
    }
  }

  toggleColumn(key: string): void {
    const col = this.tableColumns.find((c) => c.key === key);
    if (col && key !== 'action') {
      col.visible = !col.visible;
    }
  }

  toggleAllColumns(visible: boolean): void {
    this.tableColumns.forEach((col) => {
      if (col.key !== 'action') {
        col.visible = visible;
      }
    });
  }

  toggleColumnDropdown(event: Event): void {
    event.stopPropagation();
    this.showColumnDropdown = !this.showColumnDropdown;
  }

  toggleRowAction(id: string, event: MouseEvent): void {
    event.stopPropagation();
    if (this.openRowActionId === id) {
      this.closeRowAction();
      return;
    }
    const btn = event.currentTarget as HTMLElement;
    const rect = btn.getBoundingClientRect();
    this.rowMenuStyle = {
      position: 'fixed',
      top: `${rect.bottom + 4}px`,
      left: `${Math.max(8, rect.right - 160)}px`,
      zIndex: '1200'
    };
    this.openRowActionId = id;
  }

  closeRowAction(): void {
    this.openRowActionId = null;
    this.rowMenuStyle = null;
  }

  navigateToCreate(id?: string): void {
    this.closeRowAction();
    if (id) {
      void this.router.navigate(['/facility/inventory/create'], { queryParams: { code: id } });
    } else {
      void this.router.navigate(['/facility/inventory/create']);
    }
  }

  navigateToDetail(id: string): void {
    this.closeRowAction();
    this.router.navigate(['/facility/inventory', id]);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (target?.closest('[data-inv-action]')) {
      return;
    }
    this.closeRowAction();
    if (!target?.closest('[data-inv-columns]')) {
      this.showColumnDropdown = false;
    }
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  onViewportChange(): void {
    if (this.openRowActionId) {
      this.closeRowAction();
    }
  }
}
