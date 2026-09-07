import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Common_TabsService } from '../../portfolio/services/common_tabs.service';
import { CommonService } from '../../../services/common.service';

export interface PdfTemplateRow {
  id: number;
  name: string;
  templateType: string;
  fileUrl: string;
  file_name?: string;
  file_data?: string;
  field_mappings?: string;
  updated?: string;
}

@Component({
  selector: 'app-pdf-builder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pdf-builder.component.html',
})
export class PdfBuilderComponent implements OnInit {
  searchQuery = '';
  isLoading = false;

  templates: PdfTemplateRow[] = [];

  constructor(
    private router: Router,
    private commonTabsService: Common_TabsService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.loadTemplates();
  }

  loadTemplates(): void {
    this.isLoading = true;
    const currentUser = this.commonService.getCurrentUser();
    const payload = {
      page_no: 1,
      seqno: 0,
      search_keyword: this.searchQuery || '',
      pagecount: 50,
      feature: 'PDF_TEMPLATES',
      featureid: 'PDF_TEMPLATES',
      search_columns: 'P.id',
      filter_by: '',
      userId: currentUser?.userId || 1,
      clientId: currentUser?.clientId || '74BB6922',
      companyId: currentUser?.companyId || 1
    };

    const localSaved: PdfTemplateRow[] = JSON.parse(localStorage.getItem('saved_pdf_templates') || '[]');

    this.commonTabsService.getCommonGrid(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        let apiRows: PdfTemplateRow[] = [];
        if (res && (res.statusCode === '200' || res.statusCode === 200) && res.objResult) {
          const rawItems = res.objResult.pdf_templates || res.objResult.table || res.objResult.table1 || [];
          if (Array.isArray(rawItems) && rawItems.length > 0) {
            apiRows = rawItems.map((item: any) => ({
              id: item.id || 0,
              name: item.title || item.name || item.template_name || '',
              templateType: item.template_type_name || item.template_type || item.doc_type || 'Lease',
              fileUrl: item.file_data || item.file_url || '#',
              file_name: item.file_name || '',
              file_data: item.file_data || '',
              field_mappings: item.field_mappings || '',
              updated: item.updated_at || item.created_at || item.updated || '-'
            }));
          }
        }

        const combined = [...localSaved];
        for (const r of apiRows) {
          if (!combined.some(c => c.id === r.id || (c.name && c.name === r.name))) {
            combined.push(r);
          }
        }
        this.templates = combined;
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('Error loading PDF templates grid:', err);
        this.templates = [...localSaved];
      }
    });
  }

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
      state: { templateData: row }
    });
  }

  openPdf(row: PdfTemplateRow): void {
    if (row.fileUrl && row.fileUrl !== '#') {
      const win = window.open();
      if (win) {
        win.document.write(`<iframe src="${row.fileUrl}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
      }
    }
  }

  deleteTemplate(row: PdfTemplateRow): void {
    this.templates = this.templates.filter((t) => t.id !== row.id);
    const existing = JSON.parse(localStorage.getItem('saved_pdf_templates') || '[]');
    const updated = existing.filter((t: any) => t.id !== row.id);
    localStorage.setItem('saved_pdf_templates', JSON.stringify(updated));
  }
}
