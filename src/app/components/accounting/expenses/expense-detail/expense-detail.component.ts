import { Component, HostListener, OnInit,inject } from '@angular/core';
import { CommonModule,formatDate } from '@angular/common';
import { FormsModule,FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { Common_TabsService } from '../../../portfolio/services/common_tabs.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { NotesComponent } from '../../../child-tables/notes/notes.component';
import { AttachmentsComponent } from '../../../child-tables/attachments/attachments.component'; 
import { EXPENSE_ROWS } from '../expenses.data';
import { FinancialsComponent } from '../../../child-tables/financials/financials.component';
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload.component';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  CHEQUE_COLUMNS, 
  OVERVIEW_COLUMNS,
  PENALTY_COLUMNS,
  TXN_COLUMNS
} from '../../invoices/invoice-detail.data';
type TableKey = 'overview' | 'cheques' | 'txns' | 'penalties';
import { AccountingService } from '../../accounting.service';
@Component({
  selector: 'app-expense-detail',
  standalone: true,
  imports: [CommonModule,NgSelectModule,FileUploadComponent,TranslateModule,NotesComponent,AttachmentsComponent, FormsModule,SharedTableComponent, RouterModule, FinancialsComponent],
  templateUrl: './expense-detail.component.html',
  styleUrl: './expense-detail.component.scss'
})
export class ExpenseDetailComponent implements OnInit {
  invoice: any={}; 
  Form!: FormGroup;
  loading:boolean=false;
  invoice_no:string='';
  approveComments: string = '';
  notesData : any[] = [];
  leaseInfo:any= {};
  attahmentData : any[] = [];
  receiptslist:any=[];
  attachedFile:any='';
  isLoading:boolean=false;
  coa_list:any=[];
  paymentMethods:any=[];
  invoicesList:any=[];
  overviewRows: [] = [];
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
      { label: 'Edit Expense', icon: 'ri-pencil-line', asset: 'assets/images/action-menu/pencil.svg' },
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
      typeId: 64,
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
        invoice_type:"Expense",
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

  visible(cols: any[]): any[] {
    return cols.filter((col) => col.visible);
  }

  allSelected(cols: any[]): boolean {
    return cols.every((col) => col.visible);
  }

