import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Common_TabsService } from '../../portfolio/services/common_tabs.service';
import { CommonService } from '../../../services/common.service';

export interface DocumentTemplateRow {
  id: number;
  title: string;
  type: string;
  updated: string;
  code?: string;
  content?: string;
}

export interface DocTypeOption {
  id: number;
  name: string;
  code?: string;
}

@Component({
  selector: 'app-document-templates',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './document-templates.component.html',
})
export class DocumentTemplatesComponent implements OnInit {
  searchQuery = '';
  typeFilter = '';
  isLoading = false;

  typeOptions: DocTypeOption[] = [];
  templates: DocumentTemplateRow[] = [];

  constructor(
    private router: Router,
    private commonTabsService: Common_TabsService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.loadDocTypes();
    this.loadTemplates();
  }

  loadDocTypes(): void {
    this.commonTabsService.getMasterByType({ typeId: 47, filterId: 0, filterText: '', filterText1: '' }).subscribe({
      next: (res: any) => {
        if (res && (res.statusCode === 200 || res.statusCode === '200') && res.objResult?.table) {
          this.typeOptions = res.objResult.table.map((item: any) => ({
            id: item.id,
            name: item.name || item.lookup_name || item.description || item.code || '',
            code: item.code || ''
          }));
        } else {
          this.typeOptions = [];
        }
      },
      error: (err: any) => {
        console.error('Error loading doc types for filter:', err);
        this.typeOptions = [];
      }
    });
  }

  loadTemplates(): void {
    this.isLoading = true;
    const currentUser = this.commonService.getCurrentUser();
    const payload = {
      page_no: 1,
      seqno: 0,
      search_keyword: this.searchQuery || '',
      pagecount: 50,
      feature: 'DOCUMENT_TEMPLATES',
      featureid: 'DOCUMENT_TEMPLATES',
      search_columns: 'P.id',
      filter_by: '',
      userId: currentUser?.userId || 1,
      clientId: currentUser?.clientId || '74BB6922',
      companyId: currentUser?.companyId || 1
    };

    const localSaved: DocumentTemplateRow[] = JSON.parse(localStorage.getItem('saved_document_templates') || '[]');

    this.commonTabsService.getCommonGrid(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        let apiRows: DocumentTemplateRow[] = [];
        if (res && (res.statusCode === '200' || res.statusCode === 200) && res.objResult) {
          const rawItems = res.objResult.document_templates || res.objResult.table || res.objResult.table1 || [];
          if (Array.isArray(rawItems) && rawItems.length > 0) {
            apiRows = rawItems.map((item: any) => ({
              id: item.id || 0,
              title: item.title || item.name || item.template_name || '',
              type: item.doc_type_name || item.doc_type || item.type || '',
              updated: item.updated_at || item.created_at || item.updated || '-',
              code: item.code || '',
              content: item.content || ''
            }));
          }
        }

        const combined = [...localSaved];
        for (const r of apiRows) {
          if (!combined.some(c => c.id === r.id || (c.title && c.title === r.title))) {
            combined.push(r);
          }
        }
        this.templates = combined;
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('Error loading document templates grid:', err);
        this.templates = [...localSaved];
      }
    });
  }

  get filteredTemplates(): DocumentTemplateRow[] {
    const q = this.searchQuery.trim().toLowerCase();
    return this.templates.filter((row) => {
      const matchesQuery =
        !q || row.title.toLowerCase().includes(q) || row.type.toLowerCase().includes(q);
      const matchesType = !this.typeFilter || row.type === this.typeFilter || String(row.id) === this.typeFilter;
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
    this.router.navigate(['/settings/document-template/new'], {
      queryParams: { id: row.id },
      state: { templateData: row }
    });
  }

  deleteTemplate(row: DocumentTemplateRow): void {
    this.templates = this.templates.filter((t) => t.id !== row.id);
    const existing = JSON.parse(localStorage.getItem('saved_document_templates') || '[]');
    const updated = existing.filter((t: any) => t.id !== row.id);
    localStorage.setItem('saved_document_templates', JSON.stringify(updated));
  }
}
