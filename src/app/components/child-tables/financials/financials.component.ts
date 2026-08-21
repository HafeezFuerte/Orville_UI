import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-financials-table',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterModule],
  templateUrl: './financials.component.html',
  styleUrls: ['./financials.component.scss']
})
export class FinancialsComponent implements OnInit {
  @Input() invoices: any[] = [];
  @Input() leaseInfo: any = {};
  @Input() currentUser: any = null;

  expandedInvoiceId: any = null;

  // The columns matching the financials tab of the leases
  financialsColumns = [
    { key: 'receiptNo', label: 'Receipt No' },
    { key: 'date', label: 'Date' },
    { key: 'method', label: 'Method' },
    { key: 'reference', label: 'Reference' },
    { key: 'amount', label: 'Amount' },
    { key: 'status', label: 'Status' }
  ];

  ngOnInit(): void {
    if (this.invoices && this.invoices.length > 0) {
      // Expand the first invoice by default
      this.expandedInvoiceId = this.invoices[0].invoicecode || this.invoices[0].id || 0;
    }
  }

  toggleExpand(invoiceId: any): void {
    if (this.expandedInvoiceId === invoiceId) {
      this.expandedInvoiceId = null;
    } else {
      this.expandedInvoiceId = invoiceId;
    }
  }

  getArabicLookupName(row: any, key: string): string {
    const selectedLang = localStorage.getItem("selectedLang") || "EN";
    return row[(selectedLang === "EN" ? key : key + '_ar')] || row[key] || '';
  }

  // Helper method to parse status classes
  getStatusBadgeClass(status: string): string {
    if (!status) return 'bg-gray-100 text-gray-800 border-gray-200';
    const s = status.toLowerCase();
    if (s.includes('paid') && !s.includes('unpaid') && !s.includes('partially')) {
      return 'bg-success/10 text-success border-success/20';
    } else if (s.includes('unpaid') || s.includes('overdue')) {
      return 'bg-danger/10 text-danger border-danger/20';
    } else {
      return 'bg-warning/10 text-warning border-warning/20';
    }
  }

  // Receipts / breakdown list for each invoice (mocked/mapped from the invoice structure if no separate nested list is provided)
  getReceiptsForInvoice(invoice: any): any[] {
    // If the invoice has nested receipts, return them. Otherwise map the invoice fields as the single receipt transaction.
    if (invoice.receipts && invoice.receipts.length > 0) {
      return invoice.receipts;
    }

    const invNo = invoice.rcp_no || invoice.InvoiceNo || invoice.invoice_no || invoice.invno || invoice.invoiceNo || '';

    // Fallback: Map the invoice fields to a single receipt row to match the columns
    return [{
      receiptNo: invNo ? invNo.replace('INV', 'RCP') : 'RCP-001',
      date: invoice.created_date || invoice.due_date || '-',
      method: invoice.payment_type || 'Mixed',
      reference: invoice.cheque_no || invoice.ddRefNo || '-',
      amount: invoice.amt || 0,
      status: invoice.cheque_status || invoice.status || 'Cleared'
    }];
  }
}
