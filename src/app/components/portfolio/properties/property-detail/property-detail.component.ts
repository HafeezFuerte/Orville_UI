import { Component, OnInit, TemplateRef, ViewChild,Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { PortfolioService } from '../../services/portfolio.service';
import { DetailPageLayoutComponent } from '../../detail-page-layout/detail-page-layout.component';
import { DetailTab } from '../../../../shared/models/detail-tab.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAreaPopupComponent } from '../../popups/common-area-popup/common-area-popup.component';
import { AttachmentPopupComponent } from '../../popups/attachments-popup/attachment-popup.component';
import { CommonService } from '../../../../services/common.service';
import { AuthPayload } from '../../../common/store/login-auth-params/auth.models';
import { ToastrService } from 'ngx-toastr';
import { UnitsTableComponent } from '../../../child-tables/units/units-table.component';
import { NotesComponent } from '../../../child-tables/notes/notes.component';
import { AttachmentsComponent } from '../../../child-tables/attachments/attachments.component';
@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, NgSelectModule, ReactiveFormsModule,NotesComponent,AttachmentsComponent,UnitsTableComponent, FormsModule, CommonModule, DetailPageLayoutComponent, TranslateModule, CommonAreaPopupComponent,AttachmentPopupComponent],
  templateUrl: './property-detail.component.html',
  styleUrl: './property-detail.component.scss'
})
export class PropertyDetailComponent implements OnInit {
  propertyAttachment: File[] = [];
  propertyNotesFile: File[] = [];
  viewMode: 'list' | 'grid' = 'list';
  propertyId!: number;
  property: any = null;
  activeTab = 'overview';
  showMoreDetails: boolean = false;
  loading = false;
  paginatedProperties: any[] = [];
  commonAreaForm!: FormGroup;
  attachmentsForm!: FormGroup;
  notesForm!: FormGroup;
  propertyCode = '';
  commonData: any = [];
  tabs: DetailTab[] = []; 
  unitsData: any = [];
  roomsData = [];
  tenantsData = [];
  commonAreaData = [];
  broadcastsData = [];
  attachmentsData = [];
  broadCastsData = [];
  assetsData = [];
  notesData = [];
  parkingData = [];
  documentsData = [];
  @ViewChild(DetailPageLayoutComponent)
  detailLayout!: DetailPageLayoutComponent;
  // columns
  unitColumns = [
  { key: 'code', label: 'web.common.lblID',is_editCol:true,redirect_url:"/units",edit_col:"code"},
  { key: 'unit_code', label: 'web.common.lblName'},
  { key: 'category_name', label: 'web.common.lblCategory' },
  { key: 'unit_beds_name', label: 'web.Unit.lblBeds' },
  { key: 'property_Name', label: 'web.property.lblProperty' },
  { key: 'landlord', label: 'web.Unit.lblLandlord',is_editCol:true,redirect_url:"/contacts/landlords",edit_col:"landlord_code" },
  { key: 'tags', label: 'web.property.lblTags' },
  { key: 'floor_no', label: 'web.contacts.lblFloorNumber' },
  { key: 'management_fee', label: 'web.Unit.lblManagementFee',is_include_currency:true },
  { key: 'unit_status_name', label: 'web.Unit.lblStatus',is_status:true }, 
  { key: 'internal_status', label: 'web.contacts.lblInternalStatus' },
  { key: 'size_sqft', label: 'web.contacts.lblSize' },
  { key: 'market_rent', label: 'web.contacts.lblMarketRent',is_include_currency:true },
  { key: 'rent_deposit', label: 'web.contacts.lblDeposited',is_include_currency:true },
  { key: 'is_published', label: 'web.contacts.lblPublished' },
  { key: 'sale_status', label: 'web.contacts.lblSaleStatus' } 
];

roomColumns = [
  { key: 'code', label: 'web.common.lblID',is_editCol:true,redirect_url:"/rooms",edit_col:"code"},
  { key: 'property_Name', label: 'web.property.lblProperty' },
  { key: 'unit_no', label: 'web.contacts.lblUnit',is_editCol:true,redirect_url:"/units",edit_col:"unit_code"}  ,
  { key: 'room_type_name', label: 'web.Unit.lblRoomType' },
  { key: 'category_name', label: 'web.common.lblCategory' },
  { key: 'room_type_name', label: 'web.Unit.lblBeds' }, 
  { key: 'landlord', label: 'web.Unit.lblLandlord',is_editCol:true,redirect_url:"/contacts/landlords",edit_col:"landlord_code" },
  { key: 'tags', label: 'web.property.lblTags' },
  { key: 'floor_no', label: 'web.contacts.lblFloorNumber' },
  { key: 'management_fee', label: 'web.Unit.lblManagementFee',is_include_currency:true },
  { key: 'room_status_name', label: 'web.Unit.lblStatus',is_status:true }, 
  { key: 'internal_status', label: 'web.contacts.lblInternalStatus' },
  { key: 'size_sqft', label: 'web.contacts.lblSize' },
  { key: 'market_rent', label: 'web.contacts.lblMarketRent',is_include_currency:true },
  { key: 'rent_deposit', label: 'web.contacts.lblDeposited',is_include_currency:true },
  { key: 'is_published', label: 'web.contacts.lblPublished' },
  { key: 'sale_status', label: 'web.contacts.lblSaleStatus' }
];

tenantColumns = [
  { key: 'lease_code', label: 'web.common.lblID',is_editCol:true},
  { key: 'tenant ', label: 'web.common.lblName' },
  { key: 'email_address', label: 'web.common.lblEmail' },
  { key: 'phone_number', label: 'web.common.lblPhoneNumber' },
  { key: 'company_name', label: 'web.property.lblCompany' },
  { key: 'active_lease', label: 'web.property.lblActiveLease' }
];
commonAreaColumns = [
  { key: 'code', label: 'web.common.lblID' ,is_editCol:true},
  { key: 'area_name', label: 'web.property.lblAreaName' },
  { key: 'property', label: 'web.property.lblProperty' },
  { key: 'floor_no', label: 'web.property.lblFloorNo' },
  { key: 'uploaded_date', label: 'web.Unit.lblCreatedAt' },
  { key: 'modified_date', label: 'web.Unit.lblUpdatedAt' } 
];
broadCastsColumns = [
  { key: 'code', label: 'web.common.lblID',is_editCol:true },
  { key: 'subject', label: 'web.property.lblSubject' },
  { key: 'preview', label: 'web.property.lblPreview' },
  { key: 'status', label: 'web.common.lblStatus' },
  { key: 'broadcast_type_nm', label: 'web.property.lblBroadcastType' },
  { key: 'send_to', label: 'web.property.lblSendable' },
  { key: 'is_scheduled', label: 'web.property.lblScheduled' },
  { key: 'scheduled_date', label: 'web.common.lblDate' }
  
];

 
parkingsColumns = [
  { key: 'code', label: 'web.common.lblID',is_editCol:true },
  { key: 'parking_no', label: 'web.property.lblParkingNo' },
  { key: 'property', label: 'web.property.lblProperty' },
  { key: 'unit_code1', label: 'web.property.lblUnit' },
  { key: 'parking_type_nm', label: 'web.common.lblType' },
  { key: 'uploaded_by', label: 'web.property.lblFee' },
  { key: 'recurring_cycle_nm', label: 'web.property.lblCycle' },
  { key: 'remarks', label: 'web.common.lblRemarks' }
  
];

assetsColumns = [
  { key: 'code', label: 'web.common.lblID',is_editCol:true },
  { key: 'asset_name', label: 'web.property.lblAssetName' },
  { key: 'model', label: 'web.property.lblModel' },
  { key: 'asset_category', label: 'web.property.lblCategory' },
  { key: 'property_code', label: 'web.property.lblProperty' },
  { key: 'unit_code', label: 'web.property.lblUnit' },
  { key: 'price', label: 'web.property.lblPrice' }
];

currentUser: AuthPayload | null = null;
constructor(
  private route: ActivatedRoute,
  private store: Store,
  private portfolioService: PortfolioService,
  private fb: FormBuilder,
  private commonService: CommonService,
  private toastr:ToastrService,
  private translate: TranslateService) {

}
  ngOnInit(): void {
     this.currentUser = this.commonService.getCurrentUser();
    this.route.paramMap.subscribe(params => {
      this.propertyCode = params.get('code') ?? '';
    });   
    this.createForms();
    this.initializeTabs();   
    this.loadMasterDataByType(13,0, '', this.propertyCode,'');
  }
private createForms(): void {
  this.commonAreaForm = this.fb.group({
    areaName: ['', Validators.required],
    floor: ['', Validators.required],
    code:[''],
    desc:['']
  }); 
  
}
getStatusClass(status: string) {
  switch(status) {
    case 'Active': return 'bg-success/10 text-success';
    case 'Blocked': return 'bg-danger/10 text-danger';
    default: return 'bg-gray-100 text-gray-600';
  }
}
toggleMoreDetails(): void {
  this.showMoreDetails = !this.showMoreDetails;
}
private get commonPayload() {
  return {
    userId: this.currentUser?.userId,
    clientId: this.currentUser?.clientId,
    company_id: this.currentUser?.companyId,
    source: 'web',
    languageid: 1
  };
}
private loadMasterDataByType(
  typeId: number,
  filterId: number,
  target: '',
  filtertext:string ='',
  filterText1:string ='', 
) {
  this.portfolioService.getMasterByType({
    typeId: typeId,
    filterId,
     filterText: filtertext,
    filterText1: filterText1 
  }).subscribe({
    next: res => {
     this.loading = false; 
          if (res['statusCode']  != "200") {
              this.loading = false;
              return;
            }
          this.bindPropertyData(res.objResult);
           this.initializeTabs();
          this.loading = false;
     
    },
    error: console.error
  });
}
private bindPropertyData(data: any): void {

  this.property = {
    ...data.property[0],
    amenities: data.amenities
  }; 
  this.unitsData = data.units_info;
  this.roomsData = data.rooms_info;
  this.commonAreaData = data.common_area;
  this.broadCastsData = data.broadcasts;
  this.assetsData = data.assets;
  this.notesData = data.notes;
  this.attachmentsData = data.documents;
  this.tenantsData = data.tenants_history;
  this.parkingData = data.parkings;
}
initializeTabs() {

  this.tabs = [

    {
      key: 'overview',
      label: 'Overview',
      layout: 'content'
    },

    {
      key: 'units',
      label: 'Units',
      layout: 'content',
      columns: this.unitColumns,
      data: this.unitsData,
      totalRecords: this.unitsData?.length || 0,
      loading: this.loading,
      hasActions: true,
      addButtonText: 'Unit'
    },

    {
      key: 'rooms',
      label: 'Rooms',
      layout: 'content',
      columns: this.roomColumns,
      data: this.roomsData,
      totalRecords: this.roomsData?.length || 0,
      loading: this.loading,
      hasActions: true,
      addButtonText: 'Room'
    },

    {
      key: 'tenants',
      label: 'Tenants History',
      layout: 'table',
      columns: this.tenantColumns,
      data: this.tenantsData,
      totalRecords: this.tenantsData?.length || 0,
      loading: this.loading,
      hasActions: true,
      addButtonText: 'Tenant'
    },
{
      key: 'commonarea',
      label: 'Common Area',
      layout: 'table',
      columns: this.commonAreaColumns,
      data: this.commonAreaData,
      totalRecords: this.commonAreaData?.length || 0,
      loading: this.loading,
      hasActions: true,
      addButtonText: 'Common Area',
      form: this.commonAreaForm,
      popupType: 'common-area'
    },
    {
      key: 'attachments',
      label: 'Attachments',
      layout: 'content', 
      entity:"property",
      entity_id:this.propertyCode,
      data: this.attachmentsData,
      totalRecords: this.attachmentsData?.length || 0,
      loading: this.loading,
      hasActions: true,
      addButtonText: 'Attachments',
      form: this.attachmentsForm,
      popupType: 'attachment'      
    },
    {
      key: 'broadcasts',
      label: 'Broadcasts',
      layout: 'table',
      columns: this.broadCastsColumns,
      data: this.broadCastsData,
      totalRecords: this.broadCastsData?.length || 0,
      loading: this.loading,
      hasActions: true,
      addButtonText: ''
    },
    {
      key: 'notes',
      label: 'Notes',
      layout: 'content', 
      entity:"property",
      entity_id:this.propertyCode,
      data: this.notesData,
      totalRecords: this.notesData?.length || 0,
      loading: this.loading,
      hasActions: true,
      addButtonText: 'Notes',
      form: this.notesForm,
      popupType: 'notes'
    },
    {
      key: 'parkings',
      label: 'Parkings',
      layout: 'table',
      columns: this.parkingsColumns,
      data: this.parkingData,
      totalRecords: this.parkingData?.length || 0,
      loading: this.loading,
      hasActions: true,
      addButtonText: 'Parking'
    },
    {
      key: 'assets',
      label: 'Assets',
      layout: 'table',
      columns: this.assetsColumns,
      data: this.assetsData,
      totalRecords: this.assetsColumns?.length || 0,
      loading: this.loading,
      hasActions: true,
      addButtonText: 'Asset'
    }

  ];

}
 
savePopup(tab: string) {

  switch (tab) {

    case 'commonarea':
      this.saveCommonArea(this.commonAreaForm);
      break;

    case 'attachments':
      
      break;

    case 'notes':
       
      break;
  }

}
get selectedTab(): DetailTab | undefined {
  const tab = this.tabs.find(t => t.key === this.activeTab);
  return tab;
}
handleSearch(searchstring:any){ 
   const tab = this.tabs.find(t => t.key === this.activeTab);
    if (searchstring) {  
      const q = searchstring.toLowerCase();
      let result=tab!.data;
      if(this.activeTab=="commonarea"){
        result = result?.filter(p => 
          p.area_name.toLowerCase().includes(q) || 
          p.property.toLowerCase().includes(q)
        );
      }
      else if(this.activeTab=="notes"){
        result = result?.filter(p => 
          p.subject.toLowerCase().includes(q) || 
          p.description.toLowerCase().includes(q)
        );
      }
      tab!.data=result;
    }
    else
      tab!.data=this.activeTab=="commonarea" ?
      this.commonAreaData :
      this.activeTab=="notes" ?
      this.notesData :
      this.activeTab=="attachments" ? 
      this.attachmentsData : [];
}
handleEditNotification(selectedObject: any) {
   
  if(selectedObject && selectedObject.tab_name=="commonarea"){ 
    
    this.commonAreaForm.patchValue({
      areaName: selectedObject?.area_name,
      floor: selectedObject?.floor_no,
      code: selectedObject?.code,
      desc: selectedObject?.strdesc});
  }
  else if(selectedObject && selectedObject.tab_name=="notes"){ 
    
    this.notesForm.patchValue({
      subject: selectedObject?.subject,
      commChannelType:selectedObject?.channel_type,
      content: selectedObject?.description,  
      code: selectedObject?.code,
      desc: selectedObject?.description});
  }
  else if(selectedObject && selectedObject.tab_name=="attachments"){  
    this.attachmentsForm.patchValue({
      documentType: selectedObject?.document_type,
      documentNumber:selectedObject?.doc_no,
      issueDate: this.formatDate(selectedObject?.issue_date),  
      expiryDate: this.formatDate(selectedObject?.expiry_date),  
      issuingAuthority: selectedObject?.issuing_authority,  
      shareWithTenant: selectedObject?.share_with_tenants,  
      shareWithLandlord: selectedObject?.share_with_landlords,  
      code: selectedObject?.code}); 
  }
}
private formatDate(date:any) {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return [year, month, day].join('-');
}
saveCommonArea(form:FormGroup){
  const commonAreaLabels = {
    areaName: this.translate.instant('web.portfolio.popups.commonArea.lblAreaName'),
    floor: this.translate.instant('web.portfolio.popups.commonArea.lblFloorNo')
  };
  if (!this.validateForm(this.commonAreaForm, commonAreaLabels)) {
    return;
  }
  const values = form.value;
  const payload = {
   ...this.commonPayload,
   id:0,
   property_code:this.propertyCode,
   area_name:values.areaName,
   floor_no:values.floor,
   desc:values.desc || '',
   code:values.code
};
this.portfolioService.saveCommonArea(payload).subscribe({
    next: (res) => { 
      if (res["statusCode"] == "200") { 
        this.commonAreaForm.reset();
        this.detailLayout.closeModal();
        this.commonAreaData = res.objResult.table;
        let tab = this.tabs.find(t => t.key === this.activeTab);
        tab!.data=this.commonAreaData;
      } else{
        this.toastr.error(res['message'],"Error");
      }
    },
    error: console.error
});
}
 
 
validateForm(form: FormGroup, fieldLabels: { [key: string]: string }): boolean {
  const errors: string[] = [];
  Object.keys(fieldLabels).forEach(controlName => {
    const control = form.get(controlName);
    if (control?.invalid) {
      errors.push(`${fieldLabels[controlName]} is required.`);
    }
  });
  if (errors.length > 0) {
    form.markAllAsTouched();
    this.toastr.error(
      errors.join('<br>'),
      'Validation',
      {
        enableHtml: true,
        timeOut: 5000,
        positionClass: 'toast-top-right'
      }
    );
    return false;
  }
  return true;
}

}
