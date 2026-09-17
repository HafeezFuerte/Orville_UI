import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { ColumnMenuComponent } from '../../../../shared/components/column-menu/column-menu.component';
import { PropertiesService } from '../../../portfolio/services/properties.service';
import { CommonService } from '../../../../services/common.service';

import { AttachmentsComponent } from '../../../child-tables/attachments/attachments.component';
import { NotesComponent } from '../../../child-tables/notes/notes.component'; 
import { environment } from '../../../../../environments/environment';
import { Common_TabsService } from '../../../portfolio/services/common_tabs.service';
import { ToastrService } from 'ngx-toastr';
type DetailTab = 'overview' | 'messages' | 'notes';

interface TicketNoteRow {
  id: string;
  subject: string;
  content: string;
  via: string;
  noteDate: string;
  createdBy: string;
  files: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [CommonModule, NotesComponent,FormsModule, RouterModule, SharedTableComponent, ColumnMenuComponent],
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.scss'
})
export class TicketDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router); 
  private commonService = inject(CommonService);
  private commonTabsService = inject(Common_TabsService);
  private toastr=inject(ToastrService);
  currentUser = this.commonService.getCurrentUser(); 
  activeTab: DetailTab = 'overview';
  showActionMenu = false;
  showNoteColumns = false;
  showStatusDropdown = false;
  showApprovalModal = false;
  isAccept =false;
  ApprovalModalText:string='';
  approveComments:string='';
  draftMessage = ''; 
  attachfiles:any=[];
  ticketId :any='';
  notesForm: any = {};
  attachmentsForm: any = {};
  tabsList: any[] = [];
  updatednotes:any='';
  statusOptions:any=[];
  ticket :any= {
    title: 'Kitchen Full of Cockroaches',
    id: this.ticketId,
    priority: 'High',
    status: 'Rejected',
    statusid:'0',
    leaseId: '92523',
    property: 'Dubai Marina, Tower A, Dubai',
    unit: 'Apartment 402-PR-4',
    contact: 'James T. Hirai',
    source: '1 month',
    department: 'Facility Group',
    category: 'Maintenance and Repairs',
    created: '07-01-2026',
    description:
      'The kitchen is full of cockroaches and baby cockroaches. They are crawling everywhere, including during daytime with the light on. Every time a cabinet is opened, cockroaches fall out. The tenant reports a serious hygiene and health concern and requests immediate pest-control action.'
  };

  attachments = [
    { name: 'Img_4125.jpg', meta: 'Photo · 1.8 MB', kind: 'photo' as const },
    { name: 'IMG_5732.mov', meta: 'Video · 1.8 MB', kind: 'video' as const },
    { name: 'IMG_5732.mov', meta: 'Video · 1.8 MB', kind: 'video' as const },
    { name: 'IMG_5732.mov', meta: 'Video · 1.8 MB', kind: 'video' as const }
  ];

  recentTickets :any=[];

  conversations = [
    {
      initials: 'MZ',
      name: 'Mohammed Zaid',
      preview: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      time: '09:58',
      active: true
    }
  ];

  messages = [
    {
      from: 'them' as const,
      initials: 'MZ',
      name: 'Mohammed Zaid',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam interdum finibus mi vel bibendum.',
      meta: 'Mohammed Zaid · 09:58'
    },
    {
      from: 'me' as const,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam interdum finibus mi vel bibendum.',
      meta: 'You · 10:05'
    },
    {
      from: 'them' as const,
      initials: 'MZ',
      name: 'Mohammed Zaid',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam interdum finibus mi vel bibendum.',
      meta: 'Mohammed Zaid · 10:18'
    },
    {
      from: 'me' as const,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam interdum finibus mi vel bibendum.',
      meta: 'You · 10:05'
    },
    {
      from: 'them' as const,
      initials: 'MZ',
      name: 'Mohammed Zaid',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam interdum finibus mi vel bibendum.',
      meta: 'Mohammed Zaid · 10:18'
    }
  ];
 
