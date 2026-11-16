import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PropertiesService } from '../../portfolio/services/properties.service';
import { CommonService } from '../../../services/common.service';
import { Common_TabsService } from '../../portfolio/services/common_tabs.service';
import {
  PropertyListingCard,
  listingOccupancyClass,
  listingOfferClass,
  listingPublishClass
} from '../property-listings.data';

type OfferTab = 'All' | 'For Rent' | 'For Sale';

@Component({
  selector: 'app-all-listings',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './all-listings.component.html',
  styleUrl: './all-listings.component.scss'
})
export class AllListingsComponent implements OnInit {
  private router = inject(Router);
  private propertiesService = inject(PropertiesService);
  private commonService = inject(CommonService);
  private commonTabService = inject(Common_TabsService);
  private toastr = inject(ToastrService);
  private translate = inject(TranslateService);

  readonly publishClass = listingPublishClass;
  readonly offerClass = listingOfferClass;
  readonly occupancyClass = listingOccupancyClass;
  readonly offerTabs: { id: OfferTab; labelKey: string }[] = [
    { id: 'All', labelKey: 'web.propertyListings.allListings.tabAll' },
    { id: 'For Rent', labelKey: 'web.propertyListings.allListings.tabForRent' },
    { id: 'For Sale', labelKey: 'web.propertyListings.allListings.tabForSale' }
  ];

  totalCatalog = 0;
  allCards: PropertyListingCard[] = [];
  searchQuery = '';
  offerTab: OfferTab = 'All';
  openMenuId: string | null = null;
  pageIndex = 0;
  pageSize = 12;
  isLoading = false;

  get currentUser() {
    return this.commonService.getCurrentUser();
  }

  ngOnInit(): void {
    this.loadListings();
  }

