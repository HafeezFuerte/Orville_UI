import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule,ActivatedRoute } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { PM_FORM_OPTIONS } from '../preventive-maintenance.data';
import { CommonService } from '../../../../services/common.service';
import { Common_TabsService } from '../../../portfolio/services/common_tabs.service';
import { PropertiesService } from '../../../portfolio/services/properties.service';
import {FacilityService} from '../../facility.service'
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Observable } from 'rxjs'; 
import { FlowbiteDatepickerDirective } from '../../../../shared/directives/flowbite-datepicker.directive';
@Component({
  selector: 'app-create-preventive-maintenance',
  standalone: true,
  imports: [CommonModule,FlowbiteDatepickerDirective, FormsModule, RouterModule, NgSelectModule],
  templateUrl: './create-preventive-maintenance.component.html',
  styleUrl: './create-preventive-maintenance.component.scss'
})
export class CreatePreventiveMaintenanceComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute); 
  private facilityService = inject(FacilityService);
  private commonService = inject(CommonService);
  private commtabservice = inject(Common_TabsService);
  private propertiesService = inject(PropertiesService);
  private toastr = inject(ToastrService);  

  currentUser = this.commonService.getCurrentUser(); 
  timeSpans= ['Days', 'Weeks', 'Months', 'Years'];
  form : any= {
  name :'',
  startDate : '',
  firstPpmDate : '',
  endsOn :'',
  every :0,
  timeSpan: '',
  createDaysBefore : 0,

  selectedProperty: '',
  selectedUnit: '',
  selectedCommonArea:'',
  selectedAsset : '',

  workOrderTitle : '',
  workOrderDetails : '',
  selectedCategory: '',

  responsiblePerson : '',
  selectedTechnicians:  [],
  selectedVendor: '',
  allowPostPpm : false,
  checklistItems:[''],
  }
  editId:any='';
  properties :any=[];  categories :any=[];
  units :any=[]; 
  commonAreas :any=[]; responsibleusers :any=[]; 
  technicians :any=[];    vendors :any=[];   
  assets :any=[]; 
  goBack(): void {
    this.router.navigate(['/facility/preventive-maintenance']);
  }

  ngOnInit() {
    this.loadmasters(84, 1, '', '',''); 
    this.route.paramMap.subscribe((params) => {
      this.editId=params.get('code'); 
      if(this.editId)
      this.loadPMDetails();
    });


  }
  
  loadPMDetails() {
    const payload = {
      typeId: 85,
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
            workOrderTitle:data.title || "",
            workOrderDetails :data.description || "",
            name :data.name || "", 
            property_name:data.property || "",
            property_unit:data.unitcode || "", 
            status: this.commonService.getArabicLookupName(data,'status_nm'),
            startDate: this.commonService.formatDateForInput(data.start_date) || 'N/A',
            firstPpmDate: this.commonService.formatDateForInput(data.first_ppm_date) || 'N/A',
            endsOn: this.commonService.formatDateForInput(data.end_on) || 'N/A',
            selectedProperty:data.property_code || "",
            selectedUnit:data.unit_code || "",
            selectedCommonArea:data.common_area,

            every: Number(data.on_every) || 0, 
            createDaysBefore: Number(data.create_every) || 0, 
            timeSpan: data.time_span || "",

            responsiblePerson: data.responsible_code || "",
            selectedTechnicians: data.technician_code || "",
            selectedVendor: data.vendor_code || "",
            selectedAsset: data.asset_code || "",
            allowPostPpm:data.allow_inspection_post_ppm || false,  
            selectedCategory:data.category_id,
         
            newTag : data.tags} ;
            // this.description = data.description || "";
            // this.selectedProperty = data.property_code || null;
             this.loadmasters(44, 0, 'units', data.property_code,''); 
             this.loadmasters(18, 0, 'assets', data.property_code, data.unit_code); 
            setTimeout(() => {
              this.form.selectedUnit = data.unit_code || null; 
            }, 500); 
            if (data.checklist) {
              this.form.checklistItems = data.checklist.split(',').filter((t: string) => t.trim() !== "");
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
      this.loadmasters(44, 0, 'units', this.form.selectedProperty,'');
    }
  } 
  onUnitChange(ev:any) {
    this.form.selectedAsset = null;
    this.assets = [];
    this.form.selectedUnit=ev.code;
    if (this.form.selectedUnit) {
      this.loadmasters(18, 0, 'assets', this.form.selectedProperty,this.form.selectedUnit);
    }
  } 
  loadmasters(typeId: number, filterId: number, targetProperty: string, filterText: string, filterText1: string) {
    this.commtabservice.getMasterByType({
      typeId: typeId,
      filterId: filterId,
      filterText: filterText,
      filterText1: filterText1
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult) {
          if (typeId == 44) {
            (this as any)[targetProperty] = res.objResult.table || [];
            this.commonAreas = res.objResult.table1 || []; 
          } 
          else  if (typeId == 18) {
            (this as any)[targetProperty] = res.objResult.table || []; 
          }
          else  if (typeId == 2) {
            (this as any)[targetProperty] = res.objResult.table || []; 
          }
          else {
            this.properties = res.objResult.properties || [];
            this.technicians = res.objResult.techicians || []; 
            this.responsibleusers=res.objResult.managers || [];
            this.categories=res.objResult.categories || [];
            this.vendors=res.objResult.vendors || []; 
          }
          //(this as any)[targetProperty] = res.objResult.table || [];
        }
      },
      error: (err) => {
        console.error(`Error fetching lookup ${filterId}:`, err);
      }
    });
  }
 
  create() {
    if(this.form.workOrderTitle== null || this.form.workOrderTitle==""){
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
      every: Number(this.form.every) || 0, 
      create_every: Number(this.form.createDaysBefore) || 0, 
      time_span: this.form.timeSpan || "",
      code: this.editId || "",
      name:this.form.name, 
      workorder_title: this.form.workOrderTitle,
      workorder_description: this.form.workOrderDetails, 
      description:this.form.workOrderDetails,
      start_date:this.commonService.parseInputDate(this.form.startDate), 
      first_ppm_date:this.commonService.parseInputDate(this.form.firstPpmDate),
      ends_on:this.commonService.parseInputDate(this.form.endsOn),
      responsible_person: this.form.responsiblePerson || "",
      technician_code: this.form.selectedTechnicians || "",
      vendor_code: this.form.selectedVendor || "",
      asset_code: this.form.selectedAsset || "",
      allow_post_ppm_inspection:this.form.allowPostPpm || false,
      status: 1, 
      source_id: this.form.selectedSource || 0, 
      tags:this.form.checklistItems.join(','),
      department_id: this.form.selectedDepartment || 0,  
      assigned_to: this.form.selectedUser 
    };

    this.facilityService.savePreventiveMaintenence(payload).subscribe({
      next: (res: any) => {
        if (res && (res.statusCode == 200 || res.statusCode == "200" || res.isSuccess)) { 
          this.toastr.success( "Ticket saved successfully");
          this.goBack();

           
        } else {
          this.toastr.error(res.message || "Failed to save ticket");
        }
      },
      error: (err: any) => {
         
        this.toastr.error("An error occurred while saving the ticket");
      }
    });
  }
  addChecklistItem(): void {
    this.form.checklistItems = [...this.form.checklistItems, ''];
  }

  removeChecklistItem(index: number): void {
    if (this.form.checklistItems.length <= 1) {
      this.form.checklistItems = [''];
      return;
    }
    this.form.checklistItems = this.form.checklistItems.filter((i:any) => i !== index);
  }

  trackByIndex(index: number): number {
    return index;
  }
}
