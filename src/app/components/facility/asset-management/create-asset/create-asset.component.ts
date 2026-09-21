import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { PortfolioService } from '../../../portfolio/services/portfolio.service';
import { CommonService } from '../../../../services/common.service';
import { PropertiesService } from '../../../portfolio/services/properties.service';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Observable } from 'rxjs';
import { FlowbiteDatepickerDirective } from '../../../../shared/directives/flowbite-datepicker.directive';
@Component({
  selector: 'app-create-asset',
  standalone: true,
  imports: [CommonModule,FlowbiteDatepickerDirective, FormsModule, NgSelectModule],
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

  attachments: any[] = [];

  ngOnInit() {
    this.loadLookup(2,26, 'assetCategories', 'lookup_name');
    this.loadLookup(70,6, 'assignWorkers', 'name');
    this.loadLookup(70,5, 'assignVendors', 'name'); 
    this.loadLookup(70,2, 'properties', 'name'); 
    this.route.paramMap.subscribe((params) => {
      this.editId=params.get('code'); 
      if(this.editId)
      this.loadAssetDetails();
    });
 
  }

   

  onPropertyChange() {
    this.selectedPropertyUnit = null;
    this.propertyUnits = [];
    if (this.selectedProperty) {
      this.loadLookup(44, 0, 'propertyUnits', this.selectedProperty);
    }
  }

  onCategoryChange() {
    this.selectedAssetSubcategory = null;
    this.assetSubcategories = [];
    if (this.selectedAssetCategory) {
      this.loadLookup(2, 27, 'assetSubcategories', this.selectedAssetCategory); 
    }
  }

  loadLookup(typeid: number, filterId: number, targetProperty: string, filterText: string) {
    this.portfolioService.getMasterByType({
      typeId: typeid,
      filterId: filterId,
      filterText:filterText,
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult.table) {
          (this as any)[targetProperty] =   res.objResult.table;
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
      vendor_id: this.selectedAssignVendor || '',
      worker_id: this.selectedAssignWorker || '',
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
      expiry_date: this.commonService.parseInputDate(this.expiryDate),
      total_warranty: Number(this.totalWarranty) || 0,
      maintenance_category: 0,
      maintenance_subcategory:  0,
      is_from_unit: this.selectedPropertyUnit ? true : false,
      room_code: "",
      file_path: "",
      file_paths: ""
    };

    const formData = new FormData();
    formData.append('reqObject', JSON.stringify(requestJson));  

    this.portfolioService.saveAsset(formData).subscribe({
      next: (res: any) => {
        if (res && (res.statusCode == 200 || res.statusCode == "200" || res.isSuccess)) {
          const assetCode = res.objResult?.code || res.objResult?.id || this.editId || "";
          
          // Upload attachments
          const uploadTasks: Observable<any>[] = [];
          this.attachments.forEach(file => {
            if (file instanceof File) {
              uploadTasks.push(this.uploadFile(file, assetCode));
            }
          });

          if (uploadTasks.length > 0) {
            forkJoin(uploadTasks).subscribe({
              next: () => {
                this.toastr.success("Asset and all attachments saved successfully");
                this.goBack();
              },
              error: (err) => {
            
                this.toastr.warning("Asset saved, but some files failed to upload");
                this.goBack();
              }
            });
          } else {
            this.toastr.success("Asset saved successfully");
            this.goBack();
          }
        } else {
          this.toastr.error(res.message || "Failed to save asset");
        }
      },
      error: (err: any) => { 
        this.toastr.error("An error occurred while saving the asset");
      }
    });
  }
 

  loadAssetDetails() {
    const currentUser = this.commonService.getCurrentUser();
    const payload = {
      typeId: 87, 
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
          const details = res.objResult.assetsdtls || res.objResult.table || res.objResult;
          if (Array.isArray(details) && details.length > 0) {
            const data = details[0];
            this.commonAreaLeft = data.area || "";
            this.brandManufacturer = data.manufacturer || "";
            this.capacity = data.capacity || ""; 
            this.location = data.location || "";
             this.assetName=data.asset_name,
            this.assetModel =data.model,
            this.commonAreaLeft=data.area,
            this.selectedAssignWorker=data.worker_id,
            this.selectedAssignVendor=data.vendor_id,
            this.selectedAssetCategory=data.asset_category,
            this.selectedUnit=data.units;

            this.selectedProperty = data.property_code || null;
          
            
            this.selectedCommonAreaRight = data.common_area || null;
            this.description = data.description || "";
            this.price = data.price || ""; 
            this.loadLookup(2, 27, 'assetSubcategories', this.selectedAssetCategory); 
            this.loadLookup(44, 0, 'propertyUnits', this.selectedProperty);  
            this.selectedPropertyUnit = data.unit_code || null; 
            this.selectedAssetSubcategory=data.asset_subcategory
            if (data.expiry_date) {
              this.expiryDate = data.expiry_date.substring(0, 10);
            }
            this.totalWarranty = data.total_warranty || "";
            this.barcodeValue = data.barcode || "";
            this.selectedAssignWorker = data.worker_id || null;
            this.selectedAssignVendor = data.vendor_id || null;
          }
         
        }
      },
      error: (err: any) => console.error("Error loading asset details:", err)
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

  viewFile(file: any) {
    if (file instanceof File) {
      const url = URL.createObjectURL(file);
      window.open(url, '_blank');
    } else if (file.file_path || file.url) {
      window.open(file.file_path || file.url, '_blank');
    }
  }

  uploadFile(file: File, assetCode: string): Observable<any> {
    const request = {
      ...this.commonService.commonPayload(),
      code: '',
      entity_id: assetCode,
      entity: 'asset',
      document_type: 28, // Document / Attachment type
      document_no: 'DOC-' + Math.floor(Math.random() * 1000000),
      issue_date: new Date().toISOString().substring(0, 10),
      expiry_date: new Date(Date.now() + 365*24*60*60*1000).toISOString().substring(0, 10),
      issuing_authority: 'System',
      share_with_tenants: true,
      share_with_landlords: true
    };
    const formData = new FormData();
    formData.append('reqObject', JSON.stringify(request));
    formData.append('file_path', file);
    return this.portfolioService.saveAttachment(formData);
  }
 
}
// Force compile 2
