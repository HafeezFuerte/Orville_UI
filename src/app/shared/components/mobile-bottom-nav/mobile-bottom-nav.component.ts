import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mobile-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mobile-bottom-nav.component.html',
  styleUrl: './mobile-bottom-nav.component.scss',
})
export class MobileBottomNavComponent {
  readonly tabs = [
    { label: 'My day', path: '/dashboard/crm', icon: './assets/images/mobile-chrome/calendar.svg' },
    { label: 'Dashboard', path: '/insights', icon: './assets/images/mobile-chrome/chart-donut.svg' },
    { label: 'Properties', path: '/properties', icon: './assets/images/mobile-chrome/building-community.svg' },
  ];

  openMenu() {
    document.documentElement.setAttribute('data-toggled', 'open');
    document.querySelector('#responsive-overlay')?.classList.add('active');
  }
}
