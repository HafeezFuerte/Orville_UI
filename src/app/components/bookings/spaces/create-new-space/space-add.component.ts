import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload.component';
import { FlowbiteDatepickerDirective } from '../../../../shared/directives/flowbite-datepicker.directive';
import { SpaceAvailability } from '../spaces.data';
import { PortfolioService } from '../../../portfolio/services/portfolio.service';
import { CommonService } from '../../../../services/common.service';

interface WeekDayRow {
  day: string;
  enabled: boolean;
  start: string;
  end: string;
}

@Component({
  selector: 'app-space-add',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule, FlowbiteDatepickerDirective, FileUploadComponent],
  templateUrl: './space-add.component.html'
})
export class SpaceAddComponent implements OnInit {
  properties: any[] = [];
  units: any[] = [];
  availabilityOptions = [
    { id: 1, name: 'Weekdays' },
    { id: 2, name: 'Weekends' },
    { id: 3, name: 'Always' }
  ];
  slotOptions = [
    { id: 1, name: '30 mins' },
    { id: 2, name: '45 mins' },
    { id: 3, name: '1 hour' },
    { id: 4, name: '2 hours' }
  ];
  
  form = {
    name: '',
    location: '',
    phone: '',
    email: '',
    description: '',
    property: null as string | null,
    unit: null as string | null,
    availability: 1 as number | null,
    slotDuration: 1 as number | null,
    startDate: '',
    endDate: '',
    enablePayment: false,
    slotPrice: '',
    rules: ''
  };
  
  weekDays: WeekDayRow[] = [
    { day: 'Monday', enabled: true, start: '', end: '' },
    { day: 'Tuesday', enabled: true, start: '', end: '' },
    { day: 'Wednesday', enabled: true, start: '', end: '' },
    { day: 'Thursday', enabled: true, start: '', end: '' },
    { day: 'Friday', enabled: false, start: '', end: '' },
    { day: 'Saturday', enabled: true, start: '', end: '' },
    { day: 'Sunday', enabled: true, start: '', end: '' }
  ];

  isEdit = false;
  spaceCode = '';
  spaceImages: File[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private portfolioService: PortfolioService,
    private commonService: CommonService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadProperties();

    this.route.queryParams.subscribe(params => {
      const code = params['code'] || params['id'];
      if (code) {
        this.isEdit = true;
        this.spaceCode = code;
        this.loadSpaceDetails();
      }
    });
  }

  onImageSelected(files: File[]): void {
    this.spaceImages = files;
  }

  loadProperties(callback?: () => void): void {
    const currentUser = this.commonService.getCurrentUser();
    this.portfolioService.getMasterByType({
      typeId: 11,
      filterId: 0,
      filterText: '',
      filterText1: '',
      userId: currentUser?.userId || 1,
      clientId: currentUser?.clientId || "74BB6922",
      companyId: currentUser?.companyId || 1
    }).subscribe({
      next: (res: any) => {
        if (res && (res.statusCode == 200 || res.statusCode == '200') && res.objResult && res.objResult.table) {
          this.properties = res.objResult.table.map((p: any) => ({
            code: p.code || p.property_code || p.id,
            name: p.name || p.property || p.code
          }));
        }
        if (callback) callback();
      },
      error: (err) => {
        console.error('Error loading properties:', err);
        if (callback) callback();
      }
    });
  }

  onPropertyChange(): void {
    this.form.unit = null;
    this.units = [];
    if (this.form.property) {
      this.loadUnitsForProperty(this.form.property);
    }
  }

  loadUnitsForProperty(propertyCode: string, callback?: () => void): void {
    const currentUser = this.commonService.getCurrentUser();
    this.portfolioService.getMasterByType({
      typeId: 3,
      filterId: 0,
      filterText: propertyCode,
      filterText1: '',
      userId: currentUser?.userId || 1,
      clientId: currentUser?.clientId || "74BB6922",
      companyId: currentUser?.companyId || 1
    }).subscribe({
      next: (res: any) => {
        if (res && (res.statusCode == 200 || res.statusCode == '200') && res.objResult && res.objResult.table) {
          this.units = res.objResult.table.map((u: any) => ({
            code: u.code || u.unit_code || u.id,
            name: `${u.unit_code || u.code} - ${u.unit_no || u.name}`
          }));
        }
        if (callback) callback();
      },
      error: (err) => {
        console.error('Error loading units:', err);
        if (callback) callback();
      }
    });
  }

  parseAvailabilityId(val: any): number {
    if (typeof val === 'number' && !isNaN(val) && val > 0) return val;
    if (!val) return 1;
    const s = String(val).toLowerCase();
    if (s === '1' || s.includes('weekday')) return 1;
    if (s === '2' || s.includes('weekend')) return 2;
    if (s === '3' || s.includes('always')) return 3;
    return Number(val) || 1;
  }

