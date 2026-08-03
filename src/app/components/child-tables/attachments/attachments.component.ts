import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthPayload } from '../../common/store/login-auth-params/auth.models';
import { CommonService } from '../../../services/common.service';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { Common_TabsService } from '../../portfolio/services/common_tabs.service'; 
import { AttachmentPopupComponent } from '../modal-popups/attachments-popup/attachment-popup.component';
import { ReusableModalComponent } from '../../portfolio/reusable-modal/reusable-modal.component';
import { DeleteConfirmationComponent } from '../../../shared/components/delete-confirmation/delete-confirmation.component';
@Component({
  selector: 'app-attachments-table',
  standalone: true,
  imports: [CommonModule, FormsModule, DeleteConfirmationComponent, RouterModule, ReusableModalComponent, AttachmentPopupComponent, TranslateModule, MatPaginatorModule],
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss']
})
export class AttachmentsComponent {
  attachmentsForm: any = [];
  data: any = [];
  /** Loading state indicator */
  loading: boolean = false;

  /** Custom message when no records are found */
  emptyMessage: string = 'web.common.lblNoRecordsFound';

  totalRecords: number = 0;
  columns: any[] = [ 
    { key: 'code', label: 'web.common.lblID', is_editCol: true, useTemplate: false, width: '', isHtml: false, headerClass: '', cellClass: '', is_include_currency: false, is_status: false, isLink: false, redirect_url: '' },
    { key: 'document_type_name', label: 'web.property.lblFileType',  useTemplate: false, width: '', isHtml: false, headerClass: '', cellClass: '', is_include_currency: false, is_status: false, isLink: false, redirect_url: '' },
    { key: 'doc_no', label: 'web.property.lblDocID', useTemplate: false, width: '', headerClass: '', cellClass: '', is_include_currency: false, is_status: false, isLink: false, redirect_url: '', isHtml: false },
    { key: 'document_status_name', label: 'web.property.lblDocumentStatus', useTemplate: false, width: '', headerClass: '', cellClass: '', is_include_currency: false, is_status: false, isLink: false, redirect_url: '', isHtml: true },
    { key: 'issue_date', label: 'web.property.lblIssueDate', useTemplate: false, width: '', isHtml: false, headerClass: '', cellClass: '', is_include_currency: false, is_status: false, isLink: false, redirect_url: '' },
    { key: 'expiry_date', label: 'web.property.lblExpiryDate', useTemplate: false, width: '', isHtml: false, headerClass: '', cellClass: '', is_include_currency: false, is_status: false, isLink: false, redirect_url: '' },
    { key: 'file_path', label: 'web.property.lblFiles',isLink:true,useTemplate: false, width: '', isHtml: false, headerClass: '', cellClass: '', is_include_currency: false, is_status: false,   redirect_url: '' },
     
  ];
  searchQuery: string = '';
  pageSize: number = 50;
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
  
  isEditMode: boolean = false;
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

  saveAttachment(){
    const attachmentLabels = {
      documentType: this.translate.instant('web.portfolio.popups.attachments.lblDocumentType'),
      propertyAttachment: this.translate.instant('web.portfolio.popups.attachments.lblUploadFile')
    };  
    if (!this.validateForm(this.selectedTab.form, attachmentLabels)) {
      return;
    }
    const values = this.selectedTab.form.value;
    const request = {
    ...this.commonService.commonPayload,
    code: values.code,
    entity_id: this.selectedTab?.entity_id,
    entity: this.selectedTab?.entity,
    document_type:values.documentType, 
    document_no:values.documentNumber,
      issue_date:values.issueDate,
      expiry_date:values.expiryDate,
      issuing_authority:values.issuingAuthority,
      share_with_tenants:values.shareWithTenant,
      share_with_landlords:values.shareWithLandlord
    }
    const formData = new FormData();
  
  // JSON goes as ONE field
  formData.append('reqObject', JSON.stringify(request)); 
  const file = this.selectedTab.form.get('propertyAttachment')?.value;
  if((file==null || file==undefined) && values.code==''){
    this.toastr.error("Invalid file selection","Error");
  }
  if (file) {
    formData.append('file_path', file);
  }
    this.common_TabsService.saveAttachment(formData)
      .subscribe(res => { 
        if (res["statusCode"] == "200") { 
          this.selectedTab.form.reset();
          this.closeModal();
          this.data = res.objResult.table || []; 
          this.totalRecords = this.data.length;
        }
        else{
          this.toastr.error(res['message'],"Error");
        }
      });
  }

 
  search_with_keyword() {
    let result =this.selectedTab?.data;
    if(this.searchQuery){
      result = this.selectedTab?.data.filter((p: any) =>
      p.doc_no.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      p.document_type_name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    }
    this.data=result; 
  }
  openModal() {
    this.isEditMode = false;
    this.showModal = true;
    this.selectedTab.form.reset();
  }
  ngOnInit(): void {
    this.currentUser = this.commonService.getCurrentUser();
    this.attachmentsForm = this.selectedTab?.form;
    this.selectedNote = {};
    this.data = this.selectedTab?.data || [];
    this.totalRecords = this.data.length;
    this.selectedTab.form = this.fb.group({
      documentType: ['', Validators.required],
      documentNumber: ['', Validators.required],
      issueDate: ['', Validators.required],
      expiryDate: ['', Validators.required],
      issuingAuthority: ['', Validators.required],
      shareWithTenant: ['', Validators.required],
      shareWithLandlord: ['', Validators.required],
      propertyAttachment: [''],
      code:['']
    });
  }

  onPageChange(event: PageEvent) {
    this.pageChange.emit(event);
  }
  edit_action(row: any, action: any) { 
    row.action_name = action;
    this.selectedNote = row;
    if (action == "edit") {
      this.isEditMode = true;
      this.showModal = true;
      this.selectedTab.form.patchValue({
        documentType: row?.document_type,
        documentNumber:row?.doc_no,
        issueDate: this.formatDate(row?.issue_date),  
        expiryDate: this.formatDate(row?.expiry_date),  
        issuingAuthority: row?.issuing_authority,  
        shareWithTenant: row?.share_with_tenants,  
        shareWithLandlord: row?.share_with_landlords,  
        code: row?.code}); 
 
    }
    else if (action == "delete") {
      this.deleteModal = true;
    }
  }
  private formatDate(date:any) {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }
  closeModal() {
    this.showModal = this.deleteModal = false;
    this.selectedNote = {};
  }
  deleteAttachment() {
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
  filterId: string = '';
  filterFileType: string = '';
  filterDocumentStatus: string = '';

  applyFilters() {
    let result = this.selectedTab?.data || [];
    if (this.filterId) {
      result = result.filter((p: any) => p.code?.toString().includes(this.filterId));
    }
    if (this.filterFileType) {
      result = result.filter((p: any) => p.document_type_name?.toLowerCase().includes(this.filterFileType.toLowerCase()));
    }
    if (this.filterDocumentStatus) {
      result = result.filter((p: any) => p.document_status_name?.toLowerCase().includes(this.filterDocumentStatus.toLowerCase()));
    }
    this.data = result;
  }

  clearFilters() {
    this.filterId = '';
    this.filterFileType = '';
    this.filterDocumentStatus = '';
    this.applyFilters();
  }

}
