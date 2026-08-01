import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';

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

  assetId: string = '';
  activeTab: string = 'Overview';
  tabs: string[] = ['Overview', 'Parts', 'Work Orders', 'Attachments'];
  attachmentsForm: any = {};

  get selectedTab(): any {
    if (this.activeTab === 'Attachments') {
      return {
        key: 'attachments',
        entity: 'asset',
        entity_id: this.assetId,
        data: this.attachments || [],
        form: this.attachmentsForm
      };
    }
    return null;
  }

  assetData = {
    id: '27650',
    name: 'Microwave Oven Super General',
    model: 'SGMV81M0G-W (Super General)',
    category: 'Home Appliances',
    subcategory: '-',
    capacity: '-',
    color: 'White',
    assetCode: 'Asset Code 1',
    status: 'Operational',
    installationDate: '10-01-2023',
    warrantyStatus: true,
    property: 'Dubai Marina, Tower A, Dubai',
    unit: 'Apartment 100 - FR A',
    partsIncluded: 'Microwave',
    purchaseDate: '10-01-2023',
    lastUpdated: '10-01-2023',
    
    // Purchase Information
    purchaseOrderNo: 'PO-2024-001',
    price: 'AED 385.00',
    vendor: 'Rahman Mohammad',
    
    // Warranty Details
    warrantyProvider: 'Samsung',
    warrantyDuration: '12 Months',
    warrantyStartDate: '10-01-2023',
    warrantyEndDate: '10-01-2024',
    warrantyDaysRemaining: 180
  };

  parts: Part[] = [
    { id: 'PT-1001', partName: 'Microwave', partNumber: 'PART-001', category: 'Electrical', subcategory: 'N/A', unit: 'AED 150.00', cost: 'AED 150.00' },
    { id: 'PT-1002', partName: 'Oven Door', partNumber: 'PART-002', category: 'Electrical', subcategory: 'N/A', unit: 'AED 200.00', cost: 'AED 200.00' }
  ];

  workOrders: WorkOrder[] = [
    { id: '82658', workOrder: 'Oven not working', property: 'Marina Heights Tower A', unit: 'Apartment 101 - FR A', priority: 'Medium', status: 'Open', vendor: 'Rahman Mohammad' },
    { id: '82659', workOrder: 'Oven not working', property: 'Marina Heights Tower A', unit: 'Apartment 101 - FR A', priority: 'High', status: 'Pending', vendor: 'Rahman Mohammad' }
  ];

  attachments: Attachment[] = [
    { id: 'ATT-1001', fileName: 'Inspection Report', docId: 'DOC-1001', documentStatus: 'Active', issueDate: '10-01-2024', expiryDate: '10-01-2025', files: '1 file' },
    { id: 'ATT-1002', fileName: 'Maintenance Report', docId: 'DOC-1002', documentStatus: 'Verified', issueDate: '12-01-2024', expiryDate: '12-01-2025', files: '1 file' }
  ];

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
    this.assetId = this.route.snapshot.paramMap.get('id') || '';
    if (this.assetId) {
      this.assetData.id = this.assetId;
    }
  }

  goBack() {
    this.router.navigate(['/facility/assets']);
  }

  setTab(tabName: string) {
    this.activeTab = tabName;
  }
}
