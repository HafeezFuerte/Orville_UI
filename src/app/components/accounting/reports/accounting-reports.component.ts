import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ACC_REPORT_CARDS, AccReportCard } from './accounting-reports.data';

@Component({
  selector: 'app-accounting-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './accounting-reports.component.html',
  styleUrl: './accounting-reports.component.scss'
})
export class AccountingReportsComponent {
  searchQuery = '';
  reports = ACC_REPORT_CARDS;

  get filteredReports(): AccReportCard[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      return this.reports;
    }
    return this.reports.filter(
      (report) =>
        report.title.toLowerCase().includes(q) || report.description.toLowerCase().includes(q)
    );
  }

  maskStyle(icon: string): Record<string, string> {
    const url = `url("${icon}")`;
    return {
      '-webkit-mask-image': url,
      'mask-image': url
    };
  }
}
