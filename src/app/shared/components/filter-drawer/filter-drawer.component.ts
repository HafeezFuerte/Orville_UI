import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-filter-drawer',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule, TranslateModule],
  templateUrl: './filter-drawer.component.html',
  styleUrl: './filter-drawer.component.scss'
})
export class FilterDrawerComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  @Input() isOpen = false;
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() apply = new EventEmitter<void>();
  @Output() clear = new EventEmitter<void>();
  @Output() closeDrawer = new EventEmitter<void>();

  @Input() showDefaultFilters: boolean = true;

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

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      if (this.isOpen) {
        this.close();
      }
    });
  }

  ngOnDestroy() {
    if (this.isOpen) {
      this.close();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  close() {
    this.isOpen = false;
    this.isOpenChange.emit(false);
    this.closeDrawer.emit();
  }

  applyFilters() {
    this.apply.emit();
    this.close();
  }

  clearFilters() {
    this.clear.emit();
  }
}
