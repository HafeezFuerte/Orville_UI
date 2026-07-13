import { TemplateRef } from '@angular/core';

export interface TableConfig {

  columns: any[];

  data: any[];

  loading?: boolean;

  totalRecords?: number;

  pageSize?: number;

  pageIndex?: number;

  hasActions?: boolean;

  emptyMessage?: string;

}
