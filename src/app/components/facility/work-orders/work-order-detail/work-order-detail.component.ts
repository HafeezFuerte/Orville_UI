import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { PropertiesService } from '../../../portfolio/services/properties.service';
import { CommonService } from '../../../../services/common.service';

import { AttachmentsComponent } from '../../../child-tables/attachments/attachments.component';
import { NotesComponent } from '../../../child-tables/notes/notes.component'; 
import { environment } from '../../../../../environments/environment';
import { Common_TabsService } from '../../../portfolio/services/common_tabs.service';

@Component({
  selector: 'app-work-order-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedTableComponent, AttachmentsComponent, NotesComponent],
  templateUrl: './work-order-detail.component.html',
  styleUrl: './work-order-detail.component.scss'
})
export class WorkOrderDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private propertiesService = inject(PropertiesService);
  private commonService = inject(CommonService);
  private commonTabsService = inject(Common_TabsService);

  workOrderId: string = '';
  activeTab: string = 'Overview';
  tabs = ['Overview', 'Messages', 'Notes', 'Quotations', 'Attachments'];
  notesForm: any = {};
  attachmentsForm: any = {};
  tabsList: any[] = [];
  
  beforeImages: any[] = [];
  afterImages: any[] = [];
  videos: any[] = [];

  initializeTabs() {
    this.tabsList = [
      {
        key: 'Overview',
        label: 'Overview',
        layout: 'content',
        data: []
      },
      {
        key: 'Messages',
        label: 'Messages',
        layout: 'content',
        data: []
      },
      {
        key: 'Notes',
        label: 'Notes',
        entity: 'workorder',
        entity_id: this.workOrderId,
        data: this.notes || [],
        totalRecords: (this.notes || []).length,
        loading: false,
        hasActions: true,
        addButtonText: 'Notes',
        form: this.notesForm,
        popupType: 'notes'
      },
      {
        key: 'Quotations',
        label: 'Quotations',
        layout: 'table',
        data: []
      },
      {
        key: 'Attachments',
        label: 'Attachments',
        entity: 'workorder',
        entity_id: this.workOrderId,
        data: this.attachments || [],
        totalRecords: (this.attachments || []).length,
        loading: false,
        hasActions: true,
        addButtonText: 'Attachments',
        form: this.attachmentsForm,
        popupType: 'attachment'
      }
    ];
  }

  get selectedTab(): any {
    return this.tabsList.find(t => t.key === this.activeTab);
  }

  showAddCostModal = false;
  costDescription = '';
  costCategory = '';
  costAmount = '';
  costDate = '';
  includeInTotal = true;
  categories = ['Materials', 'Labor', 'Items'];

  // Popup states
  showStatusDropdown = false;
  showActionMenu = false;
  showMoreDetails = true;
  activePersonnelPopup: string | null = null;
  statusOptions = ['Open', 'In Progress', 'On Hold', 'Resolved', 'Rejected', 'Escalated', 'Re-Opened'];

  // Mock Data
  workOrderDetails = {
    id: '-',
    title: '-',
    priority: '-',
    category: '-',
    subcategory: '-',
    signatures: '-',
    resolvedDate: '-',
    createdDate: '-',
    lastUpdated: '-',
    closingStatus: '-',
    tenantRejectReason: '-',
    tenantRejected: '-',
    waitingSLA: '-',
    description: '-'
  };

  personnel = {
    activeTenant: '-',
    raisedBy: '-',
    responsiblePerson: '-',
    technician: '-',
    vendor: '-',
    vendorTechnician: 'Not Assigned',
    landlord: '-'
  };

  beforeImages: { name: string; url: string }[] = [
    { name: 'image.jpg', url: 'assets/images/work-order-detail/before-sample.jpg' }
  ];
  afterImages: { name: string; url: string }[] = [];
  videos: { name: string; url: string }[] = [];

  costs: any[] = [];

  costColumns = [
    { key: 'detail', label: 'Detail', visible: true },
    { key: 'category', label: 'Category', visible: true },
    { key: 'cost', label: 'Cost', visible: true },
    { key: 'action', label: 'Actions', visible: true, useTemplate: true }
  ];

  timeTracks: any[] = [];

  timeTrackColumns = [
    { key: 'technician', label: 'Technician', visible: true, useTemplate: true },
    { key: 'date', label: 'Date', visible: true },
    { key: 'time', label: 'Time', visible: true },
    { key: 'duration', label: 'Duration', visible: true }
  ];

  invoices: any[] = [];

  invoiceColumns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true },
    { key: 'status', label: 'Status', visible: true, useTemplate: true },
    { key: 'to', label: 'To', visible: true },
    { key: 'unit', label: 'Unit / Common Area', visible: true },
    { key: 'invoiceNumber', label: 'Invoice Number', visible: true },
    { key: 'chequeNo', label: 'Cheque no', visible: true },
    { key: 'invoiceDate', label: 'Invoice Date', visible: true },
    { key: 'invoiceType', label: 'Invoice Type', visible: true },
    { key: 'account', label: 'Account', visible: true },
    { key: 'currency', label: 'Currency', visible: true },
    { key: 'propertyName', label: 'Property Name', visible: true },
    { key: 'propertyId', label: 'Property ID', visible: true },
    { key: 'leaseId', label: 'Lease ID', visible: true },
    { key: 'leaseStatus', label: 'Lease Status', visible: true },
    { key: 'note', label: 'Note', visible: true },
    { key: 'workOrder', label: 'Work Order', visible: true },
    { key: 'amount', label: 'Amount', visible: true },
    { key: 'grossAmount', label: 'Gross Amount', visible: true },
    { key: 'paid', label: 'Paid', visible: true },
    { key: 'paymentVia', label: 'Payment Via', visible: true },
    { key: 'moneyHeldBy', label: 'Money Held By', visible: true },
    { key: 'doRefNo', label: 'DO Ref No', visible: true },
    { key: 'bankName', label: 'Bank Name', visible: true },
    { key: 'internalStatus', label: 'Internal Status', visible: true },
    { key: 'amtDue', label: 'Amt. Due', visible: true },
    { key: 'dueDate', label: 'Due Date', visible: true },
    { key: 'paidDate', label: 'Paid Date', visible: true },
    { key: 'cheques', label: 'Cheque(s)', visible: true },
    { key: 'days', label: 'Days', visible: true },
    { key: 'writeAmountOff', label: 'Write-Amount Off', visible: true },
    { key: 'createdBy', label: 'Created By', visible: true },
    { key: 'action', label: 'Action', visible: true, useTemplate: true }
  ];

  notes: any[] = [];

  noteColumns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true },
    { key: 'subject', label: 'Subject', visible: true },
    { key: 'content', label: 'Content', visible: true, useTemplate: true },
    { key: 'via', label: 'Via', visible: true },
    { key: 'noteDate', label: 'Note Date', visible: true },
    { key: 'createdAt', label: 'createdAt', visible: true },
    { key: 'UpdatedBy', label: 'UpdatedBy', visible: true },
    { key: 'createdBy', label: 'CreatedBy', visible: true },
    { key: 'Action', label: 'Action', visible: true }

  ];

  quotations: any[] = [];

  quotationColumns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true },
    { key: 'status', label: 'Status', visible: true, useTemplate: true },
    { key: 'vendorName', label: 'Vendor Name', visible: true },
    { key: 'quotationTitle', label: 'Quotation Title', visible: true },
    { key: 'quotationNumber', label: 'Quotation Number', visible: true },
    { key: 'totalPrice', label: 'Total Price', visible: true },
    { key: 'EstdPrice', label: 'Estd Price', visible: true },
    { key: 'deliveryDate', label: 'Delivery Date', visible: true },
    { key: 'quotationCategoryName', label: 'Quotation Category Name', visible: true },
    { key: 'LandlordStatus', label: 'Landlord Status', visible: true },
    { key: 'TenantStatus', label: 'Tenant Status', visible: true },
    { key: 'Username', label: 'Username', visible: true },
    { key: 'CreatedAt', label: 'Created At', visible: true },
    { key: 'UpdatedAt', label: 'Updated At', visible: true },
    { key: 'action', label: 'Action', visible: true, useTemplate: true }
  ];

  attachments: any[] = [];

  attachmentColumns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true },
    { key: 'fileType', label: 'File Type', visible: true },
    { key: 'docId', label: 'Doc ID', visible: true },
    { key: 'documentStatus', label: 'Document Status', visible: true, useTemplate: true },
    { key: 'issueDate', label: 'Issue Date', visible: true },
    { key: 'expiryDate', label: 'Expiry Date', visible: true },
    { key: 'files', label: 'Files', visible: true, useTemplate: true },
    { key: 'ShareLandlord', label: 'Share Landlord', visible: true },
    { key: 'ShareTenant', label: 'Share Tenant ', visible: true },
    { key: 'CreatedAt', label: 'Created At', visible: true },
    { key: 'UpdatedAt', label: 'Updated At', visible: true },
    { key: 'UploadedBy', label: 'Uploaded By', visible: true },
    { key: 'UpdatedAt', label: 'Updated At', visible: true },
    { key: 'Action', label: 'Action', visible: true, useTemplate: true }
  ];

  messages: any[] = [];

  newMessage: string = '';

  ngOnInit() {
    this.initializeTabs();
    this.route.params.subscribe(params => {
      this.workOrderId = params['id'];
      if (this.workOrderId) {
        this.getWorkOrderDetails();
      }
    });
  }

  getWorkOrderDetails() {
    const currentUser = this.commonService.getCurrentUser();
    const payload = {
      typeId: 21,
      typeid: 21,
      filterId: 0,
      filterText: this.workOrderId,
      filterText1: "",
      userId: currentUser?.userId || 1,
      clientId: currentUser?.clientId || "74BB6922",
      companyId: currentUser?.companyId || 1
    };

    this.propertiesService.getMasterDetails(payload).subscribe({
      next: (res: any) => {
        if (res && res.objResult) {
          const details = res.objResult.work_orders || res.objResult.table || res.objResult;
          if (Array.isArray(details) && details.length > 0) {
            const data = details[0];
            this.workOrderDetails = {
              id: data.id || data.code || this.workOrderId,
              title: data.title || data.workOrder || '-',
              priority: data.priority || '-',
              category: data.category || '-',
              subcategory: data.subcategory || '-',
              signatures: data.signatures || '-',
              resolvedDate: data.resolvedDate || '-',
              createdDate: data.createdAt || data.createdDate || '-',
              lastUpdated: data.lastUpdate || data.lastUpdated || '-',
              closingStatus: data.status || '-',
              tenantRejectReason: data.tenantRejectReason || '-',
              tenantRejected: data.tenantRejected || 'No',
              waitingSLA: data.waitingSLA || 'Hold to SLA',
              description: data.desc || data.description || data.workOrder || data.title || '-'
            };
            this.personnel = {
              activeTenant: data.tenant || '-',
              raisedBy: data.createdBy || '-',
              responsiblePerson: data.responsiblePerson || '-',
              technician: data.technician || '-',
              vendor: data.vendor || '-',
              vendorTechnician: data.vendorTechnician || data.vendor_technician || 'Not Assigned',
              landlord: data.landlord || '-'
            };
            const noteList = res.objResult.table1 || res.objResult.note || res.objResult.notes || res.objResult.note_dtls;
            if (Array.isArray(noteList) && noteList.length > 0) {
              this.notes = noteList.map((n: any) => ({
                code: n.code || n.id,
                subject: n.subject || '',
                description: n.desc || n.description || '',
                status: n.channel_type || n.status || '',
                uploaded_date: n.uploaded_date || n.created_date || n.createdAt || '',
                created_by: n.created_by || n.createdBy || ''
              }));
            }
            const docList = res.objResult.table2 || res.objResult.documents || res.objResult.document || res.objResult.attachments;
            if (Array.isArray(docList) && docList.length > 0) {
              this.attachments = docList.map((d: any) => ({
                code: d.code || d.id,
                document_type: d.document_type || d.documentType,
                document_type_name: d.document_type_name || d.fileType || '',
                doc_no: d.doc_no || d.docId || '',
                document_status_name: d.document_status_name || d.documentStatus || '',
                issue_date: d.issue_date || d.issueDate || '',
                expiry_date: d.expiry_date || d.expiryDate || '',
                file_path: d.file_path || d.files || ''
              }));

              // Filter images/videos
              this.beforeImages = this.attachments.filter(d => d.document_type == 30 || d.document_type_name === 'Before Image');
              this.afterImages = this.attachments.filter(d => d.document_type == 29 || d.document_type_name === 'After Image');
              this.videos = this.attachments.filter(d => d.document_type == 27 || d.document_type_name === 'Photo');
            }

            // Map Costs if returned by API
            const costList = res.objResult.costs || res.objResult.cost || res.objResult.cost_dtls;
            if (Array.isArray(costList) && costList.length > 0) {
              this.costs = costList.map((c: any) => ({
                detail: c.detail || c.description || '-',
                category: c.category || c.costCategory || '-',
                cost: c.cost || c.amount || '-'
              }));
            }

            // Map Time Tracks if returned by API
            const timeList = res.objResult.timeTracks || res.objResult.time_tracking;
            if (Array.isArray(timeList) && timeList.length > 0) {
              this.timeTracks = timeList.map((t: any) => ({
                technician: t.technician || t.technician_name || '-',
                date: t.date || t.created_date || '-',
                time: t.time || '-',
                duration: t.duration || '-'
              }));
            }

            // Map Invoices if returned by API
            const invoiceList = res.objResult.invoices || res.objResult.invoice;
            if (Array.isArray(invoiceList) && invoiceList.length > 0) {
              this.invoices = invoiceList.map((inv: any) => ({
                id: inv.id || inv.code || '-',
                status: inv.status || inv.invoiceStatus || '-',
                to: inv.to || inv.tenant_name || '-',
                unit: inv.unit || inv.unit_name || '-',
                invoiceNumber: inv.invoiceNumber || inv.invoice_no || '-',
                chequeNo: inv.chequeNo || inv.cheque_no || '-'
              }));
            }

            // Map Quotations if returned by API
            const quotationList = res.objResult.quotations || res.objResult.quotation || res.objResult.table2 || res.objResult.table3 || res.objResult.table4;
            if (Array.isArray(quotationList) && quotationList.length > 0) {
              this.quotations = quotationList.map((q: any) => ({
                id: q.id || q.code || '-',
                status: q.status || '-',
                vendorName: q.vendorName || q.vendor_name || '-',
                quotationTitle: q.quotationTitle || q.title || '-',
                quotationNumber: q.quotationNumber || q.quote_no || '-',
                totalPrice: q.totalPrice || q.total_price || '-',
                deliveryDate: q.deliveryDate || q.delivery_date || '-'
              }));
            }

            this.initializeTabs();
            
            // Query attachments using the resolved work order ID/code
            const resolvedId = data.id || data.code || this.workOrderId;
            this.loadAttachments(resolvedId);
          }
        }
      },
      error: (err) => {
        console.error("Error loading work order details:", err);
      }
    });
  }

  loadAttachments(resolvedId: string) {
    this.commonTabsService.getMasterByType({
      typeId: 34,
      filterId: 0,
      filterText: 'workorder',
      filterText1: resolvedId
    }).subscribe({
      next: (res: any) => {
        if (res && res.statusCode == 200 && res.objResult && res.objResult.table) {
          const docList = res.objResult.table;
          if (Array.isArray(docList) && docList.length > 0) {
            this.attachments = docList.map((d: any) => ({
              code: d.code || d.id,
              document_type: d.document_type || d.documentType,
              document_type_name: d.document_type_name || d.fileType || '',
              doc_no: d.doc_no || d.docId || '',
              document_status_name: d.document_status_name || d.documentStatus || '',
              issue_date: d.issue_date || d.issueDate || '',
              expiry_date: d.expiry_date || d.expiryDate || '',
              file_path: d.file_path || d.files || ''
            }));

            // Filter images/videos using loose type checks
            this.beforeImages = this.attachments.filter(d => d.document_type == 30 || d.document_type_name === 'Before Image');
            this.afterImages = this.attachments.filter(d => d.document_type == 29 || d.document_type_name === 'After Image');
            this.videos = this.attachments.filter(d => d.document_type == 27 || d.document_type_name === 'Photo');
          }
        }
      },
      error: (err) => console.error("Error loading attachments for work order:", err)
    });
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showActionMenu = false;
    this.showStatusDropdown = false;
    this.activePersonnelPopup = null;
  }

  navigateToEdit() {
    this.showActionMenu = false;
    this.router.navigate(['/facility/work-orders/edit', this.workOrderId]);
  }

  onWorkOrderAction(action: string): void {
    this.showActionMenu = false;
    if (action === 'edit') {
      this.navigateToEdit();
    }
    // invoice / feedback / report / email / activity / archive — UI only (no API)
  }

  goBack() {
    this.router.navigate(['/facility/work-orders']);
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.showStatusDropdown = false;
    this.showActionMenu = false;
    this.activePersonnelPopup = null;
  }

  selectStatus(status: string): void {
    this.workOrderDetails.closingStatus = status;
    this.showStatusDropdown = false;
  }

  toggleMoreDetails(): void {
    this.showMoreDetails = !this.showMoreDetails;
  }

  priorityBadgeClass(priority?: string): string {
    const value = (priority || '').toLowerCase();
    if (value === 'high' || value === 'emergency' || value === 'critical') {
      return 'wo-badge wo-badge--danger';
    }
    if (value === 'medium') {
      return 'wo-badge wo-badge--warning';
    }
    if (value === 'low') {
      return 'wo-badge wo-badge--success';
    }
    return 'wo-badge';
  }

  initials(name?: string): string {
    if (!name || name === '-') {
      return '--';
    }
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  openAddCostModal() {
    this.showAddCostModal = true;
  }

  closeAddCostModal() {
    this.showAddCostModal = false;
  }

  saveCost() {
    if (this.costDescription && this.costCategory && this.costAmount) {
      this.costs.push({
        detail: this.costDescription,
        category: this.costCategory,
        cost: '$' + parseFloat(this.costAmount).toFixed(2)
      });
    }
    this.closeAddCostModal();
  }

  togglePersonnelPopup(person: string) {
    if (this.activePersonnelPopup === person) {
      this.activePersonnelPopup = null;
    } else {
      this.activePersonnelPopup = person;
    }
  }

  closePersonnelPopup() {
    this.activePersonnelPopup = null;
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({
        sender: 'Me',
        role: 'Admin',
        avatar: 'ME',
        text: this.newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true
      });
      this.newMessage = '';
    }
  }

  getFileUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    return environment.apiurl + path;
  }

  openImage(path: string) {
    if (path) {
      window.open(this.getFileUrl(path), '_blank');
    }
  }
}
