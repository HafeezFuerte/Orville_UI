import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DEFAULT_MOBILE_APP_CONFIGURATION,
  MOBILE_APP_TABS,
  MobileAppAudience,
  MobileAppConfigurationModel,
} from './mobile-app-configuration.data';

@Component({
  selector: 'app-mobile-app-configuration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mobile-app-configuration.component.html',
  styleUrl: './mobile-app-configuration.component.scss',
})
export class MobileAppConfigurationComponent {
  activeTab: MobileAppAudience = 'tenant';
  model: MobileAppConfigurationModel = {
    tenant: { ...DEFAULT_MOBILE_APP_CONFIGURATION.tenant },
    landlord: { ...DEFAULT_MOBILE_APP_CONFIGURATION.landlord },
    vendor: { ...DEFAULT_MOBILE_APP_CONFIGURATION.vendor },
  };
  saved = false;
  private savedTimer: ReturnType<typeof setTimeout> | null = null;

  readonly tabs = MOBILE_APP_TABS;

  get activeTabMeta() {
    return this.tabs.find((t) => t.id === this.activeTab) ?? this.tabs[0];
  }

  setTab(id: MobileAppAudience): void {
    this.activeTab = id;
  }

  save(): void {
    this.saved = true;
    if (this.savedTimer) {
      clearTimeout(this.savedTimer);
    }
    this.savedTimer = setTimeout(() => {
      this.saved = false;
    }, 2500);
  }
}
