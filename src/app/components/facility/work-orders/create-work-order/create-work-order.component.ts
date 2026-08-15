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

@Component({
  selector: 'app-create-work-order',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
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

  responsiblePeople: any[] = [];
  selectedResponsiblePerson: string | null = null;
  tenants: any[] = [];
  selectedTenant: string | null = null;
  vendors: any[] = [];
  selectedVendor: string | null = null;

  tags: string[] = ['Error'];
  newTag: string = '';

  categories: any[] = [];
  selectedCategory: any = null;
  subcategories: any[] = [];
  selectedSubcategory: any = null;
  priorities = ['Select', 'High', 'Medium', 'Low'];
  selectedPriority: string | null = null;
  durationTypes = ['Select', 'Hours', 'Days'];
  selectedDurationType: string | null = null;
  duration: string = '';
  visitingHours = ['Select', '9:00 AM - 5:00 PM'];
  selectedVisitingHours: string | null = null;
  dueDate: string = '';
  availableDate: string = '';

  beforeImages: File[] = [];
  afterImages: File[] = [];
  videos: File[] = [];
  attachments: File[] = [];

  ngOnInit() {
    this.loadLookup(30, 'categories', 'lookup_name');
    this.loadResponsiblePeople();
    this.loadTenants();
    this.loadVendors();

    // Temporary diagnostic: query actual tenants list to inspect codes
    this.propertiesService.getTenants({
      userid: Number(localStorage.getItem('userId')) || 1,
      company_id: Number(localStorage.getItem('companyId')) || 1,
      clientId: "74BB6922",
      source: 'web',
      languageid: 1,
      page_no: 0,
      seqno: 0,
      search_keyword: '',
      pagecount: 5,
      filter_by: '',
      filter_list: '',
      featureid: 'TENANTS'
    }).subscribe(res => {
      console.log('Diagnostic getTenants list response:', res);
    });

    this.loadProperties(() => {
      this.route.params.subscribe(params => {
        if (params['id']) {
          this.editId = params['id'];
          this.loadWorkOrderDetails();
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
    this.selectedUnit = null;
    this.units = [];
    if (this.selectedProperty) {
      this.portfolioService.getMasterByType({
        typeId: 3,
        filterId: 0,
        filterText: this.selectedProperty,
        filterText1: ''
      }).subscribe({
        next: (res: any) => {
          if (res.statusCode == 200 && res.objResult && res.objResult.table) {
            this.units = res.objResult.table.map((u: any) => ({
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
    this.selectedSubcategory = null;
    this.subcategories = [];
    if (this.selectedCategory) {
      this.portfolioService.getMasterByType({
        typeId: 2,
        filterId: 31,
        filterText: String(this.selectedCategory),
        filterText1: ''
      }).subscribe({
        next: (res: any) => {
          if (res.statusCode == 200 && res.objResult && res.objResult.table) {
            this.subcategories = res.objResult.table.map((item: any) => ({
              id: item.id,
              name: item.lookup_name || item.name || ''
            }));
          }
        },
        error: (err) => {
          console.error('Error fetching subcategories:', err);
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
    this.router.navigate(['/facility/work-orders']);
  }

  saveWorkOrder() {
    const currentUser = this.commonService.getCurrentUser();
    
    const payload = {
      userid: currentUser?.userId || 1,
      company_id: currentUser?.companyId || 1,
      clientId: currentUser?.clientId || "74BB6922",
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
      due_date: this.dueDate ? new Date(this.dueDate).toISOString() : new Date().toISOString(),
      available_date: this.availableDate ? new Date(this.availableDate).toISOString() : new Date().toISOString(),
      visiting_slot: this.selectedVisitingHours || "",
      status: 1,
      responsible_user: this.selectedResponsiblePerson || "",
      technician_id: "",
      vendor_id: this.selectedVendor || "",
      tags: this.tags.join(','),
      assigned_to: 0
    };

    this.portfolioService.saveWorkOrder(payload).subscribe({
      next: (res: any) => {
        if (res && (res.statusCode == 200 || res.statusCode == "200" || res.isSuccess)) {
          const workOrderCode = res.objResult?.code || res.objResult?.id || this.editId || "";
          
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
                console.error("Error uploading files:", err);
                this.toastr.warning("Work order saved, but some files failed to upload");
                this.goBack();
              }
            });
          } else {
            this.toastr.success(res.message || "Work order saved successfully");
            this.goBack();
          }
        } else {
          this.toastr.error(res.message || "Failed to save work order");
        }
      },
      error: (err: any) => {
        console.error("Error saving work order:", err);
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

  loadResponsiblePeople() {
    const currentUser = this.commonService.getCurrentUser();
    const payload = {
      typeId: 19,
      typeid: 19,
      filterId: 0,
      filterText: 's',
      filterText1: '',
      userId: Number(localStorage.getItem('userId')) || currentUser?.userId || 1,
      clientId: "74BB6922",
      companyId: Number(localStorage.getItem('companyId')) || currentUser?.companyId || 1,
      company_id: Number(localStorage.getItem('companyId')) || currentUser?.companyId || 1
    };

    console.log('loadResponsiblePeople (Technicians) Payload:', payload);
    this.propertiesService.getMasterDetails(payload).subscribe({
      next: (res: any) => {
        console.log('loadResponsiblePeople (Technicians) Response:', res);
        if (res && res.objResult) {
          const list = res.objResult.table || res.objResult.users || (Array.isArray(res.objResult) ? res.objResult : null) || Object.values(res.objResult).find(val => Array.isArray(val)) || [];
          if (Array.isArray(list)) {
            if (list.length > 0) {
              console.log('Raw Technician First Item:', JSON.stringify(list[0]));
            }
            this.responsiblePeople = list.map((item: any) => ({
              code: item.user_code || item.code || item.Code || item.User_code || item.id || item.Id || '',
              name: item.column1 || item.name || item.Name || item.lookup_name || item.Lookup_name || item.full_name || item.FullName || item.user_name || item.UserName || item.technician_name || item.Technician_name || item.code || item.Code || '-',
              id: item.id || item.Id
            }));
            console.log('Mapped responsiblePeople:', this.responsiblePeople);
          }
        }
      },
      error: (err) => console.error('Error loading technicians:', err)
    });
  }

  loadTenants() {
    const currentUser = this.commonService.getCurrentUser();
    this.portfolioService.getMastersByPaging({
      userid: Number(localStorage.getItem('userId')) || currentUser?.userId || 1,
      company_id: Number(localStorage.getItem('companyId')) || currentUser?.companyId || 1,
      clientId: "74BB6922",
      source: 'web',
      languageid: 1,
      page_no: 0,
      seqno: 0,
      search_keyword: '',
      pagecount: 100,
      filter_by: '',
      featureid: 'TENANTS'
    }).subscribe({
      next: (res: any) => {
        if (res && res.objResult) {
          const list = res.objResult.tenants || res.objResult.table || res.objResult;
          if (Array.isArray(list)) {
            this.tenants = list.map((item: any) => ({
              code: item.code || item.id || '',
              name: item.tenant || item.name || item.code || '-',
              id: item.id
            }));
            console.log('Mapped tenants from paging:', this.tenants);
          }
        }
      },
      error: (err) => console.error('Error loading tenants:', err)
    });
  }

  loadVendors() {
    const currentUser = this.commonService.getCurrentUser();
    this.portfolioService.getMastersByPaging({
      userid: Number(localStorage.getItem('userId')) || currentUser?.userId || 1,
      company_id: Number(localStorage.getItem('companyId')) || currentUser?.companyId || 1,
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
            this.vendors = list.map((item: any) => ({
              code: item.code || item.id || '',
              name: item.company_name || item.contact_name || item.name || item.code || '-',
              id: item.id
            }));
            console.log('Mapped vendors from paging:', this.vendors);
          }
        }
      },
      error: (err) => console.error('Error loading vendors:', err)
    });
  }

  loadWorkOrderDetails() {
    const currentUser = this.commonService.getCurrentUser();
    const payload = {
      typeId: 21,
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
          const details = res.objResult.work_orders || res.objResult.table || res.objResult;
          if (Array.isArray(details) && details.length > 0) {
            const data = details[0];
            this.title = data.title || "";
            this.description = data.description || "";
            this.selectedProperty = data.property_code || null;
            
            if (this.selectedProperty) {
              this.portfolioService.getMasterByType({
                typeId: 3,
                filterId: 0,
                filterText: this.selectedProperty,
                filterText1: ''
              }).subscribe((resUnit: any) => {
                if (resUnit.statusCode == 200 && resUnit.objResult && resUnit.objResult.table) {
                  this.units = resUnit.objResult.table.map((u: any) => ({
                    code: u.code || u.unit_code || u.id,
                    name: `${u.unit_code || u.code} - ${u.unit_no || u.name}`
                  }));
                  this.selectedUnit = data.unit_code || null;
                }
              });
            }
            
            this.selectedCommonArea = data.common_area || null;
            this.selectedCategory = data.maintenance_category || null;
            
            if (this.selectedCategory) {
              this.portfolioService.getMasterByType({
                typeId: 2,
                filterId: 31,
                filterText: String(this.selectedCategory),
                filterText1: ''
              }).subscribe((resSub: any) => {
                if (resSub.statusCode == 200 && resSub.objResult && resSub.objResult.table) {
                  this.subcategories = resSub.objResult.table.map((item: any) => ({
                    id: item.id,
                    name: item.lookup_name || item.name || ''
                  }));
                  this.selectedSubcategory = data.maintenance_subcategory || null;
                }
              });
            }
            
            this.selectedDurationType = data.estimation_duration_type || null;
            this.duration = data.estimation_duration || "";
            this.selectedVisitingHours = data.visiting_slot || null;
            
            if (data.due_date) {
              this.dueDate = data.due_date.substring(0, 10);
            }
            if (data.available_date) {
              this.availableDate = data.available_date.substring(0, 10);
            }
            
            const respVal = data.responsible_user || data.responsible_user_code || data.responsiblePerson;
            if (respVal) {
              const match = this.responsiblePeople.find(r => String(r.code) === String(respVal) || String(r.name) === String(respVal));
              this.selectedResponsiblePerson = match ? match.code : respVal;
            }
            
            const vendVal = data.vendor_id || data.vendor_code || data.vendor;
            if (vendVal) {
              const match = this.vendors.find(v => String(v.code) === String(vendVal) || String(v.name) === String(vendVal));
              this.selectedVendor = match ? match.code : vendVal;
            }
            
            const tenantVal = data.tenant_code || data.tenant;
            if (tenantVal) {
              const match = this.tenants.find(t => String(t.code) === String(tenantVal) || String(t.name) === String(tenantVal));
              this.selectedTenant = match ? match.code : tenantVal;
              this.onTenantChange();
            }
            
            if (data.tags) {
              this.tags = data.tags.split(',').filter((t: string) => t.trim() !== "");
            }
          }
        }
      },
      error: (err: any) => console.error("Error loading work order details:", err)
    });
  }

  selectedTenantDetails: any = null;

  onTenantChange() {
    if (!this.selectedTenant) {
      this.selectedTenantDetails = null;
      return;
    }

    const selectedItem = this.tenants.find(t => t.code === this.selectedTenant);
    if (!selectedItem) {
      this.selectedTenantDetails = null;
      return;
    }

    const queryDetails = (textVal: string) => {
      const payload = {
        typeId: 27,
        filterId: 0,
        filterText: String(textVal),
        filterText1: "",
        userId: Number(localStorage.getItem('userId')) || 1,
        clientId: "74BB6922",
        companyId: Number(localStorage.getItem('companyId')) || 1
      };
      console.log('Querying typeId 27 for:', textVal, 'with payload:', payload);
      return this.propertiesService.getMasterDetails(payload);
    };

    queryDetails(selectedItem.code).subscribe({
      next: (res: any) => {
        console.log('typeId 27 Code Response:', res);
        const hasRecords = res && res.objResult && (
          (res.objResult.tenant_dtls && res.objResult.tenant_dtls.length > 0) || 
          (res.objResult.table && res.objResult.table.length > 0)
        );

        if (hasRecords) {
          this.mapTenantDetails(res);
        } else if (selectedItem.id) {
          console.log('No records found with code. Retrying details query with numeric ID:', selectedItem.id);
          queryDetails(String(selectedItem.id)).subscribe({
            next: (resFallback: any) => {
              console.log('typeId 27 Fallback Response:', resFallback);
              if (resFallback && resFallback.objResult) {
                this.mapTenantDetails(resFallback);
              } else {
                this.selectedTenantDetails = null;
              }
            },
            error: (err) => {
              console.error("Error loading tenant details with fallback ID:", err);
              this.selectedTenantDetails = null;
            }
          });
        } else {
          console.warn('No records found and no fallback numeric ID available.');
          this.selectedTenantDetails = null;
        }
      },
      error: (err) => {
        console.error("Error loading tenant details with code:", err);
        this.selectedTenantDetails = null;
      }
    });
  }

  mapTenantDetails(res: any) {
    const tenantList = res.objResult.tenant_dtls || res.objResult.table || (Array.isArray(res.objResult) ? res.objResult : null) || Object.values(res.objResult).find(val => Array.isArray(val)) || [];
    if (Array.isArray(tenantList) && tenantList.length > 0) {
      const data = tenantList[0];
      this.selectedTenantDetails = {
        name: data.name || data.tenant || data.tenant_name || data.column1 || data.Name || data.Tenant || '-',
        status: data.status || data.Status || 'Active',
        email: data.email || data.Email || data.email_address || '-',
        phone: data.mobile || data.phone || data.Mobile || data.Phone || data.mobile_no || data.phone_number || '-',
        type: data.tenant_type_name || data.type || data.Tenant_type_name || data.Type || 'Individual Tenant',
        location: data.address || data.location || data.Address || data.Location || data.address1 || '-'
      };
      console.log('Mapped Tenant Details:', this.selectedTenantDetails);
    }
  }

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
