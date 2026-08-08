import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { PortfolioService } from '../../../portfolio/services/portfolio.service';
import { CommonService } from '../../../../services/common.service';
import { PropertiesService } from '../../../portfolio/services/properties.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-asset',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './create-asset.component.html',
  styleUrl: './create-asset.component.scss'
})
export class CreateAssetComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private portfolioService = inject(PortfolioService);
  private commonService = inject(CommonService);
  private propertiesService = inject(PropertiesService);
  private toastr = inject(ToastrService);

  editId: string | null = null;
  assetDbId: number = 0;

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
  properties: any[] = [];
  selectedProperty: any = null;
  propertyUnits: any[] = [];
  selectedPropertyUnit: any = null;
  commonAreas = ['Lobby', 'Hallway', 'Parking'];
  selectedCommonAreaRight: any = null;

  // Left Column - Description
  description: string = '';

  // Right Column - Barcode Details
  barcodeType: 'Custom' | 'Auto' = 'Custom';
  barcodeValue: string = '';

  // Right Column - Assignment
  assignWorkers: any[] = [];
  selectedAssignWorker: any = null;
  assignVendors: any[] = [];
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
    this.loadLookup(31, 'maintenanceSubcategories', 'lookup_name');
    this.loadWorkers();
    this.loadVendors();
    
    this.loadProperties(() => {
      this.route.params.subscribe(params => {
        if (params['id']) {
          this.editId = params['id'];
          this.loadAssetDetails();
        }
      });
    });
  }

  loadProperties(callback?: () => void) {
    this.portfolioService.getMasterByType({
      typeId: 11,
      filterId: 0,
      filterText: '',
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult.table) {
          this.properties = res.objResult.table.map((p: any) => ({
            code: p.code || p.property_code || p.id,
            name: p.name || p.property || p.code
          }));
        }
        if (callback) callback();
      },
      error: (err) => {
        console.error('Error loading properties:', err);
        if (callback) callback();
      }
    });
  }

  onPropertyChange() {
    this.selectedPropertyUnit = null;
    this.propertyUnits = [];
    if (this.selectedProperty) {
      this.portfolioService.getMasterByType({
        typeId: 3,
        filterId: 0,
        filterText: this.selectedProperty,
        filterText1: ''
      }).subscribe({
        next: (res: any) => {
          if (res.statusCode == 200 && res.objResult && res.objResult.table) {
            this.propertyUnits = res.objResult.table.map((u: any) => ({
              code: u.code || u.unit_code || u.id,
              name: `${u.unit_code || u.code} - ${u.unit_no || u.name}`
            }));
          }
        },
        error: (err) => console.error('Error loading units:', err)
      });
    }
  }

  onCategoryChange() {
    this.selectedAssetSubcategory = null;
    this.assetSubcategories = [];
    if (this.selectedAssetCategory) {
      this.portfolioService.getMasterByType({
        typeId: 2,
        filterId: 27,
        filterText: String(this.selectedAssetCategory),
        filterText1: ''
      }).subscribe({
        next: (res: any) => {
          if (res.statusCode == 200 && res.objResult && res.objResult.table) {
            this.assetSubcategories = res.objResult.table.map((item: any) => ({
              id: item.id,
              name: item.lookup_name || item.name || ''
            }));
          }
        },
        error: (err) => {
          console.error('Error fetching asset subcategories:', err);
        }
      });
    }
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
    this.router.navigate(['/facility/assets']);
  }

  saveAsset() {
    const currentUser = this.commonService.getCurrentUser();
    const requestJson = {
      userid: Number(localStorage.getItem('userId')) || Number(currentUser?.userId) || 1,
      company_id: Number(localStorage.getItem('companyId')) || Number(currentUser?.companyId) || 1,
      clientId: currentUser?.clientId || "74BB6922",
      source: "web",
      languageid: 1,
      id: Number(this.assetDbId) || 0,
      code: this.editId || "",
      status: 1,
      vendor_id: Number(this.selectedAssignVendor) || 0,
      worker_id: Number(this.selectedAssignWorker) || 0,
      barcode: this.barcodeValue || "",
      property_code: this.selectedProperty || "",
      unit_code: this.selectedPropertyUnit || "",
      asset_name: this.assetName || "",
      model: this.assetModel || "",
      area: this.commonAreaLeft || "",
      asset_category: Number(this.selectedAssetCategory) || 0,
      asset_subcategory: Number(this.selectedAssetSubcategory) || 0,
      common_area: this.selectedCommonAreaRight || "",
      manufacturer: this.brandManufacturer || "",
      capacity: this.capacity || "",
      units: Number(this.selectedUnit) || 0,
      location: this.location || "",
      description: this.description || "",
      price: Number(this.price) || 0,
      purchase_date: new Date().toISOString(),
      expiry_date: this.expiryDate ? new Date(this.expiryDate).toISOString() : new Date().toISOString(),
      total_warranty: Number(this.totalWarranty) || 0,
      maintenance_category: 0,
      maintenance_subcategory: Number(this.selectedMaintenanceSubcategory) || 0,
      is_from_unit: this.selectedPropertyUnit ? true : false,
      room_code: "",
      file_path: "",
      file_paths: ""
    };

    const formData = new FormData();
    formData.append('reqObject', JSON.stringify(requestJson));

    // Append files
    if (this.attachments && this.attachments.length > 0) {
      this.attachments.forEach((file: any) => {
        if (file instanceof File) {
          formData.append('file_paths', file);
        }
      });
    }

    console.log("=== Debugging save_update_assets Payload ===");
    console.log("reqObject:", JSON.stringify(requestJson, null, 2));
    console.log("============================================");

    this.portfolioService.saveAsset(formData).subscribe({
      next: (res: any) => {
        if (res && (res.statusCode == 200 || res.statusCode == "200" || res.isSuccess)) {
          this.toastr.success(res.message || "Asset saved successfully");
          this.goBack();
        } else {
          this.toastr.error(res.message || "Failed to save asset");
        }
      },
      error: (err: any) => {
        console.error("Error saving asset:", err);
        this.toastr.error("An error occurred while saving the asset");
      }
    });
  }

  bindAssetData(data: any) {
    if (!data) return;
    this.assetDbId = data.id || 0;
    this.editId = data.code || data.asset_code || this.editId;
    this.assetName = data.asset_name || data.name || "";
    this.assetModel = data.model || "";
    this.selectedAssetCategory = data.asset_category || null;
    
    if (this.selectedAssetCategory) {
      this.portfolioService.getMasterByType({
        typeId: 2,
        filterId: 27,
        filterText: String(this.selectedAssetCategory),
        filterText1: ''
      }).subscribe((resSub: any) => {
        if (resSub.statusCode == 200 && resSub.objResult && resSub.objResult.table) {
          this.assetSubcategories = resSub.objResult.table.map((item: any) => ({
            id: item.id,
            name: item.lookup_name || item.name || ''
          }));
          this.selectedAssetSubcategory = data.asset_subcategory || null;
        }
      });
    }
    
    this.commonAreaLeft = data.area || "";
    this.brandManufacturer = data.manufacturer || "";
    this.capacity = data.capacity || "";
    this.selectedUnit = data.units || null;
    this.location = data.location || "";
    
    this.selectedProperty = data.property_code || null;
    if (this.selectedProperty) {
      this.portfolioService.getMasterByType({
        typeId: 3,
        filterId: 0,
        filterText: this.selectedProperty,
        filterText1: ''
      }).subscribe((resUnit: any) => {
        if (resUnit.statusCode == 200 && resUnit.objResult && resUnit.objResult.table) {
          this.propertyUnits = resUnit.objResult.table.map((u: any) => ({
            code: u.code || u.unit_code || u.id,
            name: `${u.unit_code || u.code} - ${u.unit_no || u.name}`
          }));
          this.selectedPropertyUnit = data.unit_code || null;
        }
      });
    }
    
    this.selectedCommonAreaRight = data.common_area || null;
    this.description = data.description || "";
    this.price = data.price || "";
    this.selectedMaintenanceSubcategory = data.maintenance_subcategory || null;
    
    if (data.expiry_date) {
      this.expiryDate = data.expiry_date.substring(0, 10);
    }
    this.totalWarranty = data.total_warranty || "";
    this.barcodeValue = data.barcode || "";
    this.selectedAssignWorker = data.worker_id || null;
    this.selectedAssignVendor = data.vendor_id || null;
  }

  loadAssetDetails() {
    const localAsset = localStorage.getItem('selectedAsset');
    if (localAsset) {
      try {
        const data = JSON.parse(localAsset);
        if (String(data.code || data.id) === String(this.editId)) {
          this.bindAssetData(data);
          return;
        }
      } catch (e) {
        console.error("Error parsing localAsset:", e);
      }
    }

    const currentUser = this.commonService.getCurrentUser();
    const payload = {
      typeId: 22,
      typeid: 22,
      filterId: 0,
      filterText: this.editId,
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
            this.bindAssetData(details[0]);
          }
        }
      },
      error: (err: any) => console.error("Error loading asset details:", err)
    });
  }

  loadWorkers() {
    this.portfolioService.getMastersByPaging({
      userid: 1,
      company_id: 1,
      clientId: "74BB6922",
      source: 'web',
      languageid: 1,
      page_no: 0,
      seqno: 0,
      search_keyword: '',
      pagecount: 100,
      filter_by: '',
      featureid: 'SUPPORT_TECHNICIANS'
    }).subscribe({
      next: (res: any) => {
        if (res && res.objResult) {
          const list = res.objResult.support_technicians || res.objResult.table || res.objResult;
          if (Array.isArray(list)) {
            this.assignWorkers = list.map((item: any) => ({
              id: item.id || item.code,
              name: item.name || item.technician_name || item.code
            }));
          }
        }
      },
      error: (err) => console.error('Error loading technicians:', err)
    });
  }

  loadVendors() {
    this.portfolioService.getMastersByPaging({
      userid: 1,
      company_id: 1,
      clientId: "74BB6922",
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
        if (res && res.objResult) {
          const list = res.objResult.vendors || res.objResult.table || res.objResult;
          if (Array.isArray(list)) {
            this.assignVendors = list.map((item: any) => ({
              id: item.id || item.code,
              name: item.company_name || item.contact_name || item.name || item.code
            }));
          }
        }
      },
      error: (err) => console.error('Error loading vendors:', err)
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
// Force compile 2
