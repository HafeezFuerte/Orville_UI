import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { ReusableModalComponent } from '../../portfolio/reusable-modal/reusable-modal.component';

@Component({
  selector: 'app-inspection-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule, SharedTableComponent, ReusableModalComponent],
  templateUrl: './inspection-details.component.html',
  styleUrl: './inspection-details.component.scss'
})
export class InspectionDetailsComponent implements OnInit {
  private translate = inject(TranslateService);

  isLoading = false;
  showModal = false;
  imageIndex = 0;

  imagesList = [
    'assets/images/common/img-placeholder.png',
    'assets/images/common/img-placeholder.png',
    'assets/images/common/img-placeholder.png'
  ];

  isColumnDropdownOpen = false;
  showActionMenu = false;

  inspectionItemsColumns = [
    { key: 'item', label: 'Item', labelKey: 'web.inspections.details.colItem', visible: true, useTemplate: true },
    { key: 'cleanliness', label: 'Cleanliness', labelKey: 'web.inspections.details.colCleanliness', visible: true, useTemplate: true },
    { key: 'condition', label: 'Condition', labelKey: 'web.inspections.details.colCondition', visible: true, useTemplate: true },
    { key: 'notes', label: 'Notes', labelKey: 'web.inspections.details.colNotes', visible: true, useTemplate: true },
    { key: 'images', label: 'Images', labelKey: 'web.inspections.details.colImages', visible: true, useTemplate: true },
    { key: 'qty', label: 'Qty', labelKey: 'web.inspections.details.colQty', visible: true, useTemplate: true },
    { key: 'cost', label: 'Cost', labelKey: 'web.inspections.details.colCost', visible: true, useTemplate: true }
  ];

  inspectionItemsData = [
    { item: '31658', cleanliness: 'Clean', condition: 'Good', notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', images: ['img1', 'img2', 'img3'], qty: null, cost: null },
    { item: '31658', cleanliness: 'Clean', condition: 'Good', notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', images: ['img1', 'img2'], qty: null, cost: null },
    { item: '31658', cleanliness: 'Clean', condition: 'Good', notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', images: ['img1'], qty: null, cost: null },
    { item: '31658', cleanliness: 'Clean', condition: 'Good', notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', images: ['img1'], qty: null, cost: null }
  ];

  ngOnInit() {
    this.updateColumnLabels();
    this.translate.onLangChange.subscribe(() => {
      this.updateColumnLabels();
    });
  }

  private updateColumnLabels() {
    this.inspectionItemsColumns.forEach(col => {
      if (col.labelKey) {
        col.label = this.translate.instant(col.labelKey);
      }
    });
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showActionMenu = false;
    this.isColumnDropdownOpen = false;
  }

  toggleActionMenu(event: Event): void {
    event.stopPropagation();
    this.isColumnDropdownOpen = false;
    this.showActionMenu = !this.showActionMenu;
  }

  onAction(_action: string): void {
    this.showActionMenu = false;
  }

  get visibleColumns() {
    return this.inspectionItemsColumns.filter(c => c.visible !== false);
  }

  get allColumnsVisible() {
    return this.inspectionItemsColumns.every(c => c.visible !== false);
  }

  toggleAllColumns(checked: boolean) {
    this.inspectionItemsColumns.forEach(c => c.visible = checked);
  }

  clearAllColumns() {
    this.inspectionItemsColumns.forEach(c => c.visible = false);
  }

  openImageModal(idx: number) {
    this.imageIndex = idx;
    this.showModal = true;
  }

  nextImage() {
    this.imageIndex = (this.imageIndex + 1) % this.imagesList.length;
  }

  prevImage() {
    this.imageIndex = (this.imageIndex - 1 + this.imagesList.length) % this.imagesList.length;
  }

  closeModal() {
    this.showModal = false;
  }
}
