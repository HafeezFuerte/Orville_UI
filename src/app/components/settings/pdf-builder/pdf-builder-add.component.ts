import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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

export interface PlacedPdfField {
  id: string;
  name: string;
  tag: string;
  x: number; // percentage offset X (0-100)
  y: number; // percentage offset Y (0-100)
  page?: number;
}

@Component({
  selector: 'app-pdf-builder-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pdf-builder-add.component.html',
  styleUrl: './pdf-builder-add.component.scss',
})
export class PdfBuilderAddComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('pdfContainer') pdfContainer!: ElementRef<HTMLDivElement>;

  templateId: number = 0;
  title = '';
  templateType: string | number = '';
  selectedFileName = '';
  dragOver = false;
  pdfDataUrl: string = '';
  safePdfUrl: SafeResourceUrl | null = null;
  code = '';
  isSaving = false;

  typeOptions: DocTypeOption[] = [];
  autofillElements: AutofillItem[] = [];
  placedFields: PlacedPdfField[] = [];

  loadingDocTypes = false;
  loadingAutofill = false;

  // Active dragging state
  draggingFieldId: string | null = null;
  dragStartX = 0;
  dragStartY = 0;
  fieldStartX = 0;
  fieldStartY = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private commonTabsService: Common_TabsService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
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
      const existing = JSON.parse(localStorage.getItem('saved_pdf_templates') || '[]');
      stateData = existing.find((t: any) => t.id === id);
    }
    if (stateData) {
      this.title = stateData.title || stateData.name || '';
      this.templateType = stateData.templateType || stateData.template_type || stateData.doc_type || '';
      this.selectedFileName = stateData.file_name || stateData.fileName || '';
      this.pdfDataUrl = stateData.file_data || stateData.fileUrl || '';
      if (this.pdfDataUrl && this.pdfDataUrl !== '#') {
        this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfDataUrl);
      }
      if (stateData.field_mappings) {
        try {
          this.placedFields = typeof stateData.field_mappings === 'string'
            ? JSON.parse(stateData.field_mappings)
            : stateData.field_mappings;
        } catch {
          this.placedFields = [];
        }
      }
    }
  }

  cancel(): void {
    this.router.navigate(['/settings/pdf-builder']);
  }

  save(): void {
    if (!this.title || !this.title.trim()) {
      this.toastr.warning('Please enter a PDF template title', 'Validation');
      return;
    }

    if (!this.selectedFileName && !this.pdfDataUrl) {
      this.toastr.warning('Please upload a PDF file for the template', 'Validation');
      return;
    }

    const currentUser = this.commonService.getCurrentUser();
    const payload = {
      id: this.templateId || 0,
      code: this.code || '',
      template_type: String(this.templateType || ''),
      title: this.title.trim(),
      file_name: this.selectedFileName || 'template.pdf',
      file_data: this.pdfDataUrl || '',
      field_mappings: JSON.stringify(this.placedFields),
      userid: currentUser?.userId || 1,
      company_id: currentUser?.companyId || 1,
      clientId: currentUser?.clientId || '74BB6922'
    };

    this.isSaving = true;
    this.commonTabsService.savePdfTemplate(payload).subscribe({
      next: (res: any) => {
        this.isSaving = false;
        if (res && (res.statusCode === 200 || res.statusCode === '200')) {
          const typeObj = this.typeOptions.find(t => String(t.id) === String(this.templateType) || t.name === String(this.templateType));
          const typeLabel = typeObj ? typeObj.name : String(this.templateType || 'Lease');

          const newRecord = {
            id: this.templateId || Date.now(),
            title: this.title.trim(),
            name: this.title.trim(),
            templateType: typeLabel,
            template_type: String(this.templateType),
            file_name: this.selectedFileName,
            file_data: this.pdfDataUrl,
            fileUrl: this.pdfDataUrl || '#',
            field_mappings: JSON.stringify(this.placedFields),
            updated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
          };

          const existing = JSON.parse(localStorage.getItem('saved_pdf_templates') || '[]');
          const index = existing.findIndex((t: any) => t.id === newRecord.id);
          if (index >= 0) {
            existing[index] = newRecord;
          } else {
            existing.unshift(newRecord);
          }
          localStorage.setItem('saved_pdf_templates', JSON.stringify(existing));

          this.toastr.success('PDF template saved successfully', 'Success');
          this.router.navigate(['/settings/pdf-builder']);
        } else {
          this.toastr.error(res?.message || 'Failed to save PDF template', 'Error');
        }
      },
      error: (err: any) => {
        this.isSaving = false;
        this.toastr.error('An error occurred while saving PDF template', 'Error');
        console.error('Error saving PDF template:', err);
      }
    });
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
    this.pdfDataUrl = '';
    this.safePdfUrl = null;
    this.placedFields = [];
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  private applyFile(file: File | null): void {
    if (!file) {
      return;
    }
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      this.toastr.warning('Only PDF files are supported', 'Validation');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      this.toastr.warning('PDF file size must not exceed 10 MB', 'Validation');
      return;
    }
    this.selectedFileName = file.name;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.pdfDataUrl = e.target?.result as string;
      this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfDataUrl);
    };
    reader.readAsDataURL(file);
  }

  // --- Interactive Overlay Layer Methods ---

  addTagToPdf(el: AutofillItem): void {
    if (!this.selectedFileName && !this.pdfDataUrl) {
      this.toastr.warning('Please upload a PDF template first before adding autofill elements', 'Warning');
      return;
    }

    const count = this.placedFields.length;
    const newField: PlacedPdfField = {
      id: 'field_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      name: el.name,
      tag: el.tag,
      x: Math.min(80, 10 + (count * 5) % 65),
      y: Math.min(85, 12 + (count * 7) % 70),
      page: 1
    };

    this.placedFields.push(newField);
    this.toastr.info(`Added badge {{${el.name}}} to PDF template`, 'Placeholder Added');
  }

  removeField(fieldId: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.placedFields = this.placedFields.filter(f => f.id !== fieldId);
  }

  // Dragging logic inside PDF overlay container
  startDragField(field: PlacedPdfField, event: MouseEvent): void {
    event.preventDefault();
    this.draggingFieldId = field.id;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.fieldStartX = field.x;
    this.fieldStartY = field.y;

    const onMouseMove = (e: MouseEvent) => this.onDraggingField(e);
    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      this.draggingFieldId = null;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  private onDraggingField(event: MouseEvent): void {
    if (!this.draggingFieldId || !this.pdfContainer?.nativeElement) {
      return;
    }

    const rect = this.pdfContainer.nativeElement.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) {
      return;
    }

    const deltaXPixels = event.clientX - this.dragStartX;
    const deltaYPixels = event.clientY - this.dragStartY;

    const deltaXPercent = (deltaXPixels / rect.width) * 100;
    const deltaYPercent = (deltaYPixels / rect.height) * 100;

    const targetField = this.placedFields.find(f => f.id === this.draggingFieldId);
    if (targetField) {
      targetField.x = Math.max(0, Math.min(85, this.fieldStartX + deltaXPercent));
      targetField.y = Math.max(0, Math.min(92, this.fieldStartY + deltaYPercent));
    }
  }

  onSidebarTagDragStart(event: DragEvent, el: AutofillItem): void {
    event.dataTransfer?.setData('application/json', JSON.stringify(el));
  }

  onContainerDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onContainerDrop(event: DragEvent): void {
    event.preventDefault();
    const data = event.dataTransfer?.getData('application/json');
    if (!data) {
      return;
    }
    try {
      const el: AutofillItem = JSON.parse(data);
      if (!this.pdfContainer?.nativeElement) {
        this.addTagToPdf(el);
        return;
      }

      const rect = this.pdfContainer.nativeElement.getBoundingClientRect();
      const dropXPixels = event.clientX - rect.left;
      const dropYPixels = event.clientY - rect.top;

      const dropXPercent = Math.max(0, Math.min(85, (dropXPixels / rect.width) * 100));
      const dropYPercent = Math.max(0, Math.min(92, (dropYPixels / rect.height) * 100));

      const newField: PlacedPdfField = {
        id: 'field_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        name: el.name,
        tag: el.tag,
        x: dropXPercent,
        y: dropYPercent,
        page: 1
      };

      this.placedFields.push(newField);
    } catch {
      // Fallback
    }
  }
}
