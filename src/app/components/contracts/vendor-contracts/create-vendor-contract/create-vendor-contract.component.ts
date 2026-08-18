import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import {
  CONTRACT_CYCLE_OPTIONS,
  FEE_TYPE_OPTIONS,
  PAYMENT_VIA_OPTIONS,
  PROPERTY_OPTIONS,
  ROOM_OPTIONS,
  UNIT_OPTIONS,
  VENDOR_OPTIONS
} from '../vendor-contracts.data';

@Component({
  selector: 'app-create-vendor-contract',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule],
  templateUrl: './create-vendor-contract.component.html',
  styleUrl: './create-vendor-contract.component.scss'
})
export class CreateVendorContractComponent {
  vendors = VENDOR_OPTIONS;
  properties = PROPERTY_OPTIONS;
  units = UNIT_OPTIONS;
  rooms = ROOM_OPTIONS;
  cycles = CONTRACT_CYCLE_OPTIONS;
  feeTypes = FEE_TYPE_OPTIONS;
  pmaTypes = ['Standard', 'Full management', 'Let only'];
  taxProfiles = ['Standard rated', 'Zero rated', 'Exempt'];
  paymentViaOptions = PAYMENT_VIA_OPTIONS;
  pendingUnit: string | null = null;
  pendingRoom: string | null = null;
  unitMenuOpen = false;
  roomMenuOpen = false;

  selectedUnits: string[] = ['Unit - Apartment- 210', 'Unit - Apartment- 209'];
  selectedRooms: string[] = ['Room - Master', 'Room - 02'];

  schedules = [
    { account: 'Late Fee Income', amount: 'AED 1000.00', due: '30-06-2026', recurrence: 'Daily', paymentVia: 'Cash' },
    { account: 'Late Fee Income', amount: 'AED 1000.00', due: '30-06-2026', recurrence: 'Daily', paymentVia: 'Cash' }
  ];

  form = {
    vendor: 'Orville Real Estate',
    property: 'Marina Height Tower',
    name: '',
    cycle: null as string | null,
    startDate: '',
    endDate: '',
    feeType: null as string | null,
    feeValue: '0.00',
    paymentCount: '',
    pmaType: null as string | null,
    paymentVia: null as string | null,
    taxProfile: null as string | null,
    chargePayments: '',
    chargePercent: '0.00',
    chargeCommission: '0.00',
    chargeFixed: '0.00',
    chargeBalance: '0.00',
    notes: ''
  };

  constructor(private router: Router, private toastr: ToastrService) {}

  goBack(): void {
    this.router.navigate(['/vendor-contracts']);
  }

  toggleUnitMenu(event: Event): void {
    event.stopPropagation();
    this.unitMenuOpen = !this.unitMenuOpen;
    this.roomMenuOpen = false;
  }

  addUnit(): void {
    this.unitMenuOpen = false;
    const next = this.pendingUnit || this.units.find((u) => !this.selectedUnits.includes(u));
    if (next && !this.selectedUnits.includes(next)) {
      this.selectedUnits = [...this.selectedUnits, next];
    }
    this.pendingUnit = null;
  }

  addAllUnits(): void {
    this.unitMenuOpen = false;
    this.selectedUnits = [...this.units];
  }

  removeUnit(unit: string): void {
    this.selectedUnits = this.selectedUnits.filter((u) => u !== unit);
  }

  toggleRoomMenu(event: Event): void {
    event.stopPropagation();
    this.roomMenuOpen = !this.roomMenuOpen;
    this.unitMenuOpen = false;
  }

  addRoom(): void {
    this.roomMenuOpen = false;
    const next = this.pendingRoom || this.rooms.find((r) => !this.selectedRooms.includes(r));
    if (next && !this.selectedRooms.includes(next)) {
      this.selectedRooms = [...this.selectedRooms, next];
    }
    this.pendingRoom = null;
  }

  addAllRooms(): void {
    this.roomMenuOpen = false;
    this.selectedRooms = [...this.rooms];
  }

  removeRoom(room: string): void {
    this.selectedRooms = this.selectedRooms.filter((r) => r !== room);
  }

  addPayment(): void {
    this.schedules = [
      ...this.schedules,
      { account: 'Late Fee Income', amount: 'AED 1000.00', due: '30-06-2026', recurrence: 'Daily', paymentVia: 'Cash' }
    ];
  }

  removeSchedule(index: number): void {
    this.schedules = this.schedules.filter((_, i) => i !== index);
  }

  clearSchedules(): void {
    this.schedules = [];
  }

  @HostListener('document:click')
  closeMenus(): void {
    this.unitMenuOpen = false;
    this.roomMenuOpen = false;
  }

  preview(): void {
    this.toastr.info('Preview uses the current form values. No file is generated.');
  }

  save(): void {
    this.toastr.success('Contract saved locally. No API was called.');
    this.goBack();
  }
}
