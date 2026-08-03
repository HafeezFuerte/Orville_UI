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
import { CommonAreaPopupComponent } from '../modal-popups/common-area-popup/common-area-popup.component';
import { ReusableModalComponent } from '../../portfolio/reusable-modal/reusable-modal.component';
import { DeleteConfirmationComponent } from '../../../shared/components/delete-confirmation/delete-confirmation.component';
@Component({
  selector: 'app-commonarea-table',
  standalone: true,
  imports: [CommonModule, FormsModule, DeleteConfirmationComponent, RouterModule, ReusableModalComponent, CommonAreaPopupComponent, TranslateModule, MatPaginatorModule],
  templateUrl: './commonarea.component.html',
  styleUrls: ['./commonarea.component.scss']
})
export class CommonAreaComponent {
  commonAreaForm: any = [];
  data: any = [];
  /** Loading state indicator */
  loading: boolean = false;

  /** Custom message when no records are found */
  emptyMessage: string = 'web.common.lblNoRecordsFound';

  totalRecords: number = 0;
  columns: any[] = [
    { key: 'code', label: 'web.common.lblID', is_editCol: true, useTemplate: false, width: '', isHtml: false, headerClass: '', cellClass: '', is_include_currency: false, is_status: false, isLink: false, redirect_url: '' },
    { key: 'area_name', label: 'web.property.lblAreaName', useTemplate: false, width: '', isHtml: false, headerClass: '', cellClass: '', is_include_currency: false, is_status: false, isLink: false, redirect_url: '' },
    { key: 'property', label: 'web.property.lblProperty', useTemplate: false, width: '', headerClass: '', cellClass: '', is_include_currency: false, is_status: false, isLink: false, redirect_url: '', isHtml: false },
    { key: 'floor_no', label: 'web.property.lblFloorNo', useTemplate: false, width: '', headerClass: '', cellClass: '', is_include_currency: false, is_status: false, isLink: false, redirect_url: '', isHtml: true },
    { key: 'uploaded_date', label: 'web.Unit.lblCreatedAt', useTemplate: false, width: '', isHtml: false, headerClass: '', cellClass: '', is_include_currency: false, is_status: false, isLink: false, redirect_url: '' },
    {key: 'modified_date', label: 'web.Unit.lblUpdatedAt', useTemplate: false, width: '', isHtml: false, headerClass: '', cellClass: '', is_include_currency: false, is_status: false, isLink: false, redirect_url: '' },
   
  ];
  
  isDrawerOpen = false;
  isColumnDropdownOpen = false;
  filterId = '';
  filterAreaName = '';

  searchQuery: string = '';
  pageSize: number = 5;
  @Input() selectedTab: any = [];
  /** Current page index */
  pageIndex: number = 1;

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
  saveCommonArea() {
    const commonAreaLabels = {
      areaName: this.translate.instant('web.portfolio.popups.commonArea.lblAreaName'),
      floor: this.translate.instant('web.portfolio.popups.commonArea.lblFloorNo')
    };
    if (!this.validateForm(this.selectedTab.form, commonAreaLabels)) {
      return;
    }
    const values = this.selectedTab.form.value;
    const payload = {
      userid: this.currentUser?.userId,
      company_id: this.currentUser?.companyId,
      clientId: this.currentUser?.clientId,
      source: "web",
      languageid: 1,
      id: 0,
      property_code: this.selectedTab.entity_id,
      code: values.code || '',
      area_name: values.areaName,
      floor_no: values.floor,
      desc: values.desc || ''
    };
    this.common_TabsService.saveCommonArea(payload).subscribe({
      next: (res) => {
        if (res["statusCode"] == "200") {
          this.selectedTab.form.reset();
          this.closeModal();
          this.data = res.objResult.table;
        } else {
          this.toastr.error(res['message'], "Error");
        }
      },
      error: console.error
    });
  }

  search_with_keyword() {
    this.applyFilters();
  }
  
  applyFilters() {
    let result = this.selectedTab?.data || [];
    
    if (this.filterId) {
      result = result.filter((p: any) => String(p.code).includes(this.filterId));
    }
    if (this.filterAreaName) {
      result = result.filter((p: any) => p.area_name?.toLowerCase().includes(this.filterAreaName.toLowerCase()));
    }
    if(this.searchQuery){
      result = result.filter((p: any) =>
        (p.area_name && p.area_name.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
        (p.floor_no && p.floor_no.toLowerCase().includes(this.searchQuery.toLowerCase()))
      ); 
    }
    this.data = result;
  }

  clearFilters() {
    this.filterId = '';
    this.filterAreaName = '';
    this.searchQuery = '';
    this.applyFilters();
  }

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
    return this.columns.every((c: any) => c.visible !== false);
  }

  openModal() {
    this.showModal = true;
    this.selectedTab.form.reset();
  }
  ngOnInit(): void {
    this.currentUser = this.commonService.getCurrentUser();
    this.commonAreaForm = this.selectedTab?.form;
    this.selectedNote = {};
    this.data = this.selectedTab?.data;
    this.totalRecords = this.data.length;
    this.selectedTab.form = this.fb.group({
      areaName: ['', Validators.required],
      floor: ['', Validators.required],
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
        areaName: row?.area_name,
        floor: row?.floor_no,
        code: row?.code,
        desc: row?.strdesc
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
        this.totalRecords = this.data.length;
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
  getStatusClass(status: string) {
    switch (status) {
      case 'Occupied': return 'bg-secondary/10 text-secondary';
      case 'Vacant': return 'bg-danger/10 text-danger';
      case 'Sold': return 'bg-green/10 text-green';
      default: return 'bg-gray-100 text-gray-600';
    }
  }
}
