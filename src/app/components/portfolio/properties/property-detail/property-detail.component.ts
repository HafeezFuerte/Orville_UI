import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, NgSelectModule, ReactiveFormsModule, FormsModule, CommonModule, DetailPageLayoutComponent, TranslateModule, CommonAreaPopupComponent,AttachmentPopupComponent],
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
  { key: 'code', label: 'web.common.lblID'},
  { key: 'unit_code', label: 'web.common.lblName'},
  { key: 'category_name', label: 'web.common.lblCategory' },
  { key: 'unit_beds_name', label: 'web.Unit.lblBeds' },
  { key: 'property Name', label: 'web.property.lblProperty' },
  { key: 'landlord', label: 'web.Unit.lblLandlord' },
  { key: 'tags', label: 'web.property.lblTags' },
  { key: 'unit_type_name', label: 'web.Unit.lblUnitType' }
];

roomColumns = [
  { key: 'code', label: 'web.common.lblID' },
  { key: 'room_type_name', label: 'web.common.lblName' },
  { key: 'category_name', label: 'web.common.lblCategory' },
  { key: 'beds', label: 'web.Unit.lblBeds' },
  { key: 'property Name', label: 'web.property.lblProperty'},
  { key: 'name', label: 'web.Unit.lblLandlord' },
  { key: 'tags', label: 'web.property.lblTags'  },
  { key: 'unit_type_name', label: 'web.Unit.lblUnitType' },
  { key: 'room_type_name', label: 'web.Unit.lblRoomType' }
];

tenantColumns = [
  { key: 'lease_code', label: 'web.common.lblID'},
  { key: 'tenant ', label: 'web.common.lblName' },
  { key: 'email_address', label: 'web.common.lblEmail' },
  { key: 'phone_number', label: 'web.common.lblPhoneNumber' },
  { key: 'company_name', label: 'web.property.lblCompany' },
  { key: 'active_lease', label: 'web.property.lblActiveLease' }
];
commonAreaColumns = [
  { key: 'code', label: 'web.common.lblID' },
  { key: 'area_name', label: 'web.property.lblAreaName' },
  { key: 'property_code', label: 'web.property.lblPropertyID' },
  { key: 'floor_no', label: 'web.property.lblFloorNo' },
  { key: 'uploaded_date', label: 'web.Unit.lblCreatedAt' },
  { key: 'modified_date', label: 'web.Unit.lblUpdatedAt' },
  { key: 'code', label: 'web.common.lblAction' }
];
broadCastsColumns = [
  { key: 'code', label: 'web.common.lblID' },
  { key: 'subject', label: 'web.property.lblSubject' },
  { key: 'preview', label: 'web.property.lblPreview' },
  { key: 'status', label: 'web.common.lblStatus' },
  { key: 'broadcast_type_nm', label: 'web.property.lblBroadcastType' },
  { key: 'send_to', label: 'web.property.lblSendable' },
  { key: 'is_scheduled', label: 'web.property.lblScheduled' },
  { key: 'scheduled_date', label: 'web.common.lblDate' }
  
];
attachmentColumns = [
  { key: 'entity_code', label: 'web.common.lblID' },
  { key: 'document_type', label: 'web.property.lblFileType' },
  { key: 'doc_no', label: 'web.property.lblDocID' },
  { key: 'document_status', label: 'web.property.lblDocumentStatus' },
  { key: 'issue_date', label: 'web.property.lblIssueDate' },
  { key: 'expiry_date', label: 'web.property.lblExpiryDate' },
  { key: 'file_path', label: 'web.property.lblFiles' }
];

notesColumns = [
  { key: 'entity_code', label: 'web.common.lblID' },
  { key: 'subject', label: 'web.property.lblSubject' },
  { key: 'description', label: 'web.property.lblContent', isHtml: true },
  { key: 'status', label: 'web.property.lblVia' },
  { key: 'uploaded_date', label: 'web.property.lblNoteDate' },
  { key: 'uploaded_by', label: 'web.property.lblCreatedBy' }
  
];

