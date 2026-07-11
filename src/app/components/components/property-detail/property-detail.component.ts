import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, NgSelectModule, FormsModule],
  templateUrl: './property-detail.component.html',
  styleUrl: './property-detail.component.scss'
})
export class PropertyDetailComponent implements OnInit {
  propertyId!: number;
  property: any = null;
  activeTab: string = 'overview';
  showMoreDetails: boolean = false;

  tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'units', label: 'Units' },
    { key: 'rooms', label: 'Rooms' },
    { key: 'tenants', label: 'Tenants History' },
    { key: 'common', label: 'Common Area' },
    { key: 'broadcasts', label: 'Broadcasts' },
    { key: 'attachments', label: 'Attachments' }
  ];

  // Mock list for fallback loading
  mockProperties = [
    { id: 31658, name: 'Marina Heights Towers', type_name: 'Residential', occupied_units: 412, total_units: 421, landlord: 'Orville Real Estate' },
    { id: 31659, name: 'Jumeirah Living', type_name: 'Residential', occupied_units: 10, total_units: 12, landlord: 'Emaar Properties' },
    { id: 31660, name: 'Burj Khalifa Residences', type_name: 'Residential', occupied_units: 48, total_units: 50, landlord: 'Orville Real Estate' },
    { id: 31661, name: 'Index Tower', type_name: 'Commercial', occupied_units: 20, total_units: 25, landlord: 'DIFC Investments' },
    { id: 31662, name: 'Dubai Marina Mall', type_name: 'Commercial', occupied_units: 28, total_units: 30, landlord: 'Emaar Malls' }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.propertyId = +idParam;
        this.property = this.mockProperties.find(p => p.id === this.propertyId) || this.mockProperties[0];
      }
    });
  }

  toggleMoreDetails(): void {
    this.showMoreDetails = !this.showMoreDetails;
  }
}
