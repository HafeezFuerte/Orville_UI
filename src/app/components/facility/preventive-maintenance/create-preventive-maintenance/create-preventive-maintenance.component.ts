import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { PM_FORM_OPTIONS } from '../preventive-maintenance.data';

@Component({
  selector: 'app-create-preventive-maintenance',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule],
  templateUrl: './create-preventive-maintenance.component.html',
  styleUrl: './create-preventive-maintenance.component.scss'
})
export class CreatePreventiveMaintenanceComponent {
  private router = inject(Router);

  options = PM_FORM_OPTIONS;

  name = 'Test Trigger';
  startDate = '';
  firstPpmDate = '';
  endsOn = '';
  every = 4;
  timeSpan: string | null = 'Weeks';
  createDaysBefore = 1;

  selectedProperty: string | null = null;
  selectedUnit: string | null = null;
  selectedCommonArea: string | null = null;
  assetSearch = '';

  workOrderTitle = 'Test Work order';
  workOrderDetails = '';
  selectedCategory: string | null = 'Plumbing';

  responsiblePerson = '';
  selectedTechnicians: string[] = [];
  selectedVendor: string | null = null;
  allowPostPpm = false;
  checklistItems: string[] = [''];

  goBack(): void {
    this.router.navigate(['/facility/preventive-maintenance']);
  }

  create(): void {
    this.router.navigate(['/facility/preventive-maintenance']);
  }

  addChecklistItem(): void {
    this.checklistItems = [...this.checklistItems, ''];
  }

  removeChecklistItem(index: number): void {
    if (this.checklistItems.length <= 1) {
      this.checklistItems = [''];
      return;
    }
    this.checklistItems = this.checklistItems.filter((_, i) => i !== index);
  }

  trackByIndex(index: number): number {
    return index;
  }
}
