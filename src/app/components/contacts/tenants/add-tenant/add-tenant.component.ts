import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouterModule } from '@angular/router';
import { FlatpickrModule } from 'angularx-flatpickr';

@Component({
  selector: 'app-add-tenant',
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
  templateUrl: './add-tenant.component.html',
  styleUrl: './add-tenant.component.scss'
})
export class AddTenantComponent {
  branches = ['Main Branch', 'Branch A'];
  buildings = ['Building 1', 'Building 2'];
  honorifics = ['Mr.', 'Mrs.', 'Ms.', 'Dr.'];
  genders = ['Male', 'Female', 'Other'];
  statuses = ['Active', 'Inactive', 'Pending'];
  nationalities = ['United Arab Emirates', 'United States', 'United Kingdom', 'India'];
  countries = ['United Arab Emirates', 'United States', 'United Kingdom', 'India'];
  cities = ['Dubai', 'Abu Dhabi', 'Sharjah'];
  states = ['Dubai', 'Abu Dhabi', 'Sharjah'];
  daysOfMonth = Array.from({length: 31}, (_, i) => i + 1);

  // Form State
  autoSchedule = false;
  displayAsCompany = false;
  autoSignLeases = false;
  disableListing = false;

  constructor() {}

  saveTenant() {
    console.log('Save tenant clicked');
  }
}
