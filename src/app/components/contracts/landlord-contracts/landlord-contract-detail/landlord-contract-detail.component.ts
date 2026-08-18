import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  CONTRACT_COMMISSIONS,
  CONTRACT_DOCUMENTS,
  CONTRACT_PAYMENTS,
  CONTRACT_PROPERTIES,
  CONTRACT_ROOMS,
  CONTRACT_SIGNATURES,
  CONTRACT_UNITS,
  ContractPropertyRow,
  ContractRoomRow,
  ContractUnitRow,
  LANDLORD_CONTRACT_ROWS,
  findLandlordContract,
  LandlordContractRow
} from '../landlord-contracts.data';

export interface LcdColumn {
  key: string;
  label: string;
  visible: boolean;
}

@Component({
  selector: 'app-landlord-contract-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './landlord-contract-detail.component.html',
  styleUrl: './landlord-contract-detail.component.scss'
})
export class LandlordContractDetailComponent implements OnInit {
  activeTab: 'overview' | 'signatures' | 'financials' = 'overview';
  showActionMenu = false;
  openColumnMenu: 'properties' | 'units' | 'rooms' | null = null;
  contract: LandlordContractRow = LANDLORD_CONTRACT_ROWS[0];

  properties = CONTRACT_PROPERTIES;
  units = CONTRACT_UNITS;
  rooms = CONTRACT_ROOMS;
  commissions = CONTRACT_COMMISSIONS;
  documents = CONTRACT_DOCUMENTS;
  payments = CONTRACT_PAYMENTS;
  signatures = CONTRACT_SIGNATURES;
  propertyQuery = '';
  unitQuery = '';
  roomQuery = '';
  fileQuery = '';

  propertyColumns: LcdColumn[] = [
    { key: 'id', label: 'ID', visible: true },
    { key: 'name', label: 'Name', visible: true },
    { key: 'type', label: 'Type', visible: true },
    { key: 'unitsRooms', label: 'Units / Rooms', visible: true },
    { key: 'internalStatus', label: 'Internal Status', visible: true },
    { key: 'tags', label: 'Tags', visible: true },
    { key: 'activeLeases', label: 'Active Leases', visible: true },
    { key: 'contracts', label: 'Contracts', visible: true },
    { key: 'occupiedTotal', label: 'Occupied/ Total Units', visible: true },
    { key: 'occupancyRate', label: 'Occupancy Rate', visible: true }
  ];

  unitColumns: LcdColumn[] = [
    { key: 'id', label: 'ID', visible: true },
    { key: 'name', label: 'Name', visible: true },
    { key: 'category', label: 'Category', visible: true },
    { key: 'beds', label: 'Beds', visible: true },
    { key: 'property', label: 'Property', visible: true },
    { key: 'landlord', label: 'Landlord', visible: true },
    { key: 'tags', label: 'Tags', visible: true },
    { key: 'unitType', label: 'Unit Type', visible: true },
    { key: 'floorNumber', label: 'Floor Number', visible: true },
    { key: 'managementFee', label: 'Management Fee', visible: true },
    { key: 'status', label: 'Status', visible: true },
    { key: 'internalStatus', label: 'Internal Status', visible: true },
    { key: 'size', label: 'Size', visible: true },
    { key: 'marketRent', label: 'Market Rent', visible: true },
    { key: 'deposited', label: 'Deposited', visible: true },
    { key: 'published', label: 'Published', visible: true },
    { key: 'forSale', label: 'For Sale', visible: true }
  ];

  roomColumns: LcdColumn[] = [
    { key: 'id', label: 'ID', visible: true },
    { key: 'name', label: 'Name', visible: true },
    { key: 'category', label: 'Category', visible: true },
    { key: 'beds', label: 'Beds', visible: true },
    { key: 'property', label: 'Property', visible: true },
    { key: 'landlord', label: 'Landlord', visible: true },
    { key: 'tags', label: 'Tags', visible: true },
    { key: 'unitType', label: 'Unit Type', visible: true },
    { key: 'roomType', label: 'Room Type', visible: true },
    { key: 'floorNumber', label: 'Floor Number', visible: true },
    { key: 'managementFee', label: 'Management Fee', visible: true },
    { key: 'status', label: 'Status', visible: true },
    { key: 'internalStatus', label: 'Internal Status', visible: true },
    { key: 'size', label: 'Size', visible: true },
    { key: 'marketRent', label: 'Market Rent', visible: true },
    { key: 'deposited', label: 'Deposited', visible: true },
    { key: 'published', label: 'Published', visible: true },
    { key: 'forSale', label: 'For Sale', visible: true }
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.contract = findLandlordContract(id) ?? this.contract;
  }

  get visiblePropertyColumns(): LcdColumn[] {
    return this.propertyColumns.filter((col) => col.visible);
  }

  get visibleUnitColumns(): LcdColumn[] {
    return this.unitColumns.filter((col) => col.visible);
  }

  get visibleRoomColumns(): LcdColumn[] {
    return this.roomColumns.filter((col) => col.visible);
  }

  get allPropertyColumnsSelected(): boolean {
    return this.propertyColumns.every((col) => col.visible);
  }

  get allUnitColumnsSelected(): boolean {
    return this.unitColumns.every((col) => col.visible);
  }

  get allRoomColumnsSelected(): boolean {
    return this.roomColumns.every((col) => col.visible);
  }

  get filteredProperties(): ContractPropertyRow[] {
    return this.filterRows(this.properties, this.propertyQuery);
  }

  get filteredUnits(): ContractUnitRow[] {
    return this.filterRows(this.units, this.unitQuery);
  }

  get filteredRooms(): ContractRoomRow[] {
    return this.filterRows(this.rooms, this.roomQuery);
  }

  goBack(): void {
    this.router.navigate(['/landlord-contracts']);
  }

  goToEdit(): void {
    this.router.navigate(['/landlord-contracts/create']);
  }

  setTab(tab: 'overview' | 'signatures' | 'financials'): void {
    this.activeTab = tab;
  }

  toggleActionMenu(event: Event): void {
    event.stopPropagation();
    this.showActionMenu = !this.showActionMenu;
    this.openColumnMenu = null;
  }

  toggleColumnMenu(menu: 'properties' | 'units' | 'rooms', event: Event): void {
    event.stopPropagation();
    this.showActionMenu = false;
    this.openColumnMenu = this.openColumnMenu === menu ? null : menu;
  }

  toggleColumn(columns: LcdColumn[], key: string): void {
    const col = columns.find((item) => item.key === key);
    if (col) {
      col.visible = !col.visible;
    }
  }

  toggleAllColumns(columns: LcdColumn[], event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    columns.forEach((col) => (col.visible = checked));
  }

  @HostListener('document:click')
  closeMenus(): void {
    this.showActionMenu = false;
    this.openColumnMenu = null;
  }

  private filterRows<T extends object>(rows: T[], query: string): T[] {
    const q = query.trim().toLowerCase();
    if (!q) {
      return rows;
    }
    return rows.filter((row) =>
      Object.values(row).some((value) => String(value).toLowerCase().includes(q))
    );
  }
}
