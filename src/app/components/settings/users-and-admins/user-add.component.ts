import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; 
import { Common_TabsService } from '../../portfolio/services/common_tabs.service';
import { CommonService } from '../../../services/common.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule,TranslateService } from '@ngx-translate/core';
import {SettingsService} from '../settings.service'
import {
  MOCK_SETTINGS_USERS,
  USER_NOTIFICATION_OPTIONS,
  UserKind,
} from './users-and-admins.data';

@Component({
  selector: 'app-user-add',
  standalone: true,
  imports: [CommonModule,TranslateModule, FormsModule,NgSelectModule],
  templateUrl: './user-add.component.html',
})
export class UserAddComponent implements OnInit {
  userKind: UserKind = 'user';
  editingId: string | null = null;
  selectedPhotoFile: File | null = null;
  currentUser = this.commonservice.getCurrentUser();
  photoPreview: string | null = null; 
  email = '';
  username = '';
  password = '';
  firstName = '';
  lastName = '';
  country = '';
  phone = '';
  gender = '';
  group = '';
  role = '';
  timeZone = 'Abu Dhabi (UTC+4)';
  genders = ['Male', 'Female', 'Other'];
  spokenLanguages = '';
  displayAllTenants = false;

  readonly notificationOptions = USER_NOTIFICATION_OPTIONS;
  selectedNotifications = new Set<string>();

countryOptions :any=[]; 
  groupOptions:any=[];
  roleOptions : any=[];
  timeZoneOptions = [
    { id: 'Abu Dhabi (UTC+4)', name: '(GMT+04:00) Abu Dhabi' },
    { id: 'GMT (UTC+0)', name: '(GMT+00:00) GMT' },
    { id: 'London (UTC+0)', name: '(GMT+00:00) London' },
    { id: 'Paris (UTC+1)', name: '(GMT+01:00) Paris' },
    { id: 'Cairo (UTC+2)', name: '(GMT+02:00) Cairo' },
    { id: 'Moscow (UTC+3)', name: '(GMT+03:00) Moscow' },
    { id: 'Dubai (UTC+4)', name: '(GMT+04:00) Dubai' },
    { id: 'India (UTC+5:30)', name: '(GMT+05:30) India' },
    { id: 'Singapore (UTC+8)', name: '(GMT+08:00) Singapore' },
    { id: 'Tokyo (UTC+9)', name: '(GMT+09:00) Tokyo' },
    { id: 'Sydney (UTC+10)', name: '(GMT+10:00) Sydney' },
    { id: 'New York (UTC-5)', name: '(GMT-05:00) New York' },
    { id: 'Los Angeles (UTC-8)', name: '(GMT-08:00) Los Angeles' }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private commontabservice:Common_TabsService,
    private commonservice: CommonService,
    private settingservice:SettingsService
  ) {}

