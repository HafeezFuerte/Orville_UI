import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { SharedTableComponent } from '../../shared/components/shared-table/shared-table.component';
import {
  PROFILE_ASSIGNED_PROPERTIES,
  PROFILE_ASSIGNED_UNITS_LABEL,
  PROFILE_TABS,
  PROFILE_USER,
  ProfileAssignedProperty,
  ProfileTab,
} from './my-profile.data';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SharedTableComponent],
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
})
export class MyProfileComponent {
  readonly tabs = PROFILE_TABS;
  readonly assignedUnitsLabel = PROFILE_ASSIGNED_UNITS_LABEL;

  activeTab: ProfileTab = 'general';
  showPersonalMore = false;
  showColumnDropdown = false;
  pageNo = 0;
  pageSize = 10;
  pageSizeOptions = [10, 25, 50];
  unitFilter = '';
  propertyFilter = '';

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  general = {
    firstName: PROFILE_USER.firstName,
    lastName: PROFILE_USER.lastName,
    email: PROFILE_USER.email,
    username: PROFILE_USER.username,
    country: PROFILE_USER.country,
    phone: PROFILE_USER.phone,
    systemLanguage: PROFILE_USER.systemLanguage,
    timezone: PROFILE_USER.timezone,
    enableNotificationSound: PROFILE_USER.enableNotificationSound,
    emailSignature: PROFILE_USER.emailSignature,
  };

  security = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoStepAuth: PROFILE_USER.twoStepAuth,
  };

  readonly profile = PROFILE_USER;
  private assignedRows: ProfileAssignedProperty[] = [...PROFILE_ASSIGNED_PROPERTIES];

  propertyColumns = [
    { key: 'property', label: 'Property', visible: true, useTemplate: true },
    { key: 'unit', label: 'Unit', visible: true, useTemplate: true },
    { key: 'landlords', label: 'Landlords', visible: true },
    { key: 'tags', label: 'Tags', visible: true },
    { key: 'beds', label: 'Beds', visible: true },
  ];

  readonly countries = [
    'United Arab Emirates (+971)',
    'Saudi Arabia (+966)',
    'Qatar (+974)',
    'India (+91)',
  ];

  readonly languages = ['English', 'Arabic', 'Hindi'];

  readonly timezones = [
    '(GMT+04:00) Abu Dhabi',
    '(GMT+03:00) Riyadh',
    '(GMT+05:30) India Standard Time',
  ];

  constructor(private toastr: ToastrService) {}

  get initials(): string {
    const a = (this.general.firstName || 'H').charAt(0);
    const b = (this.general.lastName || 'H').charAt(0);
    return `${a}${b}`.toUpperCase();
  }

  get displayName(): string {
    return `${this.general.firstName} ${this.general.lastName}`.trim() || PROFILE_USER.fullName;
  }

  get visiblePropertyColumns() {
    return this.propertyColumns.filter((col) => col.visible !== false);
  }

  get allColumnsSelected(): boolean {
    return this.propertyColumns.every((col) => col.visible !== false);
  }

  get filteredAssigned(): ProfileAssignedProperty[] {
    const u = this.unitFilter.trim().toLowerCase();
    const p = this.propertyFilter.trim().toLowerCase();
    return this.assignedRows.filter((row) => {
      const unitOk = !u || row.unit.toLowerCase().includes(u);
      const propOk = !p || row.property.toLowerCase().includes(p);
      return unitOk && propOk;
    });
  }

  get totalAssigned(): number {
    return this.filteredAssigned.length;
  }

  get pagedAssigned(): ProfileAssignedProperty[] {
    const start = this.pageNo * this.pageSize;
    return this.filteredAssigned.slice(start, start + this.pageSize);
  }

  setTab(tab: ProfileTab): void {
    this.activeTab = tab;
    this.showColumnDropdown = false;
  }

  onAssignedSearch(): void {
    this.pageNo = 0;
  }

  toggleColumnDropdown(event: Event): void {
    event.stopPropagation();
    this.showColumnDropdown = !this.showColumnDropdown;
  }

  toggleColumn(key: string): void {
    const col = this.propertyColumns.find((item) => item.key === key);
    if (col) {
      col.visible = col.visible === false ? true : false;
    }
  }

  toggleAllColumns(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.propertyColumns.forEach((col) => (col.visible = checked));
  }

  onSharedTablePageChange(event: PageEvent): void {
    this.pageNo = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  updateProfile(): void {
    this.toastr.success('Profile updated (presentation only).', 'My Profile');
  }

  updatePassword(): void {
    if (!this.security.newPassword || this.security.newPassword !== this.security.confirmPassword) {
      this.toastr.error('New password and confirm password must match.', 'My Profile');
      return;
    }
    this.toastr.success('Password updated (presentation only).', 'My Profile');
    this.security.currentPassword = '';
    this.security.newPassword = '';
    this.security.confirmPassword = '';
  }

  toggleTwoStep(): void {
    this.security.twoStepAuth = !this.security.twoStepAuth;
    this.toastr.info(
      this.security.twoStepAuth ? 'Two-step authentication enabled (presentation).' : 'Two-step authentication turned off.',
      'My Profile'
    );
  }

  signInGoogle(): void {
    this.toastr.info('Google sign-in is not connected yet.', 'My Profile');
  }

  uploadPhoto(): void {
    this.toastr.info('Photo upload is not connected yet.', 'My Profile');
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showColumnDropdown = false;
  }
}
