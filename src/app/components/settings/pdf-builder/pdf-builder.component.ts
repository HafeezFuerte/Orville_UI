import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

export interface PdfTemplateRow {
  id: number;
  name: string;
  templateType: string;
  fileUrl: string;
}

@Component({
  selector: 'app-pdf-builder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pdf-builder.component.html',
})
export class PdfBuilderComponent {
  searchQuery = '';

  templates: PdfTemplateRow[] = [
    {
      id: 1,
      name: 'Booking Form',
      templateType: 'Lease',
      fileUrl: '#',
    },
  ];

  constructor(private router: Router) {}

  get filteredTemplates(): PdfTemplateRow[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      return this.templates;
    }
    return this.templates.filter(
      (row) =>
        row.name.toLowerCase().includes(q) ||
        row.templateType.toLowerCase().includes(q)
    );
  }

  get countLabel(): string {
    const n = this.filteredTemplates.length;
    return `${n} template${n === 1 ? '' : 's'}`;
  }

  openNew(): void {
    this.router.navigate(['/settings/pdf-builder/new']);
  }

  openEdit(row: PdfTemplateRow): void {
    this.router.navigate(['/settings/pdf-builder/new'], {
      queryParams: { id: row.id },
    });
  }

  openPdf(row: PdfTemplateRow): void {
    if (row.fileUrl && row.fileUrl !== '#') {
      window.open(row.fileUrl, '_blank');
    }
  }

  deleteTemplate(row: PdfTemplateRow): void {
    this.templates = this.templates.filter((t) => t.id !== row.id);
  }
}
