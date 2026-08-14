import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { PropertiesService } from '../../../portfolio/services/properties.service';
import { CommonService } from '../../../../services/common.service';

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
  imports: [CommonModule, SharedTableComponent, AttachmentsComponent],
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
  tabs: string[] = ['Overview', 'Parts', 'Work Orders', 'Attachments'];
  attachmentsForm: any = {};

  tabsList: any[] = [];

  initializeTabs() {
    this.tabsList = [
      {
        key: 'Attachments',
        label: 'Attachments',
        entity: 'asset',
        entity_id: this.assetId,
        data: this.attachments || [],
        totalRecords: (this.attachments || []).length,
        loading: false,
        hasActions: true,
        addButtonText: 'Attachments',
        form: this.attachmentsForm,
        popupType: 'attachment'
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
    category: '-',
    subcategory: '-',
    capacity: '-',
    color: '-',
    assetCode: '-',
    status: '-',
    installationDate: '-',
    warrantyStatus: false,
    property: '-',
    unit: '-',
    partsIncluded: '-',
    purchaseDate: '-',
    lastUpdated: '-',
    purchaseOrderNo: '-',
    price: '-',
    vendor: '-',
    warrantyProvider: '-',
    warrantyDuration: '-',
    warrantyStartDate: '-',
    warrantyEndDate: '-',
    warrantyDaysRemaining: 0
  };

  parts: Part[] = [];

  workOrders: WorkOrder[] = [];

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

  workOrderColumns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true },
    { key: 'workOrder', label: 'Work order', visible: true },
    { key: 'priority', label: 'Priority', visible: true, useTemplate: true },
    { key: 'status', label: 'Status', visible: true, useTemplate: true },
    { key: 'unit', label: 'Unit', visible: true, useTemplate: true },
    { key: 'property', label: 'Property', visible: true, useTemplate: true },
    { key: 'vendor', label: 'Vendor', visible: true, useTemplate: true },
    { key: 'category', label: 'Category', visible: true },
    { key: 'responsiblePerson', label: 'Responsible person(s)', visible: true },
    { key: 'technician', label: 'Technician', visible: true },
    { key: 'action', label: 'Action', visible: true, useTemplate: true },
    { key: 'lastUpdate', label: 'Last Update', visible: true },
    { key: 'createdAt', label: 'Created At', visible: true },
    { key: 'createdBy', label: 'Created By', visible: true }
  ];

  attachmentColumns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true },
    { key: 'fileName', label: 'File Type', visible: true },
    { key: 'docId', label: 'Doc ID', visible: true },
    { key: 'tags', label: 'Tags', visible: true },
    { key: 'documentStatus', label: 'Document Status', visible: true, useTemplate: true },
    { key: 'files', label: 'Files', visible: true },
    { key: 'uploadedBy', label: 'Uploaded By', visible: true },
    { key: 'createdAt', label: 'Created At', visible: true },
    { key: 'updatedAt', label: 'Updated At', visible: true },
    { key: 'action', label: 'Action', visible: true, useTemplate: true },
    { key: 'sendable', label: 'Sendable', visible: true },
    { key: 'shareLandlord', label: 'Share Landlord', visible: true },
    { key: 'shareTenant', label: 'Share Tenant', visible: true },
    { key: 'issueDate', label: 'Issue Date', visible: true },
    { key: 'expiryDate', label: 'Expiry Date', visible: true }
  ];

  ngOnInit() {
    this.initializeTabs();
    this.assetId = this.route.snapshot.paramMap.get('id') || '';
    if (this.assetId) {
      this.assetData.id = this.assetId;
      this.loadAssetDetails();
    }
  }

  loadAssetDetails() {
    const currentUser = this.commonService.getCurrentUser();
    const payload = {
      typeId: 22,
      typeid: 22,
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
          const details = res.objResult.assets || res.objResult.table || res.objResult;
          if (Array.isArray(details) && details.length > 0) {
            const data = details[0];
            this.assetData = {
              id: data.id || data.code || this.assetId,
              name: data.asset_name || data.name || '-',
              model: data.model || '-',
              category: data.category_name || data.category || data.asset_category || '-',
              subcategory: data.subcategory_name || data.subcategory || data.asset_subcategory || '-',
              capacity: data.capacity || '-',
              color: data.color || '-',
              assetCode: data.barcode || data.asset_code || data.code || '-',
              status: data.status || '-',
              installationDate: data.purchase_date ? data.purchase_date.substring(0, 10) : '-',
              warrantyStatus: data.total_warranty ? true : false,
              property: data.property_name || data.property_code || data.property || '-',
              unit: data.unit_name || data.unit_code || data.unit || '-',
              partsIncluded: data.parts || '-',
              purchaseDate: data.purchase_date ? data.purchase_date.substring(0, 10) : '-',
              lastUpdated: data.last_update || data.updatedAt || data.purchase_date || '-',
              purchaseOrderNo: data.po_no || data.purchase_order || '-',
              price: data.price || '-',
              vendor: data.vendor_name || data.vendor_id || '-',
              warrantyProvider: data.manufacturer || '-',
              warrantyDuration: data.total_warranty || '-',
              warrantyStartDate: data.purchase_date ? data.purchase_date.substring(0, 10) : '-',
              warrantyEndDate: data.expiry_date ? data.expiry_date.substring(0, 10) : '-',
              warrantyDaysRemaining: data.expiry_date ? Math.ceil((new Date(data.expiry_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) : 0
            };
          }
          const partList = res.objResult.parts || res.objResult.part_dtls || res.objResult.table1;
          if (Array.isArray(partList)) {
            this.parts = partList.map((p: any) => ({
              id: p.id || p.code || '',
              partName: p.partName || p.name || '',
              partNumber: p.partNumber || p.number || '',
              category: p.category || '',
              subcategory: p.subcategory || '',
              unit: p.unit || '',
              cost: p.cost || ''
            }));
          }
          const woList = res.objResult.work_orders || res.objResult.workorders || res.objResult.table2;
          if (Array.isArray(woList)) {
            this.workOrders = woList.map((w: any) => ({
              id: w.id || w.code || '',
              workOrder: w.workOrder || w.title || '',
              property: w.property || '',
              unit: w.unit || '',
              priority: w.priority || 'Medium',
              status: w.status || 'Open',
              vendor: w.vendor || ''
            }));
          }
          const docList = res.objResult.documents || res.objResult.document || res.objResult.attachments;
          if (Array.isArray(docList)) {
            this.attachments = docList.map((d: any) => ({
              code: d.code || d.id,
              document_type_name: d.document_type_name || d.fileType || '',
              doc_no: d.doc_no || d.docId || '',
              document_status_name: d.document_status_name || d.documentStatus || '',
              issue_date: d.issue_date || d.issueDate || '',
              expiry_date: d.expiry_date || d.expiryDate || '',
              file_path: d.file_path || d.files || ''
            }));
          }
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
