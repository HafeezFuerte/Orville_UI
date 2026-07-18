import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  TemplateRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { DetailTab } from '../../../shared/models/detail-tab.model';
import { SharedTableComponent } from '../../../shared/components/shared-table/shared-table.component';
import { ReusableModalComponent } from '../reusable-modal/reusable-modal.component';
import { CommonAreaPopupComponent } from '../popups/common-area-popup/common-area-popup.component';
import { AttachmentPopupComponent } from '../popups/attachments-popup/attachment-popup.component';
import { TranslateModule } from '@ngx-translate/core';
import { NotesPopupComponent } from '../popups/notes-popup/notes-popup.component';

@Component({
  selector: 'app-detail-page-layout',
  standalone: true,
  imports: [CommonModule, SharedTableComponent, ReusableModalComponent, CommonAreaPopupComponent,AttachmentPopupComponent, TranslateModule, NotesPopupComponent],
  templateUrl: './detail-page-layout.component.html'
})
export class DetailPageLayoutComponent {
  @Input() tabs: DetailTab[] = [];
  @Input() activeTab = '';
  @Output() saveClick = new EventEmitter<string>();
  @Output() activeTabChange = new EventEmitter<string>();
  @Output() addClick = new EventEmitter<void>();
  @Output() attachmentFileSelected = new EventEmitter<File[]>();
  @ContentChild('leftPanel')
  leftPanel!: TemplateRef<any>;
  @ContentChild('overview')
  overview!: TemplateRef<any>;
  showModal = false;

  openModal() {
    this.showModal = true;
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
