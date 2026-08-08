import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { PropertiesService } from '../../../portfolio/services/properties.service';
import { CommonService } from '../../../../services/common.service';

import { AttachmentsComponent } from '../../../child-tables/attachments/attachments.component';
import { NotesComponent } from '../../../child-tables/notes/notes.component';

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

  workOrderId: string = '';
  activeTab: string = 'Overview';
  tabs = ['Overview', 'Messages', 'Notes', 'Quotations', 'Attachments'];
  notesForm: any = {};
  attachmentsForm: any = {};

  get selectedTab(): any {
    if (this.activeTab === 'Notes') {
      return {
        key: 'notes',
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
      };
    }
    if (this.activeTab === 'Attachments') {
      return {
        key: 'attachments',
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
      };
    }
    return null;
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
  activePersonnelPopup: string | null = null;

  // Mock Data
  workOrderDetails = {
    id: '327856',
    title: 'Ac not working',
    priority: 'High',
    category: 'Air Conditioner',
    subcategory: '-',
    signatures: '-',
    resolvedDate: '07-07-2024',
    createdDate: '04-06-2024',
    lastUpdated: '04-06-2024',
    closingStatus: 'Closed',
    tenantRejectReason: '-',
    tenantRejected: 'No',
    waitingSLA: 'Hold to SLA'
  };

  personnel = {
    activeTenant: 'James T. Hind',
    raisedBy: 'Zaid Rahman',
    responsiblePerson: 'Sanul Hameed',
    technician: 'Kaif Mohammed',
    vendor: 'Rahman Mohammad',
    landlord: 'Orville Real Estate'
  };

  costs = [
    { detail: 'HVAC Filter Replacement', category: 'Materials', cost: '$45.00' },
    { detail: '24/07 - 2 Hours', category: 'Labor', cost: '$150.00' },
    { detail: 'refrigerant recharge', category: 'Items', cost: '$85.00' }
  ];

  costColumns = [
    { key: 'detail', label: 'Detail', visible: true },
    { key: 'category', label: 'Category', visible: true },
    { key: 'cost', label: 'Cost', visible: true },
    { key: 'action', label: 'Actions', visible: true, useTemplate: true }
  ];

  timeTracks = [
    { technician: 'John Martinez', date: '06/15/2024', time: '9:30 AM', duration: '2h 30m' },
    { technician: 'Sarah Jenkins', date: '06/16/2024', time: '11:45 AM', duration: '1h 15m' },
    { technician: 'Robert Chen', date: '06/16/2024', time: '2:00 PM', duration: '3h 00m' }
  ];

  timeTrackColumns = [
    { key: 'technician', label: 'Technician', visible: true, useTemplate: true },
    { key: 'date', label: 'Date', visible: true },
    { key: 'time', label: 'Time', visible: true },
    { key: 'duration', label: 'Duration', visible: true }
  ];

  invoices = [
    { id: '1817939', status: 'Unpaid', to: 'Atif Shahzad', unit: '103-PR-1D', invoiceNumber: 'INV-36-00367223', chequeNo: '67223' },
    { id: '1817940', status: 'Paid', to: 'Atif Shahzad', unit: '103-PR-1D', invoiceNumber: 'INV-36-00367223', chequeNo: '67223' },
    { id: '1817941', status: 'Draft', to: 'Atif Shahzad', unit: '103-PR-1D', invoiceNumber: 'INV-36-00367223', chequeNo: '67223' },
    { id: '1817942', status: 'Unpaid', to: 'Atif Shahzad', unit: '103-PR-1D', invoiceNumber: 'INV-36-00367223', chequeNo: '67223' },
    { id: '1817943', status: 'Overdue', to: 'Atif Shahzad', unit: '103-PR-1D', invoiceNumber: 'INV-36-00367223', chequeNo: '67223' }
  ];

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

  notes = [
    { code: '51655', subject: 'Move-in condition', description: 'Tenant reported minor paint marks near the living room window. Schedule touch up...', status: 'Portal', uploaded_date: '2024-01-12T00:00:00', created_by: 'Admin (System)' },
    { code: '51656', subject: 'Rent reminder', description: 'Friendly reminder sent to tenant regarding upcoming rent payment due on the first we...', status: 'Portal', uploaded_date: '2024-01-12T00:00:00', created_by: 'Admin (System)' },
    { code: '51657', subject: 'Plumbing follow up', description: 'Kitchen sink drainage issue resolved. Vendor confirmed replacement part is required bef...', status: 'Office', uploaded_date: '2024-01-12T00:00:00', created_by: 'Admin (System)' },
    { code: '51658', subject: 'Inspection scheduled', description: 'Quarterly property inspection booked. Tenant has acknowledged the proposed visit window.', status: 'Phone', uploaded_date: '2024-01-12T00:00:00', created_by: 'Admin (System)' }
  ];

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

  quotations = [
    { id: 'AFT-1001', status: 'Pending', vendorName: 'ProFix Services', quotationTitle: 'Kitchen plumbing repair', quotationNumber: 'QTN-2024-0001', totalPrice: 'AED 2,550.00', deliveryDate: '10-02-2024' },
    { id: 'AFT-1002', status: 'Approved', vendorName: 'Bright Volt LLC', quotationTitle: 'Annual electrical inspection', quotationNumber: 'QTN-2024-0002', totalPrice: 'AED 3,250.00', deliveryDate: '15-02-2024' }
  ];

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

  attachments = [
    { code: 'ATT-1001', document_type_name: 'Inspection Report', doc_no: 'DOC-1001', document_status_name: 'Active', issue_date: '2024-01-10T00:00:00', expiry_date: '2025-01-10T00:00:00', file_path: 'Inspection_Report.pdf' },
    { code: 'ATT-1002', document_type_name: 'Maintenance Report', doc_no: 'DOC-1002', document_status_name: 'Verified', issue_date: '2024-01-12T00:00:00', expiry_date: '2025-01-12T00:00:00', file_path: 'Maintenance_Report.pdf' }
  ];

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

  messages = [
    {
      sender: 'Mohammed Zaid',
      role: 'Tenant',
      avatar: 'MZ',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam interdum finibus mi vel bibendum.',
      time: '10:45',
      isMe: false
    },
    {
      sender: 'Me',
      role: 'Admin',
      avatar: 'ME',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam interdum finibus mi vel bibendum.',
      time: '10:45',
      isMe: true
    },
    {
      sender: 'Mohammed Zaid',
      role: 'Tenant',
      avatar: 'MZ',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam interdum finibus mi vel bibendum.',
      time: '10:45',
      isMe: false
    },
    {
      sender: 'Me',
      role: 'Admin',
      avatar: 'ME',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam interdum finibus mi vel bibendum.',
      time: '10:45',
      isMe: true
    }
  ];

  newMessage: string = '';

  ngOnInit() {
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
              waitingSLA: data.waitingSLA || 'Hold to SLA'
            };
            this.personnel = {
              activeTenant: data.tenant || '-',
              raisedBy: data.createdBy || '-',
              responsiblePerson: data.responsiblePerson || '-',
              technician: data.technician || '-',
              vendor: data.vendor || '-',
              landlord: data.landlord || '-'
            };
            const noteList = res.objResult.note || res.objResult.notes || res.objResult.note_dtls;
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
            const docList = res.objResult.documents || res.objResult.document || res.objResult.attachments;
            if (Array.isArray(docList) && docList.length > 0) {
              this.attachments = docList.map((d: any) => ({
                code: d.code || d.id,
                document_type_name: d.document_type_name || d.fileType || '',
                doc_no: d.doc_no || d.docId || '',
                document_status_name: d.document_status_name || d.documentStatus || '',
                issue_date: d.issue_date || d.issueDate || '',
                expiry_date: d.expiry_date || d.expiryDate || '',
                file_path: d.file_path || d.files || ''
              }));
            }
          }
        }
      },
      error: (err) => {
        console.error("Error loading work order details:", err);
      }
    });
  }

  navigateToEdit() {
    this.router.navigate(['/facility/work-orders/edit', this.workOrderId]);
  }

  goBack() {
    this.router.navigate(['/facility/work-orders']);
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
}
