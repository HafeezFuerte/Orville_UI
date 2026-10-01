import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { SettingsUserRow } from './users-and-admins.data';
import { Common_TabsService } from '../../portfolio/services/common_tabs.service';
import { CommonService } from '../../../services/common.service';
import {
  FAHAD_DETAIL,
  USER_ASSIGNED_PROPERTIES,
  USER_ASSIGNED_REPORTS,
  USER_ASSIGNED_UNITS,
  USER_DETAIL_TABS,
  USER_LOGIN_HISTORY,
  UserAssignedProperty,
  UserAssignedReport,
  UserAssignedUnit,
  UserDetailProfile,
  UserDetailTab,
  UserLoginRow,
  findSettingsUser,
  getUserDetailProfile,
} from './user-detail.data';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SharedTableComponent],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  readonly tabs = USER_DETAIL_TABS;
  activeTab: UserDetailTab = 'units';
  showActions = false;

  user: any ={};
  profile: UserDetailProfile = getUserDetailProfile(FAHAD_DETAIL.id);

  unitSearch = '';
  propertySearch = '';
  reportSearch = '';
  loginSearch = '';

  selectedUnitIds = new Set<string>();
  selectedPropertyIds = new Set<string>();
  selectedReportIds = new Set<string>();

  editId:any='';
  pageNo = 0;
  pageSize = 10;
  pageSizeOptions = [10, 20, 25, 50];
  loginPageNo = 0;
  loginPageSize = 20;

  private units: any=[];
  private properties: UserAssignedProperty[] = [...USER_ASSIGNED_PROPERTIES];
  private reports: UserAssignedReport[] = [...USER_ASSIGNED_REPORTS];
  private logins: UserLoginRow[] = [...USER_LOGIN_HISTORY];

  unitColumns = [
    { key: 'select', label: '', visible: true, useTemplate: true, width: '48px' },
    { key: 'unit', label: 'Unit', visible: true, useTemplate: true },
    { key: 'property', label: 'Property', visible: true },
    { key: 'landlords', label: 'Landlords', visible: true },
  ];

  propertyColumns = [
    { key: 'select', label: '', visible: true, useTemplate: true, width: '48px' },
    { key: 'property', label: 'Property', visible: true },
    { key: 'units', label: 'Units', visible: true },
  ];

  reportColumns = [
    { key: 'select', label: '', visible: true, useTemplate: true, width: '48px' },
    { key: 'name', label: 'Name', visible: true },
    { key: 'type', label: 'Type', visible: true, useTemplate: true },
  ];

  loginColumns = [
    { key: 'loginTime', label: 'Login Time', visible: true },
    { key: 'ipAddress', label: 'IP Address', visible: true },
    { key: 'deviceType', label: 'Device Type', visible: true, useTemplate: true },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private commontabservice:Common_TabsService,
    private commonservice: CommonService
  ) {}

  getInitials(name: string): string {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    return parts[0].charAt(0) + (parts.length > 1 ? parts[1].charAt(0) : '');
  }
  getUserDetails(Typeid:number,filterId: number, targetProperty: string, filterText: string) {
    this.commontabservice.getMasterByType({
      typeId: Typeid,
      filterId: filterId,
      filterText: filterText,
      filterText1: ''
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult.table) {  
          var temp=res.objResult.table[0] || {}; 
          if(temp){
            this.user= temp;
          }
         
        }
        else
        this.toastr.error("No record[s] found");
      },
      error: (err) => {
        console.error(`Error fetching lookup ${filterId}:`, err);
      }
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
          (this as any)[targetProperty] = res.objResult.table;
        }
        
      },
      error: (err) => {
        console.error(`Error fetching lookup ${filterId}:`, err);
      }
    });
  }

  ngOnInit(): void {
     
    this.route.paramMap.subscribe((params) => {
      this.editId=params.get('code'); 
      if(this.editId)
      this.getUserDetails(91,0, '', this.editId);
    });  
    this.loadLookup(70,2,'units','');
  }

  get dash(): string {
    return '—';
  }

  get unitsCountLabel(): string {
    return `${this.filteredUnits.length} unit(s) assigned to this user`;
  }

  get propertiesCountLabel(): string {
    return `${this.filteredProperties.length} property(s) assigned to this user`;
  }

  get reportsCountLabel(): string {
    return `${this.filteredReports.length} report(s) assigned to this user`;
  }

  get loginsCountLabel(): string {
    return `${this.filteredLogins.length} login record(s) for ${this.user.name}`;
  }

  get filteredUnits(): UserAssignedUnit[] {
    const q = this.unitSearch.trim().toLowerCase();
    if (!q) {
      return this.units;
    }
    return this.units.filter(
      (r:any) =>
        r.unit.toLowerCase().includes(q) ||
        r.property.toLowerCase().includes(q) ||
        r.landlords.toLowerCase().includes(q)
    );
  }

  get filteredProperties(): UserAssignedProperty[] {
    const q = this.propertySearch.trim().toLowerCase();
    if (!q) {
      return this.properties;
    }
    return this.properties.filter((r) => r.property.toLowerCase().includes(q));
  }

  get filteredReports(): UserAssignedReport[] {
    const q = this.reportSearch.trim().toLowerCase();
    if (!q) {
      return this.reports;
    }
    return this.reports.filter(
      (r) => r.name.toLowerCase().includes(q) || r.type.toLowerCase().includes(q)
    );
  }

  get filteredLogins(): UserLoginRow[] {
    const q = this.loginSearch.trim().toLowerCase();
    if (!q) {
      return this.logins;
    }
    return this.logins.filter(
      (r) =>
        r.ipAddress.toLowerCase().includes(q) ||
        r.deviceType.toLowerCase().includes(q) ||
        r.loginTime.toLowerCase().includes(q)
    );
  }

  get pagedUnits(): UserAssignedUnit[] {
    const start = this.pageNo * this.pageSize;
    return this.filteredUnits.slice(start, start + this.pageSize);
  }

  get pagedProperties(): UserAssignedProperty[] {
    const start = this.pageNo * this.pageSize;
    return this.filteredProperties.slice(start, start + this.pageSize);
  }

  get pagedReports(): UserAssignedReport[] {
    const start = this.pageNo * this.pageSize;
    return this.filteredReports.slice(start, start + this.pageSize);
  }

  get pagedLogins(): UserLoginRow[] {
    const start = this.loginPageNo * this.loginPageSize;
    return this.filteredLogins.slice(start, start + this.loginPageSize);
  }

  get hasUnitSelection(): boolean {
    return this.selectedUnitIds.size > 0;
  }

  get hasPropertySelection(): boolean {
    return this.selectedPropertyIds.size > 0;
  }

  get hasReportSelection(): boolean {
    return this.selectedReportIds.size > 0;
  }

  setTab(tab: UserDetailTab): void {
    this.activeTab = tab;
    this.pageNo = 0;
    this.loginPageNo = 0;
    this.showActions = false;
  }

  onSearch(): void {
    this.pageNo = 0;
    this.loginPageNo = 0;
  }

  toggleUnit(id: string, checked: boolean): void {
    if (checked) {
      this.selectedUnitIds.add(id);
    } else {
      this.selectedUnitIds.delete(id);
    }
  }

  toggleProperty(id: string, checked: boolean): void {
    if (checked) {
      this.selectedPropertyIds.add(id);
    } else {
      this.selectedPropertyIds.delete(id);
    }
  }

  toggleReport(id: string, checked: boolean): void {
    if (checked) {
      this.selectedReportIds.add(id);
    } else {
      this.selectedReportIds.delete(id);
    }
  }

  isUnitSelected(id: string): boolean {
    return this.selectedUnitIds.has(id);
  }

  isPropertySelected(id: string): boolean {
    return this.selectedPropertyIds.has(id);
  }

  isReportSelected(id: string): boolean {
    return this.selectedReportIds.has(id);
  }

  onTablePage(event: PageEvent): void {
    this.pageNo = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  onLoginPage(event: PageEvent): void {
    this.loginPageNo = event.pageIndex;
    this.loginPageSize = event.pageSize;
  }

  back(): void {
    void this.router.navigate(['/settings/users-and-admins']);
  }

  editUser(): void {
    void this.router.navigate(['/settings/users-and-admins/new'], {
      queryParams: { type: this.user.kind, id: this.user.id },
    });
  }

  toggleActions(event: Event): void {
    event.stopPropagation();
    this.showActions = !this.showActions;
  }

  assignAction(kind: string): void {
    this.toastr.info(`${kind} assignment is presentation only.`, 'User Details');
  }

  unassignAction(kind: 'units' | 'properties' | 'reports'): void {
    if (kind === 'units' && this.hasUnitSelection) {
      this.units = this.units.filter((u:any) => !this.selectedUnitIds.has(u.id));
      this.selectedUnitIds.clear();
      this.toastr.success('Selected units unassigned (presentation).', 'User Details');
      return;
    }
    if (kind === 'properties' && this.hasPropertySelection) {
      this.properties = this.properties.filter((p) => !this.selectedPropertyIds.has(p.id));
      this.selectedPropertyIds.clear();
      this.toastr.success('Selected properties unassigned (presentation).', 'User Details');
      return;
    }
    if (kind === 'reports' && this.hasReportSelection) {
      this.reports = this.reports.filter((r) => !this.selectedReportIds.has(r.id));
      this.selectedReportIds.clear();
      this.toastr.success('Selected reports unassigned (presentation).', 'User Details');
      return;
    }
    this.toastr.info('Select rows to unassign.', 'User Details');
  }

  @HostListener('document:click')
  onDocClick(): void {
    this.showActions = false;
  }
}
