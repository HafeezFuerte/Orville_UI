import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PageEvent } from '@angular/material/paginator';
import { OvPaginatorComponent } from '../../../shared/components/ov-paginator/ov-paginator.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthPayload } from '../../common/store/login-auth-params/auth.models';
import { CommonService } from '../../../services/common.service';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { Common_TabsService } from '../../portfolio/services/common_tabs.service';
import { NotesPopupComponent } from '../modal-popups/notes-popup/notes-popup.component';
import { ReusableModalComponent } from '../../portfolio/reusable-modal/reusable-modal.component';
import { DeleteConfirmationComponent } from '../../../shared/components/delete-confirmation/delete-confirmation.component';

import { FilterDrawerComponent } from '../../../shared/components/filter-drawer/filter-drawer.component';

@Component({
  selector: 'app-notes-table',
  standalone: true,
  imports: [CommonModule, FormsModule, DeleteConfirmationComponent, RouterModule, ReusableModalComponent, NotesPopupComponent, TranslateModule, FilterDrawerComponent, OvPaginatorComponent],
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent {
  notesForm: any = [];
  data: any = [];
  /** Loading state indicator */
  loading: boolean = false;

  /** Custom message when no records are found */
  emptyMessage: string = 'web.common.lblNoRecordsFound';

  totalRecords: number = 0;
  columns: any[] = [
    { key: 'code', label: 'web.common.lblID', is_editCol: true, useTemplate: false, width: '', isHtml: false, headerClass: '', cellClass: '', is_include_currency: false, is_status: false, isLink: false, redirect_url: '' },
    { key: 'subject', label: 'web.property.lblSubject', useTemplate: false, width: '', isHtml: false, headerClass: '', cellClass: '', is_include_currency: false, is_status: false, isLink: false, redirect_url: '' },
    { key: 'description', label: 'web.property.lblContent', useTemplate: false, width: '', headerClass: '', cellClass: '', is_include_currency: false, is_status: false, isLink: false, redirect_url: '', isHtml: true },
    { key: 'status', label: 'web.property.lblVia', useTemplate: false, width: '', isHtml: false, headerClass: '', cellClass: '', is_include_currency: false, is_status: false, isLink: false, redirect_url: '' },
    { key: 'uploaded_date', label: 'web.property.lblNoteDate', useTemplate: false, width: '', isHtml: false, headerClass: '', cellClass: '', is_include_currency: false, is_status: false, isLink: false, redirect_url: '' },
    { key: 'created_by', label: 'web.property.lblCreatedBy', useTemplate: false, width: '', isHtml: false, headerClass: '', cellClass: '', is_include_currency: false, is_status: false, isLink: false, redirect_url: '' },
    { key: 'file_path', label: 'web.property.lblFiles', useTemplate: false, width: '', isHtml: false, headerClass: '', cellClass: '', is_include_currency: false, is_status: false, redirect_url: '', isLink: true },
    { key: 'uploaded_date', label: 'web.property.lblCreatedAt', useTemplate: false, width: '', isHtml: false, headerClass: '', cellClass: '', is_include_currency: false, is_status: false, isLink: false, redirect_url: '' },
    { key: 'modified_date', label: 'web.property.lblModifiedDate', useTemplate: false, width: '', isHtml: false, headerClass: '', cellClass: '', is_include_currency: false, is_status: false, isLink: false, redirect_url: '' },
  ];
  searchQuery: string = '';
  pageSize: number = 5;
  @Input() selectedTab: any = [];
  /** Current page index */
  pageIndex: number = 0;

  /** Flag to show/hide the action column */
  hasActions: boolean = false;

  /** Event emitted when pagination changes */
  pageChange = new EventEmitter<PageEvent>();


  notify_edit_action = new EventEmitter<string>();
  /** 
   * A reference to the ng-template passed from the parent component 
   * Example: <ng-template #actionTemplate let-row="row"> ... </ng-template>
   */
  @ContentChild('actionTemplate') actionTemplate!: TemplateRef<any>;
  showModal = false;
  deleteModal = false;
  selectedNote: any = {};
  /** Reference for a custom column template */
  @Input() colTemplateName: string = '';
  @Input() customColTemplate?: TemplateRef<any>;
  @ContentChild('colTemplate') colTemplate!: TemplateRef<any>;

  /** Reference for a custom header template */
  @ContentChild('headerTemplate') headerTemplate!: TemplateRef<any>;

  /** Reference for a custom empty state template */
  @ContentChild('emptyTemplate') emptyTemplate!: TemplateRef<any>;
  currentUser: AuthPayload | null = null;
  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private commonService: CommonService,
    private common_TabsService: Common_TabsService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private translate: TranslateService) {

  }

  validateForm(form: FormGroup, fieldLabels: { [key: string]: string }): boolean {
    const errors: string[] = [];
    Object.keys(fieldLabels).forEach(controlName => {
      const control = form.get(controlName);
      if (control?.invalid) {
        errors.push(`${fieldLabels[controlName]} is required.`);
      }
    });
    if (errors.length > 0) {
      form.markAllAsTouched();
      this.toastr.error(
        errors.join('<br>'),
        'Validation',
        {
          enableHtml: true,
          timeOut: 5000,
          positionClass: 'toast-top-right'
        }
      );
      return false;
    }
    return true;
  }
  isColumnDropdownOpen = false;
  isDrawerOpen = false;

  toggleDrawer(open: boolean) {
    this.isDrawerOpen = open;
  }

  toggleColumnDropdown() {
    this.isColumnDropdownOpen = !this.isColumnDropdownOpen;
  }

  get visibleColumns() {
    return this.columns.filter((c: any) => c.visible !== false);
  }

  toggleColumn(col: any) {
    col.visible = !(col.visible !== false);
  }

  toggleAllColumns(event: any) {
    const isChecked = event.target.checked;
    this.columns.forEach((c: any) => c.visible = isChecked);
  }

  get allColumnsVisible() {
    if (!this.columns?.length) return false;
    return this.columns.every((c: any) => c.visible !== false);
  }

  saveNotes() {
    const labels = {
      subject: this.translate.instant('web.portfolio.popups.notes.lblSubject'),
      commChannelType: this.translate.instant('web.portfolio.popups.notes.lblCommChannel'),
      content: this.translate.instant('web.portfolio.popups.notes.lblContent'),
      propertyNotesFile: this.translate.instant('web.portfolio.popups.notes.lblUploadFile')
    };
    if (!this.validateForm(this.selectedTab.form, labels)) {
      return;
    }

    const values = this.selectedTab.form.value;
    const payload = {
      ...this.commonService.commonPayload,
      id: 0,
      entity_id: this.selectedTab?.entity_id,
      entity: this.selectedTab?.entity,
      subject: values.subject,
      channel_type: Number(values.commChannelType),
      desc: values.content,
      code: values.code
    }
    const formData = new FormData();

    formData.append('reqObject', JSON.stringify(payload));

    const file = this.selectedTab.form.get('propertyNotesFile')?.value;
    if ((file == null || file == undefined) && values.code == '') {
      this.toastr.error("Invalid file selection", "Error");
    }
    if (file) {
      formData.append('file_path', file);
    }
    this.common_TabsService.saveNotes(formData)
      .subscribe(res => {
        if (res["statusCode"] == "200") {
          this.selectedTab.form.reset();
          this.closeModal();
          this.data = res.objResult.table;
        }
        else {
          this.toastr.error(res['message'], "Error");
        }

      });
  }

  search_with_keyword() {
    let result =this.selectedTab?.data;
    if(this.searchQuery){
      result = this.selectedTab?.data.filter((p: any) =>
      p.subject.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(this.searchQuery.toLowerCase())
    ); 
    }
    this.data=result;
  }
  openModal() {
    this.showModal = true;
    this.selectedTab.form.reset();
    this.selectedTab.form.patchValue({ 
      content:'', 
      desc:''
    });
  }
  ngOnInit(): void {
    this.currentUser = this.commonService.getCurrentUser();
    this.notesForm = this.selectedTab?.form;
    this.selectedNote = {};
    this.data = this.selectedTab?.data;
    this.totalRecords=this.data.length;
    this.selectedTab.form = this.fb.group({
      subject: ['', Validators.required],
      commChannelType: ['', Validators.required],
      content: ['', Validators.required],
      propertyNotesFile: [''],
      code: [''],
      desc: ['']
    });
  }

  onPageChange(event: PageEvent) {
    this.pageChange.emit(event);
  }
  edit_action(row: any, action: any) {
    row.action_name = action;
    this.selectedNote = row;
    if (action == "edit") {
      this.showModal = true;
      this.selectedTab.form.patchValue({
        subject: row?.subject,
        commChannelType: row?.channel_type,
        content: row?.description ??'',
        code: row?.code,
        desc: row?.description ??''
      });
    }
    else if (action == "delete") {
      this.deleteModal = true;
    }
  }
  closeModal() {
    this.showModal = this.deleteModal = false;
    this.selectedNote = {};
  }
  deleteNote() {
    this.loadMasterDataByType(this.selectedNote.id, this.selectedTab.entity, this.selectedTab.entity_id);
  }
  loadMasterDataByType(
    filterId: number,
    filtertext: string = '',
    filterText1: string = '',
  ) {
    this.common_TabsService.getMasterByType({
      typeId: 34,
      filterId,
      filterText: filtertext,
      filterText1: filterText1
    }).subscribe({
      next: res => {
        this.loading = false;
        if (res['statusCode'] != "200") {
          this.loading = false;
          return;
        }
        this.toastr.success("Successfully marked as inactive", "Success");
        this.closeModal();
        this.data = res.objResult.table;
        this.selectedNote = {};
        this.totalRecords=this.data.length;
      },
      error: console.error
    });
  }
  linkClick(row: any, col: any) {
    window.open(row[col.key], "_blank");
  }
  getredirection_column(row: any, col: any) {
    return row[col.edit_col];
  }
  stripHtml(html: string): string {
    if (!html) {
      return '-';
    }

    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '-';
  }
  getValueWithCurrency(val: any) {
    return this.currentUser?.currencyCode + ' ' + val;
  }

  // Filter Drawer State Variables
  filterTags: string = '';
  filterArea: string = '';
  filterId: string = '';
  filterRefNo: string = '';
  filterOffPlanStatus: string = '';
  filterLandlord: string = '';
  filterInternalStatus: string = '';

  applyFilters() {
    let result = this.selectedTab?.data || [];
    if (this.filterId) {
      result = result.filter((p: any) => p.code?.toString().includes(this.filterId));
    }
    if (this.filterTags) {
      result = result.filter((p: any) => p.tags?.toLowerCase().includes(this.filterTags.toLowerCase()));
    }
    if (this.filterLandlord) {
      result = result.filter((p: any) => p.landlord?.toLowerCase().includes(this.filterLandlord.toLowerCase()));
    }
    this.data = result;
  }

  clearFilters() {
    this.filterTags = '';
    this.filterArea = '';
    this.filterId = '';
    this.filterRefNo = '';
    this.filterOffPlanStatus = '';
    this.filterLandlord = '';
    this.filterInternalStatus = '';
    this.applyFilters();
  }
}
