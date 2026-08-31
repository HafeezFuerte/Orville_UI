import { Component } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule,FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlowbiteDatepickerDirective } from '../../../shared/directives/flowbite-datepicker.directive';
import { Common_TabsService } from '../../portfolio/services/common_tabs.service';
import { CommonService } from '../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule,TranslateService } from '@ngx-translate/core';
import { AccountingService } from '../accounting.service';
import {
  BANKS,
  CHEQUE_IN_HAND,
  CHEQUE_STATUSES,
  INVOICE_ACCOUNTS,
  INVOICE_LINE_STATUSES,
  INITIAL_CHEQUES,
  INITIAL_LINE_ITEMS,
  InvoiceCheque,
  InvoiceLineItem
} from './add-invoice.data';

@Component({
  selector: 'app-add-invoice',
  standalone: true,
  imports: [CommonModule,TranslateModule, ReactiveFormsModule, FormsModule, RouterModule, NgSelectModule, FlowbiteDatepickerDirective],
  templateUrl: './add-invoice.component.html',
  styleUrl: './add-invoice.component.scss'
})
export class AddInvoiceComponent {
  customers: any = [];
  selectedTenant: any = {};
  invoice_no: string = '';
  invoiceForm!: FormGroup;
  invoice:any={};
  leases: any = [];
  paymentViaOptions: any = [];
  moneyHeldByOptions: any = [];
  coaaccountlist: any = [];
  types: any = [];
  accounts = INVOICE_ACCOUNTS;
  lineStatuses: any = [];// = INVOICE_LINE_STATUSES;
  chequeStatuses: any = [];;
  chequeInHandOptions = CHEQUE_IN_HAND;
  banks = BANKS;
  lineItems: InvoiceLineItem[] = [];
  cheques: InvoiceCheque[] = [];

  currentUser = this.commonservice.getCurrentUser();
  lineModalOpen = false;
  chequeModalOpen = false;
  editingLineIndex: number | null = null;
  editingChequeIndex: number | null = null;

  lineDraft: InvoiceLineItem = this.emptyLine();
  chequeDraft: InvoiceCheque = this.emptyCheque();
  chequesAttachments :any=[];
  invoiceAttachment :any=[];
  constructor(private router: Router, private route: ActivatedRoute, private toastr: ToastrService, private commontabservice: Common_TabsService,
    private commonservice: CommonService, private fb: FormBuilder,public translate: TranslateService,public accountingService:AccountingService) { }

  ngOnInit(): void {
    this.invoiceForm = this.fb.group({
      billedTo: ['', Validators.required],
      lease_code: ['', Validators.required],
      paymentVia: ['', Validators.required],
      moneyHeldBy: ['', Validators.required],
      type: null,
      leaseAccount: '',
      invoiceNumber: ['', Validators.required],
      issueDate: ['', Validators.required],
      dueDate: ['', Validators.required],
      reference: [''],
      notes: ''
    });
    this.getInvoiceMasters();
    this.route.paramMap.subscribe(params => {

      this.invoice_no = params.get('code') ?? '';
     
    });

  }
  onTenantChange(ev: any) {
    this.selectedTenant = ev;
    if (this.selectedTenant) {
      this.loadLookup(56, 0, 'leases', this.selectedTenant?.code, '');
    }
  }

