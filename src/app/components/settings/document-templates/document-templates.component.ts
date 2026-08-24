import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

export interface DocumentTemplateRow {
  id: number;
  title: string;
  type: string;
  updated: string;
}

@Component({
  selector: 'app-document-templates',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './document-templates.component.html',
})
export class DocumentTemplatesComponent {
  searchQuery = '';
  typeFilter = '';

  readonly typeOptions = ['Lease Agreement', 'Addendum', 'Checklist', 'Notice'];

  templates: DocumentTemplateRow[] = [
    { id: 1, title: 'Lease_Agreement_ORV', type: 'Lease Agreement', updated: '11 Aug 2026' },
    { id: 2, title: 'Tenancy_Addendum_ORV', type: 'Addendum', updated: '02 Aug 2026' },
    { id: 3, title: 'Move_In_Checklist_ORV', type: 'Checklist', updated: '28 Jul 2026' },
    { id: 4, title: 'Notice_To_Vacate_ORV', type: 'Notice', updated: '15 Jul 2026' },
  ];

  constructor(private router: Router) {}

  get filteredTemplates(): DocumentTemplateRow[] {
    const q = this.searchQuery.trim().toLowerCase();
    return this.templates.filter((row) => {
      const matchesQuery =
        !q || row.title.toLowerCase().includes(q) || row.type.toLowerCase().includes(q);
      const matchesType = !this.typeFilter || row.type === this.typeFilter;
      return matchesQuery && matchesType;
    });
  }

  get countLabel(): string {
    const n = this.filteredTemplates.length;
    return `${n} template${n === 1 ? '' : 's'}`;
  }

  openNew(): void {
    this.router.navigate(['/settings/document-template/new']);
  }

  openEdit(row: DocumentTemplateRow): void {
    this.router.navigate(['/settings/document-template/new'], { queryParams: { id: row.id } });
  }

  deleteTemplate(row: DocumentTemplateRow): void {
    this.templates = this.templates.filter((t) => t.id !== row.id);
  }
}
