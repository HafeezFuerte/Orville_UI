 
import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule,ActivatedRoute } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlowbiteDatepickerDirective } from '../../../../shared/directives/flowbite-datepicker.directive';
import { Common_TabsService } from '../../../portfolio/services/common_tabs.service';
import { CommonService } from '../../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule,TranslateService } from '@ngx-translate/core';
import { FacilityService } from '../../facility.service';
import { 
  PurchaseOrderLineDraft,
  PurchaseOrderLineItem
} from '../purchase-orders.data';

@Component({
  selector: 'app-create-purchase-order',
  standalone: true,
  imports: [CommonModule, FormsModule,FlowbiteDatepickerDirective, RouterModule, NgSelectModule, TranslateModule],
  templateUrl: './create-purchase-order.component.html',
  styleUrl: './create-purchase-order.component.scss'
})
export class CreatePurchaseOrderComponent {
  private router = inject(Router);  
  private commontabservice=inject(Common_TabsService);
  private commonservice=inject(CommonService);
  private toastr=inject(ToastrService);
  currentUser = this.commonservice.getCurrentUser();
  private route =inject(ActivatedRoute);
  private facilityService=inject(FacilityService); 
  properties:any= [];
  units:any= ['Apartment 01 Fl-1', 'Apartment-101-PR', 'Office-204', 'Retail-12'];
  vendors:any= ['Joy property man...', 'AirCool Solutions', 'BrightEdge Electricals', 'PlumbRight LLC'];
  inventoryItems:any= [];
  taxProfiles:any= ['Standard VAT 5%', 'Zero Rated', 'Exempt', 'Out of Scope'];
  countries :any=[];
  states :any=[]

