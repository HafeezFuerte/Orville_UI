import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule,TranslateService } from '@ngx-translate/core';
import { MatPaginatorModule, PageEvent,MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthPayload } from '../../../components/common/store/login-auth-params/auth.models';
import { CommonService } from '../../../services/common.service';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-shared-table',
  standalone: true,
  imports: [CommonModule,RouterModule, TranslateModule, MatPaginatorModule],
  templateUrl: './shared-table.component.html',
  styleUrls: ['./shared-table.component.scss']
})
export class SharedTableComponent {
  /** Array of column definitions: { key: string, label: string, isLink?: boolean, useTemplate?: boolean, width?: string, headerClass?: string, cellClass?: string } */
  @Input() columns: { key: string, 
    label: string,
    is_include_currency?:boolean,
    is_status?:boolean,
     isLink?: boolean, 
     is_editCol?: boolean,
     redirect_url?:string,
     edit_col?:string,
     useTemplate?: boolean, width?: string, 
     isHtml?: boolean, headerClass?: string, 
     cellClass?: string }[] = [];

  /** The data to display in the table */
  @Input() data: any[] = [];

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
 
  @Input() pageSizeOptions = [5, 10, 25, 50, 100];
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

  ngOnInit(): void {
    this.currentUser = this.commonService.getCurrentUser(); 
    console.log(this.totalRecords);
    console.log(this.pageIndex);
    console.log(this.pageSize)
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
}
