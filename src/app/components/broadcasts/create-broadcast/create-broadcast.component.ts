import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { PortfolioService } from '../../portfolio/services/portfolio.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-create-broadcast',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule],
  templateUrl: './create-broadcast.component.html',
  styleUrl: './create-broadcast.component.scss'
})
export class CreateBroadcastComponent implements OnInit {
  private router = inject(Router);
  private portfolioService = inject(PortfolioService);
  private commonService = inject(CommonService);

  // 1. Choose Recipients
  audiences = ['Select', 'Tenant', 'Property', 'Landlord'];
  selectedAudience: string | null = null;
  
  allTenants: boolean = true;
  activeTenants: boolean = false;
  inactiveTenants: boolean = false;
  
  specificRecipients: string = '';

  // 2. Schedule
  isScheduled: boolean = false;
  scheduleDate: string = '';
  scheduleTime: string = '';

  // 3. Message setup
  templates = ['Select', 'Lease Agreement Notice', 'Rent Reminder', 'Maintenance Update'];
  selectedTemplate: string | null = null;
  
  subjectInput: string = '';
  
  broadcastTypes: any[] = [];
  selectedBroadcastType: any = null;

  // 4. Message details
  messageBody: string = '';

  // Attachments
  attachedFiles: File[] = [];

  // Summary computed
  get summaryRecipient(): string {
    if (this.allTenants) return 'All Tenants';
    if (this.activeTenants) return 'Active Tenants';
    return this.specificRecipients || 'None selected';
  }

  ngOnInit() {
    this.loadLookup(17, 'broadcastTypes', 'lookup_name');
  }

  loadLookup(filterId: number, targetProperty: string, nameField: string) {
    this.portfolioService.getMasterByType({
      typeId: 2,
      filterId: filterId,
      filterText: '',
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult.table) {
          (this as any)[targetProperty] = res.objResult.table.map((item: any) => ({
            id: item.id,
            name: item[nameField] || item.lookup_name || item.name || ''
          }));
        }
      },
      error: (err) => {
        console.error(`Error fetching lookup ${filterId}:`, err);
      }
    });
  }

  onFileDropped(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files) this.addFiles(files);
  }

  onFileDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onFileSelected(event: any) {
    if (event.target.files) this.addFiles(event.target.files);
  }

  addFiles(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      this.attachedFiles.push(files[i]);
    }
  }

  removeFile(index: number) {
    this.attachedFiles.splice(index, 1);
  }

  saveDraft() {
    this.postBroadcast(false);
  }

  sendBroadcast() {
    this.postBroadcast(true);
  }

  private postBroadcast(isPublish: boolean) {
    const currentUser = this.commonService.getCurrentUser();
    
    // Determine target recipient grouping
    let sendToVal = 'All';
    if (this.activeTenants) sendToVal = 'Active';
    if (this.inactiveTenants) sendToVal = 'Inactive';
    if (this.specificRecipients) sendToVal = 'Specific';

    const payload = {
      userid: currentUser?.userId || 1,
      company_id: currentUser?.companyId || 1,
      clientId: currentUser?.clientId || "74BB6922",
      source: "web",
      languageid: 1,
      code: "",
      send_to: sendToVal,
      email_address_list: this.specificRecipients || "",
      send_to_type: this.selectedAudience || "",
      broadcast_template: this.selectedTemplate ? this.templates.indexOf(this.selectedTemplate) : 0,
      subject: this.subjectInput,
      details: this.messageBody,
      broadcast_type: Number(this.selectedBroadcastType) || 0,
      is_scheduled: this.isScheduled,
      schedule_date: this.scheduleDate ? new Date(this.scheduleDate).toISOString() : new Date().toISOString(),
      schedule_time: this.scheduleTime || "",
      enabled_recurring: false
    };

    this.portfolioService.saveBroadcast(payload).subscribe({
      next: (res: any) => {
        this.goBack();
      },
      error: (err: any) => {
        console.error("Error saving broadcast:", err);
      }
    });
  }

  goBack() {
    this.router.navigate(['/broadcasts']);
  }
}
