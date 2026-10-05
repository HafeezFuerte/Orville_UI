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
  isAssigning:boolean=false;
  assigningKind = '';
  searchKeyword = '';
  unitSearch = '';
  propertySearch = '';
  reportSearch = '';
  loginSearch = '';

  selectedUnitIds = new Set<string>();
  selectedPropertyIds = new Set<string>();
  selectedReportIds = new Set<string>();
  selectedRecords = new Set<string>();

  editId:any='';
  pageNo = 0;
  pageSize = 10;
  pageSizeOptions = [10, 20, 25, 50];
  loginPageNo = 0;
  loginPageSize = 20;

  units: any=[];
  assigned_units: any=[];
  assigned_properties:any=[];
  properties:any=[];
  assigned_reports:any=[];
  reports: any=[];
  logins: any=[];

  unitColumns = [
    { key: 'select', label: '', visible: true, useTemplate: true, width: '48px' },
    { key: 'name', label: 'Unit', visible: true, useTemplate: true },
    { key: 'property', label: 'Property', visible: true },
    { key: 'landlord', label: 'Landlords', visible: true },
  ];

  propertyColumns = [
    { key: 'select', label: '', visible: true, useTemplate: true, width: '48px' },
    { key: 'name', label: 'Property', visible: true, useTemplate: true },
    { key: 'units', label: 'Units', visible: true },
  ];

  reportColumns = [
    { key: 'select', label: '', visible: true, useTemplate: true, width: '48px' },
    { key: 'name', label: 'Name', visible: true },
    { key: 'type', label: 'Type', visible: true, useTemplate: true },
  ];

  loginColumns = [
    { key: 'login_dt', label: 'Login Time', visible: true },
    { key: 'ipAddress', label: 'IP Address', visible: true },
    { key: 'device_type', label: 'Device Type', visible: true, useTemplate: true },
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
        if (res.statusCode == 200 && res.objResult && res.objResult.users) {  
          var temp=res.objResult.users[0] || {}; 
          if(temp){
            this.user= temp;
          }
          if(res.objResult.assign_units){
            this.assigned_units=res.objResult.assign_units || [];
          }
          if(res.objResult.assign_properties){
            this.assigned_properties=res.objResult.assign_properties || [];
          }
          if(res.objResult.login_info){
            this.logins=res.objResult.login_info || [];
          }
         
        }
        else
        this.toastr.error("No record[s] found");
      },
      error: (err) => {
        
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
          if(filterId==3){
            this.units = this.units.filter((x:any) =>
              !this.assigned_units.some((y:any) => y.code === x.code)
            );
          }
          if(filterId==2){
            this.properties = this.properties.filter((x:any) =>
              !this.assigned_properties.some((y:any) => y.code === x.code)
            );
          }
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
    this.loadLookup(70,3,'units','');
    this.loadLookup(70,2,'properties','');
  }

  get dash(): string {
    return '—';
  }

  get unitsCountLabel(): string {
    return `${this.assigned_units?.length} unit(s) assigned to this user`;
  }
  CountLabel(kind: string): string { 
    if (kind == "Units")
      return `${this.assigned_units?.length} unit(s) assigned to this user`;
    else if (kind == "Properties")
      return `${this.assigned_properties?.length} properties(s) assigned to this user`;
    else
      return `${this.assigned_reports?.length} report(s) assigned to this user`;
  }

  get propertiesCountLabel(): string {
    return `${this.assigned_properties.length} property(s) assigned to this user`;
  }

  get reportsCountLabel(): string {
    return `${this.assigned_reports.length} report(s) assigned to this user`;
  }

  get loginsCountLabel(): string {
    return `${this.filteredLogins.length} login record(s) for ${this.user.name}`;
  }
  filteredList(list: any, strType: string) {
    const q = this.searchKeyword.trim().toLowerCase();
    if (!q) {
      return list;
    }
    if (strType == "Units") {
      return this.units.filter(
        (r: any) =>
          r.name.toLowerCase().includes(q) ||
          r.property.toLowerCase().includes(q)  
      );
    }
    else if (strType=="Properties"){
      return this.properties.filter((r:any) => r.name.toLowerCase().includes(q));
    }
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
    return this.properties.filter((r:any) => r.property.toLowerCase().includes(q));
  }

  get filteredReports(): UserAssignedReport[] {
    const q = this.reportSearch.trim().toLowerCase();
    if (!q) {
      return this.reports;
    }
    return this.reports.filter(
      (r:any) => r.name.toLowerCase().includes(q) || r.type.toLowerCase().includes(q)
    );
  }

  get filteredLogins(): UserLoginRow[] {
    const q = this.loginSearch.trim().toLowerCase();
    if (!q) {
      return this.logins;
    }
    return this.logins.filter(
      (r:any) =>
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
    return this.selectedRecords.size > 0;
  }

  get hasrecordSelected(): boolean {
    return this.selectedRecords.size > 0;
  }
  setTab(tab: UserDetailTab): void {
    this.activeTab = tab;
    this.isAssigning=false;
    this.pageNo = 0;
    this.loginPageNo = 0;
    this.showActions = false;
  }

  onSearch(): void {
    this.pageNo = 0;
    this.loginPageNo = 0;
  }

  toggleRecord(id: string, checked: boolean): void {
    if (checked) {
      this.selectedRecords.add(id);
    } else {
      this.selectedRecords.delete(id);
    }
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
  isRecordSelected(id: string): boolean {
    return this.selectedRecords.has(id);
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
  backlist():void{
    this.isAssigning=false;
    this.assigningKind='';
  }
  editUser(): void {
    void this.router.navigate(['/settings/users-and-admins/edit',this.editId]);
  }

  toggleActions(event: Event): void {
    event.stopPropagation();
    this.showActions = !this.showActions;
  }

  assignAction(kind: string): void {
    this.isAssigning=true;
    this.assigningKind=kind;
    //this.toastr.info(`${kind} assignment is presentation only.`, 'User Details');
  }
  saveassignlist(kind: string,flg:number){
    if(flg==0 && this.selectedRecords.size==0){
      this.toastr.error("Invalid selection");
      return;
    }
    else{ 
      let filterid = kind=="Units"?1 : kind=="Properties" ? 2 :3;
      if(flg==0)
        this._v23(92,filterid,this.selectedRecords);
      else 
        this._v23(94,filterid,[]);
    }
  }
  _v23(typeid:number,filter:number,selectedlist:any){
    this.commontabservice.getMasterByType({
      typeId: typeid,
      filterId: filter,
      filterText: this.editId,
      filterText1: Array.from(selectedlist).join(',')
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult) {  
           this.toastr.success("Successfully saved");
          setTimeout(() => {
            window.location.reload()
          }, 2000);
           return;
        }
        
      },
      error: (err) => {
     
      }
    });
  }
  unassignAction(kind: 'units' | 'properties' | 'reports'): void {
    if (kind === 'units' && this.hasUnitSelection) {
      this._v23(93,1,this.selectedUnitIds); 
      // this.units = this.units.filter((u:any) => !this.selectedUnitIds.has(u.code));
      // this.selectedUnitIds.clear();
      // this.toastr.success('Selected units unassigned (presentation).', 'User Details');
      return;
    }
    if (kind === 'properties' && this.hasPropertySelection) {
      this._v23(93,2,this.selectedPropertyIds); 
      // this.properties = this.properties.filter((p:any) => !this.selectedPropertyIds.has(p.id));
      // this.selectedPropertyIds.clear();
      // this.toastr.success('Selected properties unassigned (presentation).', 'User Details');
      return;
    }
    if (kind === 'reports' && this.hasReportSelection) {
      this._v23(93,3,this.selectedReportIds); 
      // this.reports = this.reports.filter((r:any) => !this.selectedReportIds.has(r.id));
      // this.selectedReportIds.clear();
      // this.toastr.success('Selected reports unassigned (presentation).', 'User Details');
      return;
    }
    this.toastr.info('Select rows to unassign.', 'User Details');
  }

  @HostListener('document:click')
  onDocClick(): void {
    this.showActions = false;
  }
}
