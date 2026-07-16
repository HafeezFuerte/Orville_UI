import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-my-insights',
  standalone: true,
  imports: [CommonModule, RouterModule, NgApexchartsModule, SharedModule],
  templateUrl: './my-insights.component.html',
  styleUrls: ['./my-insights.component.scss']
})
export class MyInsightsComponent implements OnInit {
  public todayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  public userName = 'Zaid Rahman';

  // Highlight Cards Data
  public highlightMetrics = {
    properties: { count: 17 },
    units: { count: '2,982' },
    rooms: { count: '2,982' },
    occupancy: { percentage: 77.9, units: 2324 },
    vacant: { percentage: 21, units: 627 }
  };

  // Sparkline Chart Options
  public sparklineBarOptions: any = {};
  public sparklineLineOptions: any = {};
  public sparklineRoomsOptions: any = {};

  // Donut Chart Options
  public occupancyRadialOptions: any = {};
  public vacantRadialOptions: any = {};

  public propertiesDonutOptions: any = {};
  public unitsDonutOptions: any = {};
  public roomsDonutOptions: any = {};

  public contactStatusDonutOptions: any = {};
  public expensePieOptions: any = {};

  public workOrderRequestsOptions: any = {};
  public workOrderStatusOptions: any = {};
  public workOrderDistOptions: any = {};
  public statusWiseTicketsOptions: any = {};
  public unitStatsOccupancyOptions: any = {};
  public ticketSourcesOptions: any = {};
  public unitTypesDonutOptions: any = {};
  public annualRentOptions: any = {};
  public leaseStatusDonutOptions: any = {};
  public tenantByCountryOptions: any = {};

  // Main Bar/Line Chart Options
  public topLandlordsOptions: any = {};
  public leaseCurrentOptions: any = {};
  public leaseActiveOptions: any = {};
  public leaseCompletedOptions: any = {};
  public leaseRenewedOptions: any = {};
  public leaseDraftOptions: any = {};
  public incomeOverviewOptions: any = {};
  public woTotalOrderOptions: any = {};
  public woNewOrderOptions: any = {};
  public woTotalResolvedOptions: any = {};
  public woResolveRateOptions: any = {};
  public unitHealthOptions: any = {};
  public woPriorityOptions: any = {};
  public newTicketsOptions: any = {};
  public unitsPublishedOptions: any = {};

  ngOnInit(): void {
    this.initCharts();
  }

