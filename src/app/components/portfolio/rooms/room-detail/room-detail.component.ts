import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormGroup, FormsModule } from '@angular/forms';
import { PropertiesService } from '../../services/properties.service';
import { PortfolioService } from '../../services/portfolio.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonService } from '../../../../services/common.service';
import { AuthPayload } from '../../../common/store/login-auth-params/auth.models';
import { DetailTab } from '../../../../shared/models/detail-tab.model';
import { AttachmentsComponent } from '../../../child-tables/attachments/attachments.component';
import { NotesComponent } from '../../../child-tables/notes/notes.component';
import { ParkingsComponent } from '../../../child-tables/parkings/parkings.component';
import { InventoryItemComponent } from '../../../child-tables/inventoryitem/inventoryitem.component';
export interface Room {
  id: number;
  name: string;
  code: string;
  category: 'Residential' | 'Commercial';
  beds: string;
  baths: string;
  area: string;
  floor: string;
  property: string;property_code: string;
  unit: string;
  location: string;
  landlord: string;
  tags: string;
  roomType: string;
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
}

import { ReusableModalComponent } from '../../reusable-modal/reusable-modal.component';
import { FilterDrawerComponent } from '../../../../shared/components/filter-drawer/filter-drawer.component';

@Component({
  selector: 'app-room-detail',
  standalone: true,
  imports: [CommonModule,NotesComponent,InventoryItemComponent,ParkingsComponent,AttachmentsComponent, RouterModule, NgSelectModule, FormsModule, TranslateModule, ReusableModalComponent, FilterDrawerComponent],
  templateUrl: './room-detail.component.html',
  styleUrl: './room-detail.component.scss'
})
export class RoomDetailComponent implements OnInit {
  roomId!: string;
  unit: Room | null = null;
  activeTab: string = 'overview';
  showMoreDetails: boolean = false;
  showAddInvoiceModal: boolean = false;
  showAddInventoryModal: boolean = false;
  commonAreaForm!: FormGroup;
  attachmentsForm!: FormGroup;
  notesForm!: FormGroup;
  isColumnDropdownOpen: boolean = false;
  isDrawerOpen: boolean = false;
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
  allUnits: Room[] = [];
  loading:boolean=false;
  tabs: any[] = [];
  mode: 'property' | 'unit' | 'room' | 'parking' = 'unit';
  item: any = null;
  currentUser: AuthPayload | null = null;
  inventoryItemName: string = '';
  inventoryItemLocation: string = '';
  inventoryItemQty: number = 1;
  inventoryItemExpiry: string = '';
  inventoryFiles: File[] = [];

