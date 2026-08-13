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
  public expenseLegend: { label: string; color: string }[] = [];

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
  public landlordPlaceholders = [1, 2, 3];
  public leaseActiveOptions: any = {};
  public leaseDraftOptions: any = {};
  public leaseYtdBars = [35, 68, 88, 31, 61, 30, 0, 0, 0, 0, 0, 0];
  public incomeOverviewOptions: any = {};
  public woTotalOrderOptions: any = {};
  public woNewOrderOptions: any = {};
  public woTotalResolvedOptions: any = {};
  public woResolveRateOptions: any = {};
  public unitHealthOptions: any = {};
  public woPriorityOptions: any = {};
  public deptTicketOptions: any = {};
  public deptGroups: { label: string; color: string; meta: string; width: string }[] = [];
  public statusLegend: { label: string; color: string }[] = [];
  public newTicketsOptions: any = {};
  public unitsPublishedOptions: any = {};
  public countryRows: { name: string; count: number; width: string }[] = [
    { name: 'Indonesia', count: 703, width: '46%' },
    { name: 'Bangladesh', count: 350, width: '27%' },
    { name: 'Philippines', count: 1322, width: '67%' },
    { name: 'United Arab Emirates', count: 600, width: '35%' },
    { name: 'India', count: 1600, width: '92%' },
    { name: 'Cameroon', count: 830, width: '41%' }
  ];

  ngOnInit(): void {
    this.initCharts();
  }

  private initCharts() {
    const defaultFont = "'Hanken Grotesk', sans-serif";
    const c = {
      primary: '#26264F',
      accent: '#BD9759',
      accentLight: '#F7F1E7',
      info: '#3E6FA8',
      success: '#27865B',
      warning: '#D08A28',
      error: '#C94A4A',
      muted: '#6B6B7D',
      text: '#252536',
      track: '#E4E4EC',
      slate: '#94a3b8'
    };

    // 1. Sparklines for Top Cards
    this.sparklineBarOptions = {
      series: [{ name: 'Properties', data: [12, 14, 18, 10, 15, 12, 8, 10, 12, 14, 16, 18] }],
      chart: { type: 'bar', height: 128, sparkline: { enabled: true }, fontFamily: defaultFont },
      plotOptions: { bar: { columnWidth: '55%', borderRadius: 8, colors: { backgroundBarColors: [c.accentLight], backgroundBarRadius: 8 } } },
      colors: [c.accent]
    };

    this.sparklineLineOptions = {
      series: [{ name: 'Units', data: [10, 20, 15, 30, 25, 40, 35, 50] }],
      chart: { type: 'line', height: 128, sparkline: { enabled: true }, fontFamily: defaultFont },
      stroke: { curve: 'smooth', width: 2 },
      colors: [c.accent]
    };

    this.sparklineRoomsOptions = {
      series: [{ name: 'Rooms', data: [10, 25, 15, 30, 25, 50, 35, 45] }],
      chart: { type: 'line', height: 128, sparkline: { enabled: true }, fontFamily: defaultFont },
      stroke: { curve: 'smooth', width: 2 },
      colors: [c.info]
    };

    // 2. Radial Charts for Occupancy & Vacant
    this.occupancyRadialOptions = {
      series: [77.9],
      chart: { type: 'radialBar', height: 130, width: 130, fontFamily: defaultFont },
      plotOptions: {
        radialBar: {
          hollow: { size: '68%' },
          track: { background: c.track, strokeWidth: '100%' },
          dataLabels: {
            name: { show: false },
            value: { show: true, fontSize: '18px', fontWeight: 800, fontFamily: defaultFont, color: c.text, offsetY: 6 }
          }
        }
      },
      colors: [c.primary],
      stroke: { lineCap: 'round' }
    };

    this.vacantRadialOptions = {
      series: [21],
      chart: { type: 'radialBar', height: 130, width: 130, fontFamily: defaultFont },
      plotOptions: {
        radialBar: {
          hollow: { size: '68%' },
          track: { background: c.track, strokeWidth: '100%' },
          dataLabels: {
            name: { show: false },
            value: { show: true, fontSize: '18px', fontWeight: 800, fontFamily: defaultFont, color: c.text, offsetY: 6 }
          }
        }
      },
      colors: ['#06b6d4'],
      stroke: { lineCap: 'round' }
    };

    // 3. Properties, Units, Rooms Donuts
    this.propertiesDonutOptions = this.createDonut([17, 0, 2], [c.primary, c.slate, c.info], ['Residential', 'Commercial', 'Mixed-use'], { label: 'All properties', value: '19' });
    this.unitsDonutOptions = this.createDonut([985, 756, 758, 456], [c.primary, c.info, c.accent, c.success], ['1 BHK', '2 BHK', '3 BHK', 'Studio'], { label: 'All units', value: '2955' });
    this.roomsDonutOptions = this.createDonut([985, 756, 758, 456], [c.primary, c.info, c.accent, c.success], ['1 BHK', '2 BHK', '3 BHK', 'Studio'], { label: 'All rooms', value: '2955' });

    // 4. Contact Status Analytics
    this.contactStatusDonutOptions = this.createDonut([5164, 3], [c.success, c.warning], ['Active', 'Inactive'], 'none');
    this.contactStatusDonutOptions.chart = {
      ...this.contactStatusDonutOptions.chart,
      height: 254,
      width: 254,
      toolbar: { show: false }
    };

    // 6. Lease Highlights
    this.leaseActiveOptions = this.createLeaseLineSparkline([28, 42, 30, 55, 45, 70, 52, 64, 48, 60, 42, 58], c.accent);
    this.leaseDraftOptions = this.createLeaseLineSparkline([32, 24, 48, 36, 62, 50, 68, 55, 44, 58, 40, 52], '#4896fe');

    // 7. Income & Expense
    this.incomeOverviewOptions = {
      series: [{ name: 'Amount', data: [47987089, 753047] }],
      chart: { type: 'bar', height: 290, toolbar: { show: false }, fontFamily: defaultFont },
      plotOptions: { bar: { borderRadius: 20, columnWidth: '42%', distributed: true, borderRadiusApplication: 'around' } },
      dataLabels: { enabled: false },
      colors: ['#375dfb', c.error],
      legend: { show: false },
      grid: {
        strokeDashArray: 4,
        borderColor: '#E4E4EC',
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } }
      },
      xaxis: {
        categories: ['Paid', 'Outstanding'],
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { style: { fontFamily: defaultFont, colors: c.muted, fontSize: '14px', fontWeight: 600 } }
      },
      yaxis: {
        min: 0,
        max: 50000000,
        tickAmount: 5,
        labels: {
          formatter: (val: number) => (val === 0 ? '0' : Math.round(val / 1000000) + ' M'),
          style: { fontFamily: defaultFont, colors: c.muted, fontSize: '14px', fontWeight: 600 }
        }
      }
    };

    const expenseColors = ['#1E40AF', '#1D4ED8', '#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'];
    this.expenseLegend = [
      { label: 'Advertising Expense', color: expenseColors[0] },
      { label: 'Depreciation Expense', color: expenseColors[1] },
      { label: 'Insurance Expense', color: expenseColors[2] },
      { label: 'Maintenance and Repairs Expense', color: expenseColors[3] },
      { label: 'Utilities Expense', color: expenseColors[4] },
      { label: 'Management Fees Expense', color: expenseColors[5] },
      { label: 'DEWA', color: expenseColors[6] }
    ];
    this.expensePieOptions = {
      series: [40, 28, 18, 22, 14, 12, 8],
      chart: { type: 'polarArea', height: 284, width: 284, toolbar: { show: false }, fontFamily: defaultFont },
      labels: this.expenseLegend.map((item) => item.label),
      stroke: { width: 1, colors: ['#ffffff'] },
      fill: { opacity: 1 },
      dataLabels: { enabled: false },
      colors: expenseColors,
      legend: { show: false },
      yaxis: { show: false },
      plotOptions: {
        polarArea: {
          rings: { strokeWidth: 1, strokeColor: '#F5F5F5' },
          spokes: { strokeWidth: 1, connectorColors: '#D4D4D4' }
        }
      }
    };

    // 8. Work Order Insights
    this.woTotalOrderOptions = this.createBarSparkline([5, 10, 8, 15, 12, 20, 18, 25, 22, 30, 28, 35], '#16cbc7', '#EEEEF5');
    this.woNewOrderOptions = this.createLineSparkline([10, 15, 10, 20, 15, 25, 20, 30], c.info);
    this.woTotalResolvedOptions = this.createBarSparkline([5, 8, 12, 10, 15, 18, 20, 22, 25, 28, 30, 35], '#5347ce', '#EEEEF5');

    // 9. Work Order Donut Charts
    this.workOrderRequestsOptions = this.withDonutNumberOnTop(
      this.createDonut([800, 300, 157], [c.primary, c.success, c.warning], ['Open', 'Closed', 'Other'], { label: 'Total Requests', value: '1,257' })
    );
    this.workOrderStatusOptions = this.withDonutNumberOnTop(
      this.createDonut([500, 365], [c.info, c.primary], ['New', 'Resolved'], { label: 'Work Orders', value: '865' })
    );
    this.workOrderDistOptions = this.withDonutNumberOnTop(
      this.createDonut([300, 200, 150, 100, 65, 50], [c.info, '#6B8FBF', '#9BB3D1', c.warning, c.primary, c.success], ['Electrical', 'Doors & Locks', 'Plumbing', 'Air Conditioner', 'Cleaning Issues', 'Joinery'], { label: 'Work Orders', value: '865' }),
      267
    );

    // 10. Resolve Rate & Unit Health
    this.woResolveRateOptions = {
      series: [{ name: 'Work Orders', data: [15, 15, 28, 38, 12, 25, 11] }],
      chart: { type: 'bar', height: 220, toolbar: { show: false }, fontFamily: defaultFont },
      plotOptions: { bar: { borderRadius: 8, columnWidth: '22%', colors: { backgroundBarColors: ['#EEEEF5'], backgroundBarRadius: 8 } } },
      dataLabels: { enabled: false },
      legend: { show: false },
      grid: { strokeDashArray: 4, borderColor: '#E4E4EC', xaxis: { lines: { show: false } } },
      xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], labels: { show: false }, axisBorder: { show: false }, axisTicks: { show: false } },
      yaxis: { min: 0, max: 40, tickAmount: 4, labels: { style: { fontFamily: defaultFont, colors: c.muted, fontSize: '14px', fontWeight: 600 } } },
      colors: [c.info]
    };

    this.unitHealthOptions = {
      series: [{ name: 'Work Orders', data: [50, 45, 40, 35, 30] }],
      chart: { type: 'bar', height: 220, toolbar: { show: false }, fontFamily: defaultFont },
      plotOptions: { bar: { borderRadius: 8, columnWidth: '40%', colors: { backgroundBarColors: ['#EEEEF5'], backgroundBarRadius: 8 } } },
      dataLabels: { enabled: false },
      legend: { show: false },
      grid: { show: false },
      xaxis: {
        categories: ['305-PR-7', '306-PR-9', '414-PR-5', '507-PR-3', '604-PR-16'],
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { style: { fontFamily: defaultFont, colors: c.muted, fontSize: '11px', fontWeight: 600 } }
      },
      yaxis: { show: false },
      colors: [c.primary]
    };

    // 11. Work Orders Priority & Tickets
    this.woPriorityOptions = {
      series: [
        { name: 'Low', data: [18, 22, 28, 20, 35, 24, 18, 30, 22, 40, 38, 36] },
        { name: 'Medium', data: [22, 18, 30, 24, 28, 20, 22, 26, 18, 22, 24, 20] },
        { name: 'High', data: [30, 28, 22, 26, 20, 32, 28, 24, 30, 22, 20, 24] },
        { name: 'Critical', data: [8, 10, 6, 8, 12, 8, 10, 6, 8, 10, 8, 10] }
      ],
      chart: { type: 'bar', height: 215, stacked: true, toolbar: { show: false }, fontFamily: defaultFont },
      plotOptions: { bar: { columnWidth: '28%', borderRadius: 2 } },
      xaxis: {
        categories: ['Jan 25', 'Feb 25', 'Mar 25', 'Apr 25', 'May 25', 'Jun 25', 'Jul 25', 'Aug 25', 'Sep 25', 'Oct 25', 'Nov 25', 'Dec 25'],
        labels: { style: { fontFamily: defaultFont, colors: c.muted, fontSize: '12px' } },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: { min: 0, max: 100, tickAmount: 4, labels: { style: { fontFamily: defaultFont, colors: c.muted, fontSize: '14px', fontWeight: 600 } } },
      grid: { strokeDashArray: 4, borderColor: '#E4E4EC', xaxis: { lines: { show: false } } },
      colors: ['#9BB3D1', c.info, c.primary, '#1E3A5F'],
      dataLabels: { enabled: false },
      legend: { show: false }
    };

    this.statusLegend = [
      { label: 'open', color: c.primary },
      { label: 'resolved', color: c.info },
      { label: 'closed', color: '#5347ce' },
      { label: 'new', color: '#9BB3D1' }
    ];
    this.statusWiseTicketsOptions = this.withDonutNumberOnTop(
      this.createDonut([2212, 80, 1368, 27], this.statusLegend.map((item) => item.color), this.statusLegend.map((item) => item.label), { label: 'Tickets', value: '3,687' })
    );

    this.deptGroups = [
      { label: 'Accounting Group', color: c.success, meta: '12 · 21%', width: '85%' },
      { label: 'Facility Group', color: c.info, meta: '28 · 49%', width: '54%' },
      { label: 'Lease Group', color: c.primary, meta: '17 · 30%', width: '33%' }
    ];
    this.deptTicketOptions = this.withDonutNumberOnTop(
      this.createDonut([12, 28, 17], this.deptGroups.map((item) => item.color), this.deptGroups.map((item) => item.label), { label: 'Total Ticket', value: '58' }),
      282
    );

    this.newTicketsOptions = this.createAxisBar([18, 12, 22, 28, 38, 16, 24], c.info, 40, 220);

    this.ticketSourcesOptions = {
      series: [77, 23, 2],
      chart: { type: 'radialBar', height: 230, width: 230, fontFamily: defaultFont, sparkline: { enabled: true } },
      plotOptions: {
        radialBar: {
          startAngle: -10,
          endAngle: 350,
          hollow: { size: '18%' },
          track: { background: '#EEEEF5', strokeWidth: '100%' },
          dataLabels: { name: { show: false }, value: { show: false }, total: { show: false } }
        }
      },
      stroke: { lineCap: 'round' },
      dataLabels: { enabled: false },
      legend: { show: false },
      colors: [c.primary, c.info, '#9BB3D1']
    };

    this.unitsPublishedOptions = this.createAxisBar([22, 18, 8, 42, 28, 36, 20], c.primary, 50, 280);

    this.unitStatsOccupancyOptions = this.withDonutNumberOnTop(
      this.createDonut([82, 12, 6], [c.primary, c.info, '#A78BFA'], ['Occupied', 'Vacant', 'Sold'], {
        label: 'Occupancy Rate',
        value: '82%'
      }),
      275
    );

    this.unitTypesDonutOptions = this.withDonutNumberOnTop(
      this.createDonut(
        [40, 25, 15, 15, 5],
        ['#6366F1', '#14B8A6', '#FACC15', '#3B82F6', '#F97316'],
        ['1-BHK', '2-BHK', '3-BHK', 'Apartment', 'Full Floor'],
        { label: 'All units', value: '2,955' }
      ),
      275
    );

    this.annualRentOptions = {
      series: [{ name: 'Recognized rent revenue', data: [2, 4, 12, 7, 6, 28.5, 40, 45, 45, 45, 45] }],
      chart: { type: 'bar', height: 330, toolbar: { show: false }, fontFamily: defaultFont },
      plotOptions: {
        bar: {
          columnWidth: '22%',
          borderRadius: 20,
          borderRadiusApplication: 'around',
          distributed: true
        }
      },
      dataLabels: { enabled: false },
      legend: { show: false },
      grid: {
        borderColor: '#E4E4EC',
        strokeDashArray: 4,
        xaxis: { lines: { show: false } },
        padding: { top: 0, right: 8, bottom: 0, left: 8 }
      },
      xaxis: {
        categories: ['2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030'],
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { style: { fontFamily: defaultFont, colors: c.muted, fontSize: '12px' } }
      },
      yaxis: {
        min: 0,
        max: 50,
        tickAmount: 5,
        labels: {
          style: { fontFamily: defaultFont, colors: c.muted, fontSize: '12px' },
          formatter: (val: number) => (val === 0 ? '0' : `${val} M`)
        }
      },
      colors: [c.primary, c.primary, c.primary, c.primary, c.primary, c.primary, c.primary, '#EEEEF5', '#EEEEF5', '#EEEEF5', '#EEEEF5'],
      stroke: { colors: ['transparent'], width: 0 }
    };

    this.leaseStatusDonutOptions = this.createDonut(
      [18, 42, 12, 10, 12, 6],
      ['#14B8A6', '#6366F1', '#3B82F6', '#FACC15', '#F97316', '#A855F7'],
      [
        'Renewing Leases',
        'Contacted Leases',
        'Renewal Notice Served Leases',
        'Not Renewing Leases',
        'No Response Leases',
        'Ending Leases'
      ],
      'none'
    );
    this.leaseStatusDonutOptions.chart = { ...this.leaseStatusDonutOptions.chart, height: 275, width: 275 };

    this.tenantByCountryOptions = {
      series: [{ name: 'Tenants', data: [703, 350, 1322, 600, 1600, 830] }],
      chart: { type: 'bar', height: 250, toolbar: { show: false }, fontFamily: defaultFont },
      plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: '30%' } },
      dataLabels: { enabled: false },
      legend: { show: false },
      xaxis: { categories: ['Indonesia', 'Bangladesh', 'Philippines', 'United Arab Emirates', 'India', 'Cameroon'], labels: { show: false } },
      colors: [c.info]
    };
  }

  private createAxisBar(data: number[], color: string, max: number, height: number) {
    const defaultFont = "'Hanken Grotesk', sans-serif";
    return {
      series: [{ name: 'Data', data }],
      chart: { type: 'bar', height, toolbar: { show: false }, fontFamily: defaultFont },
      plotOptions: {
        bar: {
          columnWidth: '18%',
          borderRadius: 8,
          colors: { backgroundBarColors: ['#EEEEF5'], backgroundBarRadius: 8 }
        }
      },
      dataLabels: { enabled: false },
      legend: { show: false },
      grid: {
        borderColor: '#E4E4EC',
        strokeDashArray: 4,
        xaxis: { lines: { show: false } },
        padding: { top: 0, right: 8, bottom: 0, left: 4 }
      },
      xaxis: {
        labels: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        min: 0,
        max,
        tickAmount: max / 10,
        labels: { style: { colors: '#6B6B7D', fontSize: '12px', fontFamily: defaultFont } }
      },
      colors: [color],
      tooltip: { y: { title: { formatter: () => '' } } }
    };
  }

  private withDonutNumberOnTop(opts: any, size = 275) {
    opts.chart = { ...opts.chart, height: size, width: size };
    const labels = opts.plotOptions.pie.donut.labels;
    const number = labels.total.formatter();
    const caption = labels.total.label;
    labels.total.label = number;
    labels.total.fontSize = '26px';
    labels.total.fontWeight = 800;
    labels.total.color = '#252536';
    labels.total.formatter = () => caption;
    labels.value = { ...labels.value, show: false, fontSize: '14px', fontWeight: 400, color: '#6B6B7D', offsetY: 8 };
    return opts;
  }

  private createDonut(
    series: number[],
    colors: string[],
    labels: string[],
    center?: { label: string; value: string } | 'none'
  ) {
    const defaultFont = "'Hanken Grotesk', sans-serif";
    const hide = center === 'none';
    const useTotal = !!center && center !== 'none';
    return {
      series: series,
      chart: { type: 'donut', height: useTotal ? 188 : 220, width: useTotal ? 187 : undefined, toolbar: { show: false }, fontFamily: defaultFont },
      labels: labels,
      colors: colors,
      plotOptions: {
        pie: {
          dataLabels: { offset: 0, minAngleToShowLabel: 360 },
          donut: {
            size: '75%',
            labels: {
              show: !hide,
              name: {
                show: !hide && !useTotal,
                fontSize: '14px',
                fontFamily: defaultFont,
                color: '#6B6B7D',
                offsetY: 20
              },
              value: {
                show: !hide && !useTotal,
                fontSize: '26px',
                fontWeight: 800,
                fontFamily: defaultFont,
                color: '#252536',
                offsetY: -10
              },
              total: useTotal ? {
                show: true,
                showAlways: true,
                label: (center as { label: string; value: string }).label,
                fontSize: '14px',
                fontWeight: 400,
                fontFamily: defaultFont,
                color: '#6B6B7D',
                formatter: () => (center as { label: string; value: string }).value
              } : { show: false }
            }
          }
        }
      },
      dataLabels: { enabled: false },
      stroke: { show: true, width: 3, colors: ['#ffffff'] },
      legend: { show: false, floating: true }
    };
  }

  private createBarSparkline(data: number[], color: string, track = '#F7F1E7') {
    const defaultFont = "'Hanken Grotesk', sans-serif";
    return {
      series: [{ name: 'Data', data: data }],
      chart: { type: 'bar', height: 128, sparkline: { enabled: true }, fontFamily: defaultFont },
      plotOptions: { bar: { columnWidth: '50%', borderRadius: 8, colors: { backgroundBarColors: [track], backgroundBarRadius: 8 } } },
      colors: [color],
      tooltip: { fixed: { enabled: false }, x: { show: false }, y: { title: { formatter: function (_seriesName: string) { return ''; } } }, marker: { show: false } }
    };
  }

  private createLineSparkline(data: number[], color: string) {
    const defaultFont = "'Hanken Grotesk', sans-serif";
    return {
      series: [{ name: 'Data', data: data }],
      chart: { type: 'line', height: 128, sparkline: { enabled: true }, fontFamily: defaultFont },
      stroke: { curve: 'smooth', width: 2 },
      colors: [color],
      tooltip: { fixed: { enabled: false }, x: { show: false }, y: { title: { formatter: function (_seriesName: string) { return ''; } } }, marker: { show: false } }
    };
  }

  private createLeaseLineSparkline(data: number[], color: string) {
    const defaultFont = "'Hanken Grotesk', sans-serif";
    return {
      series: [{ name: 'Data', data: data }],
      chart: {
        type: 'line',
        height: 128,
        sparkline: { enabled: true },
        toolbar: { show: false },
        fontFamily: defaultFont
      },
      stroke: { curve: 'smooth', width: 2 },
      colors: [color],
      dataLabels: { enabled: false },
      legend: { show: false },
      markers: { size: 0 },
      grid: { show: false },
      xaxis: { labels: { show: false }, axisBorder: { show: false }, axisTicks: { show: false } },
      yaxis: { labels: { show: false }, min: 0 },
      tooltip: { enabled: false }
    };
  }
}