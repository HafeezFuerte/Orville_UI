import { TableConfig } from './table-config.model';

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

}
