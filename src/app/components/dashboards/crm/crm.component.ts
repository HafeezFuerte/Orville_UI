import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from '../../../shared/shared.module';
import { NgChartsModule } from 'ng2-charts';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-crm',
  standalone: true,
  imports: [CommonModule, RouterModule, NgApexchartsModule, SharedModule, NgChartsModule],
  templateUrl: './crm.component.html',
  styleUrl: './crm.component.scss'
})
export class CrmComponent implements OnInit {
  public todayDate = 'Tuesday, June 9, 2026';
  public userName = 'Zaid Rahman';

  // Toggle states
  public overdueLeasesView: 'list' | 'graph' = 'list';
  public bouncedPaymentsView: 'list' | 'graph' = 'list';
  public ticketsView: 'list' | 'graph' = 'list';
  public overdueExpensesView: 'list' | 'graph' = 'list';

  // Metrics
  public metrics = {
    overdueLeases: { count: 10, total: 50 },
    expiringDocs: { count: 25, percentage: '90%' },
    overdueInvoices: { amount: 'AED 15,999', count: 4 },
    openTickets: { count: 3, status: 'Active' }
  };

  // Overdue Invoices / Leases Data
  public overdueInvoices = [
    {
      title: 'Security Deposit Liability',
      overdueDays: 34,
      tenant: 'Olivia Green',
      property: 'Rashid Resedential - Apartment 304-PR-2',
      amount: 'AED 3,000.00',
      dueDate: '11-06-2026'
    },
    {
      title: 'Rental Income',
      overdueDays: 30,
      tenant: 'Yahya Hashmi',
      property: 'Rashid Resedential - Apartment 304-PR-2',
      amount: 'AED 3,000.00',
      dueDate: '11-06-2026'
    },
    {
      title: 'Rental Income',
      overdueDays: 36,
      tenant: 'Zainab Hassan',
      property: 'Rashid Resedential - Apartment 304-PR-2',
      amount: 'AED 3,000.00',
      dueDate: '11-06-2026'
    },
    {
      title: 'Security Deposit Liability',
      overdueDays: 40,
      tenant: 'Zara Malik',
      property: 'Rashid Resedential - Apartment 304-PR-2',
      amount: 'AED 3,000.00',
      dueDate: '11-06-2026'
    }
  ];

  // Bounced Payments Data
  public bouncedPayments = [
    {
      tenant: 'Bilal Ahmad',
      chequeNo: '#123456',
      property: 'Rashid Resedential - Apartment 304-PR-2',
      amount: 'AED 3,000.00',
      dueDate: '06-05-2026'
    },
    {
      tenant: 'Aslam khan',
      chequeNo: '#123456',
      property: 'Rashid Resedential - Apartment 304-PR-2',
      amount: 'AED 3,000.00',
      dueDate: '06-05-2026'
    },
    {
      tenant: 'Jawad Ahmad',
      chequeNo: '#123456',
      property: 'Rashid Resedential - Apartment 304-PR-2',
      amount: 'AED 3,000.00',
      dueDate: '06-05-2026'
    },
    {
      tenant: 'Subhan Tariq',
      chequeNo: '#123456',
      property: 'Rashid Resedential - Apartment 304-PR-2',
      amount: 'AED 3,000.00',
      dueDate: '06-05-2026'
    },
    {
      tenant: 'Ashraf said',
      chequeNo: '#123456',
      property: 'Rashid Resedential - Apartment 304-PR-2',
      amount: 'AED 3,000.00',
      dueDate: '06-05-2026'
    }
  ];

  // Expired Landlord Contracts
  public expiredLandlordContracts = [
    {
      contractNo: 'LC-2026-00045',
      expiredDays: 28,
      property: 'Rashid Resedential - Apartment 304-PR-2',
      type: 'Move Out Request',
      assignedTo: 'Facility Group'
    },
    {
      contractNo: 'LC-2026-00054',
      expiredDays: 28,
      property: 'Rashid Resedential - Apartment 304-PR-2',
      type: 'Move Out Request',
      assignedTo: 'Accounting Group'
    },
    {
      contractNo: 'LC-2026-00046',
      expiredDays: 28,
      property: 'Rashid Resedential - Apartment 304-PR-2',
      type: 'Maintenance and Repairs',
      assignedTo: 'Facility Group'
    }
  ];

  // Tenant Expired Documents
  public expiredDocumentsCount = 58;
  public tenantExpiredDocs = [
    { name: 'Aisha Khan', docType: 'Emirates ID', role: 'Tenant' },
    { name: 'Omar Farooq', docType: 'Visa', role: 'Tenant' },
    { name: 'Salma Ahmed', docType: 'Passport', role: 'Tenant' },
    { name: 'Sana Qureshi', docType: 'Visa', role: 'Tenant' }
  ];

  // Tickets
  public tickets = [
    { title: 'Vacant notice', property: 'Rashid Resedential - Apartment 304-PR-2', type: 'Move Out Request', assignedTo: 'Facility Group', timeAgo: '15 minutes ago' },
    { title: 'Move out', property: 'Rashid Resedential - Apartment 304-PR-2', type: 'Move Out Request', assignedTo: 'Accounting Group', timeAgo: '30 minutes ago' },
    { title: 'Air conditioning not cooling', property: 'Rashid Resedential - Apartment 304-PR-2', type: 'Maintenance and Repairs', assignedTo: 'Facility Group', timeAgo: '1.30 hours ago' }
  ];

  // Work Orders
  public workOrders = [
    { title: 'Electricity fluctuations - Electrical', property: 'Rashid Resedential - Apartment 304-PR-2' },
    { title: 'Electricity fluctuations - Electrical', property: 'Rashid Resedential - Apartment 304-PR-2' },
    { title: 'Electricity fluctuations - Electrical', property: 'Rashid Resedential - Apartment 304-PR-2' },
    { title: 'Electricity fluctuations - Electrical', property: 'Rashid Resedential - Apartment 304-PR-2' }
  ];

  // Donut chart configuration for Tenant Expired Documents
  public expiredDocsChartOptions: any = {
    series: [25, 20, 13],
    labels: ['Emirates ID', 'Passport', 'Visa'],
    colors: ['#06b6d4', '#6366f1', '#3b82f6'],
    chart: {
      type: 'donut',
      height: 220
    },
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Expired',
              formatter: () => '58'
            }
          }
        }
      }
    },
    legend: {
      show: false
    },
    dataLabels: {
      enabled: false
    }
  };

  constructor(public translate: TranslateService) {}

  ngOnInit(): void {}
}
