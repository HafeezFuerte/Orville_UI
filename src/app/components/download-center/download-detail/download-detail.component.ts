import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DownloadJob, findDownloadJob } from '../download-center.data';

@Component({
  selector: 'app-download-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './download-detail.component.html',
  styleUrls: ['./download-detail.component.scss']
})
export class DownloadDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);

  public job: DownloadJob | null = null;

  public ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const found = findDownloadJob(params.get('id'));
      this.job = found ? { ...found } : null;
    });
  }

  public get isReady(): boolean {
    return this.job?.status === 'Approved';
  }

  public get isPending(): boolean {
    return this.job?.status === 'Pending';
  }

  public get isRejected(): boolean {
    return this.job?.status === 'Rejected';
  }

  public get initial(): string {
    const name = this.job?.generatedBy?.trim() || '?';
    return name.charAt(0).toUpperCase();
  }

  public get jobReference(): string {
    return this.job?.inspectionId || 'N/A';
  }

  public get heroTitle(): string {
    if (!this.job) {
      return '';
    }
    if (this.isReady) {
      return `${this.job.type} file is ready`;
    }
    if (this.isRejected) {
      return `${this.job.type} file could not be generated`;
    }
    return `${this.job.type} file is generating`;
  }

  public get heroCopy(): string {
    if (this.isReady) {
      return 'Your report has been generated. Click below to save it to your device.';
    }
    if (this.isRejected) {
      return this.job?.failReason || 'Generation failed. This report is not available to download.';
    }
    return 'Your report is still being prepared. You can download it once generation is complete.';
  }

  public download(): void {
    if (!this.job || !this.isReady) {
      return;
    }
    const blob = new Blob(['Orville report placeholder'], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = this.job.document;
    link.click();
    URL.revokeObjectURL(url);
  }

  public retry(): void {
    if (!this.job || !this.isRejected) {
      return;
    }
    this.setStatus('Pending');
  }

  public goBack(): void {
    this.location.back();
  }

  public goToList(): void {
    this.router.navigate(['/downloads']);
  }

  private setStatus(status: 'Pending' | 'Approved' | 'Rejected'): void {
    if (!this.job) {
      return;
    }
    this.job = { ...this.job, status, failReason: status === 'Pending' ? null : this.job.failReason };
    const source = findDownloadJob(this.job.jobId);
    if (source) {
      source.status = status;
      if (status === 'Pending') {
        source.failReason = null;
      }
    }
  }
}
