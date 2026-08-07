import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { PortfolioService } from '../../portfolio/services/portfolio.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-create-broadcast',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule],
  templateUrl: './create-broadcast.component.html',
  styleUrl: './create-broadcast.component.scss'
})
export class CreateBroadcastComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private portfolioService = inject(PortfolioService);
  private commonService = inject(CommonService);

  editId: string = '';
  editDbId: number = 0;

  // 1. Choose Recipients
  audiences = ['Select', 'Tenant', 'Property', 'Landlord'];
  selectedAudience: string | null = null;
  
  allTenants: boolean = true;
  activeTenants: boolean = false;
  inactiveTenants: boolean = false;
  
  specificRecipients: string = '';
  recipientList: string[] = ['Angela Moore'];

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
    return this.recipientList.join(', ') || 'None selected';
  }

  ngOnInit() {
    this.loadLookup(17, 'broadcastTypes', 'lookup_name');
    this.route.queryParams.subscribe(params => {
      if (params['editId']) {
        this.editId = params['editId'];
        this.loadBroadcastDetails(this.editId);
      }
    });
  }

  addRecipient(event: any) {
    const val = event.target.value.trim();
    if (val && !this.recipientList.includes(val)) {
      this.recipientList.push(val);
      this.specificRecipients = '';
    }
    event.preventDefault();
  }

  removeRecipient(index: number) {
    this.recipientList.splice(index, 1);
  }

  loadBroadcastDetails(id: string) {
    const currentUser = this.commonService.getCurrentUser();
    const payload = {
      userid: currentUser?.userId || 1,
      company_id: currentUser?.companyId || 1,
      clientId: currentUser?.clientId || "74BB6922",
      source: "web",
      languageid: 1,
      page_no: 0,
      seqno: 0,
      search_keyword: id,
      pagecount: 1,
      filter_by: "",
      filter_list: "",
      featureid: "BROADCASTS"
    };

    this.portfolioService.getMastersByPaging(payload).subscribe({
      next: (res: any) => {
        if (res && res.objResult && res.objResult.broadcasts && res.objResult.broadcasts.length > 0) {
          const item = res.objResult.broadcasts[0];
          this.editId = item.code || id;
          this.editDbId = item.id || 0;
          this.selectedAudience = item.send_to_type || 'Tenant';
          this.subjectInput = item.subject || '';
          this.messageBody = item.details || '';
          this.selectedBroadcastType = item.broadcast_type || null;
          this.isScheduled = item.is_scheduled !== undefined ? item.is_scheduled : (item.scheduled || false);
          
          if (item.broadcast_template !== undefined && item.broadcast_template !== null) {
            this.selectedTemplate = this.templates[item.broadcast_template] || null;
          }

          if (item.scheduled_date) {
            this.scheduleDate = item.scheduled_date.split('T')[0] || '';
            const timeParts = item.scheduled_date.split('T')[1];
            if (timeParts) {
              this.scheduleTime = timeParts.substring(0, 5) || '';
            }
          }
          if (item.send_to === 'Active') {
            this.activeTenants = true;
            this.allTenants = false;
          } else if (item.send_to === 'Inactive') {
            this.inactiveTenants = true;
            this.allTenants = false;
          } else if (item.send_to === 'Specific') {
            this.allTenants = false;
            if (item.email_address_list) {
              this.recipientList = item.email_address_list.split(',').map((s: string) => s.trim());
            }
          }
        }
      }
    });
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
    else if (this.inactiveTenants) sendToVal = 'Inactive';
    else if (this.recipientList.length > 0) sendToVal = 'Specific';

    const payload = {
      userid: currentUser?.userId || 1,
      company_id: currentUser?.companyId || 1,
      clientId: currentUser?.clientId || "74BB6922",
      source: "web",
      languageid: 1,
      code: this.editId || "",
      id: this.editDbId || 0,
      send_to: sendToVal,
      email_address_list: this.recipientList.join(', '),
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
