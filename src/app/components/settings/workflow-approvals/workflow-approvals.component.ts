import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../services/common.service';
import { Common_TabsService } from '../../portfolio/services/common_tabs.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-workflow-approvals',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    NgSelectModule,
    DragDropModule,
  ],
  templateUrl: './workflow-approvals.component.html',
  styleUrl: './workflow-approvals.component.scss',
})
export class WorkflowApprovalsComponent implements OnInit {
  private toastr = inject(ToastrService);
  private commonService = inject(CommonService);
  private common_TabsService = inject(Common_TabsService);
  private translate = inject(TranslateService);

  workflowType: 'simple' | 'multiple' = 'simple';
  selectedScreen: string | null = null;
  screenError = false;
  isSaving = false;
  isLoading = false;
  currentUser = this.commonService.getCurrentUser();
  screens = ['Leases', 'Workorder', 'Invoices', 'Quotations', 'Expenses', 'Property'];
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
    if (this.selectedScreen) {
      this.fetchSavedWorkflow();
    }
  }

  private getTranslation(key: string, defaultText: string): string {
    const t = this.translate.instant(key);
    return (t && !t.startsWith('web.')) ? t : defaultText;
  }

  onscreenChange(ev: any) {
    const selected = (typeof ev === 'object' && ev !== null) ? (ev.name || ev.value || ev) : ev;
    this.selectedScreen = selected || this.selectedScreen;

    if (this.selectedScreen) {
      this.screenError = false;
      this.fetchSavedWorkflow();
    } else {
      this.resetWorkflowFields();
    }
  }

  setWorkflowType(type: 'simple' | 'multiple') {
    if (type === this.workflowType) {
      return;
    }

    if (this.hasUnsavedWorkflowEdits()) {
      const message = this.getTranslation(
        'web.common.msgConfirmSwitchWorkflow',
        'Switching workflow type will reset unsaved edits. Continue?'
      );
      if (!window.confirm(message)) {
        return;
      }
    }

    this.workflowType = type;
    if (type === 'multiple' && this.workflowLevels.length === 0) {
      this.addLevel();
    }
  }

  private hasUnsavedWorkflowEdits(): boolean {
    if (this.workflowType === 'simple') {
      return this.simpleWorkflowData.userId != null;
    }
    return this.workflowLevels.some((level) => level.userId != null);
  }

  getUserLabel(userId: string | number | null | undefined): string {
    if (userId == null || userId === '') {
      return this.getTranslation('web.common.phSelectUser', 'Select User');
    }
    const user = this.users.find((item) => String(item.code) === String(userId) || String(item.id) === String(userId));
    if (user && user.name && user.name !== user.code) {
      return `${user.code} - ${user.name}`;
    }
    return String(userId);
  }

  get approvalPathLabels(): string[] {
    return this.workflowLevels.map((level) => this.getUserLabel(level.userId));
  }

  fetchUsers() {
    this.common_TabsService.getMasterByType({
      typeId: 19,
      filterId: 0,
      filterText: '',
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res?.statusCode == 200 && res?.objResult?.table) { 
          let temp_user=res.objResult.table.filter((item:any)=>item.role_type!="L" && item.role_type!="T");
          this.users = temp_user.map((u: any) => ({
            code: String(u.code || u.id || u.user_code || ''),
            name: u.name + ' - ' + u.role_name
          }));
        }
      },
      error: (err) => {
        console.error('Error fetching users (typeId 19):', err);
      }
    });
  }

  fetchSavedWorkflow() {
    if (!this.selectedScreen) {
      return;
    }
    this.isLoading = true;
    this.common_TabsService.getMasterByType({
      typeId: 99,
      filterId: 0,
      filterText: this.selectedScreen,
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res && (res.statusCode === "200" || res.statusCode === 200) && res.objResult) {
          let result = res.objResult;
          if (typeof result === 'string') {
            try {
              result = JSON.parse(result);
            } catch (e) {
              console.error('Error parsing Saved Workflow objResult:', e);
              return;
            }
          }

          const table = result.table || result.Table || result.table0 || result.Table0 || [];
          const table1 = result.table1 || result.Table1 || [];

          if (Array.isArray(table) && table.length > 0) {
            const config = table[0];
            // Auto-detect Multiple Workflow if more than 1 level exists in DB response
            const hasMultipleLevels = table.length > 1 || table.some((r: any) => Number(r.level_no) > 1);
            const rawWfType = config.workflow_type ?? config.workflowType ?? (hasMultipleLevels ? 2 : 1);
            const wfType = (rawWfType === 2 || rawWfType === '2' || rawWfType === 'multiple' || hasMultipleLevels) ? 'multiple' : 'simple';
            this.workflowType = wfType;

            // Ensure any user_code in DB response exists in this.users so ng-select displays it
            table.forEach((row: any) => {
              const code = String(row.user_code || row.userId || row.user_id || '');
              if (code && !this.users.some(u => String(u.code) === code)) {
                this.users.push({ code, name: '' });
              }
            });

            if (wfType === 'simple') {
              const firstLevel = table1.length > 0 ? table1[0] : config;
              const isEmail = firstLevel.is_email === true || firstLevel.is_email === 1 || firstLevel.notification_email === true || firstLevel.notification_email === 1;
              const isSms = firstLevel.is_sms === true || firstLevel.is_sms === 1 || firstLevel.notification_sms === true || firstLevel.notification_sms === 1;
              const isNotif = firstLevel.is_notification_enabled === true || firstLevel.is_notification_enabled === 1 || isEmail || isSms;
              this.simpleWorkflowData = {
                userId: firstLevel.user_code || firstLevel.userCode || firstLevel.userId || firstLevel.user_id || null,
                isNotificationEnabled: isNotif,
                notificationEmail: isEmail,
                notificationSms: isSms
              };
            } else {
              const levelsSource = table1.length > 0 ? table1 : table;
              this.workflowLevels = levelsSource.map((level: any) => {
                const isEmail = level.is_email === true || level.is_email === 1 || level.notification_email === true || level.notification_email === 1;
                const isSms = level.is_sms === true || level.is_sms === 1 || level.notification_sms === true || level.notification_sms === 1;
                const isNotif = level.is_notification_enabled === true || level.is_notification_enabled === 1 || isEmail || isSms;
                return {
                  userId: level.user_code || level.userCode || level.userId || level.user_id || null,
                  isNotificationEnabled: isNotif,
                  notificationEmail: isEmail,
                  notificationSms: isSms
                };
              });
              if (this.workflowLevels.length === 0) {
                this.addLevel();
              }
            }
            return;
          }
        }

        // Backend returned no records: reset fields to blank default
        this.resetWorkflowFields();
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('Error fetching saved workflow (typeId 99):', err);
        this.resetWorkflowFields();
      }
    });
  }

  resetWorkflowFields(): void {
    this.workflowType = 'simple';
    this.simpleWorkflowData = {
      userId: null,
      isNotificationEnabled: true,
      notificationEmail: true,
      notificationSms: false
    };
    this.workflowLevels = [{
      userId: null,
      isNotificationEnabled: true,
      notificationEmail: true,
      notificationSms: false
    }];
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
    } else {
      level.notificationEmail = true;
    }
  }

  onCancel() {
    this.screenError = false;
    if (this.selectedScreen) {
      this.fetchSavedWorkflow();
    } else {
      this.resetWorkflowFields();
    }
  }

  onSave() {
    this.screenError = !this.selectedScreen;
    if (this.screenError) {
      this.toastr.error(this.getTranslation('web.common.msgSelectScreen', 'Please select a screen'));
      return;
    }

    let approvalsPayload: any[] = [];

    if (this.workflowType === 'simple') {
      if (this.simpleWorkflowData.userId == null || this.simpleWorkflowData.userId === '') {
        this.toastr.error(this.getTranslation('web.common.msgSelectApprover', 'Please select an approver user'));
        return;
      }
      approvalsPayload = [
        {
          level_no: 1,
          user_code: String(this.simpleWorkflowData.userId),
          is_notification_enabled: this.simpleWorkflowData.isNotificationEnabled ? 1 : 0,
          notification_email: !!this.simpleWorkflowData.notificationEmail,
          notification_sms: !!this.simpleWorkflowData.notificationSms,
          is_email: !!this.simpleWorkflowData.notificationEmail,
          is_sms: !!this.simpleWorkflowData.notificationSms
        }
      ];
    } else {
      if (!this.workflowLevels.length) {
        this.toastr.error(this.getTranslation('web.common.msgAtLeastOneLevel', 'Please add at least one level'));
        return;
      }
      if (this.workflowLevels.some((level) => level.userId == null || level.userId === '')) {
        this.toastr.error(this.getTranslation('web.common.msgSelectApproverForAll', 'Please select an approver user for all levels'));
        return;
      }
      approvalsPayload = this.workflowLevels.map((level, index) => ({
        level_no: index + 1,
        user_code: String(level.userId),
        is_notification_enabled: level.isNotificationEnabled ? 1 : 0,
        notification_email: !!level.notificationEmail,
        notification_sms: !!level.notificationSms,
        is_email: !!level.notificationEmail,
        is_sms: !!level.notificationSms
      }));
    }

    const user = this.commonService.getCurrentUser();
    const payload = {
      screen: this.selectedScreen,
      workflow_type: this.workflowType === 'simple' ? 1 : 2,
      userid: Number(user?.userId) || 1,
      company_id: Number(user?.companyId) || 1,
      clientId: user?.clientId || '74BB6922',
      source: 'web',
      languageid: 1,
      approvals: approvalsPayload
    };

    this.isSaving = true;
    this.common_TabsService.saveWorkflow(payload).subscribe({
      next: (res: any) => {
        this.isSaving = false; 
        const isSuccess = (res && (res.statusCode === '200' || res.statusCode === 200)) ||
                          (res && res.statusCode === '-200' && (res.message?.toLowerCase().includes('record') || res.message?.toLowerCase().includes('no record')));

        if (isSuccess || (res && !res.isError && res.statusCode !== '500')) {
          const defaultSuccessMsg = this.workflowType === 'simple'
            ? this.getTranslation('web.common.msgSaveSuccessSimple', 'Simple workflow configuration saved successfully!')
            : this.getTranslation('web.common.msgSaveSuccessMultiple', 'Multiple workflow configuration saved successfully!');

          const toastMsg = (res?.message && !res.message.toLowerCase().includes('no record'))
            ? res.message
            : defaultSuccessMsg;

          this.toastr.success(defaultSuccessMsg, 'Success');

          this.saved = true;
          if (this.savedTimer) {
            clearTimeout(this.savedTimer);
          }
          this.savedTimer = setTimeout(() => {
            this.saved = false;
          }, 2500);

          // Re-fetch fresh saved workflow directly from API
          this.fetchSavedWorkflow();
        } else {
          this.toastr.error(res?.message || this.getTranslation('web.common.msgSaveError', 'Failed to save workflow'), 'Error');
        }
      },
      error: (err: any) => {
        this.isSaving = false;
        console.error('API Error saving workflow:', err);
        this.toastr.error(
          err?.error?.message || err?.message || this.getTranslation('web.common.msgSaveFailed', 'Failed to save workflow. Please try again.'),
          'Error'
        );
      }
    });
  }
}
