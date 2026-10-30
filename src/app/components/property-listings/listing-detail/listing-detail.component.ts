import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  getListingDetail,
  listingOccupancyClass,
  listingOfferClass,
  listingPublishClass,
  listingYesNoClass,
  PropertyListingDetail
} from '../property-listings.data';

@Component({
  selector: 'app-listing-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './listing-detail.component.html',
  styleUrl: './listing-detail.component.scss'
})
export class ListingDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  detail: PropertyListingDetail = getListingDetail('301-PR-2');
  activeTab: 'overview' | 'amenities' | 'location' = 'overview';
  showMoreDetails = false;
  showActionMenu = false;

  readonly occupancyClass = listingOccupancyClass;
  readonly publishClass = listingPublishClass;
  readonly offerClass = listingOfferClass;
  readonly yesNoClass = listingYesNoClass;

  readonly tabs: { key: 'overview' | 'amenities' | 'location'; labelKey: string }[] = [
    { key: 'overview', labelKey: 'web.propertyListings.detail.tabOverview' },
    { key: 'amenities', labelKey: 'web.propertyListings.detail.tabAmenities' },
    { key: 'location', labelKey: 'web.propertyListings.detail.tabLocation' }
  ];

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.detail = getListingDetail(id);
        this.activeTab = 'overview';
        this.showMoreDetails = false;
      }
    });
  }

  /** Primary commercial figure based on offer type. */
  get primaryPrice(): string {
    return this.detail.offer === 'For Sale' ? this.detail.salePrice : this.detail.monthlyRent;
  }

  get primaryPriceLabelKey(): string {
    return this.detail.offer === 'For Sale' ? 'web.propertyListings.detail.salePrice' : 'web.propertyListings.detail.monthlyRent';
  }

  get secondaryPrice(): string {
    return this.detail.offer === 'For Sale' ? this.detail.monthlyRent : this.detail.salePrice;
  }

  get secondaryPriceLabelKey(): string {
    return this.detail.offer === 'For Sale' ? 'web.propertyListings.detail.monthlyRent' : 'web.propertyListings.detail.salePrice';
  }

  goBack(): void {
    void this.router.navigate(['/property-listings']);
  }

  setTab(key: 'overview' | 'amenities' | 'location'): void {
    this.activeTab = key;
  }

  toggleMoreDetails(): void {
    this.showMoreDetails = !this.showMoreDetails;
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showActionMenu = false;
  }
}
