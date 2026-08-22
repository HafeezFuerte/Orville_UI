import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { getVisitorDetail, VisitorDetail, VisitorStatus } from '../visitors.data';

@Component({
  selector: 'app-visitor-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visitor-detail.component.html',
  styleUrl: './visitor-detail.component.scss'
})
export class VisitorDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  showActionMenu = false;
  detail: VisitorDetail = getVisitorDetail('31658');

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.detail = getVisitorDetail(id);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/visitors']);
  }

  goEdit(): void {
    this.router.navigate(['/visitors/create']);
  }

  statusClass(status: VisitorStatus): string {
    switch (status) {
      case 'Checked-in':
        return 'visitor-chip visitor-chip--success';
      case 'Checked-out':
        return 'visitor-chip visitor-chip--info';
      default:
        return 'visitor-chip visitor-chip--soft';
    }
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showActionMenu = false;
  }
}
