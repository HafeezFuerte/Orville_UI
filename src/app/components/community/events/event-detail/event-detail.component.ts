import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EventRow, getEventById } from '../events.data';
import { CommonService } from '../../../../services/common.service';
import { Common_TabsService } from '../../../portfolio/services/common_tabs.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core'; 
@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.scss'
})
export class EventDetailComponent implements OnInit, OnDestroy {
  detail: any = {};// = getEventById('658');
  attendees:any=[];
  event_code:any;
  showActionMenu = false;
  showPreview = false;

  actionOptions = [
    { label: 'Edit Event', asset: 'assets/images/action-menu/pencil.svg', danger: false },
    { label: 'Publish', asset: 'assets/images/action-menu/files.svg', danger: false },
    { label: 'Archive', asset: 'assets/images/action-menu/trash.svg', danger: true }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,private toastr: ToastrService, private commontabservice: Common_TabsService,
    private commonservice: CommonService,public translate: TranslateService
  ) {}
  

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.event_code=params.get('code'); 
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
            this.detail = {
              id: temp.id,
              name: temp.event_name,
              location: temp.location,
              status: temp.status,
              event_image_path:temp.event_image_path,
              status_nm: temp.status_name,
              date: temp.event_date,
              maxAttendance: temp.max_attendences,
              startTime: temp.start_time,
              endTime: temp.end_time,
              description: temp.description,
              email: temp.email_address,
              phone: temp.phone_no,
              sendableTo: temp.entity, 
              attendees: this.attendees.length,
              createdAt: temp.created_date,
              createdBy: temp.createdby}
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

  get eventTimeRange(): string {
    return `${this.detail.startTime} - ${this.detail.endTime}`;
  }

  get eventCity(): string {
    const parts = this.detail.location.split(',').map((p:any) => p.trim()).filter(Boolean);
    return parts.length ? parts[parts.length - 1] : '—';
  }

  get previewStatusLabel(): string {
    if (this.detail.status === 'Cancelled') {
      return 'Cancelled Event';
    }
    return 'Upcoming Event';
  }

  goBack(): void {
    void this.router.navigate(['/community/events']);
  }

  goToEdit(): void {
    void this.router.navigate(['/community/events/edit',this.event_code]);
  }

  openPreview(): void {
    this.showActionMenu = false;
    this.showPreview = true;
    document.body.classList.add('event-preview-open');
    document.body.style.overflow = 'hidden';
  }

  closePreview(): void {
    this.showPreview = false;
    document.body.classList.remove('event-preview-open');
    document.body.style.overflow = '';
  }

  toggleActionMenu(event: Event): void {
    event.stopPropagation();
    this.showActionMenu = !this.showActionMenu;
  }

  onAction(label: string): void {
    this.showActionMenu = false;
    if (label === 'Edit Event') {
      this.goToEdit();
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
