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
  addpaymentbloc:any= {    includetax:false,    isSecurityDeposit:0,Amount:0, AdvAmt:0,   attachedFile:null,    DueDate:null,Memo:'',
  money_held_by_id:null,    Recurrence_id:null,cheque_no:'',cheque_date:'',bank:'',held_by:null,  TaxProfileId:null,  AccountCode:null,  PaymentTypeid:null,InvoiceNo:''}
  showAddPayment:boolean=false; 
  lease_id:number=0;
  isLoading:boolean=false;
  isDetailsMapped:boolean=false;
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
      if(this.leaseId!='')
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
              this.selectedProperty=this.leaseInfo?.property_code;
              this.lease_id=this.leaseInfo.id;
              this.selectedUnit = null;
              this.selectedUnitObj = null; 
              this.occupants=JSON.parse(this.leaseInfo.occupants_dtls) || [];
              this.roomsList=this.unitsList=this.allroomsList=this.allunitsList=[];
              this.loadLookup(44,0, 'unitsList', this.selectedProperty);  
              this.selectedTenantObj=this.selectedTenant=this.returnSelectedObject(this.tenantsList,'tenant_code','code') ||this.leaseInfo?.tenant_code;
              this.selectedTenant=this.leaseInfo?.tenant_code; 
              this.selectedAgent= this.leaseInfo?.assigned_collector; 

              this.startDate=formatDate(this.leaseInfo?.start_date, 'yyyy-MM-dd', 'en-US');
              this.endDate=formatDate(this.leaseInfo?.end_date, 'yyyy-MM-dd', 'en-US');
              this.selectedLeaseType= this.returnSelectedObject(this.leaseTypes,'lease_type','id') || this.leaseInfo?.lease_type;
              this.selectedLeaseCategory=this.returnSelectedObject(this.leaseCategories,'lease_category','id') || this.leaseInfo?.lease_category;
              this.months=this.leaseInfo?.total_months;
              this.rentAmount=this.leaseInfo?.rent_amount;
              this.totalPayments=this.leaseInfo?.total_payments;
              this.moneyHeldBy= this.leaseInfo?.money_held_by;
              this.paymentMethod= this.leaseInfo?.payment_type;
              this.annualRent=this.leaseInfo?.annual_rent;
              this.monthlyRent=this.leaseInfo?.monthly_rent;
              this.additionalbloc.no_of_persons=this.leaseInfo?.no_of_persons;
              this.additionalbloc.user_id=this.leaseInfo?.entered_by;
              this.additionalbloc.move_in_date=formatDate(this.leaseInfo?.move_in_date, 'yyyy-MM-dd', 'en-US');
              this.additionalbloc.paying_date=formatDate(this.leaseInfo?.paying_date, 'yyyy-MM-dd', 'en-US');
              this.additionalbloc.created_by=this.leaseInfo?.createdby;
              this.isShortTerm=this.leaseInfo?.is_lease_short_term;
              this.mapSelectedObjects();
              this.loadLookup(44,0, 'unitsList', this.selectedProperty);
            }
            if(res.objResult.table1){
              res.objResult.table1.forEach((element:any,index:number) => {
                this.paymentSchedules.push({
                  "includetax":element.includetax || false,
                  "Amount":element.amt || 0,
                  "AdvAmt":element.adv_amt || 0,  
                  "cheque_no":element.cheque_no,
                  "isSecurityDeposit":element.isSecurityDeposit,
                  "cheque_date":formatDate(element.cheque_date, 'yyyy-MM-dd', 'en-US'),
                  "bank":element.bank_name,
                  "held_by":element.held_by,
                  "AccountCode":element.account_code,
                  "Account":element.account_name,
                  "DueDate":formatDate(element.due_date, 'yyyy-MM-dd', 'en-US'),
                  "Recurrence_id": element.recurring_id,
                  "Recurrence":element.recurring_cycle,
                  "PaymentTypeid":element.payment_id,
                  "PaymentType":element.payment_type,
                  "TaxProfileId":element.taxprofile_id,
                  "money_held_by_id":element.money_held_by,
                  "TaxProfile":element.profile_name,
                  "Memo":element.memo,
                  "InvoiceNo":element.invno,
                  "attachment_path":element.attachment_path,
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
  mapSelectedObjects() {
    if (this.isDetailsMapped) return;
    if (!this.leaseInfo) return;
    
    if (this.tenantsList?.length > 0 && this.leaseInfo.tenant_code) {
      this.selectedTenantObj = this.returnSelectedObject(this.tenantsList, 'tenant_code', 'code');
      this.selectedTenant = this.leaseInfo.tenant_code;
    }
    
    if (this.propertiesList?.length > 0 && this.leaseInfo.property_code) {
      this.selectedPropertyObj = this.returnSelectedObject(this.propertiesList, 'property_code', 'code');
      this.selectedProperty = this.leaseInfo.property_code;
    }
    
    if (this.unitsList?.length > 0 && this.leaseInfo.unit_code) {
      this.selectedUnitObj = this.returnSelectedObject(this.unitsList, 'unit_code', 'code');
      this.selectedUnit = this.leaseInfo.unit_code;
    }
    
    if (this.roomsList?.length > 0 && this.leaseInfo.room_code) {
      this.selectedRoom = this.leaseInfo.room_code;
    }
    
    if (this.agentsList?.length > 0 && this.leaseInfo.assigned_collector) {
      this.selectedAgent = this.leaseInfo.assigned_collector;
    }
    
    if (this.leaseTypes?.length > 0 && this.leaseInfo.lease_type) {
      this.selectedLeaseType = this.returnSelectedObject(this.leaseTypes, 'lease_type', 'id');
    }
    
    if (this.leaseCategories?.length > 0 && this.leaseInfo.lease_category) {
      this.selectedLeaseCategory = this.returnSelectedObject(this.leaseCategories, 'lease_category', 'id');
    }

    if (this.tenantsList?.length > 0 && 
        this.propertiesList?.length > 0 && 
        this.unitsList?.length > 0) {
      this.isDetailsMapped = true;
    }
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
    this.showAddPayment=!this.showAddPayment;
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
    if(this.addpaymentbloc.Amount==null || this.addpaymentbloc.Amount==0){
      this.toastr.error("Invalid   amount");
    }
    else  if(this.addpaymentbloc.DueDate==null || this.addpaymentbloc.DueDate==''){
      this.toastr.error("Invalid   due Date");
    }
    // else  if(this.addpaymentbloc.account==null || this.addpaymentbloc.account==''){
    //   this.toastr.error("Invalid  account");
    // }
    else{
      
      this.paymentSchedules.push({
        "includetax":this.addpaymentbloc.includetax,
        "Amount":Number(this.addpaymentbloc.Amount.toFixed(2)),
        "AdvAmt":0,  
        "cheque_no":this.addpaymentbloc.cheque_no,
        "cheque_date":this.addpaymentbloc.cheque_date,
        "bank":this.addpaymentbloc.bank,
        "held_by":this.addpaymentbloc.held_by,
        "AccountCode":this.addpaymentbloc.isSecurityDeposit==1 ?'F4F69': this.addpaymentbloc.AccountCode,
        "Account":this.addpaymentbloc.isSecurityDeposit==1 ?'Security Deposit':this.coaList.filter((item:any)=>{
          return item.id==this.addpaymentbloc.AccountCode
        })[0]?.name,
        "DueDate":this.addpaymentbloc.DueDate,
        "Recurrence_id":this.addpaymentbloc.isSecurityDeposit==1 ?'90':this.addpaymentbloc.Recurrence_id,
        "Recurrence":this.addpaymentbloc.isSecurityDeposit==1 ?'Fixed':this.recurringList.filter((item:any)=>{
          return item.id==this.addpaymentbloc.Recurrence_id
        })[0]?.name,
        "money_held_by_id":this.addpaymentbloc.isSecurityDeposit==1 ?'90':this.addpaymentbloc.money_held_by_id ,
        "money_held_by":this.addpaymentbloc.isSecurityDeposit==1 ?'Fixed': 
        this.moneyHeldOptions.filter((item:any)=>{
          return item.id==this.addpaymentbloc.money_held_by_id
        })[0]?.name ,
        "PaymentTypeid":this.addpaymentbloc.PaymentTypeid,
        "PaymentType": 
        this.paymentMethods.filter((item:any)=>{
          return item.id==this.addpaymentbloc.PaymentTypeid
        })[0]?.name,
        "TaxProfileId":this.addpaymentbloc.TaxProfileId,
        "TaxProfile":    this.taxProfilesList.filter((item:any)=>{
          return item.id==this.addpaymentbloc.TaxProfileId
        })[0]?.name,
        "Memo":this.addpaymentbloc.Memo,
        "InvoiceNo":this.addpaymentbloc.InvoiceNo,
        "isEdit":0,
        "row_no":this.paymentSchedules.length+1});
        if(this.attachedFile)
          this.attachedFiles.push({"row_no":this.paymentSchedules.length,"file":this.attachedFile})
        this.showAddPayment=false;
        this.attachedFile='';
        this.addpaymentbloc.Amount=0;
        this.addpaymentbloc.cheque_no='';
        this.addpaymentbloc.AccountCode="";
        this.addpaymentbloc.Recurrence_id=this.addpaymentbloc.held_by=this.addpaymentbloc.money_held_by_id=this.addpaymentbloc.PaymentTypeid=this.addpaymentbloc.TaxProfileId=0;

        this.addpaymentbloc.cheque_date= this.addpaymentbloc.DueDate=''
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
    else if (this.paymentMethod==169 && (this.addpaymentbloc.cheque_no=="" || this.addpaymentbloc.cheque_no==null))
    {
      this.toastr.error("Enter atleast one cheque no");
    }
    else{
      this.monthlyRent= Number((this.rentAmount / this.totalPayments).toFixed(2));
      this.paymentSchedules=[];
      let dueDate=this.startDate;
      debugger;
      for (let index = 0; index < this.totalPayments; index++) {
        this.paymentSchedules.push({
        "Amount":Number((this.rentAmount / this.totalPayments).toFixed(2)),
        "AdvAmt":0,  
        "cheque_no":this.addpaymentbloc.cheque_no!=null && index==0 ? 
          this.addpaymentbloc.cheque_no : 
          this.addpaymentbloc.cheque_no==null || this.addpaymentbloc.cheque_no=="" ? " chk -"+(index+1) : this.addpaymentbloc.cheque_no + " -"+(index+1),
        "cheque_date":this.addpaymentbloc.cheque_date!=null && index==0 ? this.addpaymentbloc.cheque_date:dueDate,
        "bank":this.addpaymentbloc.bank,
        "held_by":this.addpaymentbloc.held_by,
        "money_held_by_id":this.addpaymentbloc.isSecurityDeposit==1 ?'90':this.moneyHeldBy ,
        "money_held_by":this.addpaymentbloc.isSecurityDeposit==1 ?'Fixed': 
        this.moneyHeldOptions.filter((item:any)=>{
          return item.id==this.moneyHeldBy
        })[0]?.name ,
        "AccountCode":"7C2EF",
        "Account":"Rent Income",
        "DueDate":dueDate,
        "Recurrence_id":this.selectedLeaseType?.id,
        "Recurrence":this.selectedLeaseType?.name,
        "PaymentTypeid":this.paymentMethod,
        "PaymentType": this.paymentMethods.filter((item:any)=>{
          return item.id==this.paymentMethod
        })[0]?.name,
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
    if(action=="edit"){ 
        this.addpaymentbloc=row;
      this.showAddPayment=true;
      
    }
    else if(action=="delete"){
      let _remlist=this.paymentSchedules.filter((item:any)=>{
        return item.row_no!=row.row_no
      });
      if(_remlist){
        this.paymentSchedules=_remlist;
        const total = this.paymentSchedules.reduce(
          (sum, item) => item.isSecurityDeposit === 0
          ? sum + Number(item.Amount || 0)
          : sum,
          0
        );
        this.rentAmount=this.annualRent= total;
        this.totalPayments=this.paymentSchedules.filter((item:any)=>{
          return item.isSecurityDeposit==0
        })?.length
      }
    }
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

            const tenantCode = this.route.snapshot.queryParams['tenantCode'];
            if (tenantCode) {
              const found = this.tenantsList.find(t => t.code === tenantCode || t.id === tenantCode || t.tenant_code === tenantCode);
              if (found) {
                this.selectedTenant = found.code || found.tenant_code || found.id;
                this.selectedTenantObj = found;
              } else {
                this.selectedTenant = tenantCode;
              }
            }
          }
          else{
            (this as any)[targetProperty] = res.objResult.table;
            (this as any)['all'+targetProperty]=(this as any)[targetProperty]; 
          }
          
          if (this.leaseId !== '') {
            this.mapSelectedObjects();
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
      clsLeaseInfo.lease_type=this.selectedLeaseType?.id || this.selectedLeaseType;
      clsLeaseInfo.lease_category=this.selectedLeaseCategory?.id || this.selectedLeaseCategory;
      clsLeaseInfo.start_date=this.startDate;
      clsLeaseInfo.end_date=this.endDate;
      clsLeaseInfo.total_months=this.months;

      let clsRentInfo :any={};
      clsRentInfo.rent_amount=this.rentAmount || 0;
      clsRentInfo.total_payments=this.totalPayments || 0;
      clsRentInfo.money_held_by=this.moneyHeldBy || 0;
      clsRentInfo.payment_type=this.paymentMethod || 0;
      clsRentInfo.annual_rent=this.annualRent || 0;
      clsRentInfo.monthly_rent=this.monthlyRent || 0;
 
      const additionalInfo = {
        ...this.additionalbloc,
        move_in_date: this.additionalbloc.move_in_date || '1900-01-01',
        paying_date: this.additionalbloc.paying_date || '1900-01-01',
        created_date: this.additionalbloc.created_date || '1900-01-01'
      };

      const getCode = (val: any) => {
        if (!val) return '';
        if (typeof val === 'object') {
          return val.code || val.id || '';
        }
        return val;
      };

      const request = {
        userid: this.currentUser?.userId,
        code: this.leaseId || '',
        source: 'web',
        company_id: this.currentUser?.companyId, 
        clientId: this.currentUser?.clientId, 
        tenant_code: getCode(this.selectedTenant) || getCode(this.selectedTenantObj),
        property_code: getCode(this.selectedProperty) || getCode(this.selectedPropertyObj),
        unit_code: getCode(this.selectedUnit) || getCode(this.selectedUnitObj),
        room_code: getCode(this.selectedRoom),
        rent_collector: getCode(this.selectedAgent),
        clsLeaseInfo: clsLeaseInfo,
        clsRentInfo: clsRentInfo, 
        clsAddtionalInfo: additionalInfo,  
        clsPaymentSchedules: this.paymentSchedules,
        clsOccupants:this.occupants,
        id: this.lease_id || 0,
   
      }; 

      console.log('Sending Save Lease Request:', request);
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
