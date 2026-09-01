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
  selector: 'app-event-add',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule,FlowbiteDatepickerDirective],
  templateUrl: './event-add.component.html',
  styleUrl: './event-add.component.scss'
})
export class EventAddComponent {
  selectedData :any=[];
  sendableOptions = ['Property', 'All Tenants', 'Units'];
  selectedImageName: string | null = null;
  currentUser = this.commonservice.getCurrentUser();
  event_code:any='';
  selectedType:string='Property';
  attendees:any=[];
  form = {
    name: '',
    location: '',
    description: '',
    eventDate: '',
    status:0,
    startTime: '',
    endTime: '',
    email: '',
    phone: '',
    maxAttendance: '',
    selectedImage:null as any | null,
    sendableTo: null as string | null,
    selectedList: null as any | null
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,private toastr: ToastrService, private commontabservice: Common_TabsService,
    private commonservice: CommonService,public translate: TranslateService,private communityService: CommunityService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.event_code=params.get('code'); 
      if(this.event_code)
         this.getEventDetails(2,41, 'statusTabs', this.event_code);
    });
  }
 
  getEventDetails(Typeid:number,filterId: number, targetProperty: string, filterText: string) {
    this.commontabservice.getMasterByType({
      typeId: 69,
      filterId: filterId,
      filterText: filterText,
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult.table1) {  
          var temp=res.objResult.table1 [0] || {};
          this.attendees=res.objResult.table2 || []; 
          if(temp){
            this.form = { 
              name: temp.event_name,
              location: temp.location,
              status: temp.status, 
              eventDate: temp.event_date,
              maxAttendance: temp.max_attendences,
              startTime: temp.start_time,
              endTime: temp.end_time,
              description: temp.description,
              email: temp.email_address,
              phone: temp.phone_no,
              selectedImage:null,
              sendableTo: temp.entity,selectedList:''   }
              this.selectedImageName = temp?.event_image_path ?  this.selectedImageName : null;
              const tt=this.form.sendableTo =='Property' ? 2 : this.selectedType =='All Tenants' ? 1 : 3;
              this.loadLookup(70, tt, 'selectedData', '');
             setTimeout(() => {
              this.form.selectedList=temp.selected_list.split(',')
              .map((x:any) => x.trim())
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
  filldata(ev:any){
    this.selectedType=ev;
    this.selectedData=[];
    this.form.selectedList=''; 
    const tt=this.selectedType =='Property' ? 2 : this.selectedType =='All Tenants' ? 1 : 3;
    this.loadLookup(70, tt, 'selectedData', '');
  }
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.selectedImageName = file?.name ?? null;
    this.form.selectedImage=file;
  }

  clearImage(): void {
    this.selectedImageName = null;
    this.form.selectedImage=null;
  }

  cancel(): void {
    void this.router.navigate(['/community/events']);
  }

  save(): void {
    if(this.form.name==null || this.form.name==""){
      this.toastr.error("Invalid event name");
      return;
    }
    else if(this.form.location==null || this.form.location==""){
      this.toastr.error("Invalid event location");
      return;
    }
    else if(this.form.eventDate==null || this.form.eventDate==""){
      this.toastr.error("Invalid event date");
      return;
    }
    else if(this.form.sendableTo==null || this.form.sendableTo==""){
      this.toastr.error("Invalid sendable ");
      return;
    }
    else if(this.form.selectedList==null || this.form.selectedList==""){
      this.toastr.error("Invalid selected List ");
      return;
    }
    else{
      const payload = {
        userid: this.currentUser?.userId || 1,
        company_id: this.currentUser?.companyId || 1,
        clientId: this.currentUser?.clientId || "74BB6922",
        source: "web",
        languageid: 1,
        entity: this.form.sendableTo || "",
        entity_codes:this.form.selectedList.join(',') ||  "",
        event_name: this.form.name,
        location: this.form.location, 
        code: this.event_code,
        phone_no:this.form.phone,
        email: this.form.email || "",
        event_date:this.commonservice.parseInputDate(this.form.eventDate),
        start_time: this.form.startTime || '',
        end_time:this.form.endTime || '',
        max_attendences:this.form.maxAttendance || 0,
        description:this.form.description, 
      };
      const formData = new FormData();
      formData.append('reqObject', JSON.stringify(payload));
      if (this.form.selectedImage) {
        formData.append('event_image', this.form.selectedImage, this.form.selectedImage.name);
      }
      
      this.communityService.save_event(formData).subscribe({
        next: (res: any) => {
          if (res && (res.statusCode == 200 || res.statusCode == "200" || res.isSuccess)) {
            this.toastr.success("Successfully saved");
            void this.router.navigate(['/community/events']);

          } else {
            this.toastr.error(res.message || "Failed to save events");
          }
        },
        error: (err: any) => {
          console.error("Error saving work order:", err);
          this.toastr.error("An error occurred while saving the events : " + err);
        }
      });
    }
  
  }
}
