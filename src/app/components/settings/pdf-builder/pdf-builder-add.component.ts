import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pdf-builder-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pdf-builder-add.component.html',
})
export class PdfBuilderAddComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  title = '';
  templateType = 'Lease';
  selectedFileName = '';
  dragOver = false;

  readonly typeOptions = ['Lease', 'Invoice', 'Notice', 'Other'];

  private readonly mockById: Record<number, { title: string; templateType: string }> = {
    1: { title: 'Booking Form', templateType: 'Lease' },
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.queryParamMap.get('id');
    const id = idParam ? Number(idParam) : NaN;
    if (!Number.isNaN(id) && this.mockById[id]) {
      this.title = this.mockById[id].title;
      this.templateType = this.mockById[id].templateType;
    }
  }

  cancel(): void {
    this.router.navigate(['/settings/pdf-builder']);
  }

  save(): void {
    this.router.navigate(['/settings/pdf-builder']);
  }

  browseFiles(): void {
    this.fileInput?.nativeElement?.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.applyFile(file ?? null);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = false;
    const file = event.dataTransfer?.files?.[0];
    this.applyFile(file ?? null);
  }

  clearFile(): void {
    this.selectedFileName = '';
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  private applyFile(file: File | null): void {
    if (!file) {
      return;
    }
    const isPdf =
      file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      return;
    }
    this.selectedFileName = file.name;
  }
}
