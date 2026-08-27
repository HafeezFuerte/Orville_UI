import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  ContractPropertyRow,
  ContractRoomRow,
  ContractUnitRow,
  VendorContractRow,
  VendorContractStatus
} from '../vendor-contracts.data';
import { PortfolioService } from '../../../portfolio/services/portfolio.service';
import { CommonService } from '../../../../services/common.service';

export interface LcdColumn {
  key: string;
  label: string;
  visible: boolean;
}

@Component({
  selector: 'app-vendor-contract-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './vendor-contract-detail.component.html',
  styleUrl: './vendor-contract-detail.component.scss'
})
export class VendorContractDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private portfolioService = inject(PortfolioService);
  private commonService = inject(CommonService);

  activeTab: 'overview' | 'signatures' | 'financials' = 'overview';
  showActionMenu = false;
  openColumnMenu: 'properties' | 'units' | 'rooms' | null = null;
  actionOptions = [
    { label: 'Edit Contract', asset: 'assets/images/action-menu/pencil.svg', icon: '', danger: false },
    { label: 'Activate Contract', asset: '', icon: 'ri-save-line', danger: false },
    { label: 'Print Contract Pdf', asset: 'assets/images/action-menu/printer.svg', icon: '', danger: false },
    { label: 'Archive Contract', asset: 'assets/images/action-menu/archive.svg', icon: '', danger: true }
  ];

  contract: VendorContractRow = {
    id: '',
    initials: '',
    vendor: '',
    name: '',
    properties: '',
    unitsRooms: '',
    startDate: '',
    endDate: '',
    createDate: '',
    status: 'Draft',
    value: '',
    daysLeft: ''
  };

  contractCycle = '';
  paymentVia = '';
  feeType = '';
  noOfPayments = 0;
  createdDate = '';
  modifiedDate = '';
  remark = '';
  partyEmail = '';
  partyPhone = '';

  properties: ContractPropertyRow[] = [];
  units: ContractUnitRow[] = [];
  rooms: ContractRoomRow[] = [];
  commissions: any[] = [];
  documents: any[] = [];
  payments: any[] = [];
  signatures: any[] = [];
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
    { key: 'vendor', label: 'Vendor', visible: true },
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
    { key: 'vendor', label: 'Vendor', visible: true },
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

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || '';
    if (id) {
      this.loadDetail(id);
    }
  }

  formatDateString(dateStr: string): string {
    if (!dateStr) return '';
    try {
      const dt = new Date(dateStr);
      if (isNaN(dt.getTime())) return dateStr;
      const d = String(dt.getDate()).padStart(2, '0');
      const m = String(dt.getMonth() + 1).padStart(2, '0');
      const y = dt.getFullYear();
      return `${d}-${m}-${y}`;
    } catch {
      return dateStr;
    }
  }

  loadDetail(code: string): void {
    const currentUser = this.commonService.getCurrentUser();
    this.portfolioService.getMasterByType({
      typeId: 25,
      filterId: 0,
      filterText: code,
      filterText1: '',
      userId: currentUser?.userId || 1,
      clientId: currentUser?.clientId || "74BB6922",
      companyId: currentUser?.companyId || 1
    }).subscribe({
      next: (res: any) => {
        if (res && res.statusCode === "200" && res.objResult) {
          const detail = res.objResult.contract_dtls?.[0] || res.objResult.contract?.[0] || res.objResult.table?.[0] || {};
          const rawProps = res.objResult.properties || res.objResult.table1 || [];
          const rawUnits = res.objResult.units || res.objResult.table2 || [];
          const rawRooms = res.objResult.rooms || res.objResult.table3 || [];
          const rawDocs = res.objResult.documents || res.objResult.table4 || [];

          this.contract = {
            id: String(detail.code || detail.id || code),
            initials: detail.initials || 'AY',
            vendor: detail.vendor || '',
            name: detail.name || '',
            properties: '',
            unitsRooms: '',
            startDate: this.formatDateString(detail.start_date) || '',
            endDate: this.formatDateString(detail.end_date) || '',
            createDate: this.formatDateString(detail.created_date) || '',
            status: detail.is_active ? 'Active' : 'Draft',
            value: `AED ${(detail.value || 0).toFixed(2)}`,
            daysLeft: detail.days_left ? `${detail.days_left} days` : '—'
          };

          this.contractCycle = detail.contract_cycle || '';
          this.paymentVia = detail.payment_type_nm || '';
          this.feeType = detail.management_fee_type || detail.fee_type || '';
          this.noOfPayments = detail.no_of_payments || 0;
          this.createdDate = this.formatDateString(detail.created_date) || '';
          this.modifiedDate = this.formatDateString(detail.modified_date) || '';
          this.remark = detail.remark || detail.remarks || '';
          this.partyEmail = detail.vendor_email || detail.email || '';
          this.partyPhone = detail.vendor_phone || detail.phone || '';

          const getFileName = (url: string) => {
            if (!url) return '';
            const parts = url.split('/');
            return parts[parts.length - 1];
          };

          this.properties = rawProps.map((p: any) => {
            const totalUnits = Number(p.total_units || 0);
            const occupiedUnits = Number(p.occupied_units || 0);
            const rate = totalUnits ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
            return {
              id: p.code || '',
              name: p.name || '',
              location: p.category_name || '',
              type: p.type_name || 'Residential',
              unitsRooms: `${p.total_units || 0} / ${p.total_rooms || 0}`,
              internalStatus: 'Active',
              tags: '',
              activeLeases: String(p.total_leases || 0),
              contracts: String(p.contracts || 0),
              occupiedTotal: `${p.occupied_units || 0} / ${p.total_units || 0}`,
              occupancyRate: rate
            };
          });

          this.units = rawUnits.map((u: any) => ({
            id: u.code || '',
            name: u.unit_code || '',
            category: u.category_name || '',
            beds: u.unit_type_name || '',
            property: u["property Name"] || '',
            propertyLocation: '',
            vendor: '',
            tags: '',
            unitType: u.unit_type_name || '',
            floorNumber: '',
            managementFee: '',
            status: u.unit_status_name || '',
            internalStatus: '',
            size: '',
            marketRent: '',
            deposited: '',
            published: '',
            forSale: ''
          }));

          this.rooms = rawRooms.map((r: any) => ({
            id: r.code || '',
            name: r.unit_code1 || r.unit_code || '',
            category: r.category_name || '',
            beds: r.room_type_name || '',
            property: r["property Name"] || '',
            propertyLocation: '',
            vendor: '',
            tags: '',
            unitType: '',
            roomType: r.room_type_name || '',
            floorNumber: '',
            managementFee: '',
            status: r.room_status_name || '',
            internalStatus: '',
            size: '',
            marketRent: '',
            deposited: '',
            published: '',
            forSale: ''
          }));

          this.commissions = [];

          this.documents = rawDocs.map((d: any) => {
            const fileName = getFileName(d.file_path);
            const dateStr = this.formatDateString(d.uploaded_date);
            return {
              name: fileName || d.document_type_name || 'Document',
              meta: `${d.document_status_name || ''} - Uploaded on ${dateStr}`
            };
          });

          this.payments = [];
          this.signatures = [];
        }
      },
      error: (err: any) => {
        console.error("Error loading vendor contract detail:", err);
      }
    });
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
    this.router.navigate(['/vendor-contracts']);
  }

  goToEdit(): void {
    this.router.navigate(['/vendor-contracts/create']);
  }

  onAction(label: string): void {
    this.showActionMenu = false;
    if (label === 'Edit Contract') {
      this.goToEdit();
    }
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
