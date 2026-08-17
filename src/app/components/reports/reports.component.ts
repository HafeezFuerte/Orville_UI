import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type ReportCategory = 'financial' | 'rental' | 'misc';
export type ReportTab = 'all' | ReportCategory;

export interface ReportItem {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  badge: string;
}

export interface ReportSection {
  key: ReportCategory;
  title: string;
  items: ReportItem[];
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {
  public activeTab: ReportTab = 'all';
  public searchQuery = '';
  public filterOpen = false;
  public selectedReport: ReportItem | null = null;
  public startDate = '';
  public endDate = '';
  public reportFormat: 'HTML' | 'PDF' | 'XLS' | 'CSV' = 'HTML';
  public propertyType: string | null = null;
  public formats: Array<'HTML' | 'PDF' | 'XLS' | 'CSV'> = ['HTML', 'PDF', 'XLS', 'CSV'];
  public propertyTypes = ['Residential', 'Commercial', 'Mixed-use'];

  public tabs: { id: ReportTab; label: string }[] = [
    { id: 'all', label: 'All Reports' },
    { id: 'financial', label: 'Financial' },
    { id: 'rental', label: 'Rental' },
    { id: 'misc', label: 'Misc' }
  ];

  /** Figma 3386:152154 — visible cards only */
  public reports: ReportItem[] = [
    {
      id: 'agent-target',
      title: 'Agent Target vs Actual Closed Leads',
      description:
        'A report that evaluates agent performance based on closed leads generated, helping track sales effectiveness and growth trends.',
      category: 'financial',
      badge: 'Financial'
    },
    {
      id: 'agent-performance',
      title: 'Agent Performance',
      description:
        'A report that evaluates agent performance based on leads generated, helping track sales effectiveness and growth trends.',
      category: 'financial',
      badge: 'Financial'
    },
    {
      id: 'revenue-crm',
      title: 'Revenue Report - CRM',
      description:
        'A detailed report showing revenue generated over a selected period, helping track financial performance and growth trends.',
      category: 'financial',
      badge: 'Financial'
    },
    {
      id: 'monthly-closing',
      title: 'Monthly Closing Report - CRM',
      description:
        'A comprehensive report summarizing monthly deals closed, revenue generated, and performance insights to track sales effectiveness and pipeline health.',
      category: 'financial',
      badge: 'Financial'
    },
    {
      id: 'net-revenue',
      title: 'Net Revenue',
      description:
        'Summarizes the net revenue for each property by calculating income minus expenses. Helps evaluate profitability and financial performance over a selected period.',
      category: 'financial',
      badge: 'Financial'
    },
    {
      id: 'finance',
      title: 'Finance',
      description:
        'A comprehensive report detailing invoices and their associated cheques, with filters for landlord, property, unit, tenant, invoice and cheque s tatus, bounce date, and payment date',
      category: 'financial',
      badge: 'Financial'
    },
    {
      id: 'property-units',
      title: 'Property Units Overview',
      description:
        'This report shows all the data of units according to specific property in a selected time period.',
      category: 'financial',
      badge: 'Financial'
    },
    {
      id: 'vat',
      title: 'VAT',
      description:
        'This reports shows all the invoices that included VAT based on a single property or all properties in a selected time period.',
      category: 'financial',
      badge: 'Financial'
    },
    {
      id: 'landlord-contracts',
      title: 'All Landlord Contracts',
      description: 'This report shows all landlord contracts in the company',
      category: 'rental',
      badge: 'Rental'
    },
    {
      id: 'all-leases',
      title: 'All Leases',
      description: 'This report shows all leases in the company',
      category: 'rental',
      badge: 'Rental'
    },
    {
      id: 'all-tenants',
      title: 'All Tenants',
      description: 'This report shows all tenants in the company',
      category: 'rental',
      badge: 'Rental'
    },
    {
      id: 'all-landlords',
      title: 'All Landlords',
      description: 'This report shows all landlords in the company',
      category: 'rental',
      badge: 'Rental'
    },
    {
      id: 'all-units',
      title: 'All Units',
      description: 'This report shows all units in the company. Can be filtered by internal status.',
      category: 'rental',
      badge: 'Rental'
    },
    {
      id: 'landlord-balances',
      title: 'Landlord Balances',
      description:
        "This report provides a detailed summary of the landlord's cash balances over a specified date range",
      category: 'rental',
      badge: 'Rental'
    },
    {
      id: 'landlord-consolidated',
      title: 'Landlord Consolidated Statement',
      description:
        'Enhanced Landlord Statement featuring chronological entries and payment processing with detailed Debit, Credit, and Balance columns for comprehensive financial tracking.',
      category: 'rental',
      badge: 'Rental'
    },
    {
      id: 'landlord-statement',
      title: 'Landlord Statement',
      description:
        'This report shows all Income received for a single property or all the properties in a selected time period.',
      category: 'rental',
      badge: 'Rental'
    },
    {
      id: 'landlord-dashboard',
      title: 'Landlord Dashboard',
      description:
        'A Landlord Dashboard Report provides an overview of landlord dashboard, leases, and units. It includes key insights such as work orders and occupancy rates etc.',
      category: 'misc',
      badge: 'Rental'
    },
    {
      id: 'assets',
      title: 'Assets',
      description: 'This report shows all the data of assets according to specific property.',
      category: 'misc',
      badge: 'Rental'
    }
  ];

  public get filteredReports(): ReportItem[] {
    const query = this.searchQuery.trim().toLowerCase();
    return this.reports.filter((report) => {
      const tabMatch = this.activeTab === 'all' || report.category === this.activeTab;
      const searchMatch =
        !query ||
        report.title.toLowerCase().includes(query) ||
        report.description.toLowerCase().includes(query);
      return tabMatch && searchMatch;
    });
  }

  public get sections(): ReportSection[] {
    const groups: { key: ReportCategory; title: string }[] = [
      { key: 'financial', title: 'Financial Reports' },
      { key: 'rental', title: 'Rental Reports' },
      { key: 'misc', title: 'Misc Reports' }
    ];
    return groups
      .map((group) => ({
        ...group,
        items: this.filteredReports.filter((report) => report.category === group.key)
      }))
      .filter((group) => group.items.length > 0);
  }

  public setTab(tab: ReportTab): void {
    this.activeTab = tab;
  }

  public categoryClass(category: ReportCategory): string {
    return `orville-reports__dot--${category}`;
  }

  public openGenerate(report: ReportItem): void {
    this.selectedReport = report;
    this.clearGenerate();
    this.filterOpen = true;
  }

  public closeGenerate(): void {
    this.filterOpen = false;
    this.selectedReport = null;
  }

  public clearGenerate(): void {
    this.startDate = '';
    this.endDate = '';
    this.reportFormat = 'HTML';
    this.propertyType = null;
  }

  public get generateTitle(): string {
    return this.selectedReport ? `${this.selectedReport.title} Report` : '';
  }

  @HostListener('document:keydown.escape')
  public onEscape(): void {
    if (this.filterOpen) {
      this.closeGenerate();
    }
  }
}
