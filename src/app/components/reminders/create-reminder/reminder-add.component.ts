import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { ReminderPriority, ReminderStatus } from '../reminders.data';
import { PortfolioService } from '../../portfolio/services/portfolio.service';
import { CommonService } from '../../../services/common.service';
import { Common_TabsService } from '../../portfolio/services/common_tabs.service';
import { FlowbiteDatepickerDirective } from '../../../shared/directives/flowbite-datepicker.directive';
@Component({
  selector: 'app-reminder-add',
  standalone: true,
  imports: [CommonModule, FormsModule,FlowbiteDatepickerDirective, RouterModule, NgSelectModule],
  templateUrl: './reminder-add.component.html',
  styleUrl: './reminder-add.component.scss',
})
export class ReminderAddComponent implements OnInit {
  userOptions: any[] = [];
  readonly priorityOptions: ReminderPriority[] = ['Low', 'Medium', 'High'];
  readonly statusOptions: ReminderStatus[] = ['Pending', 'Completed'];
  repeatOptions :any=[];// ['Day', 'Week', 'Month', 'Year'];
  attachments :any=[];
  selectedFiles: string[] = [];
  rawFileObjects: File[] = [];

  form = {
    title: '',
    todo: '',
    date: '',
    time: '',
    priority: 'Low' as ReminderPriority,
    status: 'Pending' as ReminderStatus,
    recurring: false,
    paused: false,
    assignees:null as any | null,
    repeatEvery: null as string | null,
    interval: '1',
    until: '',
  };
  currentUser = this.commonService.getCurrentUser();
  isEdit = false;
  reminderCode :any ='';

  private pendingUserCodes: string[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private portfolioService: PortfolioService,
    private commonService: CommonService,
    private toastr: ToastrService,private commontabservice: Common_TabsService
  ) {
    const date = this.route.snapshot.queryParamMap.get('date');
    if (date) {
      this.form.date = date;
    }
  }

  ngOnInit(): void {
    this.loadUsers();
    this.route.paramMap.subscribe((params) => {
      this.reminderCode=params.get('code'); 
      if(this.reminderCode){
        this.isEdit = true; 
        this.loadReminderDetails();
      }
    });  
    this.loadLookup(2, 13, 'repeatOptions', '');
  }