  ngOnInit(): void {
    // const type = (this.route.snapshot.queryParamMap.get('type') || 'user') as UserKind;
    // this.userKind = ['user', 'admin', 'technician'].includes(type) ? type : 'user';

    this.route.paramMap.subscribe((params) => {
      this.editingId=params.get('code'); 
      if(this.editingId)
      this.getUserDetails(91,0, '', this.editingId);
    });  
    this.loadLookup(42,0,'roleOptions',''); 
    this.loadLookup(2,55,'groupOptions','');
    this.loadLookup(2,1000,'countryOptions','');
  }
  getUserDetails(Typeid:number,filterId: number, targetProperty: string, filterText: string) {
    this.commontabservice.getMasterByType({
      typeId: Typeid,
      filterId: filterId,
      filterText: filterText,
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult.users) {  
          var temp=res.objResult.users[0] || {}; 
          if(temp){
            this.userKind = temp.kind;
            this.photoPreview=temp.image_path;
            this.email = temp.email_address;
            this.username = temp.username;
            this.firstName = temp.first_name|| '';
            this.lastName = temp.last_name || '';
            this.phone = temp.phone;
            this.role = temp.role_type;
            this.spokenLanguages=temp.spoken_languages;
            this.gender=temp.gender;
            this.country=temp.country_id;
            this.group=temp.department_id;
            this.timeZone=temp.time_zone;
            this.displayAllTenants=temp.display_all_tenants
            let actions=temp.technician_actions.split(',');
            actions.forEach((element:any) => {
              this.selectedNotifications.add(element); 
            });
            this.selectedNotifications = new Set(this.selectedNotifications);
          }
         
         
        }
        else
        this.toastr.error("No record[s] found");
      },
      error: (err) => {
        
      }
    });
  }
  loadLookup(Typeid:number,filterId: number, targetProperty: string, filterText: string) {
    this.commontabservice.getMasterByType({
      typeId: Typeid,
      filterId: filterId,
      filterText: filterText,
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult) {  
          (this as any)[targetProperty] = res.objResult.table;
            
        }
        
      },
      error: (err) => {
        console.error(`Error fetching lookup ${filterId}:`, err);
      }
    });
  }
  
  get selectedCountryObj() {
    return this.countryOptions.find((c:any) => c.id === Number(this.country)) || null;
  }

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
  get pageTitle(): string {
    if (this.editingId != null) {
      return this.userKind === 'admin'
        ? 'Edit Admin'
        : this.userKind === 'technician'
          ? 'Edit Technician'
          : 'Edit User';
    }
    return this.userKind === 'admin'
      ? 'New Admin'
      : this.userKind === 'technician'
        ? 'New Technician'
        : 'New User';
  }

  get breadcrumb(): string {
    return `Users and Admins / ${this.pageTitle}`;
  }

  get allNotificationsSelected(): boolean {
    return this.selectedNotifications.size === this.notificationOptions.length;
  }
  saveUser() {
    if (!this.firstName || !this.lastName || !this.email) {
      this.toastr.warning('Please fill in all required fields (First Name, Last Name, Email).', 'Missing Info');
      return;
    }
  
    const requestJson = {
      userid: this.currentUser?.userId || 1,
      company_id:this.currentUser?.companyId || 1,
      clientId: this.currentUser?.clientId,
      source: 'web',
      languageid: 1, 
      email_address: this.email, 
      code: this.editingId ?? '', 
      username: this.username || '',
      gender:this.gender,
      profileImage_path: '',
      password: this.password, // default empty 
      first_name: this.firstName,
      last_name: this.lastName,
      mobile_no: this.phone || '', 
      country_id: Number(this.country) || 0,
      role_id: this.roleOptions.filter((item:any)=>item.code==this.role)[0]?.id || 0, // default 
      role_code: this.role, // default
      department: Number(this.group) || 0,
      display_all_tenants: this.displayAllTenants,
      technician_actions: Array.from(this.selectedNotifications) ? Array.from(this.selectedNotifications).join(',') 
      : (this.selectedNotifications || ''),
      spoken_languages: this.spokenLanguages,
      time_zone:this.timeZone
    };

    const formData = new FormData();
    formData.append('reqObject', JSON.stringify(requestJson));
    if (this.selectedPhotoFile) {
      formData.append('profileImage', this.selectedPhotoFile, this.selectedPhotoFile.name);
    }

    this.settingservice.saveUsers(formData).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 || res.statusCode == "200") {
         
          let duplicateError: string | null = null;
          if (res.objResult?.table?.[0]) {
            const firstRow = res.objResult.table[0];
            const keys = Object.keys(firstRow);
            for (const key of keys) {
              const val = firstRow[key];
              if (key.toLowerCase().includes('duplicate') || (typeof val === 'number' && val < 0)) {
                duplicateError = typeof val === 'string' ? val : key;
                break;
              }
            }
          }
          if (duplicateError) {
            this.toastr.error(duplicateError.charAt(0).toUpperCase() + duplicateError.slice(1) + '.', 'Error');
            return;
          }

          this.toastr.success(this.editingId ? 'User updated successfully!' : 'User saved successfully!', 'Success');
          this.router.navigate(['/settings/users-and-admins']); 
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
  get canSave(): boolean {
    return (
      !!this.email.trim() &&
      !!this.firstName.trim() &&
      !!this.lastName.trim() &&
      !!this.country &&
      !!this.role
    );
  }

  toggleSelectAllNotifications(): void {
    if (this.allNotificationsSelected) {
      this.selectedNotifications.clear();
    } else {
      this.notificationOptions.forEach((n) => this.selectedNotifications.add(n));
    }
    this.selectedNotifications = new Set(this.selectedNotifications);
  }

  isNotificationSelected(label: string): boolean {
    return this.selectedNotifications.has(label);
  }

  toggleNotification(label: string): void {
    if (this.selectedNotifications.has(label)) {
      this.selectedNotifications.delete(label);
    } else {
      this.selectedNotifications.add(label);
    }
    this.selectedNotifications = new Set(this.selectedNotifications);
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    this.selectedPhotoFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.photoPreview = typeof reader.result === 'string' ? reader.result : null;
    };
    reader.readAsDataURL(file);
  }

  cancel(): void {
    this.router.navigate(['/settings/users-and-admins']);
  }

  save(): void {
    if (this.canSave) {
      this.saveUser();
      return;
    }
     
  }
}
