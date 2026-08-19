import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReservationStatus } from '../reservations.data';

interface TimeSlot {
  label: string;
  range: string;
}

@Component({
  selector: 'app-reservation-add',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule],
  templateUrl: './reservation-add.component.html'
})
export class ReservationAddComponent {
  spaces = ['Skyline Meeting Room', 'Community Pool Deck', 'Gym Studio'];
  reservers = ['Omar Al Mansoori', 'Sara Ibrahim', 'Hassan Qureshi'];
  leases = ['L-31942', 'L-32011', 'L-31880'];
  statusOptions: ReservationStatus[] = ['Confirmed', 'Pending', 'Cancelled'];
  weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarDays = [28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1];
  morningSlots: TimeSlot[] = [
    { label: '8:00 AM', range: '8:00 AM to 10:00 AM' },
    { label: '10:00 AM', range: '10:00 AM to 12:00 PM' }
  ];
  afternoonSlots: TimeSlot[] = [
    { label: '12:00 PM', range: '12:00 PM to 2:00 PM' },
    { label: '2:00 PM', range: '2:00 PM to 4:00 PM' }
  ];
  eveningSlots: TimeSlot[] = [
    { label: '6:00 PM', range: '6:00 PM to 8:00 PM' },
    { label: '8:00 PM', range: '8:00 PM to 10:00 PM' }
  ];
  form = {
    space: 'Skyline Meeting Room',
    selectedDay: 14,
    selectedSlot: '6:00 PM to 8:00 PM',
    name: 'Meeting Room A',
    reserve: null as string | null,
    lease: null as string | null,
    email: '',
    phone: '',
    status: 'Confirmed' as ReservationStatus,
    notes: ''
  };

  constructor(private router: Router) {}

  isMuted(day: number, index: number): boolean {
    return (index < 3 && day >= 28) || (index > 30 && day === 1);
  }

  selectDay(day: number, index: number): void {
    if (this.isMuted(day, index)) {
      return;
    }
    this.form.selectedDay = day;
  }

  selectSlot(range: string): void {
    this.form.selectedSlot = range;
  }

  cancel(): void {
    void this.router.navigate(['/bookings/reservations']);
  }

  save(): void {
    void this.router.navigate(['/bookings/reservations']);
  }
}
