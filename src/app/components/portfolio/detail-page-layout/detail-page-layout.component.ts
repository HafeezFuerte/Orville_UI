import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  TemplateRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DetailTab } from '../../../shared/models/detail-tab.model';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { ReusableModalComponent } from '../reusable-modal/reusable-modal.component';
import { CommonAreaPopupComponent } from '../../child-tables/modal-popups/common-area-popup/common-area-popup.component';
import { AttachmentPopupComponent } from '../../child-tables/modal-popups/attachments-popup/attachment-popup.component';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NotesPopupComponent } from '../../child-tables/modal-popups/notes-popup/notes-popup.component';
import { ConfirmPopupComponent } from '../popups/confirm-dialog/confirm-dialog';
import { ToastrService } from 'ngx-toastr';
import { FilterDrawerComponent } from '../../../shared/components/filter-drawer/filter-drawer.component';
@Component({
  selector: 'app-detail-page-layout',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterModule, SharedTableComponent, ReusableModalComponent, CommonAreaPopupComponent,AttachmentPopupComponent,ConfirmPopupComponent, TranslateModule, NotesPopupComponent, FilterDrawerComponent],
  templateUrl: './detail-page-layout.component.html'
})
export class DetailPageLayoutComponent {
  @Input() tabs: DetailTab[] = [];
  @Input() activeTab = '';
  @Output() notify_edit_action = new EventEmitter<string>();
  @Output() search_on_child_grid = new EventEmitter<string>();
  @Output() saveClick = new EventEmitter<string>();
  @Output() activeTabChange = new EventEmitter<string>();
  @Output() addClick = new EventEmitter<void>();
  @Output() attachmentFileSelected = new EventEmitter<File[]>();
  @ContentChild('leftPanel')
  leftPanel!: TemplateRef<any>;
  @ContentChild('overview')
  overview!: TemplateRef<any>;
  @ContentChild('units')
  units!: TemplateRef<any>; 
  @ContentChild('notes')
  notes!: TemplateRef<any>; 
  @ContentChild('attachments')
  attachments!: TemplateRef<any>; 
  @ContentChild('commonarea')
  commonarea!: TemplateRef<any>;
  @ContentChild('parkings')
  parkings!: TemplateRef<any>;
  @ContentChild('broadcasts')
  broadcasts!: TemplateRef<any>;
  showModal = false;
  searchQuery: string = '';
  showConfirmModal=false;
  
  isColumnDropdownOpen = false;
  isDrawerOpen = false;

  toggleDrawer(open: boolean) {
    this.isDrawerOpen = open;
  }

  toggleColumnDropdown() {
    this.isColumnDropdownOpen = !this.isColumnDropdownOpen;
  }

  get visibleColumns() {
    const cols = this.selectedTab?.columns || [];
    return cols.filter((c: any) => c.visible !== false);
  }

  toggleColumn(col: any) {
    col.visible = !(col.visible !== false);
  }

  toggleAllColumns(event: any) {
    const isChecked = event.target.checked;
    const cols = this.selectedTab?.columns || [];
    cols.forEach((c: any) => c.visible = isChecked);
  }

  get allColumnsVisible() {
    const cols = this.selectedTab?.columns || [];
    if (!cols.length) return false;
    return cols.every((c: any) => c.visible !== false);
  }

  constructor( 
    private toastr:ToastrService) {
  
  }
  openModal() {
    this.showModal = true;
  }
  handleChildNotification(selectedObject: any) {
     
    if(selectedObject){
      selectedObject.tab_name=this.activeTab;
      if(selectedObject.action_name=="delete"){
        this.showConfirmModal=true; 
      }
      else{
        this.showModal = true;   
        this.notify_edit_action.emit(selectedObject);
      }
    }
  }
  search_with_keyword(){
    this.search_on_child_grid.emit(this.searchQuery); 
  }
  closeModal() {
    this.showModal = false;
  }
  ngOnInit() {
    if (!this.activeTab && this.tabs.length) {
      this.activeTab = this.tabs[0].key;
    }
  }
  checkCommonTab(){
    return this.selectedTab?.key!='units' && 
    this.selectedTab?.key!='notes' && 
    this.selectedTab?.key!='attachments' && 
    this.selectedTab?.key!='commonarea'&& 
    this.selectedTab?.key!='parkings' && 
    this.selectedTab?.key!='rooms' && 
    this.selectedTab?.key!='broadcasts'
  }
  changeTab(tab: DetailTab) {
    this.activeTab = tab.key;
    this.activeTabChange.emit(tab.key);
  }

  get selectedTab(): DetailTab | undefined {
  const tab = this.tabs.find(t => t.key === this.activeTab);
  return tab;
}

  onAddClick() {
    this.addClick.emit();
  }
  onSave() {
    this.saveClick.emit(this.selectedTab?.key ?? '');
  }

  // Filter Drawer State Variables
  filterTags: string = '';
  filterArea: string = '';
  filterId: string = '';
  filterRefNo: string = '';
  filterOffPlanStatus: string = '';
  filterLandlord: string = '';
  filterInternalStatus: string = '';

  applyFilters() {
    // For now, emit search query or handle locally
    this.search_on_child_grid.emit(this.filterId || this.filterArea || this.filterTags); 
  }

  clearFilters() {
    this.filterTags = '';
    this.filterArea = '';
    this.filterId = '';
    this.filterRefNo = '';
    this.filterOffPlanStatus = '';
    this.filterLandlord = '';
    this.filterInternalStatus = '';
    this.applyFilters();
  }
}
