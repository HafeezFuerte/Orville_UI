import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReservationStatus } from '../reservations.data';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Common_TabsService } from '../../../portfolio/services/common_tabs.service';
import { CommonService } from '../../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { PortfolioService } from '../../../portfolio/services/portfolio.service';

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
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule, TranslateModule],
  templateUrl: './reservation-add.component.html',
  styleUrls: ['./reservation-add.component.scss'],
})
export class ReservationAddComponent {
  spaces :any=[];// ['Skyline Meeting Room', 'Community Pool Deck', 'Gym Studio'];
  reservers :any=[];// ['Omar Al Mansoori', 'Sara Ibrahim', 'Hassan Qureshi'];
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
    reservation_name:'',
    customDuration: '',
    name: 'Meeting Room A',
    reserve: null as string | null,
    lease: null as string | null,
    email: '',
    phone: '',
    status: 'Confirmed' as ReservationStatus,
    notes: '',
  };
  activeSpaceMeta:any ={};

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
  editId: string='';
  currentUser = this.commonservice.getCurrentUser();
  constructor(private router: Router,private route: ActivatedRoute,private commontabservice : Common_TabsService,
    private commonservice: CommonService,private toastr: ToastrService,
    private translate:TranslateService,private portfolioService:PortfolioService) {}

    
  ngOnInit() {
     this.loadLookup(70,6,'spaces','');
     this.loadLookup(70,7,'spaces','');
     this.route.paramMap.subscribe((params:any) => { 
      this.editId=params.get('code');
      this.loadLookup(70,8,'',this.editId)
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
          if(Typeid==74){
            this.toastr.success("Successfully marked as inactive");  
        }
        else{
          if(filterId==6){
            let agents=res.objResult.table.filter((item:any)=> item.role_type=="G");
            this.reservers=agents;
          }
          if(filterId==7){
            this.spaces=res.objResult.table; 
          }
          if(filterId==8){
            let detail=res.objResult.table[0]; 
            if(detail){ 
              this.form.space=detail.space_code;
              this.form.email=detail.email_address;
              this.form.phone=detail.phone_no;
              this.form.duration=detail.duration;
              this.form.selectedSlot=detail.slot;
              this.form.reserve=detail.agent_code;
              this.form.notes=detail.notes;
              this.form.reservation_name=detail.reservation_name;
              this.viewMonth =new Date(detail.reservation_date).getMonth();
              this.viewYear=new Date(detail.reservation_date).getFullYear();
              this.form.selectedDay=new Date(detail.reservation_date).getDate();
              this.onSpaceChange();
            }
          }
        }
      
        }
        
      },
      error: (err) => {
        console.error(`Error fetching lookup ${filterId}:`, err);
      }
    });
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
    const meta = this.spaces.filter((item:any)=>item.code==this.form.space);
    if (!meta) {
      return;
    }
    this.activeSpaceMeta=meta[0];
    this.form.duration = meta[0].slot_duration;
    this.form.customDuration = meta[0].space_location;
  }
 get getReserveName(): void {
  if(this.form.reserve==null || this.form.reserve=="")
  return;
    const meta = this.reservers.filter((item:any)=>item.code==this.form.reserve);
    if (meta.length>0) {
      return meta[0].name;
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

    if(this.form.reservation_name==null || this.form.reservation_name==""){
      this.toastr.error("Invalid reservation_name","Warning");
      return;
    }
    if(this.form.email==null || this.form.email==""){
      this.toastr.error("Invalid email address","Warning");
      return;
    }
    if(this.form.space==null || this.form.space==""){
      this.toastr.error("Invalid space selection","Warning");
      return;
    }
    if(this.form.reserve==null || this.form.reserve==""){
      this.toastr.error("Invalid agent selection","Warning");
      return;
    }
    let d = new Date(this.viewYear, this.viewMonth, this.form.selectedDay);
    const request = {
      userid: this.currentUser?.userId || 1,
      company_id: this.currentUser?.companyId || 1,
      clientId: this.currentUser?.clientId || '74BB6922',
      source: 'web',
      languageid: 1,
      code:this.editId || '',
      space_code: this.form.space || '',
      reservation_name:this.form.reservation_name || '',
      reserve_code: this.form.reserve || '',
      email_address: this.form.email || '',
      phone_no: this.form.phone,
      status: this.form.status,
      notes: this.form.notes,
      reserve_date:this.commonservice.parseInputDate(d.toString()),
      duration: this.form.duration,
      slot_duration: this.form.selectedSlot,  
    };

    const formData = new FormData();
    formData.append('reqObject', JSON.stringify(request)); 

    this.portfolioService.saveReservation(formData).subscribe({
      next: (res) => {
        if (res && (res.statusCode === 200 || res.statusCode === '200' || res.isSuccess)) {
          const codeKey = this.editId || res.objResult?.table?.[0]?.code || res.objResult?.code || ''; 

          let msg = res.message || this.translate.instant('web.bookings.spaces.msgSavedSuccess');
          if (!msg || msg.trim() === 'LBL_SUCCESS' || msg.toUpperCase().includes('LBL_SUCCESS')) {
            msg = this.translate.instant('web.bookings.spaces.msgSavedSuccess');
          }
          this.toastr.success(msg);
          void this.router.navigate(['/bookings/reservations']);
        } else {
          let msg = res.message || this.translate.instant('web.bookings.spaces.msgSaveFailed');
          if (msg.includes('LBL_')) msg = this.translate.instant('web.bookings.spaces.msgSaveFailed');
          this.toastr.error(msg);
        }
      },
      error: (err) => {
        console.error('Error saving space:', err);
        this.toastr.error(this.translate.instant('web.bookings.spaces.msgSaveError'));
      }
    });
    
  }

  private ensureSelectedDayInMonth(): void {
    const max = new Date(this.viewYear, this.viewMonth + 1, 0).getDate();
    if (this.form.selectedDay > max) {
      this.form.selectedDay = max;
    }
  }
}