  editId:any='';
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
      zipcode: '',
      delivery_instructions:'',
    }, 
  }
  
  lineItems: any[] = [];
  showLineModal = false;

  modal: any = {
    item_code: '',
    baction:'',
    code:'',
    inventory_code: null,
    description: '',
    qty: 1,
    amt: 0,
    total_amt:0,
    tax_profile: null
  };

  get modalTotal(): number {
    return Number((this.modal.qty * this.modal.amt).toFixed(2));
  }
  ngOnInit(): void {
    this.editId='';
    this.loadLookup(107,0,'categories','');
    this.route.paramMap.subscribe((params) => {
      this.editId=params.get('code'); 
      if(this.editId)
      this.getpurchaseOrderDetals(2,41, 'statusTabs', this.editId);
    }); 
   
  }
  getpurchaseOrderDetals(Typeid:number,filterId: number, targetProperty: string, filterText: string) {
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
            this.PurchaseOrderDetail.poNumber=temp.po_no;
            this.PurchaseOrderDetail.note=temp.notes; 
            this.PurchaseOrderDetail.details=temp.details; 
            this.PurchaseOrderDetail.poDate=this.commonservice.formatDateForInput(temp.po_date);
            this.PurchaseOrderDetail.dueDate=this.commonservice.formatDateForInput(temp.due_date); 
            this.PurchaseOrderDetail.selectedVendor=temp.vendor_code;
            this.PurchaseOrderDetail.phone_number=temp.phone_number;
            this.PurchaseOrderDetail.email_address=temp.email_address;
            this.PurchaseOrderDetail.status=temp.status_nm;
            this.PurchaseOrderDetail.selectedProperty=temp.property_code;
            this.PurchaseOrderDetail.unit_code=temp.unit_code; 
            this.PurchaseOrderDetail.created_date=this.commonservice.formatDateForInput(temp.created_date); 
            this.PurchaseOrderDetail.created_by=this.commonservice.formatDateForInput(temp.created_by); 
            this.loadLookup(44, 0, 'units', temp.property_code);
           
            setTimeout(() => {
              this.PurchaseOrderDetail.selectedUnit = temp.unit_code || null; 
            }, 500); 
          }
          if(res.objResult.table1){
            res.objResult.table1.forEach((element:any) => {
              this.lineItems.push(
              {
                id: (this.lineItems.length+1).toString(),
                code:element.code,
                title: element.title || '-',
                qty: element.qty || 0,
                inventory_code: element.inventory_code || '-',
                inventory_item:element.inventory_item || '-',
                item_code: element.item_code || '-', 
                baction:'edit',
                amt: element.amt || 0,
                total_amt: element.total_amt || 0, 
                tax_profile: element.tax_profile || 0,
                tax_profile_text:element.profile_name || '',
                description: element.description|| '',
              });
            });
          } 
          if(res.objResult.table2){
            this.PurchaseOrderDetail.shipping.code = res.objResult.table2[0].code;
            this.PurchaseOrderDetail.shipping.name = res.objResult.table2[0].name;
            this.PurchaseOrderDetail.shipping.phone = res.objResult.table2[0].phone_no;
            this.PurchaseOrderDetail.shipping.company = res.objResult.table2[0].company_name;
            this.PurchaseOrderDetail.shipping.address = res.objResult.table2[0].address;
            this.PurchaseOrderDetail.shipping.delivery_instructions = res.objResult.table2[0].delivery_instructions;
            this.PurchaseOrderDetail.shipping.country = res.objResult.table2[0].country_id;
            this.PurchaseOrderDetail.shipping.zipcode = res.objResult.table2[0].zipcode; 
            this.loadLookup(2, 1001, 'units', this.PurchaseOrderDetail.shipping.country);
            setTimeout(() => { 
              this.PurchaseOrderDetail.shipping.state = res.objResult.table2[0].state_id;
            }, 500);
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
  loadLookup(Typeid:number,filterId: number, targetProperty: string, filterText: string) {
    this.commontabservice.getMasterByType({
      typeId: Typeid,
      filterId: filterId,
      filterText: filterText,
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult) {  
          if(Typeid==74){
            this.toastr.success("Successfully marked as inactive");  
        }
        else if (Typeid == 44) {
         this.units = res.objResult.table || []; 
        } 
        else if (Typeid == 2) {
          this.states = res.objResult.table || []; 
         } 
        else {
          if(this.editId==null || this.editId==""){
           this.PurchaseOrderDetail.poNumber= res.objResult.invoice_no[0].po_no || '';
          } 
         this.properties=res.objResult.properties || [];
         this.inventoryItems=res.objResult.inventory_items || [];
         this.vendors=res.objResult.vendors || []; 
         this.taxProfiles=res.objResult.taxprofiles || [];  
         this.countries=res.objResult.countries  || [];
        }
        }
        
      },
      error: (err) => {
        console.error(`Error fetching lookup ${filterId}:`, err);
      }
    });
  }
  onPropertyChange() {
    this.PurchaseOrderDetail.selectedUnit = null;
    this.units = [];
    if (this.PurchaseOrderDetail.selectedProperty) {
      this.loadLookup(44, 0, 'units', this.PurchaseOrderDetail.selectedProperty);
    }
  }
  oncountryChange() {
    this.PurchaseOrderDetail.shipping.state = null;
    this.states = [];
    if (this.PurchaseOrderDetail.shipping.country) {
      this.loadLookup(2, 1001, 'units', this.PurchaseOrderDetail.shipping.country);
    }
  }

  goBack(): void {
    this.router.navigate(['/facility/purchase-orders']);
  }

  save(): void {
    if(this.PurchaseOrderDetail.title==null || this.PurchaseOrderDetail.title==""){
      this.toastr.error("Invalid title");
      return;
    }
    else if(this.PurchaseOrderDetail.selectedProperty==null || this.PurchaseOrderDetail.selectedProperty==""){
      this.toastr.error("Invalid property");
      return;
    }
    else if(this.PurchaseOrderDetail.selectedUnit==null || this.PurchaseOrderDetail.selectedUnit==""){
      this.toastr.error("Invalid unit");
      return;
    }
    else if(this.PurchaseOrderDetail.poNumber==null || this.PurchaseOrderDetail.poNumber==""){
      this.toastr.error("Invalid po number");
      return;
    } 
    else if(this.PurchaseOrderDetail.selectedVendor==null || this.PurchaseOrderDetail.selectedVendor==""){
      this.toastr.error("Invalid vendor");
      return;
    } 
     else if(this.PurchaseOrderDetail.poDate==null || this.PurchaseOrderDetail.poDate==""){
      this.toastr.error("Invalid po date");
      return;
    } 
    // else if(this.PurchaseOrderDetail.shipping.country==null || this.PurchaseOrderDetail.shipping.country==""){
    //   this.toastr.error("Invalid country");
    //   return;
    // } 
    else{
      const payload = {
        userid: this.currentUser?.userId || 1,
        company_id: this.currentUser?.companyId || 1,
        clientId: this.currentUser?.clientId || "74BB6922",
        source: "web",
        languageid: 1,
        title: this.PurchaseOrderDetail.title|| "",
        po_no:this.PurchaseOrderDetail.poNumber,
        vendor_code:this.PurchaseOrderDetail.selectedVendor ||  "",
        code: this.editId || '',
        reference_no:'',
        property_code:this.PurchaseOrderDetail.selectedProperty,
        unit_code: this.PurchaseOrderDetail.selectedUnit, 
        po_date:this.commonservice.parseInputDate(this.PurchaseOrderDetail.poDate),
        due_date: this.commonservice.parseInputDate(this.PurchaseOrderDetail.dueDate), 
        description: this.PurchaseOrderDetail.details, 
        notes: this.PurchaseOrderDetail.note,  
        clsPurchaseOrderLineItems: this.lineItems,
        clsShippingDetails:this.PurchaseOrderDetail.shipping
      }; 
      
      this.facilityService.save_update_purchase_order(payload).subscribe({
        next: (res: any) => {
          if (res && (res.statusCode == 200 || res.statusCode == "200" || res.isSuccess)) {
            this.toastr.success("Successfully saved"); 
            this.router.navigate(['/facility/purchase-orders']); 

          } else {
            this.toastr.error(res.message || "Failed to save quotation");
          }
        },
        error: (err: any) => {
          console.error("Error saving promotions:", err);
          this.toastr.error("An error occurred while saving the quotation : " + err);
        }
      });

    }
  
    
  }

  openAddLineItem(): void {
    this.modal = {
      item_code: '',
      baction:'new',
    code:'',
    inventory_code: null,
    description: '',
    qty: 1,
    amt: 0,
    total_amt:0,
    tax_profile: 0
    };
    this.showLineModal = true;
  }

  closeLineModal(): void {
    this.showLineModal = false;
  }

  saveLineItem(): void { 
    this.lineItems = [
      ...this.lineItems,
      {
        id: String(Date.now()),
        code:'',
        item_code: this.modal.item_code.trim() || '—',
        inventory_code: this.modal.inventory_code || '—',
        inventory_item: this.inventoryItems.filter((item:any)=>item.code==this.modal.inventory_code)[0].name|| '—',
        description: this.modal.description.trim() || '-',
        qty: this.modal.qty,
        amt: Number(this.modal.amt) || 0, 
        tax_profile: this.modal.tax_profile || '0',
        tax_profile_name:this.taxProfiles.filter((item:any)=>item.code==this.modal.tax_profile)[0].name  || '-',
        total_amt: this.modalTotal,
        baction:'new'
      }
    ];
    this.closeLineModal();
  }
  get filteredLineItems() {
    return this.lineItems.filter( item => item.baction == null || item.baction !== 'delete');
  }
  removeLineItem(obj:any): void {
    if(obj.code!='' && obj.code!=null){
      const temp = this.lineItems.filter((item) => item.code === obj.code);
      if(temp){
        temp[0].baction="delete";
      }
    }
    else
      this.lineItems = this.lineItems.filter((item) => item.id !== obj.id);
 
  }

  formatMoney(value: number): string {
    return `${this.currentUser?.currencyCode}  ${value!=null && value!=0 ?value.toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}`;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.showLineModal) {
      this.closeLineModal();
    }
  }
}
