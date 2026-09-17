import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule,ActivatedRoute } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonService } from '../../../../services/common.service';
import { Common_TabsService } from '../../../portfolio/services/common_tabs.service';
import { PropertiesService } from '../../../portfolio/services/properties.service';
import {FacilityService} from '../../facility.service'
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Observable } from 'rxjs'; 
import { FlowbiteDatepickerDirective } from '../../../../shared/directives/flowbite-datepicker.directive';
@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [CommonModule, FormsModule,FlowbiteDatepickerDirective, RouterModule, NgSelectModule],
  templateUrl: './create-ticket.component.html',
  styleUrl: './create-ticket.component.scss'
})
export class CreateTicketComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute); 
  private facilityService = inject(FacilityService);
  private commonService = inject(CommonService);
  private commtabservice = inject(Common_TabsService);
  private propertiesService = inject(PropertiesService);
  private toastr = inject(ToastrService); 

  currentUser = this.commonService.getCurrentUser(); 
  beforeImages: File[] = [];
  afterImages: File[] = [];
  videos: File[] = [];
  attachments: File[] = [];
  
  form : any= {
    title:'',
    description :'',
    selectedTitle:'',
    selectedProperty:'',
    selectedUnit:'',
    selectedCommonArea:'',
    selectedContact:'',
    selectedSource:0,
    dateValue:'',
    selectedVisitingSlot:0,
    selectedPriority:'',
    selectedDepartment:'',
    selectedUser:'',
    selectedCategory:'',
    selectedSubCategory:'',
    newTag : ''
  }
  editId:any='';

  properties :any=[]; 
  units :any=[]; 
  commonAreas :any=[]; 
  contacts :any=[]; ; 
  attachfiles:any=[];
  sources :any=[];  
  visitingSlots :any=[];; 
  priorities = ['Low', 'Medium', 'High', 'Emergency']; 

  departments :any=[];//= ['Facility Group', 'Accounting Group', 'Lease Group', 'Security Group']; 
  users :any=[];  
  categories :any=[]; 
  subCategories :any=[]; 

  tags: string[] = [];
  

  ngOnInit() {
    this.loadmasters(81, 1, '', ''); 
    this.route.paramMap.subscribe((params) => {
      this.editId=params.get('code'); 
      if(this.editId)
      this.loadTicketDetails();
    });


  }
  loadTicketDetails() {
    const payload = {
      typeId: 82,
      filterId: 0,
      filterText: this.editId,
      filterText1: "",
      userId: this.currentUser?.userId || 1,
      clientId: this.currentUser?.clientId || "74BB6922",
      companyId: this.currentUser?.companyId || 1
    };

    this.commtabservice.getMasterByType(payload).subscribe({
      next: (res: any) => {
        if (res && res.objResult) {
          const details = res.objResult.ticketdtls || res.objResult.table || res.objResult;
          if (Array.isArray(details) && details.length > 0) {
            const data = details[0];
            this.form = { 
              title:data.title || "",
            description :data.description || "",
            selectedTitle:'',
            selectedProperty:data.property_code || "",
            selectedUnit:'',
            selectedCommonArea:data.common_area,
            selectedContact:data.contact_code,
            selectedSource:data.source || "",
            dateValue:this.commonService.formatDateForInput(data.date),
            selectedVisitingSlot:data.visiting_slot,
            selectedPriority:data.priority,
            selectedDepartment:data.department_id,
            selectedUser:data.assigned_user,
            selectedCategory:data.ticket_category,
            selectedSubCategory:'',
            newTag : data.tags} ;
            // this.description = data.description || "";
            // this.selectedProperty = data.property_code || null;
             this.loadmasters(44, 0, 'units', data.property_code);
             this.loadmasters(2, 53, 'subCategories', this.form.selectedCategory);
             this.attachfiles=res.objResult.documents || [];
             if(this.attachments.length>0){

              this.beforeImages = this.attachfiles.filter((d:any) => d.document_type == 30 || d.document_type_name === 'Before Image');
              this.afterImages = this.attachfiles.filter((d:any) => d.document_type == 29 || d.document_type_name === 'After Image');
              this.videos = this.attachfiles.filter((d:any) => d.document_type == 28);
              }
            setTimeout(() => {
              this.form.selectedUnit = data.unit_code || null;
              this.form.selectedSubCategory = data.ticket_sub_category || null;
            }, 500); 
            if (data.tags) {
              this.form.tags = data.tags.split(',').filter((t: string) => t.trim() !== "");
            }
          }
 
         
         
        }
      },
      error: (err: any) => console.error("Error loading work order details:", err)
    });
  }
  onPropertyChange(ev:any) {
    this.form.selectedUnit = null;
    this.units = [];
    this.form.selectedProperty=ev.code;
    if (this.form.selectedProperty) {
      this.loadmasters(44, 0, 'units', this.form.selectedProperty);
    }
  }
  onCategoryChanged(ev:any){
    this.form.selectedSubcategory=null;
    this.subCategories=[];
    this.form.selectedCategory=ev.code;
    if (this.form.selectedCategory) {
      this.loadmasters(2, 53, 'subCategories', this.form.selectedCategory);
    }
  }
  loadmasters(typeId: number, filterId: number, targetProperty: string, filterText: string) {
    this.commtabservice.getMasterByType({
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
            this.properties = res.objResult.properties || [];
            this.contacts = res.objResult.tenants || [];
            this.sources = res.objResult.source || []; 
            this.categories = res.objResult.category || [];
            this.visitingSlots = res.objResult.visitingslot || [];
            this.departments = res.objResult.department || [];
            this.users=res.objResult.users || [];
          }
          //(this as any)[targetProperty] = res.objResult.table || [];
        }
      },
      error: (err) => {
        console.error(`Error fetching lookup ${filterId}:`, err);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/facility/tickets']);
  }

 
  createTicket() {
    if(this.form.title== null || this.form.title==""){
      this.toastr.error("Invalid Title");
      return;
    }
    else if(this.form.selectedProperty== null || this.form.selectedProperty==""){
      this.toastr.error("Invalid Property");
      return;
    } 
    else if(this.form.selectedCategory== null || this.form.selectedCategory==""){
      this.toastr.error("Invalid Category");
      return;
    }
    else if(this.form.selectedPriority== null || this.form.selectedPriority==""){
      this.toastr.error("Invalid Priority");
      return;
    } 

    const payload = {
      userid: this.currentUser?.userId || 1,
      company_id: this.currentUser?.companyId || 1,
      clientId: this.currentUser?.clientId || "74BB6922",
      source: "web",
      languageid: 1,
      property_code: this.form.selectedProperty || "",
      unit_code: this.form.selectedUnit || "", 
      contact: this.form.selectedContact,
      common_area: this.form.selectedCommonArea || "",
      maintenance_category: Number(this.form.selectedCategory) || 0,
      maintenance_subcategory: Number(this.form.selectedSubCategory) || 0, 
      code: this.editId || "",
      title: this.form.title,
      description: this.form.description,
      priority: this.form.selectedPriority || "",
      available_date:this.commonService.parseInputDate(this.form.dateValue), 
      visiting_slot: this.form.selectedVisitingSlot || 0,
      status: 1, 
      source_id: this.form.selectedSource || 0, 
      department_id: this.form.selectedDepartment || 0, 
      tags: this.tags.join(','),
      assigned_to: this.form.selectedUser 
    };

    this.facilityService.saveTicket(payload).subscribe({
      next: (res: any) => {
        if (res && (res.statusCode == 200 || res.statusCode == "200" || res.isSuccess)) {
          const workOrderCode = res.objResult.table[0]?.code || "";

          // Prepare file upload tasks
          const uploadTasks: Observable<any>[] = [];

          this.beforeImages.forEach(file => {
            uploadTasks.push(this.uploadFile(file, 'Before Image', workOrderCode));
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
                this.toastr.success("Ticket and all files saved successfully");
                this.goBack();
              },
              error: (err) => {
                 
                this.toastr.warning("Ticket saved, but some files failed to upload");
                this.goBack();
              }
            });
          } else {
            this.toastr.success( "Ticket saved successfully");
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
    else if (documentType === 'Video') docTypeInt = 27; // Photo
    else if (documentType === 'Attachment') docTypeInt = 28; // Document

    const request = {
      ...this.commonService.commonPayload(),
      code: '',
      entity_id: workOrderCode,
      entity: 'Tickets',
      document_type: docTypeInt,
      document_no: 'DOC-' + Math.floor(Math.random() * 1000000),
      issue_date: new Date().toISOString().substring(0, 10),
      expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
      issuing_authority: 'System',
      share_with_tenants: true,
      status:33,
      share_with_landlords: true
    };
    const formData = new FormData();
    formData.append('reqObject', JSON.stringify(request));
    formData.append('file_path', file);
    return this.commonService.saveAttachment(formData);
  }

  addTag(): void {
    const value = this.form.newTag.trim().replace(/,$/, '');
    if (!value) {
      return;
    }
    if (!this.tags.includes(value)) {
      this.tags.push(value);
    }
    this.form.newTag = '';
  }

  onTagInputKey(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === 'Tab' || event.key === ',') {
      event.preventDefault();
      this.addTag();
    }
  }

  removeTag(index: number): void {
    this.tags.splice(index, 1);
  }

  removeFile(index: number, type:  'photos' | 'videos' | 'other') { 
    if (type === 'photos') this.beforeImages.splice(index, 1);
    if (type === 'videos') this.afterImages.splice(index, 1); 
    if (type === 'other') this.attachments.splice(index, 1);
  }

  onMediaSelected(_event: any, _kind: 'photos' | 'videos' | 'other'): void {
    const files = _event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        if (_kind === 'photos') this.beforeImages.push(files[i]);
        if (_kind === 'other') this.afterImages.push(files[i]);
        if (_kind === 'videos') this.videos.push(files[i]); 
      }
    }
  }
}
