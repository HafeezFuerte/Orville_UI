import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-add-litigation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NgSelectModule],
  templateUrl: './add-litigation.component.html',
  styleUrls: []
})
export class AddLitigationComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  litigationForm!: FormGroup;
  isEdit = false;

  // Dropdown lists
  escalationOptions = [
    { value: 1, label: 'Option 1' },
    { value: 2, label: 'Option 2' },
    { value: 3, label: 'Option 3' },
    { value: 4, label: 'Option 4' },
    { value: 5, label: 'Option 5' }
  ];

  properties = ['Sunrise Apartments', 'Green Heights', 'Oak Residency', 'City Center Plaza', 'River View Towers'];
  units = ['A-101', 'B-205', 'C-312', 'D-108', 'E-412'];
  leases = ['LEASE-2025-001', 'LEASE-2024-056', 'LEASE-2023-089', 'LEASE-2025-018', 'LEASE-2022-145'];
  statuses = ['Open', 'Closed', 'Pending'];

  ngOnInit() {
    this.litigationForm = this.fb.group({
      caseName: ['', Validators.required],
      legalFirm: ['', Validators.required],
      escalationOption: [null],
      caseDate: ['', Validators.required],
      claimedAmount: [0.0],
      collectedAmount: [0.0],
      property: [null],
      unit: [null],
      lease: [null],
      caseStatus: [null],
      blockUnit: [false],
      blockTenant: [false],
      caseDetails: ['']
    });

    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.loadLitigationDetails();
      }
    });
  }

  loadLitigationDetails() {
    this.litigationForm.patchValue({
      caseName: 'Rent Recovery Case',
      legalFirm: 'Smith & Partners',
      escalationOption: 3,
      caseDate: '2026-07-15',
      claimedAmount: 43000.0,
      collectedAmount: 12000.0,
      property: 'Sunrise Apartments',
      unit: 'A-101',
      lease: 'LEASE-2025-001',
      caseStatus: 'Open',
      blockUnit: true,
      blockTenant: false,
      caseDetails: 'Tenant has 3 months overdue rent.'
    });
  }

  onSubmit() {
    if (this.litigationForm.valid) {
      console.log('Form Submitted', this.litigationForm.value);
      this.router.navigate(['/legal/litigations']);
    } else {
      this.litigationForm.markAllAsTouched();
    }
  }
}
