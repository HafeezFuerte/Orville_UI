import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

export interface Unit {
  id: number;
  name: string;
  category: 'Residential' | 'Commercial';
  beds: string;
  baths: string;
  area: string;
  floor: string;
  property: string;
  location: string;
  landlord: string;
  tags: string;
  unitType: string;
  managementFee: string;
  status: 'Occupied' | 'Vacant' | 'Maintenance';
  addedDate: string;
  imageUrl: string;
  rentStatus: 'For Rent' | 'For Sale';
}

@Component({
  selector: 'app-unit-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, NgSelectModule, FormsModule],
  templateUrl: './unit-detail.component.html',
  styleUrl: './unit-detail.component.scss'
})
export class UnitDetailComponent implements OnInit {
  unitId!: number;
  unit: Unit | null = null;
  activeTab: string = 'overview';
  showMoreDetails: boolean = false;

  // Mock lease records for active unit overview
  leases = [
    { id: 31658, name: 'Lease - 31658- Marina Heights Towers', tenant: 'James T. Hirai', legalCase: 'No' },
    { id: 31658, name: 'Lease - 31658- Marina Heights Towers', tenant: 'My Myo Thant', legalCase: 'No' }
  ];

  tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'financials', label: 'Financials' },
    { key: 'inventory', label: 'Inventory' },
    { key: 'workorders', label: 'Work Orders' },
    { key: 'attachments', label: 'Attachments' },
    { key: 'legal', label: 'Legal' },
    { key: 'parkings', label: 'Parkings' },
    { key: 'notes', label: 'Notes' },
    { key: 'broadcasts', label: 'Broadcasts' },
    { key: 'inspections', label: 'Inspections' }
  ];

  // Mock Units Data (same as in units-list)
  allUnits: Unit[] = [
    {
      id: 31658,
      name: 'Apartment 209',
      category: 'Residential',
      beds: '1 Bed',
      baths: '2 Bath',
      area: '1523 Sqft',
      floor: '1 Floor',
      property: 'Marina Height Towers',
      location: 'Dubai Marina, Tower A, Dubai',
      landlord: 'Orville Real Estate',
      tags: 'Premium',
      unitType: 'Apartment',
      managementFee: 'AED 600',
      status: 'Occupied',
      addedDate: 'May 26, 2026',
      imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=60',
      rentStatus: 'For Rent'
    },
    {
      id: 31659,
      name: 'Apartment 304',
      category: 'Residential',
      beds: '2 Bed',
      baths: '2 Bath',
      area: '1850 Sqft',
      floor: '3 Floor',
      property: 'Marina Height Towers',
      location: 'Dubai Marina, Tower A, Dubai',
      landlord: 'Orville Real Estate',
      tags: 'Best Seller',
      unitType: 'Apartment',
      managementFee: 'AED 750',
      status: 'Vacant',
      addedDate: 'May 28, 2026',
      imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=60',
      rentStatus: 'For Rent'
    },
    {
      id: 31660,
      name: 'Studio 105',
      category: 'Residential',
      beds: 'Studio',
      baths: '1 Bath',
      area: '850 Sqft',
      floor: '1 Floor',
      property: 'Jumeirah Living',
      location: 'JBR, Gate 2, Dubai',
      landlord: 'Emaar Properties',
      tags: 'Compact',
      unitType: 'Studio',
      managementFee: 'AED 400',
      status: 'Occupied',
      addedDate: 'June 01, 2026',
      imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&auto=format&fit=crop&q=60',
      rentStatus: 'For Rent'
    },
    {
      id: 31661,
      name: 'Penthouse 501',
      category: 'Residential',
      beds: '4 Bed',
      baths: '5 Bath',
      area: '4200 Sqft',
      floor: '50 Floor',
      property: 'Burj Khalifa Residences',
      location: 'Downtown Dubai, Dubai',
      landlord: 'Orville Real Estate',
      tags: 'Luxury',
      unitType: 'Penthouse',
      managementFee: 'AED 2500',
      status: 'Maintenance',
      addedDate: 'April 15, 2026',
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=60',
      rentStatus: 'For Sale'
    },
    {
      id: 31662,
      name: 'Office Suite 12B',
      category: 'Commercial',
      beds: 'N/A',
      baths: '2 Bath',
      area: '3100 Sqft',
      floor: '12 Floor',
      property: 'Index Tower',
      location: 'DIFC, Office Block C, Dubai',
      landlord: 'DIFC Investments',
      tags: 'Corporate',
      unitType: 'Office',
      managementFee: 'AED 1500',
      status: 'Occupied',
      addedDate: 'Jan 10, 2026',
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=60',
      rentStatus: 'For Rent'
    },
    {
      id: 31663,
      name: 'Retail Lot G-04',
      category: 'Commercial',
      beds: 'N/A',
      baths: '1 Bath',
      area: '1200 Sqft',
      floor: 'Ground',
      property: 'Dubai Marina Mall',
      location: 'Dubai Marina, Ground Floor, Dubai',
      landlord: 'Emaar Malls',
      tags: 'Prime Location',
      unitType: 'Retail',
      managementFee: 'AED 1100',
      status: 'Vacant',
      addedDate: 'March 20, 2026',
      imageUrl: 'https://images.unsplash.com/photo-1555529669-e69e7aa0db9a?w=600&auto=format&fit=crop&q=60',
      rentStatus: 'For Rent'
    }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.unitId = +idParam;
        this.unit = this.allUnits.find(u => u.id === this.unitId) || this.allUnits[0];
      }
    });
  }

  get unitNo(): string {
    if (this.unit && this.unit.name) {
      const parts = this.unit.name.split(' ');
      return parts[1] || '209';
    }
    return '209';
  }

  toggleMoreDetails(): void {
    this.showMoreDetails = !this.showMoreDetails;
  }
}
