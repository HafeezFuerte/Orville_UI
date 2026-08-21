import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { QUOTATION_FORM_OPTIONS } from '../quotations.data';

@Component({
  selector: 'app-request-quotation',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule],
  templateUrl: './request-quotation.component.html',
  styleUrl: './request-quotation.component.scss'
})
export class RequestQuotationComponent {
  private router = inject(Router);

  options = QUOTATION_FORM_OPTIONS;

  title = '';
  reference = '';
  selectedWorkOrder: string | null = null;
  estimatedDate = '';
  selectedCategory: string | null = null;
  selectedVendors: string[] = [];
  description = '';

  goBack(): void {
    this.router.navigate(['/facility/quotations']);
  }

  submit(): void {
    this.router.navigate(['/facility/quotations']);
  }
}
