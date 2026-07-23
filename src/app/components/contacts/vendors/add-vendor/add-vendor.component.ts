import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouterModule } from '@angular/router';
import { FlatpickrModule } from 'angularx-flatpickr';

@Component({
  selector: 'app-add-vendor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgSelectModule,
    RouterModule,
    FlatpickrModule
  ],
  templateUrl: './add-vendor.component.html',
  styleUrl: './add-vendor.component.scss'
})
export class AddVendorComponent {
  branches = ['Main Branch', 'Branch A'];
  buildings = ['Building 1', 'Building 2'];
  honorifics = ['Mr.', 'Mrs.', 'Ms.', 'Dr.'];
  genders = ['Male', 'Female', 'Other'];
  nationalities = ['United Arab Emirates', 'United States', 'United Kingdom', 'India'];
  countries = ['United Arab Emirates', 'United States', 'United Kingdom', 'India'];
  cities = ['Dubai', 'Abu Dhabi', 'Sharjah'];
  states = ['Dubai', 'Abu Dhabi', 'Sharjah'];
  vendorTypes = ['Maintenance', 'Cleaning', 'Security', 'Other'];
  categories = ['AC Repair', 'Plumbing', 'Electrical', 'Carpentry'];
  docTypes = ['Trade License', 'Emirates ID', 'Passport'];

  // Form State
  displayAsCompany = false;
  assignment = false;
  qualifies = false;
  
  // Modal State
  isAddDocModalOpen = false;

  constructor() {}

  saveVendor() {
    console.log('Save vendor clicked');
  }

  toggleDocModal(state: boolean) {
    this.isAddDocModalOpen = state;
  }
}
