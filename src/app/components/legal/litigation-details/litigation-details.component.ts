import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DetailPageLayoutComponent } from '../../portfolio/detail-page-layout/detail-page-layout.component';
import { DetailTab } from '../../../shared/models/detail-tab.model';
import { NotesComponent } from '../../child-tables/notes/notes.component';
import { AttachmentsComponent } from '../../child-tables/attachments/attachments.component';
import { HearingsTableComponent } from '../../child-tables/hearings/hearings-table.component';

@Component({
  selector: 'app-litigation-details',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule, 
    DetailPageLayoutComponent, 
    NotesComponent, 
    AttachmentsComponent, 
    HearingsTableComponent
  ],
  templateUrl: './litigation-details.component.html',
  styleUrls: []
})
export class LitigationDetailsComponent implements OnInit {
  activeTab = 'overview';
  showMoreDetails = false;

  // DetailTab mappings for the detail-page-layout wrapper
  tabs: DetailTab[] = [];

  // Dummy sub-tables data
  hearingsData = [
    { id: '31658', date: '22-07-2026', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', attachment: '1 File' }
  ];

  notesData = [
    { code: '31658', subject: 'Move-in condition', description: 'Tenant reported minor paint marks near the living room window. Schedule touch-up.....', status: 'Portal', uploaded_date: '12-01-2026', created_by: 'Admin U' },
    { code: '31658', subject: 'Rent reminder', description: 'Friendly reminder sent to tenant regarding upcoming rent payment due on the first wo...', status: 'Email', uploaded_date: '12-01-2026', created_by: 'Property' }
  ];

  attachmentsData = [
    { code: 'ATT-1001', file_name: 'Property_Title_Deed.pdf', docId: 'DOC-1001', doc_status: 'Active', issueDate: '12-01-2026', expiryDate: '12-01-2026', file_path: '1 File' },
    { code: 'ATT-1001', file_name: 'Landlord_ID.pdf', docId: 'DOC-1001', doc_status: 'Verified', issueDate: '12-01-2026', expiryDate: '12-01-2026', file_path: '1 File' }
  ];

  hearingColumns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true },
    { key: 'date', label: 'Date', visible: true },
    { key: 'description', label: 'Description', visible: true },
    { key: 'attachment', label: 'Attachment', visible: true, useTemplate: true },
    { key: 'action', label: 'Action', visible: true, useTemplate: true }
  ];

  ngOnInit() {
    this.initializeTabs();
  }

  initializeTabs() {
    this.tabs = [
      {
        key: 'overview',
        label: 'Hearings',
        layout: 'content',
        columns: this.hearingColumns,
        data: this.hearingsData
      },
      {
        key: 'notes',
        label: 'Notes',
        layout: 'content',
        data: this.notesData
      },
      {
        key: 'attachments',
        label: 'Attachments',
        layout: 'content',
        data: this.attachmentsData
      }
    ];
  }

  get selectedTab(): DetailTab | undefined {
    return this.tabs.find(t => t.key === this.activeTab);
  }

  toggleMoreDetails() {
    this.showMoreDetails = !this.showMoreDetails;
  }
}
