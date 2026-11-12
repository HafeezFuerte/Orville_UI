import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Common_TabsService } from '../../portfolio/services/common_tabs.service';
import { CommonService } from '../../../services/common.service';

export interface FeatureOption {
  feature: string;
  name: string;
  search_columns?: string;
}

export interface ActionTriggerOption {
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
  selector: 'app-email-template-add',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgxEditorModule, TranslateModule],
  templateUrl: './email-template-add.component.html',
  styleUrl: './email-template-add.component.scss'
})
export class EmailTemplateAddComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private commonTabsService = inject(Common_TabsService);
  private commonService = inject(CommonService);
  private toastr = inject(ToastrService);
  public translate = inject(TranslateService);

  templateId: number = 0;
  code: string = '';
  isEdit: boolean = false;
  isLoading: boolean = false;
  isSaving: boolean = false;
  loadingFeatures: boolean = false;
  loadingTriggers: boolean = false;
  loadingAutofill: boolean = false;

  // Form Fields mapped to POST /api/Masters/save_email_sms_templates
  template_name: string = '';
  feature: string = 'PROPERTY';
  template_type: number = 369; // Action/Trigger ID from typeId: 2, filterId: 58 (e.g. 369 = 'Add')
  format_type: number = 2;   // 2 = HTML (Rich Text), 1 = Plain Text
  to_address: string = '';
  bcc_address: string = '';
  subject: string = '';
  format: string = '';       // Rich text body content
  currentFilterId: number = 50;

  features: FeatureOption[] = [];
  actionTriggers: ActionTriggerOption[] = [];
  autofillElements: AutofillItem[] = [];
  categoryList: Array<{ id: number; lookup_name: string }> = [];

  editor!: Editor;
  toolbar: Toolbar = [
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['bold', 'italic', 'underline', 'strike'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['bullet_list', 'ordered_list'],
    ['link', 'image', 'blockquote', 'code']
  ];

  defaultFeatures: FeatureOption[] = [
    { feature: 'PROPERTY', name: 'Property' },
    { feature: 'UNITS', name: 'Units' },
    { feature: 'LEASES', name: 'Leases' },
    { feature: 'WORKORDERS', name: 'Work Orders' },
    { feature: 'TICKETS', name: 'Tickets' },
    { feature: 'INVOICES', name: 'Invoices' },
    { feature: 'EXPENSES', name: 'Expenses' },
    { feature: 'REMINDERS', name: 'Reminders' },
    { feature: 'TENANTS', name: 'Tenants' },
    { feature: 'LANDLORDS', name: 'Landlords' },
    { feature: 'VENDORS', name: 'Vendors' },
    { feature: 'BOOKINGS', name: 'Bookings / Reservations' }
  ];

  // Map features to lookup filter IDs (typeId: 2) as used across Orville
  private readonly FEATURE_FILTER_MAP: Record<string, number> = {
    // Work Orders & Tickets -> 50
    WORKORDERS: 50,
    WORKORDER: 50,
    WORK_ORDERS: 50,
    WORK_ORDER: 50,
    TICKETS: 50,
    TICKET: 50,
    MAINTENANCE: 50,
    SERVICEREQUESTS: 50,
    SERVICE_REQUESTS: 50,

    // Leases -> 47
    LEASES: 47,
    LEASE: 47,
    LEASING: 47,
    TENANCY: 47,

    // Vendors -> 48
    VENDORS: 48,
    VENDOR: 48,
    VENDORCONTRACT: 48,
    VENDOR_CONTRACT: 48,

    // Landlords -> 49
    LANDLORDS: 49,
    LANDLORD: 49,
    LANDLORDCONTRACT: 49,
    LANDLORD_CONTRACT: 49,

    // Invoices, Receipts & Expenses -> 51
    INVOICES: 51,
    INVOICE: 51,
    EXPENSES: 51,
    EXPENSE: 51,
    RECEIPTS: 51,
    RECEIPT: 51,
    BILLS: 51,
    BILL: 51,
    CHEQUES: 51,
    CHEQUE: 51,

    // Properties -> 1
    PROPERTY: 1,
    PROPERTIES: 1,
    BUILDING: 1,
    BUILDINGS: 1,

    // Units -> 3
    UNITS: 3,
    UNIT: 3,

    // Rooms -> 15
    ROOMS: 15,
    ROOM: 15,

    // Reminders -> 13
    REMINDERS: 13,
    REMINDER: 13,

    // Quotations -> 34
    QUOTATIONS: 34,
    QUOTATION: 34,

    // Inventory -> 32
    INVENTORY: 32,
    INVENTORYITEMS: 32,
    INVENTORY_ITEMS: 32,

    // Promotions -> 46
    PROMOTIONS: 46,
    PROMOTION: 46,

    // Bookings / Spaces -> 28
    BOOKINGS: 28,
    BOOKING: 28,
    SPACES: 28,
    SPACE: 28,
    RESERVATIONS: 28,
    RESERVATION: 28,
    VISITINGSLOTS: 28,
    VISITING_SLOTS: 28,

    // Tenants -> 47
    TENANTS: 47,
    TENANT: 47,

    // Internal Statuses -> 56
    INTERNALSTATUSES: 56,
    INTERNAL_STATUSES: 56,
    STATUSES: 56,
    STATUS: 56,

    // Action Triggers -> 58
    ACTIONS: 58,
    ACTION: 58,
    TRIGGERS: 58,
    TRIGGER: 58,

    // General Documents -> 52
    GENERAL: 52,
    DOCUMENTS: 52,
    DOCUMENT: 52
  };

  ngOnInit(): void {
    this.editor = new Editor();

    const paramCode = this.route.snapshot.paramMap.get('code');
    const queryId = this.route.snapshot.queryParamMap.get('id');

    if (paramCode || queryId) {
      this.isEdit = true;
      this.code = paramCode || '';
      this.templateId = Number(queryId) || 0;
    }

    this.loadCategories();
    this.loadFeatures();
    this.loadActionTriggers();

    if (this.isEdit) {
      this.loadTemplateRecord();
    } else {
      this.loadAutofillElements(this.feature);
    }
  }

  // Load all master lookup categories (typeId: 1) for dynamic discovery
  loadCategories(): void {
    const currentUser = this.commonService.getCurrentUser();
    const payload = {
      typeId: 1,
      filterId: 0,
      filterText: '',
      filterText1: '',
      userId: Number(currentUser?.userId) || 1,
      clientId: currentUser?.clientId || '74BB6922',
      companyId: Number(currentUser?.companyId) || 1
    };

    this.commonTabsService.getMasterByType(payload).subscribe({
      next: (res: any) => {
        if (res && (res.statusCode === 200 || res.statusCode === '200') && Array.isArray(res.objResult?.table)) {
          this.categoryList = res.objResult.table.map((c: any) => ({
            id: Number(c.id),
            lookup_name: c.lookup_name || c.name || ''
          }));
        }
      },
      error: () => {}
    });
  }

  resolveFilterId(selectedFeature: string): number {
    if (!selectedFeature) return 52;
    const raw = selectedFeature.toUpperCase().trim();
    const clean = raw.replace(/[^A-Z0-9]/g, '');

    // 1. Exact normalized match in dictionary
    if (this.FEATURE_FILTER_MAP[clean] !== undefined) {
      return this.FEATURE_FILTER_MAP[clean];
    }
    if (this.FEATURE_FILTER_MAP[raw] !== undefined) {
      return this.FEATURE_FILTER_MAP[raw];
    }

    // 2. Keyword/substring heuristics
    if (clean.includes('WORKORDER') || clean.includes('TICKET') || clean.includes('MAINTENANCE') || clean.includes('SERVICEREQUEST')) {
      return 50;
    }
    if (clean.includes('LEASE') || clean.includes('TENANCY')) {
      return 47;
    }
    if (clean.includes('VENDOR')) {
      return 48;
    }
    if (clean.includes('LANDLORD') || clean.includes('OWNER')) {
      return 49;
    }
    if (clean.includes('INVOICE') || clean.includes('EXPENSE') || clean.includes('RECEIPT') || clean.includes('BILL') || clean.includes('CHEQUE')) {
      return 51;
    }
    if (clean.includes('REMINDER')) {
      return 13;
    }
    if (clean.includes('PROPERTY') || clean.includes('BUILDING')) {
      return 1;
    }
    if (clean.includes('UNIT')) {
      return 3;
    }
    if (clean.includes('ROOM')) {
      return 15;
    }
    if (clean.includes('QUOTATION')) {
      return 34;
    }
    if (clean.includes('INVENTORY') || clean.includes('STOCK')) {
      return 32;
    }
    if (clean.includes('PROMOTION')) {
      return 46;
    }
    if (clean.includes('BOOKING') || clean.includes('SPACE') || clean.includes('RESERVATION')) {
      return 28;
    }
    if (clean.includes('STATUS')) {
      return 56;
    }

    // 3. Dynamic match against typeId: 1 categories
    if (this.categoryList && this.categoryList.length > 0) {
      const match = this.categoryList.find((cat) => {
        const catClean = (cat.lookup_name || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
        return catClean.includes(clean) || clean.includes(catClean);
      });
      if (match && match.id) {
        return Number(match.id);
      }
    }

    return 52;
  }

  ngOnDestroy(): void {
    this.editor?.destroy();
  }

  // Load features list from POST /api/Masters/_getMasters (typeId: 24)
  loadFeatures(): void {
    this.loadingFeatures = true;
    const currentUser = this.commonService.getCurrentUser();
    const payload = {
      typeId: 24,
      filterId: 0,
      filterText: 'F3CBB534',
      filterText1: '',
      userId: Number(currentUser?.userId) || 1,
      clientId: currentUser?.clientId || '74BB6922',
      companyId: Number(currentUser?.companyId) || 1
    };

    this.commonTabsService.getMasterByType(payload).subscribe({
      next: (res: any) => {
        this.loadingFeatures = false;
        if (res && (res.statusCode === 200 || res.statusCode === '200') && Array.isArray(res.objResult?.table) && res.objResult.table.length > 0) {
          this.features = res.objResult.table.map((item: any) => ({
            feature: item.feature,
            name: this.formatFeatureName(item.feature),
            search_columns: item.search_columns
          }));
        } else {
          this.features = [...this.defaultFeatures];
        }

        if (!this.feature && this.features.length > 0) {
          this.feature = this.features[0].feature;
          this.loadAutofillElements(this.feature);
        }
      },
      error: (err: any) => {
        this.loadingFeatures = false;
        console.error('Error fetching features list (typeId: 24):', err);
        this.features = [...this.defaultFeatures];
        if (!this.feature && this.features.length > 0) {
          this.feature = this.features[0].feature;
          this.loadAutofillElements(this.feature);
        }
      }
    });
  }

  // Load Action / Event Triggers from POST /api/Masters/_getMasters (typeId: 2, filterId: 58)
  loadActionTriggers(): void {
    this.loadingTriggers = true;
    const currentUser = this.commonService.getCurrentUser();
    const payload = {
      typeId: 2,
      filterId: 58,
      filterText: '',
      filterText1: '',
      userId: Number(currentUser?.userId) || 1,
      clientId: currentUser?.clientId || '74BB6922',
      companyId: Number(currentUser?.companyId) || 1
    };

    this.commonTabsService.getMasterByType(payload).subscribe({
      next: (res: any) => {
        this.loadingTriggers = false;
        if (res && (res.statusCode === 200 || res.statusCode === '200') && Array.isArray(res.objResult?.table) && res.objResult.table.length > 0) {
          this.actionTriggers = res.objResult.table.map((item: any) => ({
            id: Number(item.id),
            name: item.name || item.code || 'Add',
            code: item.code || ''
          }));
          if (!this.template_type && this.actionTriggers.length > 0) {
            this.template_type = this.actionTriggers[0].id;
          }
        } else {
          this.actionTriggers = [
            { id: 369, name: 'Add', code: 'Add' },
            { id: 370, name: 'Edit', code: 'Edit' },
            { id: 371, name: 'Status Change', code: 'Status Change' },
            { id: 372, name: 'Delete / Cancel', code: 'Delete' }
          ];
          if (!this.template_type) {
            this.template_type = 369;
          }
        }
      },
      error: (err: any) => {
        this.loadingTriggers = false;
        console.error('Error fetching action triggers (typeId: 2, filterId: 58):', err);
        this.actionTriggers = [
          { id: 369, name: 'Add', code: 'Add' },
          { id: 370, name: 'Edit', code: 'Edit' },
          { id: 371, name: 'Status Change', code: 'Status Change' }
        ];
        if (!this.template_type) {
          this.template_type = 369;
        }
      }
    });
  }

  formatFeatureName(feat: string): string {
    if (!feat) return '';
    return feat.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  onFeatureChange(newFeature: string): void {
    this.feature = newFeature;
    this.loadAutofillElements(newFeature);
  }

  // Load dynamic merge tags using typeId: 2 with mapped filterId matching Document Templates
  loadAutofillElements(selectedFeature: string): void {
    const filterId = this.resolveFilterId(selectedFeature);
    this.currentFilterId = filterId;
    this.loadingAutofill = true;

    const payload = {
      typeId: 2,
      filterId: filterId,
      filterText: '',
      filterText1: '',
      userId: 1,
      clientId: '74BB6922',
      companyId: 1
    };

    this.commonTabsService.getMasterByType(payload).subscribe({
      next: (res: any) => {
        this.loadingAutofill = false;
        if (res && (res.statusCode === 200 || res.statusCode === '200') && Array.isArray(res.objResult?.table)) {
          this.autofillElements = res.objResult.table.map((item: any) => {
            const rawName = item.name || item.lookup_name || item.description || item.code || '';
            const rawTag = item.code || item.field_tag || rawName;
            const cleanTag = rawTag.startsWith('{{') ? rawTag : `{{${rawTag}}}`;
            return {
              id: item.id,
              name: rawName,
              tag: cleanTag
            };
          });
        } else {
          this.autofillElements = [];
        }
      },
      error: () => {
        this.loadingAutofill = false;
        this.autofillElements = [];
      }
    });
  }

  // Load existing record for Edit mode
  loadTemplateRecord(): void {
    const stateData = history.state?.templateData;
    if (stateData) {
      this.populateFields(stateData);
      return;
    }

    // Try reading cached templates
    const cached = localStorage.getItem('orville_email_templates');
    if (cached) {
      try {
        const list = JSON.parse(cached);
        const found = list.find((t: any) => String(t.code) === this.code || String(t.id) === String(this.templateId || this.code));
        if (found) {
          this.populateFields(found);
          return;
        }
      } catch {}
    }

    // Explicit user instruction: fetch template details using typeId: 104
    this.isLoading = true;
    const currentUser = this.commonService.getCurrentUser();
    const payload = {
      typeId: 104,
      filterId: this.templateId || 0,
      filterText: this.code || '',
      filterText1: '',
      userId: Number(currentUser?.userId) || 1,
      clientId: currentUser?.clientId || '74BB6922',
      companyId: Number(currentUser?.companyId) || 1
    };

    this.commonTabsService.getMasterByType(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res && res.objResult) {
          const table = res.objResult.table || res.objResult.table0 || res.objResult.email_templates || res.objResult;
          if (Array.isArray(table) && table.length > 0) {
            const match = table.find((item: any) => String(item.code) === this.code || String(item.id) === String(this.templateId)) || table[0];
            this.populateFields(match);
          }
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('Error fetching template details with typeId: 104:', err);
      }
    });
  }

  private populateFields(data: any): void {
    this.template_name = data.name || data.template_name || '';
    this.feature = data.feature || 'PROPERTY';
    this.template_type = Number(data.template_type) || 369;
    this.format_type = Number(data.format_type) || 2;
    this.to_address = data.to_address || '';
    this.bcc_address = data.bcc_address || '';
    this.subject = data.subject || '';
    this.format = data.format || data.content || '';
    this.code = data.code || String(data.id || '');
    this.loadAutofillElements(this.feature);
  }

  insertAutofill(tag: string): void {
    if (!tag) return;
    const cleanTag = tag.startsWith('{{') ? tag : `{{${tag}}}`;
    if (this.editor) {
      this.editor.commands.focus().insertText(cleanTag).exec();
    } else {
      const current = this.format || '';
      this.format = current ? `${current} ${cleanTag} ` : `${cleanTag} `;
    }
    this.toastr.info(`Inserted token: ${cleanTag}`, 'Merge Tag');
  }

  onAutofillDragStart(event: DragEvent, tag: string): void {
    const cleanTag = tag.startsWith('{{') ? tag : `{{${tag}}}`;
    event.dataTransfer?.setData('text/plain', cleanTag);
  }

  onEditorDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onEditorDrop(event: DragEvent): void {
    event.preventDefault();
    const token = event.dataTransfer?.getData('text/plain');
    if (token && this.editor) {
      this.editor.commands.focus().insertText(token).exec();
    }
  }

  cancel(): void {
    this.router.navigate(['/settings/email-templates']);
  }

  save(): void {
    if (!this.template_name || !this.template_name.trim()) {
      this.toastr.warning('Please enter a template name', 'Validation');
      return;
    }

    if (!this.subject || !this.subject.trim()) {
      this.toastr.warning('Please enter an email subject line', 'Validation');
      return;
    }

    if (!this.format || !this.format.trim()) {
      this.toastr.warning('Please enter the template body content', 'Validation');
      return;
    }

    this.isSaving = true;
    const currentUser = this.commonService.getCurrentUser();

    // Exact payload matching POST /api/Masters/save_email_sms_templates
    const payload = {
      userId: Number(currentUser?.userId) || 1,
      company_id: Number(currentUser?.companyId) || 1,
      clientId: currentUser?.clientId || '74BB6922',
      source: 'web',
      languageId: 1,
      feature: this.feature || 'PROPERTY',
      code: this.code || '',
      template_type: Number(this.template_type) || 369,
      format_type: Number(this.format_type) || 2,
      to_address: this.to_address || '',
      bcc_address: this.bcc_address || '',
      subject: this.subject.trim(),
      format: this.format,
      template_name: this.template_name.trim()
    };

    this.commonTabsService.saveEmailSmsTemplate(payload).subscribe({
      next: (res: any) => {
        this.isSaving = false;
        if (res && (res.statusCode === 200 || res.statusCode === '200' || res.isSuccess || res.message === 'Success')) {
          this.toastr.success(
            this.isEdit ? 'Email template updated successfully' : 'Email template created successfully',
            'Success'
          );

          // Update local cache for immediate reflection in the list
          this.updateLocalCache(payload);
          this.router.navigate(['/settings/email-templates']);
        } else {
          const msg = res?.message || 'Failed to save email template';
          this.toastr.error(msg, 'Error');
        }
      },
      error: (err: any) => {
        this.isSaving = false;
        console.error('Error saving email template:', err);
        const errMsg = err?.error?.message || err?.message || 'Error occurred while saving email template';
        this.toastr.error(errMsg, 'Error');
      }
    });
  }

  private updateLocalCache(saved: any): void {
    try {
      const cached = localStorage.getItem('orville_email_templates');
      let list = cached ? JSON.parse(cached) : [];
      if (!Array.isArray(list)) list = [];

      const newRow = {
        id: this.templateId || Date.now(),
        name: saved.template_name,
        target: (this.feature === 'TENANTS' ? 'Tenant' : (this.feature === 'LANDLORDS' ? 'Landlord' : (this.feature === 'VENDORS' ? 'Vendor' : 'Property Manager'))),
        code: saved.code || String(Date.now()),
        feature: saved.feature,
        subject: saved.subject,
        to_address: saved.to_address,
        bcc_address: saved.bcc_address,
        format: saved.format,
        template_type: saved.template_type,
        format_type: saved.format_type,
        is_user_saved: true
      };

      const existingIndex = list.findIndex((item: any) => (item.code && item.code === newRow.code) || item.id === newRow.id);
      if (existingIndex >= 0) {
        list[existingIndex] = { ...list[existingIndex], ...newRow };
      } else {
        list.unshift(newRow);
      }
      localStorage.setItem('orville_email_templates', JSON.stringify(list));
    } catch {}
  }
}
