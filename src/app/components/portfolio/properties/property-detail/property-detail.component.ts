import { Component, OnInit, TemplateRef, ViewChild, Input } from '@angular/core';
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
import { CommonAreaPopupComponent } from '../../../child-tables/modal-popups/common-area-popup/common-area-popup.component';
import { AttachmentPopupComponent } from '../../../child-tables/modal-popups/attachments-popup/attachment-popup.component';
import { CommonService } from '../../../../services/common.service';
import { AuthPayload } from '../../../common/store/login-auth-params/auth.models';
import { ToastrService } from 'ngx-toastr';
import { UnitsTableComponent } from '../../../child-tables/units/units-table.component';
import { NotesComponent } from '../../../child-tables/notes/notes.component';
import { AttachmentsComponent } from '../../../child-tables/attachments/attachments.component';
import { CommonAreaComponent } from '../../../child-tables/commonarea/commonarea.component';
import { ParkingsComponent } from '../../../child-tables/parkings/parkings.component';
import {BroadcastsTableComponent}from '../../../child-tables/broadcasts/broadcasts.component';
@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, NgSelectModule, BroadcastsTableComponent,ReactiveFormsModule, ParkingsComponent, CommonAreaComponent, NotesComponent, AttachmentsComponent, UnitsTableComponent, FormsModule, CommonModule, DetailPageLayoutComponent, TranslateModule, CommonAreaPopupComponent, AttachmentPopupComponent],
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
  attachmentsData = [];
  broadCastsData = [];
  assetsData = [];
  notesData = [];
  parkingData = [];
  documentsData = [];
  @ViewChild(DetailPageLayoutComponent)
  detailLayout!: DetailPageLayoutComponent;
  // columns

  tenantColumns: any[] = [
    { key: 'lease_code', label: 'web.common.lblID', is_editCol: true },
    { key: 'tenant ', label: 'web.common.lblName' },
    { key: 'email_address', label: 'web.common.lblEmail' },
    { key: 'phone_number', label: 'web.common.lblPhoneNumber' },
    { key: 'company_name', label: 'web.property.lblCompany' },
    { key: 'active_lease', label: 'web.property.lblActiveLease' }
  ];
  broadCastsColumns: any[] = [];
 

  assetsColumns: any[] = [
    { key: 'code', label: 'web.common.lblID', is_editCol: true },
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
    private toastr: ToastrService,
    private translate: TranslateService) {

  }
  ngOnInit(): void {
    this.currentUser = this.commonService.getCurrentUser();
    this.route.paramMap.subscribe(params => {
      this.propertyCode = params.get('code') ?? '';
    });
    this.createForms();
    this.initializeTabs();
    this.loadMasterDataByType(13, 0, '', this.propertyCode, '');
  }
  private createForms(): void {
    this.commonAreaForm = this.fb.group({
      areaName: ['', Validators.required],
      floor: ['']
    });
  }
  toggleMoreDetails(): void {
    this.showMoreDetails = !this.showMoreDetails;
  }

  private loadMasterDataByType(
    typeId: number,
    filterId: number,
    target: '',
    filtertext: string = '',
    filterText1: string = '',
  ) {
    this.portfolioService.getMasterByType({
      typeId: typeId,
      filterId,
      filterText: filtertext,
      filterText1: filterText1
    }).subscribe({
      next: res => {
        this.loading = false;
        if (res['statusCode'] != "200") {
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
        label: 'web.common.lblOverview',
        layout: 'content'
      },

      {
        key: 'units',
        label: 'web.common.lblUnits',
        layout: 'content',
        data: this.unitsData,
        totalRecords: this.unitsData?.length || 0,
        loading: this.loading,
        hasActions: true,
        addButtonText: 'Unit'
      },

      {
        key: 'rooms',
        label: 'web.common.lblRooms',
        layout: 'content',
        data: this.roomsData,
        totalRecords: this.roomsData?.length || 0,
        loading: this.loading,
        hasActions: true,
        addButtonText: 'Room'
      },

      {
        key: 'tenants',
        label: 'web.common.lblTenantsHistory',
        layout: 'table',
        columns: this.tenantColumns,
        data: this.tenantsData,
        totalRecords: this.tenantsData?.length || 0,
        loading: this.loading,
        hasActions: true,
        addButtonText: 'Tenant',
        redirect_addurl: '/contacts/tenants/add-tenant'
      },
      {
        key: 'commonarea',
        label: 'web.common.lblCommonArea',
        layout: 'content',
        entity: "property",
        entity_id: this.propertyCode,
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
        label: 'web.common.lblAttachments',
        layout: 'content',
        entity: "property",
        entity_id: this.propertyCode,
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
        label: 'web.common.lblBroadcasts',
        layout: 'content',
        columns: this.broadCastsColumns,
        data: this.broadCastsData,
        totalRecords: this.broadCastsData?.length || 0,
        loading: this.loading,
        hasActions: true,
        addButtonText: 'Broadcasts',
        redirect_addurl: '/broadcasts/create'
      },
      {
        key: 'notes',
        label: 'web.common.lblNotes',
        layout: 'content',
        entity: "property",
        entity_id: this.propertyCode,
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
        label: 'web.common.lblParkings',
        layout: 'content',
        data: this.parkingData,
        entity_id: this.propertyCode,
        totalRecords: this.parkingData?.length || 0,
        loading: this.loading,
        hasActions: true,
        addButtonText: 'Parking'
      },
      {
        key: 'assets',
        label: 'web.common.lblAssets',
        layout: 'table',
        columns: this.assetsColumns,
        data: this.assetsData,
        totalRecords: this.assetsColumns?.length || 0,
        loading: this.loading,
        hasActions: true,
        addButtonText: 'Asset',
        redirect_addurl: '/facility/assets/create'
      }

    ];

  }

  savePopup(tab: string) {

  }
  get selectedTab(): DetailTab | undefined {
    const tab = this.tabs.find(t => t.key === this.activeTab);
    return tab;
  }
  handleSearch(searchstring: any) {
    const tab = this.tabs.find(t => t.key === this.activeTab);

  }
  handleEditNotification(selectedObject: any) {

  }

}
