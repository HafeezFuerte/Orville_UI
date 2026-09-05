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
  selector: 'app-promotion-add',
  standalone: true,
  imports: [CommonModule, FlowbiteDatepickerDirective,FormsModule, RouterModule, NgSelectModule],
  templateUrl: './promotion-add.component.html',
  styleUrl: './promotion-add.component.scss'
})
export class PromotionAddComponent {
  selectedData :any=[];
  sendableOptions = ['Property', 'All Tenants', 'Units'];
  selectedImageName: string | null = null;
  currentUser = this.commonservice.getCurrentUser();
  promotion_code:any='';
  selectedType:string='Property';
  selectedCountry:any;
  attendees:any=[];
  categories :any=[];
  countries :any=[];
  cities :any=[];
  propertes:any=[];
  form = {
    selectedImage:null as any | null,
    sendableTo: null as string | null,
    selectedList: null as any | null, 
    name: '',
    code: '',
    description: '',
    category: null as string | null,
    order: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    address: '',
    country: 'United Arab Emirates' as string | null,
    city: null as string | null,
    zip: '',
    phone: '',
    link: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,private toastr: ToastrService, private commontabservice: Common_TabsService,
    private commonservice: CommonService,public translate: TranslateService,private communityService: CommunityService
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.promotion_code=params.get('code'); 
      if(this.promotion_code)
         this.getPromotionDetails(2,41, 'statusTabs', this.promotion_code);
    });
    this.loadLookup(2,1000,'countries','');
    this.loadLookup(2,46,'categories','');
  }
 
  getPromotionDetails(Typeid:number,filterId: number, targetProperty: string, filterText: string) {
    this.commontabservice.getMasterByType({
      typeId: 73,
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
              name: temp.promotion_name,
              code: temp.promotion_code, 
              startDate:this.commonservice.formatDateForInput(temp.start_date),
              endDate: this.commonservice.formatDateForInput(temp.end_date),
              startTime: temp.start_time,
              endTime: temp.end_time,
              description: temp.description,
              country: temp.country_id,
              city: temp.city_id,
              phone: temp.phone_no,
              zip:temp.zipcode,
              address:temp.address,
              category:temp.category_id,
              order:temp.promotion_order, 
              link:temp.url,
              selectedImage:null,
              sendableTo: temp.entity,selectedList:''   }
              this.selectedImageName = temp?.promotion_banner ?  this.selectedImageName : null;
              const tt=this.form.sendableTo =='Property' ? 2 : this.form.sendableTo =='All Tenants' ? 1 : 3;
              this.loadLookup(2, 2005, 'cities', temp.country_id);
              this.loadLookup(70, tt, 'selectedData', '');
             setTimeout(() => {
              this.form.selectedList=temp.selected_list.split(',')
              .map((x:any) => x.trim());
              this.form.city=temp.city_id;
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
          if(Typeid==74){
            this.toastr.success("Successfully published promotion"); 
            this.cancel();
        }else
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
  get previewName(): string {
    return this.form.name.trim() || 'Resident Exclusive Discount';
  }

  get previewCode(): string {
    return this.form.code.trim() || 'MARINA-EXCL-18';
  }

  get previewStart(): string {
    return this.form.startDate.trim() || '15-07-2026';
  }

  get previewEnd(): string {
    return this.form.endDate.trim() || '23-07-2026';
  }

  get previewAddress(): string {
    return this.form.address.trim() || 'Level 18, Marina Heights, Dubai';
  }

  get previewCity(): string {
    return this.cities?.filter((item:any)=>item.id==this.form.city)[0]?.city_name || 'Dubai';
  }

  get previewEmail(): string {
    return 'event@mail.com';
  }

  get previewPhone(): string {
    return this.form.phone.trim() || '+971589652235';
  }
  loadCities(ev:any){
    this.selectedCountry=ev;
    this.cities=[];
    this.loadLookup(2, 2005, 'cities', this.selectedCountry?.id);
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

  publishPromotion(){
    if(this.promotion_code){
      this.loadLookup(74, 2, '', this.promotion_code);
    }
  }

  cancel(): void {
    void this.router.navigate(['/community/promotions']);
  }

  save(): void {
    if(this.form.selectedList==null || this.form.selectedList.length==0){
      this.toastr.error("Invalid selected list");
      return;
      }
    else if(this.form.name==null || this.form.name==""){
    this.toastr.error("Invalid promotion name");
    return;
    }
    else if(this.form.code==null || this.form.code==""){
      this.toastr.error("Invalid promotion code");
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
          code: this.promotion_code,
          promotion_name: this.form.name,
          address1: this.form.address, 
          promotion_code: this.form.code,
          phone_no:this.form.phone, 
          start_date:this.commonservice.parseInputDate(this.form.startDate),
          end_date:this.commonservice.parseInputDate(this.form.endDate),
          start_time: this.form.startTime || '',
          end_time:this.form.endTime || '',
          country_id:this.form.country || 0,
          city_id:this.form.city || 0,
          description:this.form.description, 
          zipcode: this.form.zip,
          category: this.form.category,
          promotion_order: this.form.order,
          url: this.form.link,
        };
        const formData = new FormData();
        formData.append('reqObject', JSON.stringify(payload));
        if (this.form.selectedImage) {
          formData.append('event_image', this.form.selectedImage, this.form.selectedImage.name);
        }
        
        this.communityService.save_promotion(formData).subscribe({
          next: (res: any) => {
            if (res && (res.statusCode == 200 || res.statusCode == "200" || res.isSuccess)) {
              this.toastr.success("Successfully saved");
              void this.router.navigate(['/community/promotions']);
  
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
