import { Component, Input, OnInit, OnChanges, SimpleChanges, inject, HostListener } from '@angular/core';
import { CommonModule,formatDate } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { Common_TabsService } from '../../portfolio/services/common_tabs.service';
import { AuthPayload } from '../../common/store/login-auth-params/auth.models';
import { LeasesService } from '../../leases/leases.service';
import { FileUploadComponent } from '../../../shared/components/file-upload/file-upload.component';
@Component({
  selector: 'app-financials-table',
  standalone: true,
  imports: [CommonModule,NgSelectModule,FileUploadComponent, FormsModule,TranslateModule, RouterModule],
  templateUrl: './financials.component.html',
  styleUrls: ['./financials.component.scss']
})
export class FinancialsComponent implements OnInit, OnChanges {
  @Input() invoices: any[] = [];
  @Input() receipts: any[] = [];
  @Input() leaseInfo: any = {};
  /** 'overview' keeps Invoice & Receipts title; 'tab' uses parent Lease Financials header */
  @Input() variant: 'overview' | 'tab' = 'overview';
  attachedFile:any='';
  isLoading:boolean=false;
  payment_code:any='';
  private commontab_service=inject(Common_TabsService);
  private toast=inject(ToastrService); 
  private lease_service=inject(LeasesService);
  showApprovalMenu=false;
  openMenuReceiptKey: string | null = null;
  paymentMethods:any=[];
  coa_list:any=[];
  receivepayment:any= { receivefull:1, Amount:0,paiddate:null,payment_via:0,account:'',notes:'',reciept_file:null}
  showReceivePayment=false;
  invoice: any = {};
  selectedReceipt:any ={};
  @Input() currentUser: any = null;

  expandedInvoiceId: any = null;

  // The columns matching the financials tab of the leases
  financialsColumns = [
    { key: 'receiptNo', label: 'Receipt No' },
    { key: 'date', label: 'Date' },
    { key: 'method', label: 'Method' },
    { key: 'reference', label: 'Reference' },
    { key: 'amount', label: 'Amount' },
    { key: 'status', label: 'Status' }
  ];

  get paymentProgressPct(): number {
    const total = Number(this.invoice?.total_amount) || 0;
    const paid = Number(this.invoice?.paid_amount) || 0;
    if (total <= 0) {
      return (this.invoice?.cheque_status === 'Paid' || this.invoice?.status === 'Paid') ? 100 : 0;
    }
    return Math.min(100, Math.max(0, (paid / total) * 100));
  }

  private receiptKey(row: any): string {
    return String(row?.code ?? row?.rcp_no ?? row?.id ?? '');
  }

  isMenuOpen(row: any): boolean {
    return this.showApprovalMenu && this.openMenuReceiptKey === this.receiptKey(row);
  }

  getReceiptStatusClass(row: any): string {
    const status = (this.getArabicLookupName(row, 'cheque_status') || row?.cheque_status || '').toLowerCase();
    if (status.includes('paid') || status.includes('cleared')) {
      return 'fin__badge--paid';
    }
    if (status.includes('unpaid') || status.includes('pending')) {
      return 'fin__badge--unpaid';
    }
    return 'fin__badge--cleared';
  }

  openRecordReceipt(): void {
    if (this.receipts?.length) {
      this.selectedReceipt = this.receipts[0];
      this.receivepayment.Amount = this.selectedReceipt.amt;
      this.receivepayment.paiddate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    }
    this.showApprovalMenu = false;
    this.openMenuReceiptKey = null;
    this.showReceivePayment = true;
  }

