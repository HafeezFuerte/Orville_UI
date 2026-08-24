import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';

@Component({
  selector: 'app-document-template-add',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxEditorModule],
  templateUrl: './document-template-add.component.html',
  styleUrl: './document-template-add.component.scss',
})
export class DocumentTemplateAddComponent implements OnInit, OnDestroy {
  templateType = 'Lease Agreement';
  title = '';
  content = '';

  readonly typeOptions = ['Lease Agreement', 'Addendum', 'Checklist', 'Notice'];

  readonly autofillElements = [
    'Lease No.',
    'Tenant Email',
    'Tenant Phone',
    'Tenant Phone with Country Code',
    'Tenant Full Name',
    'Tenant First Name',
    'Tenant Last Name',
    'Tenant Name on Lease',
    'Tenant Email on Lease',
    'Tenant Phone on Lease',
  ];

  editor!: Editor;
  toolbar: Toolbar = [
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['bold', 'italic', 'underline', 'strike'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['bullet_list', 'ordered_list'],
    ['link', 'image', 'blockquote', 'code'],
  ];

  private readonly mockById: Record<
    number,
    { title: string; type: string; content: string }
  > = {
    1: {
      title: 'Lease_Agreement_ORV',
      type: 'Lease Agreement',
      content: '<p>Start writing your document template…</p>',
    },
    2: {
      title: 'Tenancy_Addendum_ORV',
      type: 'Addendum',
      content: '<p>Start writing your document template…</p>',
    },
    3: {
      title: 'Move_In_Checklist_ORV',
      type: 'Checklist',
      content: '<p>Start writing your document template…</p>',
    },
    4: {
      title: 'Notice_To_Vacate_ORV',
      type: 'Notice',
      content: '<p>Start writing your document template…</p>',
    },
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.editor = new Editor();
    const idParam = this.route.snapshot.queryParamMap.get('id');
    const id = idParam ? Number(idParam) : NaN;
    if (!Number.isNaN(id) && this.mockById[id]) {
      const row = this.mockById[id];
      this.title = row.title;
      this.templateType = row.type;
      this.content = row.content;
    }
  }

  ngOnDestroy(): void {
    this.editor?.destroy();
  }

  cancel(): void {
    this.router.navigate(['/settings/document-template']);
  }

  save(): void {
    this.router.navigate(['/settings/document-template']);
  }

  insertAutofill(label: string): void {
    if (!this.editor) {
      return;
    }
    this.editor.commands.focus().insertText(`{{${label}}}`).exec();
  }

  onAutofillDragStart(event: DragEvent, label: string): void {
    event.dataTransfer?.setData('text/plain', `{{${label}}}`);
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
