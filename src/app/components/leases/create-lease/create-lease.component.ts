import { Component, OnInit, inject } from '@angular/core';
import { CommonModule,formatDate  } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileUploadComponent } from '../../../shared/components/file-upload/file-upload.component';
import { RouterModule, Router,ActivatedRoute } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Common_TabsService } from '../../portfolio/services/common_tabs.service';
import { AuthPayload } from '../../common/store/login-auth-params/auth.models';
import { CommonService } from '../../../services/common.service';
import {LeasesService} from '../leases.service';
interface Occupant {
  name: string;
  phone: string;
  email: string;
}

@Component({
  selector: 'app-create-lease',
  standalone: true,
  imports: [CommonModule,FileUploadComponent, FormsModule, RouterModule, NgSelectModule, TranslateModule],
  templateUrl: './create-lease.component.html',
  styleUrl: './create-lease.component.scss'
})
export class CreateLeaseComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private commontab_service=inject(Common_TabsService);
  private lease_service=inject(LeasesService);
   private commonService=inject(CommonService);
   leaseId: string = '';
   leaseInfo: any = {}; 
  currentUser: AuthPayload | null = null;
  attachedFiles:any=[];
  attachedFile:any='';
  addpaymentbloc:any= {    includetax:false,    isSecurityDeposit:0,rentAmount:0,    attachedFile:null,    dueDate:null,memo:'',
    moneyHeldBy:null,    recurrenceCycle:null,cheque_no:'',cheque_date:'',bank:'',held_by:null,  taxProfile:null,  account:null,  paymentMethod:null,invno:''}
  showAddPayment:boolean=false; 
  lease_id:number=0;
  isLoading:boolean=false;
  // Form Fields
  selectedTenant: any = null;
  selectedProperty: any = null;
  selectedUnit: any = null;
  selectedRoom: any = null;
  selectedAgent: any = null;

  isShortTerm: boolean = false;
  selectedLeaseType: any=null;
  selectedLeaseCategory: any=null; 
  startDate: string = '';
  endDate: string = '';
  
  rentAmount: number = 0;
  totalPayments: number = 0;
  months: number = 0;
  moneyHeldBy: any=null; 
  paymentMethod: any=null; 
  annualRent: number = 0;
  monthlyRent: number = 0;
  
  additionalbloc:any= {  no_of_persons: 0,  user_id: '',created_by: '',  move_in_date: '',  created_date: '',  paying_date: ''}

  // Dropdowns lists
  tenantsList:any[]=[] ;
  alltenantsList :any[]=[] ;

  agentsList:any[]=[] ;
  allagentsList :any[]=[] ;
  paymentSchedules :any[]=[] ;
  propertiesList :any[]=[] ;
  allpropertiesList :any[]=[] ;
  unitsList: any[] = [];
  allunitsList: any[] = [];
  roomsList: any[] = [];
  allroomsList: any[] = [];
   
  heldByList:any[]=[];
  taxProfilesList:any[]=[];
  recurringList:any[]=[];
  coaList:any[]=[];
  leaseTypes:any[]=[];// = ['Fixed', 'Flexible', 'Sub-Lease'];
  leaseCategories:any[]=[];// = ['Residential', 'Commercial', 'Industrial'];
  paymentMethods:any[]=[];// = ['Bank Transfer', 'Cheque', 'Credit Card', 'Cash'];
  moneyHeldOptions:any[]=[];// = ['Company', 'Landlord', 'Escrow Agent'];

  // Summary Models
  selectedTenantObj: any = null;
  selectedPropertyObj: any = null;
  selectedUnitObj: any = null;

  // Occupants Popup Modal
  showOccupantsModal: boolean = false;
  occupantName: string = '';
  occupantPhone: string = '';
  occupantEmail: string = '';
  occupants: Occupant[] = [];
  editingOccupantIndex: number | null = null;

  ngOnInit() { 
    this.route.paramMap.subscribe(params => {
      this.leaseId = params.get('code') ?? '';
    });
   
    this.currentUser = this.commonService.getCurrentUser();
    this.additionalbloc.created_by = this.currentUser?.userName || 'Admin';
    this.additionalbloc.user_id = this.currentUser?.userId || '1';
    this.loadLookup(45,0, '', '');  //get all masters 
    this.loadLookup(11,0, 'propertiesList', '');
    this.resetForm();
    setTimeout(() => {
      this.getLeaseDetails();
    }, 500);
    
  }
  getLeaseDetails() {
    this.commontab_service.getMasterByType({
      typeId: 48,
      filterId: 0,
      filterText: this.leaseId,
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult.table) {
            this.leaseInfo=res.objResult.table[0];  
            if(this.leaseInfo){ 
              this.selectedPropertyObj=this.returnSelectedObject(this.propertiesList,'property_code','code') ||this.leaseInfo?.property_code;
              this.selectedProperty=this.selectedPropertyObj.code;
              this.lease_id=this.leaseInfo.id;
              this.selectedUnit = null;
              this.selectedUnitObj = null; 
              this.occupants=JSON.parse(this.leaseInfo.occupants_dtls) || [];
              this.roomsList=this.unitsList=this.allroomsList=this.allunitsList=[];
              this.loadLookup(44,0, 'unitsList', this.selectedProperty);  
              this.selectedTenantObj=this.selectedTenant=this.returnSelectedObject(this.tenantsList,'tenant_code','code') ||this.leaseInfo?.tenant_code;
              this.selectedTenant=this.selectedTenantObj.code;

              this.selectedAgent=this.returnSelectedObject(this.agentsList,'assigned_collector','code')?.code ||this.leaseInfo?.tenant_code;
           

              this.startDate=formatDate(this.leaseInfo?.start_date, 'yyyy-MM-dd', 'en-US');
              this.endDate=formatDate(this.leaseInfo?.end_date, 'yyyy-MM-dd', 'en-US');
              this.selectedLeaseType= this.returnSelectedObject(this.leaseTypes,'lease_type','id') || this.leaseInfo?.lease_type;
              this.selectedLeaseCategory=this.returnSelectedObject(this.leaseCategories,'lease_category','id') || this.leaseInfo?.lease_category;
              this.months=this.leaseInfo?.total_months;
              this.rentAmount=this.leaseInfo?.rent_amount;
              this.totalPayments=this.leaseInfo?.total_payments;
              this.moneyHeldBy=this.returnSelectedObject(this.moneyHeldOptions,'money_held_by','id') || this.leaseInfo?.money_held_by;
              this.paymentMethod=this.returnSelectedObject(this.paymentMethods,'payment_type','id') ||this.leaseInfo?.payment_type;
              this.annualRent=this.leaseInfo?.annual_rent;
              this.monthlyRent=this.leaseInfo?.monthly_rent;
              this.additionalbloc.no_of_persons=this.leaseInfo?.no_of_persons;
              this.additionalbloc.user_id=this.leaseInfo?.entered_by;
              this.additionalbloc.move_in_date=formatDate(this.leaseInfo?.move_in_date, 'yyyy-MM-dd', 'en-US');
              this.additionalbloc.paying_date=formatDate(this.leaseInfo?.paying_date, 'yyyy-MM-dd', 'en-US');
              this.additionalbloc.created_by=this.leaseInfo?.createdby;
              this.isShortTerm=this.leaseInfo?.is_lease_short_term;
            }
            if(res.objResult.table1){
              res.objResult.table1.forEach((element:any,index:number) => {
                this.paymentSchedules.push({
                  "Amount":element.amt || 0,
                  "AdvAmt":element.adv_amt || 0,  
                  "cheque_no":element.cheque_no,
                  "cheque_date":formatDate(element.cheque_date, 'yyyy-MM-dd', 'en-US'),
                  "bank":element.bank,
                  "held_by":element.held_by,
                  "AccountCode":element.account_code,
                  "Account":element.account_name,
                  "DueDate":formatDate(element.due_date, 'yyyy-MM-dd', 'en-US'),
                  "Recurrence_id": element.recurring_id,
                  "Recurrence":element.recurring_cycle,
                  "PaymentTypeid":element.payment_id,
                  "PaymentType":element.payment_type,
                  "TaxProfileId":element.taxprofile_id,
                  "TaxProfile":element.profile_name,
                  "Memo":element.memo,
                  "InvoiceNo":element.invno,
                  "isEdit":1,
                  "row_no":index+1});
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
  private returnSelectedObject(list:any,filterCol:string,filterID:string) {
    if(list.length>0)
    return list.filter((item:any) => item[filterID] == this.leaseInfo[filterCol])[0];
  }

  onSearch(event:string,list:any ) { 
    const searchTerm = event.toLowerCase();  
    if (!searchTerm) {
      (this as any)[list+'List'] = [...(this as any)['all'+list+'List']];
    } else {
      (this as any)[list+'List'] = (this as any)['all'+list+'List'].filter((item:any) => 
        item.name.toLowerCase().includes(searchTerm)
      );
    }
  }
  showPaymentBlock(flg:number){
    if(flg==3){
      this.paymentSchedules=[];
    }
    else{
    this.addpaymentbloc.isSecurityDeposit=flg;
    this.showAddPayment=flg==0 ? false : true;
    }
  }
  onFilesSelected(files: File[]) {
    if (files.length > 0) {
      this.attachedFile=files[0];
    } else {
      this.attachedFile=null;
    }
  }
  savePayments(){
    if(this.addpaymentbloc.rentAmount==null || this.addpaymentbloc.rentAmount==0){
      this.toastr.error("Invalid   amount");
    }
    else  if(this.addpaymentbloc.dueDate==null || this.addpaymentbloc.dueDate==''){
      this.toastr.error("Invalid   due Date");
    }
    // else  if(this.addpaymentbloc.account==null || this.addpaymentbloc.account==''){
    //   this.toastr.error("Invalid  account");
    // }
    else{
      
      this.paymentSchedules.push({
        "Amount":Number(this.addpaymentbloc.rentAmount.toFixed(2)),
        "AdvAmt":0,  
        "cheque_no":this.addpaymentbloc.cheque_no,
        "cheque_date":this.addpaymentbloc.cheque_date,
        "bank":this.addpaymentbloc.bank,
        "held_by":this.addpaymentbloc.held_by?.id,
        "AccountCode":this.addpaymentbloc.isSecurityDeposit==2 ?'F4F69': this.addpaymentbloc.account?.id,
        "Account":this.addpaymentbloc.isSecurityDeposit==2 ?'Security Deposit':this.addpaymentbloc.account?.name,
        "DueDate":this.addpaymentbloc.dueDate,
        "Recurrence_id":this.addpaymentbloc.isSecurityDeposit==2 ?'90':this.addpaymentbloc.recurrenceCycle?.id,
        "Recurrence":this.addpaymentbloc.isSecurityDeposit==2 ?'Fixed':this.addpaymentbloc.recurrenceCycle?.name,
        "PaymentTypeid":this.addpaymentbloc.paymentMethod?.id,
        "PaymentType":this.addpaymentbloc.paymentMethod?.name,
        "TaxProfileId":this.addpaymentbloc.taxProfile?.id,
        "TaxProfile":this.addpaymentbloc.taxProfile?.name,
        "Memo":this.addpaymentbloc.memo,
        "InvoiceNo":this.addpaymentbloc.invno,
        "isEdit":0,
        "row_no":this.paymentSchedules.length+1});
        if(this.attachedFile)
          this.attachedFiles.push({"row_no":this.paymentSchedules.length,"file":this.attachedFile})
    }
  }
  generatePayments(){
    if(this.startDate==null || this.startDate==""){
      this.toastr.error("Invalid start Date");
    }
    else  if(this.endDate==null || this.endDate==""){
      this.toastr.error("Invalid end Date");
    }
    else if(this.rentAmount==null || this.rentAmount==0){
      this.toastr.error("Invalid rent amount");
    }
    else if(this.totalPayments==null || this.totalPayments==0){
      this.toastr.error("Invalid total payments");
    }
    else if(this.moneyHeldBy==null || this.moneyHeldBy==0){
      this.toastr.error("Invalid money held by");
    }
    else if(this.paymentMethod==null || this.paymentMethod==0){
      this.toastr.error("Invalid payment method");
    }
    else if(this.annualRent==null || this.annualRent==0){
      this.toastr.error("Invalid annualRent");
    }
    else{
      this.monthlyRent= Number((this.rentAmount / this.totalPayments).toFixed(2));
      this.paymentSchedules=[];
      let dueDate=this.startDate;
      for (let index = 0; index < this.totalPayments; index++) {
        this.paymentSchedules.push({
        "Amount":Number((this.rentAmount / this.totalPayments).toFixed(2)),
        "AdvAmt":0,  
        "cheque_no":this.addpaymentbloc.cheque_no,
        "cheque_date":this.addpaymentbloc.cheque_date,
        "bank":this.addpaymentbloc.bank,
        "held_by":this.addpaymentbloc.held_by?.id,
        "AccountCode":"7C2EF",
        "Account":"Rent Income",
        "DueDate":dueDate,
        "Recurrence_id":this.selectedLeaseType?.id,
        "Recurrence":this.selectedLeaseType?.name,
        "PaymentTypeid":this.paymentMethod?.id,
        "PaymentType":this.paymentMethod?.name,
        "TaxProfileId":0,
        "TaxProfile":'-',
        "Memo":'',
        "InvoiceNo":'',
        "isEdited":0,
        "row_no":(index+1)});
        dueDate=this.addMonthsToDate(this.totalPayments,dueDate);
        
      }
    }
  }
  addMonthsToDate(months: number,currentdate:string) {
    const currentVal = currentdate ? new Date(currentdate) : new Date();
    currentVal.setMonth(currentVal.getMonth() + months);
    return formatDate(currentVal, 'yyyy-MM-dd', 'en-US');
  }
  resetForm() {
    this.selectedTenant = null;
    this.selectedProperty = null;
    this.selectedUnit = null;
    this.selectedRoom = null;
    this.selectedAgent = null;
    this.occupants = [];
    this.additionalbloc.created_date = new Date().toISOString().substring(0, 10);
    this.additionalbloc.created_by = this.currentUser?.userName || 'Admin';
    this.additionalbloc.user_id = this.currentUser?.userId || '1';
    this.attachedFiles=[];
  }

  onTenantChange(tenantId: any) {
    this.selectedTenantObj = tenantId;
  }

  onPropertyChange(propertyCode: any) { 
    this.selectedPropertyObj=propertyCode;
    this.selectedUnit = null;
    this.selectedUnitObj = null; 
    this.roomsList=this.unitsList=this.allroomsList=this.allunitsList=[];
    this.loadLookup(44,0, 'unitsList', propertyCode?.code); 
  }

  onUnitChange(unitCode: string) {
    this.selectedUnitObj = unitCode;
    this.selectedRoom = null;
    this.roomsList= this.allroomsList=[];
    if(this.selectedPropertyObj && this.selectedUnitObj)
      this.loadLookup(38,0, 'roomsList', this.selectedPropertyObj.code,this.selectedUnitObj.code); 
  }

  calculateRentDetails() {
    this.annualRent = this.rentAmount;
    //this.monthlyRent = Number((this.rentAmount / 12).toFixed(2));
  }
  calculatemonths(){
    if (!this.startDate || !this.endDate) return;

    const d1 = new Date(this.startDate);
    const d2 = new Date(this.endDate);

    // Calculate structural month differences based on the year
    let months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();

    // Optional: Adjust if you want only completed full months
    if (d2.getDate() < d1.getDate()) {
      months--;
    } 
    // Set the signal value (taking absolute value to prevent negative numbers)
    this.months=(Math.abs(months));
  }
  calculateEndDate(){
    if (!this.startDate || !this.months) return;
    const currentVal = this.startDate ? new Date(this.startDate) : new Date();
    currentVal.setMonth(currentVal.getMonth() + this.months);
    this.endDate=formatDate(currentVal, 'yyyy-MM-dd', 'en-US');
  }
  openOccupantsModal() {
    this.occupantName = '';
    this.occupantPhone = '';
    this.occupantEmail = '';
    this.editingOccupantIndex = null;
    this.showOccupantsModal = true;
  }
  edit_action(row:any,action:string){

  }
  closeOccupantsModal() {
    this.showOccupantsModal = false;
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
          if(typeId==45)
          {
            this.leaseTypes=res.objResult.table || [];
            this.leaseCategories=res.objResult.table1 || [];
            this.moneyHeldOptions=res.objResult.table2 || [];
            this.paymentMethods=res.objResult.table3 || [];
            this.tenantsList=this.alltenantsList=res.objResult.table4 || [];
            this.agentsList=this.allagentsList=res.objResult.table5 || [];
            this.recurringList=this.allagentsList=res.objResult.table6 || [];
            this.coaList=this.allagentsList=res.objResult.table7 || [];
            this.taxProfilesList=this.allagentsList=res.objResult.table8 || []; 
            this.heldByList=this.allagentsList=res.objResult.table9 || [];
          }
          else{
            (this as any)[targetProperty] = res.objResult.table;
            (this as any)['all'+targetProperty]=(this as any)[targetProperty]; 
            if(this.leaseInfo?.unit_code)
              { this.selectedUnit=this.leaseInfo?.unit_code;
                this.selectedUnitObj=this.returnSelectedObject(this.unitsList,'unit_code','code');
              }
           if(this.leaseInfo?.room_code)
               this.selectedRoom=this.leaseInfo?.room_code;
          }
         
        }
      },
      error: (err) => {
        console.error(`Error fetching lookup ${filterId}:`, err);
      }
    });
  }
  addOccupant() {
    if (!this.occupantName.trim()) {
      this.toastr.warning('Please enter an occupant name');
      return;
    }

    const occupant: Occupant = {
      name: this.occupantName,
      phone: this.occupantPhone,
      email: this.occupantEmail
    };

    if (this.editingOccupantIndex !== null) {
      this.occupants[this.editingOccupantIndex] = occupant;
      this.toastr.success('Occupant updated successfully');
    } else {
      this.occupants.push(occupant);
      this.toastr.success('Occupant added successfully');
    }
    
    this.closeOccupantsModal();
  }

  editOccupant(index: number) {
    const occupant = this.occupants[index];
    this.occupantName = occupant.name;
    this.occupantPhone = occupant.phone;
    this.occupantEmail = occupant.email;
    this.editingOccupantIndex = index;
    this.showOccupantsModal = true;
  }
  onChangeSelect(element:any,item:any){
    (this as any)[item as any]=element; 
  }
  onChangeSelect_2(element:any,item:any){
    this.addpaymentbloc[item as any]=element; 
  }
  removeOccupant(index: number) {
    this.occupants.splice(index, 1);
    this.toastr.info('Occupant removed');
  }

  saveLease() {
    if (!this.selectedTenant || !this.selectedProperty || !this.selectedUnit) {
      this.toastr.error('Please complete all required fields (Tenant, Property, Unit)');
      return;
    }
    else if (this.startDate=='' || this.startDate==null){
      this.toastr.error('Invalid start date');
      return;
    }
    else if (this.endDate=='' || this.endDate==null){
      this.toastr.error('Invalid end date');
      return;
    }
    else if (this.rentAmount==0 || this.rentAmount==null){
      this.toastr.error('Invalid rent amount');
      return;
    }
    else if (this.paymentSchedules.length==0){
      this.toastr.error('Invalid payment schedules');
      return;
    }
    else{

      let clsLeaseInfo:any={};
      clsLeaseInfo.is_lease_short_term=this.isShortTerm;
      clsLeaseInfo.lease_type=this.selectedLeaseType.id;
      clsLeaseInfo.lease_category=this.selectedLeaseCategory.id;
      clsLeaseInfo.start_date=this.startDate;
      clsLeaseInfo.end_date=this.endDate;
      clsLeaseInfo.total_months=this.months;

      let clsRentInfo :any={};
      clsRentInfo.rent_amount=this.rentAmount || 0;
      clsRentInfo.total_payments=this.totalPayments || 0;
      clsRentInfo.money_held_by=this.moneyHeldBy.id || 0;
      clsRentInfo.payment_type=this.paymentMethod.id || 0;
      clsRentInfo.annual_rent=this.annualRent || 0;
      clsRentInfo.monthly_rent=this.monthlyRent || 0;
 
      const request = {
        userid: this.currentUser?.userId,
        code: this.leaseId || '',
        source: 'web',
        company_id: this.currentUser?.companyId, 
        clientId: this.currentUser?.clientId, 
        tenant_code: this.selectedTenantObj?.code,
        property_code: this.selectedPropertyObj.code,
        unit_code: this.selectedUnitObj.code,
        room_code: this.selectedRoom?.code || '',
        rent_collector:this.selectedAgent?.code ||'',
        clsLeaseInfo: clsLeaseInfo,
        clsRentInfo: clsRentInfo, 
        clsAddtionalInfo: this.additionalbloc,  
        clsPaymentSchedules: this.paymentSchedules,
        clsOccupants:this.occupants,
        id: this.lease_id || 0,
   
      }; 
      const formData = new FormData(); 
    // JSON goes as ONE field
    formData.append('reqObject', JSON.stringify(request));
      this.attachedFiles.forEach((element:any) => {
      formData.append(element.row_no, element.file); 
    });
   
     this.lease_service.saveLease(formData).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res["statusCode"] == "200") {
            this.toastr.success('Lease agreement registered successfully');
            this.router.navigate(['/leases']); 
          }
          else{
            this.toastr.error(res['message']);
            return;
          }
        },
        error: (err) => {
          this.isLoading = false;
        },
      });
    }
   
  }

  goBack() {
    this.router.navigate(['/leases']);
  }
}
