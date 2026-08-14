import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormGroup, FormsModule } from '@angular/forms';
import { PropertiesService } from '../../services/properties.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonService } from '../../../../services/common.service';
import { AuthPayload } from '../../../common/store/login-auth-params/auth.models';
import { DetailTab } from '../../../../shared/models/detail-tab.model';
import { AttachmentsComponent } from '../../../child-tables/attachments/attachments.component'; 
import {InventoryItemComponent} from '../../../child-tables/inventoryitem/inventoryitem.component'; 
import { NotesComponent } from '../../../child-tables/notes/notes.component';
import { ParkingsComponent } from '../../../child-tables/parkings/parkings.component';
import { OvPaginatorComponent } from '../../../../shared/components/ov-paginator/ov-paginator.component';  
export interface Unit {
  id: number;
  name: string;
  code: string;
  category: 'Residential' | 'Commercial';
  beds: string;
  baths: string;
  area: string;
  floor: string;
  property: string; 
  property_code: string; 
  location: string;
  landlord: string;
  tags: string;
  unitType: string;
  managementFee: string;
  status: 'Occupied' | 'Vacant' | 'Maintenance';
  addedDate: string;
  imageUrl: string;
  rentStatus: 'For Rent' | 'For Sale';
  furnished?: boolean;
  smoking?: boolean;
  saleStatus?: boolean;
  underDispute?: boolean;
  propertyAddress?: string;
  createdDate?: string;
  lastUpdate?: string;
  isVerified?: boolean;
  marketRent?: string;
  deposit?: string;
  rentType?: string;
  rentPerSqft?: string;
  totalServiceCharges?: string;
  serviceCharges?: string;
  salePrice?: string;
  thresholdValue?: string;
  managementFeeType?: string;
  serviceDisabled?: boolean;
  trakessiNumber?: string;
  reraNumber?: string;
  createdBy?: string;
  parkingCount?: string | number;
  autoAssign?: boolean;
  hasElectricity?: boolean;
  hasGas?: boolean;
  alertMessage?: string;
  marketingTitle?: string;
  marketingDescription?: string;
  unitDetailsText?: string;
  amenities?: any[];
}

import { ReusableModalComponent } from '../../reusable-modal/reusable-modal.component';
import { FilterDrawerComponent } from '../../../../shared/components/filter-drawer/filter-drawer.component';
import { DetailPageLayoutComponent } from '../../detail-page-layout/detail-page-layout.component';

