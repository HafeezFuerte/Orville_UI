import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import {
  QUOTATION_DETAIL,
  QUOTATION_FORM_OPTIONS,
  QUOTATION_LINE_ITEMS,
  QuotationLineItem,
  QuotationStatus
} from '../quotations.data';
import { Common_TabsService } from '../../../portfolio/services/common_tabs.service';
import { CommonService } from '../../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule,TranslateService } from '@ngx-translate/core';
import { FacilityService } from '../../facility.service';
type DetailTab = 'lineItems' | 'notes' | 'attachments';
import { NotesComponent } from '../../../child-tables/notes/notes.component';
import { AttachmentsComponent } from '../../../child-tables/attachments/attachments.component';
@Component({
  selector: 'app-quotation-detail',
  standalone: true,
  imports: [CommonModule, FormsModule,NotesComponent,AttachmentsComponent, RouterModule, NgSelectModule, SharedTableComponent],
  templateUrl: './quotation-detail.component.html',
  styleUrl: './quotation-detail.component.scss'
})
export class QuotationDetailComponent {
  private facilityService=inject(FacilityService);
  private commontabservice=inject(Common_TabsService);
  private commonservice=inject(CommonService);
  private toastr=inject(ToastrService);
  currentUser = this.commonservice.getCurrentUser();
  private router =inject(ActivatedRoute);
  private route =inject(Router);
  activeTab: DetailTab = 'lineItems';
  selectedTab:any={};
  showActionMenu = false;
  showLineItemModal = false;
  notes:any=[];
  attachments:any=[];
  notesForm: any = {};
  attachmentsForm: any = {};
  editingItem: QuotationLineItem | null = null;
  editId:any='';
  options = QUOTATION_FORM_OPTIONS;
  quotation =QUOTATION_DETAIL;// { ...QUOTATION_DETAIL, id: this.route.snapshot.paramMap.get('id') || QUOTATION_DETAIL.id };
  lineItems: QuotationLineItem[] = [...QUOTATION_LINE_ITEMS];

  lineColumns = [
    { key: 'title', label: 'Title', visible: true, useTemplate: true },
    { key: 'qty', label: 'Qty', visible: true, useTemplate: true },
    { key: 'amt', label: 'Amount / Item', visible: true, useTemplate: true },
    { key: 'total_amt', label: 'Total', visible: true, useTemplate: true },
    { key: 'category_text', label: 'Category', visible: true, useTemplate: true },
    { key: 'tax_profile_text', label: 'Tax Profile', visible: true, useTemplate: true },
    { key: 'action', label: 'Action', visible: true, useTemplate: true }
  ];

  modal = {
    title: '',
    quantity: 1,
    amountPerItem: 0,
    category: null as string | null,
    taxProfile: null as string | null,
    description: '',
    code:'',
    baction:''
  };
  ngOnInit(): void {
    this.editId='';
    this.router.paramMap.subscribe((params) => {
      this.editId=params.get('code'); 
      if(this.editId)
      this.getquotationDetals(2,41, 'statusTabs', this.editId);
    });  
  }
  
