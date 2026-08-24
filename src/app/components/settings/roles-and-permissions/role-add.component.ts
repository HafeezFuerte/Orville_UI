import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  MOCK_ROLES,
  ROLE_PERMISSION_CATEGORIES,
  RolePermissionCategory,
  createEmptyRolePermissions,
  emptyCategoryPerms,
  fullCategoryPerms,
} from './roles-and-permissions.data';

@Component({
  selector: 'app-role-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './role-add.component.html',
})
export class RoleAddComponent implements OnInit {
  editingId: number | null = null;
  roleName = '';
  isSystem = false;

  readonly categories = ROLE_PERMISSION_CATEGORIES;
  permissions = createEmptyRolePermissions();

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.queryParamMap.get('id');
    if (!idParam) {
      return;
    }
    const id = Number(idParam);
    const existing = MOCK_ROLES.find((r) => r.id === id);
    if (!existing) {
      return;
    }
    this.editingId = existing.id;
    this.roleName = existing.name;
    this.isSystem = !!existing.system;
    this.permissions = JSON.parse(JSON.stringify(existing.permissions));
  }

  get pageTitle(): string {
    return this.editingId == null ? 'New Role' : 'Edit Role';
  }

  get breadcrumb(): string {
    return `Roles and Permissions / ${this.pageTitle}`;
  }

  get canSave(): boolean {
    return this.roleName.trim().length > 0 && !this.isSystem;
  }

  get allSelected(): boolean {
    return this.categories.every((cat) => this.categoryAllSelected(cat));
  }

  get someSelected(): boolean {
    if (this.allSelected) {
      return false;
    }
    return this.categories.some((cat) =>
      cat.permissions.some((p) => this.isChecked(cat.id, p.id))
    );
  }

  get selectedCount(): number {
    let n = 0;
    for (const cat of this.categories) {
      for (const p of cat.permissions) {
        if (this.isChecked(cat.id, p.id)) {
          n++;
        }
      }
    }
    return n;
  }

  get totalCount(): number {
    return this.categories.reduce((sum, cat) => sum + cat.permissions.length, 0);
  }

  isChecked(categoryId: string, permissionId: string): boolean {
    return !!this.permissions[categoryId]?.[permissionId];
  }

  toggle(categoryId: string, permissionId: string): void {
    if (this.isSystem) {
      return;
    }
    if (!this.permissions[categoryId]) {
      this.permissions[categoryId] = {};
    }
    this.permissions[categoryId][permissionId] = !this.permissions[categoryId][permissionId];
  }

  categoryAllSelected(cat: RolePermissionCategory): boolean {
    return cat.permissions.every((p) => this.isChecked(cat.id, p.id));
  }

  categorySomeSelected(cat: RolePermissionCategory): boolean {
    if (this.categoryAllSelected(cat)) {
      return false;
    }
    return cat.permissions.some((p) => this.isChecked(cat.id, p.id));
  }

  toggleCategoryAll(cat: RolePermissionCategory): void {
    if (this.isSystem) {
      return;
    }
    const turnOn = !this.categoryAllSelected(cat);
    this.permissions[cat.id] = turnOn ? fullCategoryPerms(cat) : emptyCategoryPerms(cat);
  }

  toggleSelectAll(): void {
    if (this.isSystem) {
      return;
    }
    const turnOn = !this.allSelected;
    for (const cat of this.categories) {
      this.permissions[cat.id] = turnOn ? fullCategoryPerms(cat) : emptyCategoryPerms(cat);
    }
  }

  cancel(): void {
    this.router.navigate(['/settings/roles-and-permissions']);
  }

  save(): void {
    if (!this.canSave) {
      return;
    }
    this.router.navigate(['/settings/roles-and-permissions']);
  }
}
