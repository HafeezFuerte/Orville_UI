import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule,TranslateService } from '@ngx-translate/core';
import { PageEvent } from '@angular/material/paginator';
import { OvPaginatorComponent } from '../../../shared/components/ov-paginator/ov-paginator.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthPayload } from '../../common/store/login-auth-params/auth.models';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { FilterDrawerComponent } from '../../../shared/components/filter-drawer/filter-drawer.component';

@Component({
  selector: 'app-workorders-table',
  standalone: true,
  imports: [CommonModule,RouterModule, FormsModule,TranslateModule, OvPaginatorComponent, FilterDrawerComponent],
  templateUrl: './workorders.component.html',
  styleUrls: ['./workorders.component.scss']
})
export class WorkordersTableComponent {
  /** Array of column definitions: { key: string, label: string, isLink?: boolean, useTemplate?: boolean, width?: string, headerClass?: string, cellClass?: string } */
   columns:any = [];
     @Input() selectedTab: any = [];
     searchQuery: string = '';
  /** The data to display in the table */
  @Input() data: any[] = [];
  workorderColumns: any[] = [
    { key: 'code', label: 'web.common.lblID',is_editCol:true,redirect_url:"/facility/work-orders",edit_col:"code",
    useTemplate: false, width: '', isHtml: false, headerClass: '', cellClass: '', is_include_currency: false, is_status: false, isLink: false},
    { key: 'title', label: 'Title', useTemplate: false, width: '', isHtml: false, headerClass: '', cellClass: '', is_include_currency: false, is_status: false, isLink: false, redirect_url: ''},
    { key: 'status_nm', label: 'Status', useTemplate: false, width: '', isHtml: false, headerClass: '', cellClass: '', is_include_currency: false, is_status: false, isLink: false, redirect_url: '' },
    { key: 'closing_status', label: 'Closing Status', useTemplate: false, width: '', isHtml: false, headerClass: '', cellClass: '', is_include_currency: false, is_status: false, isLink: false, redirect_url: '' },
    { key: 'internal_status', label: 'Internal Status', useTemplate: false, width: '', isHtml: false, headerClass: '', cellClass: '', is_include_currency: false, is_status: false, isLink: false, redirect_url: '' },
    { key: 'due_date', label: 'Due Date',is_editCol:false,redirect_url:null,edit_col:null },
    { key: 'priority', label: 'Priority', useTemplate: false, width: '', isHtml: false, headerClass: '', cellClass: '', is_include_currency: false, is_status: false, isLink: false, redirect_url: '' },
    { key: 'property', label: 'Property', useTemplate: false, width: '', isHtml: false, headerClass: '', cellClass: '', is_include_currency: false, is_status: false, isLink: false, redirect_url: '' },
    { key: 'vendor', label: 'Vendor',is_include_currency:true, useTemplate: false, width: '', isHtml: false, headerClass: '', cellClass: '', 
     is_status: false, isLink: false, redirect_url: '' },
    { key: 'createdby', label: 'Created By',is_status:true, useTemplate: false, width: '', isHtml: false, headerClass: '', cellClass: '', is_include_currency: false,  isLink: false, redirect_url: '' }, 
    { key: 'tags', label: 'Tags', useTemplate: false, width: '', isHtml: false, headerClass: '', cellClass: '', is_include_currency: false, is_status: false, isLink: false, redirect_url: '' },
    { key: 'maintenance_name', label: 'Maintenance Category' },
    { key: 'responsible_person', label: 'Responsible Person',is_include_currency:true, useTemplate: false, width: '', isHtml: false, headerClass: '', cellClass: '',  is_status: false, isLink: false, redirect_url: '' },
    { key: 'modified_date', label: 'Updated At',is_include_currency:true },
    { key: 'created_date', label: 'Created At', useTemplate: false, width: '', isHtml: false, headerClass: '', cellClass: '', is_include_currency: false, is_status: false, isLink: false, redirect_url: '' },
      
  ];
   

  /** Loading state indicator */
  @Input() loading: boolean = false;

  /** Custom message when no records are found */
  @Input() emptyMessage: string = 'web.common.lblNoRecordsFound';

  /** Total records for pagination */
  @Input() totalRecords: number = 0;

  /** Current page size */
  @Input() pageSize: number = 50;

  /** Current page index */
  @Input() pageIndex: number = 0;

  /** Flag to show/hide the action column */
  @Input() hasActions: boolean = false;

  /** Event emitted when pagination changes */
  @Output() pageChange = new EventEmitter<PageEvent>();
 

  @Output() notify_edit_action = new EventEmitter<string>();
  /** 
   * A reference to the ng-template passed from the parent component 
   * Example: <ng-template #actionTemplate let-row="row"> ... </ng-template>
   */
  @ContentChild('actionTemplate') actionTemplate!: TemplateRef<any>;

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
    private toastr:ToastrService,
    private translate: TranslateService) {
  
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

  ngOnInit(): void { 
    this.currentUser = this.commonService.getCurrentUser(); 
    this.columns=this.workorderColumns;
    this.totalRecords = this.totalRecords || this.data?.length || 0;
  } 
  search_with_keyword() {
    let result =this.selectedTab?.data;
    if(this.searchQuery){
      result = this.selectedTab?.data.filter((p: any) =>
      p.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      p.status_nm.toLowerCase().includes(this.searchQuery.toLowerCase())
    ); 
    }
    this.data=result;
    this.totalRecords = this.data?.length || 0;
  }
  onPageChange(event: PageEvent) {
    this.pageChange.emit(event);
  }
  edit_action(row:any,action:any){ 
    row.action_name=action;
    this.notify_edit_action.emit(row);
  }

  linkClick(row:any,col:any){ 
    window.open(row[col.key],"_blank");
  }
  getredirection_column(row:any,col:any){
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
getValueWithCurrency(val:any){
  return this.currentUser?.currencyCode+ ' '+ val;
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
    this.totalRecords = this.data?.length || 0;
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
