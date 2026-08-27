import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { ReminderPriority, ReminderStatus } from '../reminders.data';

@Component({
  selector: 'app-reminder-add',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule],
  templateUrl: './reminder-add.component.html',
  styleUrl: './reminder-add.component.scss',
})
export class ReminderAddComponent {
  readonly userOptions = ['Angela Moore', 'Hafeez Hafeez', 'Rehan Asi', 'Zainab Hassan'];
  readonly priorityOptions: ReminderPriority[] = ['Low', 'Medium', 'High'];
  readonly statusOptions: ReminderStatus[] = ['Pending', 'Completed'];
  readonly repeatOptions = ['Day', 'Week', 'Month', 'Year'];

  assignees: string[] = [];
  assigneeQuery = '';
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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    const date = this.route.snapshot.queryParamMap.get('date');
    if (date) {
      this.form.date = date;
    }
  }

  get filteredUserOptions(): string[] {
    const q = this.assigneeQuery.trim().toLowerCase();
    return this.userOptions.filter(
      (u) => !this.assignees.includes(u) && (!q || u.toLowerCase().includes(q))
    );
  }

  addAssignee(): void {
    const name = this.assigneeQuery.trim();
    if (!name || this.assignees.includes(name)) {
      return;
    }
    this.assignees = [...this.assignees, name];
    this.assigneeQuery = '';
  }

  pickAssignee(name: string): void {
    if (!this.assignees.includes(name)) {
      this.assignees = [...this.assignees, name];
    }
    this.assigneeQuery = '';
  }

  removeAssignee(name: string): void {
    this.assignees = this.assignees.filter((item) => item !== name);
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
    if (!this.form.title.trim() || !this.assignees.length || !this.form.date.trim()) {
      this.toastr.error('Assign users, title, and date are required.', 'New Reminder');
      return;
    }
    this.toastr.success('Reminder created (presentation only).', 'New Reminder');
    void this.router.navigate(['/reminders']);
  }
}
