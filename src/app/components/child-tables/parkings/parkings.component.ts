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
import { ParkingPopupComponent } from '../modal-popups/parking-popup/parking-popup.component';
import { ReusableModalComponent } from '../../portfolio/reusable-modal/reusable-modal.component';
import { DeleteConfirmationComponent } from '../../../shared/components/delete-confirmation/delete-confirmation.component';
import { FilterDrawerComponent } from '../../../shared/components/filter-drawer/filter-drawer.component';

@Component({
  selector: 'app-parkings-table',
  standalone: true,
  imports: [CommonModule, FormsModule, DeleteConfirmationComponent, RouterModule, ReusableModalComponent, ParkingPopupComponent, TranslateModule, FilterDrawerComponent, OvPaginatorComponent],
  templateUrl: './parkings.component.html',
  styleUrls: ['./parkings.component.scss']
})
export class ParkingsComponent {
  parkingsForm: any = [];
  data: any = [];
  /** Loading state indicator */
  loading: boolean = false;
  @Output() loadOnChange = new EventEmitter<string>();
  /** Custom message when no records are found */
  emptyMessage: string = 'web.common.lblNoRecordsFound';

  totalRecords: number = 0;
  columns: any[] = [
    { key: 'code', label: 'web.common.lblID', is_editCol: true, useTemplate: false, width: '', isHtml: false, headerClass: '', cellClass: '', is_include_currency: false, is_status: false, isLink: false, redirect_url: '' },
    { key: 'parking_no', label: 'web.portfolio.parking.lblParkingNo', useTemplate: false, width: '', isHtml: false, headerClass: '', cellClass: '', is_include_currency: false, is_status: false, isLink: false, redirect_url: '' },
    { key: 'property', label: 'web.property.lblProperty' , useTemplate: false, width: '', headerClass: '', cellClass: '', is_include_currency: false, is_status: false, isLink: false, redirect_url: '', isHtml: false },
    { key: 'unit_code1', label: 'web.portfolio.parking.lblUnit', is_editCol: true,redirect_url:"/units",edit_col:"unit_code",useTemplate: false, width: '', headerClass: '', cellClass: '', is_include_currency: false, is_status: false, isLink: false, isHtml: false },
    { key: 'parking_type_nm', label: 'web.portfolio.parking.lblParkingType', useTemplate: false, width: '', isHtml: false, headerClass: '', cellClass: '', is_include_currency: false, is_status: false, isLink: false, redirect_url: '' },
    { key: 'createdby', label: 'web.portfolio.parking.lblCreatedBy', useTemplate: false, width: '', isHtml: false, headerClass: '', cellClass:'', is_include_currency: false, is_status: false, isLink: false, redirect_url: '' },
    
  ];
    
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

  saveParking() { 

    const commonLabels = {
      property_code: this.translate.instant('web.portfolio.popups.parking.lblProperty'),
      unit_code: this.translate.instant('web.portfolio.popups.parking.lblUnit'),
      parking_no: this.translate.instant('web.portfolio.popups.parking.lblParkingno'),
      parking_type: this.translate.instant('web.portfolio.popups.parking.lblParkingType'),
      recurring_cycle: this.translate.instant('web.portfolio.popups.parking.lblRecurringCycle')
    };
    if (!this.validateForm(this.selectedTab.form, commonLabels)) {
      return;
    }
    const values = this.selectedTab.form.value;
    const payload = {
     ...this.commonService.commonPayload,
     id:0, 
     property_code:this.selectedTab?.entity_id,
     unit_code:values.unit_code,
     rooom_code:values.room_code,
     is_from_unit:this.selectedTab.key=="units"? true :false,
     parking_no:values.parking_no,
     parking_type:values.parking_type || '',
     recurring_cycle:values.recurring_cycle || 0,
     remarks:values.remarks || 0,
     code:values.code || ''
  };
  this.common_TabsService.saveParking(payload).subscribe({
      next: (res) => { 
        if (res["statusCode"] == "200") { 
          this.selectedTab.form.reset();
          this.closeModal();
          this.data = res.objResult.table; 
        } else{
          this.toastr.error(res['message'],"Error");
        }
      },
      error: console.error
  });
    
  }

  search_with_keyword() {
    let result =this.selectedTab?.data;
    if(this.searchQuery){
      result = this.selectedTab?.data.filter((p: any) =>
      p.parking_no.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      p.parking_type_nm.toLowerCase().includes(this.searchQuery.toLowerCase())
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
    this.parkingsForm = this.selectedTab?.form;
    this.selectedNote = {};
    this.data = this.selectedTab?.data;
    this.totalRecords=this.data.length;
    this.selectedTab.form = this.fb.group({
      property_code: ['', Validators.required],
      unit_code: ['', Validators.required],
      room_code: [''],
      parking_no: ['', Validators.required],
      parking_type: ['', Validators.required],
      recurring_cycle: ['', Validators.required],
      remarks: [''], 
      code:['']
    });
    this.selectedTab.form.patchValue({
      property_code: this.selectedTab?.entity_id,
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
      this.loadOnChange.emit(row);
      this.selectedTab.form.patchValue({
        property_code: row?.property_code,
        unit_code: row?.unit_code,
        room_code: row?.room_code,
        parking_no: row?.parking_no ??'',
        recurring_cycle: row?.recurring_cycle,
        parking_type: row?.parking_type ??'',
        remarks:row?.remarks ??'',
        code:row?.code ??''
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
  deleteParking() {
    this.loadMasterDataByType(this.selectedNote.id, '', this.selectedTab.entity_id);
  }
  loadMasterDataByType(
    filterId: number,
    filtertext: string = '',
    filterText1: string = '',
  ) {
    this.common_TabsService.getMasterByType({
      typeId: 37,
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
