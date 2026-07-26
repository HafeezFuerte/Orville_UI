import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FlatpickrModule } from 'angularx-flatpickr';
import { ToastrService } from 'ngx-toastr';
import { PropertiesService } from '../../../portfolio/services/properties.service';
import { PortfolioService } from '../../../portfolio/services/portfolio.service';

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
export class AddLandlordComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private propertiesService = inject(PropertiesService);
  private portfolioService = inject(PortfolioService);

  isEditMode = false;
  landlordId: any = null;

  branches = ['Main Branch', 'Branch A'];
  buildings = ['Building 1', 'Building 2'];
  honorifics = ['Mr.', 'Mrs.', 'Ms.', 'Dr.'];
  genders = ['Male', 'Female', 'Other'];
  nationalities = ['United Arab Emirates', 'United States', 'United Kingdom', 'India'];
  countries: any[] = [];
  cities: any[] = [];
  states: any[] = [];
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

  selectedCountry: any = null;

  landlordData = {
    email_address: '',
    username: '',
    honorific: null as string | null,
    first_name: '',
    last_name: '',
    middle_name: '',
    mobile_no: '',
    gender: null as string | null,
    address1: '',
    address2: '',
    nationality: null as string | null,
    country_id: null as string | null,
    stateid: null as string | null,
    city: null as string | null,
    zipcode: '',
    notes: '',
    company_name: '',
    tax_registration_no: '',
    trade_license: ''
  };

  constructor() { }

  ngOnInit() {
    this.loadCountries();
    this.loadLookup(1001, 'states', 'state_name');
    this.loadLookup(1002, 'cities', 'city_name');
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.landlordId = id;
        this.loadLandlordDetails(id);
      }
    });
  }

  loadLookup(filterId: number, targetProperty: string, nameField: string) {
    this.portfolioService.getMasterByType({
      typeId: 2,
      filterId: filterId,
      filterText: '',
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult.table) {
          (this as any)[targetProperty] = res.objResult.table.map((item: any) => ({
            id: item.id,
            name: item[nameField] || item.lookup_name || item.name || ''
          }));
        }
      },
      error: (err) => {
        console.error(`Error fetching lookup ${filterId}:`, err);
      }
    });
  }

  selectedNationality: any = null;

  loadCountries() {
    this.portfolioService.getMasterByType({
      typeId: 2,
      filterId: 1000,
      filterText: '',
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult.table) {
          this.countries = res.objResult.table.map((c: any) => ({
            id: c.id,
            name: c.country_name
          }));
          const lookup = this.landlordData.country_id || 'United Arab Emirates';
          this.selectedCountry = this.countries.find(c => c.id === Number(lookup) || c.name === String(lookup)) || null;
          
          const natLookup = this.landlordData.nationality || 'United Arab Emirates';
          this.selectedNationality = this.countries.find(c => c.id === Number(natLookup) || c.name === String(natLookup)) || null;
        }
      },
      error: (err) => {
        console.error('Error fetching countries:', err);
      }
    });
  }

  loadLandlordDetails(id: string) {
    this.portfolioService.getMasterByType({
      typeId: 28,
      filterId: 0,
      filterText: id,
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        let landlord = null;
        if (res.statusCode == 200 && res.objResult) {
          if (res.objResult.table && res.objResult.table[0]) {
            landlord = res.objResult.table[0];
          } else {
            const arrayKey = Object.keys(res.objResult).find(key => Array.isArray(res.objResult[key]) && res.objResult[key].length > 0);
            if (arrayKey) {
              landlord = res.objResult[arrayKey][0];
            }
          }
        }

        if (landlord) {
          this.landlordData = {
            email_address: landlord.email_address || '',
            username: landlord.username || '',
            honorific: landlord.honorific || null,
            first_name: landlord.first_name || landlord.landlord?.split(' ')[0] || '',
            last_name: landlord.last_name || landlord.landlord?.split(' ')[1] || '',
            middle_name: landlord.middle_name || '',
            mobile_no: landlord.phone_number || landlord.mobile_no || '',
            gender: landlord.gender || null,
            address1: landlord.address1 || '',
            address2: landlord.address2 || '',
            nationality: landlord.nationality || null,
            country_id: landlord.country_id || null,
            stateid: landlord.stateid || null,
            city: landlord.city || null,
            zipcode: landlord.zipcode || '',
            notes: landlord.notes || '',
            company_name: landlord.company_name || '',
            tax_registration_no: landlord.tax_registration_no || '',
            trade_license: landlord.trade_license || ''
          };
          this.displayAsCompany = landlord.display_as_company || false;
          this.autoSignLeases = landlord.is_auto_sign_leases || false;
          
          const lookup = this.landlordData.country_id || 'United Arab Emirates';
          this.selectedCountry = this.countries.find(c => c.id === Number(lookup) || c.name === String(lookup)) || null;

          const natLookup = this.landlordData.nationality || 'United Arab Emirates';
          this.selectedNationality = this.countries.find(c => c.id === Number(natLookup) || c.name === String(natLookup)) || null;
        }
      },
      error: (err) => {
        console.error('Error loading landlord details:', err);
      }
    });
  }

  saveLandlord() {
    const requestJson = {
      userid: Number(localStorage.getItem('userId')) || 1,
      company_id: Number(localStorage.getItem('companyId')) || 1,
      clientId: localStorage.getItem('clientId') || '74BB6922',
      source: 'web',
      languageid: 1,
      email_address: this.landlordData.email_address,
      code: this.isEditMode ? this.landlordId : '',
      username: this.landlordData.username || '',
      profileImage_path: '',
      honorific: this.landlordData.honorific || '',
      first_name: this.landlordData.first_name,
      last_name: this.landlordData.last_name,
      middle_name: this.landlordData.middle_name || '',
      mobile_no: this.landlordData.mobile_no || '',
      gender: this.landlordData.gender || '',
      dob: '1900-01-01T00:00:00',
      reference: '',
      tags: '',
      status: 'Active',
      address1: this.landlordData.address1 || '',
      address2: this.landlordData.address2 || '',
      nationality: Number(this.selectedNationality?.id) || 0,
      country_id: Number(this.selectedCountry?.id) || 0,
      stateid: Number(this.landlordData.stateid) || 0,
      city: Number(this.landlordData.city) || 0,
      name_on_contract: this.landlordData.first_name + ' ' + this.landlordData.last_name,
      email_on_contract: this.landlordData.email_address,
      phone_on_contract: this.landlordData.mobile_no,
      lessor_name: '',
      notes: this.landlordData.notes || '',
      signature_path: '',
      is_auto_sign_leases: this.autoSignLeases,
      company_name: this.landlordData.company_name || '',
      tax_registration_no: this.landlordData.tax_registration_no || '',
      display_as_company: this.displayAsCompany,
      negative_balances: this.transferAmount,
      security_deposit_leases: this.recordAmount,
      security_deposit_non_leases: this.landlordContribution,
      landlord_contribution: this.landlordContribution,
      send_push_notifications: this.sendPushNotifications,
      send_email_notifications: this.sendEmailNotifications,
      auto_hold_amount_in_wallet: this.autoBillWallet,
      emergencydtls: [],
      bankdtls: {
        bank_name: 'ENBD Bank',
        bank_address: 'Deira, Dubai',
        iban: 'ENB0351496556322',
        account_no: '125322878556984',
        sort_code: '66841',
        code_swift: '-'
      },
      invoiceInfo: {
        invoice_num_pre: '',
        invoice_series: '',
        receipt_num_pre: '',
        receipt_series: ''
      }
    };

    const formData = new FormData();
    formData.append('reqObject', JSON.stringify(requestJson));

    this.propertiesService.saveLandlord(formData).subscribe({
      next: (res: any) => {
        if (res.statusCode === "200" || res.status === 200 || res.message === 'Success') {
          this.toastr.success(this.isEditMode ? 'Landlord updated successfully!' : 'Landlord saved successfully!', 'Success');
          this.router.navigate(['/contacts/landlords']);
        } else {
          this.toastr.error(res.message || 'Failed to save landlord.', 'Error');
        }
      },
      error: (err: any) => {
        console.error('Failed to save landlord:', err);
        this.toastr.error('An error occurred while saving the landlord.', 'Error');
      }
    });
  }

  toggleDocModal(state: boolean) {
    this.isAddDocModalOpen = state;
  }
}
