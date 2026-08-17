import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { SharedTableComponent } from '../../shared/components/shared-table/shared-table.component';
import { FilterDrawerComponent } from '../../shared/components/filter-drawer/filter-drawer.component';
import {
  CenterDocument,
  DOCUMENT_CENTER_ROWS,
  DocumentAttachment,
  documentStatusChip
} from './document-center.data';

export type { DocumentAttachment, CenterDocument } from './document-center.data';

@Component({
  selector: 'app-document-center',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SharedTableComponent, FilterDrawerComponent],
  templateUrl: './document-center.component.html',
  styleUrls: ['./document-center.component.scss']
})
export class DocumentCenterComponent {
  public searchQuery = '';
  public attachmentFilter: DocumentAttachment = 'All';
  public showColumnDropdown = false;
  public showFilterDrawer = false;
  public pageNo = 0;
  public pageSize = 10;
  public pageSizeOptions = [5, 10, 25, 50, 100];

  /** Figma 3667:93532 */
  public tabs: { id: DocumentAttachment; label: string }[] = [
    { id: 'All', label: 'All' },
    { id: 'Unit', label: 'Unit' },
    { id: 'Room', label: 'Room' },
    { id: 'Property', label: 'Property' },
    { id: 'Tenant', label: 'Tenant' },
    { id: 'Lease', label: 'Lease' },
    { id: 'Item', label: 'Item' },
    { id: 'WorkOrder', label: 'WorkOrder' }
  ];

  /** Figma 5012:94474 — visible rows */
  public documents: CenterDocument[] = DOCUMENT_CENTER_ROWS;

  public tableColumns = [
    { key: 'id', label: 'Document ID', visible: true, useTemplate: true },
    { key: 'type', label: 'Document type', visible: true },
    { key: 'attachmentOf', label: 'Attachment of', visible: true },
    { key: 'name', label: 'Name', visible: true },
    { key: 'status', label: 'Status', visible: true, useTemplate: true },
    { key: 'issueDate', label: 'Issue Date', visible: true },
    { key: 'expiryDate', label: 'Expiry Date', visible: true, useTemplate: true },
    { key: 'sharedWith', label: 'Shared With', visible: true }
  ];

  public get visibleColumns() {
    return this.tableColumns.filter((col) => col.visible);
  }

  public get allColumnsSelected(): boolean {
    return this.tableColumns.every((col) => col.visible !== false);
  }

  public get filteredDocuments(): CenterDocument[] {
    const query = this.searchQuery.trim().toLowerCase();
    return this.documents.filter((doc) => {
      const tabMatch = this.attachmentFilter === 'All' || doc.attachmentOf === this.attachmentFilter;
      const searchMatch = !query || doc.id.toLowerCase().includes(query);
      return tabMatch && searchMatch;
    });
  }

  public get totalRecords(): number {
    return this.filteredDocuments.length;
  }

  public get pagedDocuments(): CenterDocument[] {
    const start = this.pageNo * this.pageSize;
    return this.filteredDocuments.slice(start, start + this.pageSize);
  }

  public statusChip(status: string): string {
    return documentStatusChip(status);
  }

  public setAttachmentFilter(tab: DocumentAttachment): void {
    this.attachmentFilter = tab;
    this.pageNo = 0;
  }

  public onSearch(): void {
    this.pageNo = 0;
  }

  public toggleDrawer(show: boolean): void {
    this.showFilterDrawer = show;
  }

  public toggleColumnDropdown(event: Event): void {
    event.stopPropagation();
    this.showColumnDropdown = !this.showColumnDropdown;
  }

  public toggleColumn(key: string): void {
    const col = this.tableColumns.find((item) => item.key === key);
    if (col) {
      col.visible = col.visible === false ? true : false;
    }
  }

  public toggleAllColumns(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.tableColumns.forEach((col) => (col.visible = checked));
  }

  public onSharedTablePageChange(event: PageEvent): void {
    this.pageNo = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  @HostListener('document:click')
  public onDocumentClick(): void {
    this.showColumnDropdown = false;
  }
}
