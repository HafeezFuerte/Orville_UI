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
  public todayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  public userName = 'Zaid Rahman';

  // Toggle states
  public overdueLeasesView: 'list' | 'graph' = 'list';
  public bouncedPaymentsView: 'list' | 'graph' = 'list';
  public ticketsView: 'list' | 'graph' = 'list';
  public overdueExpensesView: 'list' | 'graph' = 'list';
  public upcomingInvoicesView: 'list' | 'graph' = 'list';
  public endingLeasesView: 'list' | 'graph' = 'list';
  public upcomingInspectionView: 'list' | 'graph' = 'list';
  public visitorStatsView: 'list' | 'graph' = 'list';
  public remindersView: 'list' | 'graph' = 'list';
  public departmentTicketsView: 'list' | 'graph' = 'list';
  public upcomingLandlordContractsView: 'list' | 'graph' = 'list';
  public topPerformingListingsView: 'list' | 'graph' = 'list';
  public upcomingBirthdaysView: 'list' | 'graph' = 'list';

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

  // Overdue Leases (List)
  public overdueLeasesList = [
    { title: 'WMP Drainage M. services', property: 'Rashid Resedential - Apartment 304-PR-2', amount: 'AED 3,000.00', dueDate: '06-05-2026', overdueDays: 34 },
    { title: 'WMP Drainage M. services', property: 'Rashid Resedential - Apartment 304-PR-2', amount: 'AED 3,000.00', dueDate: '06-05-2026', overdueDays: 34 },
    { title: 'WMP Drainage M. services', property: 'Rashid Resedential - Apartment 304-PR-2', amount: 'AED 3,000.00', dueDate: '06-05-2026', overdueDays: 24 },
    { title: 'WMP Drainage M. services', property: 'Rashid Resedential - Apartment 304-PR-2', amount: 'AED 3,000.00', dueDate: '06-05-2026', overdueDays: 34 }
  ];

  // Upcoming Invoices
  public upcomingInvoices = [
    { title: 'Security Deposit Liability', property: 'Rashid Resedential - Apartment 304-PR-2', tenant: 'Olivia Green', amount: 'AED 3,000.00', dueDate: '11-06-2026' },
    { title: 'Rental Income', property: 'Rashid Resedential - Apartment 304-PR-2', tenant: 'Yahya Hashmi', amount: 'AED 3,000.00', dueDate: '11-06-2026' },
    { title: 'Rental Income', property: 'Rashid Resedential - Apartment 304-PR-2', tenant: 'Zainab Hassan', amount: 'AED 3,000.00', dueDate: '11-06-2026' }
  ];

  // Ending Leases in 30 Days
  public endingLeases30Days = [
    { title: 'WMP Drainage M. services', property: 'Olivia Green', daysLeft: 2, amount: 'AED 3,000.00', dueDate: '06-05-2026' },
    { title: 'WMP Drainage M. services', property: 'Yahya Hashmi', daysLeft: 13, amount: 'AED 3,000.00', dueDate: '06-05-2026' },
    { title: 'WMP Drainage M. services', property: 'Zainab Hassan', daysLeft: 26, amount: 'AED 3,000.00', dueDate: '06-05-2026' },
    { title: 'WMP Drainage M. services', property: 'Zara Malik', daysLeft: 22, amount: 'AED 3,000.00', dueDate: '06-05-2026' }
  ];

  // Upcoming Inspection
  public upcomingInspection = [
    { contract: 'LC-2026-03045', property: 'Rashid Resedential - Apartment 304-PR-2', inspector: 'Hassan Malik', status: 'Completed', date: '15-05-2026' },
    { contract: 'LC-2026-03054', property: 'Rashid Resedential - Apartment 304-PR-2', inspector: 'Sufiyan Khan', status: 'Completed', date: '15-05-2026' },
    { contract: 'LC-2026-03046', property: 'Rashid Resedential - Apartment 304-PR-2', inspector: 'Amina Hashmi', status: 'Pending', date: '15-05-2026' }
  ];

  // Visitor Stats
  public visitorStats = [
    { name: 'Bilal Ahmad', type: 'Personal', details: 'Host: Olivia Green - Rashid Resedential - Apartment 304-PR-2', date: '06-05-2026', visitors: 2 },
    { name: 'Aslam khan', type: 'Guest', details: 'Host: Yahya Hashmi - Rashid Resedential - Apartment 304-PR-2', date: '06-05-2026', visitors: 4 },
    { name: 'Jawad Ahmad', type: 'Service', details: 'Host: Yahya Hashmi - Rashid Resedential - Apartment 304-PR-2', date: '06-05-2026', visitors: 1 },
    { name: 'Subhan Tariq', type: 'Delivery', details: 'Host: Olivia Green - Rashid Resedential - Apartment 304-PR-2', date: '06-05-2026', visitors: 2 }
  ];

  // Reminders
  public reminders = [
    { title: 'Rent reminders', property: 'Olivia Green', status: 'Pending', date: '06-05-2026' },
    { title: 'Rent overdue followup', property: 'Yahya Hashmi', status: 'Complete', date: '06-05-2026' },
    { title: 'Security deposit collection', property: 'Zainab Hassan', status: 'Pending', date: '06-05-2026' }
  ];

  // Upcoming Landlord Contracts
  public upcomingLandlordContracts = [
    { contractNo: 'LC-2026-03045', property: 'Rashid Resedential - Apartment 304-PR-2', type: 'Move Out Request', assignedTo: 'Facility Group', daysLeft: 1, date: '12-05-2026' },
    { contractNo: 'LC-2026-03054', property: 'Rashid Resedential - Apartment 304-PR-2', type: 'Move Out Request', assignedTo: 'Accounting Group', daysLeft: 2, date: '15-05-2026' },
    { contractNo: 'LC-2026-03046', property: 'Rashid Resedential - Apartment 304-PR-2', type: 'Maintenance and Repairs', assignedTo: 'Facility Group', daysLeft: 2, date: '15-05-2026' }
  ];

  // Top Performing Listings
  public topPerformingListings = [
    { property: 'Rashid Resedential - Apartment 304-PR-2', details: 'Beds: 2 | Bath: 2 | 1250 Sqft', amount: 'AED 92,500.00', date: '06-05-2026' },
    { property: 'Rashid Resedential - Apartment 304-PR-3', details: 'Beds: 2 | Bath: 2 | 1250 Sqft', amount: 'AED 92,500.00', date: '06-05-2026' },
    { property: 'Rashid Resedential - Apartment 304-PR-2', details: 'Beds: 2 | Bath: 2 | 1250 Sqft', amount: 'AED 92,500.00', date: '06-05-2026' }
  ];

  // Upcoming Birthdays
  public upcomingBirthdays = [
    { name: 'Bilal Ahmad', type: 'TENANT', date: '12-05-2026', status: 'Today' },
    { name: 'Aslam khan', type: 'TENANT', date: '15-05-2026', status: 'Today' },
    { name: 'Jawad Ahmad', type: 'TENANT', date: '15-05-2026', status: 'Upcoming' }
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
