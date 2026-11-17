
import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { Common_TabsService } from '../../../portfolio/services/common_tabs.service';
import { CommonService } from '../../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import {
  getPurchaseOrderDetail,
  PurchaseOrderDetail,
  PurchaseOrderDetailLine,
  PurchaseOrderStatus
} from '../purchase-orders.data';

@Component({
  selector: 'app-purchase-order-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SharedTableComponent, TranslateModule],
  templateUrl: './purchase-order-detail.component.html',
  styleUrl: './purchase-order-detail.component.scss'
})
export class PurchaseOrderDetailComponent {
  private router =inject(ActivatedRoute);
  private route =inject(Router);
  private commontabservice=inject(Common_TabsService);
  private commonservice=inject(CommonService);
  private toastr=inject(ToastrService); 
  currentUser = this.commonservice.getCurrentUser();
  editId:any='';
  showActionMenu = false;
  lineSearch = '';
  pageIndex = 0;
  pageSize = 5;
  openRowActionId: string | null = null;
  rowMenuStyle: Record<string, string> | null = null;

  order:any=[];
  PurchaseOrderDetail :any= {
    id: 0,
    title: '',
    poRef: '',
    status: 0,
    poNumber: '',
    poDate : '',
    dueDate : '',
    category: '',
    details: '',
    notes: '',
    requisitioner: '',
    selectedVendor: '', 
    selectedProperty: '',
    selectedUnit: '',
    shipping: {
      code:'',
      name: '',
      company: '',
      phone: '',
      address: '',
      country: '',
      city: '',
      state:'',
      stateZip: '',
      delivery_instructions:'',
    }, 
  }
  
  lineItems: any[] = [];

