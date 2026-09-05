import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PromotionRow, getPromotionById } from '../promotions.data';
import { CommonService } from '../../../../services/common.service';
import { Common_TabsService } from '../../../portfolio/services/common_tabs.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core'; 
@Component({
  selector: 'app-promotion-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './promotion-detail.component.html',
  styleUrl: './promotion-detail.component.scss'
})
export class PromotionDetailComponent implements OnInit, OnDestroy {
  detail: any={};
  showActionMenu = false;
  showPreview = false;
  codeCopied = false;
  event_code:any;

  actionOptions = [
    { label: 'Edit Promotion', asset: 'assets/images/action-menu/pencil.svg', danger: false },
    { label: 'Preview', asset: 'assets/images/broadcasts/eye.svg', danger: false },
    { label: 'Delete', asset: 'assets/images/action-menu/trash.svg', danger: true }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,private toastr: ToastrService, private commontabservice: Common_TabsService,
    private commonservice: CommonService,public translate: TranslateService
  ) {}
  

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.event_code=params.get('code'); 
      this.getPromotionDetails(2,41, 'statusTabs', this.event_code);
      if (params.get('preview') === '1') {
        this.openPreview();
        void this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { preview: null },
          queryParamsHandling: 'merge',
          replaceUrl: true
        });
      }
    });
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
       //   this.attendees=res.objResult.table2 || []; 
          if(temp){
            this.detail = {
              id: temp.id, 
              name:temp.promotion_name,
              code: temp.promotion_code,
              category: temp.category_name,
              status: temp.status_name,
              startDate:this.commonservice.formatDateForInput(temp.start_date),
              endDate: this.commonservice.formatDateForInput(temp.end_date),
              startTime: temp.start_time,
              endTime: temp.end_time,
              description:temp.description,
              offer: '-', 
              phone: temp.phone_no,
              property: temp.entity,
              sendableTo: temp.promotion_name,
              contacts: temp.selected_tenants,
              project: '',
              order: temp.promotion_order,
              address: temp.address,
              country: temp.country_name, 
              city: temp.city_name, 
              createdAt: temp.created_date,
              createdBy: temp.createdby,
              selectedImg :temp.promotion_banner
            }
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

  ngOnDestroy(): void {
    this.closePreview();
  }

  get statusLabel(): string {
    return this.detail.status === 'Published' ? 'Active' : this.detail.status;
  }

  get previewStatusLabel(): string {
    return this.detail.status === 'Published' ? 'Active Promotion' : 'Draft Promotion';
  }

  goBack(): void {
    void this.router.navigate(['/community/promotions']);
  }

  goToEdit(): void {
    void this.router.navigate(['/community/promotions/edit',this.event_code]);
  }

  openPreview(): void {
    this.showActionMenu = false;
    this.codeCopied = false;
    this.showPreview = true;
    document.body.classList.add('promo-preview-open');
    document.body.style.overflow = 'hidden';
  }

  closePreview(): void {
    this.showPreview = false;
    this.codeCopied = false;
    document.body.classList.remove('promo-preview-open');
    document.body.style.overflow = '';
  }

  copyPromotionCode(event: Event): void {
    event.stopPropagation();
    const code = this.detail.code || '';
    if (!code) {
      return;
    }
    void navigator.clipboard.writeText(code).then(() => {
      this.codeCopied = true;
      window.setTimeout(() => {
        this.codeCopied = false;
      }, 1500);
    });
  }

  toggleActionMenu(event: Event): void {
    event.stopPropagation();
    this.showActionMenu = !this.showActionMenu;
  }

  onAction(label: string): void {
    this.showActionMenu = false;
    if (label === 'Edit Promotion') {
      this.goToEdit();
    } else if (label === 'Preview') {
      this.openPreview();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.showPreview) {
      this.closePreview();
    }
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showActionMenu = false;
  }
}
