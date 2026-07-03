import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CalendarModule, CalendarView, CalendarEvent } from 'angular-calendar';
import { FlatpickrModule } from 'angularx-flatpickr';
import { Subject } from 'rxjs';
import { isSameDay, isSameMonth } from 'date-fns';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shared-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    CalendarModule,
    FlatpickrModule
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class SharedCalendarComponent {
  @Input() events: CalendarEvent[] = [];
  @Input() viewDate: Date = new Date();
  @Input() view: CalendarView = CalendarView.Month;
  @Input() activeDayIsOpen: boolean = false;
  @Output() activeDayIsOpenChange = new EventEmitter<boolean>();
  @Input() refresh: Subject<any> = new Subject();
  @Input() showSidebarToggle: boolean = true;
  @Input() showRectificationList: boolean = true;
  @Input() showAttendanceSidebar: boolean = true;
  @Input() calendarSearchDate: any = new Date();
  @Input() empCode: string = '';
  @Input() currentEmpName: string = '';
  @Input() showListViewBtn: boolean = true;

  private router = inject(Router);
  
  @Input() customCellTemplate?: any;
  @Input() customWeekHeaderTemplate?: any;

  @ViewChild('defaultCellTemplate', { static: true }) defaultCellTemplateRef!: TemplateRef<any>;
  @ViewChild('defaultWeekHeaderTemplate', { static: true }) defaultWeekHeaderTemplateRef!: TemplateRef<any>;

  get cellTemplateToUse(): any {
    return this.customCellTemplate || this.defaultCellTemplateRef;
  }

  get weekHeaderTemplateToUse(): any {
    return this.customWeekHeaderTemplate || this.defaultWeekHeaderTemplateRef;
  }

  @Output() viewChange = new EventEmitter<CalendarView>();
  @Output() viewDateChange = new EventEmitter<Date>();
  @Output() searchClicked = new EventEmitter<Date>();
  @Output() sidebarToggle = new EventEmitter<void>();
  @Output() dayClicked = new EventEmitter<Date>();
  @Output() eventClicked = new EventEmitter<CalendarEvent>();

  CalendarView = CalendarView;

  setView(view: CalendarView) {
    this.view = view;
    this.viewChange.emit(view);
  }

  onSearch() {
    this.searchClicked.emit(this.calendarSearchDate);
  }

  toggleSidebar() {
    this.sidebarToggle.emit();
  }

  handleDayClick(date: Date, events: CalendarEvent[]) {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.activeDayIsOpenChange.emit(this.activeDayIsOpen);
      this.viewDate = date;
      this.viewDateChange.emit(date);
      this.dayClicked.emit(date);
    }
  }

  handleEventClick(event: CalendarEvent) {
    this.eventClicked.emit(event);
  }

  navigateToList() {
    this.router.navigate(['/approvals'], { 
      queryParams: { empCode: this.empCode } 
    });
  }

  exportToExcel() {
    const headers = ['Date', 'Status', 'Details'];
    const rows = this.events.map(event => {
      const date = event.start.toLocaleDateString();
      const entry = event.meta?.entry;
      let status = 'Unknown';
      if (entry) {
        if (entry.leave_type > 0) status = 'Leave';
        else status = entry.attendance_status || 'Unknown';
      }
      return [date, status, event.title];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `attendance_export_${this.empCode || 'employee'}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  exportToPDF() {
    window.print();
  }
}
