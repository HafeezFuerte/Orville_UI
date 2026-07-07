import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import {DashboardService} from '../dashboard.service'
import { AuthService } from '../../../shared/services/auth.service';
import { forkJoin, Subject } from 'rxjs';
import { CalendarView, CalendarEvent, CalendarModule } from 'angular-calendar';
import { startOfDay, endOfDay, setHours, setMinutes, isSameMonth, isSameDay } from 'date-fns';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

const colors: any = {
  red: {
    primary: '#705ec8',
    secondary: '#6958be',
  },
  blue: {
    primary: '#5a66f1',
    secondary: '#dee0fc',
  },
  yellow: {
    primary: '#ffab00',
    secondary: '#f3a403',
  },
};

@Component({
  selector: 'app-my-insights',
  standalone: true,
  imports: [CommonModule, SharedModule, CalendarModule, FormsModule, TranslateModule],
  templateUrl: './my-insights.component.html',
  styleUrls: ['./my-insights.component.scss']
})
export class MyInsightsComponent implements OnInit {
  // Dashboard Data
  employeeDetails: any;
  residentCountryName: string = 'Loading...';
  residentCityName: string = 'Loading...';
  isLoading: boolean = true;

  // Calendar & Attendance
  CalendarView = CalendarView;
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];
  attendanceSummary = {
    total: 0,
    present: 0,
    absent: 0,
    weekends: 0
  };
  activeDayIsOpen: boolean = false;
  showAttendanceSidebar: boolean = true;
  calendarSearchDate: any = new Date();
  currentEmpName: string = '';
  showRectificationForm: boolean = false;
  rectificationDate: any = new Date();
  rectificationCheckIn: string = '';
  rectificationCheckOut: string = '';
  rectificationReason: string = '';
  rectificationMaxDate: Date = new Date();

  // Masters for Mapping
  worksites: any[] = [];
  departments: any[] = [];
  employeeTypes: any[] = [];
  sponsors: any[] = [
    { id: "1", name: "web.Employee.CreateEmployee.lblSederConstruction" },
    { id: "2", name: "web.Employee.CreateEmployee.lblSederGroup" },
    { id: "3", name: "web.Employee.CreateEmployee.lblSponsorOther" }
  ];

  // Leaves & Loans
  assignedLeaves: any[] = [];
  assignedLoans: any[] = [];

  constructor(
    private dashboardPortalService: DashboardService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loadDashboard();
  }


  loadDashboard() {
    const user = this.authService.currentUserValue;
    const empCode = localStorage.getItem('empCode') || '';
    const userId = user?.userId || localStorage.getItem('userId') || 120;
    const companyId = user?.companyId || localStorage.getItem('companyId') || 1;

    const payload = {
      typeId: 7,
      filterId: 0,
      filterText: empCode,
      filterText1: "",
      userId: Number(userId),
      companyId: Number(companyId)
    };

    const mastersPayload = {
      typeId: 4,
      filterId: 0,
      filterText: "",
      filterText1: "",
      userId: Number(userId),
      companyId: Number(companyId)
    };

    this.isLoading = true;
    
    // Fetch both employee details and masters
    forkJoin({
      details: this.dashboardPortalService.getDashboard(payload) 
    }).subscribe({
      next: (res: any) => {
        // Handle Employee Details
        if (res.details.statusCode === "200") {
          const detObj = typeof res.details.objResult === 'string' ? JSON.parse(res.details.objResult) : res.details.objResult;
          this.employeeDetails = detObj.table[0];
        } 

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching dashboard data:', err);
        this.isLoading = false;
        this.residentCountryName = 'Error';
        this.residentCityName = 'Error';
      }
    });
  }
 

  private parseTime(baseDate: Date, timeStr: string): Date | null {
    if (!timeStr) return null;
    const timeRegex24 = /^(\d{1,2}):(\d{2})$/;
    const matches = timeStr.match(timeRegex24);
    if (!matches) return null;

    const hours = parseInt(matches[1], 10);
    const minutes = parseInt(matches[2], 10);
    
    return setMinutes(setHours(new Date(baseDate), hours), minutes);
  }

  onActiveDayIsOpenChange(isOpen: boolean) {
    this.activeDayIsOpen = isOpen;
  }

  dayClicked(date: Date): void {
    if (isSameMonth(date, this.viewDate)) {
      if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true)) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  toggleAttendanceSidebar() {
    this.showAttendanceSidebar = !this.showAttendanceSidebar;
  }
   

  onCancelRectification() {
    this.showRectificationForm = false;
  }

  onSaveRectification() {
     // For this mockup, we'll just show a success toast if we had it, but for now we close the form
     this.showRectificationForm = false;
     // In a real app, this would call personalService.saveAttendanceRectification
  }
 

  public getDropdownName(dropdown: any[], id: any): string {
    const item = dropdown.find(i => i.id == id);
    return item ? item.name : '-';
  }

  getEmpInitials(): string {
    const name = this.currentEmpName || 'U';
    return name.trim().charAt(0).toUpperCase();
  }

  calculatePersonalStats() {
    const dob = this.employeeDetails.dob || this.employeeDetails.DOB || this.employeeDetails.dateOfBirth;
    if (dob) {
      const age = this.calculateDiffInYears(dob);
      this.employeeDetails.age = age > 0 ? `${age} Years` : 'N/A';
    } else {
      this.employeeDetails.age = 'N/A';
    }
  }

  calculateDiffInYears(dateStr: string): number {
    if (!dateStr || typeof dateStr !== 'string') return 0;
    
    let birthDate: Date;
    
    // Check if it's DD/MM/YYYY format
    if (dateStr.includes('/') && dateStr.split('/')[0].length <= 2) {
      const parts = dateStr.split('/');
      birthDate = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
    } else {
      // Use native Date constructor for ISO and other standard formats
      birthDate = new Date(dateStr);
    }
    
    if (isNaN(birthDate.getTime())) return 0;
    
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      years--;
    }
    
    return years > 0 ? years : 0;
  }
}