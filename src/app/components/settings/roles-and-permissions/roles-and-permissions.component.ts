import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MOCK_ROLES, RoleRow } from './roles-and-permissions.data';

@Component({
  selector: 'app-roles-and-permissions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roles-and-permissions.component.html',
})
export class RolesAndPermissionsComponent {
  searchQuery = '';
  roles: RoleRow[] = [...MOCK_ROLES];

  constructor(private router: Router) {}

  get filteredRoles(): RoleRow[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      return this.roles;
    }
    return this.roles.filter((r) => r.name.toLowerCase().includes(q));
  }

  get countLabel(): string {
    const n = this.filteredRoles.length;
    return `${n} role${n === 1 ? '' : 's'}`;
  }

  openNew(): void {
    this.router.navigate(['/settings/roles-and-permissions/new']);
  }

  openEdit(row: RoleRow): void {
    this.router.navigate(['/settings/roles-and-permissions/new'], {
      queryParams: { id: row.id },
    });
  }

  deleteRole(row: RoleRow): void {
    if (row.system || row.userCount > 0) {
      return;
    }
    this.roles = this.roles.filter((r) => r.id !== row.id);
  }
}