  private initCharts() {
    const defaultFont = 'Inter, sans-serif';

    // 1. Sparklines for Top Cards
    this.sparklineBarOptions = {
      series: [{ name: 'Properties', data: [12, 14, 18, 10, 15, 12, 8, 10, 12, 14, 16, 18] }],
      chart: { type: 'bar', width: 120, height: 60, sparkline: { enabled: true } },
      plotOptions: { bar: { columnWidth: '60%', borderRadius: 2 } },
      colors: ['#c39242']
    };

    this.sparklineLineOptions = {
      series: [{ name: 'Units', data: [10, 20, 15, 30, 25, 40, 35, 50] }],
      chart: { type: 'line', width: 120, height: 60, sparkline: { enabled: true } },
      stroke: { curve: 'smooth', width: 2 },
      colors: ['#c39242']
    };

    this.sparklineRoomsOptions = {
      series: [{ name: 'Rooms', data: [10, 25, 15, 30, 25, 50, 35, 45] }],
      chart: { type: 'line', width: 120, height: 60, sparkline: { enabled: true } },
      stroke: { curve: 'smooth', width: 2 },
      colors: ['#3b82f6']
    };

    // 2. Radial Charts for Occupancy & Vacant
    this.occupancyRadialOptions = {
      series: [77.9],
      chart: { type: 'radialBar', width: 120, height: 120 },
      plotOptions: {
        radialBar: {
          hollow: { size: '60%' },
          dataLabels: {
            name: { show: false },
            value: { show: true, fontSize: '14px', fontWeight: 'bold', color: '#111827', offsetY: 5 }
          }
        }
      },
      colors: ['#4f46e5'],
      stroke: { lineCap: 'round' }
    };

    this.vacantRadialOptions = {
      series: [21],
      chart: { type: 'radialBar', width: 120, height: 120 },
      plotOptions: {
        radialBar: {
          hollow: { size: '60%' },
          dataLabels: {
            name: { show: false },
            value: { show: true, fontSize: '14px', fontWeight: 'bold', color: '#111827', offsetY: 5 }
          }
        }
      },
      colors: ['#06b6d4'],
      stroke: { lineCap: 'round' }
    };

    // 3. Properties, Units, Rooms Donuts
    this.propertiesDonutOptions = this.createDonut([17, 0, 2], ['#4f46e5', '#94a3b8', '#06b6d4'], ['Residential', 'Commercial', 'Mixed-use']);
    this.unitsDonutOptions = this.createDonut([985, 756, 758, 456], ['#4f46e5', '#06b6d4', '#3b82f6', '#14b8a6'], ['1 BHK', '2 BHK', '3 BHK', 'Studio']);
    this.roomsDonutOptions = this.createDonut([985, 756, 758, 456], ['#4f46e5', '#06b6d4', '#3b82f6', '#14b8a6'], ['1 BHK', '2 BHK', '3 BHK', 'Studio']);

    // 4. Contact Status Analytics
    this.contactStatusDonutOptions = this.createDonut([5164, 3], ['#14b8a6', '#f97316'], ['Active', 'Inactive']);

    // 5. Top Landlords Bar
    this.topLandlordsOptions = {
      series: [{ name: 'Units', data: [2982, 0, 0, 0] }],
      chart: { type: 'bar', height: 250, toolbar: { show: false } },
      plotOptions: { bar: { borderRadius: 4, columnWidth: '40%' } },
      dataLabels: { enabled: false },
      xaxis: { categories: ['Orville Real Estate', '', '', ''], labels: { style: { cssClass: 'text-xs font-semibold text-gray-500' } } },
      colors: ['#4f46e5']
    };

    // 6. Lease Highlights
    this.leaseCurrentOptions = this.createBarSparkline([20, 25, 30, 20, 15, 25, 30, 35, 40, 20, 25, 30], '#14b8a6');
    this.leaseActiveOptions = this.createLineSparkline([10, 20, 15, 30, 25, 40, 35, 50], '#c39242');
    this.leaseCompletedOptions = this.createBarSparkline([20, 30, 40, 20, 15, 30, 20, 35, 20, 25, 30, 15], '#4f46e5');
    this.leaseRenewedOptions = this.createBarSparkline([30, 40, 20, 15, 30, 20, 35, 20, 25, 30, 15, 20], '#3b82f6');
    this.leaseDraftOptions = this.createLineSparkline([20, 15, 30, 25, 40, 35, 50, 45], '#3b82f6');

    // 7. Income & Expense
    this.incomeOverviewOptions = {
      series: [{ name: 'Amount', data: [47987089, 753047] }],
      chart: { type: 'bar', height: 250, toolbar: { show: false } },
      plotOptions: { bar: { borderRadius: 4, columnWidth: '30%', distributed: true } },
      dataLabels: { enabled: false },
      xaxis: { categories: ['Paid', 'Outstanding'], labels: { style: { cssClass: 'text-xs font-semibold text-gray-500' } } },
      colors: ['#3b82f6', '#ef4444'],
      legend: { show: false }
    };

    this.expensePieOptions = {
      series: [40, 20, 15, 10, 10, 5],
      chart: { type: 'polarArea', height: 300 },
      labels: ['Advertising', 'Depreciation', 'Insurance', 'Maintenance', 'Utilities', 'Management'],
      stroke: { colors: ['#fff'] },
      fill: { opacity: 0.8 },
      dataLabels: { enabled: false },
      colors: ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#eff6ff'],
      legend: { show: true, position: 'right' }
    };

    // 8. Work Order Insights
    this.woTotalOrderOptions = this.createBarSparkline([5, 10, 8, 15, 12, 20, 18, 25, 22, 30, 28, 35], '#14b8a6');
    this.woNewOrderOptions = this.createLineSparkline([10, 15, 10, 20, 15, 25, 20, 30], '#3b82f6');
    this.woTotalResolvedOptions = this.createBarSparkline([5, 8, 12, 10, 15, 18, 20, 22, 25, 28, 30, 35], '#e5e7eb');

    // 9. Work Order Donut Charts
    this.workOrderRequestsOptions = this.createDonut([800, 300, 157], ['#4f46e5', '#14b8a6', '#f59e0b'], ['Open', 'Closed', 'Other'],);
    this.workOrderStatusOptions = this.createDonut([500, 365], ['#3b82f6', '#f59e0b'], ['New', 'Resolved'],);
    this.workOrderDistOptions = this.createDonut([300, 200, 150, 100, 65, 50], ['#f59e0b', '#3b82f6', '#14b8a6', '#6366f1', '#ec4899', '#8b5cf6'], ['Electrical', 'Doors', 'Plumbing', 'AC', 'Cleaning', 'Joinery'],);

    // 10. Resolve Rate & Unit Health
    this.woResolveRateOptions = {
      series: [{ name: 'Work Orders', data: [30, 20, 40, 25, 35, 15, 10] }],
      chart: { type: 'bar', height: 200, toolbar: { show: false } },
      plotOptions: { bar: { borderRadius: 4, columnWidth: '30%' } },
      dataLabels: { enabled: false },
      xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], labels: { show: false } },
      colors: ['#3b82f6']
    };

    this.unitHealthOptions = {
      series: [{ name: 'Work Orders', data: [50, 45, 40, 35, 30] }],
      chart: { type: 'bar', height: 200, toolbar: { show: false } },
      plotOptions: { bar: { borderRadius: 4, columnWidth: '50%' } },
      dataLabels: { enabled: false },
      xaxis: { categories: ['305-PR-7', '306-PR-9', '414-PR-8', '507-PR-2', '604-PR-16'], labels: { style: { cssClass: 'text-[10px] text-gray-500 font-bold' } } },
      colors: ['#1e1b4b']
    };

    // 11. Work Orders Priority & Tickets
    this.woPriorityOptions = {
      series: [
        { name: 'Low', data: [30, 40, 35, 50, 49, 60, 70, 91, 125, 90, 80, 70] },
        { name: 'Medium', data: [20, 30, 25, 40, 39, 50, 60, 81, 115, 80, 70, 60] },
        { name: 'High', data: [10, 20, 15, 30, 29, 40, 50, 71, 105, 70, 60, 50] }
      ],
      chart: { type: 'bar', height: 350, stacked: true, toolbar: { show: false } },
      plotOptions: { bar: { columnWidth: '40%' } },
      xaxis: { categories: ['Jan 25', 'Feb 25', 'Mar 25', 'Apr 25', 'May 25', 'Jun 25', 'Jul 25', 'Aug 25', 'Sep 25', 'Oct 25', 'Nov 25', 'Dec 25'] },
      colors: ['#93c5fd', '#3b82f6', '#1e40af'],
      dataLabels: { enabled: false },
      legend: { show: false }
    };

    this.statusWiseTicketsOptions = this.createDonut([3687, 0], ['#4f46e5', '#e5e7eb'], ['Open', 'Closed'],);

    this.newTicketsOptions = {
      series: [{ name: 'Tickets', data: [20, 30, 25, 40, 35, 50, 45, 60, 55, 70] }],
      chart: { type: 'bar', height: 250, toolbar: { show: false } },
      plotOptions: { bar: { borderRadius: 4, columnWidth: '40%' } },
      dataLabels: { enabled: false },
      xaxis: { labels: { show: false } },
      colors: ['#3b82f6']
    };

    this.ticketSourcesOptions = {
      series: [60, 30, 10],
      chart: { type: 'radialBar', height: 250 },
      plotOptions: {
        radialBar: {
          dataLabels: { name: { show: false }, value: { show: false } },
          hollow: { size: '30%' },
          track: { background: 'transparent' }
        }
      },
      colors: ['#1e40af', '#3b82f6', '#93c5fd']
    };

    this.unitsPublishedOptions = {
      series: [{ name: 'Units', data: [15, 20, 10, 35, 25, 40, 30, 45, 20, 15] }],
      chart: { type: 'bar', height: 250, toolbar: { show: false } },
      plotOptions: { bar: { borderRadius: 4, columnWidth: '40%' } },
      dataLabels: { enabled: false },
      xaxis: { labels: { show: false } },
      colors: ['#8b5cf6']
    };

    // 12. Unit Stats Occupancy & Unit Types
    this.unitStatsOccupancyOptions = this.createDonut([82, 18], ['#4f46e5', '#e5e7eb'], ['Occupied', 'Vacant']);

    this.unitTypesDonutOptions = this.createDonut([40, 25, 15, 15, 5], ['#8b5cf6', '#06b6d4', '#f59e0b', '#3b82f6', '#ec4899'], ['1 BHK', '2 BHK', '3 BHK', 'Apartment', 'Full Floor']);

    // 13. Annual Rent Recognized Revenue
    this.annualRentOptions = {
      series: [{ name: 'Recognized rent revenue', data: [1, 2, 4, 2, 6, 22, 28, 5, 2] }],
      chart: { type: 'bar', height: 350, toolbar: { show: false } },
      plotOptions: { bar: { borderRadius: 4, columnWidth: '10%' } },
      dataLabels: { enabled: false },
      xaxis: { categories: ['2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028'], labels: { style: { cssClass: 'text-xs text-gray-500 font-semibold' } } },
      colors: ['#6366f1']
    };

    // 14. Lease Status by Month
    this.leaseStatusDonutOptions = this.createDonut([40, 20, 15, 25], ['#3b82f6', '#94a3b8', '#14b8a6', '#4f46e5'], ['Renewing Leases', 'Not Renewing Leases', 'Contacted Leases', 'No Response Leases'],);

    // 15. Tenant By Country
    this.tenantByCountryOptions = {
      series: [{ name: 'Tenants', data: [5102, 4151, 1000, 948, 500] }],
      chart: { type: 'bar', height: 250, toolbar: { show: false } },
      plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: '30%' } },
      dataLabels: { enabled: false },
      xaxis: { categories: ['Indonesia', 'Bangladesh', 'Philippines', 'United Arab Emirates', 'India'], labels: { show: false } },
      colors: ['#3b82f6']
    };
  }

  private createDonut(series: number[], colors: string[], labels: string[],) {
    return {
      series: series,
      chart: { type: 'donut', height: 220 },
      labels: labels,
      colors: colors,
      plotOptions: {
        pie: {
          donut: {
            size: '75%',
            labels: {
              show: true,
              name: { show: true, fontSize: '12px', color: '#6b7280', offsetY: 20 },
              value: { show: true, fontSize: '24px', fontWeight: 'bold', color: '#111827', offsetY: -10 },

            }
          }
        }
      },
      dataLabels: { enabled: false },
      stroke: { show: true, width: 3, colors: ['#ffffff'] },
      legend: { show: false }
    };
  }

  private createBarSparkline(data: number[], color: string) {
    return {
      series: [{ name: 'Data', data: data }],
      chart: { type: 'bar', height: 100, sparkline: { enabled: true } },
      plotOptions: { bar: { columnWidth: '50%', borderRadius: 2 } },
      colors: [color],
      tooltip: { fixed: { enabled: false }, x: { show: false }, y: { title: { formatter: function (seriesName: string) { return '' } } }, marker: { show: false } }
    };
  }

  private createLineSparkline(data: number[], color: string) {
    return {
      series: [{ name: 'Data', data: data }],
      chart: { type: 'line', height: 100, sparkline: { enabled: true } },
      stroke: { curve: 'smooth', width: 2 },
      colors: [color],
      tooltip: { fixed: { enabled: false }, x: { show: false }, y: { title: { formatter: function (seriesName: string) { return '' } } }, marker: { show: false } }
    };
  }
}