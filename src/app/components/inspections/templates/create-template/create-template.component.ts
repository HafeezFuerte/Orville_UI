import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule,ActivatedRoute } from '@angular/router'; 
import { CommonService } from '../../../../services/common.service';
import { Common_TabsService } from '../../../portfolio/services/common_tabs.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-create-template',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslateModule],
  templateUrl: './create-template.component.html',
  styleUrls: []
})
export class CreateTemplateComponent implements OnInit {
  public translate = inject(TranslateService);
  private toastr = inject(ToastrService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private commonService = inject(CommonService);
  private commontabservice = inject(Common_TabsService);
  private routeSub?: Subscription;  
  private route = inject(ActivatedRoute);

  currentUser = this.commonService.getCurrentUser();
  templateForm!: FormGroup;
  editCode:string='';
  inspectionDetails:any={};
  ngOnInit() {
    this.templateForm = this.fb.group({
      templateName: ['', Validators.required],
      areas: this.fb.array([])
    });
    this.routeSub = this.route.paramMap.subscribe(params => {
      const code = params.get('code');
      if (code) {
        this.editCode = code; 
        this.loadInspectionDetails(code);
      }
     else
     this.addArea();
    });
  
  }
   
  loadInspectionDetails(code: string) { 
    const currentUser = this.commonService.getCurrentUser();
    const payload = {
      typeId: 106,
      filterId: 0,
      filterText: code,
      filterText1: '',
      userId: currentUser?.userId || 1,
      clientId: currentUser?.clientId || '74BB6922',
      companyId: currentUser?.companyId || 1
    };

    this.commontabservice.getMasterByType(payload).subscribe({
      next: (res: any) => { 
        if (res && res.objResult) {
          const details = res.objResult.inspection_dtls || res.objResult.table || res.objResult;
          if (Array.isArray(details) && details.length > 0) { 
            this.inspectionDetails= details[0] 
           
            let arealist=JSON.parse(this.inspectionDetails.inspection_structure);
            this.templateForm.patchValue({
              templateName:this.inspectionDetails.template_name
            })
            arealist.forEach((element:any) => {
              let sectiongroup:any=[];
              element.sections.forEach((childelement:any) => {
                var sectionelement= this.fb.group({
                  sectionName: [childelement.sectionName, Validators.required],
                  order: [element.order, Validators.required]
                });
                sectiongroup.push(sectionelement);
              }); 
              var section=  this.fb.group({
                areaName: [element.areaName, Validators.required],
                order: [element.order, Validators.required],
                sections: this.fb.array(sectiongroup)
              });
              this.areasFormArray.push(section);
            });
            
             
          }
        }
      },
      error: (err) => { 
        console.error('Error loading inspection details:', err);
        this.toastr.error('Failed to load inspection details');
      }
    });
  }


  get areasFormArray() {
    return this.templateForm.get('areas') as FormArray;
  }

  get totalAreas() {
    return this.areasFormArray.length;
  }

  get totalSections() {
    // let count = 0;
    // this.areasFormArray.controls.forEach(control => {
    //   const sections = control.get('sections') as FormArray;
    //   count += sections.length;
    // });
    return this.areasFormArray.controls.length;
  }

  get completionPercentage(): number {
    let filledFields = 0;
    let totalFields = 1; // Template name is 1 
    if (this.templateForm.value.templateName) {
      filledFields++;
    }
if(this.areasFormArray.controls.length==0)
return 0;
    // this.areasFormArray.controls.forEach(areaCtrl => {
    //   totalFields += 2; // Area name, Area order
    //   if (areaCtrl.get('areaName')?.value) filledFields++;
    //   if (areaCtrl.get('order')?.value) filledFields++;

    //   const sections = areaCtrl.get('sections') as FormArray;
    //   sections.controls.forEach(secCtrl => {
    //     totalFields += 2; // Section name, Section order
    //     if (secCtrl.get('sectionName')?.value) filledFields++;
    //     if (secCtrl.get('order')?.value) filledFields++;
    //   });
    // });

    if (totalFields === 0) return 0;
    return Math.round((filledFields / totalFields) * 100);
  }

  createAreaGroup(): FormGroup {
    return this.fb.group({
      areaName: ['', Validators.required],
      order: [this.areasFormArray ? this.areasFormArray.length + 1 : 1, Validators.required],
      sections: this.fb.array([this.createSectionGroup(1)])
    });
  }

  createSectionGroup(orderNum: number): FormGroup {
    return this.fb.group({
      sectionName: ['', Validators.required],
      order: [orderNum, Validators.required]
    });
  }

  addArea() {
    this.areasFormArray.push(this.createAreaGroup());
  }

  removeArea(index: number) {
    this.areasFormArray.removeAt(index);
  }

  getSectionsArray(areaIndex: number): FormArray {
    return this.areasFormArray.at(areaIndex).get('sections') as FormArray;
  }

  addSection(areaIndex: number) {
    const sections = this.getSectionsArray(areaIndex);
    sections.push(this.createSectionGroup(sections.length + 1));
  }

  removeSection(areaIndex: number, sectionIndex: number) {
    const sections = this.getSectionsArray(areaIndex);
    sections.removeAt(sectionIndex);
  }

  onSubmit() {
    if (this.templateForm.valid) {  
      const payload = {
        source: 'web',
        languageid: 1,
        userid: this.currentUser?.userId || 1,
        company_id: this.currentUser?.companyId || 1,
        clientId: this.currentUser?.clientId || '74BB6922',
        code: this.editCode || '',
        template_name: this.templateForm.value.templateName || '',
        structure: JSON.stringify(this.templateForm.value.areas) || '', 
      };
  
      this.commontabservice.saveInspectionTemplate(payload).subscribe({
        next: (res: any) => { 
          if (res && (res.statusCode == 200 || res.statusCode == '200' || res.isSuccess || res.status === 200 || res.message === 'Success')) {
            const successMsg = this.editCode
              ? (this.translate.instant('web.common.msgRecordUpdated') || 'Template updated successfully')
              : (this.translate.instant('web.common.msgRecordSaved') || 'Template created successfully');
            this.toastr.success(successMsg);
            this.router.navigate(['/inspections/templates']);
          } else {
            const msg = res?.message || (this.editCode ? 'Failed to update inspection' : 'Failed to create inspection');
            this.toastr.error(msg);
          }
        },
        error: (err) => { 
           const errMsg = err?.error?.message || err?.message || 'Error occurred while saving inspection';
          this.toastr.error(errMsg);
        }
      }); 
    } else {
      this.templateForm.markAllAsTouched();
    }
  }
}
