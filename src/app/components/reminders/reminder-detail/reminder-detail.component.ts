import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { getReminderDetail, ReminderRow } from '../reminders.data';
import { CommonService } from '../../../services/common.service';
import { Common_TabsService } from '../../portfolio/services/common_tabs.service';
@Component({
  selector: 'app-reminder-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reminder-detail.component.html'
})
export class ReminderDetailComponent implements OnInit {
  detail: any ={};//= getReminderDetail('32153');
  currentUser = this.commonservice.getCurrentUser();
  reminderCode:any='';
  showActionMenu = false;
  actionOptions = [
    { label: 'Edit Reminder', asset: 'assets/images/action-menu/pencil.svg', danger: false },
    { label: 'Delete Reminder', asset: 'assets/images/action-menu/archive.svg', danger: true }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,private commonservice: CommonService,private commontabservice: Common_TabsService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.reminderCode=params.get('code'); 
      if(this.reminderCode)
         this.loadReminderDetails();
    }); 
  }

  loadReminderDetails(): void { 
    this.commontabservice.getMasterByType({
      typeId: 76,
      filterId: 0,
      filterText: this.reminderCode,
      filterText1: '',
      userId: this.currentUser?.userId || 1,
      clientId: this.currentUser?.clientId || "74BB6922",
      companyId: this.currentUser?.companyId || 1
    }).subscribe({
      next: (res: any) => {
        if (res && (res.statusCode == 200 || res.statusCode === '200') && res.objResult) {
          const temp = res.objResult.reminder?.[0] || res.objResult.reminders?.[0] || res.objResult.table?.[0] || {}; 
         
          const titleVal = temp.title  || ''; 
          this.detail = {
            title: titleVal,
            code:temp.code,
            todo: temp.to_do,
            date:  this.commonservice.formatDateForInput(temp.reminder_date)  || '',
            time:temp.time,
            priority:temp.priority,
            status: temp.status_name,
            recurring: temp.recurring_reminder !== undefined ? !!temp.recurring_reminder : temp.recurring !== undefined ? !!temp.recurring_cycle : '',
            paused: temp.pause_reminder !== undefined ?   true : false,
            repeatEvery: temp.recurring_cycle,
            interval: temp.interval,
            until: this.commonservice.formatDateForInput(temp.until_date),
            users:temp.users
          };
 
        }
      },
      error: (err) => console.error('Error loading reminder details:', err)
    });
  }
  goBack(): void {
    void this.router.navigate(['/reminders']);
  }

  toggleActionMenu(event: Event): void {
    event.stopPropagation();
    this.showActionMenu = !this.showActionMenu;
  }

  onAction(label: string): void {
    this.showActionMenu = false;
    if (label === 'Edit Reminder') {
      void this.router.navigate(['/reminders/edit',this.detail.code]);
    }
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showActionMenu = false;
  }
}
