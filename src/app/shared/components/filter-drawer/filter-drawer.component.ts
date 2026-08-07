import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-filter-drawer',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './filter-drawer.component.html',
  styleUrl: './filter-drawer.component.scss'
})
export class FilterDrawerComponent {
  @Input() isOpen = false;
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() apply = new EventEmitter<void>();
  @Output() clear = new EventEmitter<void>();

  // Filter properties
  @Input() selectedTag: string | null = null;
  @Output() selectedTagChange = new EventEmitter<string | null>();

  @Input() selectedArea: string | null = null;
  @Output() selectedAreaChange = new EventEmitter<string | null>();

  @Input() selectedId: any = null;
  @Output() selectedIdChange = new EventEmitter<any>();

  @Input() selectedRefNo: string | null = null;
  @Output() selectedRefNoChange = new EventEmitter<string | null>();

  @Input() selectedOffPlanStatus: string | null = null;
  @Output() selectedOffPlanStatusChange = new EventEmitter<string | null>();

  @Input() selectedLandlord: string | null = null;
  @Output() selectedLandlordChange = new EventEmitter<string | null>();

  @Input() selectedInternalStatus: string | null = null;
  @Output() selectedInternalStatusChange = new EventEmitter<string | null>();

  // Standard lists
  tagsList: string[] = ['Premium', 'Best Seller', 'Compact', 'Luxury', 'Corporate', 'Prime Location'];
  landlordsList: string[] = ['Orville Real Estate', 'Emaar Properties', 'DIFC Investments', 'Emaar Malls'];
  offPlanStatuses: string[] = ['Yes', 'No'];
  internalStatuses: string[] = ['Active', 'Draft', 'Suspended'];

  closeDrawer() {
    this.isOpen = false;
    this.isOpenChange.emit(false);
  }

  applyFilters() {
    this.apply.emit();
    this.closeDrawer();
  }

  clearFilters() {
    this.clear.emit();
  }
}
