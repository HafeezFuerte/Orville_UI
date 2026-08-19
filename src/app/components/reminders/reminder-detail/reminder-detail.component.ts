import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { getReminderDetail, ReminderRow } from '../reminders.data';

@Component({
  selector: 'app-reminder-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reminder-detail.component.html'
})
export class ReminderDetailComponent implements OnInit {
  detail: ReminderRow = getReminderDetail('32153');
  showActionMenu = false;
  actionOptions = [
    { label: 'Edit Reminder', asset: 'assets/images/action-menu/pencil.svg', danger: false },
    { label: 'Delete Reminder', asset: 'assets/images/action-menu/archive.svg', danger: true }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.detail = getReminderDetail(params.get('id'));
    });
  }

  goBack(): void {
    void this.router.navigate(['/reminders']);
  }

  toggleActionMenu(event: Event): void {
    event.stopPropagation();
    this.showActionMenu = !this.showActionMenu;
  }

  onAction(label: string): void {
    this.showActionMenu = false;
    if (label === 'Edit Reminder') {
      void this.router.navigate(['/reminders']);
    }
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showActionMenu = false;
  }
}
