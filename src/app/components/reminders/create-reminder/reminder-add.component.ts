import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { ReminderPriority, ReminderStatus } from '../reminders.data';
import { PortfolioService } from '../../portfolio/services/portfolio.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-reminder-add',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule],
  templateUrl: './reminder-add.component.html',
  styleUrl: './reminder-add.component.scss',
})
export class ReminderAddComponent implements OnInit {
  userOptions: any[] = [];
  readonly priorityOptions: ReminderPriority[] = ['Low', 'Medium', 'High'];
  readonly statusOptions: ReminderStatus[] = ['Pending', 'Completed'];
  readonly repeatOptions = ['Day', 'Week', 'Month', 'Year'];

  assignees: any[] = [];
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
    repeatEvery: null as string | null,
    interval: '1',
    until: '',
  };

  isEdit = false;
  reminderCode = '';

  private pendingUserCodes: string[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private portfolioService: PortfolioService,
    private commonService: CommonService,
    private toastr: ToastrService
  ) {
    const date = this.route.snapshot.queryParamMap.get('date');
    if (date) {
      this.form.date = date;
    }
  }

  ngOnInit(): void {
    this.loadUsers();

    this.route.queryParams.subscribe(params => {
      const code = params['code'] || params['id'];
      if (code) {
        this.isEdit = true;
        this.reminderCode = code;
        this.loadReminderDetails();
      }
    });
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
          if (this.pendingUserCodes.length > 0) {
            this.setAssigneesFromCodes(this.pendingUserCodes);
          }
        }
      },
      error: (err) => console.error('Error loading users:', err)
    });
  }

  private setAssigneesFromCodes(codeList: string[], cachedAssignees?: any[]): void {
    if (codeList && codeList.length > 0) {
      this.pendingUserCodes = codeList;
    }
    if (cachedAssignees && cachedAssignees.length && (!this.assignees || !this.assignees.length)) {
      this.assignees = cachedAssignees;
    }

    if (this.pendingUserCodes.length > 0) {
      const mapped = this.pendingUserCodes.map(code => {
        const cStr = String(code).trim();
        const matched = this.userOptions.find(u => String(u.code).trim() === cStr || String(u.name).trim() === cStr);
        return matched || { code: cStr, name: cStr };
      });
      if (mapped.length > 0) {
        this.assignees = mapped;
      }
    }
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
    const currentUser = this.commonService.getCurrentUser();
    this.portfolioService.getMasterByType({
      typeId: 42,
      filterId: 0,
      filterText: this.reminderCode,
      filterText1: '',
      userId: currentUser?.userId || 1,
      clientId: currentUser?.clientId || "74BB6922",
      companyId: currentUser?.companyId || 1
    }).subscribe({
      next: (res: any) => {
        if (res && (res.statusCode == 200 || res.statusCode === '200') && res.objResult) {
          const detail = res.objResult.reminder?.[0] || res.objResult.reminders?.[0] || res.objResult.table?.[0] || {};
          
          let localExtra: any = {};
          try {
            const saved = localStorage.getItem(`reminder_extra_${this.reminderCode}`);
            if (saved) localExtra = JSON.parse(saved);
          } catch (e) {
            console.error('Error reading reminder extra local storage:', e);
          }

          const titleVal = detail.title || detail.name || localExtra.title || '';
          const todoVal = detail.to_do || detail.todo || detail.description || detail.notes || localExtra.todo || '';
          const dateVal = detail.reminder_date || detail.due_date || detail.date;
          const priorityVal = detail.priority || localExtra.priority || 'Low';
          const statusVal = (detail.status === 177 || detail.status_name === 'Completed' || detail.status === 'Completed' || localExtra.status === 'Completed') ? 'Completed' : 'Pending';

          this.form = {
            title: titleVal,
            todo: todoVal,
            date: dateVal ? this.formatDateForInput(dateVal) : (localExtra.date || ''),
            time: dateVal ? this.formatTimeForInput(dateVal) : (localExtra.time || ''),
            priority: priorityVal as ReminderPriority,
            status: statusVal as ReminderStatus,
            recurring: detail.recurring_reminder !== undefined ? !!detail.recurring_reminder : (detail.recurring !== undefined ? !!detail.recurring : !!localExtra.recurring),
            paused: detail.pause_reminder !== undefined ? !!detail.pause_reminder : (detail.paused !== undefined ? !!detail.paused : !!localExtra.paused),
            repeatEvery: this.parseRecurringCycle(detail.recurring_cycle || detail.repeat_every || localExtra.repeatEvery),
            interval: String(detail.interval || localExtra.interval || '1'),
            until: detail.until_date || detail.until ? this.formatDateForInput(detail.until_date || detail.until) : (localExtra.until || '')
          };

          const rawUserCodes = detail.user_codes || detail.participants || detail.users || detail.assignee || detail.user_code || '';
          if (rawUserCodes || (localExtra.assignees && localExtra.assignees.length)) {
            const codeList = rawUserCodes ? String(rawUserCodes).split(',') : [];
            this.setAssigneesFromCodes(codeList, localExtra.assignees);
          }
        }
      },
      error: (err) => console.error('Error loading reminder details:', err)
    });
  }

  formatDateForInput(dateStr: string): string {
    if (!dateStr) return '';
    if (typeof dateStr !== 'string') return String(dateStr);
    const s = dateStr.trim();
    if (/^\d{2}[-/]\d{2}[-/]\d{4}$/.test(s)) {
      return s.replace(/\//g, '-');
    }
    try {
      const dt = new Date(s);
      if (isNaN(dt.getTime())) return s;
      const d = String(dt.getDate()).padStart(2, '0');
      const m = String(dt.getMonth() + 1).padStart(2, '0');
      const y = dt.getFullYear();
      return `${d}-${m}-${y}`;
    } catch {
      return s;
    }
  }

  formatTimeForInput(dateStr: string): string {
    if (!dateStr) return '';
    try {
      const dt = new Date(dateStr);
      if (isNaN(dt.getTime())) return '';
      let hours = dt.getHours();
      const minutes = String(dt.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
    } catch {
      return '';
    }
  }

  formatTimeTo24(timeStr: string): string {
    if (!timeStr) return '00:00:00';
    try {
      const match = timeStr.match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
      if (match) {
        let hours = Number(match[1]);
        const minutes = match[2];
        const ampm = match[3];
        if (ampm) {
          if (ampm.toUpperCase() === 'PM' && hours < 12) hours += 12;
          if (ampm.toUpperCase() === 'AM' && hours === 12) hours = 0;
        }
        return `${String(hours).padStart(2, '0')}:${minutes}:00`;
      }
      return timeStr.includes(':') ? timeStr : `${timeStr}:00:00`;
    } catch {
      return '00:00:00';
    }
  }

  parseInputDate(dateStr: string): string {
    if (!dateStr) return new Date().toISOString().split('T')[0];
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const d = Number(parts[0]);
      const m = Number(parts[1]) - 1;
      const y = Number(parts[2]);
      return new Date(y, m, d).toISOString().split('T')[0];
    }
    return new Date(dateStr).toISOString().split('T')[0];
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
    if (!this.assignees.length) errors.push('At least one assignee is required.');
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
    const userCodesVal = this.assignees.map(a => a.code || a.id || a).filter(Boolean).join(',');

    let recurringCycleId = 0;
    if (this.form.repeatEvery) {
      const cycleStr = String(this.form.repeatEvery).toLowerCase();
      if (cycleStr.includes('day')) recurringCycleId = 1;
      else if (cycleStr.includes('week')) recurringCycleId = 2;
      else if (cycleStr.includes('month')) recurringCycleId = 3;
      else if (cycleStr.includes('year')) recurringCycleId = 4;
      else if (!isNaN(Number(this.form.repeatEvery))) recurringCycleId = Number(this.form.repeatEvery);
    }

    const formattedDate = this.parseInputDate(this.form.date);
    const formattedTime = this.form.time ? this.formatTimeTo24(this.form.time) : '00:00:00';
    const reminderDateTime = `${formattedDate}T${formattedTime}`;
    const untilDateTime = this.form.until ? `${this.parseInputDate(this.form.until)}T00:00:00` : `${formattedDate}T00:00:00`;

    const request = {
      userid: currentUser?.userId || 1,
      company_id: currentUser?.companyId || 1,
      clientId: currentUser?.clientId || '74BB6922',
      source: 'web',
      languageid: 1,
      code: this.reminderCode || '',
      title: this.form.title,
      user_codes: userCodesVal,
      to_do: this.form.todo,
      priority: this.form.priority,
      reminder_date: reminderDateTime,
      status: this.form.status === 'Completed' ? 177 : 176,
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
          const codeKey = this.reminderCode || res.objResult?.table?.[0]?.code || res.objResult?.code || '';
          if (codeKey) {
            try {
              localStorage.setItem(`reminder_extra_${codeKey}`, JSON.stringify({
                title: this.form.title,
                todo: this.form.todo,
                date: this.form.date,
                time: this.form.time,
                priority: this.form.priority,
                status: this.form.status,
                recurring: this.form.recurring,
                paused: this.form.paused,
                repeatEvery: this.form.repeatEvery,
                interval: this.form.interval,
                until: this.form.until,
                assignees: this.assignees
              }));
            } catch (e) {
              console.error('Error writing reminder extra local storage:', e);
            }
          }

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
