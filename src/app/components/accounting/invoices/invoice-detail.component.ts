import { Component, HostListener, OnInit,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { Common_TabsService } from '../../portfolio/services/common_tabs.service';
import { ToastrService } from 'ngx-toastr';
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
import { FinancialsComponent } from '../../child-tables/financials/financials.component';

type TableKey = 'overview' | 'cheques' | 'txns' | 'penalties';

@Component({
  selector: 'app-invoice-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FinancialsComponent],
  templateUrl: './invoice-detail.component.html',
  styleUrl: './invoice-detail.component.scss'
})
export class InvoiceDetailComponent implements OnInit {
  invoice: any={};
  invoice_no:string='';
  receiptslist:any=[];
  invoicesList:any=[];
  overviewRows: InvoiceOverviewRow[] = INVOICE_OVERVIEW_ROWS;
  private toastr = inject(ToastrService);
  private commonService = inject(CommonService);
  private commontabservice = inject(Common_TabsService);
  // get invoicesList(): any[] {
  //   const numAmt = Number(this.invoice.amountDue.replace(/[^\d.]/g, '')) || Number(this.invoice.balance.replace(/[^\d.]/g, '')) || 3000;
  //   return [{
  //     rcp_no: this.invoice.invoiceNo,
  //     cheque_status: this.invoice.status,
  //     created_date: this.invoice.issueDate,
  //     cheque_date: this.invoice.dueDate,
  //     payment_type: this.invoice.paymentVia,
  //     amt: numAmt,
  //     receipts: this.chequeRows.map((c) => ({
  //       receiptNo: c.chequeNo ? c.chequeNo.replace('CH', 'RCP') : 'RCP-' + c.id,
  //       date: c.chequeDate,
  //       method: this.invoice.paymentVia || 'Cheque',
  //       reference: c.chequeNo || '-',
  //       amount: Number(c.amount.replace(/[^\d.]/g, '')) || 0,
  //       status: c.status || 'Cleared'
  //     }))
  //   }];
  // }

  get leaseInfo(): any {
    return {
      tenant: this.invoice.tenant,
      unitcode: this.invoice.lease,
      property: 'Dubai Marina, Tower A, Dubai',
      property_code: '31658',
      code: this.invoice.recordId,
      status_nm: 'Active'
    };
  }

  currentUser: any = {
    currencyCode: 'AED'
  };
  
  filteredCheques:any=[];

  filteredTxns:any=[];

  filteredPenalties:any=[];
  chequeRows: any=[];
  txnRows: any=[];
  penaltyRows:any=[];

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
    this.invoice_no=id; 
    this.getInvoiceDetails();
  }

  getInvoiceDetails() {
    this.commontabservice.getMasterByType({
      typeId: 52,
      filterId: 0,
      filterText: this.invoice_no,
      filterText1: ''
    }).subscribe({
      next: (res: any) => { 
        if (res.statusCode == 200 && res.objResult && res.objResult.invoice_dtls) { 
          this.invoicesList= res.objResult.invoice_dtls || [];
          this.invoice=this.invoicesList[0] || {};
          this.receiptslist= res.objResult.receipt_dtls || []; 
        }
        else
          this.toastr.error("No record[s] found");
      },
      error: (err) => {
        console.error(`Error fetching typeid: 22:`, err);
      }
    });
  }
  getArabicLookupName(row: any, key: string): string {
    const selectedLang = localStorage.getItem("selectedLang") || "EN";
    return row[(selectedLang === "EN" ? key : key + '_ar')] || row[key] || '';
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
