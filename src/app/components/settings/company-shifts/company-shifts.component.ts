import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../../../services/common.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-company-shifts',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './company-shifts.component.html',
  styleUrl: './company-shifts.component.scss'
})
export class CompanyShiftsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  private http = inject(HttpClient);
  private commonService = inject(CommonService);

  companyShiftsForm!: FormGroup;
  daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  private readonly weekdayIndexes = [0, 1, 2, 3, 4];
  private readonly weekendIndexes = [5, 6];

  ngOnInit(): void {
    this.initForm();
    this.fetchShifts();
  }

  initForm(): void {
    const shiftGroups = this.daysOfWeek.map((day, index) => {
      const isWeekday = index < 5;
      return this.fb.group({
        dayName: [day],
        enabled: [isWeekday],
        startTime: [{ value: isWeekday ? '09:00' : '', disabled: !isWeekday }],
        endTime: [{ value: isWeekday ? '18:00' : '', disabled: !isWeekday }]
      });
    });

    this.companyShiftsForm = this.fb.group({
      selectAll: [false],
      shifts: this.fb.array(shiftGroups)
    });

    this.companyShiftsForm.get('selectAll')?.valueChanges.subscribe(val => {
      this.toggleAll(!!val);
    });
  }

  get shiftsFormArray(): FormArray {
    return this.companyShiftsForm.get('shifts') as FormArray;
  }

  get summaryLabel(): string {
    const active = this.shiftsFormArray.controls
      .map((ctrl, i) => ({ enabled: !!ctrl.get('enabled')?.value, index: i }))
      .filter((d) => d.enabled);

    if (!active.length) {
      return '0 days active';
    }

    const weekdaysOnly = active.length === 5 && active.every((d) => d.index < 5);
    if (weekdaysOnly) {
      return '5 days active · Mon–Fri';
    }

    if (active.length === 7) {
      return '7 days active · Mon–Sun';
    }

    const short = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const names = active.map((d) => short[d.index]).join(', ');
    return `${active.length} day${active.length === 1 ? '' : 's'} active · ${names}`;
  }

  getDurationLabel(index: number): string {
    const group = this.shiftsFormArray.at(index) as FormGroup;
    if (!group.get('enabled')?.value) {
      return '—';
    }
    const start = group.get('startTime')?.value as string;
    const end = group.get('endTime')?.value as string;
    if (!start || !end) {
      return '—';
    }
    const startMins = this.toMinutes(start);
    const endMins = this.toMinutes(end);
    if (startMins === null || endMins === null || endMins <= startMins) {
      return '—';
    }
    const hours = (endMins - startMins) / 60;
    const whole = Math.floor(hours);
    const fraction = hours - whole;
    if (fraction === 0) {
      return `${whole} hrs`;
    }
    if (fraction === 0.5) {
      return `${whole}.5 hrs`;
    }
    return `${hours.toFixed(1)} hrs`;
  }

  toggleDay(index: number): void {
    const group = this.shiftsFormArray.at(index) as FormGroup;
    const enabled = group.get('enabled')?.value;

    if (enabled) {
      group.get('startTime')?.enable();
      group.get('endTime')?.enable();
      if (!group.get('startTime')?.value) {
        group.get('startTime')?.setValue('09:00');
      }
      if (!group.get('endTime')?.value) {
        group.get('endTime')?.setValue('18:00');
      }
    } else {
      group.get('startTime')?.disable();
      group.get('endTime')?.disable();
    }

    const allChecked = this.shiftsFormArray.controls.every(ctrl => ctrl.get('enabled')?.value);
    this.companyShiftsForm.get('selectAll')?.setValue(allChecked, { emitEvent: false });
  }

  toggleAll(checked: boolean): void {
    this.shiftsFormArray.controls.forEach((ctrl) => {
      const group = ctrl as FormGroup;
      group.get('enabled')?.setValue(checked, { emitEvent: false });

      if (checked) {
        group.get('startTime')?.enable();
        group.get('endTime')?.enable();
        if (!group.get('startTime')?.value) {
          group.get('startTime')?.setValue('09:00');
        }
        if (!group.get('endTime')?.value) {
          group.get('endTime')?.setValue('18:00');
        }
      } else {
        group.get('startTime')?.disable();
        group.get('endTime')?.disable();
      }
    });
  }

  applyWeekdays(): void {
    this.weekdayIndexes.forEach((index) => {
      const group = this.shiftsFormArray.at(index) as FormGroup;
      group.get('enabled')?.setValue(true, { emitEvent: false });
      group.get('startTime')?.enable();
      group.get('endTime')?.enable();
      group.get('startTime')?.setValue('09:00');
      group.get('endTime')?.setValue('18:00');
    });
    this.syncSelectAll();
  }

  clearWeekend(): void {
    this.weekendIndexes.forEach((index) => {
      const group = this.shiftsFormArray.at(index) as FormGroup;
      group.get('enabled')?.setValue(false, { emitEvent: false });
      group.get('startTime')?.setValue('');
      group.get('endTime')?.setValue('');
      group.get('startTime')?.disable();
      group.get('endTime')?.disable();
    });
    this.syncSelectAll();
  }

  convertTo24Hour(timeStr: string): string {
    if (!timeStr) return '';
    if (/^\d{2}:\d{2}$/.test(timeStr)) return timeStr;
    if (/^\d{2}:\d{2}:\d{2}$/.test(timeStr)) return timeStr.substring(0, 5);

    const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return timeStr;
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const modifier = match[3].toUpperCase();

    if (hours === 12) hours = 0;
    if (modifier === 'PM') hours += 12;

    return `${String(hours).padStart(2, '0')}:${minutes}`;
  }

  convertTo12Hour(timeStr: string): string {
    if (!timeStr) return '';
    const match = timeStr.match(/^(\d{2}):(\d{2})$/);
    if (!match) return timeStr;
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const modifier = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${String(hours).padStart(2, '0')}:${minutes} ${modifier}`;
  }

  fetchShifts(): void {
    const url = environment.apiurl + 'api/Masters/_getMasters';
    const user = this.commonService.getCurrentUser();
    const payload = {
      typeId: 31,
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
          const companyShiftsStr = res.objResult.table[0].company_shifts;
          if (companyShiftsStr) {
            try {
              const loadedShifts = JSON.parse(companyShiftsStr);
              this.populateForm(loadedShifts);
            } catch (e) {
              console.error('Error parsing company_shifts:', e);
            }
          }
        }
      },
      error: (err) => {
        this.toastr.error('Failed to load company shifts', 'Error');
        console.error(err);
      }
    });
  }

  populateForm(loadedShifts: any[]): void {
    this.shiftsFormArray.controls.forEach((ctrl) => {
      const group = ctrl as FormGroup;
      const dayName = group.get('dayName')?.value;
      const match = loadedShifts.find(s => s.week_day.toLowerCase() === dayName.toLowerCase());
      if (match) {
        group.get('enabled')?.setValue(true);
        group.get('startTime')?.enable();
        group.get('endTime')?.enable();
        group.get('startTime')?.setValue(this.convertTo24Hour(match.start_time));
        group.get('endTime')?.setValue(this.convertTo24Hour(match.end_time));
      } else {
        group.get('enabled')?.setValue(false);
        group.get('startTime')?.setValue('');
        group.get('startTime')?.disable();
        group.get('endTime')?.setValue('');
        group.get('endTime')?.disable();
      }
    });

    this.syncSelectAll();
  }

  onSubmit(): void {
    if (this.companyShiftsForm.invalid) {
      this.toastr.error('Please fix validation errors before saving.', 'Error');
      return;
    }

    let valid = true;
    this.shiftsFormArray.controls.forEach((ctrl) => {
      const group = ctrl as FormGroup;
      if (group.get('enabled')?.value) {
        const start = group.get('startTime')?.value;
        const end = group.get('endTime')?.value;
        if (start && end && start >= end) {
          valid = false;
          this.toastr.error(`End time must be after Start time for ${group.get('dayName')?.value}.`, 'Validation Error');
        }
      }
    });

    if (!valid) return;

    const shiftsToSend = this.shiftsFormArray.controls
      .filter(ctrl => ctrl.get('enabled')?.value)
      .map(ctrl => {
        const group = ctrl as FormGroup;
        return {
          week_day: group.get('dayName')?.value,
          start_time: this.convertTo12Hour(group.get('startTime')?.value),
          end_time: this.convertTo12Hour(group.get('endTime')?.value)
        };
      });

    const url = environment.apiurl + 'api/Configuration/update_company_shifts';
    const user = this.commonService.getCurrentUser();
    const payload = {
      userid: user?.userId || 1,
      company_id: user?.companyId || 1,
      clientId: user?.clientId || '74BB6922',
      source: 'web',
      languageid: 1,
      company_code: 'B96AKY4',
      week_Schedules: shiftsToSend
    };

    this.http.post<any>(url, payload, { headers: this.commonService.updateHeaders() }).subscribe({
      next: (res) => {
        if (res && res.statusCode === '200') {
          this.toastr.success('Company shifts saved successfully!', 'Success');
        } else {
          this.toastr.error(res.message || 'Failed to save company shifts', 'Error');
        }
      },
      error: (err) => {
        this.toastr.error('Failed to save company shifts', 'Error');
        console.error(err);
      }
    });
  }

  private syncSelectAll(): void {
    const allChecked = this.shiftsFormArray.controls.every(ctrl => ctrl.get('enabled')?.value);
    this.companyShiftsForm.get('selectAll')?.setValue(allChecked, { emitEvent: false });
  }

  private toMinutes(time: string): number | null {
    const match = time.match(/^(\d{2}):(\d{2})$/);
    if (!match) {
      return null;
    }
    return parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
  }
}
