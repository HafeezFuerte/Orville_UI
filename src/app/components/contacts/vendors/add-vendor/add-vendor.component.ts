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
export class AddVendorComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private propertiesService = inject(PropertiesService);
  private portfolioService = inject(PortfolioService);

  isEditMode = false;
  vendorId: any = null;

  branches = ['Main Branch', 'Branch A'];
  buildings = ['Building 1', 'Building 2'];
  honorifics = ['Mr.', 'Mrs.', 'Ms.', 'Dr.'];
  genders = ['Male', 'Female', 'Other'];
  nationalities = ['United Arab Emirates', 'United States', 'United Kingdom', 'India'];
  countries: any[] = [];
  cities: any[] = [];
  states: any[] = [];
  vendorTypes: any[] = [];
  categories: any[] = [];
  docTypes = ['Trade License', 'Emirates ID', 'Passport'];

  // Form State
  displayAsCompany = false;
  assignment = false;
  qualifies = false;
  
  // Modal State
  isAddDocModalOpen = false;

  selectedCountry: any = null;

  vendorData = {
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
    trade_license: '',
    vendor_type: null as string | null,
    category: null as string | null
  };

  constructor() {}

  ngOnInit() {
    this.loadCountries();
    this.loadLookup(1001, 'states', 'state_name');
    this.loadLookup(1002, 'cities', 'city_name');
    this.loadLookup(15, 'vendorTypes', 'lookup_name');
    this.loadLookup(16, 'categories', 'lookup_name');
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.vendorId = id;
        this.loadVendorDetails(id);
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
          const lookup = this.vendorData.country_id || 'United Arab Emirates';
          this.selectedCountry = this.countries.find(c => c.id === Number(lookup) || c.name === String(lookup)) || null;

          const natLookup = this.vendorData.nationality || 'United Arab Emirates';
          this.selectedNationality = this.countries.find(c => c.id === Number(natLookup) || c.name === String(natLookup)) || null;
        }
      },
      error: (err) => {
        console.error('Error fetching countries:', err);
      }
    });
  }

  loadVendorDetails(id: string) {
    this.portfolioService.getMasterByType({
      typeId: 29,
      filterId: 0,
      filterText: id,
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        let vendor = null;
        if (res.statusCode == 200 && res.objResult) {
          if (res.objResult.table && res.objResult.table[0]) {
            vendor = res.objResult.table[0];
          } else {
            const arrayKey = Object.keys(res.objResult).find(key => Array.isArray(res.objResult[key]) && res.objResult[key].length > 0);
            if (arrayKey) {
              vendor = res.objResult[arrayKey][0];
            }
          }
        }

        if (vendor) {
          this.vendorData = {
            email_address: vendor.email_address || '',
            username: vendor.username || '',
            honorific: vendor.honorific || null,
            first_name: vendor.first_name || vendor.contact_name?.split(' ')[0] || '',
            last_name: vendor.last_name || vendor.contact_name?.split(' ')[1] || '',
            middle_name: vendor.middle_name || '',
            mobile_no: vendor.phone_number || vendor.mobile_no || '',
            gender: vendor.gender || null,
            address1: vendor.address1 || '',
            address2: vendor.address2 || '',
            nationality: vendor.nationality || null,
            country_id: vendor.country_id || null,
            stateid: vendor.stateid || null,
            city: vendor.city || null,
            zipcode: vendor.zipcode || '',
            notes: vendor.notes || '',
            company_name: vendor.company_name || '',
            tax_registration_no: vendor.tax_registration_no || '',
            trade_license: vendor.trade_license || '',
            vendor_type: vendor.vendor_type || null,
            category: vendor.maintainance_categories || null
          };
          this.displayAsCompany = vendor.display_as_company || false;
          this.assignment = vendor.auto_assign_assignment || false;
          this.qualifies = vendor.allow_create_work_order || false;

          const lookup = this.vendorData.country_id || 'United Arab Emirates';
          this.selectedCountry = this.countries.find(c => c.id === Number(lookup) || c.name === String(lookup)) || null;

          const natLookup = this.vendorData.nationality || 'United Arab Emirates';
          this.selectedNationality = this.countries.find(c => c.id === Number(natLookup) || c.name === String(natLookup)) || null;
        }
      },
      error: (err) => {
        console.error('Error loading vendor details:', err);
      }
    });
  }

  saveVendor() {
    const requestJson = {
      userid: Number(localStorage.getItem('userId')) || 1,
      company_id: Number(localStorage.getItem('companyId')) || 1,
      clientId: localStorage.getItem('clientId') || '74BB6922',
      source: 'web',
      languageid: 1,
      email_address: this.vendorData.email_address,
      code: this.isEditMode ? this.vendorId : '',
      username: this.vendorData.username || '',
      profileImage_path: '',
      honorific: this.vendorData.honorific || '',
      company_name: this.vendorData.company_name || '',
      contact_name: this.vendorData.first_name + ' ' + this.vendorData.last_name,
      mobile_no: this.vendorData.mobile_no || '',
      gender: this.vendorData.gender || '',
      dob: '1900-01-01T00:00:00',
      address1: this.vendorData.address1 || '',
      address2: this.vendorData.address2 || '',
      nationality: Number(this.selectedNationality?.id) || 0,
      country_id: Number(this.selectedCountry?.id) || 0,
      stateid: Number(this.vendorData.stateid) || 0,
      city: Number(this.vendorData.city) || 0,
      tax_registration_no: this.vendorData.tax_registration_no || '',
      notes: this.vendorData.notes || '',
      signature_path: '',
      display_as_company: this.displayAsCompany,
      vendor_type: Number(this.vendorData.vendor_type) || 0,
      auto_assign_assignment: this.assignment,
      allow_create_work_order: this.qualifies,
      allow_create_quotation: false,
      maintainance_categories: this.vendorData.category || ''
    };

    const formData = new FormData();
    formData.append('reqObject', JSON.stringify(requestJson));

    this.propertiesService.saveVendor(formData).subscribe({
      next: (res: any) => {
        if (res.statusCode === "200" || res.status === 200 || res.message === 'Success') {
          this.toastr.success(this.isEditMode ? 'Vendor updated successfully!' : 'Vendor saved successfully!', 'Success');
          this.router.navigate(['/contacts/vendors']);
        } else {
          this.toastr.error(res.message || 'Failed to save vendor.', 'Error');
        }
      },
      error: (err: any) => {
        console.error('Failed to save vendor:', err);
        this.toastr.error('An error occurred while saving the vendor.', 'Error');
      }
    });
  }

  toggleDocModal(state: boolean) {
    this.isAddDocModalOpen = state;
  }
}
