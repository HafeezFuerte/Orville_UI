import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FilterDrawerComponent } from '../../../shared/components/filter-drawer/filter-drawer.component';
import {
  PROPERTY_LISTING_CARDS,
  PropertyListingCard,
  listingOccupancyClass,
  listingOfferClass,
  listingPublishClass
} from '../property-listings.data';

type OfferTab = 'All' | 'For Rent' | 'For Sale';

@Component({
  selector: 'app-all-listings',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterDrawerComponent],
  templateUrl: './all-listings.component.html',
  styleUrl: './all-listings.component.scss'
})
export class AllListingsComponent {
  private router = inject(Router);

  readonly publishClass = listingPublishClass;
  readonly offerClass = listingOfferClass;
  readonly occupancyClass = listingOccupancyClass;
  readonly offerTabs: OfferTab[] = ['All', 'For Rent', 'For Sale'];

  /** Catalog size shown in chrome; cards are presentation mock. */
  readonly totalCatalog = 412;
  allCards = PROPERTY_LISTING_CARDS;
  searchQuery = '';
  offerTab: OfferTab = 'All';
  isDrawerOpen = false;
  openMenuId: string | null = null;
  pageIndex = 0;
  pageSize = 12;
  filterOffer: '' | 'For Rent' | 'For Sale' = '';
  filterStatus: '' | 'Published' | 'Draft' | 'Unpublished' = '';
  filterOccupancy: '' | 'Vacant' | 'Occupied' = '';

  get filteredCards(): PropertyListingCard[] {
    const q = this.searchQuery.trim().toLowerCase();
    return this.allCards.filter((card) => {
      if (this.offerTab !== 'All' && card.offer !== this.offerTab) {
        return false;
      }
      if (this.filterOffer && card.offer !== this.filterOffer) {
        return false;
      }
      if (this.filterStatus && card.publishStatus !== this.filterStatus) {
        return false;
      }
      if (this.filterOccupancy && card.occupancy !== this.filterOccupancy) {
        return false;
      }
      if (!q) {
        return true;
      }
      return (
        card.title.toLowerCase().includes(q) ||
        card.ref.toLowerCase().includes(q) ||
        card.id.toLowerCase().includes(q) ||
        card.unitType.toLowerCase().includes(q) ||
        card.price.toLowerCase().includes(q) ||
        card.offer.toLowerCase().includes(q)
      );
    });
  }

  get pageCards(): PropertyListingCard[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredCards.slice(start, start + this.pageSize);
  }

  get filteredCount(): number {
    return this.filteredCards.length;
  }

  get availableCount(): number {
    return this.filteredCards.filter((c) => c.occupancy === 'Vacant').length;
  }

  get publishedCount(): number {
    return this.filteredCards.filter((c) => c.publishStatus === 'Published').length;
  }

  get activeFilterCount(): number {
    let n = 0;
    if (this.filterOffer) n++;
    if (this.filterStatus) n++;
    if (this.filterOccupancy) n++;
    return n;
  }

  get displayPage(): number {
    return this.pageIndex + 1;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(Math.max(this.filteredCount, 1) / this.pageSize));
  }

  get startRecord(): number {
    if (this.filteredCount === 0) {
      return 0;
    }
    return this.pageIndex * this.pageSize + 1;
  }

  get endRecord(): number {
    return Math.min(this.filteredCount, (this.pageIndex + 1) * this.pageSize);
  }

  setOfferTab(tab: OfferTab): void {
    this.offerTab = tab;
    this.pageIndex = 0;
  }

  onSearch(): void {
    this.pageIndex = 0;
  }

  toggleMenu(id: string, event: MouseEvent): void {
    event.stopPropagation();
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  @HostListener('document:click')
  closeMenus(): void {
    this.openMenuId = null;
  }

  applyFilters(): void {
    this.pageIndex = 0;
    this.isDrawerOpen = false;
  }

  clearFilters(): void {
    this.filterOffer = '';
    this.filterStatus = '';
    this.filterOccupancy = '';
    this.pageIndex = 0;
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.pageIndex = 0;
  }

  onPageSizeChange(): void {
    this.pageIndex = 0;
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.pageIndex = page - 1;
  }

  previousPage(): void {
    this.goToPage(this.displayPage - 1);
  }

  nextPage(): void {
    this.goToPage(this.displayPage + 1);
  }

  firstPage(): void {
    this.goToPage(1);
  }

  lastPage(): void {
    this.goToPage(this.totalPages);
  }

  openListing(id: string): void {
    this.openMenuId = null;
    void this.router.navigate(['/property-listings', id]);
  }

  viewPublicWebsite(): void {
    // Presentation only — no external navigation wired.
  }
}
