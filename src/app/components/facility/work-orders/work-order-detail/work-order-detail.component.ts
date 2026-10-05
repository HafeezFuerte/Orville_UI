import { TranslateModule } from '@ngx-translate/core';
import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { PropertiesService } from '../../../portfolio/services/properties.service';
import { CommonService } from '../../../../services/common.service';

import { AttachmentsComponent } from '../../../child-tables/attachments/attachments.component';
import { NotesComponent } from '../../../child-tables/notes/notes.component'; 
import { environment } from '../../../../../environments/environment';
import { Common_TabsService } from '../../../portfolio/services/common_tabs.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-work-order-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedTableComponent, AttachmentsComponent, NotesComponent, TranslateModule],
  templateUrl: './work-order-detail.component.html',
  styleUrl: './work-order-detail.component.scss'
})
export class WorkOrderDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private propertiesService = inject(PropertiesService);
  private commonService = inject(CommonService);
  private commonTabsService = inject(Common_TabsService);
  private toastr=inject(ToastrService);

  workOrderId: string = '';
  activeTab: string = 'Overview';
  tabs = ['Overview', 'Messages', 'Notes', 'Quotations', 'Inventory Request', 'Attachments'];
  notesForm: any = {};
  attachmentsForm: any = {};
  tabsList: any[] = [];
  
  beforeImages: any[] = [
    { name: 'image.jpg', url: 'assets/images/work-order-detail/before-sample.jpg' }
  ];
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
        key: 'Inventory Request',
        label: 'Inventory Request',
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
  statusOptions :any= [];

  // Mock Data
  workOrderDetails :any= {};
  updatednotes:string='';
  personnel = {
    activeTenant: '-',
    raisedBy: '-',
    responsiblePerson: '-',
    technician: '-',
    vendor: '-',
    vendorTechnician: 'Not Assigned',
    landlord: '-'
  };

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

  inventoryRequests: any[] = [];
  inventoryRequestSearch = '';

  inventoryRequestColumns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true },
    { key: 'name', label: 'Name', visible: true },
    { key: 'storeroom', label: 'Storeroom', visible: true },
    { key: 'requestedFor', label: 'Requested For', visible: true },
    { key: 'requestedDate', label: 'Requested Date', visible: true },
    { key: 'requiredDate', label: 'Required Date', visible: true },
    { key: 'items', label: 'Line Items', visible: true },
    { key: 'status', label: 'Status', visible: true, useTemplate: true }
  ];

  get filteredInventoryRequests(): any[] {
    const term = this.inventoryRequestSearch.trim().toLowerCase();
    if (!term) return this.inventoryRequests;
    return this.inventoryRequests.filter(r =>
      [r.id, r.name, r.storeroom, r.requestedFor].some(v => String(v ?? '').toLowerCase().includes(term)));
  }

  showInventoryRequestModal = false;
  inventoryItems: any[] = [];
  inventoryLoaded = false;
  lineItemTypes = ['Item', 'Tool'];
  irForm: any = this.emptyInventoryRequestForm();

  get requestedForOptions(): string[] {
    const p = this.personnel;
    const names = [this.currentUserName, p.activeTenant, p.raisedBy, p.responsiblePerson, p.technician, p.vendor, p.vendorTechnician];
    return [...new Set(names.filter(n => n && n !== '-' && n !== 'Not Assigned'))];
  }

  get storeroomOptions(): string[] {
    return [...new Set(this.inventoryItems.map(i => i.location).filter(l => l && l !== '-'))];
  }

  get currentUserName(): string {
    return this.commonService.getCurrentUser()?.userName || '-';
  }

  openInventoryRequestModal(): void {
    this.irForm = this.emptyInventoryRequestForm();
    this.showInventoryRequestModal = true;
    if (!this.inventoryLoaded) {
      this.loadInventoryItems();
    }
  }

  closeInventoryRequestModal(): void {
    this.showInventoryRequestModal = false;
  }

  addLineItem(): void {
    this.irForm.lines.push({ type: 'Item', itemId: '', qty: null });
  }

  removeLineItem(index: number): void {
    this.irForm.lines.splice(index, 1);
  }

  availableQty(line: any): number {
    return this.inventoryItems.find(i => i.id === line.itemId)?.stock ?? 0;
  }

  submitInventoryRequest(): void {
    const f = this.irForm;
    const lines = f.lines.filter((l: any) => l.itemId && Number(l.qty) > 0);
    if (!f.name.trim() || !f.requestedFor || !f.storeroom) {
      this.toastr.error('Please fill all required fields');
      return;
    }
    if (!lines.length) {
      this.toastr.error('Add at least one line item with quantity');
      return;
    }
    this.inventoryRequests.unshift({
      id: 'IR-' + String(this.inventoryRequests.length + 1).padStart(3, '0'),
      name: f.name.trim(),
      storeroom: f.storeroom,
      requestedFor: f.requestedFor,
      requestedDate: f.requestedDate,
      requiredDate: f.requiredDate ? formatDate(f.requiredDate, 'dd-MMM-yyyy', 'en-US') : '-',
      items: lines.length,
      status: 'Pending'
    });
    this.closeInventoryRequestModal();
  }

  private emptyInventoryRequestForm(): any {
    return {
      name: `Inventory Request from Work Order #${this.workOrderId || ''}`,
      description: '',
      requestedDate: formatDate(new Date(), 'dd-MMM-yyyy', 'en-US'),
      requiredDate: '',
      requestedFor: '',
      storeroom: '',
      lines: [{ type: 'Item', itemId: '', qty: null }]
    };
  }

  private loadInventoryItems(): void {
    const currentUser = this.commonService.getCurrentUser();
    this.commonTabsService.getCommonGrid({
      userid: currentUser?.userId || 1,
      company_id: currentUser?.companyId || 1,
      clientId: currentUser?.clientId || '74BB6922',
      clientID: currentUser?.clientId || '74BB6922',
      source: 'web',
      languageid: 1,
      page_no: 0,
      seqno: 0,
      search_keyword: '',
      pagecount: 100,
      feature: 'INVENTORY_ITEMS',
      featureid: 'INVENTORY_ITEMS',
      search_columns: 'P.item_name,P.location',
      filter_by: ''
    }).subscribe({
      next: (res: any) => {
        this.inventoryLoaded = true;
        const raw = res?.objResult?.inventory_items || res?.objResult?.inventory || res?.objResult?.table || [];
        this.inventoryItems = raw.map((item: any, idx: number) => ({
          id: String(item.code || item.id || idx),
          name: item.item_name || item.name || item.itemName || '-',
          location: item.location_name || item.property_name || item.location || item.property || '-',
          stock: Number(item.qty ?? item.quantity ?? item.stock_qty ?? item.available_qty ?? 0) || 0
        }));
      },
      error: (err: any) => console.error('Error loading inventory items:', err)
    });
  }

  attachments: any[] = [];

  attachmentColumns =[
    { key: 'id', label: 'ID', visible: true, useTemplate: true },
    { key: 'fileType', label: 'File Type', visible: true },
    { key: 'docId', label: 'Doc ID', visible: true },
    { key: 'documentStatus', label: 'Document Status', visible: true, useTemplate: true },
    { key: 'issueDate', label: 'Issue Date', visible: true },
    { key: 'expiryDate', label: 'Expiry Date', visible: true },
    { key: 'files', label: 'Files', visible: true, useTemplate: true,isLink:true },
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
    this.loadlookup(2,29,'statusOptions','','');
    this.route.params.subscribe(params => {
      this.workOrderId = params['code'];
      if (this.workOrderId) {
        this.getWorkOrderDetails();
      }
    });
  }
  loadlookup(typeId: number, filterId: number, targetProperty: string, filterText: string, filterText1: string) {
    this.commonTabsService.getMasterByType({
      typeId: typeId,
      filterId: filterId,
      filterText: filterText,
      filterText1: filterText1
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult) {
          if(typeId==77){
            this.toastr.success("Successfully updated the status");
            setTimeout(() => {
              window.location.reload();
            }, 5000);
          }
          else
            (this as any)[targetProperty] = res.objResult.table || [];
        }
      },
      error: (err) => {
        console.error(`Error fetching lookup ${filterId}:`, err);
      }
    });
  }
  getInitials(name: string): string {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    return parts[0].charAt(0) + (parts.length > 1 ? parts[1].charAt(0) : '');
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
              id:  data.code || this.workOrderId,
              title: data.title || data.workOrder || '-',
              priority: data.priority || '-',
              category: data.maintenance_name || '-',
              site: data.property_name || data.property || data.building_name || data.building || '-',
              due_date:this.commonService.formatDateForInput(data.due_date),
              subcategory: data.maintenance_sub_name || '-',
              signatures: data.signatures || '-',
              resolvedDate: data.resolvedDate || '-',
              createdDate: this.commonService.formatDateForInput(data.created_date)|| '-',
              lastUpdated: this.commonService.formatDateForInput(data.modified_date)|| '-',
              closingStatus: data.status_nm || '-',
              updatestatusid:data.status,
              tenantRejectReason: data.tenantRejectReason || '-',
              tenantRejected: data.tenantRejected || 'No',
              waitingSLA: data.waitingSLA || 'Hold to SLA',
              visiting_slot:data.visitingslot || '',
              estimation:data.estimation_duration,
              estimationtype:data.estimation_duration_type,
              description: data.desc || data.description || data.workOrder || data.title || '-'
            };
            this.personnel = {
              activeTenant: data.tenant || '-',
              raisedBy: data.createdby || '-',
              responsiblePerson: data.reponsibleperson || '-',
              technician: data.technician || '-',
              vendor: data.vendor || '-',
              vendorTechnician: data.vendorTechnician || data.vendor_technician || 'Not Assigned',
              landlord: data.landlord || '-'
            };
            this.notes= res.objResult.table1 || [];
            this.attachments= res.objResult.table2 || []; 
            if(this.attachments.length>0){

            this.beforeImages = this.attachments.filter(d => d.document_type == 30 || d.document_type_name === 'Before Image');
            this.afterImages = this.attachments.filter(d => d.document_type == 29 || d.document_type_name === 'After Image');
            this.videos = this.attachments.filter(d => d.document_type == 28);
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
           
          }
        }
      },
      error: (err) => {
        console.error("Error loading work order details:", err);
      }
    });
  }

  updateworkorder(){
    if(this.workOrderDetails.updatestatusid==null || this.workOrderDetails.updatestatusid==""){
      this.toastr.error("Invalid status id");
      return;
     }
    if(this.updatednotes==null || this.updatednotes==""){
     this.toastr.error("Invalid comments");
     return;
    }
    else{
      this.loadlookup(77,this.workOrderDetails.updatestatusid,'',this.workOrderId,this.updatednotes);
    }
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
    else if (action==="invoice"){
      this.router.navigate(['/accounting/invoices/create']);
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

  selectStatus(status: any): void {
    this.workOrderDetails.closingStatus = status.name;
    this.workOrderDetails.updatestatusid=status.id;
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
      // this.messages.push({
      //   sender: 'Me',
      //   role: 'Admin',
      //   avatar: 'ME',
      //   text: "Thank you for contacting ,once support executive is available will contact you",
      //   time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      //   isMe: false
      // });
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
