import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

export interface EmailSubscriptionItem {
  name: string;
  subscribed: boolean;
}

export type EmailSubFilter = 'All' | 'Subscribed' | 'Unsubscribed';

@Component({
  selector: 'app-email-subscriptions-drawer',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './email-subscriptions-drawer.component.html',
  styleUrl: './email-subscriptions-drawer.component.scss'
})
export class EmailSubscriptionsDrawerComponent {
  @Input() isOpen = false;
  @Input() subscriptions: EmailSubscriptionItem[] = [];
  @Input() globalAllowed = true;
  @Input() subtitle = 'Choose which automated email notifications should be sent.';

  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() closed = new EventEmitter<void>();
  @Output() cleared = new EventEmitter<void>();

  filterOptions: EmailSubFilter[] = ['All', 'Subscribed', 'Unsubscribed'];
  listFilter: EmailSubFilter = 'All';

  get allSelected(): boolean {
    const visible = this.visibleSubscriptions;
    return visible.length > 0 && visible.every((s) => s.subscribed);
  }

  get visibleSubscriptions(): EmailSubscriptionItem[] {
    if (this.listFilter === 'Subscribed') {
      return this.subscriptions.filter((s) => s.subscribed);
    }
    if (this.listFilter === 'Unsubscribed') {
      return this.subscriptions.filter((s) => !s.subscribed);
    }
    return this.subscriptions;
  }

  get subscribedCount(): number {
    return this.subscriptions.filter((s) => s.subscribed).length;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen) {
      this.closeDrawer();
    }
  }

  closeDrawer(): void {
    this.isOpen = false;
    this.isOpenChange.emit(false);
    this.closed.emit();
  }

  clearAll(): void {
    if (!this.globalAllowed) {
      return;
    }
    this.subscriptions.forEach((s) => (s.subscribed = false));
    this.cleared.emit();
  }

  toggleAll(event: Event): void {
    if (!this.globalAllowed) {
      return;
    }
    const checked = (event.target as HTMLInputElement).checked;
    this.visibleSubscriptions.forEach((s) => (s.subscribed = checked));
  }

  toggleOne(sub: EmailSubscriptionItem): void {
    if (!this.globalAllowed) {
      return;
    }
    sub.subscribed = !sub.subscribed;
  }
}
