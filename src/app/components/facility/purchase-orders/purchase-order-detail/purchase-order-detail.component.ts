import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import {
  getPurchaseOrderDetail,
  PurchaseOrderDetail,
  PurchaseOrderDetailLine,
  PurchaseOrderStatus
} from '../purchase-orders.data';

@Component({
  selector: 'app-purchase-order-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SharedTableComponent],
  templateUrl: './purchase-order-detail.component.html',
  styleUrl: './purchase-order-detail.component.scss'
})
export class PurchaseOrderDetailComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  showActionMenu = false;
  lineSearch = '';
  pageIndex = 0;
  pageSize = 5;
  openRowActionId: string | null = null;
  rowMenuStyle: Record<string, string> | null = null;

  order: PurchaseOrderDetail = getPurchaseOrderDetail(
    this.route.snapshot.paramMap.get('id') || '167'
  );
  lines: PurchaseOrderDetailLine[] = [...this.order.lines];

  lineColumns = [
    { key: 'itemCode', label: 'Item Code', visible: true, width: '100px' },
    { key: 'description', label: 'Description', visible: true, width: '280px' },
    { key: 'quantity', label: 'Quantity', visible: true, useTemplate: true, width: '100px' },
    { key: 'price', label: 'Price', visible: true, width: '120px' },
    { key: 'tax', label: 'Tax', visible: true, width: '100px' },
    { key: 'total', label: 'Total', visible: true, width: '120px' },
    { key: 'action', label: 'Action', visible: true, useTemplate: true, width: '70px' }
  ];

  get filteredLines(): PurchaseOrderDetailLine[] {
    const q = this.lineSearch.trim().toLowerCase();
    if (!q) {
      return this.lines;
    }
    return this.lines.filter(
      (l) =>
        l.itemCode.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q)
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

  get paginatedLines(): PurchaseOrderDetailLine[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredLines.slice(start, start + this.pageSize);
  }

  goBack(): void {
    this.router.navigate(['/facility/purchase-orders']);
  }

  goEdit(): void {
    this.router.navigate(['/facility/purchase-orders/create']);
  }

  statusClass(status: PurchaseOrderStatus): string {
    switch (status) {
      case 'Open':
        return 'po-chip po-chip--info';
      case 'Approved':
        return 'po-chip po-chip--success';
      case 'Closed':
        return 'po-chip po-chip--soft';
      case 'Rejected':
        return 'po-chip po-chip--danger';
      default:
        return 'po-chip po-chip--soft';
    }
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
    if (target?.closest('[data-po-line-action]')) {
      return;
    }
    if (!target?.closest('.po-action')) {
      this.showActionMenu = false;
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
}
