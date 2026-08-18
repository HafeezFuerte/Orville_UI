import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  CHEQUE_COLUMNS,
  INVOICE_CHEQUE_ROWS,
  INVOICE_DETAIL,
  INVOICE_OVERVIEW_ROWS,
  INVOICE_PENALTY_ROWS,
  INVOICE_TXN_ROWS,
  InvoiceChequeRow,
  InvoiceCol,
  InvoiceDetail,
  InvoiceOverviewRow,
  InvoicePenaltyRow,
  InvoiceTxnRow,
  OVERVIEW_COLUMNS,
  PENALTY_COLUMNS,
  TXN_COLUMNS
} from './invoice-detail.data';
import { INVOICE_ROWS } from './invoices.data';

type TableKey = 'overview' | 'cheques' | 'txns' | 'penalties';

@Component({
  selector: 'app-invoice-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './invoice-detail.component.html',
  styleUrl: './invoice-detail.component.scss'
})
export class InvoiceDetailComponent implements OnInit {
  invoice: InvoiceDetail = INVOICE_DETAIL;
  overviewRows: InvoiceOverviewRow[] = INVOICE_OVERVIEW_ROWS;
  chequeRows: InvoiceChequeRow[] = INVOICE_CHEQUE_ROWS;
  txnRows: InvoiceTxnRow[] = INVOICE_TXN_ROWS;
  penaltyRows: InvoicePenaltyRow[] = INVOICE_PENALTY_ROWS;

  overviewCols = OVERVIEW_COLUMNS.map((col) => ({ ...col }));
  chequeCols = CHEQUE_COLUMNS.map((col) => ({ ...col }));
  txnCols = TXN_COLUMNS.map((col) => ({ ...col }));
  penaltyCols = PENALTY_COLUMNS.map((col) => ({ ...col }));

  overviewQuery = '';
  chequeQuery = '';
  txnQuery = '';
  penaltyQuery = '';
  openColumnMenu: TableKey | null = null;
  actionOpen = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }
    const row = INVOICE_ROWS.find((item) => item.id === id);
    this.invoice = {
      ...this.invoice,
      id,
      invoiceNo: row?.invoiceNumber || this.invoice.invoiceNo,
      tenant: row?.to || this.invoice.tenant,
      issueDate: row?.invoiceDate || this.invoice.issueDate,
      dueDate: row?.dueDate || this.invoice.dueDate,
      paymentVia: row?.paymentVia || this.invoice.paymentVia,
      preparedBy: row?.createdBy || this.invoice.preparedBy,
      amountPaid: row?.paid || this.invoice.amountPaid,
      amountDue: row?.status === 'Paid' ? 'AED 0.00' : row?.amount || this.invoice.amountDue,
      status: row?.status || this.invoice.status
    };
  }

  goBack(): void {
    void this.router.navigate(['/accounting/invoices']);
  }

  toggleAction(event: Event): void {
    event.stopPropagation();
    this.actionOpen = !this.actionOpen;
    this.openColumnMenu = null;
  }

  toggleColumnMenu(key: TableKey, event: Event): void {
    event.stopPropagation();
    this.openColumnMenu = this.openColumnMenu === key ? null : key;
    this.actionOpen = false;
  }

  @HostListener('document:click')
  closeMenus(): void {
    this.actionOpen = false;
    this.openColumnMenu = null;
  }

  visible(cols: InvoiceCol[]): InvoiceCol[] {
    return cols.filter((col) => col.visible);
  }

  allSelected(cols: InvoiceCol[]): boolean {
    return cols.every((col) => col.visible);
  }

  toggleColumn(cols: InvoiceCol[], key: string): void {
    const col = cols.find((item) => item.key === key);
    if (col) {
      col.visible = !col.visible;
    }
  }

  toggleAll(cols: InvoiceCol[], event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    cols.forEach((col) => (col.visible = checked));
  }

  filteredOverview(): InvoiceOverviewRow[] {
    return this.filterRows(this.overviewRows, this.overviewQuery);
  }

  filteredCheques(): InvoiceChequeRow[] {
    return this.filterRows(this.chequeRows, this.chequeQuery);
  }

  filteredTxns(): InvoiceTxnRow[] {
    return this.filterRows(this.txnRows, this.txnQuery);
  }

  filteredPenalties(): InvoicePenaltyRow[] {
    return this.filterRows(this.penaltyRows, this.penaltyQuery);
  }

  cell(row: object, key: string): string {
    return String((row as Record<string, unknown>)[key] ?? '');
  }

  statusBadge(status: string): string {
    const map: Record<string, string> = {
      Paid: 'inv-badge--paid',
      Draft: 'inv-badge--draft',
      Pending: 'inv-badge--pending',
      Rejected: 'inv-badge--rejected',
      Deposited: 'inv-badge--pending',
      Unpaid: 'inv-badge--rejected',
      Overdue: 'inv-badge--rejected',
      Hold: 'inv-badge--pending',
      'Pending Approvals': 'inv-badge--pending',
      Bounced: 'inv-badge--rejected'
    };
    return map[status] || 'inv-badge--draft';
  }

  get dueCardClass(): string {
    const map: Record<string, string> = {
      Paid: 'invd-due--paid',
      Draft: 'invd-due--draft',
      Void: 'invd-due--draft',
      'Write Off': 'invd-due--draft',
      Pending: 'invd-due--pending',
      Hold: 'invd-due--pending',
      'Pending Approvals': 'invd-due--pending',
      Rejected: 'invd-due--rejected',
      Unpaid: 'invd-due--rejected',
      Overdue: 'invd-due--rejected',
      Bounced: 'invd-due--rejected'
    };
    return map[this.invoice.status] || 'invd-due--draft';
  }

  get showDeposited(): boolean {
    return this.invoice.status === 'Draft' || this.invoice.status === 'Pending' || this.invoice.status === 'Hold';
  }

  private filterRows<T extends object>(rows: T[], query: string): T[] {
    const q = query.trim().toLowerCase();
    if (!q) {
      return rows;
    }
    return rows.filter((row) =>
      Object.values(row).some((value) => String(value).toLowerCase().includes(q))
    );
  }
}
