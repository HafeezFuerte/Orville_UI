import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../../../services/common.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-company-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule
  ],
  templateUrl: './company-details.component.html',
  styleUrls: []
})
export class CompanyDetailsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  private http = inject(HttpClient);
  private commonService = inject(CommonService);

  companyDetailsForm!: FormGroup;

  // Dropdown lists
  countries: any[] = [];
  states: any[] = [];
  cities: any[] = [];
  companyCode: string = 'B96AKY4';

  ngOnInit(): void {
    this.initForm();
    this.fetchCountries();
  }

  initForm(): void {
    this.companyDetailsForm = this.fb.group({
      // General Information
      name: ['Orville Real Estate LLC', [Validators.required]],
      email: ['rental@orvillerealestate.com', [Validators.required, Validators.email]],
      description: [''],

      // Address
      companyPhone: ['043333983', [Validators.required]],
      addressLine1: ['Al Muraqqabat, Buhaileba Plaza', [Validators.required]],
      addressLine2: [''],
      city: [null, [Validators.required]],
      country: [null, [Validators.required]],
      state: [null, [Validators.required]],

      // Other settings
      vatNumber: [''],
      invoicePrefix: ['INV', [Validators.required]],
      commercialLicenseNo: [''],
      poBox: [''],
      publicWebsiteUrl: [''],
      permitNumber: [''],
      precision: [2, [Validators.required, Validators.min(0)]],
      bookingBlockPeriod: [2, [Validators.required, Validators.min(0)]],

      // Checkboxes
      allowAttachExpiredDocs: [false],
      allowDuplicateInvoices: [false],
      allowMultipleDailyBookings: [false],
      displayLandlordInfo: [false],
      enableArchivingNoBalanceEffect: [false],
      createTicketUnrecognizedEmail: [false]
    });
  }

  // Base payload builder for dynamic dropdowns
  private getBasePayload(filterId: number, filterText: string = ''): any {
    const user = this.commonService.getCurrentUser();
    return {
      typeId: 2,
      filterId: filterId,
      filterText: filterText,
      filterText1: '',
      userId: user?.userId || 1,
      clientId: user?.clientId || '74BB6922',
      companyId: user?.companyId || 1
    };
  }

  // API Call to fetch countries
  fetchCountries(): void {
    const url = environment.apiurl + 'api/Masters/_getMasters';
    const payload = this.getBasePayload(1000, '');
    
    this.http.post<any>(url, payload, { headers: this.commonService.updateHeaders() }).subscribe({
      next: (res) => {
        if (res && res.statusCode === '200' && res.objResult && res.objResult.table) {
          this.countries = res.objResult.table;
          console.log('Countries loaded:', this.countries);
          this.fetchCompanyDetails();
        }
      },
      error: (err) => {
        this.toastr.error('Failed to load countries list', 'Error');
        console.error(err);
      }
    });
  }

  // API Call to fetch company details
  fetchCompanyDetails(): void {
    const url = environment.apiurl + 'api/Masters/_getMasters';
    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: 46,
      filterId: 0,
      filterText: 'B96AKY4',
      filterText1: '',
      userId: user?.userId || 1,
      clientId: user?.clientId || '74BB6922',
      companyId: user?.companyId || 1
    };
    console.log('fetchCompanyDetails sending payload:', payload);

    this.http.post<any>(url, payload, { headers: this.commonService.updateHeaders() }).subscribe({
      next: (res) => {
        console.log('Raw company details response:', res);
        if (res && res.statusCode === '200' && res.objResult && res.objResult.table && res.objResult.table.length > 0) {
          const data = res.objResult.table[0];
          console.log('Company settings loaded:', data);
          this.companyCode = data.code || 'B96AKY4';
          
          this.companyDetailsForm.patchValue({
            name: data.name,
            email: data.email_address,
            description: data.description,
            companyPhone: data.phone_no,
            addressLine1: data.address1,
            addressLine2: data.address2,
            country: data.country_id,
            state: data.state_id,
            city: data.city_id,
            vatNumber: data.vat,
            invoicePrefix: data.invoice_prefix,
            commercialLicenseNo: data.commercial_license_no,
            poBox: data.po_box,
            publicWebsiteUrl: data.website_url,
            permitNumber: data.permit,
            precision: data.precision || 2,
            bookingBlockPeriod: data.booking_block_period || 2,
            allowAttachExpiredDocs: data.allow_to_attach_expired_docs || false,
            allowDuplicateInvoices: data.allow_duplicate_invoices || false,
            allowMultipleDailyBookings: data.allow_multiple_daily_bookings || false,
            displayLandlordInfo: data.display_landlord_info_at_invoice || false,
            enableArchivingNoBalanceEffect: data.enable_archiving || false,
            createTicketUnrecognizedEmail: data.create_tickets_from_unrecognized_email || false
          });

          console.log('Form values after patch:', this.companyDetailsForm.value);

          // Trigger state loading with country details
          if (data.country_id) {
            this.onCountryChange({ id: data.country_id }, false);
          }
        }
      },
      error: (err) => {
        this.toastr.error('Failed to load company details', 'Error');
        console.log('HTTP Error details in fetchCompanyDetails:', err);
      }
    });
  }

  // API Call to fetch states based on country
  onCountryChange(countryObj: any, clearDependent: boolean = true): void {
    console.log('onCountryChange called with:', countryObj, 'clearDependent:', clearDependent);
    if (!countryObj) {
      this.states = [];
      this.cities = [];
      this.companyDetailsForm.patchValue({ country: null, state: null, city: null });
      return;
    }

    if (clearDependent) {
      this.companyDetailsForm.patchValue({ state: null, city: null });
      this.cities = [];
    }

    const url = environment.apiurl + 'api/Masters/_getMasters';
    const payload = this.getBasePayload(1001, String(countryObj.id));

    this.http.post<any>(url, payload, { headers: this.commonService.updateHeaders() }).subscribe({
      next: (res) => {
        if (res && res.statusCode === '200' && res.objResult && res.objResult.table) {
          this.states = res.objResult.table;
          console.log('States loaded:', this.states);
          const currentStateId = this.companyDetailsForm.get('state')?.value;
          if (currentStateId) {
            const match = this.states.find(s => s.id === currentStateId);
            console.log('Matching state found for patch:', match);
            if (match) {
              this.onStateChange(match, false);
            } else {
              // If not found in loaded list, still fetch cities with the ID
              this.onStateChange({ id: currentStateId }, false);
            }
          }
        } else {
          this.states = [];
          this.cities = [];
        }
      },
      error: (err) => {
        this.toastr.error('Failed to load states list', 'Error');
        console.error(err);
      }
    });
  }

  // API Call to fetch cities based on state
  onStateChange(stateObj: any, clearDependent: boolean = true): void {
    console.log('onStateChange called with:', stateObj, 'clearDependent:', clearDependent);
    if (!stateObj) {
      this.cities = [];
      this.companyDetailsForm.patchValue({ state: null, city: null });
      return;
    }

    if (clearDependent) {
      this.companyDetailsForm.patchValue({ city: null });
    }

    const url = environment.apiurl + 'api/Masters/_getMasters';
    const payload = this.getBasePayload(1002, String(stateObj.id));

    this.http.post<any>(url, payload, { headers: this.commonService.updateHeaders() }).subscribe({
      next: (res) => {
        if (res && res.statusCode === '200' && res.objResult && res.objResult.table) {
          this.cities = res.objResult.table;
          console.log('Cities loaded:', this.cities);
        } else {
          this.cities = [];
        }
      },
      error: (err) => {
        this.toastr.error('Failed to load cities list', 'Error');
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    if (this.companyDetailsForm.invalid) {
      this.companyDetailsForm.markAllAsTouched();
      this.toastr.error('Please fill in all required fields correctly.', 'Error');
      return;
    }
    
    const user = this.commonService.getCurrentUser();
    const formVal = this.companyDetailsForm.value;

    const cleanVal = (val: any) => {
      return (val === null || val === undefined) ? '' : val;
    };

    const payload = {
      userid: user?.userId || 1,
      company_id: user?.companyId || 1,
      clientId: user?.clientId || '74BB6922',
      source: 'web',
      languageid: 1,
      code: this.companyCode || 'B96AKY4',
      name: formVal.name,
      email_address: formVal.email,
      description: cleanVal(formVal.description),
      phone_no: formVal.companyPhone,
      address1: formVal.addressLine1,
      address2: cleanVal(formVal.addressLine2),
      country_id: formVal.country,
      state_id: formVal.state,
      city_id: formVal.city,
      vat: cleanVal(formVal.vatNumber),
      invoice_prefix: formVal.invoicePrefix,
      commercial_license_no: cleanVal(formVal.commercialLicenseNo),
      po_box: cleanVal(formVal.poBox),
      website_url: cleanVal(formVal.publicWebsiteUrl),
      permit: cleanVal(formVal.permitNumber),
      precision: formVal.precision,
      booking_block_period: formVal.bookingBlockPeriod,
      allow_to_attach_expired_docs: formVal.allowAttachExpiredDocs,
      allow_duplicate_invoices: formVal.allowDuplicateInvoices,
      allow_multiple_daily_bookings: formVal.allowMultipleDailyBookings,
      display_landlord_info_at_invoice: formVal.displayLandlordInfo,
      enable_archiving: formVal.enableArchivingNoBalanceEffect,
      create_tickets_from_unrecognized_email: formVal.createTicketUnrecognizedEmail
    };

    const url = environment.apiurl + 'api/Configuration/save_company_dtls';

    this.http.post<any>(url, payload, { headers: this.commonService.updateHeaders() }).subscribe({
      next: (res) => {
        if (res && res.statusCode === '200') {
          this.toastr.success('Company details saved successfully!', 'Success');
        } else {
          this.toastr.error(res.message || 'Failed to save company details', 'Error');
        }
      },
      error: (err) => {
        this.toastr.error('Failed to save company details', 'Error');
        console.error(err);
      }
    });
  }
}
