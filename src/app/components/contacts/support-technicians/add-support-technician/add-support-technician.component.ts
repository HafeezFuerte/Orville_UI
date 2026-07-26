import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FlatpickrModule } from 'angularx-flatpickr';
import { ToastrService } from 'ngx-toastr';

import { PortfolioService } from '../../../portfolio/services/portfolio.service';
import { PropertiesService } from '../../../portfolio/services/properties.service';

@Component({
  selector: 'app-add-support-technician',
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
  templateUrl: './add-support-technician.component.html',
  styleUrl: './add-support-technician.component.scss'
})
export class AddSupportTechnicianComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private portfolioService = inject(PortfolioService);
  private propertiesService = inject(PropertiesService);

  isEditMode = false;
  technicianId: any = null;

  branches = ['Main Branch', 'Branch A'];
  buildings = ['Building 1', 'Building 2'];
  honorifics = ['Mr.', 'Mrs.', 'Ms.', 'Dr.'];
  genders = ['Male', 'Female', 'Other'];
  nationalities = ['United Arab Emirates', 'United States', 'United Kingdom', 'India'];
  countries: any[] = [];
  cities: any[] = [];
  states: any[] = [];
  technicianTypes: any[] = [];
  categories: any[] = [];
  docTypes = ['Trade License', 'Emirates ID', 'Passport'];

  // Form State
  displayAsCompany = false;
  assignment = false;
  qualifies = false;
  
  // Modal State
  isAddDocModalOpen = false;

  technicianData = {
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
    technician_type: null as string | null,
    category: null as string | null
  };

  selectedCountry: any = null;

  constructor() {}

  ngOnInit() {
    this.loadCountries();
    this.loadLookup(1001, 'states', 'state_name');
    this.loadLookup(1002, 'cities', 'city_name');
    this.loadLookup(15, 'technicianTypes', 'lookup_name');
    this.loadLookup(30, 'categories', 'lookup_name'); // Maintenance Category
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.technicianId = id;
        this.loadTechnicianDetails(id);
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
          const lookup = this.technicianData.country_id || 'United Arab Emirates';
          this.selectedCountry = this.countries.find(c => c.id === Number(lookup) || c.name === String(lookup)) || null;
        }
      },
      error: (err) => {
        console.error('Error fetching countries:', err);
      }
    });
  }

  loadTechnicianDetails(id: string) {
    this.portfolioService.getMasterByType({
      typeId: 33,
      filterId: 0,
      filterText: id,
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        let tech = null;
        if (res.statusCode == 200 && res.objResult) {
          if (res.objResult.table && res.objResult.table[0]) {
            tech = res.objResult.table[0];
          } else {
            const arrayKey = Object.keys(res.objResult).find(key => Array.isArray(res.objResult[key]) && res.objResult[key].length > 0);
            if (arrayKey) {
              tech = res.objResult[arrayKey][0];
            }
          }
        }

        if (tech) {
          this.technicianData = {
            email_address: tech.email_address || '',
            username: tech.username || '',
            honorific: tech.honorific || null,
            first_name: tech.first_name || tech.technician_name?.split(' ')[0] || '',
            last_name: tech.last_name || tech.technician_name?.split(' ')[1] || '',
            middle_name: tech.middle_name || '',
            mobile_no: tech.phone_number || tech.mobile_no || '',
            gender: tech.gender || null,
            address1: tech.address1 || '',
            address2: tech.address2 || '',
            nationality: tech.nationality || null,
            country_id: tech.country_id || null,
            stateid: tech.stateid || null,
            city: tech.city || null,
            zipcode: tech.zipcode || '',
            notes: tech.notes || '',
            company_name: tech.company_name || '',
            tax_registration_no: tech.tax_registration_no || '',
            trade_license: tech.trade_license || '',
            technician_type: tech.technician_type || null,
            category: tech.category || null
          };
          this.displayAsCompany = tech.display_as_company || false;
          this.assignment = tech.auto_assign_assignment || false;
          this.qualifies = tech.allow_create_work_order || false;

          const lookup = this.technicianData.country_id || 'United Arab Emirates';
          this.selectedCountry = this.countries.find(c => c.id === Number(lookup) || c.name === String(lookup)) || null;
        }
      },
      error: (err) => {
        console.error('Error loading technician details:', err);
      }
    });
  }

  saveTechnician() {
    if (!this.technicianData.first_name || !this.technicianData.last_name || !this.technicianData.email_address) {
      this.toastr.warning('Please fill in all required fields (First Name, Last Name, Email).', 'Missing Info');
      return;
    }

    const requestJson = {
      userid: Number(localStorage.getItem('userId')) || 1,
      company_id: Number(localStorage.getItem('companyId')) || 1,
      clientId: localStorage.getItem('clientId') || '74BB6922',
      source: 'web',
      languageid: 1,
      email_address: this.technicianData.email_address,
      code: this.isEditMode ? this.technicianId : '',
      username: this.technicianData.username || '',
      profileImage_path: '',
      password: '', // default empty
      first_name: this.technicianData.first_name,
      last_name: this.technicianData.last_name,
      mobile_no: this.technicianData.mobile_no || '',
      country_id: Number(this.selectedCountry?.id) || 0,
      role_id: 0, // default
      department: this.technicianData.technician_type || '',
      display_all_tenants: false,
      technician_actions: this.technicianData.category || '',
      spoken_languages: '',
      time_zone: ''
    };

    const formData = new FormData();
    formData.append('reqObject', JSON.stringify(requestJson));

    this.propertiesService.saveTechnician(formData).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 || res.statusCode == "200") {
          this.toastr.success(this.isEditMode ? 'Support technician updated successfully!' : 'Support technician saved successfully!', 'Success');
          this.router.navigate(['/contacts/support-technicians']);
        } else {
          this.toastr.error(res.message || 'Failed to save technician.', 'Error');
        }
      },
      error: (err: any) => {
        console.error('Error saving technician:', err);
        this.toastr.error('Server error encountered while saving.', 'Error');
      }
    });
  }

  toggleDocModal(state: boolean) {
    this.isAddDocModalOpen = state;
  }
}
