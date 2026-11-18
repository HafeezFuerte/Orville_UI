import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { Common_TabsService } from '../../portfolio/services/common_tabs.service';
import { CommonService } from '../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-role-add',
  standalone: true,
  imports: [CommonModule, NgSelectModule, FormsModule],
  templateUrl: './role-add.component.html',
})
export class RoleAddComponent implements OnInit {
  editId: string | null = null;
  currentUser = this.commonservice.getCurrentUser();
  roleName = '';
  isSystem = false;
  allSelected = false;
  roleFilter = '';
  roleOptions: any[] = [];
  categories: any[] = [];
  permissions: Record<string, Record<string, boolean>> = {};
  rawRolePermissions: any = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private commontabservice: Common_TabsService,
    private commonservice: CommonService,
    private toastr: ToastrService,
    private settingservice: SettingsService
  ) {}

  createEmptyRolePermissions(): Record<string, Record<string, boolean>> {
    const map: Record<string, Record<string, boolean>> = {};
    for (const cat of this.categories) {
      map[cat.MenuId] = {};
      for (const p of (cat.Actions || [])) {
        map[cat.MenuId][p.Key] = false;
      }
    }
    return map;
  }

  fillRolePermissions(store_perms: any): Record<string, Record<string, boolean>> {
    const map: Record<string, Record<string, boolean>> = this.createEmptyRolePermissions();
    if (!store_perms || !Array.isArray(store_perms)) {
      return map;
    }
    for (const cat of store_perms) {
      if (!map[cat.MenuId]) {
        map[cat.MenuId] = {};
      }
      for (const p of (cat.Actions || [])) {
        map[cat.MenuId][p.Key] = p.Value == 1 || p.Value === '1' || p.Value === true;
      }
    }
    return map;
  }

  ngOnInit(): void {
    // 1. Fetch master role types (table) and master permissions template (table1)
    this.loadLookup(2, 3005, 'roleOptions', '');

    // 2. If editing existing role, fetch role details and saved permissions
    this.route.paramMap.subscribe((params) => {
      this.editId = params.get('code');
      if (this.editId) {
        this.loadLookup(42, 0, '', this.editId);
      }
    });
  }

  loadLookup(Typeid: number, filterId: number, targetProperty: string, filterText: string) {
    this.commontabservice.getMasterByType({
      typeId: Typeid,
      filterId: filterId,
      filterText: filterText,
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult) {
          if (Typeid == 42) {
            const temp = res.objResult.table?.[0] || {};
            this.roleName = temp.name || '';
            this.roleFilter = temp.code || '';
            this.isSystem = !!temp.issystem_role;

            try {
              this.rawRolePermissions = typeof temp.permissions === 'string'
                ? JSON.parse(temp.permissions)
                : temp.permissions;
            } catch {
              this.rawRolePermissions = null;
            }

            // If categories master template has already loaded, apply saved permissions
            if (this.categories && this.categories.length > 0) {
              this.permissions = this.fillRolePermissions(this.rawRolePermissions);
              this.updateGlobalSelectionState();
            }
          } else {
            (this as any)[targetProperty] = res.objResult.table || [];
            if (res.objResult.table1 && res.objResult.table1[0]?.permissions) {
              try {
                this.categories = JSON.parse(res.objResult.table1[0].permissions) || [];
              } catch {
                this.categories = [];
              }

              // Apply existing role permissions if already fetched, or default to all-false
              if (this.editId && this.rawRolePermissions) {
                this.permissions = this.fillRolePermissions(this.rawRolePermissions);
              } else {
                this.permissions = this.createEmptyRolePermissions();
              }
              this.updateGlobalSelectionState();
            }
          }
        }
      },
      error: (err) => {
        console.error(`Error fetching lookup ${filterId}:`, err);
      }
    });
  }

  get pageTitle(): string {
    return this.editId == null ? 'New Role' : 'Edit Role';
  }

  get breadcrumb(): string {
    return `Roles and Permissions / ${this.pageTitle}`;
  }

  get canSave(): boolean {
    return this.roleName.trim().length > 0 && !this.isSystem;
  }

  get someSelected(): boolean {
    if (this.allSelected) {
      return false;
    }
    return this.categories.some((cat: any) =>
      (cat.Actions || []).some((p: any) => this.isChecked(cat.MenuId, p.Key))
    );
  }

  get selectedCount(): number {
    let n = 0;
    for (const cat of this.categories) {
      for (const p of (cat.Actions || [])) {
        if (this.isChecked(cat.MenuId, p.Key)) {
          n++;
        }
      }
    }
    return n;
  }

  get totalCount(): number {
    return this.categories.reduce((sum: number, cat: any) => sum + (cat.Actions?.length || 0), 0);
  }

  isChecked(categoryId: string | number, permissionId: string): boolean {
    return !!this.permissions[categoryId]?.[permissionId];
  }

  isCategoryEnabled(cat: any): boolean {
    const actions = cat.Actions || [];
    return actions.some((p: any) => this.isChecked(cat.MenuId, p.Key));
  }

  toggle(categoryId: string | number, permissionId: string): void {
    if (this.isSystem) {
      return;
    }
    if (!this.permissions[categoryId]) {
      this.permissions[categoryId] = {};
    }
    this.permissions[categoryId][permissionId] = !this.permissions[categoryId][permissionId];
    this.updateGlobalSelectionState();
  }

  categoryAllSelected(cat: any): boolean {
    const actions = cat.Actions || [];
    if (actions.length === 0) return false;
    return actions.every((p: any) => this.isChecked(cat.MenuId, p.Key));
  }

  categorySomeSelected(cat: any): boolean {
    if (this.categoryAllSelected(cat)) {
      return false;
    }
    const actions = cat.Actions || [];
    return actions.some((p: any) => this.isChecked(cat.MenuId, p.Key));
  }

  toggleCategoryAll(cat: any): void {
    if (this.isSystem) {
      return;
    }
    const turnOn = !this.categoryAllSelected(cat);
    this.permissions[cat.MenuId] = turnOn ? this.fullCategory(cat, true) : this.fullCategory(cat, false);
    this.updateGlobalSelectionState();
  }

  fullCategory(cat: any, flg: boolean): Record<string, boolean> {
    const out: Record<string, boolean> = {};
    for (const p of (cat.Actions || [])) {
      out[p.Key] = flg;
    }
    return out;
  }

  toggleSelectAll(): void {
    if (this.isSystem) {
      return;
    }
    const turnOn = this.allSelected;
    for (const cat of this.categories) {
      this.permissions[cat.MenuId] = turnOn ? this.fullCategory(cat, true) : this.fullCategory(cat, false);
    }
  }

  updateGlobalSelectionState(): void {
    if (!this.categories || this.categories.length === 0) {
      this.allSelected = false;
      return;
    }
    this.allSelected = this.categories.every((cat: any) => this.categoryAllSelected(cat));
  }

  cancel(): void {
    this.router.navigate(['/settings/roles-and-permissions']);
  }

  save(): void {
    if (!this.canSave) {
      return;
    }

    // Option A formatting:
    // If Value == 1 (at least one action is selected):
    //   Value: 1
    //   Actions: all actions with their respective Value (1 or 0)
    // If Value == 0 (no actions selected / menu inactive):
    //   Value: 0
    //   Actions: [] (empty array, meaning no actions)
    const formattedPermissions = this.categories.map((cat: any) => {
      const actions = cat.Actions || [];
      const hasAnySelected = actions.some((ac: any) => this.isChecked(cat.MenuId, ac.Key));

      if (hasAnySelected) {
        return {
          MenuName: cat.MenuName,
          MenuId: cat.MenuId,
          JsonLabel: cat.JsonLabel,
          Value: 1,
          Actions: actions.map((ac: any) => ({
            Key: ac.Key,
            Value: this.isChecked(cat.MenuId, ac.Key) ? 1 : 0,
            Label: ac.Label,
            JsonLabel: ac.JsonLabel
          }))
        };
      } else {
        return {
          MenuName: cat.MenuName,
          MenuId: cat.MenuId,
          JsonLabel: cat.JsonLabel,
          Value: 0,
          Actions: []
        };
      }
    });

    const requestJson = {
      userid: this.currentUser?.userId || 1,
      company_id: this.currentUser?.companyId || 1,
      clientId: this.currentUser?.clientId,
      source: 'web',
      languageid: 1,
      role_name: this.roleName,
      code: this.editId ?? '',
      role_code: this.roleFilter || '',
      permissions: JSON.stringify(formattedPermissions)
    };

    this.settingservice.saveRole(requestJson).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 || res.statusCode == '200') {
          this.toastr.success(
            this.editId ? 'Role updated successfully!' : 'Role saved successfully!',
            'Success'
          );
          this.router.navigate(['/settings/roles-and-permissions']);
        } else {
          this.toastr.error(res.message || 'Failed to save role.', 'Error');
        }
      },
      error: (err: any) => {
        console.error('Error saving role:', err);
        this.toastr.error('Server error encountered while saving.', 'Error');
      }
    });
  }
}
