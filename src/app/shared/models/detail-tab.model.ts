import { FormGroup } from '@angular/forms';

export interface DetailTab {

  key: string;
  label: string;

  layout: 'content' | 'table' | 'content-table';

  columns?: any[];
  data?: any[];

  loading?: boolean;
  totalRecords?: number;
  pageSize?: number;
  pageIndex?: number;

  hasActions?: boolean;
  addButtonText?: string;

  // NEW
  popupType?: 'common-area' | 'attachment' | 'notes';

  form?: FormGroup;

}
