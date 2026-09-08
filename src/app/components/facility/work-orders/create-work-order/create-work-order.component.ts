import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { PortfolioService } from '../../../portfolio/services/portfolio.service';
import { CommonService } from '../../../../services/common.service';
import { PropertiesService } from '../../../portfolio/services/properties.service';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Observable } from 'rxjs'; 
import { FlowbiteDatepickerDirective } from '../../../../shared/directives/flowbite-datepicker.directive';
@Component({
  selector: 'app-create-work-order',
  standalone: true,
  imports: [CommonModule,FlowbiteDatepickerDirective, FormsModule, NgSelectModule],
  templateUrl: './create-work-order.component.html',
  styleUrl: './create-work-order.component.scss'
})
export class CreateWorkOrderComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private portfolioService = inject(PortfolioService);
  private commonService = inject(CommonService);
  private propertiesService = inject(PropertiesService);
  private toastr = inject(ToastrService);
  private sanitizer = inject(DomSanitizer);

  editId: string | null = null;

  branches = ['Main Branch', 'Branch A'];
  buildings = ['All Buildings', 'Building 1'];

  // Form Models
  title: string = '';
  description: string = '';

  properties: any[] = [];
  selectedProperty: string | null = null;
  units: any[] = [];
  selectedUnit: string | null = null;
  commonAreas = ['Select', 'Lobby'];
  selectedCommonArea: string | null = null;
  floors = ['Select', '1st Floor'];
  selectedFloor: string | null = null;
  currentUser = this.commonService.getCurrentUser();
  responsiblePeople: any[] = [];
  selectedResponsiblePerson: string | null = null;
  tenants: any[] = [];
  selectedTenant: string | null = null;
  techincians: any[] = [];
  selectedTechincian: string | null = null;
  vendors: any[] = [];
  selectedVendor: string | null = null;

  tags: string[] = [];
  newTag: string = '';

  categories: any[] = [];
  selectedCategory: any = null;
  subcategories: any[] = [];
  selectedSubcategory: any = null;
  priorities = ['Select', 'Normal', 'High', 'Medium', 'Low'];
  selectedPriority: string | null = null;
  durationTypes = ['Select', 'Hours', 'Days'];
  selectedDurationType: string | null = null;
  duration: string = '';
  visitingHours : any =[];
  selectedVisitingHours: any =0;
  dueDate: string = '';
  availableDate: string = '';

  beforeImages: File[] = [];
  afterImages: File[] = [];
  videos: File[] = [];
  attachments: File[] = [];
  attachfiles:any=[];

  ngOnInit() {
    this.loadmasters(39, 1, '', ''); 
    this.route.paramMap.subscribe((params) => {
      this.editId=params.get('code'); 
      if(this.editId)
      this.loadWorkOrderDetails();
    });


  }
  onUnitChange() {
    if (this.selectedUnit) {
      this.selectedFloor = this.units.filter(item => item.code = this.selectedUnit)[0]?.floor_no || 0;
    }
  }

  onPropertyChange() {
    this.selectedUnit = null;
    this.units = [];
    if (this.selectedProperty) {
      this.loadmasters(44, 0, 'units', this.selectedProperty);
    }
  }

  onCategoryChange() {
    this.selectedSubcategory = null;
    this.subcategories = [];
    if (this.selectedCategory) {
      this.loadmasters(2, 31, 'subcategories',String(this.selectedCategory)); 
    }
  }

  loadmasters(typeId: number, filterId: number, targetProperty: string, filterText: string) {
    this.portfolioService.getMasterByType({
      typeId: typeId,
      filterId: filterId,
      filterText: filterText,
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult) {
          if (typeId == 44) {
            (this as any)[targetProperty] = res.objResult.table || [];
            this.commonAreas = res.objResult.table1 || [];
          } 
          else  if (typeId == 2) {
            (this as any)[targetProperty] = res.objResult.table || []; 
          }
          else {
            this.techincians = res.objResult.users || [];
            this.vendors = res.objResult.vendors || [];
            this.responsiblePeople = res.objResult.managers || [];
            this.properties = res.objResult.properties || [];
            this.categories = res.objResult.categories || [];
            this.visitingHours = res.objResult.visitingslots || [];
          }
          //(this as any)[targetProperty] = res.objResult.table || [];
        }
      },
      error: (err) => {
        console.error(`Error fetching lookup ${filterId}:`, err);
      }
    });
  }

  goBack() {
    this.router.navigate(['/facility/work-orders']);
  }

  saveWorkOrder() {
    if(this.title== null || this.title==""){
      this.toastr.error("Invalid Title");
      return;
    }
    else if(this.selectedProperty== null || this.selectedProperty==""){
      this.toastr.error("Invalid Property");
      return;
    } 
    else if(this.selectedCategory== null || this.selectedCategory==""){
      this.toastr.error("Invalid Category");
      return;
    }
    else if(this.selectedPriority== null || this.selectedPriority==""){
      this.toastr.error("Invalid Priority");
      return;
    }
    else if(this.selectedPriority== null || this.selectedPriority==""){
      this.toastr.error("Invalid Priority");
      return;
    }

    const payload = {
      userid: this.currentUser?.userId || 1,
      company_id: this.currentUser?.companyId || 1,
      clientId: this.currentUser?.clientId || "74BB6922",
      source: "web",
      languageid: 1,
      property_code: this.selectedProperty || "",
      unit_code: this.selectedUnit || "",
      room_code: "",
      is_from_unit: !!this.selectedUnit,
      asset_code: "",
      common_area: this.selectedCommonArea || "",
      maintenance_category: Number(this.selectedCategory) || 0,
      maintenance_subcategory: Number(this.selectedSubcategory) || 0,
      estimation_duration_type: this.selectedDurationType || "",
      estimation_duration: Number(this.duration) || 0,
      code: this.editId || "",
      title: this.title,
      description: this.description,
      priority: this.selectedPriority || "",
      due_date:this.commonService.parseInputDate(this.dueDate),
      available_date:this.commonService.parseInputDate(this.availableDate),
      visiting_slot: this.selectedVisitingHours || 0,
      status: 1,
      responsible_user: this.selectedResponsiblePerson || 0,
      technician_id: this.selectedTechincian || 0,
      vendor_id: this.selectedVendor || 0,
      tags: this.tags.join(','),
      assigned_to: this.selectedResponsiblePerson 
    };

    this.portfolioService.saveWorkOrder(payload).subscribe({
      next: (res: any) => {
        if (res && (res.statusCode == 200 || res.statusCode == "200" || res.isSuccess)) {
          const workOrderCode = res.objResult.table[0]?.code || "";

          // Prepare file upload tasks
          const uploadTasks: Observable<any>[] = [];

          this.beforeImages.forEach(file => {
            uploadTasks.push(this.uploadFile(file, 'Before Image', workOrderCode));
          });
          this.afterImages.forEach(file => {
            uploadTasks.push(this.uploadFile(file, 'After Image', workOrderCode));
          });
          this.videos.forEach(file => {
            uploadTasks.push(this.uploadFile(file, 'Video', workOrderCode));
          });
          this.attachments.forEach(file => {
            uploadTasks.push(this.uploadFile(file, 'Attachment', workOrderCode));
          });

          if (uploadTasks.length > 0) {
            forkJoin(uploadTasks).subscribe({
              next: () => {
                this.toastr.success("Work order and all files saved successfully");
                this.goBack();
              },
              error: (err) => {
                 
                this.toastr.warning("Work order saved, but some files failed to upload");
                this.goBack();
              }
            });
          } else {
            this.toastr.success( "Work order saved successfully");
            this.goBack();
          }
        } else {
          this.toastr.error(res.message || "Failed to save work order");
        }
      },
      error: (err: any) => {
         
        this.toastr.error("An error occurred while saving the work order");
      }
    });
  }

  uploadFile(file: File, documentType: string, workOrderCode: string): Observable<any> {
    let docTypeInt = 28; // Default to Document (28)
    if (documentType === 'Before Image') docTypeInt = 30;
    else if (documentType === 'After Image') docTypeInt = 29;
    else if (documentType === 'Video') docTypeInt = 27; // Photo
    else if (documentType === 'Attachment') docTypeInt = 28; // Document

    const request = {
      ...this.commonService.commonPayload(),
      code: '',
      entity_id: workOrderCode,
      entity: 'workorder',
      document_type: docTypeInt,
      document_no: 'DOC-' + Math.floor(Math.random() * 1000000),
      issue_date: new Date().toISOString().substring(0, 10),
      expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
      issuing_authority: 'System',
      share_with_tenants: true,
      share_with_landlords: true
    };
    const formData = new FormData();
    formData.append('reqObject', JSON.stringify(request));
    formData.append('file_path', file);
    return this.portfolioService.saveAttachment(formData);
  }

  getFileObjectURL(file: File): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
  }

  addTag(event: Event) {
    event.preventDefault();
    if (this.newTag.trim()) {
      this.tags.push(this.newTag.trim());
      this.newTag = '';
    }
  }

  removeTag(index: number) {
    this.tags.splice(index, 1);
  }

  // File Handling
  onFileSelected(event: any, type: 'before' | 'after' | 'video' | 'attachment') {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        if (type === 'before') this.beforeImages.push(files[i]);
        if (type === 'after') this.afterImages.push(files[i]);
        if (type === 'video') this.videos.push(files[i]);
        if (type === 'attachment') this.attachments.push(files[i]);
      }
    }
  }

  removeFile(index: number, type: 'before' | 'after' | 'video' | 'attachment') { 
    if (type === 'before') this.beforeImages.splice(index, 1);
    if (type === 'after') this.afterImages.splice(index, 1);
    if (type === 'video') this.videos.splice(index, 1);
    if (type === 'attachment') this.attachments.splice(index, 1);
  }


  loadWorkOrderDetails() {
    const payload = {
      typeId: 21,
      filterId: 0,
      filterText: this.editId,
      filterText1: "",
      userId: this.currentUser?.userId || 1,
      clientId: this.currentUser?.clientId || "74BB6922",
      companyId: this.currentUser?.companyId || 1
    };

    this.propertiesService.getMasterDetails(payload).subscribe({
      next: (res: any) => {
        if (res && res.objResult) {
          const details = res.objResult.work_orders || res.objResult.table || res.objResult;
          if (Array.isArray(details) && details.length > 0) {
            const data = details[0];
            this.title = data.title || "";
            this.description = data.description || "";
            this.selectedProperty = data.property_code || null;
            this.loadmasters(44, 0, 'units', data.property_code);
           
            setTimeout(() => {
              this.selectedUnit = data.unit_code || null;
              this.selectedSubcategory = data.maintenance_subcategory || null;
            }, 500);

            this.selectedCommonArea = data.common_area || null;
            this.selectedCategory = data.maintenance_category || null;
            this.loadmasters(2, 31, 'subcategories',String(this.selectedCategory)); 
             

            this.selectedDurationType = data.estimation_duration_type || null;
            this.duration = data.estimation_duration || "";
            this.selectedVisitingHours =Number(data.visiting_slot) || 0;
            this.selectedPriority=data.priority || '';
            this.dueDate =this.commonService.formatDateForInput(data.due_date);
            this.availableDate =this.commonService.formatDateForInput(data.available_date); 

            this.selectedResponsiblePerson = data.assigned_to || 0;
            this.selectedTechincian = data.technician_id || 0; 

            this.selectedVendor = data.vendor_id || data.vendor_code || data.vendor;
            

            // const tenantVal = data.tenant_code || data.tenant;
            // if (tenantVal) {
            //   const match = this.tenants.find(t => String(t.code) === String(tenantVal) || String(t.name) === String(tenantVal));
            //   this.selectedTenant = match ? match.code : tenantVal;
            //   this.onTenantChange();
            // }

            if (data.tags) {
              this.tags = data.tags.split(',').filter((t: string) => t.trim() !== "");
            }
          }
 
          this.attachfiles=res.objResult.table2 || [];
         
        }
      },
      error: (err: any) => console.error("Error loading work order details:", err)
    });
  }

  selectedTenantDetails: any = null;

  // onTenantChange() {
  //   if (!this.selectedTenant) {
  //     this.selectedTenantDetails = null;
  //     return;
  //   }

  //   const selectedItem = this.tenants.find(t => t.code === this.selectedTenant);
  //   if (!selectedItem) {
  //     this.selectedTenantDetails = null;
  //     return;
  //   }

  //   const queryDetails = (textVal: string) => {
  //     const payload = {
  //       typeId: 27,
  //       filterId: 0,
  //       filterText: String(textVal),
  //       filterText1: "",
  //       userId: Number(localStorage.getItem('userId')) || 1,
  //       clientId: "74BB6922",
  //       companyId: Number(localStorage.getItem('companyId')) || 1
  //     };
     
  //     return this.propertiesService.getMasterDetails(payload);
  //   };

  //   queryDetails(selectedItem.code).subscribe({
  //     next: (res: any) => {
  //       console.log('typeId 27 Code Response:', res);
  //       const hasRecords = res && res.objResult && (
  //         (res.objResult.tenant_dtls && res.objResult.tenant_dtls.length > 0) ||
  //         (res.objResult.table && res.objResult.table.length > 0)
  //       );

  //       if (hasRecords) {
  //         this.mapTenantDetails(res);
  //       } else if (selectedItem.id) {
  //         console.log('No records found with code. Retrying details query with numeric ID:', selectedItem.id);
  //         queryDetails(String(selectedItem.id)).subscribe({
  //           next: (resFallback: any) => {
  //             console.log('typeId 27 Fallback Response:', resFallback);
  //             if (resFallback && resFallback.objResult) {
  //               this.mapTenantDetails(resFallback);
  //             } else {
  //               this.selectedTenantDetails = null;
  //             }
  //           },
  //           error: (err) => {
  //             console.error("Error loading tenant details with fallback ID:", err);
  //             this.selectedTenantDetails = null;
  //           }
  //         });
  //       } else {
  //         console.warn('No records found and no fallback numeric ID available.');
  //         this.selectedTenantDetails = null;
  //       }
  //     },
  //     error: (err) => {
  //       console.error("Error loading tenant details with code:", err);
  //       this.selectedTenantDetails = null;
  //     }
  //   });
  // }

  // mapTenantDetails(res: any) {
  //   const tenantList = res.objResult.tenant_dtls || res.objResult.table || (Array.isArray(res.objResult) ? res.objResult : null) || Object.values(res.objResult).find(val => Array.isArray(val)) || [];
  //   if (Array.isArray(tenantList) && tenantList.length > 0) {
  //     const data = tenantList[0];
  //     this.selectedTenantDetails = {
  //       name: data.name || data.tenant || data.tenant_name || data.column1 || data.Name || data.Tenant || '-',
  //       status: data.status || data.Status || 'Active',
  //       email: data.email || data.Email || data.email_address || '-',
  //       phone: data.mobile || data.phone || data.Mobile || data.Phone || data.mobile_no || data.phone_number || '-',
  //       type: data.tenant_type_name || data.type || data.Tenant_type_name || data.Type || 'Individual Tenant',
  //       location: data.address || data.location || data.Address || data.Location || data.address1 || '-'
  //     };
  //     console.log('Mapped Tenant Details:', this.selectedTenantDetails);
  //   }
  // }

  viewTenant() {
    if (this.selectedTenant) {
      this.router.navigate(['/contacts/tenants', this.selectedTenant]);
    }
  }

  editTenant() {
    if (this.selectedTenant) {
      this.router.navigate(['/contacts/tenants/edit', this.selectedTenant]);
    }
  }
}
