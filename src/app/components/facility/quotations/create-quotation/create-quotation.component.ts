import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule,ActivatedRoute } from '@angular/router'; 
import { QUOTATION_FORM_OPTIONS, QuotationLineItem } from '../quotations.data';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlowbiteDatepickerDirective } from '../../../../shared/directives/flowbite-datepicker.directive';
import { Common_TabsService } from '../../../portfolio/services/common_tabs.service';
import { CommonService } from '../../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule,TranslateService } from '@ngx-translate/core';
import { FacilityService } from '../../facility.service';
@Component({
  selector: 'app-create-quotation',
  standalone: true,
  imports: [CommonModule, FormsModule,TranslateModule, RouterModule, NgSelectModule,FlowbiteDatepickerDirective],
  templateUrl: './create-quotation.component.html',
  styleUrl: './create-quotation.component.scss'
})
export class CreateQuotationComponent {
  private router = inject(Router);
  private facilityService=inject(FacilityService);
  private commontabservice=inject(Common_TabsService);
  private commonservice=inject(CommonService);
  private toastr=inject(ToastrService);
  currentUser = this.commonservice.getCurrentUser();
  private route =inject(ActivatedRoute);
  options = QUOTATION_FORM_OPTIONS;

  title = '';
  reference = '';
  quotationno = '';
  selectedWorkOrder: string | null = null;
  estimatedDate = '';
  selectedCategory: string | null = null;
  selectedVendors: string[] = [];
  lineItems: QuotationLineItem[] = [];
  description:string='';
  selectedImageName:string='';
  attachfile:any=[];
  editId:any='';
  showLineItemModal = false;

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
    this.route.paramMap.subscribe((params) => {
      this.editId=params.get('code'); 
      if(this.editId)
      this.getquotationDetals(2,41, 'statusTabs', this.editId);
    }); 
    this.loadLookup(79,0,'categories','');
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
            this.title=temp.title;
            this.quotationno=temp.quotation_no;
            this.description=temp.description;
            this.reference=temp.reference_no;
            this.estimatedDate=this.commonservice.formatDateForInput(temp.estimation_date);
            this.selectedWorkOrder=temp.workorder_id;
            this.selectedVendors=temp.selected_vendors; 
            this.selectedCategory=temp.quotation_category;
            setTimeout(() => {
              this.selectedVendors=temp.selected_vendors.split(',')
              .map((x:any) => x.trim()); 
             }, 500);
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
        }else {
          if(this.editId==null || this.editId=="")
          this.quotationno= res.objResult.invoice_no[0].inv_no || '';
         this.options.workOrders=res.objResult.workorders || [];
         this.options.vendors=res.objResult.vendors || [];
         this.options.categories=res.objResult.categories || [];  
         this.options.taxProfiles=res.objResult.taxprofiles || [];  
        }
        }
        
      },
      error: (err) => {
        console.error(`Error fetching lookup ${filterId}:`, err);
      }
    });
  }
  get modalTotal(): number {
    return Number((this.modal.quantity * this.modal.amountPerItem).toFixed(2));
  }

  goBack(): void {
    this.router.navigate(['/facility/quotations']);
  }

  create(): void {
    if(this.title==null || this.title==""){
      this.toastr.error("Invalid title");
      return;
    }
    else if(this.selectedWorkOrder==null || this.selectedWorkOrder==""){
      this.toastr.error("Invalid work order");
      return;
    }
    else if(this.selectedVendors==null){
      this.toastr.error("Invalid vendors");
      return;
    }
    else{
      const payload = {
        userid: this.currentUser?.userId || 1,
        company_id: this.currentUser?.companyId || 1,
        clientId: this.currentUser?.clientId || "74BB6922",
        source: "web",
        languageid: 1,
        title: this.title|| "",
        quotationno:this.quotationno,
        vendor_code:this.selectedVendors.join(',') ||  "",
        code: this.editId,
        workorder_code: this.selectedWorkOrder,
        description: this.description, 
        category: this.selectedCategory,
        est_completion_date:this.commonservice.parseInputDate(this.estimatedDate), 
        reference_no:this.reference, 
        lineItems: this.lineItems,
      };
      const formData = new FormData();
      formData.append('reqObject', JSON.stringify(payload));
      if (this.attachfile.length>0) {
        formData.append('event_image', this.attachfile, this.attachfile.name);
      }
      
      this.facilityService.save_update_quotation(formData).subscribe({
        next: (res: any) => {
          if (res && (res.statusCode == 200 || res.statusCode == "200" || res.isSuccess)) {
            this.toastr.success("Successfully saved");
            this.router.navigate(['/facility/quotations']);

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

  closeLineItemModal(): void {
    this.showLineItemModal = false;
  }

  bumpQuantity(delta: number): void {
    this.modal.quantity = Math.max(1, this.modal.quantity + delta);
  }

  saveLineItem(): void {
    this.lineItems = [
      ...this.lineItems,
      {
        id: String(Date.now()),
        title: this.modal.title.trim() || 'Untitled item',
        qty: this.modal.quantity,
        amt: Number(this.modal.amountPerItem) || 0,
        total_amt: this.modalTotal,
        category_id: this.modal.category || '0',
        tax_profile: this.modal.taxProfile || '0',
        description: this.modal.description,
        baction:'new'
      }
    ];
    this.closeLineItemModal();
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
    return `${this.currentUser?.currencyCode} ${value!=null && value!=0 ?value.toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}`;
  }

  onFileSelected(_event: Event): void {
    /* frontend-only placeholder */
    const input = _event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.selectedImageName = file?.name ?? '';
    this.attachfile=file;
  }
  clearImage(): void {
    this.selectedImageName = '';
    this.attachfile=null;
  }
}
