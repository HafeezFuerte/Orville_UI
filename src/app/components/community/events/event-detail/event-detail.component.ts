import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EventRow, getEventById } from '../events.data';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.scss'
})
export class EventDetailComponent implements OnInit, OnDestroy {
  detail: EventRow = getEventById('658');
  showActionMenu = false;
  showPreview = false;
  openSections: Record<string, boolean> = {
    property: true,
    information: true,
    settings: true
  };

  actionOptions = [
    { label: 'Edit Event', asset: 'assets/images/action-menu/pencil.svg', danger: false },
    { label: 'Publish', asset: 'assets/images/action-menu/files.svg', danger: false },
    { label: 'Archive', asset: 'assets/images/action-menu/trash.svg', danger: true }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.detail = getEventById(params.get('id'));
    });
  }

  ngOnDestroy(): void {
    this.closePreview();
  }

  get eventTimeRange(): string {
    return `${this.detail.startTime} - ${this.detail.endTime}`;
  }

  get eventCity(): string {
    const parts = this.detail.location.split(',').map((p) => p.trim()).filter(Boolean);
    return parts.length ? parts[parts.length - 1] : '—';
  }

  get previewStatusLabel(): string {
    if (this.detail.status === 'Cancelled') {
      return 'Cancelled Event';
    }
    return 'Upcoming Event';
  }

  goBack(): void {
    void this.router.navigate(['/community/events']);
  }

  goToEdit(): void {
    void this.router.navigate(['/community/events/new']);
  }

  openPreview(): void {
    this.showActionMenu = false;
    this.showPreview = true;
    document.body.classList.add('event-preview-open');
    document.body.style.overflow = 'hidden';
  }

  closePreview(): void {
    this.showPreview = false;
    document.body.classList.remove('event-preview-open');
    document.body.style.overflow = '';
  }

  toggleActionMenu(event: Event): void {
    event.stopPropagation();
    this.showActionMenu = !this.showActionMenu;
  }

  onAction(label: string): void {
    this.showActionMenu = false;
    if (label === 'Edit Event') {
      this.goToEdit();
    }
  }

  toggleSection(key: string): void {
    this.openSections[key] = !this.openSections[key];
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.showPreview) {
      this.closePreview();
    }
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showActionMenu = false;
  }
}
