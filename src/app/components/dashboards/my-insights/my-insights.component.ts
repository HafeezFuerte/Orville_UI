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
  public sparklineLineOptions: any = {};
  public sparklineRoomsOptions: any = {};
  /** Figma 753:15559 — gold pill bars (same heights as lease YTD) */
  public propertyYtdBars = [35, 68, 88, 31, 61, 30, 0, 0, 0, 0, 0, 0];

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
  public unitStatsFilter: 'All' | 'Residential' | 'Commercial' = 'All';
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
  /** Figma 787:18360 — pill bars (value / 40) */
  public woResolveRateBars = [
    { value: 15 },
    { value: 15 },
    { value: 29 },
    { value: 40 },
    { value: 13 },
    { value: 26 },
    { value: 13 }
  ];
  public woResolveRateMax = 40;
  public woResolveRateTicks = [40, 30, 20, 10, 0];
  /** Figma 796:3582 — same pill pattern as resolve rate */
  public newTicketsBars = [
    { value: 15 },
    { value: 15 },
    { value: 29 },
    { value: 40 },
    { value: 13 },
    { value: 26 },
    { value: 13 }
  ];
  public newTicketsMax = 40;
  public newTicketsTicks = [40, 30, 20, 10, 0];
  /** Figma 796:3690 — purple pills, max 50 */
  public unitsPublishedBars = [
    { value: 14 },
    { value: 14 },
    { value: 26 },
    { value: 37 },
    { value: 12 },
    { value: 24 },
    { value: 12 }
  ];
  public unitsPublishedMax = 50;
  public unitsPublishedTicks = [50, 40, 30, 20, 10, 0];
  public ticketSourceLegend: { label: string; count: string; color: string; icon: string }[] = [];
  /** Figma 787:18426 — pill bars (value / 100 for track fill %) */
  public unitHealthBars = [
    { label: '305-PR-7', value: 37 },
    { label: '306-PR-9', value: 84 },
    { label: '414-PR-5', value: 72 },
    { label: '507-PR-3', value: 25 },
    { label: '604-PR-16', value: 39 }
  ];
  public woPriorityOptions: any = {};
  public deptTicketOptions: any = {};
  public deptGroups: { label: string; color: string; meta: string; width: string }[] = [];
  public statusLegend: { label: string; color: string }[] = [];
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

    // 1. Highlight sparklines — Figma 753:15714
    this.sparklineLineOptions = {
      series: [{ name: 'Units', data: [10, 20, 15, 30, 25, 40, 35, 50, 12, 10, 8, 6] }],
      chart: { type: 'line', height: 128, sparkline: { enabled: true }, fontFamily: defaultFont, toolbar: { show: false } },
      stroke: { curve: 'smooth', width: 2 },
      colors: [c.accent],
      grid: { show: false },
      tooltip: { enabled: false }
    };

    this.sparklineRoomsOptions = {
      series: [{ name: 'Rooms', data: [10, 25, 15, 30, 25, 50, 35, 45, 14, 12, 9, 7] }],
      chart: { type: 'line', height: 128, sparkline: { enabled: true }, fontFamily: defaultFont, toolbar: { show: false } },
      stroke: { curve: 'smooth', width: 2 },
      colors: [c.info],
      grid: { show: false },
      tooltip: { enabled: false }
    };

    // 2. Radial Charts for Occupancy & Vacant
    this.occupancyRadialOptions = {
      series: [77.9],
      chart: { type: 'radialBar', height: 130, width: 130, sparkline: { enabled: true }, fontFamily: defaultFont },
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 270,
          hollow: { size: '68%' },
          track: { background: '#EEEEF5', strokeWidth: '100%' },
          dataLabels: {
            name: { show: false },
            value: {
              show: true,
              fontSize: '18px',
              fontWeight: 900,
              fontFamily: defaultFont,
              color: c.text,
              offsetY: 6,
              formatter: (val: number) => `${val}%`
            }
          }
        }
      },
      colors: [c.primary],
      stroke: { lineCap: 'round' }
    };

    this.vacantRadialOptions = {
      series: [21],
      chart: { type: 'radialBar', height: 130, width: 130, sparkline: { enabled: true }, fontFamily: defaultFont },
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 270,
          hollow: { size: '68%' },
          track: { background: '#EEEEF5', strokeWidth: '100%' },
          dataLabels: {
            name: { show: false },
            value: {
              show: true,
              fontSize: '18px',
              fontWeight: 900,
              fontFamily: defaultFont,
              color: c.text,
              offsetY: 6,
              formatter: (val: number) => `${val}%`
            }
          }
        }
      },
      colors: ['#06b6d4'],
      stroke: { lineCap: 'round' }
    };

    // 3. Properties, Units, Rooms Donuts — Figma 753:15715
    this.propertiesDonutOptions = this.createDonut(
      [17, 0, 2],
      [c.primary, '#A5B4FC', '#3E6FA8'],
      ['Residential', 'Commercial', 'Mixed-use'],
      { label: 'All properties', value: '19' }
    );
    this.unitsDonutOptions = this.createDonut(
      [985, 756, 758, 456],
      ['#5347CE', '#887CFD', '#3B82F6', '#14B8A6'],
      ['1 BHK', '2 BHK', '3 BHK', 'Studio'],
      { label: 'All units', value: '2955' }
    );
    this.roomsDonutOptions = this.createDonut(
      [985, 756, 758, 456],
      ['#5347CE', '#887CFD', '#3B82F6', '#14B8A6'],
      ['1 BHK', '2 BHK', '3 BHK', 'Studio'],
      { label: 'All rooms', value: '2955' }
    );

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
        labels: { rotate: 0, style: { fontFamily: defaultFont, colors: c.muted, fontSize: '12px', fontWeight: 600 } }
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

    // 9. Work Order Donut Charts — Figma 784:18273 palette
    const wo = {
      purple: '#5347CE',
      teal: '#16CBC7',
      yellow: '#FACC15',
      navy: '#1E40AF',
      blue: '#2563EB',
      lilac: '#887CFD'
    };
    this.workOrderRequestsOptions = this.withDonutNumberOnTop(
      this.createDonut([800, 300, 157], [wo.purple, wo.teal, wo.yellow], ['Open', 'Closed', 'Other'], { label: 'Total Requests', value: '1,257' })
    );
    this.workOrderStatusOptions = this.withDonutNumberOnTop(
      this.createDonut([500, 365], [wo.navy, wo.blue], ['New', 'Resolved'], { label: 'Work Orders', value: '865' })
    );
    this.workOrderDistOptions = this.withDonutNumberOnTop(
      this.createDonut(
        [300, 200, 150, 100, 65, 50],
        [wo.navy, wo.blue, wo.lilac, wo.yellow, wo.purple, wo.teal],
        ['Electrical', 'Doors & Locks', 'Plumbing', 'Air Conditioner', 'Cleaning Issues', 'Joinery'],
        { label: 'Work Orders', value: '865' }
      ),
      267
    );

    // 10. Resolve Rate & Unit Health — custom CSS pills (Figma 787:18360 / 787:18426)
    this.woResolveRateOptions = {};
    this.unitHealthOptions = {};

    // 11. Work Orders Priority — Figma 792:18723 (stack: dark bottom → light top)
    this.woPriorityOptions = {
      series: [
        { name: 'High', data: [28, 19, 19, 28, 25, 19, 21, 39, 21, 25, 25, 25] },
        { name: 'Medium', data: [28, 12, 19, 28, 25, 19, 21, 39, 21, 25, 25, 25] },
        { name: 'Critical', data: [24, 20, 29, 24, 22, 19, 16, 24, 16, 22, 22, 22] },
        { name: 'Low', data: [11, 22, 28, 11, 28, 27, 20, 13, 20, 28, 17, 8] }
      ],
      chart: { type: 'bar', height: 248, stacked: true, toolbar: { show: false }, fontFamily: defaultFont },
      plotOptions: { bar: { columnWidth: '18%', borderRadius: 0, borderRadiusApplication: 'around' } },
      xaxis: {
        categories: ['Jan 25', 'Feb 25', 'Mar 25', 'Apr 25', 'May 25', 'Jun 25', 'Jul 25', 'Aug 25', 'Sep 25', 'Oct 25', 'Nov 25', 'Dec 25'],
        labels: { style: { fontFamily: defaultFont, colors: c.muted, fontSize: '14px', fontWeight: 500 }, rotate: 0, hideOverlappingLabels: false },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        min: 0,
        max: 100,
        tickAmount: 4,
        labels: { style: { fontFamily: defaultFont, colors: c.muted, fontSize: '14px', fontWeight: 600 } }
      },
      grid: { strokeDashArray: 4, borderColor: '#E4E4EC', xaxis: { lines: { show: false } }, padding: { left: 8, right: 4 } },
      colors: ['#2563EB', '#316EF3', '#4F84F9', '#87ACFF'],
      dataLabels: { enabled: false },
      legend: { show: false },
      tooltip: { shared: true, intersect: false }
    };

    this.statusLegend = [
      { label: 'open', color: '#1E40AF' },
      { label: 'resolved', color: '#2563EB' },
      { label: 'closed', color: '#5347CE' },
      { label: 'new', color: '#887CFD' }
    ];
    this.statusWiseTicketsOptions = this.withDonutNumberOnTop(
      this.createDonut(
        [2212, 80, 1368, 27],
        this.statusLegend.map((item) => item.color),
        this.statusLegend.map((item) => item.label),
        { label: 'Tickets', value: '3,687' }
      ),
      275
    );

    // Figma 792:18600 — teal / blue / indigo; "Total Ticket" above value
    this.deptGroups = [
      { label: 'Accounting Group', color: '#14B8A6', meta: '12 · 21%', width: '21%' },
      { label: 'Facility Group', color: '#3B82F6', meta: '28 · 49%', width: '49%' },
      { label: 'Lease Group', color: '#6366F1', meta: '17 · 30%', width: '30%' }
    ];
    this.deptTicketOptions = this.withDonutCaptionOnTop(
      this.createDonut(
        [12, 28, 17],
        this.deptGroups.map((item) => item.color),
        this.deptGroups.map((item) => item.label),
        { label: 'Total Ticket', value: '58' }
      ),
      282
    );

    // Figma 796:3744 — New Tickets / Ticket Sources / Units Published
    this.ticketSourceLegend = [
      { label: 'Manual', count: '1,209 tickets', color: '#2563EB', icon: 'assets/images/insights/src-manual.svg' },
      { label: 'Email', count: '367 tickets', color: '#5087FF', icon: 'assets/images/insights/src-email.svg' },
      { label: 'Contact form', count: '4 tickets', color: '#74A0FF', icon: 'assets/images/insights/src-form.svg' }
    ];
    this.ticketSourcesOptions = {
      series: [77, 23, 2],
      chart: { type: 'radialBar', height: 264, width: 264, fontFamily: defaultFont, sparkline: { enabled: true } },
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 270,
          hollow: { size: '22%' },
          track: { background: '#EEEEF5', strokeWidth: '100%', margin: 6 },
          dataLabels: { name: { show: false }, value: { show: false }, total: { show: false } }
        }
      },
      stroke: { lineCap: 'round' },
      dataLabels: { enabled: false },
      legend: { show: false },
      colors: this.ticketSourceLegend.map((item) => item.color)
    };

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

    // Figma 470:2987 — purple data years + light future placeholders; per-point fill avoids
    // Apex distributed-bar radius distortion (lopsided / incomplete circle tops).
    const rentYears = ['2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030'];
    const rentValues = [3.4, 4.4, 12.9, 7.8, 6.9, 28.5, 40.7, 43.7, 43.7, 43.7, 43.7];
    this.annualRentOptions = {
      series: [{
        name: 'Recognized rent revenue',
        data: rentValues.map((value, i) => ({
          x: rentYears[i],
          y: value,
          fillColor: i < 7 ? '#604AE3' : '#F8F8FB'
        }))
      }],
      chart: {
        type: 'bar',
        height: 360,
        toolbar: { show: false },
        fontFamily: defaultFont,
        animations: { enabled: false }
      },
      plotOptions: {
        bar: {
          columnWidth: '20px',
          borderRadius: 10,
          borderRadiusApplication: 'around',
          distributed: false
        }
      },
      dataLabels: { enabled: false },
      legend: { show: false },
      grid: {
        borderColor: '#E4E4EC',
        strokeDashArray: 4,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
        padding: { top: 8, right: 12, bottom: 0, left: 4 }
      },
      xaxis: {
        type: 'category',
        categories: rentYears,
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          style: {
            fontFamily: defaultFont,
            colors: Array(11).fill(c.muted),
            fontSize: '14px',
            fontWeight: 600
          }
        }
      },
      yaxis: {
        min: 0,
        max: 50,
        tickAmount: 5,
        labels: {
          style: { fontFamily: defaultFont, colors: c.muted, fontSize: '14px', fontWeight: 600 },
          formatter: (val: number) => (val === 0 ? '0' : `${val} M`)
        }
      },
      colors: ['#604AE3'],
      fill: { opacity: 1, type: 'solid' },
      stroke: { show: false, width: 0 },
      tooltip: { theme: 'light' }
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

  /** Caption above large value — Figma Department Ticket donut */
  private withDonutCaptionOnTop(opts: any, size = 282) {
    opts.chart = { ...opts.chart, height: size, width: size };
    const labels = opts.plotOptions.pie.donut.labels;
    labels.total.fontSize = '14px';
    labels.total.fontWeight = 600;
    labels.total.color = '#6B6B7D';
    labels.value = {
      ...labels.value,
      show: true,
      fontSize: '24px',
      fontWeight: 800,
      fontFamily: "'Hanken Grotesk', sans-serif",
      color: '#252536',
      offsetY: 4
    };
    labels.name = { ...labels.name, show: false };
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