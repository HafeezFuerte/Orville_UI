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
  vendorDbId: number = 0; // stores the real numeric DB id for updates

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

  selectedNationality: any = null;

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
          this.vendorDbId = Number(vendor.id) || 0;
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
      clientId: '74BB6922',
      source: 'web',
      languageid: 1,
      email_address: this.vendorData.email_address,
      code: this.isEditMode ? this.vendorId : '',
      id: this.isEditMode ? this.vendorDbId : 0,
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
