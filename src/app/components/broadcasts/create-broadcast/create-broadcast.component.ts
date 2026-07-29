import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { PortfolioService } from '../../portfolio/services/portfolio.service';

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
    // TODO: API call for draft
  }

  sendBroadcast() {
    // TODO: API call to send
  }

  goBack() {
    this.router.navigate(['/broadcasts']);
  }
}