  getquotationDetals(Typeid:number,filterId: number, targetProperty: string, filterText: string) {
    this.commontabservice.getMasterByType({
      typeId: 78,
      filterId: filterId,
      filterText: filterText,
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult.table1) {  
          var temp=res.objResult.table1 [0] || {}; 
          if(temp){ 

            this.quotation.title=temp.title;
            this.quotation.number=temp.quotation_no;
            this.quotation.notes=temp.description;
            this.quotation.workOrderId=temp.workorder_id;
            this.quotation.date=this.commonservice.formatDateForInput(temp.estimation_date);
            this.quotation.validity=this.commonservice.formatDateForInput(temp.estimation_date);
            this.quotation.amount=this.currentUser?.currencyCode + ' ' + temp.total_amt; 
            this.quotation.category=temp.category_name;
            this.quotation.vendor=temp.selectedvendors;
            this.quotation.status=temp.status_nm;
            this.quotation.contact=temp.tenant;
            this.quotation.property=temp.property;
            this.quotation.unit=temp.unitname;
            this.quotation.created=this.commonservice.formatDateForInput(temp.created_date); 
          }
          if(res.objResult.table2){
            res.objResult.table2.forEach((element:any) => {
              this.lineItems.push(
              {
                id: (this.lineItems.length+1).toString(),
                code:element.code,
                title: element.title,
                qty: element.qty,
                baction:'edit',
                amt: element.amt,
                total_amt: element.total_amt,
                category_id:  element.quotation_category,
                tax_profile: element.tax_profile,
                category_text:element.category_name,
                tax_profile_text:element.profile_name,
                description: element.description
              });
            });
          }
          this.notes=res.objResult.table3 || [];
          this.attachments=res.objResult.table4 || []; 
        }
        else
        this.toastr.error("No record[s] found");
      },
      error: (err) => {
        console.error(`Error fetching lookup ${filterId}:`, err);
      }
    });
  }

  get modalTotal(): number {
    return Number((this.modal.quantity * this.modal.amountPerItem).toFixed(2));
  }

  get lineItemsTotal(): number {
    return this.lineItems.reduce((sum, item) => sum + item.total_amt, 0);
  }

  setTab(tab: DetailTab): void {
    this.activeTab = tab;
    this.showActionMenu = false;
    if(this.activeTab=="notes"){
       this.selectedTab={
        key: 'Notes',
        label: 'Notes',
        entity: 'Quotations',
        entity_id: this.editId,
        data: this.notes || [],
        totalRecords: (this.notes || []).length,
        loading: false,
        hasActions: true,
        addButtonText: 'Notes',
        form: this.notesForm,
        popupType: 'notes'
      }
    }
    if(this.activeTab=="attachments"){
      this.selectedTab={
        key: 'Attachments',
        label: 'Attachments',
        entity: 'Quotations',
        entity_id: this.editId,
        data: this.attachments || [],
        totalRecords: (this.attachments || []).length,
        loading: false,
        hasActions: true,
        addButtonText: 'Attachments',
        form: this.attachmentsForm,
        popupType: 'attachment'
     }
   }
  }

  goBack(): void {
    this.route.navigate(['/facility/quotations']);
  }

  goEdit(): void {
    this.route.navigate(['/facility/quotations/edit',this.editId]);
  }

  statusClass(status: QuotationStatus): string {
    switch (status) {
      case 'Pending':
        return 'qt-chip qt-chip--warning';
      case 'Approved':
        return 'qt-chip qt-chip--success';
      case 'Rejected':
        return 'qt-chip qt-chip--danger';
      case 'Expired':
        return 'qt-chip qt-chip--soft';
      default:
        return 'qt-chip qt-chip--soft';
    }
  }

  openAddLineItem(): void {
    this.editingItem = null;
    this.modal = {
      title: '',
      quantity: 1,
      amountPerItem: 0,
      category: null,
      taxProfile: null,
      description: '',
      code:'',
      baction:'new'
    };
    this.showLineItemModal = true;
  }

  openEditLineItem(item: QuotationLineItem): void {
    this.editingItem = item;
    this.modal = {
      title: item.title,
      quantity: item.qty,
      amountPerItem: item.amt,
      category: item.category_id,
      taxProfile: item.tax_profile,
      description: item.description,
      baction:'edit',
      code:item.code || '',
    };
    this.showLineItemModal = true;
  }

  closeLineItemModal(): void {
    this.showLineItemModal = false;
    this.editingItem = null;
  }

  bumpQuantity(delta: number): void {
    this.modal.quantity = Math.max(1, this.modal.quantity + delta);
  }

  saveLineItem(): void {
    const payload: QuotationLineItem = {
      id: this.editingItem?.id || String(Date.now()),
      title: this.modal.title.trim() || 'Untitled item',
      qty: this.modal.quantity,
      amt: Number(this.modal.amountPerItem) || 0,
      total_amt: this.modalTotal,
      category_id: this.modal.category || '—',
      tax_profile: this.modal.taxProfile || '—',
      description: this.modal.description
    };

    if (this.editingItem) {
      this.lineItems = this.lineItems.map((item) => (item.id === this.editingItem!.id ? payload : item));
    } else {
      this.lineItems = [...this.lineItems, payload];
    }
    this.closeLineItemModal();
  }

  removeLineItem(id: string): void {
    this.lineItems = this.lineItems.filter((item) => item.id !== id);
  }

  formatMoney(value: number): string {
    return `${this.currentUser?.currencyCode} ${value!=null && value!=0 ?value.toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}`;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.showLineItemModal) {
      this.closeLineItemModal();
    }
  }

  @HostListener('document:click')
  onDocClick(): void {
    this.showActionMenu = false;
  }
}
