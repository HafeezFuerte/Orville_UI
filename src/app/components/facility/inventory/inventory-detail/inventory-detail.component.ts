import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import {
  INVENTORY_DETAIL,
  InventoryDetail,
  InventoryLineDraft,
  InventoryLineRow,
  InventoryStockType
} from '../inventory.data';

type DetailTab = 'details' | 'lines' | 'attachments' | 'notes';

@Component({
  selector: 'app-inventory-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SharedTableComponent],
  templateUrl: './inventory-detail.component.html',
  styleUrl: './inventory-detail.component.scss'
})
export class InventoryDetailComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  activeTab: DetailTab = 'details';
  showLineModal = false;
  lineSearch = '';
  pageIndex = 0;
  pageSize = 5;
  openRowActionId: string | null = null;
  rowMenuStyle: Record<string, string> | null = null;

  item: InventoryDetail = {
    ...INVENTORY_DETAIL,
    id: this.route.snapshot.paramMap.get('id') || INVENTORY_DETAIL.id
  };
  lines: InventoryLineRow[] = [...INVENTORY_DETAIL.lines];

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