parkingsColumns = [
  { key: 'code', label: 'web.common.lblID' },
  { key: 'parking_no', label: 'web.property.lblParkingNo' },
  { key: 'property', label: 'web.property.lblProperty' },
  { key: 'unit_code1', label: 'web.property.lblUnit' },
  { key: 'parking_type_nm', label: 'web.common.lblType' },
  { key: 'uploaded_by', label: 'web.property.lblFee' },
  { key: 'recurring_cycle_nm', label: 'web.property.lblCycle' },
  { key: 'remarks', label: 'web.common.lblRemarks' }
  
];

assetsColumns = [
  { key: 'code', label: 'web.common.lblID' },
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
    floor: ['', Validators.required]
  });
  this.attachmentsForm = this.fb.group({
    documentType: ['', Validators.required],
    documentNumber: ['', Validators.required],
    issueDate: ['', Validators.required],
    expiryDate: ['', Validators.required],
    issuingAuthority: ['', Validators.required],
    shareWithTenant: ['', Validators.required],
    shareWithLandlord: ['', Validators.required],
    propertyAttachment: [null, Validators.required]
  });
  this.notesForm = this.fb.group({
    subject: ['', Validators.required],
    commChannelType: ['', Validators.required],
    content: ['', Validators.required],
    propertyNotesFile:[null, Validators.required]
  });
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
  this.tenantsData = data.table11;
  this.parkingData = data.tenants_history;
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
      layout: 'table',
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
      layout: 'table',
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
      layout: 'table',
      columns: this.attachmentColumns,
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
      layout: 'table',
      columns: this.notesColumns,
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
      this.saveAttachment(this.attachmentsForm);
      break;

    case 'notes':
      this.saveNotes(this.notesForm);
      break;
  }

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
   floor_no:Number(values.floor),
   desc:'',
   code:''
};
this.portfolioService.saveCommonArea(payload).subscribe({
    next: () => {
        this.commonAreaForm.reset();
        this.detailLayout.closeModal();
    },
    error: console.error
});
}
saveAttachment(form:FormGroup){
  const attachmentLabels = {
    documentType: this.translate.instant('web.portfolio.popups.attachments.lblDocumentType'),
    propertyAttachment: this.translate.instant('web.portfolio.popups.attachments.lblUploadFile')
  };  
  if (!this.validateForm(this.attachmentsForm, attachmentLabels)) {
    return;
  }
  const values = form.value;
  const request = {
  ...this.commonPayload,
  id: 0,
  entity_id: this.propertyCode,
  entity:'property',
  document_type:values.documentType, 
  document_no:values.documentNumber,
    issue_date:values.issueDate,
    expiry_date:values.expiryDate,
    issuing_authority:values.issuingAuthority,
    share_with_tenants:values.shareWithTenant,
    share_with_landlords:false
  }
  const formData = new FormData();

// JSON goes as ONE field
formData.append('reqObject', JSON.stringify(request));
const file = this.attachmentsForm.get('propertyAttachment')?.value;

if (file) {
  formData.append('file_path', file);
}
  this.portfolioService.saveAttachment(formData)
    .subscribe(res => {
      this.commonAreaForm.reset();
      this.detailLayout.closeModal();
    });
}
saveNotes(form: FormGroup){
  const labels = {
  subject: this.translate.instant('web.portfolio.popups.notes.lblSubject'),
  commChannelType: this.translate.instant('web.portfolio.popups.notes.lblCommChannel'),
  content: this.translate.instant('web.portfolio.popups.notes.lblContent'),
  propertyNotesFile: this.translate.instant('web.portfolio.popups.notes.lblUploadFile')
  };
  if (!this.validateForm(this.notesForm, labels)) {
    return;
  }
  const values = form.value;
  const payload = {
   ...this.commonPayload,
   id:0,
    entity_id: this.propertyCode,
    entity:'property',
   subject:values.subject,
   channel_type:Number(values.commChannelType),
   desc:values.content,
   code:''
  }
  const formData = new FormData();

  formData.append('reqObject', JSON.stringify(payload));
  
  const file = this.notesForm.get('propertyNotesFile')?.value;

  if (file) {
    formData.append('file_path', file);
}
   this.portfolioService.saveNotes(formData)
    .subscribe(res => {
      this.notesForm.reset();
      this.detailLayout.closeModal();
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
