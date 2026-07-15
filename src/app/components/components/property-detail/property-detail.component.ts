import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectCommonData } from '../../common/store/common-payload/common.selectors';
import { GetAllTypes } from '../../../shared/services/get-all-types.service';
import { DetailPageLayoutComponent } from '../../../shared/components/detail-page-layout/detail-page-layout.component';
import { DetailTab } from '../../../shared/models/detail-tab.model';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAreaPopupComponent } from '../popups/common-area-popup/common-area-popup.component';
import { AttachmentPopupComponent } from '../popups/attachments-popup/attachment-popup.component';
@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, NgSelectModule, ReactiveFormsModule, FormsModule, CommonModule, DetailPageLayoutComponent, TranslateModule, CommonAreaPopupComponent,AttachmentPopupComponent],
  templateUrl: './property-detail.component.html',
  styleUrl: './property-detail.component.scss'
})
export class PropertyDetailComponent implements OnInit {
  propertyAttachment: File[] = [];
  viewMode: 'list' | 'grid' = 'list';
  propertyId!: number;
  property: any = null;
  activeTab = 'overview';
  showMoreDetails: boolean = false;
  loading = false;
  paginatedProperties: any[] = [];
  commonAreaForm!: FormGroup;
  attachmentsForm!: FormGroup;
codeParam = '';
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
  { key: 'code', label: 'ID' },
  { key: 'unit_code', label: 'Name' },
  { key: 'category_name', label: 'Category' },
  { key: 'unit_beds_name', label: 'Beds' },
  { key: 'property Name', label: 'Property' },
  { key: 'landlord', label: 'Landlord' },
  { key: 'tags', label: 'Tags' },
  { key: 'unit_type_name', label: 'Unit Type' }
];

roomColumns = [
  { key: 'code', label: 'ID' },
  { key: 'room_type_name', label: 'Name' },
  { key: 'category_name', label: 'Category' },
  { key: 'beds', label: 'Beds' },
  { key: 'property Name', label: 'Property' },
  { key: 'name', label: 'Landlord' },
  { key: 'tags', label: 'Tags' },
  { key: 'unit_type_name', label: 'Unit Type' },
  { key: 'room_type_name', label: 'Room Type' }
];

tenantColumns = [
  { key: 'lease_code', label: 'ID' },
  { key: 'tenant ', label: 'Name' },
  { key: 'email_address', label: 'Email' },
  { key: 'phone_number', label: 'Phone Number' },
  { key: 'company_name', label: 'Company' },
  { key: 'active_lease', label: 'Active Lease' }
];
commonAreaColumns = [
  { key: 'code', label: 'ID' },
  { key: 'area_name', label: 'Area Name' },
  { key: 'property_code', label: 'Property ID' },
  { key: 'floor_no', label: 'Floor No' },
  { key: 'uploaded_date', label: 'Created at' },
  { key: 'modified_date', label: 'Updated at' },
  { key: 'code', label: 'Action' }
];
broadCastsColumns = [
  { key: 'code', label: 'ID' },
  { key: 'subject', label: 'Subject' },
  { key: 'preview', label: 'Preview' },
  { key: 'status', label: 'Status' },
  { key: 'broadcast_type_nm', label: 'Broadcast Type' },
  { key: 'send_to', label: 'Sendable' },
  { key: 'is_scheduled', label: 'Scheduled' },
  { key: 'scheduled_date', label: 'Date' }
  
];
attachmentColumns = [
  { key: 'entity_code', label: 'ID' },
  { key: 'document_type', label: 'File Type' },
  { key: 'doc_no', label: 'Doc ID' },
  { key: 'document_status', label: 'Document Status' },
  { key: 'issue_date', label: 'Issue Date' },
  { key: 'expiry_date', label: 'Expiry Date' },
  { key: 'file_path', label: 'Files' }
];

notesColumns = [
  { key: 'entity_code', label: 'ID' },
  { key: 'subject', label: 'Subject' },
  { key: 'description', label: 'Content' },
  { key: 'status', label: 'Via' },
  { key: 'uploaded_date', label: 'Note date' },
  { key: 'uploaded_by', label: 'Created By' }
  
];

