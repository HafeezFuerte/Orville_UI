import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FlatpickrModule } from 'angularx-flatpickr';
import { PropertiesService } from '../../../portfolio/services/properties.service';
import { PortfolioService } from '../../../portfolio/services/portfolio.service';
import { ToastrService } from 'ngx-toastr';

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
export class AddTenantComponent implements OnInit {
  private propertiesService = inject(PropertiesService);
  private portfolioService = inject(PortfolioService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private route = inject(ActivatedRoute);

  isEditMode = false;
  tenantId: any = null;

  branches = ['Main Branch', 'Branch A'];
  buildings = ['Building 1', 'Building 2'];
  honorifics = ['Mr.', 'Mrs.', 'Ms.', 'Dr.'];
  genders = ['Male', 'Female', 'Other'];
  statuses = ['Active', 'Inactive', 'Pending'];
  nationalities = ['United Arab Emirates', 'United States', 'United Kingdom', 'India'];
  countries: any[] = [];
  cities: any[] = [];
  states: any[] = [];
  daysOfMonth = Array.from({length: 31}, (_, i) => i + 1);

  selectedCountry: any = null;
  selectedNationality: any = null;

  // Form State
  autoSchedule = false;
  displayAsCompany = false;
  autoSignLeases = false;
  disableListing = false;

  tenantData = {
    email_address: '',
    code: '',
    username: '',
    honorific: null as string | null,
    first_name: '',
    last_name: '',
    middle_name: '',
    mobile_no: '',
    gender: null as string | null,
    dob: '',
    status: 'Active',
    address1: '',
    address2: '',
    nationality: null as string | null,
    country_id: null as string | null,
    stateid: null as string | null,
    city: null as string | null,
    zipcode: '',
    addionalphone1: '',
    addionalphone2: '',
    landline_no: '',
    name_on_lease: '',
    email_on_lease: '',
    phone_on_lease: '',
    notes: '',
    schedule_day: 1,
    company_name: '',
    tax_registration_no: '',
    trade_license: '',
    fax_no: ''
  };

  // Uploaded Files
  profileImage: File | null = null;
  profilePreviewUrl: string | null = null;
  signatureImage: File | null = null;
  signaturePreviewUrl: string | null = null;

  onProfileImageSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.profileImage = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.profilePreviewUrl = reader.result as string;
      };
      if (this.profileImage) {
        reader.readAsDataURL(this.profileImage);
      }
    }
  }

  onSignatureSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.signatureImage = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.signaturePreviewUrl = reader.result as string;
      };
      if (this.signatureImage) {
        reader.readAsDataURL(this.signatureImage);
      }
    }
  }

  ngOnInit() {
    this.loadCountries();
    this.loadLookup(1001, 'states', 'state_name');
    this.loadLookup(1002, 'cities', 'city_name');
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.tenantId = id;
        this.loadTenantDetails(id);
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
          const lookup = this.tenantData.country_id || 'United Arab Emirates';
          this.selectedCountry = this.countries.find(c => c.id === Number(lookup) || c.name === String(lookup)) || null;

          const natLookup = this.tenantData.nationality || 'United Arab Emirates';
          this.selectedNationality = this.countries.find(c => c.id === Number(natLookup) || c.name === String(natLookup)) || null;
        }
      },
      error: (err) => {
        console.error('Error fetching countries:', err);
      }
    });
  }

  loadTenantDetails(id: string) {
    this.portfolioService.getMasterByType({
      typeId: 27,
      filterId: 0,
      filterText: id,
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        console.log("Tenant Details API Response:", res);
        let tenant = null;
        if (res.statusCode == 200 && res.objResult) {
          if (res.objResult.table && res.objResult.table[0]) {
            tenant = res.objResult.table[0];
          } else if (res.objResult.tenant_dtls && res.objResult.tenant_dtls[0]) {
            tenant = res.objResult.tenant_dtls[0];
          } else {
            const arrayKey = Object.keys(res.objResult).find(key => Array.isArray(res.objResult[key]) && res.objResult[key].length > 0);
            if (arrayKey) {
              tenant = res.objResult[arrayKey][0];
            }
          }
        }

        if (tenant) {
          this.tenantData = {
            email_address: tenant.email_address || '',
            code: tenant.code || '',
            username: tenant.username || '',
            honorific: tenant.honorific || null,
            first_name: tenant.first_name || tenant.tenant?.split(' ')[0] || '',
            last_name: tenant.last_name || tenant.tenant?.split(' ')[1] || '',
            middle_name: tenant.middle_name || '',
            mobile_no: tenant.mobile_no || tenant.phone_number || '',
            gender: tenant.gender || null,
            dob: tenant.dob || '',
            status: tenant.status || (tenant.is_active ? 'Active' : 'Inactive'),
            address1: tenant.address1 || '',
            address2: tenant.address2 || '',
            nationality: tenant.nationality || null,
            country_id: tenant.country_id || null,
            stateid: tenant.stateid || null,
            city: tenant.city || null,
            zipcode: tenant.zipcode || '',
            addionalphone1: tenant.addionalphone1 || '',
            addionalphone2: tenant.addionalphone2 || '',
            landline_no: tenant.landline_no || '',
            name_on_lease: tenant.name_on_lease || '',
            email_on_lease: tenant.email_on_lease || '',
            phone_on_lease: tenant.phone_on_lease || '',
            notes: tenant.notes || '',
            schedule_day: tenant.schedule_day || 1,
            company_name: tenant.company_name || '',
            tax_registration_no: tenant.tax_registration_no || '',
            trade_license: tenant.trade_license || '',
            fax_no: tenant.fax_no || ''
          };
          this.autoSchedule = tenant.is_auto_schedule || false;
          this.displayAsCompany = tenant.display_as_company || false;
          this.autoSignLeases = tenant.is_auto_sign_leases || false;
          this.disableListing = tenant.disabled_property_listing || false;
        }

        const lookup = this.tenantData.country_id || 'United Arab Emirates';
        this.selectedCountry = this.countries.find(c => c.id === Number(lookup) || c.name === String(lookup)) || null;

        const natLookup = this.tenantData.nationality || 'United Arab Emirates';
        this.selectedNationality = this.countries.find(c => c.id === Number(natLookup) || c.name === String(natLookup)) || null;
      },
      error: (err) => {
        console.error('Error loading tenant details:', err);
      }
    });
  }

  getFormattedDate(dateVal: any): string {
    if (!dateVal) {
      return '1900-01-01T00:00:00';
    }
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) {
        return '1900-01-01T00:00:00';
      }
      return d.toISOString();
    } catch (e) {
      return '1900-01-01T00:00:00';
    }
  }

  saveTenant() {
    if (!this.tenantData.first_name || !this.tenantData.last_name || !this.tenantData.email_address) {
      this.toastr.warning('Please fill in all required fields (First Name, Last Name, Email).', 'Missing Info');
      return;
    }

    const requestJson = {
      userid: Number(localStorage.getItem('userId')) || 1,
      company_id: Number(localStorage.getItem('companyId')) || 1,
      clientId: localStorage.getItem('clientId') || '74BB6922',
      source: 'web',
      languageid: 1,
      email_address: this.tenantData.email_address,
      code: this.isEditMode ? this.tenantId : (this.tenantData.code || ''),
      id: this.isEditMode ? Number(this.tenantId) : 0,
      username: this.tenantData.username || '',
      profileImage_path: '',
      honorific: this.tenantData.honorific || '',
      first_name: this.tenantData.first_name,
      last_name: this.tenantData.last_name,
      middle_name: this.tenantData.middle_name || '',
      mobile_no: this.tenantData.mobile_no || '',
      gender: this.tenantData.gender || '',
      dob: this.getFormattedDate(this.tenantData.dob),
      status: this.tenantData.status || 'Active',
      address1: this.tenantData.address1 || '',
      address2: this.tenantData.address2 || '',
      nationality: Number(this.selectedNationality?.id) || 0,
      country_id: Number(this.selectedCountry?.id) || 0,
      stateid: Number(this.tenantData.stateid) || 0,
      city: Number(this.tenantData.city) || 0,
      zipcode: this.tenantData.zipcode || '',
      addionalphone1: this.tenantData.addionalphone1 || '',
      addionalphone2: this.tenantData.addionalphone2 || '',
      landline_no: this.tenantData.landline_no || '',
      name_on_lease: this.tenantData.name_on_lease || '',
      email_on_lease: this.tenantData.email_on_lease || '',
      phone_on_lease: this.tenantData.phone_on_lease || '',
      notes: this.tenantData.notes || '',
      is_auto_schedule: this.autoSchedule,
      schedule_day: Number(this.tenantData.schedule_day) || 1,
      signature_path: '',
      is_auto_sign_leases: this.autoSignLeases,
      disabled_property_listing: this.disableListing,
      company_name: this.tenantData.company_name || '',
      tax_registration_no: this.tenantData.tax_registration_no || '',
      trade_license: this.tenantData.trade_license || '',
      display_as_company: this.displayAsCompany,
      fax_no: this.tenantData.fax_no || ''
    };

    const formData = new FormData();
    formData.append('reqObject', JSON.stringify(requestJson));

    // Files
    if (this.profileImage) {
      formData.append('profileImage_path', this.profileImage, this.profileImage.name);
    }
    if (this.signatureImage) {
      formData.append('signature_path', this.signatureImage, this.signatureImage.name);
    }

    this.propertiesService.saveTenant(formData).subscribe({
      next: (res: any) => {
        if (res.statusCode === "200" || res.status === 200 || res.message === 'Success') {
          this.toastr.success(this.isEditMode ? 'Tenant updated successfully!' : 'Tenant saved successfully!', 'Success');
          this.router.navigate(['/contacts/tenants']);
        } else {
          this.toastr.error(res.message || 'Failed to save tenant.', 'Error');
        }
      },
      error: (err: any) => {
        console.error('Failed to save tenant:', err);
        this.toastr.error('An error occurred while saving the tenant.', 'Error');
      }
    });
  }
}
