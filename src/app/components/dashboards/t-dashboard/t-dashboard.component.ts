import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  MOCK_TENANT_PROFILE,
  MOCK_AVAILABLE_UNITS,
  MOCK_NEXT_PAYMENT,
  MOCK_TENANT_LEASE,
  MOCK_TENANT_KPIS,
  MOCK_MAINTENANCE_REQUESTS,
  MOCK_ANNOUNCEMENTS,
  MOCK_PAYMENT_SCHEDULE,
  TenantProfile,
  NextPayment,
  TenantLease,
  TenantKpi,
  MaintenanceRequestItem,
  AnnouncementItem,
  PaymentScheduleItem,
} from './t-dashboard.data';

@Component({
  selector: 'app-t-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './t-dashboard.component.html',
  styleUrls: ['./t-dashboard.component.scss'],
})
export class TDashboardComponent {
  public tenant: TenantProfile = MOCK_TENANT_PROFILE;
  public availableUnits: string[] = MOCK_AVAILABLE_UNITS;
  public selectedUnit: string = MOCK_AVAILABLE_UNITS[0];

  public nextPayment: NextPayment = MOCK_NEXT_PAYMENT;
  public lease: TenantLease = MOCK_TENANT_LEASE;
  public kpis: TenantKpi[] = MOCK_TENANT_KPIS;
  public maintenanceRequests: MaintenanceRequestItem[] = MOCK_MAINTENANCE_REQUESTS;
  public announcements: AnnouncementItem[] = MOCK_ANNOUNCEMENTS;
  public paymentSchedule: PaymentScheduleItem[] = MOCK_PAYMENT_SCHEDULE;

  public isUnitDropdownOpen = false;

  public toggleUnitDropdown(): void {
    this.isUnitDropdownOpen = !this.isUnitDropdownOpen;
  }

  public selectUnit(unit: string): void {
    this.selectedUnit = unit;
    this.isUnitDropdownOpen = false;
  }

  public get leaseProgressPercentage(): number {
    if (!this.lease.totalDays || this.lease.totalDays === 0) {
      return 0;
    }
    const pct = (this.lease.currentDay / this.lease.totalDays) * 100;
    return Math.min(Math.max(pct, 0), 100);
  }

  public getMaintenanceStatusClass(status: string): string {
    switch (status) {
      case 'In progress':
        return 't-badge--info';
      case 'New':
        return 't-badge--warning';
      case 'Resolved':
        return 't-badge--success';
      default:
        return 't-badge--neutral';
    }
  }

  public getPaymentStatusClass(status: string): string {
    switch (status) {
      case 'Cleared':
        return 't-badge--success';
      case 'Upcoming':
        return 't-badge--warning';
      case 'Scheduled':
        return 't-badge--neutral';
      default:
        return 't-badge--neutral';
    }
  }

  public getAnnouncementBadgeClass(badge: string): string {
    switch (badge) {
      case 'Building':
        return 't-badge--neutral';
      case 'Amenities':
        return 't-badge--indigo';
      case 'Safety':
        return 't-badge--orange';
      default:
        return 't-badge--neutral';
    }
  }
}
