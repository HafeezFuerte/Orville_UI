import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { PortfolioService } from '../../../portfolio/services/portfolio.service';

@Component({
  selector: 'app-create-asset',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './create-asset.component.html',
  styleUrl: './create-asset.component.scss'
})
export class CreateAssetComponent {
  private router = inject(Router);
  private portfolioService = inject(PortfolioService);

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
    this.goBack();
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
