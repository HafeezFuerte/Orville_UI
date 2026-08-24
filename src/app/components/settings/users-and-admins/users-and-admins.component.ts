import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  MOCK_SETTINGS_USERS,
  SettingsUserRow,
  UserKind,
  UserStatus,
} from './users-and-admins.data';

type MainTab = 'users' | 'admins' | 'technicians';
type StatusFilter = 'all' | UserStatus;

@Component({
  selector: 'app-users-and-admins',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users-and-admins.component.html',
})
export class UsersAndAdminsComponent {
  mainTab: MainTab = 'users';
  statusFilter: StatusFilter = 'all';
  searchQuery = '';
  roleFilter = '';

  users: SettingsUserRow[] = [...MOCK_SETTINGS_USERS];

  readonly mainTabs: { id: MainTab; label: string }[] = [
    { id: 'users', label: 'Users' },
    { id: 'admins', label: 'Admins' },
    { id: 'technicians', label: 'Support Technicians' },
  ];

  readonly statusTabs: { id: StatusFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'blocked', label: 'Blocked' },
  ];

  readonly roleOptions = [
    'Collector',
    'Inspector',
    'Manager',
    'Accountant',
    'Admin',
    'Support Technician',
  ];

  constructor(private router: Router) {}

  get pageTitle(): string {
    switch (this.mainTab) {
      case 'admins':
        return 'Admins';
      case 'technicians':
        return 'Support Technicians';
      default:
        return 'Users';
    }
  }

  get addLabel(): string {
    switch (this.mainTab) {
      case 'admins':
        return 'Add New Admin';
      case 'technicians':
        return 'Add New Technician';
      default:
        return 'Add New User';
    }
  }

  get kindForTab(): UserKind {
    switch (this.mainTab) {
      case 'admins':
        return 'admin';
      case 'technicians':
        return 'technician';
      default:
        return 'user';
    }
  }

  get filteredRows(): SettingsUserRow[] {
    const kind = this.kindForTab;
    const q = this.searchQuery.trim().toLowerCase();
    return this.users.filter((row) => {
      if (row.kind !== kind) {
        return false;
      }
      if (this.statusFilter !== 'all' && row.status !== this.statusFilter) {
        return false;
      }
      if (this.roleFilter && row.role !== this.roleFilter) {
        return false;
      }
      if (!q) {
        return true;
      }
      return (
        row.name.toLowerCase().includes(q) ||
        row.email.toLowerCase().includes(q) ||
        row.username.toLowerCase().includes(q) ||
        row.phone.toLowerCase().includes(q) ||
        row.role.toLowerCase().includes(q)
      );
    });
  }

  get countLabel(): string {
    const n = this.filteredRows.length;
    const noun =
      this.mainTab === 'admins'
        ? 'admin'
        : this.mainTab === 'technicians'
          ? 'technician'
          : 'user';
    return `${n} ${noun}${n === 1 ? '' : 's'}`;
  }

  setMainTab(tab: MainTab): void {
    this.mainTab = tab;
    this.statusFilter = 'all';
    this.roleFilter = '';
    this.searchQuery = '';
  }

  openNew(): void {
    this.router.navigate(['/settings/users-and-admins/new'], {
      queryParams: { type: this.kindForTab },
    });
  }

  openEdit(row: SettingsUserRow): void {
    this.router.navigate(['/settings/users-and-admins/new'], {
      queryParams: { type: row.kind, id: row.id },
    });
  }

  toggleBlock(row: SettingsUserRow): void {
    this.users = this.users.map((u) =>
      u.id === row.id
        ? { ...u, status: u.status === 'active' ? 'blocked' : 'active' }
        : u
    );
  }
}
