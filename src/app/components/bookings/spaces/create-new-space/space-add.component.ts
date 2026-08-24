import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload.component';
import { FlowbiteDatepickerDirective } from '../../../../shared/directives/flowbite-datepicker.directive';
import { SpaceAvailability } from '../spaces.data';

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
export class SpaceAddComponent {
  properties = ['Marina Heights Tower', 'Orville Plaza'];
  units = ['Apartment-18-MR-1', 'Common-Pool-01', 'Gym-02'];
  availabilityOptions: SpaceAvailability[] = ['Weekdays', 'Weekends', 'Always'];
  slotOptions = ['30 mins', '45 mins', '1 hour', '2 hours'];
  form = {
    name: '',
    location: '',
    phone: '',
    email: '',
    description: '',
    property: null as string | null,
    unit: null as string | null,
    availability: 'Weekdays' as SpaceAvailability,
    slotDuration: null as string | null,
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

  constructor(private router: Router) {}

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
    void this.router.navigate(['/bookings/spaces']);
  }
}
