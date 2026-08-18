import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  CommissionAllocationRow,
  CommissionDetail,
  CommissionViewMode,
  getCommissionDetail
} from './commission-detail.data';

@Component({
  selector: 'app-commission-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './commission-detail.component.html',
  styleUrl: './commission-detail.component.scss'
})
export class CommissionDetailComponent implements OnInit {
  detail: CommissionDetail = getCommissionDetail('C002');
  viewMode: CommissionViewMode = 'Company';
  companyQuery = '';
  agentQuery = '';
  companyPageIndex = 0;
  agentPageIndex = 0;
  pageSize = 10;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.detail = getCommissionDetail(params.get('id'));
      this.companyPageIndex = 0;
      this.agentPageIndex = 0;
    });
  }

  goBack(): void {
    void this.router.navigate(['/commissions']);
  }

  setViewMode(mode: CommissionViewMode): void {
    this.viewMode = mode;
  }

  filtered(rows: CommissionAllocationRow[], query: string): CommissionAllocationRow[] {
    const q = query.trim().toLowerCase();
    if (!q) {
      return rows;
    }
    return rows.filter((row) =>
      [row.id, row.to, row.name, row.amount].some((value) => value.toLowerCase().includes(q))
    );
  }

  paged(rows: CommissionAllocationRow[], query: string, pageIndex: number): CommissionAllocationRow[] {
    const start = pageIndex * this.pageSize;
    return this.filtered(rows, query).slice(start, start + this.pageSize);
  }

  total(rows: CommissionAllocationRow[], query: string): number {
    return this.filtered(rows, query).length;
  }

  pages(rows: CommissionAllocationRow[], query: string): number {
    return Math.max(1, Math.ceil(this.total(rows, query) / this.pageSize) || 1);
  }

  start(rows: CommissionAllocationRow[], query: string, pageIndex: number): number {
    return this.total(rows, query) ? pageIndex * this.pageSize + 1 : 0;
  }

  end(rows: CommissionAllocationRow[], query: string, pageIndex: number): number {
    return Math.min((pageIndex + 1) * this.pageSize, this.total(rows, query));
  }

  onCompanySearch(): void {
    this.companyPageIndex = 0;
  }

  onAgentSearch(): void {
    this.agentPageIndex = 0;
  }

  onPageSizeChange(): void {
    this.companyPageIndex = 0;
    this.agentPageIndex = 0;
  }

  prevCompany(): void {
    if (this.companyPageIndex > 0) {
      this.companyPageIndex--;
    }
  }

  nextCompany(): void {
    if (this.companyPageIndex + 1 < this.pages(this.detail.companyRows, this.companyQuery)) {
      this.companyPageIndex++;
    }
  }

  prevAgent(): void {
    if (this.agentPageIndex > 0) {
      this.agentPageIndex--;
    }
  }

  nextAgent(): void {
    if (this.agentPageIndex + 1 < this.pages(this.detail.agentRows, this.agentQuery)) {
      this.agentPageIndex++;
    }
  }
}