parkingsColumns = [
  { key: 'code', label: 'ID' },
  { key: 'parking_no', label: 'Parking No' },
  { key: 'property', label: 'Property' },
  { key: 'unit_code1', label: 'Unit' },
  { key: 'parking_type_nm', label: 'Type' },
  { key: 'uploaded_by', label: 'Fee' },
  { key: 'recurring_cycle_nm', label: 'Cycle' },
  { key: 'remarks', label: 'Remarks' }
  
];

assetsColumns = [
  { key: 'code', label: 'ID' },
  { key: 'asset_name', label: 'Asset Name' },
  { key: 'model', label: 'Model' },
  { key: 'asset_category', label: 'Category' },
  { key: 'property_code', label: 'Property' },
  { key: 'unit_code', label: 'Unit' },
  { key: 'price', label: 'Price' }
];

  constructor(private route: ActivatedRoute, private store: Store,private propertiesService: GetAllTypes, private fb: FormBuilder) {}

  ngOnInit(): void {
    
    this.route.paramMap.subscribe(params => {
      this.codeParam = params.get('code') ?? '';
      
    });   
    this.commonAreaForm = this.fb.group({
      areaName: [''],
      floor: ['']
    });

    this.attachmentsForm = this.fb.group({
      documentType: [''],
      documentNumber: [''],
      issueDate: [''],
      expiryDate: [''],
      issuingAuthority: [''],
      shareWithTenant: [''],
      propertyAttachment: [null]


    });
    this.initializeTabs();   
    this.loadPropertyByCode(this.codeParam);


  }

  toggleMoreDetails(): void {
    this.showMoreDetails = !this.showMoreDetails;
  }
loadPropertyByCode(codeParam: any){
this.store.select(selectCommonData).subscribe(data => {
    this.commonData = data;
  });
  console.log(this.commonData);
const payload = {
  typeId:this.commonData.typeId,
  filterId: this.commonData.filterId,
  filterText: this.codeParam,
  filterText1: "0",
  userId: this.commonData.userId,
  clientId: this.commonData.clientId,
  companyId: this.commonData.companyId
};
 this.propertiesService.
 getPropertyByCode(payload).subscribe({
      next: (res) => {
        this.loading = false;
        if (res["statusCode"] == "200") {
           this.property = res.objResult.property[0];
           this.property.amenities = res.objResult.amenities;
           this.unitsData = res.objResult.units_info;
           this.roomsData = res.objResult.rooms_info;
           this.commonAreaData = res.objResult.common_area;
           this.broadCastsData = res.objResult.broadcasts;
           this.assetsData = res.objResult.assets;
           this.notesData = res.objResult.notes;
           this.attachmentsData = res.objResult.documents;
           this.tenantsData = res.objResult.table11;
           this.parkingData = res.objResult.tenants_history;
           this.initializeTabs();
          this.loading = false;
        }
      },
      error: (err) => {
        this.loading = false;
      },
    });
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
  }

}

saveCommonArea(form:FormGroup){
  const values = form.value;
  console.log("CA Form Values", values);
const payload = {
   userId: this.commonData.userId,
  clientId: this.commonData.clientId,
  company_id: this.commonData.companyId,
  source: "web",
  languageid: 1,
  id: 0,
  property_code: this.codeParam,
  area_name: values.areaName,
  floor_no: Number(values.floor),
  desc: "",
  code:""
}
this.propertiesService.saveCommonArea(payload)
    .subscribe(res => {

      console.log("attachments",res);

    });
}
saveAttachment(form:FormGroup){
   const values = form.value;
   console.log("values", values);
 const request = {
   userId: this.commonData.userId,
  clientId: this.commonData.clientId,
  company_id: this.commonData.companyId,
  source: "web",
  languageid: 1,
  id: 0,
  entity_id: this.codeParam,
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
  this.propertiesService.saveAttachment(formData)
    .subscribe(res => {

      console.log("attachments",res);
this.commonAreaForm.reset();

        // close popup
        this.detailLayout.closeModal();

      // close popup

      // refresh table

    });
}
}
