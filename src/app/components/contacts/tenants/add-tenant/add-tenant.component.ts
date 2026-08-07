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
  tenantDbId: number = 0; // stores the real numeric DB id for updates

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
  existingTenants: any[] = [];

  countryMetadata: { [key: string]: { code: string; dialCode: string } } = {
    'afghanistan': { code: 'af', dialCode: '+93' },
    'albania': { code: 'al', dialCode: '+355' },
    'algeria': { code: 'dz', dialCode: '+213' },
    'andorra': { code: 'ad', dialCode: '+376' },
    'angola': { code: 'ao', dialCode: '+244' },
    'argentina': { code: 'ar', dialCode: '+54' },
    'armenia': { code: 'am', dialCode: '+374' },
    'australia': { code: 'au', dialCode: '+61' },
    'austria': { code: 'at', dialCode: '+43' },
    'azerbaijan': { code: 'az', dialCode: '+994' },
    'bahamas': { code: 'bs', dialCode: '+1-242' },
    'bahrain': { code: 'bh', dialCode: '+973' },
    'bangladesh': { code: 'bd', dialCode: '+880' },
    'barbados': { code: 'bb', dialCode: '+1-246' },
    'belgium': { code: 'be', dialCode: '+32' },
    'belize': { code: 'bz', dialCode: '+501' },
    'benin': { code: 'bj', dialCode: '+229' },
    'bhutan': { code: 'bt', dialCode: '+975' },
    'bolivia': { code: 'bo', dialCode: '+591' },
    'bosnia and herzegovina': { code: 'ba', dialCode: '+387' },
    'botswana': { code: 'bw', dialCode: '+267' },
    'brazil': { code: 'br', dialCode: '+55' },
    'brunei': { code: 'bn', dialCode: '+673' },
    'bulgaria': { code: 'bg', dialCode: '+359' },
    'burkina faso': { code: 'bf', dialCode: '+226' },
    'burundi': { code: 'bi', dialCode: '+257' },
    'cambodia': { code: 'kh', dialCode: '+855' },
    'cameroon': { code: 'cm', dialCode: '+237' },
    'canada': { code: 'ca', dialCode: '+1' },
    'cape verde': { code: 'cv', dialCode: '+238' },
    'central african republic': { code: 'cf', dialCode: '+236' },
    'chad': { code: 'td', dialCode: '+235' },
    'chile': { code: 'cl', dialCode: '+56' },
    'china': { code: 'cn', dialCode: '+86' },
    'colombia': { code: 'co', dialCode: '+57' },
    'comoros': { code: 'km', dialCode: '+269' },
    'congo': { code: 'cg', dialCode: '+242' },
    'costa rica': { code: 'cr', dialCode: '+506' },
    'croatia': { code: 'hr', dialCode: '+385' },
    'cuba': { code: 'cu', dialCode: '+53' },
    'cyprus': { code: 'cy', dialCode: '+357' },
    'czech republic': { code: 'cz', dialCode: '+420' },
    'denmark': { code: 'dk', dialCode: '+45' },
    'djibouti': { code: 'dj', dialCode: '+253' },
    'dominica': { code: 'dm', dialCode: '+1-767' },
    'dominican republic': { code: 'do', dialCode: '+1-809' },
    'ecuador': { code: 'ec', dialCode: '+593' },
    'egypt': { code: 'eg', dialCode: '+20' },
    'el salvador': { code: 'sv', dialCode: '+503' },
    'equatorial guinea': { code: 'gq', dialCode: '+240' },
    'eritrea': { code: 'er', dialCode: '+291' },
    'estonia': { code: 'ee', dialCode: '+372' },
    'eswatini': { code: 'sz', dialCode: '+268' },
    'ethiopia': { code: 'et', dialCode: '+251' },
    'fiji': { code: 'fj', dialCode: '+679' },
    'finland': { code: 'fi', dialCode: '+358' },
    'france': { code: 'fr', dialCode: '+33' },
    'gabon': { code: 'ga', dialCode: '+241' },
    'gambia': { code: 'gm', dialCode: '+220' },
    'georgia': { code: 'ge', dialCode: '+995' },
    'germany': { code: 'de', dialCode: '+49' },
    'ghana': { code: 'gh', dialCode: '+233' },
    'greece': { code: 'gr', dialCode: '+30' },
    'grenada': { code: 'gd', dialCode: '+1-473' },
    'guatemala': { code: 'gt', dialCode: '+502' },
    'guinea': { code: 'gn', dialCode: '+224' },
    'guyana': { code: 'gy', dialCode: '+592' },
    'haiti': { code: 'ht', dialCode: '+509' },
    'honduras': { code: 'hn', dialCode: '+504' },
    'hungary': { code: 'hu', dialCode: '+36' },
    'iceland': { code: 'is', dialCode: '+354' },
    'india': { code: 'in', dialCode: '+91' },
    'indonesia': { code: 'id', dialCode: '+62' },
    'iran': { code: 'ir', dialCode: '+98' },
    'iraq': { code: 'iq', dialCode: '+964' },
    'ireland': { code: 'ie', dialCode: '+353' },
    'israel': { code: 'il', dialCode: '+972' },
    'italy': { code: 'it', dialCode: '+39' },
    'jamaica': { code: 'jm', dialCode: '+1-876' },
    'japan': { code: 'jp', dialCode: '+81' },
    'jordan': { code: 'jo', dialCode: '+962' },
    'kazakhstan': { code: 'kz', dialCode: '+7' },
    'kenya': { code: 'ke', dialCode: '+254' },
    'kiribati': { code: 'ki', dialCode: '+686' },
    'kuwait': { code: 'kw', dialCode: '+965' },
    'kyrgyzstan': { code: 'kg', dialCode: '+996' },
    'laos': { code: 'la', dialCode: '+856' },
    'latvia': { code: 'lv', dialCode: '+371' },
    'lebanon': { code: 'lb', dialCode: '+961' },
    'lesotho': { code: 'ls', dialCode: '+266' },
    'liberia': { code: 'lr', dialCode: '+231' },
    'libya': { code: 'ly', dialCode: '+218' },
    'liechtenstein': { code: 'li', dialCode: '+423' },
    'lithuania': { code: 'lt', dialCode: '+370' },
    'luxembourg': { code: 'lu', dialCode: '+352' },
    'madagascar': { code: 'mg', dialCode: '+261' },
    'malawi': { code: 'mw', dialCode: '+265' },
    'malaysia': { code: 'my', dialCode: '+60' },
    'maldives': { code: 'mv', dialCode: '+960' },
    'mali': { code: 'ml', dialCode: '+223' },
    'malta': { code: 'mt', dialCode: '+356' },
    'marshall islands': { code: 'mh', dialCode: '+692' },
    'mauritania': { code: 'mr', dialCode: '+222' },
    'mauritius': { code: 'mu', dialCode: '+230' },
    'mexico': { code: 'mx', dialCode: '+52' },
    'micronesia': { code: 'fm', dialCode: '+691' },
    'moldova': { code: 'md', dialCode: '+373' },
    'monaco': { code: 'mc', dialCode: '+377' },
    'mongolia': { code: 'mn', dialCode: '+976' },
    'montenegro': { code: 'me', dialCode: '+382' },
    'morocco': { code: 'ma', dialCode: '+212' },
    'mozambique': { code: 'mz', dialCode: '+258' },
    'myanmar': { code: 'mm', dialCode: '+95' },
    'namibia': { code: 'na', dialCode: '+264' },
    'nauru': { code: 'nr', dialCode: '+674' },
    'nepal': { code: 'np', dialCode: '+977' },
    'netherlands': { code: 'nl', dialCode: '+31' },
    'new zealand': { code: 'nz', dialCode: '+64' },
    'nicaragua': { code: 'ni', dialCode: '+505' },
    'niger': { code: 'ne', dialCode: '+227' },
    'nigeria': { code: 'ng', dialCode: '+234' },
    'north korea': { code: 'kp', dialCode: '+850' },
    'north macedonia': { code: 'mk', dialCode: '+389' },
    'norway': { code: 'no', dialCode: '+47' },
    'oman': { code: 'om', dialCode: '+968' },
    'pakistan': { code: 'pk', dialCode: '+92' },
    'palau': { code: 'pw', dialCode: '+680' },
    'panama': { code: 'pa', dialCode: '+507' },
    'papua new guinea': { code: 'pg', dialCode: '+675' },
    'paraguay': { code: 'py', dialCode: '+595' },
    'peru': { code: 'pe', dialCode: '+51' },
    'philippines': { code: 'ph', dialCode: '+63' },
    'poland': { code: 'pl', dialCode: '+48' },
    'portugal': { code: 'pt', dialCode: '+351' },
    'qatar': { code: 'qa', dialCode: '+974' },
    'romania': { code: 'ro', dialCode: '+40' },
    'russia': { code: 'ru', dialCode: '+7' },
    'rwanda': { code: 'rw', dialCode: '+250' },
    'samoa': { code: 'ws', dialCode: '+685' },
    'san marino': { code: 'sm', dialCode: '+378' },
    'saudi arabia': { code: 'sa', dialCode: '+966' },
    'senegal': { code: 'sn', dialCode: '+221' },
    'serbia': { code: 'rs', dialCode: '+381' },
    'seychelles': { code: 'sc', dialCode: '+248' },
    'sierra leone': { code: 'sl', dialCode: '+232' },
    'singapore': { code: 'sg', dialCode: '+65' },
    'slovakia': { code: 'sk', dialCode: '+421' },
    'slovenia': { code: 'si', dialCode: '+386' },
    'solomon islands': { code: 'sb', dialCode: '+677' },
    'somalia': { code: 'so', dialCode: '+252' },
    'south africa': { code: 'za', dialCode: '+27' },
    'south korea': { code: 'kr', dialCode: '+82' },
    'south sudan': { code: 'ss', dialCode: '+211' },
    'spain': { code: 'es', dialCode: '+34' },
    'sri lanka': { code: 'lk', dialCode: '+94' },
    'sudan': { code: 'sd', dialCode: '+249' },
    'suriname': { code: 'sr', dialCode: '+597' },
    'sweden': { code: 'se', dialCode: '+46' },
    'switzerland': { code: 'ch', dialCode: '+41' },
    'syria': { code: 'sy', dialCode: '+963' },
    'taiwan': { code: 'tw', dialCode: '+886' },
    'tajikistan': { code: 'tj', dialCode: '+992' },
    'tanzania': { code: 'tz', dialCode: '+255' },
    'thailand': { code: 'th', dialCode: '+66' },
    'togo': { code: 'tg', dialCode: '+228' },
    'tonga': { code: 'to', dialCode: '+676' },
    'trinidad and tobago': { code: 'tt', dialCode: '+1-868' },
    'tunisia': { code: 'tn', dialCode: '+216' },
    'turkey': { code: 'tr', dialCode: '+90' },
    'turkmenistan': { code: 'tm', dialCode: '+993' },
    'tuvalu': { code: 'tv', dialCode: '+688' },
    'uganda': { code: 'ug', dialCode: '+256' },
    'ukraine': { code: 'ua', dialCode: '+380' },
    'united arab emirates': { code: 'ae', dialCode: '+971' },
    'united kingdom': { code: 'gb', dialCode: '+44' },
    'united states': { code: 'us', dialCode: '+1' },
    'uruguay': { code: 'uy', dialCode: '+598' },
    'uzbekistan': { code: 'uz', dialCode: '+998' },
    'vanuatu': { code: 'vu', dialCode: '+678' },
    'vatican city': { code: 'va', dialCode: '+379' },
    'venezuela': { code: 've', dialCode: '+58' },
    'vietnam': { code: 'vn', dialCode: '+84' },
    'yemen': { code: 'ye', dialCode: '+967' },
    'zambia': { code: 'zm', dialCode: '+260' },
    'zimbabwe': { code: 'zw', dialCode: '+263' }
  };

  getFlagCode(countryName: any): string {
    if (!countryName) return 'ae';
    const nameStr = typeof countryName === 'object' ? countryName.name : String(countryName);
    const key = nameStr.toLowerCase().trim();
    return this.countryMetadata[key]?.code || 'ae';
  }

  getDialCode(countryName: any): string {
    if (!countryName) return '+971';
    const nameStr = typeof countryName === 'object' ? countryName.name : String(countryName);
    const key = nameStr.toLowerCase().trim();
    return this.countryMetadata[key]?.dialCode || '+971';
  }

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

    this.propertiesService.getTenants({
      userid: Number(localStorage.getItem('userId')) || 1,
      company_id: Number(localStorage.getItem('companyId')) || 1,
      clientId: '74BB6922',
      source: 'web',
      languageid: 1,
      page_no: 0,
      seqno: 0,
      search_keyword: '',
      pagecount: 1000,
      filter_by: '',
      filter_list: '',
      featureid: 'TENANTS'
    }).subscribe({
      next: (res: any) => {
        if (res && res.objResult && res.objResult.tenants) {
          this.existingTenants = res.objResult.tenants;
        }
      }
    });

    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.tenantId = id;
        this.loadTenantDetails(id);
      }
    });
  }

  loadLookup(filterId: number, targetProperty: string, nameField: string, filterText: string = '', callback?: () => void) {
    this.portfolioService.getMasterByType({
      typeId: 2,
      filterId: filterId,
      filterText: filterText,
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult.table) {
          (this as any)[targetProperty] = res.objResult.table.map((item: any) => ({
            id: item.id,
            name: item[nameField] || item.lookup_name || item.name || ''
          }));
          if (callback) callback();
        }
      },
      error: (err) => {
        console.error(`Error fetching lookup ${filterId}:`, err);
      }
    });
  }

  onCountryChange(country: any) {
    this.tenantData.stateid = null;
    this.tenantData.city = null;
    this.states = [];
    this.cities = [];
    if (country && country.id) {
      this.loadLookup(1001, 'states', 'state_name', country.id.toString());
      this.tenantData.country_id = country.id;
    } else {
      this.tenantData.country_id = null;
    }
  }

  onStateChange(state: any) {
    this.tenantData.city = null;
    this.cities = [];
    if (state && state.id) {
      this.loadLookup(1002, 'cities', 'city_name', state.id.toString());
      this.tenantData.stateid = state.id;
    } else {
      this.tenantData.stateid = null;
    }
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
        let tenant: any = null;
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
            first_name: tenant.first_name || (tenant.tenant ? tenant.tenant.trim().split(/\s+/)[0] : '') || '',
            middle_name: tenant.middle_name || (tenant.tenant && tenant.tenant.trim().split(/\s+/).length >= 3 ? tenant.tenant.trim().split(/\s+/)[1] : '') || '',
            last_name: tenant.last_name || (tenant.tenant ? (tenant.tenant.trim().split(/\s+/).length === 2 ? tenant.tenant.trim().split(/\s+/)[1] : tenant.tenant.trim().split(/\s+/).slice(2).join(' ')) : '') || '',
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
          this.tenantDbId = Number(tenant.id) || 0;
          this.autoSchedule = tenant.is_auto_schedule || false;
          this.displayAsCompany = tenant.display_as_company || false;
          this.autoSignLeases = tenant.is_auto_sign_leases || false;
          this.disableListing = tenant.disabled_property_listing || false;
        }

        const lookup = this.tenantData.country_id || 'United Arab Emirates';
        this.selectedCountry = this.countries.find(c => c.id === Number(lookup) || c.name === String(lookup)) || null;

        const natLookup = this.tenantData.nationality || 'United Arab Emirates';
        this.selectedNationality = this.countries.find(c => c.id === Number(natLookup) || c.name === String(natLookup)) || null;

        if (this.selectedCountry && this.selectedCountry.id) {
          this.loadLookup(1001, 'states', 'state_name', this.selectedCountry.id.toString(), () => {
            this.tenantData.stateid = tenant.stateid || null;
            if (this.tenantData.stateid) {
              this.loadLookup(1002, 'cities', 'city_name', this.tenantData.stateid.toString(), () => {
                this.tenantData.city = tenant.city || null;
              });
            }
          });
        }
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

    const email = this.tenantData.email_address;
    const mobile = this.tenantData.mobile_no;
    
    const isDuplicate = this.existingTenants.some((l: any) => {
      if (this.isEditMode && (l.id === this.tenantDbId || l.code === this.tenantId)) {
        return false;
      }
      const dupEmail = email && l.email_address && l.email_address.toLowerCase() === email.toLowerCase();
      const dupMobile = mobile && l.phone_number && l.phone_number.replace(/\D/g, '') === mobile.replace(/\D/g, '');
      return dupEmail || dupMobile;
    });

    if (isDuplicate) {
      this.toastr.warning("This email address or mobile number already exists.", "Duplicate Found");
      return;
    }

    const requestJson = {
      userid: Number(localStorage.getItem('userId')) || 1,
      company_id: Number(localStorage.getItem('companyId')) || 1,
      clientId: '74BB6922',
      source: 'web',
      languageid: 1,
      email_address: this.tenantData.email_address,
      code: this.isEditMode ? this.tenantId : (this.tenantData.code || ''),
      id: this.isEditMode ? this.tenantDbId : 0,
      username: this.tenantData.username || '',
      profileImage_path: '',
      honorific: this.tenantData.honorific || '',
      tenant: this.tenantData.first_name + ' ' + this.tenantData.last_name,
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
          let duplicateError: string | null = null;
          if (res.objResult?.table?.[0]) {
            const firstRow = res.objResult.table[0];
            const keys = Object.keys(firstRow);
            for (const key of keys) {
              const val = firstRow[key];
              if (key.toLowerCase().includes('duplicate') || (typeof val === 'number' && val < 0)) {
                duplicateError = key;
                break;
              }
            }
          }
          if (duplicateError) {
            this.toastr.error(duplicateError.charAt(0).toUpperCase() + duplicateError.slice(1) + '.', 'Error');
            return;
          }

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
