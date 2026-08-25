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
    TranslateModule,
    NgSelectModule,
    DragDropModule,
  ],
  templateUrl: './workflow-approvals.component.html',
  styleUrl: './workflow-approvals.component.scss',
})
export class WorkflowApprovalsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  private http = inject(HttpClient);
  private commonService = inject(CommonService);
  private common_TabsService = inject(Common_TabsService);
  workflowType: string = 'simple';
  selectedScreen: string | null = null;
  currentUser = this.commonService.getCurrentUser();
  screens = ['Leases', 'Workorder', 'Property'];
  users: any[] = [];
  saved = false;
  private savedTimer: ReturnType<typeof setTimeout> | null = null;

  simpleWorkflowData = {
    userId: null as string | number | null,
    isNotificationEnabled: true,
    notificationEmail: true,
    notificationSms: false,
  };

  workflowLevels: any[] = [];

  ngOnInit() {
    this.fetchUsers();
    this.fetchSavedWorkflow();
  }

  onscreenChange(ev: any) {
    this.selectedScreen = ev ?? this.selectedScreen;
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
    this.fetchSavedWorkflow();
  }

  onSave() {
    this.saved = true;
    if (this.savedTimer) {
      clearTimeout(this.savedTimer);
    }
    this.savedTimer = setTimeout(() => {
      this.saved = false;
    }, 2500);
  }
}
