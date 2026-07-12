import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { Store } from '@ngrx/store';
import { selectCommonData } from '../../common/store/common-payload/common.selectors';
import { GetAllTypes } from '../../../shared/services/get-all-types.service';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, NgSelectModule, FormsModule, SharedTableComponent],
  templateUrl: './property-detail.component.html',
  styleUrl: './property-detail.component.scss'
})
export class PropertyDetailComponent implements OnInit {
  viewMode: 'list' | 'grid' = 'list';
  propertyId!: number;
  property: any = null;
  activeTab: string = 'overview';
  showMoreDetails: boolean = false;
  currentTableData: any[] = [];
  loading = false;
  pageNo = 1;
  pageSize = 50;
  totalRecords = 0;
  paginatedProperties: any[] = [];
codeParam = '';
commonData: any = [];
 tableColumns = [
  { key: 'id', label: 'ID', useTemplate: true },
  { key: 'name', label: 'Name', useTemplate: true },
  { key: 'category', label: 'Category', useTemplate: true },
  { key: 'beds', label: 'Beds', useTemplate: true },
  { key: 'property', label: 'Property', useTemplate: true },
  { key: 'landlord', label: 'Landlord', useTemplate: true },
  { key: 'tags', label: 'Tags', useTemplate: true },
  { key: 'unit_type', label: 'Unit Type', useTemplate: true }
];
  tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'units', label: 'Units' },
    { key: 'rooms', label: 'Rooms' },
    { key: 'tenants', label: 'Tenants History' },
    { key: 'common', label: 'Common Area' },
    { key: 'broadcasts', label: 'Broadcasts' },
    { key: 'attachments', label: 'Attachments' }
  ];
unitsData: any = [];
roomsData = [];
tenantsData = [];
commonAreaData = [];
broadcastsData = [];
attachmentsData = [];
broadCastsData = [];
assetsData = [];
notesData = [];
documentsData = [];
tenantsHistoryData = [];
  // Mock list for fallback loading
  mockProperties = [
    { id: 31658, name: 'Marina Heights Towers', type_name: 'Residential', occupied_units: 412, total_units: 421, landlord: 'Orville Real Estate' },
    { id: 31659, name: 'Jumeirah Living', type_name: 'Residential', occupied_units: 10, total_units: 12, landlord: 'Emaar Properties' },
    { id: 31660, name: 'Burj Khalifa Residences', type_name: 'Residential', occupied_units: 48, total_units: 50, landlord: 'Orville Real Estate' },
    { id: 31661, name: 'Index Tower', śtype_name: 'Commercial', occupied_units: 20, total_units: 25, landlord: 'DIFC Investments' },
    { id: 31662, name: 'Dubai Marina Mall', type_name: 'Commercial', occupied_units: 28, total_units: 30, landlord: 'Emaar Malls' }
  ];
 

  constructor(private route: ActivatedRoute, private store: Store,private propertiesService: GetAllTypes) {}

  ngOnInit(): void {
    
    this.route.paramMap.subscribe(params => {
      this.codeParam = params.get('code') ?? '';
      
    });
    this.activeTab = '';    
    this.loadPropertyByCode(this.codeParam);
    this.changeTab('overview');

  }

  toggleMoreDetails(): void {
    this.showMoreDetails = !this.showMoreDetails;
  }
  changeTab(tab: string) {

  this.activeTab = tab;

  switch(tab){

    case 'units':
      this.currentTableData = this.unitsData;
      break;

    case 'rooms':
      this.currentTableData = this.roomsData;
      break;

    case 'tenants':
      this.currentTableData = this.tenantsData;
      break;

    case 'common':
      this.currentTableData = this.commonAreaData;
      break;

    case 'broadcasts':
      this.currentTableData = this.broadcastsData;
      break;

    case 'attachments':
      this.currentTableData = this.attachmentsData;
      break;

    default:
      this.currentTableData = [];
  }

  this.totalRecords = this.currentTableData.length;
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
           this.documentsData = res.objResult.documents;
           this.tenantsHistoryData = res.objResult.tenants_history;
           
           console.log("amenities..",this.property.amenities);
          this.loading = false;
        }
      },
      error: (err) => {
        this.loading = false;
      },
    });
}
}
