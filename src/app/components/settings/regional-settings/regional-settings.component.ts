import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../../../services/common.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-regional-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule
  ],
  templateUrl: './regional-settings.component.html',
  styleUrls: []
})
export class RegionalSettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  private http = inject(HttpClient);
  private commonService = inject(CommonService);

  regionalSettingsForm!: FormGroup;
  companyData: any = null; // Store entire company details row to preserve other columns on save

  // Dropdown lists
  timezones = [
    { id: 'Abu Dhabi (UTC+4)', name: 'Abu Dhabi (UTC+4)' },
    { id: 'GMT (UTC+0)', name: 'GMT (UTC+0)' },
    { id: 'London (UTC+0)', name: 'London (UTC+0)' },
    { id: 'Paris (UTC+1)', name: 'Paris (UTC+1)' },
    { id: 'Cairo (UTC+2)', name: 'Cairo (UTC+2)' },
    { id: 'Moscow (UTC+3)', name: 'Moscow (UTC+3)' },
    { id: 'Dubai (UTC+4)', name: 'Dubai (UTC+4)' },
    { id: 'India (UTC+5:30)', name: 'India (UTC+5:30)' },
    { id: 'Singapore (UTC+8)', name: 'Singapore (UTC+8)' },
    { id: 'Tokyo (UTC+9)', name: 'Tokyo (UTC+9)' },
    { id: 'Sydney (UTC+10)', name: 'Sydney (UTC+10)' },
    { id: 'New York (UTC-5)', name: 'New York (UTC-5)' },
    { id: 'Los Angeles (UTC-8)', name: 'Los Angeles (UTC-8)' }
  ];

  currencies: any[] = [];
  unitSystems: any[] = [];
  paymentMethods: any[] = [];

  dateFormats = [
    { id: 'DD-MM-YYYY', name: 'DD-MM-YYYY (01-12-2022)' },
    { id: 'MM/DD/YYYY', name: 'MM/DD/YYYY (12/01/2022)' },
    { id: 'YYYY-MM-DD', name: 'YYYY-MM-DD (2022-12-01)' }
  ];

  ngOnInit(): void {
    this.initForm();
    this.fetchCurrencies();
    this.fetchUnitSystems();
    this.fetchPaymentMethods();
    this.fetchCompanyDetails();
  }

  initForm(): void {
    this.regionalSettingsForm = this.fb.group({
      timezone: [null, [Validators.required]],
      currency: [null, [Validators.required]],
      dateFormat: [null, [Validators.required]],
      unitSystem: [null, [Validators.required]],
      defaultPaymentMethod: [null, [Validators.required]]
    });
  }

  private getBasePayload(typeId: number, filterId: number, filterText: string = ''): any {
    const user = this.commonService.getCurrentUser();
    return {
      typeId: typeId,
      filterId: filterId,
      filterText: filterText,
      filterText1: '',
      userId: user?.userId || 1,
      clientId: user?.clientId || '74BB6922',
      companyId: user?.companyId || 1
    };
  }

  // Fetch Currencies (typeId: 47)
  fetchCurrencies(): void {
    const url = environment.apiurl + 'api/Masters/_getMasters';
    const payload = this.getBasePayload(47, 0);

    this.http.post<any>(url, payload, { headers: this.commonService.updateHeaders() }).subscribe({
      next: (res) => {
        if (res && res.statusCode === '200' && res.objResult && res.objResult.table) {
          this.currencies = res.objResult.table.map((c: any) => ({
            ...c,
            displayName: `${c.code} (${c.currency_name})`
          }));
        }
      },
      error: (err) => {
        console.error('Failed to fetch currencies:', err);
      }
    });
  }

  // Fetch Unit Systems (typeId: 2, filterId: 37)
  fetchUnitSystems(): void {
    const url = environment.apiurl + 'api/Masters/_getMasters';
    const payload = this.getBasePayload(2, 37);

    this.http.post<any>(url, payload, { headers: this.commonService.updateHeaders() }).subscribe({
      next: (res) => {
        if (res && res.statusCode === '200' && res.objResult && res.objResult.table) {
          this.unitSystems = res.objResult.table;
        }
      },
      error: (err) => {
        console.error('Failed to fetch unit systems:', err);
      }
    });
  }

  // Fetch Payment Methods (typeId: 2, filterId: 23)
  fetchPaymentMethods(): void {
    const url = environment.apiurl + 'api/Masters/_getMasters';
    const payload = this.getBasePayload(2, 23);

    this.http.post<any>(url, payload, { headers: this.commonService.updateHeaders() }).subscribe({
      next: (res) => {
        if (res && res.statusCode === '200' && res.objResult && res.objResult.table) {
          this.paymentMethods = res.objResult.table;
        }
      },
      error: (err) => {
        console.error('Failed to fetch payment methods:', err);
      }
    });
  }

  // Fetch Company Details to load current regional settings
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

    this.http.post<any>(url, payload, { headers: this.commonService.updateHeaders() }).subscribe({
      next: (res) => {
        if (res && res.statusCode === '200' && res.objResult && res.objResult.table && res.objResult.table.length > 0) {
          this.companyData = res.objResult.table[0];
          this.regionalSettingsForm.patchValue({
            timezone: this.companyData.time_zone,
            currency: this.companyData.currency_id,
            dateFormat: this.companyData.date_format,
            unitSystem: this.companyData.unit_system,
            defaultPaymentMethod: this.companyData.payment_type
          });
        }
      },
      error: (err) => {
        this.toastr.error('Failed to load regional settings', 'Error');
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    if (this.regionalSettingsForm.invalid) {
      this.toastr.error('Please specify all regional preferences.', 'Error');
      return;
    }

    const user = this.commonService.getCurrentUser();
    const formVal = this.regionalSettingsForm.value;

    const payload = {
      userid: user?.userId || 1,
      company_id: user?.companyId || 1,
      clientId: user?.clientId || '74BB6922',
      source: 'web',
      languageid: 1,
      company_code: this.companyData?.code || 'B96AKY4',
      time_zone: formVal.timezone,
      currency_id: formVal.currency,
      date_format: formVal.dateFormat,
      unit_system: formVal.unitSystem,
      payment_type: formVal.defaultPaymentMethod
    };

    const url = environment.apiurl + 'api/Configuration/update_regional_settings';

    this.http.post<any>(url, payload, { headers: this.commonService.updateHeaders() }).subscribe({
      next: (res) => {
        if (res && res.statusCode === '200') {
          this.toastr.success('Regional settings updated successfully!', 'Success');
          this.fetchCompanyDetails();
        } else {
          this.toastr.error(res.message || 'Failed to update regional settings', 'Error');
        }
      },
      error: (err) => {
        this.toastr.error('Failed to update regional settings', 'Error');
        console.error(err);
      }
    });
  }
}