  showActionMenu(selectedrow:any, event?: Event){
    event?.stopPropagation();
    const key = this.receiptKey(selectedrow);
    if (this.showApprovalMenu && this.openMenuReceiptKey === key) {
      this.showApprovalMenu = false;
      this.openMenuReceiptKey = null;
      return;
    }
    this.showApprovalMenu = true;
    this.openMenuReceiptKey = key;
    this.selectedReceipt=selectedrow;
    this.receivepayment.Amount=this.selectedReceipt.amt; 
    this.receivepayment.paiddate=formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showApprovalMenu = false;
    this.openMenuReceiptKey = null;
  }
  ngOnInit(): void { 
    this.loadLookup(2,23, 'paymentMethods', '');
    this.loadLookup(2,1003, 'coa_list', ''); 
    this.syncInvoice();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['invoices']) {
      this.syncInvoice();
    }
  }

  private syncInvoice(): void {
    if (this.invoices && this.invoices.length > 0) {
      this.invoice = this.invoices[0];
      this.expandedInvoiceId = this.invoices[0].invoicecode || this.invoices[0].id || 0;
    }
  }
  onRadioChange(){
    if(this.receivepayment.receivefull==1)
    {
      this.receivepayment.Amount=this.selectedReceipt.amt;
    } 
  }
  onFilesSelected(files: File[]) {
    if (files.length > 0) {
      this.attachedFile=files[0];
    } else {
      this.attachedFile=null;
    }
  }
  save_payment(){
    if(this.receivepayment.Amount==0){
      this.toast.error("Invalid amount");
      return;
    }
    else if(this.receivepayment.payment_via==0){
      this.toast.error("Invalid payment type");
      return;
    } 
    else{ 
      const request = {
        userid: this.currentUser?.userId,
        code: this.payment_code || '',
        source: 'web',
        company_id: this.currentUser?.companyId, 
        clientId: this.currentUser?.clientId, 
        rcp_code: this.selectedReceipt?.code,
        invoice_code: this.selectedReceipt?.invoicecode,
        payment_type: this.receivepayment.payment_via,
        account_code: this.receivepayment.account,
        payment_date: this.receivepayment.paiddate ==null ? formatDate(new Date(), 'yyyy-MM-dd', 'en-US') : this.receivepayment.paiddate,
        payment_status: this.receivepayment.receivefull==1 ? 262  : 263, //262-(paid status id), 263- Partial paid id
        amount: this.receivepayment.Amount, 
        notes: this.receivepayment.notes,    
   
      }; 
 
      const formData = new FormData(); 
    // JSON goes as ONE field
    formData.append('reqObject', JSON.stringify(request));
    if(this.attachedFile!='')
      formData.append("attachment", this.attachedFile); 
   
     this.lease_service.save_rcp_payment(formData).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res["statusCode"] == "200") {
            this.toast.success('Successfully Received Payment');
            setTimeout(() => {
              window.location.reload()
            }, 3000);
          }
          else{
            this.toast.error(res['message']);
            return;
          }
        },
        error: (err) => {
          this.isLoading = false;
        },
      });
    }
  }
  loadLookup(typeId: number,filterId: number, targetProperty: string, filterText: string, filterText1: string='') {
    this.commontab_service.getMasterByType({
      typeId: typeId,
      filterId: filterId,
      filterText: filterText,
      filterText1: filterText1
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult.table) { 
            
            (this as any)[targetProperty] = res.objResult.table;
            (this as any)['all'+targetProperty]=(this as any)[targetProperty]; 
        
           
        }
      },
      error: (err:any) => {
        console.error(`Error fetching lookup ${filterId}:`, err);
      }
    });
  }
  OnApproveClick(st:string){
    this.showApprovalMenu=false;
    this.openMenuReceiptKey = null;
    if(this.selectedReceipt && this.selectedReceipt.status!=250){
      if(st=="Payment"){
        this.showReceivePayment=true;
      }
    } 
    else{
      this.toast.error("Invalid selection");
    }
  }
  toggleExpand(invoiceId: any): void {
    if (this.expandedInvoiceId === invoiceId) {
      this.expandedInvoiceId = null;
    } else {
      this.expandedInvoiceId = invoiceId;
    }
  }

  getArabicLookupName(row: any, key: string): string {
    const selectedLang = localStorage.getItem("selectedLang") || "EN";
    return row[(selectedLang === "EN" ? key : key + '_ar')] || row[key] || '';
  }

  // Helper method to parse status classes
  getStatusBadgeClass(status: string): string {
    if (!status) return 'bg-gray-100 text-gray-800 border-gray-200';
    const s = status.toLowerCase();
    if (s.includes('paid') && !s.includes('unpaid') && !s.includes('partially')) {
      return 'bg-success/10 text-success border-success/20';
    } else if (s.includes('unpaid') || s.includes('overdue')) {
      return 'bg-danger/10 text-danger border-danger/20';
    } else {
      return 'bg-warning/10 text-warning border-warning/20';
    }
  }

  // Receipts / breakdown list for each invoice (mocked/mapped from the invoice structure if no separate nested list is provided)
  getReceiptsForInvoice(invoice: any): any[] {
    // If the invoice has nested receipts, return them. Otherwise map the invoice fields as the single receipt transaction.
    if (invoice.receipts && invoice.receipts.length > 0) {
      return invoice.receipts;
    }

    const invNo = invoice.rcp_no || invoice.InvoiceNo || invoice.invoice_no || invoice.invno || invoice.invoiceNo || '';

    // Fallback: Map the invoice fields to a single receipt row to match the columns
    return [{
      receiptNo: invNo ? invNo.replace('INV', 'RCP') : 'RCP-001',
      date: invoice.created_date || invoice.due_date || '-',
      method: invoice.payment_type || 'Mixed',
      reference: invoice.cheque_no || invoice.ddRefNo || '-',
      amount: invoice.amt || 0,
      status: invoice.cheque_status || invoice.status || 'Cleared'
    }];
  }
}