  parseSlotDurationId(val: any): number {
    if (typeof val === 'number' && !isNaN(val) && val > 0) return val;
    if (!val) return 1;
    const s = String(val).toLowerCase();
    if (s === '1' || s.includes('30')) return 1;
    if (s === '2' || s.includes('45')) return 2;
    if (s === '3' || s.includes('1 hour') || s.includes('60')) return 3;
    if (s === '4' || s.includes('2 hour') || s.includes('120')) return 4;
    return Number(val) || 1;
  }

  loadSpaceDetails(): void {
    const currentUser = this.commonService.getCurrentUser();
    this.portfolioService.getMasterByType({
      typeId: 30,
      filterId: 0,
      filterText: this.spaceCode,
      filterText1: '',
      userId: currentUser?.userId || 1,
      clientId: currentUser?.clientId || "74BB6922",
      companyId: currentUser?.companyId || 1
    }).subscribe({
      next: (res: any) => {
        if (res && (res.statusCode == 200 || res.statusCode == '200') && res.objResult) {
          const detail = res.objResult.space?.[0] || res.objResult.spaces?.[0] || res.objResult.table?.[0] || {};
          const propCode = detail.property_code || detail.property || null;
          const unitCode = detail.unit_code || detail.unit || null;

          let localExtra: any = {};
          try {
            const saved = localStorage.getItem(`space_extra_${this.spaceCode}`);
            if (saved) localExtra = JSON.parse(saved);
          } catch (e) {
            console.error('Error reading space extra local storage:', e);
          }

          this.form = {
            name: detail.space_name || detail.name || localExtra.name || '',
            location: detail.space_location || detail.location || localExtra.location || '',
            phone: detail.phone_no || detail.phone || detail.phone_number || localExtra.phone || '',
            email: detail.email_address || detail.email_addess || detail.email || localExtra.email || '',
            description: detail.description || detail.desc || localExtra.description || '',
            property: propCode ? String(propCode) : (localExtra.property || null),
            unit: unitCode ? String(unitCode) : (localExtra.unit || null),
            availability: this.parseAvailabilityId(detail.availability || detail.available_days || localExtra.availability),
            slotDuration: this.parseSlotDurationId(detail.slot_duration || detail.slots_duration_nm || localExtra.slotDuration),
            startDate: this.formatDateForInput(detail.start_date || localExtra.startDate),
            endDate: this.formatDateForInput(detail.end_date || localExtra.endDate),
            enablePayment: detail.enabled_payment === true || detail.enabled_payments_for_space === true || detail.enable_payment === 'Yes' || detail.enable_payment === true || detail.enablePayment === 'Enabled' || detail.enabled_payment === 1 || detail.enabled_payments_for_space === 1 || localExtra.enablePayment === true,
            slotPrice: String(detail.slot_price ?? detail.slotPrice ?? detail.slot_amount ?? detail.slot_rate ?? detail.price ?? detail.slotprice ?? localExtra.slotPrice ?? ''),
            rules: detail.space_rules || detail.rules || detail.details || detail.rule || detail.space_rule || localExtra.rules || ''
          };

          if (this.form.property) {
            this.loadUnitsForProperty(this.form.property);
          }

          if (res.objResult.week_schedules || res.objResult.table1) {
            const weekSchedules = res.objResult.week_schedules || res.objResult.table1 || [];
            this.weekDays = this.weekDays.map(dayRow => {
              const match = weekSchedules.find((s: any) => s.day === dayRow.day || s.week_day === dayRow.day);
              if (match) {
                return {
                  day: dayRow.day,
                  enabled: match.enabled === true || match.enabled === 1 || match.enabled === 'true',
                  start: match.start || match.start_time || '',
                  end: match.end || match.end_time || ''
                };
              }
              return dayRow;
            });
          }
        }
      },
      error: (err) => console.error("Error loading space details:", err)
    });
  }

  formatDateForInput(dateStr: string): string {
    if (!dateStr) return '';
    try {
      const dt = new Date(dateStr);
      if (isNaN(dt.getTime())) return dateStr;
      const d = String(dt.getDate()).padStart(2, '0');
      const m = String(dt.getMonth() + 1).padStart(2, '0');
      const y = dt.getFullYear();
      return `${d}-${m}-${y}`;
    } catch {
      return dateStr;
    }
  }

