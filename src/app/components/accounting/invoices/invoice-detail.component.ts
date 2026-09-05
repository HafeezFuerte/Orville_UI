import { Component, HostListener, OnInit,inject } from '@angular/core';
import { CommonModule,formatDate } from '@angular/common';
import { FormsModule,FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { Common_TabsService } from '../../portfolio/services/common_tabs.service';
import { ToastrService } from 'ngx-toastr';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { NotesComponent } from '../../child-tables/notes/notes.component';
import { AttachmentsComponent } from '../../child-tables/attachments/attachments.component';
import { AccountingService } from '../accounting.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import {
  CHEQUE_COLUMNS,
  INVOICE_CHEQUE_ROWS,
  INVOICE_DETAIL,
  INVOICE_OVERVIEW_ROWS,
  INVOICE_PENALTY_ROWS,
  INVOICE_TXN_ROWS,
  InvoiceChequeRow,
  InvoiceCol,
  InvoiceDetail,
  InvoiceOverviewRow,
  InvoicePenaltyRow,
  InvoiceTxnRow,
  OVERVIEW_COLUMNS,
  PENALTY_COLUMNS,
  TXN_COLUMNS
} from './invoice-detail.data';
import { INVOICE_ROWS } from './invoices.data';
import { FinancialsComponent } from '../../child-tables/financials/financials.component';
import { FileUploadComponent } from '../../../shared/components/file-upload/file-upload.component';
type TableKey = 'overview' | 'cheques' | 'txns' | 'penalties';

@Component({
  selector: 'app-invoice-detail',
  standalone: true,
  imports: [CommonModule,FileUploadComponent,NgSelectModule,NotesComponent,TranslateModule,AttachmentsComponent, FormsModule,SharedTableComponent, RouterModule, FinancialsComponent],
  templateUrl: './invoice-detail.component.html',
  styleUrl: './invoice-detail.component.scss'
})
export class InvoiceDetailComponent implements OnInit {
  invoice: any={}; 
  Form!: FormGroup;
  loading:boolean=false;
  invoice_no:string='';
  attachedFile:any='';
  isLoading:boolean=false;
  approveComments: string = '';
  notesData : any[] = [];
  leaseInfo:any= {};
  attahmentData : any[] = [];
  coa_list:any=[];
  paymentMethods:any=[];
  receiptslist:any=[];
  invoicesList:any=[];
  overviewRows: InvoiceOverviewRow[] = INVOICE_OVERVIEW_ROWS;
  private toastr = inject(ToastrService);
  private commonService = inject(CommonService);
  private commontabservice = inject(Common_TabsService);
  private accountingservice = inject(AccountingService);
  receivepayment:any= { receivefull:1, Amount:0,paiddate:null,payment_via:0,account:'',notes:'',reciept_file:null}
  showApprovalMenu = false;
  showApprovalModal=false;
  showReceivePayment=false;
  IsMarkAsPaid=false;
  ApprovalModalText="Approve";
  currentUser = this.commonService.getCurrentUser(); 
  approvalUser:any={};
  approvalSteps:any=[];
  showProgressPopover: boolean = false;

  actionOptions: {
    label: string;
    icon: string;
    asset?: string;
    danger?: boolean;
    dangerIcon?: boolean;
  }[] = [
      { label: 'Edit Invoice', icon: 'ri-pencil-line', asset: 'assets/images/action-menu/pencil.svg' },
      // { label: 'Request for Approval', icon: 'ri-checkbox-line' },
      { label: 'Send reminder', icon: 'ri-attachment-2', asset: 'assets/images/action-menu/paperclip.svg' }, 
      { label: 'Back to list', icon: 'ri-mail-line' },
      { label: 'View activity', icon: 'ri-time-line', asset: 'assets/images/action-menu/clock.svg' },
      { label: 'Archive', icon: 'ri-delete-bin-line', asset: 'assets/images/action-menu/archive.svg', danger: true }

    ];

