import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-add-inspection',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NgSelectModule],
  templateUrl: './add-inspection.component.html',
  styleUrls: []
})
export class AddInspectionComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  inspectionForm!: FormGroup;

  inspectionTypes = ['Move Out', 'Move In', 'Routine', 'Dispute'];
  properties = ['Marina Heights Tower', 'Buhaleeba Plaza', 'Sunrise Apartments'];
  units = ['215-PR-1', 'A-101', 'B-205'];
  leases = ['LEASE-2025-001', 'LEASE-2024-056'];
  assets = ['Washing Machine', 'Refrigerator', 'Split AC'];
  inspectors = ['Salman Mukadam Inspector', 'John Doe Inspector'];

  // Real-time summary values bindable to form valueChanges
  summaryScope = 'Both';
  summaryType = '-';
  summaryProperty = '-';
  summaryUnit = '-';
  summaryAsset = '-';

  ngOnInit() {
    this.inspectionForm = this.fb.group({
      inspectionType: [null, Validators.required],
      inspectionDateTime: ['', Validators.required],
      scope: ['both'],
      property: [null],
      unit: [null],
      lease: [null],
      asset: [null],
      inspector: [null, Validators.required],
      note: ['']
    });

    // Subscribing to valueChanges to dynamically update the right summary card
    this.inspectionForm.valueChanges.subscribe(val => {
      this.summaryScope = val.scope === 'both' ? 'Both' : (val.scope === 'unit' ? 'Unit' : 'Asset');
      this.summaryType = val.inspectionType || '-';
      this.summaryProperty = val.property || '-';
      this.summaryUnit = val.unit || '-';
      this.summaryAsset = val.asset || '-';
    });
  }

  onSubmit() {
    if (this.inspectionForm.valid) {
      console.log('Form Submitted', this.inspectionForm.value);
      this.router.navigate(['/inspections/list']);
    } else {
      this.inspectionForm.markAllAsTouched();
    }
  }
}
