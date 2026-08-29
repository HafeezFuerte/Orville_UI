import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import {
  InventoryDetail,
  InventoryLineDraft,
  InventoryLineRow,
  InventoryStockType
} from '../inventory.data';
import { PortfolioService } from '../../../portfolio/services/portfolio.service';
import { CommonService } from '../../../../services/common.service';

type DetailTab = 'details' | 'lines' | 'attachments' | 'notes';

@Component({
  selector: 'app-inventory-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SharedTableComponent],
  templateUrl: './inventory-detail.component.html',
  styleUrl: './inventory-detail.component.scss'
})
export class InventoryDetailComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private portfolioService = inject(PortfolioService);
  private commonService = inject(CommonService);

  activeTab: DetailTab = 'details';
  showLineModal = false;
  lineSearch = '';
  pageIndex = 0;
  pageSize = 5;
  openRowActionId: string | null = null;
  rowMenuStyle: Record<string, string> | null = null;

  item: InventoryDetail = {
    id: '',
    itemName: '',
    partNumber: '',
    category: '',
    subcategory: '',
    stockType: 'Non-Stock',
    description: '',
    itemCost: '',
    itemQuantity: '',
    quantityThreshold: '',
    sameCost: false,
    placedDate: '',
    expirationDate: '',
    created: '',
    lastUpdated: '',
    images: [],
    notes: '',
    attachments: [],
    lines: []
  };
  lines: InventoryLineRow[] = [];

  lineColumns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true, width: '90px' },
    { key: 'location', label: 'Location', visible: true, width: '140px' },
    { key: 'area', label: 'Area', visible: true, width: '100px' },
    { key: 'status', label: 'Status', visible: true, useTemplate: true, width: '110px' },
    { key: 'availableQty', label: 'Available Qty', visible: true, useTemplate: true, width: '120px' },
    { key: 'minimumQty', label: 'Minimum Qty', visible: true, width: '120px' },
    { key: 'barcode', label: 'Barcode', visible: true, width: '120px' },
    { key: 'cost', label: 'Cost', visible: true, width: '120px' },
    { key: 'action', label: 'Action', visible: true, useTemplate: true, width: '70px' }
  ];

  modal: InventoryLineDraft = {
    location: '',
    area: '',
    barcode: '',
    cost: '500.00',
    availableQty: '',
    minimumQty: ''
  };

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const code = params.get('id') || '';
      if (code) {
        this.loadDetail(code);
      }
    });
  }

  loadDetail(code: string): void {
    const currentUser = this.commonService.getCurrentUser();
    this.portfolioService.getMasterByType({
      typeId: 40,
      filterId: 0,
      filterText: code,
      filterText1: '',
      userId: currentUser?.userId || 1,
      clientId: currentUser?.clientId || "74BB6922",
      companyId: currentUser?.companyId || 1
    }).subscribe({
      next: (res: any) => {
        if (res && res.statusCode === "200" && res.objResult) {
          const detail = res.objResult.inventory?.[0] || res.objResult.table?.[0] || {};
          const rawLines = res.objResult.lines || res.objResult.table1 || [];
          const rawDocs = res.objResult.documents || res.objResult.table2 || [];

          this.item = {
            id: String(detail.code || detail.id || code),
            itemName: detail.item_name || detail.itemName || '',
            partNumber: detail.part_no || detail.partNumber || '',
            category: detail.category_name || detail.category || '',
            subcategory: detail.subcategory_name || detail.subcategory || 'N/A',
            stockType: detail.stock_type || detail.stockType || 'Non-Stock',
            description: detail.description || '',
            itemCost: detail.item_cost || detail.cost || '0.00',
            itemQuantity: detail.item_qty || detail.quantity || '0',
            quantityThreshold: detail.qty_threshold || detail.threshold || 'N/A',
            sameCost: !!detail.same_cost,
            placedDate: detail.placed_date || '',
            expirationDate: detail.expiry_date || '',
            created: detail.created_date || '',
            lastUpdated: detail.modified_date || '',
            images: detail.images || [],
            notes: detail.notes || '',
            attachments: rawDocs.map((doc: any) => ({
              name: doc.name || doc.document_name || '',
              size: doc.size || doc.document_size || '',
              type: doc.type || doc.document_type || ''
            })),
            lines: []
          };

          this.lines = rawLines.map((line: any) => ({
            id: String(line.code || line.id || ''),
            location: line.location || '',
            area: line.area || '',
            status: line.status || '',
            availableQty: line.available_qty || line.availableQty || '0 Qty',
            minimumQty: line.minimum_qty || line.minimumQty || '-',
            barcode: line.barcode || '',
            cost: line.cost || '0.00'
          }));
        }
      },
      error: (err: any) => {
        console.error("Error loading inventory detail:", err);
      }
    });
  }

  get filteredLines(): InventoryLineRow[] {
    const q = this.lineSearch.trim().toLowerCase();
    if (!q) {
      return this.lines;
    }
    return this.lines.filter(
      (l) =>
        l.id.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q) ||
        l.area.toLowerCase().includes(q) ||
        l.barcode.toLowerCase().includes(q)
    );
  }

  get totalRecords(): number {
    return this.filteredLines.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalRecords / this.pageSize));
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

  get paginatedLines(): InventoryLineRow[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredLines.slice(start, start + this.pageSize);
  }

  setTab(tab: DetailTab): void {
    this.activeTab = tab;
  }

  goBack(): void {
    this.router.navigate(['/facility/inventory']);
  }

  goEdit(): void {
    this.router.navigate(['/facility/inventory/create']);
  }

  stockClass(type: InventoryStockType): string {
    return type === 'Non-Stock' ? 'inv-chip inv-chip--soft' : 'inv-chip inv-chip--info';
  }

  statusClass(status: string): string {
    if (status === 'Low Stock') {
      return 'inv-chip inv-chip--danger';
    }
    return 'inv-chip inv-chip--success';
  }

  onLineSearch(): void {
    this.pageIndex = 0;
  }

  onPageSizeChange(): void {
    this.pageIndex = 0;
  }

  previousPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex -= 1;
    }
  }

  nextPage(): void {
    if (this.displayPage < this.totalPages) {
      this.pageIndex += 1;
    }
  }

  goPage(page: number): void {
    this.pageIndex = Math.max(0, Math.min(page - 1, this.totalPages - 1));
  }

  openAddLineModal(): void {
    this.modal = {
      location: '',
      area: '',
      barcode: '',
      cost: '500.00',
      availableQty: '',
      minimumQty: ''
    };
    this.showLineModal = true;
  }

  closeLineModal(): void {
    this.showLineModal = false;
  }

  saveLine(): void {
    this.lines = [
      {
        id: String(31000 + this.lines.length + 1),
        location: this.modal.location.trim() || '—',
        area: this.modal.area.trim() || '—',
        status: 'In Stock',
        availableQty: this.modal.availableQty.trim()
          ? `${this.modal.availableQty.trim()} Qty`
          : '0 Qty',
        minimumQty: this.modal.minimumQty.trim() || '-',
        barcode: this.modal.barcode.trim() || '—',
        cost: this.modal.cost.trim()
          ? `AED ${Number(this.modal.cost).toFixed(2)}`
          : 'AED 0.00'
      },
      ...this.lines
    ];
    this.closeLineModal();
    this.activeTab = 'lines';
  }

  removeLine(id: string): void {
    this.lines = this.lines.filter((l) => l.id !== id);
    this.closeRowAction();
  }

  removeImage(index: number): void {
    this.item = {
      ...this.item,
      images: this.item.images.filter((_, i) => i !== index)
    };
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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (target?.closest('[data-inv-line-action]')) {
      return;
    }
    this.closeRowAction();
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  onViewportChange(): void {
    if (this.openRowActionId) {
      this.closeRowAction();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.showLineModal) {
      this.closeLineModal();
    }
  }
}