  parseInputDate(dateStr: string): string {
    if (!dateStr) return new Date().toISOString();
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const d = Number(parts[0]);
      const m = Number(parts[1]) - 1;
      const y = Number(parts[2]);
      return new Date(y, m, d).toISOString();
    }
    return new Date(dateStr).toISOString();
  }

  copyMondayToAll(): void {
    const monday = this.weekDays[0];
    this.weekDays = this.weekDays.map((row, index) =>
      index === 0 ? row : { ...row, enabled: monday.enabled, start: monday.start, end: monday.end }
    );
  }

  cancel(): void {
    void this.router.navigate(['/bookings/spaces']);
  }

  save(): void {
    const errors: string[] = [];
    if (!this.form.name) errors.push('Space name is required.');
    if (!this.form.location) errors.push('Space Location is required.');
    if (!this.form.phone) errors.push('Phone Number is required.');
    if (!this.form.property) errors.push('Property is required.');
    if (!this.form.unit) errors.push('Unit is required.');
    if (!this.form.startDate) errors.push('Start Date is required.');
    if (!this.form.endDate) errors.push('End Date is required.');

    if (errors.length > 0) {
      this.toastr.error(errors.join('<br>'), 'Validation', {
        enableHtml: true,
        timeOut: 5000,
        positionClass: 'toast-top-right'
      });
      return;
    }

    const clsWeek_Schedules = this.weekDays.map(row => ({
      day: row.day,
      week_day: row.day,
      enabled: row.enabled,
      start: row.start || '',
      start_time: row.start || '',
      end: row.end || '',
      end_time: row.end || ''
    }));

    const clsAvailablity_Schedule = {
      available_days: this.parseAvailabilityId(this.form.availability),
      slot_duration: this.parseSlotDurationId(this.form.slotDuration),
      start_date: this.parseInputDate(this.form.startDate),
      end_date: this.parseInputDate(this.form.endDate),
      slot_price: this.form.slotPrice,
      slot_amount: this.form.slotPrice,
      slotPrice: this.form.slotPrice
    };

    const currentUser = this.commonService.getCurrentUser();
    const request = {
      userid: currentUser?.userId || 1,
      company_id: currentUser?.companyId || 1,
      clientId: currentUser?.clientId || '74BB6922',
      source: 'web',
      languageid: 1,
      code: this.spaceCode || '',
      property_code: this.form.property || '',
      unit_code: this.form.unit || '',
      space_name: this.form.name,
      space_location: this.form.location,
      phone_no: this.form.phone,
      email_addess: this.form.email,
      email_address: this.form.email,
      enabled_payments_for_space: this.form.enablePayment,
      description: this.form.description,
      space_rules: this.form.rules,
      rules: this.form.rules,
      details: this.form.rules,
      slot_price: this.form.slotPrice,
      slot_amount: this.form.slotPrice,
      slotPrice: this.form.slotPrice,
      clsWeek_Schedules: clsWeek_Schedules,
      clsAvailablity_Schedule: clsAvailablity_Schedule
    };

    const formData = new FormData();
    formData.append('reqObject', JSON.stringify(request));
    if (this.spaceImages.length > 0) {
      formData.append('primary_image', this.spaceImages[0]);
    }

    this.portfolioService.saveSpace(formData).subscribe({
      next: (res) => {
        if (res && (res.statusCode === 200 || res.statusCode === '200' || res.isSuccess)) {
          const codeKey = this.spaceCode || res.objResult?.table?.[0]?.code || res.objResult?.code || '';
          if (codeKey) {
            try {
              localStorage.setItem(`space_extra_${codeKey}`, JSON.stringify({
                slotPrice: this.form.slotPrice,
                rules: this.form.rules,
                description: this.form.description,
                name: this.form.name,
                location: this.form.location,
                phone: this.form.phone,
                email: this.form.email,
                property: this.form.property,
                unit: this.form.unit,
                enablePayment: this.form.enablePayment,
                availability: this.form.availability,
                slotDuration: this.form.slotDuration,
                startDate: this.form.startDate,
                endDate: this.form.endDate
              }));
            } catch (e) {
              console.error('Error writing space extra local storage:', e);
            }
          }

          let msg = res.message || 'Space saved successfully';
          if (!msg || msg.trim() === 'LBL_SUCCESS' || msg.toUpperCase().includes('LBL_SUCCESS')) {
            msg = 'Success';
          }
          this.toastr.success(msg);
          void this.router.navigate(['/bookings/spaces']);
        } else {
          let msg = res.message || 'Failed to save space';
          if (msg.includes('LBL_')) msg = 'Failed to save space';
          this.toastr.error(msg);
        }
      },
      error: (err) => {
        console.error('Error saving space:', err);
        this.toastr.error('An error occurred while saving the space');
      }
    });
  }
}
