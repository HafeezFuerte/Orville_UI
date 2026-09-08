import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GuideRow, getGuideById } from '../rules-guides.data';
import { CommonService } from '../../../../services/common.service';
import { Common_TabsService } from '../../../portfolio/services/common_tabs.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core'; 
import { FlowbiteDatepickerDirective } from '../../../../shared/directives/flowbite-datepicker.directive';
import {CommunityService} from '../../community.services'
@Component({
  selector: 'app-guide-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './guide-detail.component.html',
  styleUrl: './guide-detail.component.scss'
})
export class GuideDetailComponent implements OnInit {
  detail: any =[];
  attachments:any=[];
  showActionMenu = false;
  guide_code:any;
  actionOptions = [
    { label: 'Edit Guide', asset: 'assets/images/action-menu/pencil.svg', danger: false },
    // { label: 'Publish', asset: 'assets/images/action-menu/files.svg', danger: false },
    { label: 'Delete', asset: 'assets/images/action-menu/trash.svg', danger: true }
  ];
 

 
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,private toastr: ToastrService, private commontabservice: Common_TabsService,
    private commonservice: CommonService,public translate: TranslateService,private communityService: CommunityService
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.guide_code=params.get('code'); 
      if(this.guide_code)
         this.getGuideDetails(75,0, 'statusTabs', this.guide_code);
    });
    
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
            this.detail = { 
              name: temp.name,
              entity: temp.entity,  
              entity_name: temp.entity_name,    
              code:temp.code,
              createdAt:temp.created_date,
              updatedAt:temp.modified_date,
              description: temp.strcontent  } 
               
          }
          this.attachments=res.objResult.table1 || [];
        }
        else
        this.toastr.error("No record[s] found");
      },
      error: (err) => {
        console.error(`Error fetching lookup ${filterId}:`, err);
      }
    });
  }

  goBack(): void {
    void this.router.navigate(['/community/rules-guides']);
  }

  goToEdit(): void {
    void this.router.navigate(['/community/rules-guides/edit',this.guide_code]);
  }

  toggleActionMenu(event: Event): void {
    event.stopPropagation();
    this.showActionMenu = !this.showActionMenu;
  }

  onAction(label: string): void {
    this.showActionMenu = false;
    if (label === 'Edit Guide') {
      this.goToEdit();
    }
    else if (label === 'Delete') {
      this.goToEdit();
    } 
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showActionMenu = false;
  }
}
