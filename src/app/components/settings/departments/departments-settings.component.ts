import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface DepartmentRow {
  id: number;
  name: string;
  users: number;
  isAdmin: boolean;
}

@Component({
  selector: 'app-departments-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './departments-settings.component.html',
  styleUrl: './departments-settings.component.scss',
})
export class DepartmentsSettingsComponent {
  searchQuery = '';
  modalOpen = false;
  editingId: number | null = null;

  draftName = '';
  draftIsAdmin = false;

  departments: DepartmentRow[] = [
    { id: 1, name: 'Accounting Group', users: 0, isAdmin: true },
    { id: 2, name: 'Facility Group', users: 2, isAdmin: true },
    { id: 3, name: 'Lease Group', users: 5, isAdmin: true },
  ];

  private nextId = 4;

  get filteredDepartments(): DepartmentRow[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      return this.departments;
    }
    return this.departments.filter((d) => d.name.toLowerCase().includes(q));
  }

  get countLabel(): string {
    const n = this.filteredDepartments.length;
    return `${n} department${n === 1 ? '' : 's'}`;
  }

  get modalTitle(): string {
    return this.editingId == null ? 'New Department' : 'Edit Department';
  }

  get modalSubtitle(): string {
    return this.editingId == null
      ? 'Create a department to route tickets to the right team.'
      : 'Update department details for ticket routing.';
  }

  openCreate(): void {
    this.editingId = null;
    this.draftName = '';
    this.draftIsAdmin = false;
    this.modalOpen = true;
  }

  openEdit(row: DepartmentRow): void {
    this.editingId = row.id;
    this.draftName = row.name;
    this.draftIsAdmin = row.isAdmin;
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.editingId = null;
    this.draftName = '';
    this.draftIsAdmin = false;
  }

  saveDepartment(): void {
    const name = this.draftName.trim();
    if (!name) {
      return;
    }

    if (this.editingId != null) {
      const row = this.departments.find((d) => d.id === this.editingId);
      if (row) {
        row.name = name;
        row.isAdmin = this.draftIsAdmin;
      }
    } else {
      this.departments = [
        ...this.departments,
        {
          id: this.nextId++,
          name,
          users: 0,
          isAdmin: this.draftIsAdmin,
        },
      ];
    }

    this.closeModal();
  }

  deleteDepartment(row: DepartmentRow): void {
    this.departments = this.departments.filter((d) => d.id !== row.id);
  }
}
