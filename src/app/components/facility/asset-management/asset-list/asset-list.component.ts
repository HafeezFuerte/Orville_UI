import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';

export interface Asset {
  id: string;
  assetName: string;
  model: string;
  category: string;
  property: string;
  unit: string;
  price: string;
  status: 'Operational' | 'Down';
  location: string;
}

@Component({
  selector: 'app-asset-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule, SharedTableComponent],
  templateUrl: './asset-list.component.html',
  styleUrl: './asset-list.component.scss'
})
export class AssetListComponent implements OnInit {
  private router = inject(Router);

  searchQuery: string = '';
  branches = ['Main Branch', 'Branch A'];
  buildings = ['All Buildings', 'Building 1'];

  pageNo = 1;
  pageSize = 10;
  totalRecords = 0;

  tableColumns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true },
    { key: 'assetName', label: 'Asset Name', visible: true },
    { key: 'model', label: 'Model', visible: true },
    { key: 'category', label: 'Category', visible: true },
    { key: 'property', label: 'Property', visible: true },
    { key: 'unit', label: 'Unit', visible: true },
    { key: 'price', label: 'Price', visible: true },
    { key: 'status', label: 'Status', visible: true, useTemplate: true },
    { key: 'location', label: 'Location', visible: true },
    { key: 'Vendor', label: 'Vendor', visible: true },
    { key: 'PurchaseDate', label: 'Purchase Date', visible: true },
  ];

  assetData: Asset[] = [
    { id: '27648', assetName: 'Microwave Oven Super General', model: 'SGMV81M0G-W (Super General)', category: 'Home Appliances', property: 'Marina Heights Tower A', unit: 'Apartment - 101 - FR', price: 'AED 385.00', status: 'Operational', location: 'Kitchen' },
    { id: '27649', assetName: 'Microwave Oven Super General', model: 'SGMV81M0G-W (Super General)', category: 'Home Appliances', property: 'Marina Heights Tower A', unit: 'Apartment - 101 - FR', price: 'AED 385.00', status: 'Operational', location: 'Kitchen' },
    { id: '27650', assetName: 'Microwave Oven Super General', model: 'SGMV81M0G-W (Super General)', category: 'Home Appliances', property: 'Marina Heights Tower A', unit: 'Apartment - 101 - FR', price: 'AED 385.00', status: 'Operational', location: 'Kitchen' },
    { id: '27651', assetName: 'Microwave Oven Super General', model: 'SGMV81M0G-W (Super General)', category: 'Home Appliances', property: 'Marina Heights Tower A', unit: 'Apartment - 101 - FR', price: 'AED 385.00', status: 'Operational', location: 'Kitchen' }
  ];

  get filteredData(): Asset[] {
    if (!this.searchQuery) return this.assetData;
    return this.assetData.filter(a =>
      a.assetName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      a.id.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  get visibleColumns() {
    return this.tableColumns.filter(c => c.visible);
  }

  ngOnInit() { }

  navigateToCreate() {
    this.router.navigate(['/facility/assets/create']);
  }

  navigateToDetail(id: string) {
    this.router.navigate(['/facility/assets', id]);
  }
}
