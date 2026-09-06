import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { NgSelectModule } from '@ng-select/ng-select';

import { ActivatedRoute, Router, RouterModule } from '@angular/router'; 
import { CommonService } from '../../../../services/common.service';
import { Common_TabsService } from '../../../portfolio/services/common_tabs.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core'; 
import { FlowbiteDatepickerDirective } from '../../../../shared/directives/flowbite-datepicker.directive';
import {CommunityService} from '../../community.services'
@Component({
  selector: 'app-guide-add',
  standalone: true,
  imports: [CommonModule,FlowbiteDatepickerDirective, FormsModule, RouterModule, NgSelectModule],
  templateUrl: './guide-add.component.html',
  styleUrl: './guide-add.component.scss'
})
export class GuideAddComponent {
  guide_code:any;
  selectedType:any={};
  files:any=[];
  form = {
    name: '',
    entity:null as number | null,
    entity_code: null as string | null,
    description: ''
  };
  entities = [{code:2, name:"Property"},{code:3,name:"Units"},{code:1,name:"Tenants"},{code:4,name:"Landlords"}
  ,{code:5,name:"Vendors"},{code:6,name:"Technicians"}]; 
  
  currentUser = this.commonservice.getCurrentUser();
  selectedData : any= [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,private toastr: ToastrService, private commontabservice: Common_TabsService,
    private commonservice: CommonService,public translate: TranslateService,private communityService: CommunityService
  ) {}
  ngOnInit(): void {
    this.guide_code='';
    this.route.paramMap.subscribe((params) => {
      this.guide_code=params.get('code'); 
      if(this.guide_code)
         this.getGuideDetails(75,0, 'statusTabs', this.guide_code);
    });
    this.loadLookup(2,1000,'countries','');
    this.loadLookup(2,46,'categories',''); 
  }
  getGuideDetails(Typeid:number,filterId: number, targetProperty: string, filterText: string) {
    this.commontabservice.getMasterByType({
      typeId: 75,
      filterId: filterId,
      filterText: filterText,
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult.table) {  
          var temp=res.objResult.table [0] || {}; 
          if(temp){
            const selectedfeature=this.entities.filter((item:any)=>item.name==temp.entity)[0]?.code;
            this.form = { 
              name: temp.name,
              entity: selectedfeature,  
              description: temp.strcontent, entity_code:''  }
             
              this.loadLookup(70, selectedfeature,
               'selectedData', '');
             setTimeout(() => { 
              this.form.entity_code=temp.entity_code; 
             }, 500);
               
          }
        }
        else
        this.toastr.error("No record[s] found");
      },
      error: (err) => {
        console.error(`Error fetching lookup ${filterId}:`, err);
      }
    });
  }
  filldata(ev:any){
    this.selectedType=ev;
    this.selectedData=[]; 
    this.form.entity_code='';  
    const tt=this.selectedType?.code;
    this.loadLookup(70, tt, 'selectedData', '');
    setTimeout(() => {
      this.form.entity=ev.code;
     }, 200);
  }
  loadLookup(Typeid:number,filterId: number, targetProperty: string, filterText: string) {
    this.commontabservice.getMasterByType({
      typeId: Typeid,
      filterId: filterId,
      filterText: filterText,
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult.table) {   
          (this as any)[targetProperty] = res.objResult.table;
        }
        else
        this.toastr.error("No record[s] found");
      },
      error: (err) => {
        console.error(`Error fetching lookup ${filterId}:`, err);
      }
    });
  }
  cancel(): void {
    void this.router.navigate(['/community/rules-guides']);
  }
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files: File[] = input.files ? Array.from(input.files) : []; 
    this.files=files;
  }

  save(): void {
    if(this.form.name==null || this.form.name==""){
      this.toastr.error("Invalid name");
      return;
      }
    else if(this.form.entity==null || this.form.entity==0){
    this.toastr.error("Invalid feature");
    return;
    }
    else if(this.form.entity_code==null || this.form.entity_code==""){
      this.toastr.error("Invalid feature code");
      return;
      }
      else{
        const payload = {
          userid: this.currentUser?.userId || 1,
          company_id: this.currentUser?.companyId || 1,
          clientId: this.currentUser?.clientId || "74BB6922",
          source: "web",
          languageid: 1,
          entity: this.entities.filter((item:any)=>item.code==this.form.entity)[0]?.name || "",
          entity_code:this.form.entity_code ||  "",
          code: this.guide_code,
          name: this.form.name,
          contents: this.form.description,  
        };
        const formData = new FormData();
        formData.append('reqObject', JSON.stringify(payload));
        if(this.files.length>0){
          this.files.forEach((element:any) => {
            formData.append('event_image', element, element.name);
          });
        } 
        this.communityService.save_guide_lines(formData).subscribe({
          next: (res: any) => {
            if (res && (res.statusCode == 200 || res.statusCode == "200" || res.isSuccess)) {
              this.toastr.success("Successfully saved");
            
          void this.router.navigate(['/community/rules-guides']);
  
            } else {
              this.toastr.error(res.message || "Failed to save promotions");
            }
          },
          error: (err: any) => {
            console.error("Error saving promotions:", err);
            this.toastr.error("An error occurred while saving the promotions : " + err);
          }
        });

      }
      
  }
}
