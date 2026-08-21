import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { ReusableModalComponent } from '../../portfolio/reusable-modal/reusable-modal.component';

@Component({
  selector: 'app-inspection-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SharedTableComponent, ReusableModalComponent],
  templateUrl: './inspection-details.component.html',
  styleUrls: []
})
export class InspectionDetailsComponent implements OnInit {
  isLoading = false;
  showModal = false;
  imageIndex = 0;
  
  // Carousel images
  imagesList = [
    'assets/images/common/img-placeholder.png', // Fallback local placeholder
    'assets/images/common/img-placeholder.png',
    'assets/images/common/img-placeholder.png'
  ];

  isColumnDropdownOpen = false;
  isActionDropdownOpen = false;

  // Grid Columns config
  inspectionItemsColumns = [
    { key: 'item', label: 'Item', visible: true, useTemplate: true },
    { key: 'cleanliness', label: 'Cleanliness', visible: true, useTemplate: true },
    { key: 'condition', label: 'Condition', visible: true, useTemplate: true },
    { key: 'notes', label: 'Notes', visible: true, useTemplate: true },
    { key: 'images', label: 'Images', visible: true, useTemplate: true },
    { key: 'qty', label: 'Qty', visible: true, useTemplate: true },
    { key: 'cost', label: 'Cost', visible: true, useTemplate: true }
  ];

  inspectionItemsData = [
    { item: '31658', cleanliness: 'Clean', condition: 'Good', notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', images: ['img1', 'img2', 'img3'], qty: null, cost: null },
    { item: '31658', cleanliness: 'Clean', condition: 'Good', notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', images: ['img1', 'img2'], qty: null, cost: null },
    { item: '31658', cleanliness: 'Clean', condition: 'Good', notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', images: ['img1'], qty: null, cost: null },
    { item: '31658', cleanliness: 'Clean', condition: 'Good', notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', images: ['img1'], qty: null, cost: null }
  ];

  ngOnInit() {}

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
