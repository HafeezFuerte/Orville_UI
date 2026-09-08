import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';
import { ToastrService } from 'ngx-toastr';
import { Common_TabsService } from '../../portfolio/services/common_tabs.service';
import { CommonService } from '../../../services/common.service';

export interface DocTypeOption {
  id: number;
  name: string;
  code?: string;
}

export interface AutofillItem {
  id?: number;
  name: string;
  tag: string;
}

@Component({
  selector: 'app-document-template-add',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxEditorModule],
  templateUrl: './document-template-add.component.html',
  styleUrl: './document-template-add.component.scss',
})
export class DocumentTemplateAddComponent implements OnInit, OnDestroy {
  templateId: number = 0;
  templateType: string | number = '';
  title = '';
  content = '';
  code = '';

  typeOptions: DocTypeOption[] = [];
  autofillElements: AutofillItem[] = [];
  loadingDocTypes: boolean = false;
  loadingAutofill: boolean = false;
  isSaving: boolean = false;

  editor!: Editor;
  toolbar: Toolbar = [
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['bold', 'italic', 'underline', 'strike'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['bullet_list', 'ordered_list'],
    ['link', 'image', 'blockquote', 'code'],
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private commonTabsService: Common_TabsService,
    private commonService: CommonService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.editor = new Editor();

    const idParam = this.route.snapshot.queryParamMap.get('id');
    if (idParam) {
      this.templateId = Number(idParam) || 0;
    }

    this.loadDocTypes();
    this.loadAutofillElements(47);

    if (this.templateId > 0) {
      this.loadTemplateDetails(this.templateId);
    }
  }

  ngOnDestroy(): void {
    this.editor?.destroy();
  }

  loadDocTypes(): void {
    this.loadingDocTypes = true;
    this.commonTabsService.getMasterByType({ typeId: 47, filterId: 0, filterText: '', filterText1: '' }).subscribe({
      next: (res: any) => {
        this.loadingDocTypes = false;
        if (res && (res.statusCode === 200 || res.statusCode === '200') && res.objResult?.table) {
          this.typeOptions = res.objResult.table.map((item: any) => ({
            id: item.id,
            name: item.name || item.lookup_name || item.description || item.code || '',
            code: item.code || ''
          }));
        } else {
          this.typeOptions = [];
        }
        if (this.typeOptions.length > 0 && !this.templateType) {
          this.templateType = this.typeOptions[0].id || this.typeOptions[0].name;
        }
      },
      error: (err: any) => {
        this.loadingDocTypes = false;
        console.error('Error loading doc types:', err);
        this.typeOptions = [];
      }
    });
  }

  loadAutofillElements(filterId: number = 47): void {
    this.loadingAutofill = true;
    const targetFilterId = filterId || 47;
    this.commonTabsService.getMasterByType({ typeId: 2, filterId: targetFilterId, filterText: '', filterText1: '' }).subscribe({
      next: (res: any) => {
        this.loadingAutofill = false;
        if (res && (res.statusCode === 200 || res.statusCode === '200') && res.objResult?.table) {
          this.autofillElements = res.objResult.table.map((item: any) => {
            const rawName = item.name || item.lookup_name || item.description || item.code || '';
            const tag = item.code || item.field_tag || rawName;
            return {
              id: item.id,
              name: rawName,
              tag: tag
            };
          });
        } else {
          this.autofillElements = [];
        }
      },
      error: (err: any) => {
        this.loadingAutofill = false;
        console.error('Error loading autofill elements:', err);
        this.autofillElements = [];
      }
    });
  }

  onDocTypeChange(selectedVal: any): void {
    this.templateType = selectedVal;
    const numericId = Number(selectedVal);
    const filterId = !Number.isNaN(numericId) && numericId > 0 ? numericId : 47;
    this.loadAutofillElements(filterId);
  }

  loadTemplateDetails(id: number): void {
    let stateData = history.state?.templateData;
    if (!stateData) {
      const existing = JSON.parse(localStorage.getItem('saved_document_templates') || '[]');
      stateData = existing.find((t: any) => t.id === id);
    }
    if (stateData) {
      this.title = stateData.title || stateData.name || '';
      this.templateType = stateData.type || stateData.doc_type || stateData.template_type || '';
      this.content = stateData.content || stateData.body || '';
      this.code = stateData.code || '';
    }
  }

  cancel(): void {
    this.router.navigate(['/settings/document-template']);
  }

  save(): void {
    if (!this.title || !this.title.trim()) {
      this.toastr.warning('Please enter a template title', 'Validation');
      return;
    }

    if (!this.content || !this.content.trim()) {
      this.toastr.warning('Please enter template content', 'Validation');
      return;
    }

    const currentUser = this.commonService.getCurrentUser();
    const payload = {
      id: this.templateId || 0,
      code: this.code || '',
      doc_type: String(this.templateType || ''),
      title: this.title.trim(),
      content: this.content,
      userid: currentUser?.userId || 1,
      company_id: currentUser?.companyId || 1,
      clientId: currentUser?.clientId || '74BB6922'
    };

    this.isSaving = true;
    this.commonTabsService.saveDocumentTemplate(payload).subscribe({
      next: (res: any) => {
        this.isSaving = false;
        if (res && (res.statusCode === 200 || res.statusCode === '200')) {
          const typeObj = this.typeOptions.find(t => String(t.id) === String(this.templateType) || t.name === String(this.templateType));
          const typeLabel = typeObj ? typeObj.name : String(this.templateType || 'Lease Agreement');

          const newRecord = {
            id: this.templateId || Date.now(),
            title: this.title.trim(),
            type: typeLabel,
            doc_type: String(this.templateType),
            updated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            code: this.code || '',
            content: this.content
          };

          const existing = JSON.parse(localStorage.getItem('saved_document_templates') || '[]');
          const index = existing.findIndex((t: any) => t.id === newRecord.id);
          if (index >= 0) {
            existing[index] = newRecord;
          } else {
            existing.unshift(newRecord);
          }
          localStorage.setItem('saved_document_templates', JSON.stringify(existing));

          this.toastr.success('Document template saved successfully', 'Success');
          this.router.navigate(['/settings/document-template']);
        } else {
          this.toastr.error(res?.message || 'Failed to save document template', 'Error');
        }
      },
      error: (err: any) => {
        this.isSaving = false;
        this.toastr.error('An error occurred while saving', 'Error');
        console.error('Error saving document template:', err);
      }
    });
  }

  insertAutofill(tag: string): void {
    if (!this.editor) {
      return;
    }
    this.editor.commands.focus().insertText(`{{${tag}}}`).exec();
  }

  onAutofillDragStart(event: DragEvent, tag: string): void {
    event.dataTransfer?.setData('text/plain', `{{${tag}}}`);
  }

  onEditorDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onEditorDrop(event: DragEvent): void {
    event.preventDefault();
    const token = event.dataTransfer?.getData('text/plain');
    if (token) {
      this.editor.commands.focus().insertText(token).exec();
    }
  }
}