activities:any=[];
  noteRows:any=[];
  ngOnInit() {
    this.initializeTabs();
    this.loadlookup(2,51,'statusOptions','','');
    this.route.params.subscribe(params => {
      this.ticketId = params['code'];
      if (this.ticketId) {
        this.loadTicketDetails();
      }
    });
  }
  approveRequest(flg:number){
    this.isAccept=false;
    if(flg==1){
    this.ApprovalModalText="Approve";this.isAccept=true;
    }
    if(flg==0)
    this.ApprovalModalText="Reject";
    this.showApprovalModal=true;
  }
  loadTicketDetails() {
    const payload = {
      typeId: 82,
      filterId: 0,
      filterText: this.ticketId,
      filterText1: "",
      userId: this.currentUser?.userId || 1,
      clientId: this.currentUser?.clientId || "74BB6922",
      companyId: this.currentUser?.companyId || 1
    };

    this.commonTabsService.getMasterByType(payload).subscribe({
      next: (res: any) => {
        if (res && res.objResult) {
          const details = res.objResult.ticketdtls || res.objResult.ticketdtls || res.objResult;
          if (Array.isArray(details) && details.length > 0) {
            const data = details[0]; 
             this.ticket ={
              title  : data.title || "", 
              id: data.code,
              priority: data.priority,
              status: this.commonService.getArabicLookupName(data,'status_nm'),
              leaseId: data.active_lease || 'N/A',
              property: data.property,
              statusid:data.status,
              unit: data.unitcode,
              contact: data.contact,
              source: this.commonService.getArabicLookupName(data,'source_nm'),
              department:this.commonService.getArabicLookupName(data,'department_nm'),
              category: this.commonService.getArabicLookupName(data,'category_nm'),
              created:this.commonService.formatDateForInput(data.created_date),
              description: data.description || '',
              property_code:data.property_code,
              unit_code:data.unit_code,
              contact_code:data.contact_code
             };
            
          }
 
          this.attachfiles=res.objResult.documents || [];
          this.noteRows =res.objResult.notes || []
          this.activities=res.objResult.activities; 
          this.recentTickets=res.objResult.recentickets;
         this.initializeTabs();
        }
      },
      error: (err: any) => console.error("Error loading work order details:", err)
    });
  } 
  initializeTabs() {
    this.tabsList = [
      {
        key: 'Overview',
        label: 'Overview',
        layout: 'content',
        data: []
      },
      {
        key: 'Messages',
        label: 'Messages',
        layout: 'content',
        data: []
      },
      {
        key: 'notes',
        label: 'Notes',
        entity: 'Tickets',
        entity_id: this.ticketId,
        data: this.noteRows || [],
        totalRecords: (this.noteRows || []).length,
        loading: false,
        hasActions: true,
        addButtonText: 'Notes',
        form: this.notesForm,
        popupType: 'notes'
      } 
    ];
  } 
  ApproveRejectLease() {
    if(this.approveComments==null || this.approveComments==""){
      this.toastr.error(`Invalid  ${this.ApprovalModalText} comments`)
      return;
    }
    this.commonTabsService.getMasterByType({
      typeId: 83,
      filterId: this.isAccept ? 337 : 336,
      filterText: this.ticketId,
      filterText1: this.approveComments
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult) {
          this.toastr.success("Successfully updated status");
          this.showApprovalModal=false;
          setTimeout(() => {
            this.router.navigate(['/facility/tickets']);
          }, 2000);
        }
        else
          this.toastr.error("No record[s] found");
      },
      error: (err) => {
        console.error(`Error fetching typeid: 22:`, err);
      }
    });
  }
  loadlookup(typeId: number, filterId: number, targetProperty: string, filterText: string, filterText1: string) {
    this.commonTabsService.getMasterByType({
      typeId: typeId,
      filterId: filterId,
      filterText: filterText,
      filterText1: filterText1
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult) {
          if(typeId==83){
            this.toastr.success("Successfully updated the status");
            setTimeout(() => {
              window.location.reload();
            }, 5000);
          }
          else
            (this as any)[targetProperty] = res.objResult.table || [];
        }
      },
      error: (err) => {
        console.error(`Error fetching lookup ${filterId}:`, err);
      }
    });
  }
  updateticketstaus(){
    if(this.ticket.statusid==null || this.ticket.statusid==""){
      this.toastr.error("Invalid status id");
      return;
     }
    if(this.updatednotes==null || this.updatednotes==""){
     this.toastr.error("Invalid comments");
     return;
    }
    else{
      this.loadlookup(83,this.ticket.statusid,'',this.ticketId,this.updatednotes);
    }
  }
  selectStatus(status: any): void {
    this.showStatusDropdown = false;
    this.ticket.statusid = status.id; 
    this.ticket.status = status.name; 
  }
  setTab(tab: DetailTab): void {
    this.activeTab = tab;
    this.showActionMenu = false;
    this.showNoteColumns = false;
    this.showStatusDropdown = false;
  }
  get selectedTab(): any {
    return this.tabsList.find(t => t.key === this.activeTab);
  }
  goBack(): void {
    this.router.navigate(['/facility/tickets']);
  }

  goEdit(): void {
    this.router.navigate(['/facility/tickets/edit',this.ticketId]);
  }

  statusClass(status: string): string {
    switch (status) {
      case 'Open':
        return 'td-chip td-chip--primary';
      case 'Rejected':
        return 'td-chip td-chip--danger-soft';
      case 'Closed':
        return 'td-chip td-chip--success-soft';
      default:
        return 'td-chip td-chip--soft';
    }
  }

  sendMessage(): void {
    const text = this.draftMessage.trim();
    if (!text) {
      return;
    }
    this.messages.push({
      from: 'me',
      text,
      meta: 'You · just now'
    });
    this.draftMessage = '';
  }
 
  @HostListener('document:click')
  onDocClick(): void {
    this.showActionMenu = false; 
    this.showStatusDropdown = false;
  }
}
