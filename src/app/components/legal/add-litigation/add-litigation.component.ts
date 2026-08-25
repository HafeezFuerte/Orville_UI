import { Component, OnInit, inject } from '@angular/core';
import { CommonModule,formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { Common_TabsService } from '../../portfolio/services/common_tabs.service'; 
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../services/common.service';
import {FlowbiteDatepickerDirective} from '../../../shared/directives/flowbite-datepicker.directive';
@Component({
  selector: 'app-add-litigation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FlowbiteDatepickerDirective, FormsModule,RouterModule, NgSelectModule],
  templateUrl: './add-litigation.component.html',
  styleUrls: []
})
export class AddLitigationComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute); 
  private toastr = inject(ToastrService);
  private commonService = inject(CommonService);
  private commontabservice = inject(Common_TabsService);

  litigationForm!: FormGroup;
  isEdit = false;
  legalId: string = '';
  selectedProperty: any | null = null;
  selectedUnit:any | null = null;
  // Dropdown lists
  currentUser = this.commonService.getCurrentUser();
  escalationOptions = [
    { value: 'After 10 days', label: 'After 10 days' },
    { value: 'After 20 days', label: 'After 20 days' },
    { value: 'After 30 days', label: 'After 30 days' }, 
  ];

  propertiesList:any=[];
  allpropertiesList:any=[];
  unitsList:any=[];  
  leasesList:any=[];  
  statuses:any=[];

  ngOnInit() { 
    this.loadLookup(2,25, 'statuses', '','');
    this.loadProperties();
    this.litigationForm = this.fb.group({
      caseName: ['', Validators.required],
      legalFirm: ['', Validators.required],
      escalationOption: [null],
      caseDate: ['', Validators.required],
      claimedAmount: [0.0],
      collectedAmount: [0.0],
      selectedProperty: [null],
      unit: [null],
      lease: [null],
      caseStatus: [null],
      blockUnit: [false],
      blockTenant: [false],
      caseDetails: ['']
    });

    this.route.paramMap.subscribe(params => {
      
      this.legalId = params.get('id') ?? ''; 
      if(this.legalId!=''){
         this.isEdit = true;
        this.getLegalDetails();
      }
    });
  }
  loadLookup(typeid :number,filterId: number, targetProperty: string, filterText: string, filterText1: string) {
    this.commontabservice.getMasterByType({
      typeId: typeid,
      filterId: filterId,
      filterText: filterText,
      filterText1: filterText1
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult.table) {
          (this as any)[targetProperty] = res.objResult.table ;
        }
      },
      error: (err:any) => {
        console.error(`Error fetching lookup ${filterId}:`, err);
      }
    });
  }
  
  onSearch(event:string,list:any ) { 
    const searchTerm = event.toLowerCase();  
    if (!searchTerm) {
      (this as any)[list+'List'] = [...(this as any)['all'+list+'List']];
    } else {
      (this as any)[list+'List'] = (this as any)['all'+list+'List'].filter((item:any) => 
        item.name.toLowerCase().includes(searchTerm)
      );
    }
  }
  loadProperties(callback?: () => void) {
    
    this.commontabservice.getMasterByType({
      typeId: 11,
      filterId: 0,
      filterText: '',
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult.table) {
          this.propertiesList = res.objResult.table;
          this.allpropertiesList=this.propertiesList;
        }
        if (callback) callback();
      },
      error: (err) => {
        console.error('Error loading properties:', err);
        if (callback) callback();
      }
    });
  }
  onUnitChange(ev:any){
    this.selectedUnit = ev;
    this.leasesList = []; 
    if (this.selectedUnit) {
      this.loadLookup(16,0, 'leasesList', this.selectedProperty?.code,this.selectedUnit?.code); 
    }

  }
  onPropertyChange(ev:any) { 
    this.selectedProperty=ev;
    this.selectedUnit = null;
    this.leasesList=[];
      this.unitsList = [];
    if (this.selectedProperty) {
      this.loadLookup(44,0, 'unitsList', this.selectedProperty?.code,'');  
    }
  }


  getLegalDetails() {
    this.commontabservice.getMasterByType({
      typeId: 41,
      filterId: 0,
      filterText: this.legalId,
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult.legalinfo) {
         var legalinfo = res.objResult.legalinfo[0]; 
         this.selectedProperty=legalinfo.property_code;
         this.loadLookup(44,0,'unitsList', this.selectedProperty,'');  
         this.selectedUnit=legalinfo.entity_code;
         this.loadLookup(16,0, 'leasesList', this.selectedProperty,this.selectedUnit); 
         this.selectedUnit=legalinfo.entity_code; 
         this.loadLitigationDetails(legalinfo);
        }
        else
          this.toastr.error("No record[s] found");
      },
      error: (err) => {
        console.error(`Error fetching typeid: 22:`, err);
      }
    });
  }

  loadLitigationDetails(legalinfo:any) {
    this.litigationForm.patchValue({
      caseName: legalinfo.case_name,
      legalFirm: legalinfo.legal_firm,
      escalationOption: legalinfo.escalation_option,
      caseDate:formatDate( legalinfo.case_date, 'yyyy-MM-dd', 'en-US'),
      claimedAmount: legalinfo.claimed_amt,
      collectedAmount: legalinfo.collected_amt,
      selectedProperty: legalinfo.property_code,
      unit: legalinfo.entity_code,
      lease: legalinfo.lease_code,
      caseStatus: legalinfo.status,
      blockUnit: legalinfo.block_unit,
      blockTenant: legalinfo.block_tenant,
      caseDetails: legalinfo.details
    });
  } 
  onSubmit() {
    
    if (this.litigationForm.valid) {
      const form = this.litigationForm.value;
    const payload = {
      userid: this.currentUser?.userId || 1,
      company_id: this.currentUser?.companyId || 1,
      clientId: this.currentUser?.clientId || "74BB6922",
      source: "web",
      languageid: 1,
      property_code: this.selectedProperty.code || "",
      entity_code: this.selectedUnit.code || "",
      lease_code: form.lease,
      is_from_unit: 1,
      code: this.legalId,
      details: form.caseDetails || "",
      case_name: form.caseName || 0,
      status: form.caseStatus|| 0,
      block_unit: form.blockUnit || 0,
      block_tenant: form.blockTenant || 0,
      legal_firm: form.legalFirm,
      escalation_option: form.escalationOption,
      case_date: formatDate(form.caseDate, 'yyyy-MM-dd', 'en-US'),
      claimed_amount: form.claimedAmount || 0,
      collected_amount:form.collectedAmount
    };

    this.commonService.saveLegalCases(payload).subscribe({
      next: (res: any) => {
        if (res && (res.statusCode == 200 || res.statusCode == "200" || res.isSuccess)) {
          this.toastr.success("Successfully saved");
          this.router.navigate(['/legal/litigations']); 
           
        } else {
          this.toastr.error(res.message || "Failed to save legal cases");
        }
      },
      error: (err: any) => {
        console.error("Error saving work order:", err);
        this.toastr.error("An error occurred while saving the legal cases : "+ err);
      }
    });
     
    
    } else {
      this.toastr.error("Please fill required fields case name,case date,legal firm",
        'Validation',
        {
          enableHtml: true,
          timeOut: 5000,
          positionClass: 'toast-top-right'
        }
      );
      this.litigationForm.markAllAsTouched();
    }
  }
}