@Component({
  selector: 'app-unit-detail',
  standalone: true,
  imports: [CommonModule,NotesComponent,ParkingsComponent,AttachmentsComponent,InventoryItemComponent, RouterModule, NgSelectModule, FormsModule, TranslateModule, OvPaginatorComponent, ReusableModalComponent, FilterDrawerComponent, DetailPageLayoutComponent],
  templateUrl: './unit-detail.component.html',
  styleUrl: './unit-detail.component.scss'
})
export class UnitDetailComponent implements OnInit {
  unitId!: string;
  unit: Unit | null = null;
  activeTab: string = 'overview';
  showMoreDetails: boolean = true;
  showActionMenu = false;
  showAddInvoiceModal: boolean = false;
  isDrawerOpen: boolean = false;
  isColumnDropdownOpen: boolean = false;
  tabSearchQuery = '';
  defaultAmenities = [
    'Kids Play Area',
    'BBQ Deck',
    'Concierge',
    'Covered Parking',
    'High-Speed Wi-Fi',
    'Swimming Pool',
    'Fully Equipped Gym',
    '24/7 Security'
  ];
  chartTicks = ['40 M', '30 M', '20 M', '10 M', '0'];
  monthBars = [
    { m: 'Jan', h: 23, empty: false },
    { m: 'Feb', h: 30, empty: false },
    { m: 'Mar', h: 88, empty: false },
    { m: 'Apr', h: 53, empty: false },
    { m: 'May', h: 47, empty: false },
    { m: 'Jun', h: 197, empty: false },
    { m: 'Jul', h: 246, empty: false },
    { m: 'Aug', h: 269, empty: true },
    { m: 'Sep', h: 269, empty: true },
    { m: 'Oct', h: 269, empty: true },
    { m: 'Nov', h: 269, empty: true },
    { m: 'Dec', h: 269, empty: true }
  ];
  commonAreaForm!: FormGroup;
  attachmentsForm!: FormGroup;
  notesForm!: FormGroup;
  inpectionsColumns = [
    { key: 'lease_code', label: 'web.common.lblID',is_editCol:true},
    { key: 'tenant ', label: 'web.common.lblName' },
    { key: 'email_address', label: 'web.common.lblEmail' },
    { key: 'phone_number', label: 'web.common.lblPhoneNumber' },
    { key: 'company_name', label: 'web.property.lblCompany' },
    { key: 'active_lease', label: 'web.property.lblActiveLease' }
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
  leases: any[] = [];
  financials: any[] = [];
  workOrders: any[] = [];
  inventoryItems: any[] = [];
  unitAttachments: any[] = [];
  legalCases: any[] = [];
  parkings: any[] = [];
  notes: any[] = [];
  broadcasts: any[] = [];
  inspections: any[] = [];
  allUnits: Unit[] = [];
  loading:boolean=false;
  tabs: any[] = [];
  mode: 'property' | 'unit' | 'room' | 'parking' = 'unit';
  item: any = null;
  currentUser: AuthPayload | null = null;
  constructor(private route: ActivatedRoute,  private commonService: CommonService, private propertiesService: PropertiesService) {}

  ngOnInit(): void {
    this.currentUser = this.commonService.getCurrentUser();
    this.route.url.subscribe(urlSegments => {
      const path = urlSegments[0]?.path;
      if (path === 'properties') {
        this.mode = 'property';
      } else if (path === 'units') {
        this.mode = 'unit';
      } else if (path === 'rooms') {
        this.mode = 'room';
      } else if (path === 'parkings') {
        this.mode = 'parking';
      }

      this.route.paramMap.subscribe(params => {
        const idParam = params.get('id');
        if (idParam) {
          this.unitId = idParam
          this.fetchDetails(idParam); 
        }
      });
    });
  }
  get selectedTab(): DetailTab | undefined {
    const tab = this.tabs.find(t => t.key === this.activeTab);
    return tab;
  }
  fetchDetails(rawId: string): void {
    const payload = {
      typeId: 14,
      filterId: 0,
      filterText: rawId,
      filterText1: "",
      userid: this.currentUser?.userId,
      company_id: this.currentUser?.companyId,
      clientId: this.currentUser?.clientId,
    };

    this.propertiesService.getMasterDetails(payload).subscribe({
      next: (response: any) => {
        if (response && response.statusCode === "200" && response.objResult) {
          let detail = null;
          detail = response.objResult.unit[0];
          if (detail) {
            this.unit = {
              id: detail.code || detail.id || this.unitId,
              name: detail.unit_no || detail.name || this.unit?.name || 'Apartment 209',
              code:detail.code,
              category: detail.category_name ||  'Residential',
              beds: detail.beds || this.unit?.beds || '1 Bed',
              baths: detail.baths || this.unit?.baths || '1 Bath',
              area: detail.area || this.unit?.area || '1200 Sqft',
              floor: detail.floor_no || detail.floor || this.unit?.floor || '1 Floor',
              property: detail.property_Name || 'Marina Height Towers',   
              property_code: detail.property_code || 'Marina Height Towers', 
              location: detail.location || this.unit?.location || 'Dubai Marina, Tower A, Dubai',
              landlord: detail.landlord_codes || detail.landlord || this.unit?.landlord || 'Orville Real Estate',
              tags: detail.tags || this.unit?.tags || 'Premium',
              unitType: detail.unit_type_name || detail.unit_type || this.unit?.unitType || 'Apartment',
              managementFee: detail.management_fee ? this.currentUser?.currencyCode+` ${detail.management_fee}` : this.unit?.managementFee || 'AED 600',
              status: detail.unit_status_name || detail.unit_status || detail.status || this.unit?.status || 'Occupied',
              addedDate: detail.created || this.unit?.addedDate || 'May 26, 2026',
              imageUrl: detail.unit_image || this.unit?.imageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=60',
              rentStatus: detail.rent_type || this.unit?.rentStatus || 'For Rent',
              furnished: detail.is_furnished || false,
              smoking: detail.is_smoking_allowed || false,
              saleStatus: detail.sale_status || false,
              underDispute: (response.objResult.legal_cases && response.objResult.legal_cases.length > 0),
              propertyAddress: detail.address_1 || 'Dubai Marina, Tower A, Dubai',
              createdDate: detail.created_date ? new Date(detail.created_date).toLocaleDateString() : '07-22-2025',
              lastUpdate: detail.modified_date ? new Date(detail.modified_date).toLocaleDateString() : (detail.created_date ? new Date(detail.created_date).toLocaleDateString() : '23-06-2026'),
              isVerified: detail.is_it_verified || false,
              marketRent: detail.market_rent ? this.currentUser?.currencyCode+` ${detail.market_rent}` : 'AED 36500.0',
              deposit: detail.rent_deposit ? this.currentUser?.currencyCode+` ${detail.rent_deposit}` : 'AED 3000.0',
              rentType: detail.rent_type_name || (detail.rent_type === 50 ? 'Per Year' : 'Per Year'),
              rentPerSqft: detail.rent_per_area ? this.currentUser?.currencyCode+` ${detail.rent_per_area}` : 'AED 250.00',
              totalServiceCharges: detail.total_service_charges ? this.currentUser?.currencyCode+` ${detail.total_service_charges}` : '0.00',
              serviceCharges: detail.service_charge_per_area ? this.currentUser?.currencyCode+` ${detail.service_charge_per_area}` : '0.00',
              salePrice: detail.market_value ? this.currentUser?.currencyCode+` ${detail.market_value}` : '-',
              thresholdValue: detail.threshold_value ? this.currentUser?.currencyCode+` ${detail.threshold_value}` : '-',
              managementFeeType: detail.management_fee_type || 'Percentage',
              serviceDisabled: detail.disable_maintainence || false,
              trakessiNumber: detail.trakessi_number || '-',
              reraNumber: detail.rera_number || '-',
              createdBy: detail.created_by_name || detail.created_by || detail.created_user || '-',
              parkingCount: detail.parking_no || detail.parking_count || detail.parking || '',
              autoAssign: !!detail.auto_assign,
              hasElectricity: !!(detail.electricity_no || detail.has_electricity || detail.is_electricity),
              hasGas: !!(detail.gas_no || detail.has_gas || detail.is_gas),
              alertMessage: detail.alert_message || '-',
              marketingTitle: detail.marketing_title || '-',
              marketingDescription: detail.marketing_description || '-',
              unitDetailsText: detail.unit_details || detail.description || '-',
              amenities: detail.amenities || []
            };
            this.item = this.unit;
          }
          this.unitAttachments = response.objResult.documents|| [];   
          this.broadcasts = response.objResult.broadcasts;
          this.financials = response.objResult.financials || [];
          this.notes = response.objResult.notes;
          this.inventoryItems = response.objResult.inventory;
          this.legalCases = response.objResult.legal_cases;
          this.parkings = response.objResult.parking;
          this.inspections = response.objResult.inspections;
          this.workOrders = response.objResult.workorders;
          this.initModeData();  
        }
      },
      error: err => {
        console.error(err);
      }
    });
  }
  handleChildNotification(ev:any){
    if(ev.action_name=="edit")
      window.location.href='/edit-unit/'+ev.code;
    else if (ev.action_name=="delete")
    {
      //this.deleteUnit(36, ev.code,'');
    }
  }
  initModeData(): void {
    this.tabs = [

      // { key: 'financials', label: 'web.Unit.lblFinancials' },
      // { key: 'inventory', label: 'web.Unit.lblInventory' },
      // { key: 'workorders', label: 'web.Unit.lblWorkOrders' },
      // { key: 'attachments', label: 'web.Unit.lblAttachments' },
      // { key: 'legal', label: 'web.Unit.lblLegal' },
      // { key: 'parkings', label: 'web.Unit.lblParkings' },
      // { key: 'notes', label: 'web.Unit.lblNotes' },
      // { key: 'broadcasts', label: 'web.Unit.lblBroadcasts' },
      // { key: 'inspections', label: 'web.Unit.lblInspections' }

      {
        key: 'overview',
        label: 'web.common.lblOverview',
        layout: 'content'
      },
  
      {
        key: 'financials',
        label: 'web.common.lblFinancials',
        layout: 'content', 
        data: this.financials,
        totalRecords: this.financials?.length || 0,
        loading: this.loading,
        hasActions: true,
        addButtonText: 'Financials'
      },
      {
        key: 'inventory',
        label: 'web.common.lblInventory',
        layout: 'content', 
        entity:"Units",
        entity_id:this.unitId,
        data: this.inventoryItems,
        totalRecords: this.inventoryItems?.length || 0,
        loading: this.loading,
        hasActions: true,
        addButtonText: 'Inventory'
      },
      {
        key: 'workorders',
        label: 'web.common.lblWorkOrders',
        layout: 'content', 
        data: this.workOrders,
        totalRecords: this.workOrders?.length || 0,
        loading: this.loading,
        hasActions: true,
        addButtonText: 'Work Order'
      },
      {
        key: 'attachments',
        label: 'web.common.lblAttachments',
        layout: 'content', 
        entity:"Units",
        entity_id:this.unitId,
        data: this.unitAttachments,
        totalRecords: this.unitAttachments?.length || 0,
        loading: this.loading,
        hasActions: true,
        addButtonText: 'Attachments',
        form: this.attachmentsForm,
        popupType: 'attachment'      
      },
      {
        key: 'legal',
        label: 'web.common.lblLegal',
        layout: 'content', 
        entity:"Units",
        entity_id:this.unitId,
        data: this.legalCases,
        totalRecords: this.legalCases?.length || 0,
        loading: this.loading,
        hasActions: true,
        addButtonText: 'Legal Case',
        form: FormGroup,
        popupType: 'legal'
      },
      {
        key: 'parkings',
        label: 'web.common.lblParkings',
        layout: 'content', 
        data: this.parkings,
        entity:"Units",
        entity_id:this.unit?.property_code,
        filter_code:this.unitId,
        totalRecords: this.parkings?.length || 0,
        loading: this.loading,
        hasActions: true,
        addButtonText: 'Parking'
      },
      {
        key: 'notes',
        label: 'web.common.lblNotes',
        layout: 'content', 
        entity:"Units",
        entity_id:this.unitId,
        data: this.notes,
        totalRecords: this.notes?.length || 0,
        loading: this.loading,
        hasActions: true,
        addButtonText: 'Notes',
        form: this.notesForm,
        popupType: 'notes'
      },
      {
        key: 'broadcasts',
        label: 'web.common.lblBroadcasts',
        layout: 'content',
        columns: this.broadCastsColumns,
        data: this.broadcasts,
        totalRecords: this.broadcasts?.length || 0,
        loading: this.loading,
        hasActions: true,
        addButtonText: 'Broadcasts'
      },
      {
        key: 'inspections',
        label: 'web.common.lblInspections',
        layout: 'content',
        columns: this.inpectionsColumns,
        data: this.inspections,
        totalRecords: this.inpectionsColumns?.length || 0,
        loading: this.loading,
        hasActions: true,
        addButtonText: 'Inspection'
      }
  
    ];
  }

  get unitNo(): string {
    if (this.unit && this.unit.name) {
      const parts = this.unit.name.split(' ');
      return parts[1] || this.unit.name;
    }
    return '-';
  }

  get landlordCount(): number {
    return this.unit?.landlord ? 1 : 0;
  }

  get parkingDisplay(): string {
    if (this.unit?.parkingCount) {
      return String(this.unit.parkingCount);
    }
    return this.parkings?.length ? String(this.parkings.length) : '-';
  }

  get displayAmenities(): string[] {
    const fromApi = (this.unit?.amenities || [])
      .map((item: any) => (typeof item === 'string' ? item : item?.amenity || item?.name || ''))
      .filter((name: string) => !!name);
    return fromApi.length ? fromApi : this.defaultAmenities;
  }

  toggleDrawer(state: boolean): void {
    this.isDrawerOpen = state;
  }

  toggleMoreDetails(): void {
    this.showMoreDetails = !this.showMoreDetails;
  }

  toggleColumnDropdown(): void {
    this.isColumnDropdownOpen = !this.isColumnDropdownOpen;
  }
}
