import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { PortfolioService } from '../../../portfolio/services/portfolio.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-create-asset',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './create-asset.component.html',
  styleUrl: './create-asset.component.scss'
})
export class CreateAssetComponent implements OnInit {
  private router = inject(Router);
  private portfolioService = inject(PortfolioService);
  private commonService = inject(CommonService);

  branches = ['Branch A', 'Branch B'];
  buildings = ['Building 1', 'Building 2'];

  // Left Column - Asset Information
  assetName: string = '';
  assetModel: string = '';
  assetCategories: any[] = [];
  selectedAssetCategory: any = null;
  assetSubcategories: any[] = [];
  selectedAssetSubcategory: any = null;
  commonAreaLeft: string = '';
  brandManufacturer: string = '';
  capacity: string = '';
  units = ['Pieces', 'Boxes'];
  selectedUnit: any = null;
  location: string = '';

  // Left Column - Property Information
  properties = ['Dubai Marina', 'JLT', 'Downtown'];
  selectedProperty: any = null;
  propertyUnits = ['Unit 101', 'Unit 102'];
  selectedPropertyUnit: any = null;
  commonAreas = ['Lobby', 'Hallway', 'Parking'];
  selectedCommonAreaRight: any = null;

  // Left Column - Description
  description: string = '';

  // Right Column - Barcode Details
  barcodeType: 'Custom' | 'Auto' = 'Custom';
  barcodeValue: string = '';

  // Right Column - Assignment
  assignWorkers = ['John Doe', 'Jane Smith'];
  selectedAssignWorker: any = null;
  assignVendors = ['Vendor A', 'Vendor B'];
  selectedAssignVendor: any = null;

  // Left Column - Purchase Details
  price: string = '';
  maintenanceSubcategories: any[] = [];
  selectedMaintenanceSubcategory: any = null;
  expiryDate: string = '';
  totalWarranty: string = '';

  attachments: any[] = [
    { name: 'Asset.pdf', size: '1.4 MB' },
    { name: 'Note.pdf', size: '1.1 MB' }
  ];

  ngOnInit() {
    this.loadLookup(26, 'assetCategories', 'lookup_name');
    this.loadLookup(27, 'assetSubcategories', 'lookup_name');
    this.loadLookup(31, 'maintenanceSubcategories', 'lookup_name');
  }

  loadLookup(filterId: number, targetProperty: string, nameField: string) {
    this.portfolioService.getMasterByType({
      typeId: 2,
      filterId: filterId,
      filterText: '',
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult.table) {
          (this as any)[targetProperty] = res.objResult.table.map((item: any) => ({
            id: item.id,
            name: item[nameField] || item.lookup_name || item.name || ''
          }));
        }
      },
      error: (err) => {
        console.error(`Error fetching lookup ${filterId}:`, err);
      }
    });
  }

  goBack() {
    this.router.navigate(['/facility/asset-management']);
  }

  saveAsset() {
    const currentUser = this.commonService.getCurrentUser();
    const formData = new FormData();

    formData.append('userid', (currentUser?.userId || 1).toString());
    formData.append('company_id', (currentUser?.companyId || 1).toString());
    formData.append('clientId', currentUser?.clientId || "74BB6922");
    formData.append('source', 'web');
    formData.append('languageid', '1');
    formData.append('code', '');
    formData.append('vendor_id', this.selectedAssignVendor || '');
    formData.append('worker_id', this.selectedAssignWorker || '');
    formData.append('barcode', this.barcodeValue || '');
    formData.append('property_code', this.selectedProperty || '');
    formData.append('unit_code', this.selectedPropertyUnit || '');
    formData.append('asset_name', this.assetName || '');
    formData.append('model', this.assetModel || '');
    formData.append('area', this.commonAreaLeft || '');
    formData.append('asset_category', this.selectedAssetCategory || '');
    formData.append('asset_subcategory', this.selectedAssetSubcategory || '');
    formData.append('common_area', this.selectedCommonAreaRight || '');
    formData.append('manufacturer', this.brandManufacturer || '');
    formData.append('capacity', this.capacity || '');
    formData.append('units', this.selectedUnit || '');
    formData.append('location', this.location || '');
    formData.append('description', this.description || '');
    formData.append('price', this.price || '');
    formData.append('purchase_date', new Date().toISOString());
    formData.append('expiry_date', this.expiryDate ? new Date(this.expiryDate).toISOString() : '');
    formData.append('total_warranty', this.totalWarranty || '');

    // Append files
    if (this.attachments && this.attachments.length > 0) {
      this.attachments.forEach((file: any) => {
        if (file instanceof File) {
          formData.append('file_paths', file);
        }
      });
    }

    this.portfolioService.saveAsset(formData).subscribe({
      next: (res: any) => {
        this.goBack();
      },
      error: (err: any) => {
        console.error("Error saving asset:", err);
      }
    });
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        this.attachments.push(files[i]);
      }
    }
  }

  removeFile(index: number) {
    this.attachments.splice(index, 1);
  }
}
