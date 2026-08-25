import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../../../services/common.service';
import { Common_TabsService } from '../../portfolio/services/common_tabs.service';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-workflow-approvals',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,NgSelectModule
  ],
  templateUrl: './workflow-approvals.component.html',
  styleUrls: []
})
export class WorkflowApprovalsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  private http = inject(HttpClient);
  private commonService = inject(CommonService);
  private common_TabsService = inject(Common_TabsService);
  workflowType: string = 'simple';
  currentUser = this.commonService.getCurrentUser();
  screens = ['Leases', 'Workorder', 'Property'];
  users: any[] = [];

  simpleWorkflowData = {
    userId: null,
    isNotificationEnabled: true,
    notificationEmail: true,
    notificationSms: false
  };

  workflowLevels: any[] = [];

  
  ngOnInit() {
    this.fetchUsers();
    this.fetchSavedWorkflow();
  }
  onscreenChange(ev:any){
    console.log(ev);
  }
  fetchUsers() {
    this.common_TabsService.getMasterByType({
      typeId: 19,
      filterId: 0,
      filterText: 'S',
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult.table) {
            this.users=res.objResult.table;
        }
        else
          this.toastr.error("No record[s] found");
      },
      error: (err) => {
        console.error(`Error fetching typeid: 22:`, err);
      }
    }); 
     
  }

  fetchSavedWorkflow() {
    this.common_TabsService.getMasterByType({
      typeId: 22,
      filterId: 0,
      filterText: '',
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res && res.statusCode === "200" && res.objResult) {
          let result = res.objResult;
          if (typeof result === 'string') {
            try {
              result = JSON.parse(result);
            } catch (e) {
              console.error('Error parsing Saved Workflow objResult:', e);
              return;
            }
          }

          const table = result.table || result.Table || [];
          if (table.length > 0) {
            const config = table[0];
            this.workflowType = config.workflow_type === 1 ? 'simple' : 'multiple';

            const table1 = result.table1 || result.Table1 || [];
            if (table1.length > 0) {
              this.workflowLevels = table1.map((level: any) => ({
                userId: level.user_id,
                isNotificationEnabled: level.is_notification_enabled === true || level.is_notification_enabled === 1,
                notificationEmail: level.notification_email === true || level.notification_email === 1,
                notificationSms: level.notification_sms === true || level.notification_sms === 1
              }));
            } else if (this.workflowType === 'multiple') {
              this.addLevel();
            }
          } else {
            // Default setup if no record
            this.workflowType = 'simple';
            this.workflowLevels = [];
            this.addLevel();
          }
        } else {
          // Default setup in case of error/no result
          this.workflowType = 'simple';
          this.addLevel();
        }
      },
      error: (err: any) => {
        console.error('Error fetching saved workflow:', err);
        // Ensure UI is initialized
        if (this.workflowLevels.length === 0) {
          this.addLevel();
        }
      }
    });
  }

  addLevel() {
    this.workflowLevels.push({
      userId: null,
      isNotificationEnabled: true,
      notificationEmail: true,
      notificationSms: false
    });
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.workflowLevels, event.previousIndex, event.currentIndex);
  }

  removeLevel(index: number) {
    if (this.workflowLevels.length > 1) {
      this.workflowLevels.splice(index, 1);
    }
  }

  toggleNotifications(level: any) {
    if (!level.isNotificationEnabled) {
      level.notificationEmail = false;
      level.notificationSms = false;
    }
  }

  onCancel() {
    console.log('Workflow configuration cancelled.');
    // Logic to reset or navigate back
  }

  onSave() {
  //   if (this.workflowType === 'simple') {
  //     const payload = {
  //       companyid: 1,
  //       userid: this.currentUser?.userId || 120,
  //       workflow_type: 1,
  //       screen: "pay_runs",
  //       approvals: []
  //     };

  //     this.payrollService.saveWorkflow(payload).subscribe({
  //       next: (res: any) => {
  //         if (res && res.statusCode === "200") {
  //           this.toastr.success(res.message || this.translate.instant('web.common.msgSaveSuccessSimple'));
  //         } else {
  //           this.toastr.error(res.message || this.translate.instant('web.common.msgSaveError'));
  //         }
  //       },
  //       error: (err: any) => {
  //         console.error('API Error saving workflow:', err);
  //         this.toastr.error(this.translate.instant('web.common.msgSaveFailed'));
  //       }
  //     });
  //   } else {
  //     // Multiple Workflow Save Logic
  //     if (this.workflowLevels.length === 0) {
  //       this.toastr.warning(this.translate.instant('web.common.msgAtLeastOneLevel'));
  //       return;
  //     }

  //     // Check if all levels have a user selected
  //     const allUsersSelected = this.workflowLevels.every(level => level.userId);
  //     if (!allUsersSelected) {
  //       this.toastr.warning(this.translate.instant('web.common.msgSelectApproverForAll'));
  //       return;
  //     }

  //     const payload = {
  //       companyid: 1,
  //       userid: this.payrollService.currentUserId || 120,
  //       workflow_type: 2,
  //       screen: "pay_runs",
  //       approvals: this.workflowLevels.map((level, index) => ({
  //         level_no: index,
  //         user_id: level.userId,
  //         is_notification_enabled: level.isNotificationEnabled ? 1 : 0,
  //         notification_email: level.notificationEmail,
  //         notification_sms: level.notificationSms
  //       }))
  //     };

  //     this.payrollService.saveWorkflow(payload).subscribe({
  //       next: (res: any) => {
  //         if (res && res.statusCode === "200") {
  //           this.toastr.success(res.message || this.translate.instant('web.common.msgSaveSuccessMultiple'));
  //         } else {
  //           this.toastr.error(res.message || this.translate.instant('web.common.msgSaveError'));
  //         }
  //       },
  //       error: (err: any) => {
  //         console.error('API Error saving workflow:', err);
  //         this.toastr.error(this.translate.instant('web.common.msgSaveFailed'));
  //       }
  //     });
  //   }
  }
}
