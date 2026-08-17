import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  CenterDocument,
  documentStatusChip,
  findCenterDocument
} from './document-center.data';

@Component({
  selector: 'app-document-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.scss']
})
export class DocumentDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);

  public doc: CenterDocument | null = null;

  public confirmReject = false;

  public ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const found = findCenterDocument(params.get('id'));
      this.doc = found ? { ...found } : null;
      this.confirmReject = false;
    });
  }

  public get canReview(): boolean {
    return this.doc?.status === 'Pending';
  }

  public askReject(): void {
    this.confirmReject = true;
  }

  public cancelReject(): void {
    this.confirmReject = false;
  }

  public approve(): void {
    this.confirmReject = false;
    this.setStatus('Approved');
  }

  public reject(): void {
    this.setStatus('Rejected');
    this.confirmReject = false;
  }

  public statusChip(status: string): string {
    return documentStatusChip(status);
  }

  public get isImage(): boolean {
    const name = this.doc?.fileName?.toLowerCase() || '';
    return name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png');
  }

  private setStatus(status: 'Approved' | 'Rejected'): void {
    if (!this.doc || !this.canReview) {
      return;
    }
    this.doc = { ...this.doc, status };
    const source = findCenterDocument(this.doc.id);
    if (source) {
      source.status = status;
    }
  }

  public goBack(): void {
    this.location.back();
  }

  public goToList(): void {
    this.router.navigate(['/documents']);
  }
}
