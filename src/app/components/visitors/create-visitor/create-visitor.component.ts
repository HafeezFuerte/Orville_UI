import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  VISITOR_ACCESS_PASS_TYPES,
  VISITOR_CONTACTS,
  VISITOR_DURATION_OPTIONS,
  VISITOR_PROPERTIES,
  VISITOR_UNITS,
  VISITOR_VALIDITY_OPTIONS,
  VISITOR_VISIT_TYPES
} from '../visitors.data';

@Component({
  selector: 'app-create-visitor',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './create-visitor.component.html',
  styleUrl: './create-visitor.component.scss'
})
export class CreateVisitorComponent {
  private router = inject(Router);

  options = {
    visitTypes: VISITOR_VISIT_TYPES,
    durations: VISITOR_DURATION_OPTIONS,
    validity: VISITOR_VALIDITY_OPTIONS,
    properties: VISITOR_PROPERTIES,
    units: VISITOR_UNITS,
    contacts: VISITOR_CONTACTS,
    accessPassTypes: VISITOR_ACCESS_PASS_TYPES
  };

  fullName = '';
  email = '';
  countryCode = '+971';
  phone = '';
  visitDate = '';
  numberOfVisitors = '1';
  visitType: string | null = 'Personal';
  expectedDuration: string | null = null;
  validityMode: 'one-time' | 'set-validity' = 'set-validity';
  setValidity: string | null = 'Not Set';
  selectedProperty: string | null = null;
  selectedUnit: string | null = null;
  selectedContact: string | null = null;
  notes = '';
  accessPassType: string | null = 'QR Code';
  parkingRequired = true;
  vehicleNumber = '';

  goBack(): void {
    this.router.navigate(['/visitors']);
  }

  save(): void {
    this.router.navigate(['/visitors', '31658']);
  }
}
