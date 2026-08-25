import { Component, OnInit,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule } from '@angular/forms';
import { RouterModule,ActivatedRoute,Route } from '@angular/router';
import { DetailPageLayoutComponent } from '../../portfolio/detail-page-layout/detail-page-layout.component';
import { DetailTab } from '../../../shared/models/detail-tab.model';
import { NotesComponent } from '../../child-tables/notes/notes.component';
import { AttachmentsComponent } from '../../child-tables/attachments/attachments.component';
import { HearingsTableComponent } from '../../child-tables/hearings/hearings-table.component'; 
import { Common_TabsService } from '../../portfolio/services/common_tabs.service'; 
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../services/common.service';
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
  private route = inject(ActivatedRoute);
  private toastr = inject(ToastrService);
  private commonService = inject(CommonService);
  private commontabservice = inject(Common_TabsService);
  legalId: string = '';
  activeTab = 'overview';
  showMoreDetails = false;
  loading:boolean=false;
  Form!: FormGroup;
  legalInfo:any={};
  // DetailTab mappings for the detail-page-layout wrapper
  tabs: DetailTab[] = [];

  // Dummy sub-tables data
  hearingsData:any=[];  
  notesData:any=[]; 
  attachmentsData :any=[];

  hearingColumns = [
    { key: 'id', label: 'ID', visible: true, useTemplate: true },
    { key: 'date', label: 'Date', visible: true },
    { key: 'description', label: 'Description', visible: true },
    { key: 'attachment', label: 'Attachment', visible: true, useTemplate: true },
    { key: 'action', label: 'Action', visible: true, useTemplate: true }
  ];

  ngOnInit() { 
    this.route.paramMap.subscribe(params => {
      this.legalId = params.get('id') ?? '';
    });
    this.getLegalDetails();
  }

  initializeTabs() {
    this.tabs = [
      {
        key: 'overview',
        label: 'Hearings',
        entity_id: this.legalId,
        layout: 'content',
        columns: this.hearingColumns,
        data: this.hearingsData
      },
      {
        key: 'notes',
        label: 'web.common.lblNotes',
        layout: 'content',
        entity: "LegalCases",
        entity_id: this.legalId,
        data: this.notesData,
        totalRecords: this.notesData?.length || 0,
        loading: this.loading,
        hasActions: true,
        addButtonText: 'Notes',
        form: this.Form,
        popupType: 'notes'
      },
      {
        key: 'attachments',
        label: 'web.common.lblAttachments',
        layout: 'content',
        entity: "LegalCases",
        entity_id: this.legalId,
        data: this.attachmentsData,
        totalRecords: this.attachmentsData?.length || 0,
        loading: this.loading,
        hasActions: true,
        addButtonText: 'Attachments',
        form: this.Form,
        popupType: 'attachment'
      }
    ];
  }
  getLegalDetails() {
    this.commontabservice.getMasterByType({
      typeId: 41,
      filterId: 0,
      filterText: this.legalId,
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult.legalinfo) {
          this.legalInfo = res.objResult.legalinfo[0];
          this.attachmentsData = res.objResult.documents || []; 
          this.notesData = res.objResult.notes; 
          this.hearingsData=res.objResult.legal_hearing || [];
          this.initializeTabs(); 
        }
        else
          this.toastr.error("No record[s] found");
      },
      error: (err) => {
        console.error(`Error fetching typeid: 22:`, err);
      }
    });
  }

  get selectedTab(): DetailTab | undefined {
    return this.tabs.find(t => t.key === this.activeTab);
  }

  toggleMoreDetails() {
    this.showMoreDetails = !this.showMoreDetails;
  }
}
