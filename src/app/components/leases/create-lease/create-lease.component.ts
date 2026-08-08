import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

interface Occupant {
  name: string;
  phone: string;
  email: string;
}

@Component({
  selector: 'app-create-lease',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule, TranslateModule],
  templateUrl: './create-lease.component.html',
  styleUrl: './create-lease.component.scss'
})
export class CreateLeaseComponent implements OnInit {
  private router = inject(Router);
  private toastr = inject(ToastrService);

  // Form Fields
  selectedTenant: any = null;
  selectedProperty: any = null;
  selectedUnit: any = null;
  selectedRoom: any = null;
  selectedAgent: any = null;

  isShortTerm: boolean = false;
  selectedLeaseType: string = 'Fixed';
  selectedLeaseCategory: string = 'Residential';
  startDate: string = '';
  endDate: string = '';
  
  rentAmount: number = 0;
  totalPayments: number = 4;
  moneyHeldBy: string = 'Company';
  paymentMethod: string = 'Bank Transfer';
  annualRent: number = 0;
  monthlyRent: number = 0;

  noOfPerson: number = 1;
  createdBy: string = 'Zaid Rahman';
  moveInDate: string = '';
  createdAt: string = '';
  payingDate: string = '';

  // Dropdowns lists
  tenantsList = [
    { id: 101, name: 'Louis Medina', email: 'louis.medina@example.com', phone: '+971 50 123 4567' },
    { id: 102, name: 'James T. Hirai', email: 'james.hirai@example.com', phone: '+971 50 765 4321' },
    { id: 103, name: 'Sarah Malik', email: 'sarah.malik@example.com', phone: '+971 52 987 6543' }
  ];

  propertiesList = [
    { code: 'PROP-MH', name: 'Marina Heights Tower' },
    { code: 'PROP-OT', name: 'Orville Tower' },
    { code: 'PROP-BP', name: 'Business Park' }
  ];

  unitsList: any[] = [];
  roomsList: any[] = [];

  agentsList = [
    { id: 1, name: 'Zaid Rahman (Manager)' },
    { id: 2, name: 'Omer Khan (Sales)' },
    { id: 3, name: 'James J (Agent)' }
  ];

  leaseTypes = ['Fixed', 'Flexible', 'Sub-Lease'];
  leaseCategories = ['Residential', 'Commercial', 'Industrial'];
  paymentMethods = ['Bank Transfer', 'Cheque', 'Credit Card', 'Cash'];
  moneyHeldOptions = ['Company', 'Landlord', 'Escrow Agent'];

  // Summary Models
  selectedTenantObj: any = null;
  selectedPropertyObj: any = null;
  selectedUnitObj: any = null;

  // Occupants Popup Modal
  showOccupantsModal: boolean = false;
  occupantName: string = '';
  occupantPhone: string = '';
  occupantEmail: string = '';
  occupants: Occupant[] = [];
  editingOccupantIndex: number | null = null;

  ngOnInit() {
    this.resetForm();
  }

  resetForm() {
    this.selectedTenant = null;
    this.selectedProperty = null;
    this.selectedUnit = null;
    this.selectedRoom = null;
    this.selectedAgent = null;
    this.occupants = [];
    this.createdAt = new Date().toISOString().substring(0, 10);
  }

  onTenantChange(tenantId: number) {
    this.selectedTenantObj = this.tenantsList.find(t => t.id === tenantId) || null;
  }

  onPropertyChange(propertyCode: string) {
    this.selectedPropertyObj = this.propertiesList.find(p => p.code === propertyCode) || null;
    this.selectedUnit = null;
    this.selectedUnitObj = null;
    this.selectedRoom = null;
    this.roomsList = [];

    if (propertyCode === 'PROP-MH') {
      this.unitsList = [
        { code: 'U-205', name: 'Apartment 205-PR-4' },
        { code: 'U-206', name: 'Apartment 206-PR-4' },
        { code: 'U-301', name: 'Apartment 301-PR-5' }
      ];
    } else {
      this.unitsList = [
        { code: 'U-101', name: 'Office 101' },
        { code: 'U-102', name: 'Office 102' }
      ];
    }
  }

  onUnitChange(unitCode: string) {
    this.selectedUnitObj = this.unitsList.find(u => u.code === unitCode) || null;
    this.selectedRoom = null;

    if (unitCode === 'U-205') {
      this.roomsList = [
        { code: 'R-BED1', name: 'Master Bedroom' },
        { code: 'R-BED2', name: 'Second Bedroom' },
        { code: 'R-LIV', name: 'Living Room' }
      ];
    } else {
      this.roomsList = [
        { code: 'R-OFF1', name: 'Conference Room' },
        { code: 'R-OFF2', name: 'Main Hall' }
      ];
    }
  }

  calculateRentDetails() {
    this.annualRent = this.rentAmount;
    this.monthlyRent = Number((this.rentAmount / 12).toFixed(2));
  }

  openOccupantsModal() {
    this.occupantName = '';
    this.occupantPhone = '';
    this.occupantEmail = '';
    this.editingOccupantIndex = null;
    this.showOccupantsModal = true;
  }

  closeOccupantsModal() {
    this.showOccupantsModal = false;
  }

  addOccupant() {
    if (!this.occupantName.trim()) {
      this.toastr.warning('Please enter an occupant name');
      return;
    }

    const occupant: Occupant = {
      name: this.occupantName,
      phone: this.occupantPhone,
      email: this.occupantEmail
    };

    if (this.editingOccupantIndex !== null) {
      this.occupants[this.editingOccupantIndex] = occupant;
      this.toastr.success('Occupant updated successfully');
    } else {
      this.occupants.push(occupant);
      this.toastr.success('Occupant added successfully');
    }
    
    this.closeOccupantsModal();
  }

  editOccupant(index: number) {
    const occupant = this.occupants[index];
    this.occupantName = occupant.name;
    this.occupantPhone = occupant.phone;
    this.occupantEmail = occupant.email;
    this.editingOccupantIndex = index;
    this.showOccupantsModal = true;
  }

  removeOccupant(index: number) {
    this.occupants.splice(index, 1);
    this.toastr.info('Occupant removed');
  }

  saveLease() {
    if (!this.selectedTenant || !this.selectedProperty || !this.selectedUnit) {
      this.toastr.error('Please complete all required fields (Tenant, Property, Unit)');
      return;
    }
    this.toastr.success('Lease agreement registered successfully');
    this.router.navigate(['/leases']);
  }

  goBack() {
    this.router.navigate(['/leases']);
  }
}