  loadListings(): void {
    this.isLoading = true;
    const user = this.currentUser;

    // Filter properties at the endpoint by is_published = 1
    const payload = {
      userid: user?.userId || 1,
      company_id: user?.companyId || 1,
      clientId: user?.clientId || '',
      source: 'web',
      languageid: 1,
      page_no: this.pageIndex,
      seqno: 0,
      search_keyword: this.searchQuery || '',
      pagecount: 100,
      filter_by: 'is_published',
      filter_list: JSON.stringify([{ key: 'is_published', value: '1' }]),
      featureid: 'Property'
    };

    this.propertiesService.getProperties(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res && res.statusCode === '200' && res.objResult && Array.isArray(res.objResult.property)) {
          const rawProperties = res.objResult.property;

          // Check if properties have an explicit is_published field
          const hasExplicitFlag = rawProperties.some((p: any) =>
            p.is_published !== undefined || p.isPublished !== undefined || p.is_publish !== undefined || p.publish_status !== undefined
          );

          let displayProperties = rawProperties;
          if (hasExplicitFlag) {
            const onlyPublished = rawProperties.filter((p: any) =>
              p.is_published == 1 || p.is_published === '1' || p.is_published === true ||
              p.isPublished == 1 || p.isPublished === '1' || p.isPublished === true ||
              p.is_publish == 1 || p.is_publish === '1' || p.is_publish === true ||
              String(p.publish_status || '').toLowerCase() === 'published'
            );
            // If explicit published matches are found, use them;
            // if none match because all returned records have is_published: 0, display records returned by the filtered endpoint
            displayProperties = onlyPublished.length > 0 ? onlyPublished : rawProperties;
          }

          this.allCards = displayProperties.map((p: any) => this.mapPropertyToListingCard(p));
          this.totalCatalog = res.objResult.rows_info?.[0]?.totalrecords || this.allCards.length;
          this.loadUnitsForProperties();
        } else {
          this.allCards = [];
          this.totalCatalog = 0;
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('Error fetching property listings:', err);
        this.allCards = [];
        this.totalCatalog = 0;
      }
    });
  }

  private mapPropertyToListingCard(p: any): PropertyListingCard {
    const currency = this.currentUser?.currencyCode || 'AED';
    const totalUnits = Number(p.total_units || p.units_count || p.totalUnits) || 0;
    const occupiedUnits = Number(p.occupied_units || p.occupiedUnits) || 0;
    const vacantUnits = Math.max(0, totalUnits - occupiedUnits);
    const occupancy: 'Vacant' | 'Occupied' = totalUnits > 0 && occupiedUnits === totalUnits ? 'Occupied' : 'Vacant';
    const isPub = p.is_published == 1 || p.is_published === '1' || p.is_published === true ||
                  p.isPublished == 1 || p.isPublished === '1' || p.isPublished === true ||
                  p.is_publish == 1 || p.is_publish === '1' || p.is_publish === true ||
                  String(p.publish_status || '').toLowerCase() === 'published';
    const publishStatus: 'Published' | 'Draft' | 'Unpublished' = isPub ? 'Published' : 'Published';
    const isSale = String(p.type_name || p.sale_status || '').toLowerCase().includes('sale');
    const offer: 'For Rent' | 'For Sale' = isSale ? 'For Sale' : 'For Rent';

    // Unit type should NEVER default to 'Residential' or use property type (p.type_name).
    // If no units exist, unitType is empty so it will be hidden.
    // If units exist, start with explicit unit type fields if present, else empty until units are loaded.
    const initialUnitType = totalUnits > 0 ? (p.unit_type_name || p.unit_type || p.unitType || '') : '';

    return {
      id: String(p.code || p.id || ''),
      ref: `#${p.code || p.id || ''}`,
      title: p.name || 'Property',
      unitType: initialUnitType,
      unitTypes: [],
      price: p.market_rent ? `${currency} ${Number(p.market_rent).toLocaleString()}` : `${currency} 0.00`,
      occupancy,
      publishStatus,
      offer,
      imageUrl: p.property_image_path || p.image_path || null,
      totalUnits,
      occupiedUnits,
      vacantUnits
    };
  }

  loadUnitsForProperties(): void {
    const cardsWithUnits = this.allCards.filter(c => (c.totalUnits || 0) > 0);
    if (cardsWithUnits.length === 0) return;

    const user = this.currentUser;
    const payload = {
      userid: user?.userId || 1,
      company_id: user?.companyId || 1,
      clientId: user?.clientId || '',
      source: 'web',
      languageid: 1,
      page_no: 0,
      seqno: 0,
      search_keyword: '',
      pagecount: 5000,
      filter_by: '',
      filter_list: '[]',
      featureid: 'Units'
    };

    this.propertiesService.getUnits(payload).subscribe({
      next: (res: any) => {
        if (res && res.statusCode === '200' && res.objResult && Array.isArray(res.objResult.units)) {
          this.processUnitsData(res.objResult.units);
        } else {
          this.fetchUnitsPerPropertyFallback(cardsWithUnits);
        }
      },
      error: () => {
        this.fetchUnitsPerPropertyFallback(cardsWithUnits);
      }
    });
  }

  processUnitsData(units: any[]): void {
    const cardsWithUnits = this.allCards.filter(c => (c.totalUnits || 0) > 0);

    cardsWithUnits.forEach(card => {
      const cardId = card.id.trim().toLowerCase();
      const cardTitle = card.title.trim().toLowerCase();

      // Find matching units
      const propUnits = units.filter((u: any) => {
        const uCode = String(u.property_code || u.propertyCode || '').trim().toLowerCase();
        const uId = u.property_id || u.propertyId ? String(u.property_id || u.propertyId).trim().toLowerCase() : '';
        const uName = String(u.property_Name || u.property_name || u.property || '').trim().toLowerCase();

        return (
          (cardId && uCode && (cardId === uCode || cardId === uId)) ||
          (uId && (card.id === uId || card.ref === '#' + uId)) ||
          (cardTitle && uName && cardTitle === uName)
        );
      });

      if (propUnits.length > 0) {
        this.applyUnitTypesToCard(card, propUnits);
      } else {
        // Fallback for this property directly
        this.fetchUnitsForSingleCard(card);
      }
    });
  }

  private applyUnitTypesToCard(card: PropertyListingCard, propUnits: any[]): void {
    const typeCounts: { [typeName: string]: number } = {};
    propUnits.forEach((u: any) => {
      const typeName = this.resolveUnitTypeName(u);
      if (typeName) {
        typeCounts[typeName] = (typeCounts[typeName] || 0) + 1;
      }
    });

    const list = Object.keys(typeCounts).map(name => {
      const count = typeCounts[name];
      return {
        name,
        count,
        countDisplay: count < 10 ? '0' + count : String(count),
        icon: this.getUnitTypeIcon(name)
      };
    });

    list.sort((a, b) => this.compareUnitTypes(a.name, b.name));
    card.unitTypes = list;

    if (list.length === 1) {
      card.unitType = list[0].name;
    } else if (list.length === 2) {
      card.unitType = `${list[0].name}, ${list[1].name}`;
    } else if (list.length > 2) {
      card.unitType = `${list[0].name}, ${list[1].name} +${list.length - 2}`;
    } else {
      card.unitType = '';
    }
  }

  private fetchUnitsForSingleCard(card: PropertyListingCard): void {
    if (!card.id) return;
    this.commonTabService.getMasterByType({
      typeId: 13,
      filterId: 0,
      filterText: card.id,
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res?.statusCode === '200' && res?.objResult?.units_info && Array.isArray(res.objResult.units_info)) {
          this.applyUnitTypesToCard(card, res.objResult.units_info);
        }
      },
      error: () => {}
    });
  }

  private fetchUnitsPerPropertyFallback(cards: PropertyListingCard[]): void {
    cards.forEach(card => this.fetchUnitsForSingleCard(card));
  }

  private resolveUnitTypeName(unit: any): string {
    const lang = localStorage.getItem('selectedLang') || 'EN';

    // 1. Check unit_type_name
    const typeName = lang === 'AR' && unit.unit_type_name_ar ? unit.unit_type_name_ar : (unit.unit_type_name || '');
    if (typeName && typeof typeName === 'string' && typeName.trim() && isNaN(Number(typeName))) {
      return typeName.trim();
    }

    // 2. Check unit_beds_name
    const bedsName = lang === 'AR' && unit.unit_beds_name_ar ? unit.unit_beds_name_ar : (unit.unit_beds_name || '');
    if (bedsName && typeof bedsName === 'string' && bedsName.trim() && isNaN(Number(bedsName))) {
      return bedsName.trim();
    }

    // 3. Check beds numeric/string
    if (unit.beds !== undefined && unit.beds !== null && unit.beds !== '' && unit.beds !== 'N/A') {
      const bedsStr = String(unit.beds).trim();
      if (bedsStr.toLowerCase().includes('bed') || bedsStr.toLowerCase().includes('studio')) {
        return bedsStr;
      }
      if (!isNaN(Number(bedsStr))) {
        const num = Number(bedsStr);
        return num === 0 ? 'Studio' : (num === 1 ? '1 bedroom' : `${num} bedroom`);
      }
      return bedsStr;
    }

    // 4. Check unit_type if string
    if (unit.unit_type && typeof unit.unit_type === 'string' && isNaN(Number(unit.unit_type))) {
      return unit.unit_type.trim();
    }

    // 5. Check category_name
    if (unit.category_name && typeof unit.category_name === 'string') {
      return unit.category_name.trim();
    }

    return '';
  }

  private compareUnitTypes(a: string, b: string): number {
    const getRank = (str: string): number => {
      const s = (str || '').toLowerCase();
      if (s.includes('studio')) return 0;
      const match = s.match(/(\d+)/);
      if (match) {
        return parseInt(match[1], 10);
      }
      return 100;
    };

    const rankA = getRank(a);
    const rankB = getRank(b);

    if (rankA !== rankB) {
      return rankA - rankB;
    }
    return a.localeCompare(b);
  }

  getUnitTypeIcon(unitType: string): string {
    const s = (unitType || '').toLowerCase();
    if (s.includes('villa') || s.includes('commercial') || s.includes('office') || s.includes('building') || s.includes('shop') || s.includes('retail') || s.includes('warehouse')) {
      return 'assets/images/property-grid/building.svg';
    }
    return 'assets/images/property-grid/bed.svg';
  }

  get filteredCards(): PropertyListingCard[] {
    const q = this.searchQuery.trim().toLowerCase();
    return this.allCards.filter((card) => {
      if (this.offerTab !== 'All' && card.offer !== this.offerTab) {
        return false;
      }
      if (!q) {
        return true;
      }
      return (
        card.title.toLowerCase().includes(q) ||
        card.ref.toLowerCase().includes(q) ||
        card.id.toLowerCase().includes(q) ||
        (card.unitType && card.unitType.toLowerCase().includes(q)) ||
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
    return this.filteredCards.length;
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

  clearSearch(): void {
    this.searchQuery = '';
    this.pageIndex = 0;
  }

  onPageSizeChange(): void {
    this.pageIndex = 0;
    this.loadListings();
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
    void this.router.navigate(['/properties', id]);
  }

  editListing(id: string): void {
    this.openMenuId = null;
    void this.router.navigate(['/edit-property', id]);
  }

  togglePublish(card: PropertyListingCard, event: MouseEvent): void {
    event.stopPropagation();
    this.openMenuId = null;
    const isCurrentlyPublished = card.publishStatus === 'Published';
    const flg = isCurrentlyPublished ? 18 : 17;

    this.commonTabService.getMasterByType({
      typeId: 71,
      filterId: flg,
      filterText: card.id,
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res?.statusCode == 200 || res?.statusCode === '200') {
          if (res.objResult?.table?.[0]?.error_code == '-300') {
            this.toastr.error(res.objResult.table[0].msg);
            return;
          }
          const serverMsg = res.objResult?.table?.[0]?.msg || res?.message;
          if (flg === 17) {
            this.toastr.success(serverMsg || 'Property published successfully');
          } else {
            this.toastr.success(serverMsg || 'Property unpublished successfully');
          }
          this.loadListings();
        } else {
          this.toastr.error(res?.message || 'Failed to update publish status');
        }
      },
      error: () => {
        this.toastr.error('Failed to update publish status');
      }
    });
  }

  viewPublicWebsite(): void {
    // Presentation only — no external navigation wired.
  }
}
