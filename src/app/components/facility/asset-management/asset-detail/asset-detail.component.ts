import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { PropertiesService } from '../../../portfolio/services/properties.service';
import { CommonService } from '../../../../services/common.service';
import { WorkordersTableComponent }from '../../../child-tables/workorders/workorders.component';
export interface Part {
  id: string;
  partName: string;
  partNumber: string;
  category: string;
  subcategory: string;
  unit: string;
  cost: string;
}

export interface WorkOrder {
  id: string;
  workOrder: string;
  property: string;
  unit: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Pending' | 'Closed';
  vendor: string;
}

export interface Attachment {
  id: string;
  fileName: string;
  docId: string;
  documentStatus: 'Active' | 'Verified' | 'Expired';
  issueDate: string;
  expiryDate: string;
  files: string;
}

import { AttachmentsComponent } from '../../../child-tables/attachments/attachments.component';

@Component({
  selector: 'app-asset-detail',
  standalone: true,
  imports: [CommonModule, SharedTableComponent,WorkordersTableComponent, AttachmentsComponent],
  templateUrl: './asset-detail.component.html',
  styleUrl: './asset-detail.component.scss'
})
export class AssetDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private propertiesService = inject(PropertiesService);
  private commonService = inject(CommonService);

  assetId: string = '';
  activeTab: string = 'Overview';
  tabs: string[] = ['Overview', 'Part', 'Work Orders', 'Financials', 'Attachments'];
  attachmentsForm: any = {};
  workorderForm: any = {};

  tabsList: any[] = [];

  initializeTabs() {
    this.tabsList = [
      {
        key: 'Attachments',
        label: 'Attachments',
        entity: 'assets',
        entity_id: this.assetId,
        data: this.attachments || [],
        totalRecords: (this.attachments || []).length,
        loading: false,
        hasActions: true,
        addButtonText: 'Attachments',
        form: this.attachmentsForm,
        popupType: 'attachment'
      },
      {
        key: 'Workorders',
        label: 'WorkOrders',
        entity: 'assets',
        entity_id: this.assetId,
        data: this.workOrders || [],
        totalRecords: (this.workOrders || []).length,
        loading: false,
        hasActions: true,
        addButtonText: 'Work Order',
        form: this.workorderForm,
        popupType: 'workorder'
      }
    ];
  }

  get selectedTab(): any {
    return this.tabsList.find(t => t.key === this.activeTab);
  }

  assetData = {
    id: '-',
    name: '-',
    model: '-',
    manufacturer: '-',
    category: '-',
    subcategory: '-',
    capacity: '-',
    color: '-',
    assetCode: '-',
    barcode: '-',
    area: '-',
    location: '-',
    description: '-',
    status: '-',
    installationDate: '-',
    warrantyStatus: false,
    warrantyStatusLabel: '-',
    property: '-',
    unit: '-',
    partsIncluded: '-',
    purchaseDate: '-',
    created: '-',
    lastUpdated: '-',
    purchaseOrderNo: '-',
    price: '-',
    vendor: '-',
    warrantyProvider: '-',
    warrantyDuration: '-',
    warrantyStartDate: '-',
    warrantyEndDate: '-',
    warrantyResponsibility: '-',
    warrantyDaysRemaining: 0
  };

  parts: Part[] = [];

  workOrders: any = [];

  attachments: any[] = [];

  partColumns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true },
    { key: 'partName', label: 'Item Name', visible: true },
    { key: 'partNumber', label: 'Part Number', visible: true },
    { key: 'category', label: 'Category', visible: true },
    { key: 'subcategory', label: 'Subcategory', visible: true },
    { key: 'cost', label: 'Cost', visible: true },
    { key: 'threshold', label: 'Threshold', visible: true },
    { key: 'stockType', label: 'Stock Type', visible: true },
    { key: 'placedDate', label: 'Placed Date', visible: true },
    { key: 'expiration', label: 'Expiration', visible: true },
    { key: 'vendor', label: 'Vendor', visible: true },
    { key: 'locations', label: 'Locations', visible: true }
  ]; 
 
  ngOnInit() {
    this.initializeTabs();
    this.assetId = this.route.snapshot.paramMap.get('code') || '';
    if (this.assetId) {
      this.assetData.id = this.assetId;
      this.loadAssetDetails();
    }
  }

  loadAssetDetails() {
    const currentUser = this.commonService.getCurrentUser();
    const payload = {
      typeId: 87, 
      filterId: 0,
      filterText: this.assetId,
      filterText1: "",
      userId: currentUser?.userId || 1,
      clientId: currentUser?.clientId || "74BB6922",
      companyId: currentUser?.companyId || 1
    };

    this.propertiesService.getMasterDetails(payload).subscribe({
      next: (res: any) => {
        if (res && res.objResult) {
          const details = res.objResult.assetsdtls || res.objResult.table || res.objResult;
          if (Array.isArray(details) && details.length > 0) {
            const data = details[0];
            this.assetData = {
              id: data.code,
              name: data.asset_name || data.name || '-',
              model: data.model || '-',
              manufacturer: data.manufacturer || data.brand || '-',
              category: data.category_name || data.category || data.asset_category || '-',
              subcategory: data.subcategory_name || data.subcategory || data.asset_subcategory || '-',
              capacity: data.capacity || '-',
              color: data.color || '-',
              assetCode: data.barcode || data.asset_code || data.code || '-',
              barcode: data.barcode || data.asset_code || '-',
              area: data.area || data.common_area || data.location || '-',
              location: data.location || data.area || '-',
              description: data.description || data.desc || '-',
              status: data.status || '-',
              installationDate: data.purchase_date ? data.purchase_date.substring(0, 10) : '-',
              warrantyStatus: data.total_warranty ? true : false,
              warrantyStatusLabel: data.total_warranty ? 'Covered' : (data.warranty_status || '-'),
              property: data.property || '-',
              unit: data.unit  || '-',
              partsIncluded: data.parts || '-',
              purchaseDate:this.commonService.formatDateForInput(data.purchase_date),
              created: this.commonService.formatDateForInput(data.created_date) || '-',
              lastUpdated:this.commonService.formatDateForInput(data.modified_date) || '-',
              purchaseOrderNo: data.po_no || data.purchase_order || '-',
              price: data.price ? (`AED ${data.price}`) : '-',
              vendor: data.vendor || data.vendor_id || '-',
              warrantyProvider: data.manufacturer || '-',
              warrantyDuration: data.total_warranty || '-',
              warrantyStartDate: data.purchase_date ? data.purchase_date.substring(0, 10) : '-',
              warrantyEndDate: data.expiry_date ? data.expiry_date.substring(0, 10) : '-',
              warrantyResponsibility: data.warranty_responsibility || '-',
              warrantyDaysRemaining: data.expiry_date ? Math.ceil((new Date(data.expiry_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) : 0
            };
          }
          this.parts = res.objResult.parts || res.objResult.part_dtls || res.objResult.table1;
          
          this.workOrders = res.objResult.work_orders || []; 
          this.attachments = res.objResult.documents || []; 
          this.initializeTabs();
        }
      },
      error: (err: any) => console.error("Error loading asset details:", err)
    });
  }

  goBack() {
    this.router.navigate(['/facility/assets']);
  }

  navigateToEdit() {
    this.router.navigate(['/facility/assets/edit', this.assetId]);
  }

  navigateToAddWorkOrder() {
    this.router.navigate(['/facility/work-orders/create']);
  }

  setTab(tabName: string) {
    this.activeTab = tabName;
  }
}
