import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectCommonData } from '../../common/store/common-payload/common.selectors';
import { GetAllTypes } from '../../../shared/services/get-all-types.service';
import { DetailPageLayoutComponent } from '../../../shared/components/detail-page-layout/detail-page-layout.component';
import { DetailTab } from '../../../shared/models/detail-tab.model';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, NgSelectModule, FormsModule, DetailPageLayoutComponent],
  templateUrl: './property-detail.component.html',
  styleUrl: './property-detail.component.scss'
})
export class PropertyDetailComponent implements OnInit {
  viewMode: 'list' | 'grid' = 'list';
  propertyId!: number;
  property: any = null;
  activeTab = 'overview';
  showMoreDetails: boolean = false;
  loading = false;
  paginatedProperties: any[] = [];
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
  // Mock list for fallback loading
  unitColumns = [
  { key: 'code', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'category_name', label: 'Category' },
  { key: 'beds', label: 'Beds' },
  { key: 'property Name', label: 'Property' },
  { key: 'name', label: 'Landlord' },
  { key: 'tags', label: 'Tags' },
  { key: 'unit_type_name', label: 'Unit Type' }
];

roomColumns = [
  { key: 'code', label: 'ID' },
  { key: 'property Name', label: 'Name' },
  { key: 'category_name', label: 'Category' },
  { key: 'beds', label: 'Beds' },
  { key: 'property Name', label: 'Property' },
  { key: 'name', label: 'Landlord' },
  { key: 'tags', label: 'Tags' },
  { key: 'room_type_name', label: 'Unit Type' }
];

tenantColumns = [
  { key: 'code', label: 'Tenant' },
  { key: 'property', label: 'Name' },
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
  { key: 'uploaded_by', label: 'Created' }
  
];

parkingsColumns = [
  { key: 'code', label: 'ID' },
  { key: 'parking_no', label: 'Parking No' },
  { key: 'property_code', label: 'Property' },
  { key: 'unit_code', label: 'Unit' },
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

  constructor(private route: ActivatedRoute, private store: Store,private propertiesService: GetAllTypes) {}

  ngOnInit(): void {
    
    this.route.paramMap.subscribe(params => {
      this.codeParam = params.get('code') ?? '';
      
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
           this.commonAreaData = res.objResult.rooms_info;
           this.broadCastsData = res.objResult.broadcasts;
           this.assetsData = res.objResult.assets;
           this.notesData = res.objResult.notes;
           this.attachmentsData = res.objResult.documents;
           this.tenantsData = res.objResult.table11;
           this.parkingData = res.objResult.tenants_history;
           this.initializeTabs();
           console.log("amenities..",this.property.amenities);
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
      hasActions: true
    },

    {
      key: 'rooms',
      label: 'Rooms',
      layout: 'table',
      columns: this.roomColumns,
      data: this.roomsData,
      totalRecords: this.roomsData?.length || 0,
      loading: this.loading,
      hasActions: true
    },

    {
      key: 'tenants',
      label: 'Tenants History',
      layout: 'table',
      columns: this.tenantColumns,
      data: this.tenantsData,
      totalRecords: this.tenantsData?.length || 0,
      loading: this.loading,
      hasActions: true
    },
{
      key: 'commonarea',
      label: 'Common Area',
      layout: 'table',
      columns: this.commonAreaColumns,
      data: this.commonAreaData,
      totalRecords: this.documentsData?.length || 0,
      loading: this.loading,
      hasActions: true
    },
    {
      key: 'attachments',
      label: 'Attachments',
      layout: 'table',
      columns: this.attachmentColumns,
      data: this.attachmentsData,
      totalRecords: this.attachmentsData?.length || 0,
      loading: this.loading,
      hasActions: true
    },
    {
      key: 'broadcasts',
      label: 'Broadcasts',
      layout: 'table',
      columns: this.broadCastsColumns,
      data: this.broadCastsData,
      totalRecords: this.broadCastsData?.length || 0,
      loading: this.loading,
      hasActions: true
    },
    {
      key: 'notes',
      label: 'Notes',
      layout: 'table',
      columns: this.notesColumns,
      data: this.notesData,
      totalRecords: this.notesData?.length || 0,
      loading: this.loading,
      hasActions: true
    },
    {
      key: 'parkings',
      label: 'Parkings',
      layout: 'table',
      columns: this.parkingsColumns,
      data: this.parkingData,
      totalRecords: this.parkingData?.length || 0,
      loading: this.loading,
      hasActions: true
    },
    {
      key: 'assets',
      label: 'Assets',
      layout: 'table',
      columns: this.assetsColumns,
      data: this.assetsData,
      totalRecords: this.assetsColumns?.length || 0,
      loading: this.loading,
      hasActions: true
    }

  ];

}
}