  loadLookup(typeid: number, filterId: number, targetProperty: string, filterText: string, filterText1: string) {
    this.commontabservice.getMasterByType({
      typeId: typeid,
      filterId: filterId,
      filterText: filterText,
      filterText1: filterText1
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult.table) {
          (this as any)[targetProperty] = res.objResult.table;
        }
      },
      error: (err: any) => {
        console.error(`Error fetching lookup ${filterId}:`, err);
      }
    });
  }
  getInvoiceDetails() {
    this.commontabservice.getMasterByType({
      typeId: 57,
      filterId: 0,
      filterText: this.invoice_no,
      filterText1: ''
    }).subscribe({
      next: (res: any) => { 
        if (res.statusCode == 200 && res.objResult && res.objResult.invoice_dtls) {  
          this.invoice= res.objResult.invoice_dtls[0] || {}; 
          this.cheques = res.objResult.receipt_dtls || []; 
          this.lineItems=res.objResult.lineitems_dtls || [];  
          this.selectedTenant = this.customers.filter((item:any)=>item.code=this.invoice.bill_to)[0];
          if (this.selectedTenant) {
            this.loadLookup(56, 0, 'leases', this.invoice.bill_to, '');
          }

        setTimeout(() => {
          this.invoiceForm.patchValue({
            invoiceNumber: this.invoice.invoice_no || '',
            billedTo: this.invoice.bill_to || '',
            lease_code:this.invoice.lease_id || '',
            paymentVia: this.invoice.payment_type || '',
            moneyHeldBy:this.invoice.money_held_by || '',
            type: this.invoice.invoice_type || '',
            leaseAccount: this.invoice.coa_account || '', 
            issueDate: this.commonservice.formatDateForInput((this.invoice.invoice_date))  || '',
            dueDate: this.commonservice.formatDateForInput((this.invoice.due_date))  || '',
            reference: this.invoice.reference_no || '',
            notes: this.invoice.notes || ''
          })
        }, 500);

        }
        else
          this.toastr.error("No record[s] found");
      },
      error: (err) => {
        console.error(`Error fetching typeid: 22:`, err);
      }
    });
  }


  getInvoiceMasters() {
    this.commontabservice.getMasterByType({
      typeId: 55,
      filterId: 0,
      filterText: this.invoice_no,
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult.tenant_lst) {
          this.customers = res.objResult.tenant_lst || [];
          this.chequeStatuses = res.objResult.cheque_status || [];
          this.paymentViaOptions = res.objResult.payment_types || [];
          this.moneyHeldByOptions = res.objResult.heldby || [];
          this.types = res.objResult.invoice_types || [];
          this.coaaccountlist = res.objResult.coa || [];
          this.lineStatuses = res.objResult.invoice_status || [];
          this.invoiceForm.patchValue({
            invoiceNumber: res.objResult.invoice_no[0].inv_no || '',
          })
          if (this.invoice_no != '') {
            this.getInvoiceDetails();
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
  get lineTotal(): number {
    return this.lineItems.reduce((sum, row) => sum + this.rowTotal(row), 0);
  }

  get taxTotal(): number {
    return this.lineItems.reduce((sum, row) => sum + row.tax, 0);
  }

  get discountTotal(): number {
    return this.lineItems.reduce((sum, row) => sum + row.discount, 0);
  }
  get discountPerTotal(): number {
    return this.lineItems.reduce((sum, row) => sum + row.discountPct, 0);
  }

  get paidTotal(): number {
    return this.lineItems.reduce((sum, row) => sum + row.paid, 0);
  }

  get dueTotal(): number {
    return this.lineTotal - this.paidTotal;
  }

  rowTotal(row: InvoiceLineItem): number {
    return row.price + row.tax - row.discount;
  }

  rowBalance(row: InvoiceLineItem): number {
    return this.rowTotal(row) - row.paid;
  }

  formatAed(value: number): string {
    //return '';
    return `${this.currentUser?.currencyCode} ${value!=null && value!=0 ?value.toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}`;
  }

  goBack(): void {
    void this.router.navigate(['/accounting/invoices']);
  }

  openLineModal(index?: number): void {
    if (index != null) {
      this.editingLineIndex = index;
      this.lineDraft = { ...this.lineItems[index] };
    } else {
      this.editingLineIndex = null;
      this.lineDraft = this.emptyLine();
    }
    this.lineModalOpen = true;
  }

  closeLineModal(): void {
    this.lineModalOpen = false;
    this.editingLineIndex = null;
  }

  saveLineItem(): void {
    const row = { ...this.lineDraft };
    row.status= this.lineStatuses.filter((item:any)=>item.id==this.lineDraft.statusid)[0].name || 0;
    row.accountnm= this.coaaccountlist.filter((item:any)=>item.id==this.lineDraft.account)[0].name || 0;
    if (!row.description.trim()) {
      return;
    }
    if (this.editingLineIndex != null) {
      row.code!=null && row.code!=""?row.baction="edit":""; 
      this.lineItems[this.editingLineIndex] = row;
    } else {
      row.baction="new";
      row.code="";
      this.lineItems = [...this.lineItems, row];
    }
    this.closeLineModal();
  }

  removeLine(index: number): void {
    this.lineItems = this.lineItems.filter((_, i) => i !== index);
  }

  openChequeModal(index?: number): void {
    if (index != null) {
      this.editingChequeIndex = index;
      this.chequeDraft = { ...this.cheques[index] };
    } else {
      this.editingChequeIndex = null;
      this.chequeDraft = this.emptyCheque();
    }
    this.chequeModalOpen = true;
  }

  closeChequeModal(): void {
    this.chequeModalOpen = false;
    this.editingChequeIndex = null;
  }

  saveCheque(): void {
    const row = { ...this.chequeDraft };
    row.status= this.chequeStatuses.filter((item:any)=>item.id==this.chequeDraft.statusid)[0].name|| 0;
    if (!row.chequeNo.trim() || !row.bankName) {
      return;
    }
    if (this.editingChequeIndex != null) {
      row.code!=null && row.code!=""?row.baction="edit":""; 
      this.cheques[this.editingChequeIndex] = row;
    } else {
      row.baction="new";
      row.code="";
      this.cheques = [...this.cheques, row];
    }
    this.closeChequeModal();
  }

  removeCheque(index: number): void {
    this.cheques = this.cheques.filter((_, i) => i !== index);
  }

  onChequeFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.chequeDraft.attachment = file.name; 
      this.chequesAttachments.push({"row_no":this.chequeDraft.id,"file":file})
    }
  }
  onInvoiceAttachment(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.invoiceAttachment = file; 
    }
  }

  private emptyLine(): InvoiceLineItem {
    return {
      id: String(400000 + Date.now() % 100000),
      inclusiveTax: 'Yes',
      description: '',
      price: 0,
      tax: 0,
      discount: 0,
      discountPct: 0,
      paid: 0,
      statusid:0,
      account: '',
      accountnm:'',
      status: 'Unpaid'
    };
  }

  private emptyCheque(): InvoiceCheque {
    return {
      id: String(400000 + Date.now() % 100000),
      chequeNo: '',
      bankName: '',
      chequeDate: '',
      amount: 0,
      inHand: 'Yes',
      status: 'Pending',
      statusid:0,
      attachment: ''
    };
  } 
  
validateForm(
  form: FormGroup,
  fieldLabels: { [key: string]: string },
  errors: string[]
): void {

  Object.keys(fieldLabels).forEach(controlName => {

    const control = form.get(controlName);

    if (control?.invalid) {
      errors.push(
        `${fieldLabels[controlName]} ${'IsRequired'}`
      );
    }

  });

  form.markAllAsTouched();
}

  onSubmit() { 
    const invoiceformLabels = {
      tenant_code:"Tenant",
      lease_code: "Lease", 
      paymentVia: "Payment Type",
      issueDate: "Issue Date", 
      dueDate: "Due Date", 
      invoiceNumber: "Invoice Number", 
    };

    
 const errors: string[] = [];

 this.validateForm(this.invoiceForm, invoiceformLabels, errors); 
 
 if (errors.length > 0) { 
   this.toastr.error(
     errors.join('<br>'),
     'Validation',
     {
       enableHtml: true,
       timeOut: 5000,
       positionClass: 'toast-top-right'
     }
   ); 
   return;
 }

    if (this.invoiceForm.valid) {
      const form = this.invoiceForm.value;
      const payload = {
        userid: this.currentUser?.userId || 1,
        company_id: this.currentUser?.companyId || 1,
        clientId: this.currentUser?.clientId || "74BB6922",
        source: "web",
        languageid: 1,
        tenant_code: this.selectedTenant.code || "",
        lease_code: form.lease_code || "",
        paymentVia: form.paymentVia,
        code: this.invoice_no,
        leaseAccount: form.leaseAccount || "",
        moneyHeldBy: form.moneyHeldBy || 0,
        type: form.type || 0,
        total_price:this.lineTotal - (this.taxTotal + this.discountTotal),
        total_tax:this.taxTotal,
        discount:this.discountTotal,
        discountPct:this.discountPerTotal,
        invoiceNumber: form.invoiceNumber || '',
        issueDate:this.commonservice.parseInputDate((form.issueDate)) ,
        dueDate:this.commonservice.parseInputDate((form.dueDate))  ,
        reference: form.reference || '',
        notes: form.notes,
        cheques:this.cheques,
        lineitems:this.lineItems,
      };
      const formData = new FormData();
      formData.append('reqObject', JSON.stringify(payload));
      if (this.invoiceAttachment && this.invoiceAttachment.length>0) {
        formData.append('InvoiceImage', this.invoiceAttachment, this.invoiceAttachment.name);
      }
      this.chequesAttachments.forEach((element:any) => {
        formData.append(element.row_no, element.file); 
      });
     
      this.accountingService.save_invoice(formData).subscribe({
        next: (res: any) => {
          if (res && (res.statusCode == 200 || res.statusCode == "200" || res.isSuccess)) {
            this.toastr.success("Successfully saved");
            this.router.navigate(['/accounting/invoices']);

          } else {
            this.toastr.error(res.message || "Failed to save legal cases");
          }
        },
        error: (err: any) => {
          console.error("Error saving work order:", err);
          this.toastr.error("An error occurred while saving the legal cases : " + err);
        }
      });


    }  
    else{
      this.toastr.error("Please fill all required fields : ");
      return;
    }
  }
}
