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

interface CalendarCell {
  day: number;
  muted: boolean;
}

@Component({
  selector: 'app-reservation-add',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule],
  templateUrl: './reservation-add.component.html',
  styleUrls: ['./reservation-add.component.scss'],
})
export class ReservationAddComponent {
  spaces = ['Skyline Meeting Room', 'Community Pool Deck', 'Gym Studio'];
  reservers = ['Omar Al Mansoori', 'Sara Ibrahim', 'Hassan Qureshi'];
  leases = ['L-31942', 'L-32011', 'L-31880'];
  statusOptions: ReservationStatus[] = ['Confirmed', 'Pending', 'Cancelled'];
  weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  viewYear = 2026;
  viewMonth = 6; // July (0-based)

  morningSlots: TimeSlot[] = [
    { label: '8:00 AM', range: '8:00 AM to 10:00 AM' },
    { label: '10:00 AM', range: '10:00 AM to 12:00 PM' },
  ];
  afternoonSlots: TimeSlot[] = [
    { label: '12:00 PM', range: '12:00 PM to 2:00 PM' },
    { label: '2:00 PM', range: '2:00 PM to 4:00 PM' },
  ];
  eveningSlots: TimeSlot[] = [
    { label: '6:00 PM', range: '6:00 PM to 8:00 PM' },
    { label: '8:00 PM', range: '8:00 PM to 10:00 PM' },
  ];

  durationOptions = ['30 mins', '45 mins', '1 Hour', '1.5 Hours', '2 Hours', '3 Hours', '4 Hours', 'Custom'];

  form = {
    space: 'Skyline Meeting Room',
    selectedDay: 14,
    selectedSlot: '6:00 PM to 8:00 PM',
    duration: '2 Hours',
    customDuration: '',
    name: 'Meeting Room A',
    reserve: null as string | null,
    lease: null as string | null,
    email: '',
    phone: '',
    status: 'Confirmed' as ReservationStatus,
    notes: '',
  };

  spaceMeta: Record<string, { location: string; duration: string; price: string }> = {
    'Skyline Meeting Room': {
      location: 'Level 18, Marina Heights, Dubai',
      duration: '2 Hours',
      price: 'AED 1500.00',
    },
    'Community Pool Deck': {
      location: 'Podium, Marina Heights, Dubai',
      duration: '1 Hour',
      price: 'AED 250.00',
    },
    'Gym Studio': {
      location: 'Level 2, Marina Heights, Dubai',
      duration: '45 mins',
      price: 'AED 400.00',
    },
  };

  constructor(private router: Router) {}

  get activeSpaceMeta() {
    return (
      this.spaceMeta[this.form.space] || {
        location: '—',
        duration: '—',
        price: '—',
      }
    );
  }

  get isCustomDuration(): boolean {
    return this.form.duration === 'Custom';
  }

  get displayDuration(): string {
    if (this.isCustomDuration) {
      const custom = this.form.customDuration.trim();
      return custom || 'Custom';
    }
    return this.form.duration || this.activeSpaceMeta.duration;
  }

  get monthLabel(): string {
    return new Date(this.viewYear, this.viewMonth, 1).toLocaleString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  }

  get selectedDateLabel(): string {
    const d = new Date(this.viewYear, this.viewMonth, this.form.selectedDay);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }

  get selectedDateShort(): string {
    const day = String(this.form.selectedDay).padStart(2, '0');
    const month = String(this.viewMonth + 1).padStart(2, '0');
    return `${day}-${month}-${this.viewYear}`;
  }

  get calendarCells(): CalendarCell[] {
    const first = new Date(this.viewYear, this.viewMonth, 1);
    const startPad = first.getDay();
    const daysInMonth = new Date(this.viewYear, this.viewMonth + 1, 0).getDate();
    const prevDays = new Date(this.viewYear, this.viewMonth, 0).getDate();
    const cells: CalendarCell[] = [];

    for (let i = startPad - 1; i >= 0; i--) {
      cells.push({ day: prevDays - i, muted: true });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, muted: false });
    }
    while (cells.length % 7 !== 0) {
      cells.push({ day: cells.length - (startPad + daysInMonth) + 1, muted: true });
    }
    return cells;
  }

  get canBook(): boolean {
    const durationOk = this.isCustomDuration
      ? !!this.form.customDuration.trim()
      : !!this.form.duration;
    return (
      !!this.form.space &&
      !!this.form.selectedDay &&
      !!this.form.selectedSlot &&
      durationOk &&
      !!this.form.email.trim()
    );
  }

  onSpaceChange(): void {
    const meta = this.spaceMeta[this.form.space];
    if (!meta) {
      return;
    }
    if (this.durationOptions.includes(meta.duration)) {
      this.form.duration = meta.duration;
      this.form.customDuration = '';
    } else {
      this.form.duration = 'Custom';
      this.form.customDuration = meta.duration;
    }
  }

  onDurationChange(): void {
    if (!this.isCustomDuration) {
      this.form.customDuration = '';
    }
  }

  selectDuration(value: string): void {
    this.form.duration = value;
    this.onDurationChange();
  }

  prevMonth(): void {
    if (this.viewMonth === 0) {
      this.viewMonth = 11;
      this.viewYear -= 1;
    } else {
      this.viewMonth -= 1;
    }
    this.ensureSelectedDayInMonth();
  }

  nextMonth(): void {
    if (this.viewMonth === 11) {
      this.viewMonth = 0;
      this.viewYear += 1;
    } else {
      this.viewMonth += 1;
    }
    this.ensureSelectedDayInMonth();
  }

  selectDay(cell: CalendarCell): void {
    if (cell.muted) {
      return;
    }
    this.form.selectedDay = cell.day;
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

  private ensureSelectedDayInMonth(): void {
    const max = new Date(this.viewYear, this.viewMonth + 1, 0).getDate();
    if (this.form.selectedDay > max) {
      this.form.selectedDay = max;
    }
  }
}
