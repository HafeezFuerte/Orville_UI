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
  styleUrls: []
})
export class CompanyShiftsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  private http = inject(HttpClient);
  private commonService = inject(CommonService);

  companyShiftsForm!: FormGroup;
  daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  ngOnInit(): void {
    this.initForm();
    this.fetchShifts();
  }

  initForm(): void {
    const shiftGroups = this.daysOfWeek.map(day => this.fb.group({
      dayName: [day],
      enabled: [false],
      startTime: [{ value: '', disabled: true }],
      endTime: [{ value: '', disabled: true }]
    }));

    this.companyShiftsForm = this.fb.group({
      selectAll: [false],
      shifts: this.fb.array(shiftGroups)
    });

    // Listen to changes on the selectAll control
    this.companyShiftsForm.get('selectAll')?.valueChanges.subscribe(val => {
      this.toggleAll(val);
    });
  }

  get shiftsFormArray(): FormArray {
    return this.companyShiftsForm.get('shifts') as FormArray;
  }

  toggleDay(index: number): void {
    const group = this.shiftsFormArray.at(index) as FormGroup;
    const enabled = group.get('enabled')?.value;
    
    if (enabled) {
      group.get('startTime')?.enable();
      group.get('endTime')?.enable();
      // Set default times if empty
      if (!group.get('startTime')?.value) {
        group.get('startTime')?.setValue('09:00');
      }
      if (!group.get('endTime')?.value) {
        group.get('endTime')?.setValue('17:00');
      }
    } else {
      group.get('startTime')?.disable();
      group.get('endTime')?.disable();
    }

    // Update selectAll status based on all individual checkboxes
    const allChecked = this.shiftsFormArray.controls.every(ctrl => ctrl.get('enabled')?.value);
    this.companyShiftsForm.get('selectAll')?.setValue(allChecked, { emitEvent: false });
  }

  toggleAll(checked: boolean): void {
    this.shiftsFormArray.controls.forEach((ctrl, idx) => {
      const group = ctrl as FormGroup;
      group.get('enabled')?.setValue(checked, { emitEvent: false });
      
      if (checked) {
        group.get('startTime')?.enable();
        group.get('endTime')?.enable();
        if (!group.get('startTime')?.value) {
          group.get('startTime')?.setValue('09:00');
        }
        if (!group.get('endTime')?.value) {
          group.get('endTime')?.setValue('17:00');
        }
      } else {
        group.get('startTime')?.disable();
        group.get('endTime')?.disable();
      }
    });
  }

  // Helper: Convert "09:00 AM" to "09:00"
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

  // Helper: Convert "09:00" to "09:00 AM"
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

  // Load shifts on load
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

    const allChecked = this.shiftsFormArray.controls.every(ctrl => ctrl.get('enabled')?.value);
    this.companyShiftsForm.get('selectAll')?.setValue(allChecked, { emitEvent: false });
  }

  onSubmit(): void {
    if (this.companyShiftsForm.invalid) {
      this.toastr.error('Please fix validation errors before saving.', 'Error');
      return;
    }

    // Verify start time < end time for enabled days
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

    // Build the shifts array payload
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
}