  lineColumns = [
    { key: 'item_code', label: 'Item Code', visible: true, width: '100px' },
    { key: 'inventory_item', label: 'Inventory Item', visible: true, width: '280px' },
    { key: 'qty', label: 'Quantity', visible: true, useTemplate: true, width: '100px' },
    { key: 'amt', label: 'Price', visible: true, width: '120px' }, 
    { key: 'total_amt', label: 'Total', visible: true, width: '120px' },
    { key: 'tax_profile_text', label: 'Tax Profile', visible: true, width: '120px' },
    { key: 'action', label: 'Action', visible: true, useTemplate: true, width: '70px' }
  ];
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
      typeId: 108,
      filterId: filterId,
      filterText: filterText,
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult.table) {  
          var temp=res.objResult.table [0] || {}; 
          if(temp){  
            this.PurchaseOrderDetail.title=temp.title;
            this.PurchaseOrderDetail.code=temp.code;
            this.PurchaseOrderDetail.number=temp.po_no;
            this.PurchaseOrderDetail.notes=temp.notes; 
            this.PurchaseOrderDetail.po_date=this.commonservice.formatDateForInput(temp.po_date);
            this.PurchaseOrderDetail.due_date=this.commonservice.formatDateForInput(temp.due_date);
            this.PurchaseOrderDetail.total_amount=this.currentUser?.currencyCode + ' ' + temp.total_amount;  
            this.PurchaseOrderDetail.vendor=temp.vendor;
             this.PurchaseOrderDetail.phone_number=temp.phone_number;
              this.PurchaseOrderDetail.email_address=temp.email_address;
            this.PurchaseOrderDetail.status=temp.status_nm;
            this.PurchaseOrderDetail.property=temp.property;
            this.PurchaseOrderDetail.unit_code=temp.unit_code; 
            this.PurchaseOrderDetail.created_date=this.commonservice.formatDateForInput(temp.created_date); 
            this.PurchaseOrderDetail.created_by=this.commonservice.formatDateForInput(temp.created_by); 
            
          }
          if(res.objResult.table2){
            this.PurchaseOrderDetail.shipping.code = res.objResult.table2[0].code;
            this.PurchaseOrderDetail.shipping.name = res.objResult.table2[0].name;
            this.PurchaseOrderDetail.shipping.phone_no = res.objResult.table2[0].phone_no;
            this.PurchaseOrderDetail.shipping.company = res.objResult.table2[0].company_name;
            this.PurchaseOrderDetail.shipping.address = res.objResult.table2[0].address;
            this.PurchaseOrderDetail.shipping.delivery_instructions = res.objResult.table2[0].delivery_instructions;
            this.PurchaseOrderDetail.shipping.country = res.objResult.table2[0].country_name;
            this.PurchaseOrderDetail.shipping.state = res.objResult.table2[0].state_name;
            this.PurchaseOrderDetail.shipping.zipcode = res.objResult.table2[0].zipcode; 
          }
          if(res.objResult.table1){
            res.objResult.table1.forEach((element:any) => {
              this.lineItems.push(
              {
                id: (this.lineItems.length+1).toString(),
                code:element.code,
                title: element.title,
                inventory_code: element.inventory_code,
                inventory_item:element.inventory_item,
                item_code: element.item_code,
                qty: element.qty,
                baction:'edit',
                amt: element.amt,
                total_amt: element.total_amt, 
                tax_profile: element.tax_profile, 
                tax_profile_text:element.profile_name,
                description: element.description
              });
            });
          } 
        }
        else
        this.toastr.error("No record[s] found");
      },
      error: (err) => {
        console.error(`Error fetching lookup ${filterId}:`, err);
      }
    });
  }
  get filteredLines(): any[] {
    const q = this.lineSearch.trim().toLowerCase();
    if (!q) {
      return this.lineItems;
    }
    return this.lineItems.filter(
      (l:any) =>
        l.itemCode.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q)
    );
  }

  get totalRecords(): number {
    return this.lineItems.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalRecords / this.pageSize));
  }

  get displayPage(): number {
    return this.pageIndex + 1;
  }

  get startRecord(): number {
    return this.totalRecords ? this.pageIndex * this.pageSize + 1 : 0;
  }

  get endRecord(): number {
    return Math.min((this.pageIndex + 1) * this.pageSize, this.totalRecords);
  }

  get paginatedLines(): PurchaseOrderDetailLine[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredLines.slice(start, start + this.pageSize);
  }

  goBack(): void {
    this.route.navigate(['/facility/purchase-orders']);
  }

  goEdit(): void {
    this.route.navigate(['/facility/purchase-orders/edit',this.editId]);
  }

  statusClass(status: PurchaseOrderStatus): string {
    switch (status) {
      case 'Open':
        return 'po-chip po-chip--info';
      case 'Approved':
        return 'po-chip po-chip--success';
      case 'Closed':
        return 'po-chip po-chip--soft';
      case 'Rejected':
        return 'po-chip po-chip--danger';
      default:
        return 'po-chip po-chip--soft';
    }
  }

  onLineSearch(): void {
    this.pageIndex = 0;
  }

  onPageSizeChange(): void {
    this.pageIndex = 0;
  }

  previousPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex -= 1;
    }
  }

  nextPage(): void {
    if (this.displayPage < this.totalPages) {
      this.pageIndex += 1;
    }
  }

  goPage(page: number): void {
    this.pageIndex = Math.max(0, Math.min(page - 1, this.totalPages - 1));
  }

  toggleRowAction(id: string, event: MouseEvent): void {
    event.stopPropagation();
    if (this.openRowActionId === id) {
      this.closeRowAction();
      return;
    }
    const btn = event.currentTarget as HTMLElement;
    const rect = btn.getBoundingClientRect();
    this.rowMenuStyle = {
      position: 'fixed',
      top: `${rect.bottom + 4}px`,
      left: `${Math.max(8, rect.right - 160)}px`,
      zIndex: '1200'
    };
    this.openRowActionId = id;
  }

  closeRowAction(): void {
    this.openRowActionId = null;
    this.rowMenuStyle = null;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (target?.closest('[data-po-line-action]')) {
      return;
    }
    if (!target?.closest('.po-action')) {
      this.showActionMenu = false;
    }
    this.closeRowAction();
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  onViewportChange(): void {
    if (this.openRowActionId) {
      this.closeRowAction();
    }
  }
}
