import { Component, Input, OnInit, OnChanges, SimpleChanges, inject, HostListener } from '@angular/core';
import { CommonModule,formatDate } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { RouterModule,Route, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { Common_TabsService } from '../../portfolio/services/common_tabs.service';
import { AuthPayload } from '../../common/store/login-auth-params/auth.models';
import { LeasesService } from '../../leases/leases.service';
import { FileUploadComponent } from '../../../shared/components/file-upload/file-upload.component';
import { FlowbiteDatepickerDirective } from '../../../shared/directives/flowbite-datepicker.directive';
import { CommonService } from '../../../services/common.service';
import { DeleteConfirmationComponent } from '../../../shared/components/delete-confirmation/delete-confirmation.component';
@Component({
  selector: 'app-financials-table',
  standalone: true,
  imports: [CommonModule,NgSelectModule,DeleteConfirmationComponent,FlowbiteDatepickerDirective,FileUploadComponent, FormsModule,TranslateModule, RouterModule],
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
  private commonservice=inject(CommonService);
  private toast=inject(ToastrService); 
  private lease_service=inject(LeasesService); 
  deleteModal:boolean=false;
  private router=inject(Router);
  showApprovalMenu=false;
  openMenuReceiptKey: string | null = null;
  paymentMethods:any=[];
  coa_list:any=[];
  bounceBlock:any ={bounceDate:'',isPenalty:false,account:'',penaltyAmt:0,due_date:'',reason:'', code:'' }
  chequeBlock:any= {   Amount:0, AdvAmt:0, attached_image:'',  attachedFile:null, cheque_no:'',cheque_date:'',bank:'',held_by:null,  code:''}
  receivepayment:any= { receivefull:1, Amount:0,paiddate:null,payment_via:0,account:'',notes:'',reciept_file:null}
  showReceivePayment=false;
  showChequeEdit=false;showChequeBounce=false;
  invoice: any = {};
  heldByList:any=[];
  chequeStatus:any=[];
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
    // Check unpaid before paid — "unpaid".includes("paid") is true
    if (status.includes('unpaid') || status.includes('overdue') || status.includes('bounce')) {
      return 'ov-outline-chip ov-outline-chip--danger';
    }
    if (status.includes('partial') || status.includes('pending') || status.includes('hold')) {
      return 'ov-outline-chip ov-outline-chip--warning';
    }
    if (status.includes('paid') || status.includes('cleared') || status.includes('deposit')) {
      return 'ov-outline-chip ov-outline-chip--success';
    }
    return 'ov-outline-chip ov-outline-chip--muted';
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
    this.loadLookup(2,23, 'paymentMethods', '','');
    this.loadLookup(2,1003, 'coa_list', '',''); 
    this.loadLookup(2,38, 'heldByList', '',''); 
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
  onChequeSelected(files: File[]) {
    if (files.length > 0) {
      this.chequeBlock.attachedFile=files[0];
    } else {
      this.chequeBlock.attachedFile=null;
    }
  }
  
   
  ReturnedCheque(){
    this.deleteModal=false;
    this.loadLookup(72,0,'', this.selectedReceipt?.code, this.selectedReceipt?.invoice_id);
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
  update_bounce_cheque(){
    if(this.bounceBlock.bounceDate=="" || this.bounceBlock.bounceDate==null){
      this.toast.error("Invalid bounce date");
      return;
    }
    else if(this.bounceBlock.reason=="" || this.bounceBlock.reason==null){
      this.toast.error("Invalid reason");
      return;
    }
    else if(this.bounceBlock.isPenalty && (this.bounceBlock.account==null || this.bounceBlock.account=="")){
      this.toast.error("Invalid account");
      return;
    }
    else if(this.bounceBlock.isPenalty && (this.bounceBlock.penaltyAmt==null || this.bounceBlock.penaltyAmt==0)){
      this.toast.error("Invalid penalty amount");
      return;
    }
    else if(this.bounceBlock.isPenalty && (this.bounceBlock.due_date==null || this.bounceBlock.due_date=="")){
      this.toast.error("Invalid due date");
      return;
    }
    else{
      const request = {
        userid: this.currentUser?.userId, 
        source: 'web', 
        company_id: this.currentUser?.companyId, 
        clientId: this.currentUser?.clientId, 
        rcp_no:this.selectedReceipt?.invoice_id,
        code: this.selectedReceipt?.code,
        bounceDate: this.commonservice.parseInputDate(this.bounceBlock?.bounceDate),
        reason:this.bounceBlock?.reason || '',
        account:this.bounceBlock.isPenalty ? this.bounceBlock.account : '',
        penaltyAmt: this.bounceBlock.isPenalty ?this.bounceBlock.penaltyAmt : 0,
        due_date: this.bounceBlock.isPenalty ? this.commonservice.parseInputDate(this.bounceBlock.due_date) : null, 
      }; 
 
      const formData = new FormData(); 
    // JSON goes as ONE field
    formData.append('reqObject', JSON.stringify(request));
   
     this.lease_service.update_bounce_cheque(formData).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res["statusCode"] == "200") {
            this.toast.success('Successfully updated cheque details');
            this.showChequeBounce=false;
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
  update_cheque(){
    if(this.chequeBlock.Amount==0){
      this.toast.error("Invalid amount");
      return;
    }
    else if(this.chequeBlock.cheque_no==null || this.chequeBlock.cheque_no==""){
      this.toast.error("Invalid cheque no");
      return;
    } 
    else if(this.chequeBlock.cheque_date==null || this.chequeBlock.cheque_date==""){
      this.toast.error("Invalid cheque date");
      return;
    } 
    else{ 
      const request = {
        userid: this.currentUser?.userId, 
        source: 'web',
        baction:"Edit",
        company_id: this.currentUser?.companyId, 
        clientId: this.currentUser?.clientId, 
        rcp_no:this.selectedReceipt?.rcp_no,
        code: this.selectedReceipt?.code,
        chequeNo: this.chequeBlock?.cheque_no,
        chequeDate:this.commonservice.parseInputDate( this.chequeBlock?.cheque_date),
        bankName: this.chequeBlock?.bank,
        amount: this.chequeBlock?.Amount,
        held_by:this.chequeBlock?.held_by
      }; 
 
      const formData = new FormData(); 
    // JSON goes as ONE field
    formData.append('reqObject', JSON.stringify(request));
    if(this.attachedFile!='')
      formData.append("attachment", this.attachedFile); 
   
     this.lease_service.update_cheque_details(formData).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res["statusCode"] == "200") {
            this.toast.success('Successfully updated cheque details');
            this.showChequeEdit=false;
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
  loadLookup(typeId: number,filterId: number, targetProperty: string, filterText: string, filterText1: string) {
    this.commontab_service.getMasterByType({
      typeId: typeId,
      filterId: filterId,
      filterText: filterText,
      filterText1: filterText1
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult.table) {  
          if(typeId==72){
            this.toast.success("Successfully returned cheque"); 
            setTimeout(() => {
              window.location.reload()
            }, 3000);
        }else
            (this as any)[targetProperty] = res.objResult.table;   
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
    if(this.selectedReceipt && this.selectedReceipt.status!=254){
      if(st=="Payment"){
        this.showReceivePayment=true;
      }
      else if(st=="Edit"){
        this.chequeBlock.cheque_no=this.selectedReceipt.cheque_no;
        this.chequeBlock.cheque_date=this.commonservice.formatDateForInput(this.selectedReceipt.cheque_date.split('T')[0]);
        this.chequeBlock.bank=this.selectedReceipt.bank_name;
        this.chequeBlock.attached_image=this.selectedReceipt.attachment_path;
        this.chequeBlock.code=this.selectedReceipt.code;
        this.chequeBlock.held_by=this.selectedReceipt.held_by;
        this.chequeBlock.Amount=this.selectedReceipt.amt;
        this.showChequeEdit=true; 
      }
      else if (st=="Bounce"){
        this.showChequeBounce=true;
      }
      else if (st=="Return"){
         this.deleteModal=!this.deleteModal;   
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
  closeModal(){
    this.deleteModal=false;
  }
  getArabicLookupName(row: any, key: string): string {
    const selectedLang = localStorage.getItem("selectedLang") || "EN";
    return row[(selectedLang === "EN" ? key : key + '_ar')] || row[key] || '';
  }

  // // Helper method to parse status classes
  // getStatusBadgeClass(status: string): string {
  //   if (!status) return 'bg-gray-100 text-gray-800 border-gray-200';
  //   const s = status.toLowerCase();
  //   if (s.includes('paid') && !s.includes('unpaid') && !s.includes('partially')) {
  //     return 'bg-success/10 text-success border-success/20';
  //   } else if (s.includes('unpaid') || s.includes('overdue')) {
  //     return 'bg-danger/10 text-danger border-danger/20';
  //   } else {
  //     return 'bg-warning/10 text-warning border-warning/20';
  //   }
  // } 
}
