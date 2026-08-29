import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  AppNotification,
  NOTIFICATION_ROWS,
  NOTIFICATION_TYPES,
  NotificationTypeId,
} from '../notifications.data';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent {
  types = NOTIFICATION_TYPES;
  activeType: NotificationTypeId = 'all';
  private rows: AppNotification[] = [...NOTIFICATION_ROWS];

  get unreadCount(): number {
    return this.rows.filter((row) => row.unread).length;
  }

  get unreadLabel(): string {
    const count = this.unreadCount;
    return count === 1
      ? 'You have 1 unread notification'
      : `You have ${count} unread notifications`;
  }

  get filteredRows(): AppNotification[] {
    if (this.activeType === 'all') {
      return this.rows;
    }
    return this.rows.filter((row) => row.type === this.activeType);
  }

  typeCount(typeId: NotificationTypeId): number {
    if (typeId === 'all') {
      return this.rows.filter((row) => row.unread).length;
    }
    return this.rows.filter((row) => row.type === typeId && row.unread).length;
  }

  setType(typeId: NotificationTypeId): void {
    this.activeType = typeId;
  }

  markAllAsRead(): void {
    this.rows = this.rows.map((row) => ({ ...row, unread: false }));
  }

  markOneRead(item: AppNotification): void {
    this.rows = this.rows.map((row) =>
      row.id === item.id ? { ...row, unread: false } : row
    );
  }
}
