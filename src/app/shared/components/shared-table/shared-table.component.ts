import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-shared-table',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatPaginatorModule],
  templateUrl: './shared-table.component.html',
  styleUrls: ['./shared-table.component.scss']
})
export class SharedTableComponent {
  /** Array of column definitions: { key: string, label: string, isLink?: boolean, useTemplate?: boolean, width?: string, headerClass?: string, cellClass?: string } */
  @Input() columns: { key: string, label: string, isLink?: boolean, useTemplate?: boolean, width?: string, headerClass?: string, cellClass?: string }[] = [];

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

  /** Event emitted when a link column is clicked */
  @Output() linkClick = new EventEmitter<{ row: any, col: any }>();

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

  onPageChange(event: PageEvent) {
    this.pageChange.emit(event);
  }
}