  // get invoicesList(): any[] {
  //   const numAmt = Number(this.invoice.amountDue.replace(/[^\d.]/g, '')) || Number(this.invoice.balance.replace(/[^\d.]/g, '')) || 3000;
  //   return [{
  //     rcp_no: this.invoice.invoiceNo,
  //     cheque_status: this.invoice.status,
  //     created_date: this.invoice.issueDate,
  //     cheque_date: this.invoice.dueDate,
  //     payment_type: this.invoice.paymentVia,
  //     amt: numAmt,
  //     receipts: this.chequeRows.map((c) => ({
  //       receiptNo: c.chequeNo ? c.chequeNo.replace('CH', 'RCP') : 'RCP-' + c.id,
  //       date: c.chequeDate,
  //       method: this.invoice.paymentVia || 'Cheque',
  //       reference: c.chequeNo || '-',
  //       amount: Number(c.amount.replace(/[^\d.]/g, '')) || 0,
  //       status: c.status || 'Cleared'
  //     }))
  //   }];
  // }
 

 
  
  filteredCheques:any=[];

  filteredTxns:any=[];
  tabs:any=[];
  filteredPenalties:any=[];
  chequeRows: any=[];
  txnRows: any=[];
  penaltyRows:any=[];

  overviewCols = OVERVIEW_COLUMNS.map((col) => ({ ...col }));
  chequeCols = CHEQUE_COLUMNS.map((col) => ({ ...col }));
  txnCols = TXN_COLUMNS.map((col) => ({ ...col }));
  penaltyCols = PENALTY_COLUMNS.map((col) => ({ ...col }));