  loadUsers(): void {
    const currentUser = this.commonService.getCurrentUser();
    this.portfolioService.getMasterByType({
      typeId: 19,
      filterId: 0,
      filterText: 'S',
      filterText1: '',
      userId: currentUser?.userId || 1,
      clientId: currentUser?.clientId || "74BB6922",
      companyId: currentUser?.companyId || 1
    }).subscribe({
      next: (res: any) => {
        if (res && (res.statusCode == 200 || res.statusCode == '200') && res.objResult && res.objResult.table) {
          this.userOptions = res.objResult.table.map((u: any) => ({
            code: u.code || u.id || u.user_code || '',
            name: u.name || u.lookup_name || u.user_name || u.first_name || u.full_name || u.code || ''
          }));
          // if (this.pendingUserCodes.length > 0) {
          //   this.setAssigneesFromCodes(this.pendingUserCodes);
          // }
        }
      },
      error: (err) => console.error('Error loading users:', err)
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
        if (res.statusCode == 200 && res.objResult && res.objResult.table) { 
          (this as any)[targetProperty] = res.objResult.table;
        }
        else
        this.toastr.error("No record[s] found");
      },
      error: (err) => {
        console.error(`Error fetching lookup ${filterId}:`, err);
      }
    });
  }
 

  parseRecurringCycle(val: any): string | null {
    if (!val) return null;
    const v = String(val).toLowerCase();
    if (v === '1' || v.includes('day')) return 'Day';
    if (v === '2' || v.includes('week')) return 'Week';
    if (v === '3' || v.includes('month')) return 'Month';
    if (v === '4' || v.includes('year')) return 'Year';
    return String(val);
  }
  loadReminderDetails(): void { 
    this.commontabservice.getMasterByType({
      typeId: 76,
      filterId: 0,
      filterText: this.reminderCode,
      filterText1: '',
      userId: this.currentUser?.userId || 1,
      clientId: this.currentUser?.clientId || "74BB6922",
      companyId: this.currentUser?.companyId || 1
    }).subscribe({
      next: (res: any) => {
        if (res && (res.statusCode == 200 || res.statusCode === '200') && res.objResult) {
          const temp = res.objResult.reminder?.[0] || res.objResult.reminders?.[0] || res.objResult.table?.[0] || {}; 
         
          const titleVal = temp.title  || ''; 
          this.form = {
            title: titleVal, 
            todo: temp.to_do,
            date:  this.commonService.formatDateForInput(temp.reminder_date)  || '',
            time:temp.time,
            priority:temp.priority,
            status: temp.status_name,
            assignees:'',
            recurring: temp.recurring_reminder !== undefined && temp.recurring_reminder !== null ?  true  :false,
            paused: temp.pause_reminder !== undefined ?   true : false,
            repeatEvery: temp.recurring_cycle,
            interval: temp.interval,
            until: this.commonService.formatDateForInput(temp.until_date),
             
          };
          setTimeout(() => {
            this.form.assignees=temp.user_codes.split(',')
            .map((x:any) => x.trim())
           }, 500);
           if(res.objResult.table2){
            this.attachments= res.objResult.table2 || [];  
          }
        } 

      },
      error: (err) => console.error('Error loading reminder details:', err)
    });
  } 
  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    if (!files.length) {
      return;
    }
    this.rawFileObjects = [...this.rawFileObjects, ...files];
    this.selectedFiles = [...this.selectedFiles, ...files.map((f) => f.name)];
    input.value = '';
  }

  removeFile(name: string): void {
    this.selectedFiles = this.selectedFiles.filter((f) => f !== name);
  }

  cancel(): void {
    void this.router.navigate(['/reminders']);
  }

  save(): void {
    const errors: string[] = [];
    if (!this.form.title.trim()) errors.push('Title is required.');
    if (!this.form.assignees.length) errors.push('At least one assignee is required.');
    if (!this.form.date.trim()) errors.push('Reminder Date is required.');

    if (errors.length > 0) {
      this.toastr.error(errors.join('<br>'), 'Validation', {
        enableHtml: true,
        timeOut: 5000,
        positionClass: 'toast-top-right'
      });
      return;
    }

    const currentUser = this.commonService.getCurrentUser();
     
    let recurringCycleId = 0;
    if (this.form.repeatEvery) {
      const cycleStr = String(this.form.repeatEvery).toLowerCase();
      if (cycleStr.includes('day')) recurringCycleId = 1;
      else if (cycleStr.includes('week')) recurringCycleId = 2;
      else if (cycleStr.includes('month')) recurringCycleId = 3;
      else if (cycleStr.includes('year')) recurringCycleId = 4;
      else if (!isNaN(Number(this.form.repeatEvery))) recurringCycleId = Number(this.form.repeatEvery);
    }

    const formattedDate = this.commonService.parseInputDate(this.form.date);
    const formattedTime = this.form.time || '00:00:00'; 
    const untilDateTime = this.form.until ? `${this.commonService.parseInputDate(this.form.until)}T00:00:00` : `${formattedDate}T00:00:00`;

    const request = {
      userid: currentUser?.userId || 1,
      company_id: currentUser?.companyId || 1,
      clientId: currentUser?.clientId || '74BB6922',
      source: 'web',
      languageid: 1,
      code: this.reminderCode || '',
      title: this.form.title,
      user_codes: this.form.assignees.join(',') ||  "",
      to_do: this.form.todo,
      priority: this.form.priority,
      time:formattedTime,
      reminder_date: formattedDate,
      status:296,
      recurring_reminder: !!this.form.recurring,
      pause_reminder: !!this.form.paused,
      file_paths: '',
      recurring_cycle: recurringCycleId,
      interval: Number(this.form.interval) || 1,
      until_date: untilDateTime
    };

    const formData = new FormData();
    formData.append('reqObject', JSON.stringify(request));
    this.rawFileObjects.forEach(file => {
      formData.append('file_paths', file);
    });

    this.portfolioService.saveReminder(formData).subscribe({
      next: (res) => {
        if (res && (res.statusCode === 200 || res.statusCode === '200' || res.isSuccess)) {
          //const codeKey = this.reminderCode || res.objResult?.table?.[0]?.code || res.objResult?.code || '';
          // if (codeKey) {
          //   try {
          //     localStorage.setItem(`reminder_extra_${codeKey}`, JSON.stringify({
          //       title: this.form.title,
          //       todo: this.form.todo,
          //       date: this.form.date,
          //       time: this.form.time,
          //       priority: this.form.priority,
          //       status: this.form.status,
          //       recurring: this.form.recurring,
          //       paused: this.form.paused,
          //       repeatEvery: this.form.repeatEvery,
          //       interval: this.form.interval,
          //       until: this.form.until,
          //       assignees: this.assignees
          //     }));
          //   } catch (e) {
          //     console.error('Error writing reminder extra local storage:', e);
          //   }
          // }

          let msg = res.message || 'Reminder saved successfully';
          if (!msg || msg.trim() === 'LBL_SUCCESS' || msg.toUpperCase().includes('LBL_SUCCESS')) {
            msg = 'Success';
          }
          this.toastr.success(msg);
          this.cancel();
        } else {
          let msg = res.message || 'Failed to save reminder';
          if (msg.includes('LBL_')) msg = 'Failed to save reminder';
          this.toastr.error(msg);
        }
      },
      error: (err) => {
        console.error('Error saving reminder:', err);
        this.toastr.error('An error occurred while saving the reminder');
      }
    });
  }
}