  constructor(private route: ActivatedRoute,  private commonService: CommonService, private propertiesService: PropertiesService, private portfolioService: PortfolioService) {}

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
          this.roomId = idParam
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
      typeId: 15,
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
          detail = response.objResult.room[0];
          if (detail) {
            this.unit = {
              id: detail.code || detail.id || this.roomId,
              name: detail.room_no || detail.name || this.unit?.name || 'Apartment 209',
              code:detail.code,
              category: detail.category_name ||  'Residential',
              beds: detail.beds || this.unit?.beds || '1 Bed',
              baths: detail.baths || this.unit?.baths || '1 Bath',
              area: detail.area || this.unit?.area || '1200 Sqft',
              floor: detail.floor_no || detail.floor || this.unit?.floor || '1 Floor',
              property: detail.property_Name || 'Marina Height Towers',
              property_code: detail.property_code || 'Marina Height Towers', 
              unit: detail.unitcode + ' - ' + detail.unit_no || 'Marina Height Towers',
              location: detail.location || this.unit?.location || 'Dubai Marina, Tower A, Dubai',
              landlord: detail.landlord_codes || detail.landlord || this.unit?.landlord || 'Orville Real Estate',
              tags: detail.tags || this.unit?.tags || 'Premium',
              roomType: detail.room_type_name || detail.room_type || this.unit?.roomType || 'Apartment',
              managementFee: detail.management_fee ? this.currentUser?.currencyCode+` ${detail.management_fee}` : this.unit?.managementFee || 'AED 600',
              status: detail.room_status_name || detail.room_status || detail.status || this.unit?.status || 'Occupied',
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
              reraNumber: detail.rera_number || '-'
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
          const woList = response.objResult.workorders || [];
          this.workOrders = woList.map((wo: any) => ({
            id: wo.id,
            code: wo.code || '',
            title: wo.title || '',
            status: wo.status_nm || wo.status || 'Open',
            closingStatus: wo.closingStatus || wo.closing_status || 'Pending',
            internalStatus: wo.internalStatus || wo.internal_status || 'Assigned',
            dueDate: wo.due_date || wo.dueDate || '',
            priority: wo.priority || '',
            property: wo.property || '',
            vendor: wo.vendor_name || wo.vendor || '',
            user: wo.user_name || wo.user || '',
            tags: wo.tags || '',
            maintenanceCategory: wo.maintenance_name || wo.maintenance_category || wo.maintenanceCategory || '',
            responsiblePersons: wo.responsible_persons || wo.responsiblePersons || '',
            updatedAt: wo.modified_date || wo.updated_at || wo.updatedAt || '',
            createdAt: wo.created_date || wo.created_at || wo.createdAt || ''
          }));
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
        addButtonText: 'Unit'
      },
  
      {
        key: 'inventory',
        label: 'web.common.lblInventory',
        layout: 'content', 
        entity:"Unit_Rooms",
        entity_id:this.roomId,
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
        addButtonText: 'Room'
      },
  
      {
        key: 'attachments',
        label: 'web.common.lblAttachments',
        layout: 'content', 
        entity:"Unit_Rooms",
        entity_id:this.roomId,
        data: this.unitAttachments,
        totalRecords: this.unitAttachments?.length || 0,
        loading: this.loading,
        hasActions: true,
        addButtonText: 'Attachments',
        form: this.attachmentsForm,
        popupType: 'attachment'      
      },
      {
        key: 'Legal',
        label: 'web.common.lblLegal',
        layout: 'content', 
        entity:"Unit_Rooms",
        entity_id:this.roomId,
        data: this.legalCases,
        totalRecords: this.legalCases?.length || 0,
        loading: this.loading,
        hasActions: true,
        addButtonText: 'Common Area',
        form: FormGroup,
        popupType: 'legal'
      },
      {
        key: 'parkings',
        label: 'web.common.lblParkings',
        layout: 'content', 
        data: this.parkings,
        entity:"Unit_Rooms",
        entity_id:this.unit?.property_code,
        filter_code:this.roomId,
        totalRecords: this.parkings?.length || 0,
        loading: this.loading,
        hasActions: true,
        addButtonText: 'Parking'
      },
      {
        key: 'notes',
        label: 'web.common.lblNotes',
        layout: 'content', 
        entity:"Unit_Rooms",
        entity_id:this.roomId,
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
        addButtonText: 'Asset'
      }
  
    ];
  }

  get unitNo(): string {
    if (this.unit && this.unit.name) {
      const parts = this.unit.name.split(' ');
      return parts[1] || '209';
    }
    return '209';
  }

  toggleMoreDetails(): void {
    this.showMoreDetails = !this.showMoreDetails;
  }

  toggleDrawer(state: boolean): void {
    this.isDrawerOpen = state;
  }

  onInventoryFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.inventoryFiles.push(event.target.files[i]);
      }
    }
  }

  saveInventoryItem() {
    const formData = new FormData();
    formData.append('userid', (this.currentUser?.userId || 1).toString());
    formData.append('company_id', (this.currentUser?.companyId || 1).toString());
    formData.append('clientId', this.currentUser?.clientId || '74BB6922');
    formData.append('source', 'web');
    formData.append('languageid', '1');
    formData.append('code', '');
    formData.append('entity', 'Units');
    formData.append('entity_id', this.roomId);
    formData.append('item_name', this.inventoryItemName || '');
    formData.append('location', this.inventoryItemLocation || '');
    formData.append('expiry_date', this.inventoryItemExpiry ? new Date(this.inventoryItemExpiry).toISOString() : '');
    formData.append('qty', (this.inventoryItemQty || 0).toString());

    if (this.inventoryFiles && this.inventoryFiles.length > 0) {
      this.inventoryFiles.forEach((file: File) => {
        formData.append('file_paths', file);
      });
    }

    this.portfolioService.saveInventoryItem(formData).subscribe({
      next: (res: any) => {
        if (res.statusCode === 200) {
          this.showAddInventoryModal = false;
          this.inventoryItemName = '';
          this.inventoryItemLocation = '';
          this.inventoryItemQty = 1;
          this.inventoryItemExpiry = '';
          this.inventoryFiles = [];
          this.fetchDetails(this.roomId);
        } else {
          console.error('Failed to save inventory item:', res);
        }
      },
      error: (err) => {
        console.error('Error saving inventory item:', err);
      }
    });
  }
}
