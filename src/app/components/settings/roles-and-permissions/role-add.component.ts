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
import { NgSelectModule } from '@ng-select/ng-select';
import { Common_TabsService } from '../../portfolio/services/common_tabs.service';
import { CommonService } from '../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-role-add',
  standalone: true,
  imports: [CommonModule,NgSelectModule, FormsModule],
  templateUrl: './role-add.component.html',
})
export class RoleAddComponent implements OnInit {
   
  editId :string | null = null;
  currentUser = this.commonservice.getCurrentUser();
  roleName = '';
  isSystem = false; 
  roleFilter='';
  roleOptions :any=[];
  //readonly categories = ROLE_PERMISSION_CATEGORIES;
  categories :any=[];
  permissions :any=[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private commontabservice:Common_TabsService,
    private commonservice:CommonService,
    private toastr:ToastrService,
    private settingservice:SettingsService
  ) {}
  createEmptyRolePermissions(): Record<string, Record<string, boolean>> {
    const map: Record<string, Record<string, boolean>> = {};
    for (const cat of this.categories) {
      map[cat.MenuId] = {};
      for (const p of cat.Actions) {
        map[cat.MenuId][p.Key] = false;
      }
    }
    return map;
  }
  fillRolePermissions(store_perms:any): Record<string, Record<string, boolean>> {
    const map: Record<string, Record<string, boolean>> = {};
    for (const cat of store_perms) {
      map[cat.MenuId] = {};
      for (const p of cat.Actions) {
        map[cat.MenuId][p.Key] = p.Value ==1 ?true :false;
      }
    }
    return map;
  }
  ngOnInit(): void {
    this.loadLookup(2,3005,'roleOptions',''); 
    this.route.paramMap.subscribe((params) => {
      this.editId=params.get('code'); 
      if(this.editId)
         this.loadLookup(42,0,'',this.editId);  
    });   
  }
  loadLookup(Typeid:number,filterId: number, targetProperty: string, filterText: string) {
    this.commontabservice.getMasterByType({
      typeId: Typeid,
      filterId: filterId,
      filterText: filterText,
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult) {  
          if(Typeid==42){ 
            let temp=res.objResult.table[0] || {};
            this.roleName = temp.name;
            this.roleFilter = temp.code;
            this.isSystem = temp.issystem_role;
            this.permissions =this.fillRolePermissions(JSON.parse(temp.permissions));
          }
          else {
          (this as any)[targetProperty] = res.objResult.table; 
          if(res.objResult.table1){
            this.categories=JSON.parse(res.objResult.table1[0].permissions) || '';
            if(this.editId=='' || this.editId==null)
            this.permissions=this.createEmptyRolePermissions();
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

  get allSelected(): boolean {
    return this.categories.every((cat:any) => this.categoryAllSelected(cat));
  }

  get someSelected(): boolean {
    if (this.allSelected) {
      return false;
    }
    return this.categories.some((cat:any) =>
      cat.Actions.some((p:any) => this.isChecked(cat.MenuId, p.Key))
    );
  }

  get selectedCount(): number {
    let n = 0;
    for (const cat of this.categories) {
      for (const p of cat.Actions) {
        if (this.isChecked(cat.MenuId, p.Key)) {
          n++;
        }
      }
    }
    return n;
  }

  get totalCount(): number {
    return this.categories.reduce((sum:any, cat:any) => sum + cat.Actions.length, 0);
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

  categoryAllSelected(cat: any): boolean {
    return cat.Actions.every((p:any) => this.isChecked(cat.MenuId, p.Key));
  }

  categorySomeSelected(cat: any): boolean {
    if (this.categoryAllSelected(cat)) {
      return false;
    }
    return cat.Actions.some((p:any) => this.isChecked(cat.MenuId, p.Key));
  }

  toggleCategoryAll(cat: any): void {
    if (this.isSystem) {
      return;
    } 
    const turnOn = !this.categoryAllSelected(cat);
    this.permissions[cat.MenuId] = turnOn ? this.fullCategory(cat,true) : this.fullCategory(cat,false);
  }
  fullCategory(cat: any,flg:boolean) {
    const out: Record<string, boolean> = {};
    for (const p of cat.Actions) {
      out[p.Key] = flg;
    }
    return out;
  }

  toggleSelectAll(): void {
    if (this.isSystem) {
      return;
    }
    const turnOn = !this.allSelected;
    for (const cat of this.categories) {
      this.permissions[cat.MenuId] = turnOn ? fullCategoryPerms(cat) : emptyCategoryPerms(cat);
    }
  }

  cancel(): void {
    this.router.navigate(['/settings/roles-and-permissions']);
  }

  save(): void {
    if (!this.canSave) {
      return;
    }
    if(this.permissions){ 
      for (const cat of this.categories) { 
        for (const ac of cat.Actions) {
          ac.Value=this.permissions[cat.MenuId][ac.Key] ? 1:0 
        } 
      }
      
    const requestJson = {
      userid: this.currentUser?.userId || 1,
      company_id:this.currentUser?.companyId || 1,
      clientId: this.currentUser?.clientId,
      source: 'web',
      languageid: 1, 
      role_name: this.roleName, 
      code: this.editId ?? '', 
      role_code: this.roleFilter || '',
      permissions:JSON.stringify(this.categories), 
    };   
    this.settingservice.saveRole(requestJson).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 || res.statusCode == "200") { 

          this.toastr.success(this.editId ? 'Role updated successfully!' : 'Role saved successfully!', 'Success');
          this.router.navigate(['/settings/roles-and-permissions']); 
        } else {
          this.toastr.error(res.message || 'Failed to save technician.', 'Error');
        }
      },
      error: (err: any) => {
        console.error('Error saving role:', err);
        this.toastr.error('Server error encountered while saving.', 'Error');
      }
    });
    }
    
  }
}
