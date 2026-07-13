import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  TemplateRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { DetailTab } from '../../models/detail-tab.model';
import { SharedTableComponent } from '../shared-table/shared-table.component';

@Component({
  selector: 'app-detail-page-layout',
  standalone: true,
  imports: [CommonModule, SharedTableComponent],
  templateUrl: './detail-page-layout.component.html'
})
export class DetailPageLayoutComponent {

  @Input() tabs: DetailTab[] = [];

  @Input() activeTab = '';

  @Output() activeTabChange = new EventEmitter<string>();

  @ContentChild('leftPanel')
  leftPanel!: TemplateRef<any>;

  @ContentChild('overview')
  overview!: TemplateRef<any>;

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
  console.log('Selected Tab:', tab);
  return tab;
}

}
