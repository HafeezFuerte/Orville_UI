import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouterModule } from '@angular/router';
import { FlatpickrModule } from 'angularx-flatpickr';

@Component({
  selector: 'app-add-landlord',
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
  templateUrl: './add-landlord.component.html',
  styleUrl: './add-landlord.component.scss'
})
export class AddLandlordComponent {
  branches = ['Main Branch', 'Branch A'];
  buildings = ['Building 1', 'Building 2'];
  honorifics = ['Mr.', 'Mrs.', 'Ms.', 'Dr.'];
  genders = ['Male', 'Female', 'Other'];
  nationalities = ['United Arab Emirates', 'United States', 'United Kingdom', 'India'];
  countries = ['United Arab Emirates', 'United States', 'United Kingdom', 'India'];
  cities = ['Dubai', 'Abu Dhabi', 'Sharjah'];
  states = ['Dubai', 'Abu Dhabi', 'Sharjah'];
  docTypes = ['Passport', 'Trade License', 'Visa'];

  // Form State
  displayAsCompany = false;
  autoSignLeases = false;
  
  // Settings
  transferAmount = false;
  recordAmount = false;
  landlordContribution = false;

  // Notification Settings
  sendPushNotifications = false;
  sendEmailNotifications = false;
  autoBillWallet = false;

  // Modal State
  isAddDocModalOpen = false;

  constructor() {}

  saveLandlord() {
    console.log('Save landlord clicked');
  }

  toggleDocModal(state: boolean) {
    this.isAddDocModalOpen = state;
  }
}