  toggleColumn(cols: any[], key: string): void {
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
    if (label === 'Edit Expense') {
      this.actionOpen = false;
      this.router.navigate(['/accounting/expenses/edit-expense', this.invoice?.code]);
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
      filterText1: 'Expenses'
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
      filterId: 2,//2 for expense
      filterText: this.invoice_no,
      filterText1: this.approveComments
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult) {
          this.toastr.success("Successfully updated status");
          setTimeout(() => {
            this.router.navigate(['/accounting/expenses']);
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
  toggleAll(cols: any[], event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    cols.forEach((col) => (col.visible = checked));
  }

  filteredOverview(): any[] {
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
    return this.invoice.status === 'Draft' || this.invoice.status === 'Pending' || this.invoice.status === 'Hold';
  }

  showPrintModal: boolean = false;

  printExpense(): void {
    if (!this.invoice || (!this.invoice.code && !this.invoice.invoice_no)) {
      this.toastr.error('Expense details not loaded yet');
      return;
    }
    this.showPrintModal = true;
  }

  closePrintModal(): void {
    this.showPrintModal = false;
  }

  numberToWords(num: number): string {
    if (!num || isNaN(num)) return 'Zero';
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const inWords = (n: number): string => {
      if (n < 20) return a[n];
      const digit = n % 10;
      if (n < 100) return b[Math.floor(n / 10)] + (digit ? '-' + a[digit] : ' ');
      if (n < 1000) return a[Math.floor(n / 100)] + 'Hundred ' + (n % 100 ? inWords(n % 100) : '');
      if (n < 1000000) return inWords(Math.floor(n / 1000)) + 'Thousand ' + (n % 1000 ? inWords(n % 1000) : '');
      return n.toString();
    };
    return inWords(Math.floor(num)).trim();
  }

  triggerPrint(): void {
    const printElement = document.querySelector('.printable-expense-receipt-container');
    if (!printElement) {
      window.print();
      return;
    }

    let contentHtml = printElement.outerHTML;
    const origin = window.location.origin;
    contentHtml = contentHtml.replace(/src="\.\/assets\//g, `src="${origin}/assets/`);
    contentHtml = contentHtml.replace(/src="assets\//g, `src="${origin}/assets/`);

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.zIndex = '-9999';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <base href="${origin}/">
            <title>Expense Voucher - ${this.invoice?.invoice_no || this.invoice?.code}</title>
            <style>
              @page { size: portrait; margin: 10mm; }
              body { font-family: Arial, Helvetica, sans-serif; color: #111; background: #fff; margin: 0; padding: 10px; }
              .printable-expense-receipt-container { display: block; width: 100%; box-sizing: border-box; }
              .plr-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
              .plr-title { font-size: 26px; font-weight: 700; margin: 0 0 10px 0; color: #000; }
              .plr-meta p { margin: 3px 0; font-size: 12px; color: #333; }
              .plr-meta p span { font-weight: 600; color: #111; display: inline-block; min-width: 110px; }
              .plr-logo { display: flex; align-items: center; gap: 8px; }
              .plr-logo-img { height: 42px; width: auto; object-fit: contain; }
              .plr-addresses { display: flex; justify-content: space-between; margin-bottom: 28px; gap: 40px; }
              .plr-from, .plr-to { flex: 1; }
              .plr-from h4, .plr-to h4 { font-size: 13px; font-weight: 700; margin: 0 0 4px 0; color: #111; }
              .plr-from h3, .plr-to h3 { font-size: 14px; font-weight: 700; margin: 0 0 6px 0; color: #000; }
              .plr-from p, .plr-to p { margin: 3px 0; font-size: 12px; color: #444; }
              .plr-from p span, .plr-to p span { font-weight: 600; }
              .plr-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px; }
              .plr-table th { background: #d8d8d8; color: #111; font-weight: 700; text-align: left; padding: 8px 10px; border: 1px solid #c0c0c0; }
              .plr-table td { padding: 8px 10px; border: 1px solid #e0e0e0; vertical-align: top; color: #222; }
              .plr-summary-wrapper { display: flex; justify-content: flex-end; margin-bottom: 25px; }
              .plr-summary-box { width: 280px; }
              .plr-sum-row { display: flex; justify-content: space-between; font-size: 12px; padding: 4px 0; color: #222; }
              .plr-sum-row strong { font-weight: 700; color: #000; }
              .plr-sum-border { border-top: 1px solid #bbb; padding-top: 6px; margin-top: 4px; }
              .plr-words-section { margin-bottom: 30px; }
              .plr-words-label { font-size: 12px; color: #333; margin: 0 0 4px 0; }
              .plr-words-value { font-size: 14px; font-weight: 700; color: #000; margin: 0; }
              .plr-divider { border: none; border-top: 1px solid #ddd; margin: 20px 0 15px 0; }
              .plr-footer { display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #777; }
              .plr-ht-badge { display: inline-flex; align-items: center; gap: 4px; background: #2563eb; color: #fff; font-weight: 600; padding: 2px 8px; border-radius: 4px; font-size: 10px; }
            </style>
          </head>
          <body>
            ${contentHtml}
          </body>
        </html>
      `);
      doc.close();

      const images = Array.from(doc.querySelectorAll('img'));
      let loaded = 0;
      let printDone = false;

      const runPrintAction = () => {
        if (printDone) return;
        printDone = true;
        setTimeout(() => {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          setTimeout(() => {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
          }, 1000);
        }, 200);
      };

      if (images.length === 0) {
        runPrintAction();
      } else {
        images.forEach((img) => {
          if (img.complete && img.naturalHeight !== 0) {
            loaded++;
            if (loaded === images.length) runPrintAction();
          } else {
            img.onload = () => {
              loaded++;
              if (loaded === images.length) runPrintAction();
            };
            img.onerror = () => {
              loaded++;
              if (loaded === images.length) runPrintAction();
            };
          }
        });
        setTimeout(runPrintAction, 1000);
      }
    }
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
