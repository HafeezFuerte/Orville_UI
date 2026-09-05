import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload.component';
import { PortfolioService } from '../../../portfolio/services/portfolio.service';
import { CommonService } from '../../../../services/common.service';

interface InventoryLineDraft {
  location: string;
  area: string;
  barcode: string;
  cost: string;
  availableQty: string;
  minimumQty: string;
}

@Component({
  selector: 'app-create-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule, FileUploadComponent],
  templateUrl: './create-inventory.component.html',
  styleUrl: './create-inventory.component.scss'
})
export class CreateInventoryComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private portfolioService = inject(PortfolioService);
  private commonService = inject(CommonService);
  private toastr = inject(ToastrService);

  properties: any[] = [];
  units: any[] = [];
  vendors: any[] = [];
  categories = ['HVAC', 'Appliance', 'Furniture', 'Lighting', 'Plumbing'];
  subcategories = ['Filter', 'Compressor', 'Bulb', 'Faucet', 'Pipe'];

  itemName = '';
  partNumber = '';
  selectedCategory: string | null = null;
  selectedSubcategory: string | null = null;
  detail = '';

  placedDate = '';
  expirationDate = '';
  selectedVendor: string | null = null;

  attachments: File[] = [];
  lines: InventoryLineDraft[] = [
    { location: '', area: '', barcode: '', cost: '500.00', availableQty: '', minimumQty: '' }
  ];

  nonStockItem = true;
  nonStockSameForAll = true;
  randomBarcode = false;
  barcodeSameForAll = false;
  costSameForAll = false;

  isEdit = false;
  inventoryCode = '';

  ngOnInit(): void {
    this.loadProperties();
    this.loadVendors();

    this.route.queryParams.subscribe(params => {
      const code = params['code'] || params['id'];
      if (code) {
        this.isEdit = true;
        this.inventoryCode = code;
        this.loadInventoryDetails();
      }
    });
  }

  loadProperties(): void {
    const currentUser = this.commonService.getCurrentUser();
    this.portfolioService.getMasterByType({
      typeId: 11,
      filterId: 0,
      filterText: '',
      filterText1: '',
      userId: currentUser?.userId || 1,
      clientId: currentUser?.clientId || "74BB6922",
      companyId: currentUser?.companyId || 1
    }).subscribe({
      next: (res: any) => {
        if (res && (res.statusCode == 200 || res.statusCode == '200') && res.objResult && res.objResult.table) {
          this.properties = res.objResult.table.map((p: any) => ({
            code: p.code || p.property_code || p.id,
            name: p.name || p.property || p.code
          }));
        }
      },
      error: (err) => console.error('Error loading properties:', err)
    });
  }

  loadUnitsForProperty(propertyCode: string): void {
    const currentUser = this.commonService.getCurrentUser();
    this.portfolioService.getMasterByType({
      typeId: 3,
      filterId: 0,
      filterText: propertyCode,
      filterText1: '',
      userId: currentUser?.userId || 1,
      clientId: currentUser?.clientId || "74BB6922",
      companyId: currentUser?.companyId || 1
    }).subscribe({
      next: (res: any) => {
        if (res && (res.statusCode == 200 || res.statusCode == '200') && res.objResult && res.objResult.table) {
          this.units = res.objResult.table.map((u: any) => ({
            code: u.code || u.unit_code || u.id,
            name: `${u.unit_code || u.code} - ${u.unit_no || u.name}`
          }));
        }
      },
      error: (err) => console.error('Error loading units:', err)
    });
  }

  loadVendors(): void {
    const currentUser = this.commonService.getCurrentUser();
    this.portfolioService.getMastersByPaging({
      userid: currentUser?.userId || 1,
      company_id: currentUser?.companyId || 1,
      clientId: currentUser?.clientId || "74BB6922",
      source: 'web',
      languageid: 1,
      page_no: 0,
      seqno: 0,
      search_keyword: '',
      pagecount: 100,
      filter_by: '',
      featureid: 'VENDORS'
    }).subscribe({
      next: (res: any) => {
        if (res && res.objResult && res.objResult.vendors) {
          this.vendors = res.objResult.vendors.map((v: any) => ({
            code: v.code || v.id,
            name: v.company_name || v.contact_name || v.name || v.code || '-'
          }));
        }
      },
      error: (err) => console.error('Error loading vendors:', err)
    });
  }

  loadInventoryDetails(): void {
    const currentUser = this.commonService.getCurrentUser();
    this.portfolioService.getMasterByType({
      typeId: 40,
      filterId: 0,
      filterText: this.inventoryCode,
      filterText1: '',
      userId: currentUser?.userId || 1,
      clientId: currentUser?.clientId || "74BB6922",
      companyId: currentUser?.companyId || 1
    }).subscribe({
      next: (res: any) => {
        if (res && (res.statusCode == 200 || res.statusCode === '200') && res.objResult) {
          const detail = res.objResult.table?.[0] || res.objResult.inventory_item?.[0] || res.objResult.inventory?.[0] || {};
          
          this.itemName = detail.item_name || detail.itemName || detail.name || '';
          this.partNumber = detail.part_number || detail.part_no || detail.partNumber || '';
          this.selectedCategory = detail.category || detail.category_name || null;
          this.selectedSubcategory = detail.subcategory || detail.subcategory_name || null;
          this.detail = detail.notes || detail.detail || detail.description || '';
          this.placedDate = this.formatDateForInput(detail.placed_date || detail.placedDate);
          this.expirationDate = this.formatDateForInput(detail.expiry_date || detail.expiration);
          this.selectedVendor = detail.vendor_code || detail.vendor || null;

          if (res.objResult.table1 || res.objResult.lines) {
            const rawLines = res.objResult.table1 || res.objResult.lines || [];
            this.lines = rawLines.map((l: any) => ({
              location: l.property_code || l.property || '',
              area: l.unit_code || l.unit || '',
              barcode: l.barcode || '',
              cost: String(l.cost || '0.00'),
              availableQty: String(l.qty || l.available_qty || ''),
              minimumQty: String(l.minimum_qty || l.minimumQty || '')
            }));

            if (this.lines.length > 0 && this.lines[0].location) {
              this.loadUnitsForProperty(this.lines[0].location);
            }
          }
        }
      },
      error: (err) => console.error('Error loading inventory details:', err)
    });
  }

  formatDateForInput(dateStr: string): string {
    if (!dateStr) return '';
    try {
      const dt = new Date(dateStr);
      if (isNaN(dt.getTime())) return dateStr;
      const d = String(dt.getDate()).padStart(2, '0');
      const m = String(dt.getMonth() + 1).padStart(2, '0');
      const y = dt.getFullYear();
      return `${d}-${m}-${y}`;
    } catch {
      return dateStr;
    }
  }

  parseInputDate(dateStr: string): string {
    if (!dateStr) return new Date().toISOString();
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const d = Number(parts[0]);
      const m = Number(parts[1]) - 1;
      const y = Number(parts[2]);
      return new Date(y, m, d).toISOString();
    }
    return new Date(dateStr).toISOString();
  }

  onPropertyChange(index: number): void {
    const propCode = this.lines[index].location;
    if (propCode) {
      this.loadUnitsForProperty(propCode);
    }
  }

  onFilesSelected(files: File[]): void {
    this.attachments = files;
  }

  goBack(): void {
    this.router.navigate(['/facility/inventory']);
  }

  save(): void {
    const errors: string[] = [];
    if (!this.itemName.trim()) errors.push('Item Name is required.');
    if (!this.lines.length || !this.lines[0].location) errors.push('Property is required.');
    if (!this.lines[0].area) errors.push('Unit is required.');

    if (errors.length > 0) {
      this.toastr.error(errors.join('<br>'), 'Validation', {
        enableHtml: true,
        timeOut: 5000,
        positionClass: 'toast-top-right'
      });
      return;
    }

    const firstLine = this.lines[0];
    const currentUser = this.commonService.getCurrentUser();
    const request = {
      userid: currentUser?.userId || 1,
      company_id: currentUser?.companyId || 1,
      clientId: currentUser?.clientId || '74BB6922',
      source: 'web',
      languageid: 1,
      code: this.inventoryCode || '',
      entity: 'Unit',
      entity_id: firstLine.area || '',
      item_name: this.itemName,
      location: firstLine.location || '',
      expiry_date: this.expirationDate ? this.parseInputDate(this.expirationDate) : null,
      qty: Number(firstLine.availableQty) || 1,
      part_number: this.partNumber || '',
      category: this.selectedCategory || '',
      subcategory: this.selectedSubcategory || '',
      vendor_code: this.selectedVendor || '',
      notes: this.detail || '',
      file_paths: '',
      lines: this.lines.map(l => ({
        property_code: l.location,
        unit_code: l.area,
        barcode: l.barcode,
        cost: Number(l.cost) || 0,
        qty: Number(l.availableQty) || 0,
        minimum_qty: Number(l.minimumQty) || 0
      }))
    };

    const formData = new FormData();
    formData.append('reqObject', JSON.stringify(request));
    this.attachments.forEach(file => {
      formData.append('file_paths', file);
    });

    this.portfolioService.saveInventoryItem(formData).subscribe({
      next: (res) => {
        if (res && (res.statusCode === 200 || res.statusCode === '200' || res.isSuccess)) {
          const codeKey = this.inventoryCode || res.objResult?.table?.[0]?.code || res.objResult?.code || '';
          if (codeKey) {
            const selectedProp = this.properties.find(p => p.code === firstLine.location);
            const propName = selectedProp?.name || firstLine.location || '';
            try {
              localStorage.setItem(`inventory_extra_${codeKey}`, JSON.stringify({
                itemName: this.itemName,
                partNumber: this.partNumber,
                category: this.selectedCategory,
                subcategory: this.selectedSubcategory,
                detail: this.detail,
                placedDate: this.placedDate,
                expirationDate: this.expirationDate,
                vendor: this.selectedVendor,
                locationCode: firstLine.location,
                propertyName: propName,
                locationName: propName,
                cost: firstLine.cost,
                availableQty: firstLine.availableQty,
                minimumQty: firstLine.minimumQty
              }));
            } catch (e) {
              console.error('Error saving inventory extra local storage:', e);
            }
          }

          let msg = res.message || 'Inventory Item saved successfully';
          if (!msg || msg.trim() === 'LBL_SUCCESS' || msg.toUpperCase().includes('LBL_SUCCESS')) {
            msg = 'Success';
          }
          this.toastr.success(msg);
          this.goBack();
        } else {
          let msg = res.message || 'Failed to save inventory item';
          if (msg.includes('LBL_')) msg = 'Failed to save inventory item';
          this.toastr.error(msg);
        }
      },
      error: (err) => {
        console.error('Error saving inventory item:', err);
        this.toastr.error('An error occurred while saving the inventory item');
      }
    });
  }

  addAttachment(): void {
    // dummy to support ui actions
  }

  removeAttachment(index: number): void {
    // dummy to support ui actions
  }

  addLine(): void {
    this.lines = [
      ...this.lines,
      { location: '', area: '', barcode: '', cost: '', availableQty: '', minimumQty: '' }
    ];
  }

  removeLine(index: number): void {
    if (this.lines.length <= 1) {
      this.lines = [{ location: '', area: '', barcode: '', cost: '', availableQty: '', minimumQty: '' }];
      return;
    }
    this.lines = this.lines.filter((_, i) => i !== index);
  }

  trackByIndex(index: number): number {
    return index;
  }
}
