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
import { CommonAreaPopupComponent } from '../popups/common-area-popup/common-area-popup.component';
import { AttachmentPopupComponent } from '../popups/attachments-popup/attachment-popup.component';
import { TranslateModule } from '@ngx-translate/core';
import { NotesPopupComponent } from '../popups/notes-popup/notes-popup.component';
import { ConfirmPopupComponent } from '../popups/confirm-dialog/confirm-dialog';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-detail-page-layout',
  standalone: true,
  imports: [FormsModule,CommonModule, SharedTableComponent, ReusableModalComponent, CommonAreaPopupComponent,AttachmentPopupComponent,ConfirmPopupComponent, TranslateModule, NotesPopupComponent],
  templateUrl: './detail-page-layout.component.html'
})
export class DetailPageLayoutComponent {
  @Input() tabs: DetailTab[] = [];
  @Input() activeTab = '';
  @Output() notify_edit_action = new EventEmitter<string>();
  @Output() saveClick = new EventEmitter<string>();
  @Output() activeTabChange = new EventEmitter<string>();
  @Output() addClick = new EventEmitter<void>();
  @Output() attachmentFileSelected = new EventEmitter<File[]>();
  @ContentChild('leftPanel')
  leftPanel!: TemplateRef<any>;
  @ContentChild('overview')
  overview!: TemplateRef<any>;
  showModal = false;
  searchQuery: string = '';
  showConfirmModal=false;
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

  }
  closeModal() {
    this.showModal = false;
  }
  ngOnInit() {
    if (!this.activeTab && this.tabs.length) {
      this.activeTab = this.tabs[0].key;
    }
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
}