  overviewQuery = '';
  chequeQuery = '';
  txnQuery = '';
  penaltyQuery = '';
  openColumnMenu: TableKey | null = null;
  actionOpen = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }
    this.invoice_no=id;  
    this.getInvoiceDetails();
    this.loadLookup(2,23, 'paymentMethods', '','');
    this.loadLookup(2,1003, 'coa_list', '',''); 
  }
  get selectedNotesTab(): any | undefined {
    return this.tabs.find((t:any) => t.key === "notes");
  }
  get selectedAttachmentTab(): any | undefined {
    return this.tabs.find((t:any) => t.key === "attachments");
  }
  initializeTabs() {

    this.tabs = [ 
      {
        key: 'attachments',
        label: 'web.common.lblAttachments',
        layout: 'content',
        entity: "Invoices",
        entity_id: this.invoice_no,
        data: this.attahmentData,
        totalRecords: this.attahmentData?.length || 0,
        loading: this.loading,
        hasActions: true,
        addButtonText: 'Attachments',
        form: this.Form,
        popupType: 'attachment'
      },
     
      {
        key: 'notes',
        label: 'web.common.lblNotes',
        layout: 'content',
        entity: "Invoices",
        entity_id: this.invoice_no,
        data: this.notesData,
        totalRecords: this.notesData?.length || 0,
        loading: this.loading,
        hasActions: true,
        addButtonText: 'Notes',
        form: this.Form,
        popupType: 'notes'
      }, 
    ];

  }
  
  loadLookup(typeId: number,filterId: number, targetProperty: string, filterText: string, filterText1: string) {
    this.commontabservice.getMasterByType({
      typeId: typeId,
      filterId: filterId,
      filterText: filterText,
      filterText1: filterText1
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult.table) {   
            (this as any)[targetProperty] = res.objResult.table;   
        }
      },
      error: (err:any) => {
        console.error(`Error fetching lookup ${filterId}:`, err);
      }
    });
  }
  getInvoiceDetails() {
    this.commontabservice.getMasterByType({
      typeId: 52,
      filterId: 0,
      filterText: this.invoice_no,
      filterText1: ''
    }).subscribe({
      next: (res: any) => { 
        if (res.statusCode == 200 && res.objResult && res.objResult.invoice_dtls) { 
          this.invoicesList= res.objResult.invoice_dtls || [];
          this.invoice=this.invoicesList[0] || {};
          this.receiptslist= res.objResult.receipt_dtls || []; 
          this.notesData=res.objResult.notes || []; 
          this.attahmentData=res.objResult.documents || [];
          this.leaseInfo={
            tenant: this.invoice.tenant,
            lease: this.invoice.active_lease,
            property: this.invoice.property_name, 
            code: this.invoice.lease_id 
          };
          this.approvalUser= res.objResult.approval_dtls[0] || {}
          this.approvalSteps=res.objResult.approval_steps || [];
          this.initializeTabs();

          if(this.invoice.status==252){ // draft mode
            this.actionOptions.splice(1, 0, {
              label: 'Request for Approval',
              icon: 'ri-checkbox-line'
            }); 
          } 
          if(this.invoice.status==251){ // If it is unpaid mode
            this.actionOptions.splice(2, 0, {
              label: 'Mark as paid',
              icon: 'Mark as paid',
              asset: 'assets/images/action-menu/file-invoice.svg'
            }); 
          }
        }
        else
          this.toastr.error("No record[s] found");
      },
      error: (err) => {
        console.error(`Error fetching typeid: 22:`, err);
      }
    });
  }
  getArabicLookupName(row: any, key: string): string {
    const selectedLang = localStorage.getItem("selectedLang") || "EN";
    return row[(selectedLang === "EN" ? key : key + '_ar')] || row[key] || '';
  }
  goBack(): void {
    void this.router.navigate(['/accounting/invoices']);
  }
  OnApproveClick(strText:string) {
    this.showApprovalModal = true;
    this.showApprovalMenu=false;
    this.ApprovalModalText=strText + " Invoice";
    this.IsMarkAsPaid=false;
  }
  OnMarkAsPaid() {
    this.showApprovalModal = true;
    this.showApprovalMenu=false;
    this.ApprovalModalText= "Mark As Paid";
    this.IsMarkAsPaid=true;
  }
  onFilesSelected(files: File[]) {
    if (files.length > 0) {
      this.attachedFile=files[0];
    } else {
      this.attachedFile=null;
    }
  }
  showPaymentmodal(){
    this.showReceivePayment=!this.showReceivePayment;
    this.receivepayment.Amount=this.invoice?.total_amount;
    this.receivepayment.paiddate =this.commonService.formatDateForInput(formatDate(new Date(), 'yyyy-MM-dd', 'en-US'));
  }
  save_payment(){
    if(this.receivepayment.Amount==0){
      this.toastr.error("Invalid amount");
      return;
    }
    else if(this.receivepayment.payment_via==0){
      this.toastr.error("Invalid payment type");
      return;
    } 
    else{ 
      const request = {
        userid: this.currentUser?.userId,
        code: this.invoice?.code || '',
        source: 'web',
        company_id: this.currentUser?.companyId, 
        clientId: this.currentUser?.clientId, 
        rcp_code: '',
        invoice_type:"Invoice",
        invoice_code: this.invoice?.code,
        payment_type: this.receivepayment.payment_via,
        account_code: this.receivepayment.account,
        payment_date: this.receivepayment.paiddate ==null ? formatDate(new Date(), 'yyyy-MM-dd', 'en-US') : this.commonService.parseInputDate(this.receivepayment.paiddate),
        payment_status: 262 , //262-(paid status id), 263- Partial paid id
        amount: this.receivepayment.Amount, 
        notes: this.receivepayment.notes,    
   
      }; 
 
      const formData = new FormData(); 
    // JSON goes as ONE field
    formData.append('reqObject', JSON.stringify(request));
    if(this.attachedFile!='')
      formData.append("attachment", this.attachedFile); 
   
     this.accountingservice.save_invoice_payment(formData).subscribe({
        next: (res:any) => {
          this.isLoading = false;
          if (res["statusCode"] == "200") {
            this.toastr.success('Successfully Received Payment');
            setTimeout(() => {
              window.location.reload()
            }, 3000);
          }
          else{
            this.toastr.error(res['message']);
            return;
          }
        },
        error: (err:any) => {
          this.isLoading = false;
        },
      });
    }
  }

  toggleAction(event: Event): void {
    event.stopPropagation();
    this.actionOpen = !this.actionOpen;
    this.openColumnMenu = null;
  }

  toggleColumnMenu(key: TableKey, event: Event): void {
    event.stopPropagation();
    this.openColumnMenu = this.openColumnMenu === key ? null : key;
    this.actionOpen = false;
  }

  @HostListener('document:click')
  closeMenus(): void {
    this.actionOpen = false;
    this.openColumnMenu = null;
  }

  visible(cols: InvoiceCol[]): InvoiceCol[] {
    return cols.filter((col) => col.visible);
  }

  allSelected(cols: InvoiceCol[]): boolean {
    return cols.every((col) => col.visible);
  }

  toggleColumn(cols: InvoiceCol[], key: string): void {
    const col = cols.find((item) => item.key === key);
    if (col) {
      col.visible = !col.visible;
    }
  }
  toggleProgressPopover(): void {
    this.showProgressPopover = !this.showProgressPopover;
    if (this.showProgressPopover) {
      this.actionOpen = false;
      this.showApprovalMenu = false;
    }
  }

  get hasDangerAction(): boolean {
    return this.actionOptions.some((o: any) => o.danger);
  }
  onActionClick(label: string): void {
    this.actionOpen = false;
    if (label === 'Edit Invoice') {
      this.actionOpen = false;
      this.router.navigate(['/accounting/invoices/edit-invoice', this.invoice?.code]);
    } 
    else if (label === 'Request for Approval') {
      this.sendForApproval();
    }  
    else if (label === 'Mark as paid') {
      this.showReceivePayment=!this.showReceivePayment;
      this.receivepayment.Amount=this.invoice?.total_amount;
      this.receivepayment.paiddate =this.commonService.formatDateForInput(formatDate(new Date(), 'yyyy-MM-dd', 'en-US'));
    }
    else if (label === 'Back to list') { 
      this.router.navigate(['/accounting/invoices']);
    }
  }
  sendApprovalReminder(): void {
    this.toastr.success('Approval reminder sent successfully');
  }
  sendForApproval() {
    this.commontabservice.getMasterByType({
      typeId: !this.IsMarkAsPaid ? 58: 60,
      filterId: 0,
      filterText: this.invoice_no,
      filterText1: 'Invoices'
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult) {
          this.toastr.success("Successfully send to approval");
          setTimeout(() => {
             window.location.reload();
          }, 2000);
        }
        else
          this.toastr.error("No record[s] found");
      },
      error: (err) => {
        console.error(`Error fetching typeid: 22:`, err);
      }
    });
  }
  ApproveRejectLease() {
    if(this.approveComments==null || this.approveComments==""){
      this.toastr.error(`Invalid  ${this.ApprovalModalText} comments`)
      return;
    }
    this.commontabservice.getMasterByType({
      typeId: 59,
      filterId: 1,// 1 for invoice 2 for expense
      filterText: this.invoice_no,
      filterText1: this.approveComments
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult) {
          this.toastr.success("Successfully updated status");
          setTimeout(() => {
            this.router.navigate(['/accounting/invoices']);
          }, 2000);
        }
        else
          this.toastr.error("No record[s] found");
      },
      error: (err) => {
        console.error(`Error fetching typeid: 22:`, err);
      }
    });
  }
  toggleAll(cols: InvoiceCol[], event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    cols.forEach((col) => (col.visible = checked));
  }

  filteredOverview(): InvoiceOverviewRow[] {
    return this.filterRows(this.overviewRows, this.overviewQuery);
  }


  cell(row: object, key: string): string {
    return String((row as Record<string, unknown>)[key] ?? '');
  }

  statusBadge(status: string): string {
    const map: Record<string, string> = {
      Paid: 'inv-badge--paid',
      Draft: 'inv-badge--draft',
      Pending: 'inv-badge--pending',
      Rejected: 'inv-badge--rejected',
      Deposited: 'inv-badge--pending',
      Unpaid: 'inv-badge--rejected',
      Overdue: 'inv-badge--rejected',
      Hold: 'inv-badge--pending',
      'Pending Approvals': 'inv-badge--pending',
      Bounced: 'inv-badge--rejected'
    };
    return map[status] || 'inv-badge--draft';
  }

  get dueCardClass(): string {
    const status = this.invoice.invoice_status || this.invoice.status;
    const map: Record<string, string> = {
      Paid: 'invd-due--paid',
      Draft: 'invd-due--draft',
      Void: 'invd-due--draft',
      'Write Off': 'invd-due--draft',
      Pending: 'invd-due--pending',
      Hold: 'invd-due--pending',
      'Pending Approvals': 'invd-due--pending',
      Rejected: 'invd-due--rejected',
      Unpaid: 'invd-due--rejected',
      Overdue: 'invd-due--rejected',
      Bounced: 'invd-due--rejected'
    };
    return map[status] || 'invd-due--draft';
  }

  get showDeposited(): boolean {
    const status = this.invoice.invoice_status || this.invoice.status;
    return status === 'Draft' || status === 'Pending' || status === 'Hold';
  }

  private filterRows<T extends object>(rows: T[], query: string): T[] {
    const q = query.trim().toLowerCase();
    if (!q) {
      return rows;
    }
    return rows.filter((row) =>
      Object.values(row).some((value) => String(value).toLowerCase().includes(q))
    );
  }
}
