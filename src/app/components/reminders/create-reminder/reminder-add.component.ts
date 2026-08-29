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

    const code = this.route.snapshot.queryParams['code'];
    if (code) {
      this.isEdit = true;
      this.reminderCode = code;
      this.loadReminderDetails();
    }
  }

  loadUsers(): void {
    this.portfolioService.getMasterByType({
      typeId: 19,
      filterId: 0,
      filterText: 'S',
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult.table) {
          this.userOptions = res.objResult.table.map((u: any) => ({
            code: u.code || u.id || '',
            name: u.name || u.lookup_name || u.code || ''
          }));
        }
      },
      error: (err) => console.error('Error loading users:', err)
    });
  }

  loadReminderDetails(): void {
    this.portfolioService.getMasterByType({
      typeId: 42,
      filterId: 0,
      filterText: this.reminderCode,
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res && res.statusCode === '200' && res.objResult) {
          const detail = res.objResult.reminders?.[0] || res.objResult.table?.[0] || {};
          
          this.form = {
            title: detail.title || '',
            todo: detail.todo || detail.description || '',
            date: this.formatDateForInput(detail.reminder_date || detail.due_date),
            time: this.formatTimeForInput(detail.reminder_date || detail.due_date),
            priority: (detail.priority || 'Low') as ReminderPriority,
            status: (detail.status_name || detail.status || 'Pending') as ReminderStatus,
            recurring: !!(detail.recurring || detail.is_recurring),
            paused: !!detail.paused,
            repeatEvery: detail.repeat_every || null,
            interval: String(detail.interval || '1'),
            until: detail.until ? this.formatDateForInput(detail.until) : ''
          };

          if (detail.participants || detail.users) {
            const rawUsers = String(detail.participants || detail.users).split(',');
            this.assignees = rawUsers.map(code => {
              const matched = this.userOptions.find(u => u.code === code);
              return matched || { code, name: code };
            });
          }
        }
      },
      error: (err) => console.error('Error loading reminder details:', err)
    });
  }

  formatDateForInput(dateStr: string): string {
    if (!dateStr) return '';
    try {
      const dt = new Date(dateStr);
      if (isNaN(dt.getTime())) return dateStr;
      const d = String(dt.getDate()).padStart(2, '0');
      const m = String(dt.getMonth() + 1).padStart(2, '0');
      const y = dt.getFullYear();
      return `${d}-${m}-${y}`;
    } catch {
      return dateStr;
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
      hours = hours ? hours : 12; // the hour '0' should be '12'
      return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
    } catch {
      return '';
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
    const request = {
      userid: currentUser?.userId || 1,
      company_id: currentUser?.companyId || 1,
      clientId: currentUser?.clientId || '74BB6922',
      source: 'web',
      languageid: 1,
      code: this.reminderCode || '',
      title: this.form.title,
      todo: this.form.todo,
      reminder_date: this.parseInputDate(this.form.date) + 'T' + (this.form.time || '00:00:00'),
      priority: this.form.priority,
      status: this.form.status === 'Completed' ? 177 : 176,
      recurring: this.form.recurring,
      paused: this.form.paused,
      repeat_every: this.form.repeatEvery || '',
      interval: Number(this.form.interval) || 1,
      participants: this.assignees.map(a => a.code || a).join(',')
    };

    this.portfolioService.saveReminder(request).subscribe({
      next: (res) => {
        if (res && (res.statusCode === 200 || res.statusCode === '200' || res.isSuccess)) {
          this.toastr.success(res.message || 'Reminder saved successfully');
          this.cancel();
        } else {
          this.toastr.error(res.message || 'Failed to save reminder');
        }
      },
      error: (err) => {
        console.error('Error saving reminder:', err);
        this.toastr.error('An error occurred while saving the reminder');
      }
    });
  }
}
