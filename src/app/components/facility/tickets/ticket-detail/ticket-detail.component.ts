import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { ColumnMenuComponent } from '../../../../shared/components/column-menu/column-menu.component';

type DetailTab = 'overview' | 'messages' | 'notes';

interface TicketNoteRow {
  id: string;
  subject: string;
  content: string;
  via: string;
  noteDate: string;
  createdBy: string;
  files: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SharedTableComponent, ColumnMenuComponent],
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.scss'
})
export class TicketDetailComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  activeTab: DetailTab = 'overview';
  showActionMenu = false;
  showNoteColumns = false;
  draftMessage = '';
  noteSearch = '';
  notePageSize = 10;
  notePageIndex = 0;

  ticketId = this.route.snapshot.paramMap.get('id') || '92523';

  ticket = {
    title: 'Kitchen Full of Cockroaches',
    id: this.ticketId,
    priority: 'High',
    status: 'Rejected',
    leaseId: '92523',
    property: 'Dubai Marina, Tower A, Dubai',
    unit: 'Apartment 402-PR-4',
    contact: 'James T. Hirai',
    source: '1 month',
    department: 'Facility Group',
    category: 'Maintenance and Repairs',
    created: '07-01-2026',
    description:
      'The kitchen is full of cockroaches and baby cockroaches. They are crawling everywhere, including during daytime with the light on. Every time a cabinet is opened, cockroaches fall out. The tenant reports a serious hygiene and health concern and requests immediate pest-control action.'
  };

  attachments = [
    { name: 'Img_4125.jpg', meta: 'Photo · 1.8 MB', kind: 'photo' as const },
    { name: 'IMG_5732.mov', meta: 'Video · 1.8 MB', kind: 'video' as const },
    { name: 'IMG_5732.mov', meta: 'Video · 1.8 MB', kind: 'video' as const },
    { name: 'IMG_5732.mov', meta: 'Video · 1.8 MB', kind: 'video' as const }
  ];

  recentTickets = [
    { title: 'Kitchen Full of Cockroaches', date: '11-07-2026', status: 'Rejected' },
    { title: 'Recurring disturbance due to late-night talking', date: '11-07-2026', status: 'Open' },
    { title: 'Noise disturbance — Partition Room 404-1', date: '11-07-2026', status: 'Rejected' },
    { title: 'Kitchen Full of Cockroaches', date: '11-07-2026', status: 'Open' },
    { title: 'Noise disturbance — Partition Room 404-1', date: '11-07-2026', status: 'Rejected' },
    { title: 'Recurring disturbance due to late-night talking', date: '11-07-2026', status: 'Closed' }
  ];

  conversations = [
    {
      initials: 'MZ',
      name: 'Mohammed Zaid',
      preview: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      time: '09:58',
      active: true
    }
  ];

  messages = [
    {
      from: 'them' as const,
      initials: 'MZ',
      name: 'Mohammed Zaid',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam interdum finibus mi vel bibendum.',
      meta: 'Mohammed Zaid · 09:58'
    },
    {
      from: 'me' as const,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam interdum finibus mi vel bibendum.',
      meta: 'You · 10:05'
    },
    {
      from: 'them' as const,
      initials: 'MZ',
      name: 'Mohammed Zaid',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam interdum finibus mi vel bibendum.',
      meta: 'Mohammed Zaid · 10:18'
    },
    {
      from: 'me' as const,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam interdum finibus mi vel bibendum.',
      meta: 'You · 10:05'
    },
    {
      from: 'them' as const,
      initials: 'MZ',
      name: 'Mohammed Zaid',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam interdum finibus mi vel bibendum.',
      meta: 'Mohammed Zaid · 10:18'
    }
  ];

  noteColumns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true },
    { key: 'subject', label: 'Subject', visible: true, useTemplate: true },
    { key: 'content', label: 'Content', visible: true, useTemplate: true },
    { key: 'via', label: 'Via', visible: true, useTemplate: true },
    { key: 'noteDate', label: 'Note Date', visible: true, useTemplate: true },
    { key: 'createdBy', label: 'Created By', visible: true, useTemplate: true },
    { key: 'files', label: 'Files', visible: true, useTemplate: true },
    { key: 'createdAt', label: 'Created At', visible: true, useTemplate: true },
    { key: 'updatedAt', label: 'Updated At', visible: true, useTemplate: true },
    { key: 'action', label: 'Action', visible: true, useTemplate: true }
  ];

  noteRows: TicketNoteRow[] = [
    {
      id: '31658',
      subject: 'Move-in condition',
      content: 'Tenant reported minor paint marks near the living room window. Schedule touch-up.....',
      via: 'Portal',
      noteDate: '12-01-2026',
      createdBy: 'Admin User',
      files: 'move-in-photo.jpg',
      createdAt: '10-01-2026, 09:14',
      updatedAt: '12-01-2026, 13:06'
    },
    {
      id: '31658',
      subject: 'Rent reminder',
      content: 'Friendly reminder sent to tenant regarding upcoming rent payment due on the first wo...',
      via: 'Email',
      noteDate: '12-01-2026',
      createdBy: 'Property Manager',
      files: 'property-deed.pdf',
      createdAt: '10-01-2026, 09:14',
      updatedAt: '12-01-2026, 13:06'
    }
  ];

  get visibleNoteColumns() {
    return this.noteColumns.filter((c) => c.visible !== false);
  }

  get filteredNotes(): TicketNoteRow[] {
    const q = this.noteSearch.trim().toLowerCase();
    if (!q) {
      return this.noteRows;
    }
    return this.noteRows.filter(
      (n) =>
        n.subject.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.createdBy.toLowerCase().includes(q) ||
        n.id.includes(q)
    );
  }

  get noteTotalRecords(): number {
    return this.filteredNotes.length;
  }

  get noteTotalPages(): number {
    return Math.max(1, Math.ceil(this.noteTotalRecords / this.notePageSize));
  }

  get noteDisplayPage(): number {
    return this.notePageIndex + 1;
  }

  get noteStartRecord(): number {
    if (!this.noteTotalRecords) {
      return 0;
    }
    return this.notePageIndex * this.notePageSize + 1;
  }

  get noteEndRecord(): number {
    return Math.min((this.notePageIndex + 1) * this.notePageSize, this.noteTotalRecords);
  }

  get paginatedNotes(): TicketNoteRow[] {
    const start = this.notePageIndex * this.notePageSize;
    return this.filteredNotes.slice(start, start + this.notePageSize);
  }

  setTab(tab: DetailTab): void {
    this.activeTab = tab;
    this.showActionMenu = false;
    this.showNoteColumns = false;
  }

  goBack(): void {
    this.router.navigate(['/facility/tickets']);
  }

  goEdit(): void {
    this.router.navigate(['/facility/tickets/create']);
  }

  statusClass(status: string): string {
    switch (status) {
      case 'Open':
        return 'td-chip td-chip--primary';
      case 'Rejected':
        return 'td-chip td-chip--danger-soft';
      case 'Closed':
        return 'td-chip td-chip--success-soft';
      default:
        return 'td-chip td-chip--soft';
    }
  }

  sendMessage(): void {
    const text = this.draftMessage.trim();
    if (!text) {
      return;
    }
    this.messages.push({
      from: 'me',
      text,
      meta: 'You · just now'
    });
    this.draftMessage = '';
  }

  toggleNoteColumn(key: string): void {
    const col = this.noteColumns.find((c) => c.key === key);
    if (col && key !== 'action') {
      col.visible = !col.visible;
    }
  }

  toggleAllNoteColumns(visible: boolean): void {
    this.noteColumns.forEach((col) => {
      if (col.key !== 'action') {
        col.visible = visible;
      }
    });
  }

  onNoteSearch(): void {
    this.notePageIndex = 0;
  }

  onNotePageSizeChange(): void {
    this.notePageIndex = 0;
  }

  previousNotePage(): void {
    if (this.notePageIndex > 0) {
      this.notePageIndex -= 1;
    }
  }

  nextNotePage(): void {
    if (this.noteDisplayPage < this.noteTotalPages) {
      this.notePageIndex += 1;
    }
  }

  goNotePage(page: number): void {
    this.notePageIndex = Math.max(0, Math.min(page - 1, this.noteTotalPages - 1));
  }

  @HostListener('document:click')
  onDocClick(): void {
    this.showActionMenu = false;
    this.showNoteColumns = false;
  }
}
