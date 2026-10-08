import { TranslateModule } from '@ngx-translate/core';
import { Component, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {
  BULK_ASSIGN_UNITS,
  BULK_ASSIGN_USERS,
  BulkAssignUnitRow,
  BulkAssignUserOption,
} from './bulk-assign-properties.data';
import { Common_TabsService } from '../../portfolio/services/common_tabs.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-bulk-assign-properties',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './bulk-assign-properties.component.html',
})
export class BulkAssignPropertiesComponent {
  searchQuery = '';
  userSearchQuery = '';
  selectedUserIds: string[] = [];
  selectedUnitIds = new Set<string>();
  pageSize = 10;
  currentPage = 1;
  assignMessage = '';
  usersDropdownOpen = false;

  users:any =[];
  units:any=[];

  readonly columns = [
    { key: 'property', label: 'Property', visible: true },
    { key: 'name', label: 'Unit', visible: true },
    { key: 'landlord', label: 'Landlords', visible: true },
    { key: 'beds', label: 'Beds', visible: true },
  ];

  showFilters = false;
  showColumns = false;
  landlordFilter = '';
  currentUser = this.commonservice.getCurrentUser();
  constructor(private readonly host: ElementRef<HTMLElement>,private toastr:ToastrService,private commontabservice: Common_TabsService,private commonservice:CommonService) {}
  ngOnInit(): void {
    this.loadLookup(70,6,'users','');  
    this.loadLookup(70,3,'units','');  
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
  get filteredUsers() {
    const q = this.userSearchQuery.trim().toLowerCase();
    if (!q) {
      return this.users;
    }
    return this.users.filter(
      (u:any) => u.name?.toLowerCase().includes(q) || u.email_address?.toLowerCase().includes(q)
    );
  }

  get selectedUsers() {
    return this.users.filter((u:any) => this.selectedUserIds.includes(u.code));
  }

  get usersTriggerLabel(): string {
    const n = this.selectedUserIds.length;
    if (n === 0) {
      return 'Select users';
    }
    if (n === 1) {
      return this.selectedUsers[0]?.name ?? '1 user selected';
    }
    return `${n} users selected`;
  }

  get filteredUnits() {
    const q = this.searchQuery.trim().toLowerCase();
    return this.units.filter((row:any) => {
      if (this.landlordFilter && row.landlords !== this.landlordFilter) {
        return false;
      }
      if (!q) {
        return true;
      }
      return (
        row.property.toLowerCase().includes(q) ||
        row.name.toLowerCase().includes(q) ||
        row.landlord?.toLowerCase().includes(q) 
      );
    });
  }

  get totalRecords(): number {
    return this.filteredUnits.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalRecords / this.pageSize));
  }

  get pagedUnits(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredUnits.slice(start, start + this.pageSize);
  }

  get rangeStart(): number {
    if (this.totalRecords === 0) {
      return 0;
    }
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get rangeEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }

  get selectedCount(): number {
    return this.selectedUnitIds.size;
  }

  get visibleColumnCount(): number {
    return this.columns.filter((c) => c.visible).length;
  }

  get allPageSelected(): boolean {
    const page = this.pagedUnits;
    return page.length > 0 && page.every((row) => this.selectedUnitIds.has(row.code));
  }

  get somePageSelected(): boolean {
    if (this.allPageSelected) {
      return false;
    }
    return this.pagedUnits.some((row) => this.selectedUnitIds.has(row.code));
  }

  get canAssign(): boolean {
    return this.selectedUserIds.length > 0 && this.selectedUnitIds.size > 0;
  }

  get landlordOptions(): string[] {
    return []//[...new Set(this.units.map((u:any) => u?.landlord))];
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (!target) {
      return;
    }
    const root = this.host.nativeElement;

    if (this.usersDropdownOpen) {
      const picker = root.querySelector('[data-users-picker]');
      if (picker && !picker.contains(target)) {
        this.closeUsersDropdown();
      }
    }

    if (this.showFilters) {
      const filters = root.querySelector('[data-filters-dropdown]');
      if (filters && !filters.contains(target)) {
        this.showFilters = false;
      }
    }

    if (this.showColumns) {
      const columns = root.querySelector('[data-columns-dropdown]');
      if (columns && !columns.contains(target)) {
        this.showColumns = false;
      }
    }
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
    if (this.showFilters) {
      this.showColumns = false;
      this.closeUsersDropdown();
    }
  }

  toggleColumns(): void {
    this.showColumns = !this.showColumns;
    if (this.showColumns) {
      this.showFilters = false;
      this.closeUsersDropdown();
    }
  }

  isColumnVisible(key: string): boolean {
    return !!this.columns.find((c) => c.key === key)?.visible;
  }

  isSelected(id: string): boolean {
    return this.selectedUnitIds.has(id);
  }

  isUserSelected(id: string): boolean {
    return this.selectedUserIds.includes(id);
  }

  toggleUsersDropdown(): void {
    this.usersDropdownOpen = !this.usersDropdownOpen;
    if (this.usersDropdownOpen) {
      this.userSearchQuery = '';
      this.showFilters = false;
      this.showColumns = false;
    }
  }

  closeUsersDropdown(): void {
    this.usersDropdownOpen = false;
    this.userSearchQuery = '';
  }

  toggleUser(id: string): void {
    if (this.selectedUserIds.includes(id)) {
      this.selectedUserIds = this.selectedUserIds.filter((x) => x !== id);
    } else {
      this.selectedUserIds = [...this.selectedUserIds, id];
    }
    this.assignMessage = '';
  }

  removeUser(id: string, event?: Event): void {
    event?.stopPropagation();
    this.selectedUserIds = this.selectedUserIds.filter((x) => x !== id);
    this.assignMessage = '';
  }

  toggleUnit(id: string): void {
    if (this.selectedUnitIds.has(id)) {
      this.selectedUnitIds.delete(id);
    } else {
      this.selectedUnitIds.add(id);
    }
    this.selectedUnitIds = new Set(this.selectedUnitIds);
    this.assignMessage = '';
  }

  toggleSelectAllPage(): void {
    const page = this.pagedUnits;
    if (this.allPageSelected) {
      for (const row of page) {
        this.selectedUnitIds.delete(row.id);
      }
    } else {
      for (const row of page) {
        this.selectedUnitIds.add(row.id);
      }
    }
    this.selectedUnitIds = new Set(this.selectedUnitIds);
    this.assignMessage = '';
  }

  onSearchChange(): void {
    this.currentPage = 1;
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
  }

  assign(): void {
    if (!this.canAssign) {
      return;
    }
    const userNames = this.users
      .filter((u:any) => this.selectedUserIds.includes(u.code))
      .map((u:any) => u.name)
      .join(', ');
    this.assignMessage = `Assigned ${this.selectedCount} unit(s) to ${userNames}.`;
    this.selectedUserIds.forEach((element:any) => {
       this._v23(92,1,this.selectedUnitIds,element);
    });
    setTimeout(() => {
      window.location.reload()
      this.selectedUnitIds = new Set(); 
    }, 5000);
   

  }
  _v23(typeid:number,filter:number,selectedlist:any,user_code:string){
    this.commontabservice.getMasterByType({
      typeId: typeid,
      filterId: filter,
      filterText: user_code,
      filterText1: Array.from(selectedlist).join(',')
    }).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200 && res.objResult && res.objResult) {    
           return;
        }
        
      },
      error: (err) => {
     
      }
    });
  }
}
