import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MOCK_ROLES, RoleRow } from './roles-and-permissions.data';
import { Common_TabsService } from '../../portfolio/services/common_tabs.service';
import { CommonService } from '../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-roles-and-permissions',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './roles-and-permissions.component.html',
})
export class RolesAndPermissionsComponent {
  searchQuery = '';
  roles: any=[];
  froles: any=[];
  constructor(private router: Router,private commontabservice: Common_TabsService,private toastr:ToastrService) {}
  ngOnInit() { 
    this.loadLookup(42,0,'roles','');  
  }
  filteredRoles() {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      this.roles = this.froles;
    }
    this.roles = this.froles.filter((r:any) => r.name.toLowerCase().includes(q));
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
          if(Typeid==96){
            this.toastr.show("Deleted Successfully"); 
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }
          else{
            (this as any)[targetProperty] = res.objResult.table; 
            this.froles=this.roles;
          }
        } 
      },
      error: (err) => {
        console.error(`Error fetching lookup ${filterId}:`, err);
      }
    });
  }
  get countLabel(): string {
    const n = this.roles.length;
    return `${n} role${n === 1 ? '' : 's'}`;
  }

  openNew(): void {
    this.router.navigate(['/settings/roles-and-permissions/new']);
  }

  openEdit(row: any): void {
    this.router.navigate(['/settings/roles-and-permissions', row.rcode]);
  }

  deleteRole(row: any): void {
    if (row.issystem_role || row.users > 0) {
      return;
    }
    this.loadLookup(96,0,'',row.rcode);  
  }
}
