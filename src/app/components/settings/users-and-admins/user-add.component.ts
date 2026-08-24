import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  MOCK_SETTINGS_USERS,
  USER_NOTIFICATION_OPTIONS,
  UserKind,
} from './users-and-admins.data';

@Component({
  selector: 'app-user-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-add.component.html',
})
export class UserAddComponent implements OnInit {
  userKind: UserKind = 'user';
  editingId: number | null = null;
  photoPreview: string | null = null;

  email = '';
  username = '';
  password = '';
  firstName = '';
  lastName = '';
  country = '';
  phone = '';
  group = '';
  role = '';
  timeZone = 'Abu Dhabi (UTC+4)';
  spokenLanguages = '';
  displayAllTenants = false;

  readonly notificationOptions = USER_NOTIFICATION_OPTIONS;
  selectedNotifications = new Set<string>();

  readonly countryOptions = [
    'United Arab Emirates',
    'Saudi Arabia',
    'India',
    'United Kingdom',
    'United States',
  ];
  readonly groupOptions = ['Operations', 'Finance', 'Support', 'Management'];
  readonly roleOptions = [
    'Collector',
    'Inspector',
    'Manager',
    'Accountant',
    'Admin',
    'Support Technician',
  ];
  readonly timeZoneOptions = [
    'Abu Dhabi (UTC+4)',
    'Dubai (UTC+4)',
    'Riyadh (UTC+3)',
    'UTC',
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const type = (this.route.snapshot.queryParamMap.get('type') || 'user') as UserKind;
    this.userKind = ['user', 'admin', 'technician'].includes(type) ? type : 'user';

    const idParam = this.route.snapshot.queryParamMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      const existing = MOCK_SETTINGS_USERS.find((u) => u.id === id);
      if (existing) {
        this.editingId = existing.id;
        this.userKind = existing.kind;
        this.email = existing.email;
        this.username = existing.username;
        this.firstName = existing.name.split(' ')[0] || '';
        this.lastName = existing.name.split(' ').slice(1).join(' ') || '';
        this.phone = existing.phone;
        this.role = existing.role;
      }
    }
  }

  get pageTitle(): string {
    if (this.editingId != null) {
      return this.userKind === 'admin'
        ? 'Edit Admin'
        : this.userKind === 'technician'
          ? 'Edit Technician'
          : 'Edit User';
    }
    return this.userKind === 'admin'
      ? 'New Admin'
      : this.userKind === 'technician'
        ? 'New Technician'
        : 'New User';
  }

  get breadcrumb(): string {
    return `Users and Admins / ${this.pageTitle}`;
  }

  get allNotificationsSelected(): boolean {
    return this.selectedNotifications.size === this.notificationOptions.length;
  }

  get canSave(): boolean {
    return (
      !!this.email.trim() &&
      !!this.firstName.trim() &&
      !!this.lastName.trim() &&
      !!this.country &&
      !!this.role
    );
  }

  toggleSelectAllNotifications(): void {
    if (this.allNotificationsSelected) {
      this.selectedNotifications.clear();
    } else {
      this.notificationOptions.forEach((n) => this.selectedNotifications.add(n));
    }
    this.selectedNotifications = new Set(this.selectedNotifications);
  }

  isNotificationSelected(label: string): boolean {
    return this.selectedNotifications.has(label);
  }

  toggleNotification(label: string): void {
    if (this.selectedNotifications.has(label)) {
      this.selectedNotifications.delete(label);
    } else {
      this.selectedNotifications.add(label);
    }
    this.selectedNotifications = new Set(this.selectedNotifications);
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.photoPreview = typeof reader.result === 'string' ? reader.result : null;
    };
    reader.readAsDataURL(file);
  }

  cancel(): void {
    this.router.navigate(['/settings/users-and-admins']);
  }

  save(): void {
    if (!this.canSave) {
      return;
    }
    this.router.navigate(['/settings/users-and-admins']);
  }
}
