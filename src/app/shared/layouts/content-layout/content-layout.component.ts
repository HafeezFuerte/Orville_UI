import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Menu, NavService } from '../../services/nav.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-content-layout',
    templateUrl: './content-layout.component.html',
    styleUrl: './content-layout.component.scss',
})
export class ContentLayoutComponent {
  public menuItems!: Menu[];

  constructor(
    public navServices: NavService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private router: Router
  ) {
    this.navServices.items.subscribe((menuItems: any) => {
      this.menuItems = menuItems;
    });

    // 🟢 Reset scroll to top on every navigation end
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      window.scrollTo(0, 0);
      // Optional: If there's a specific scrollable div, scroll that too
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.scrollTo(0, 0);
      }
    });
  }
  clearToggle() {
    let html = this.elementRef.nativeElement.ownerDocument.documentElement;
    html?.setAttribute('data-toggled', 'close');
    document.querySelector('#responsive-overlay')?.classList.remove('active');
  }
  togglesidemenuBody() {
    if(localStorage.getItem('ynex-sidemenu-styles') == 'icontext'){
      document.documentElement.removeAttribute('icon-text');
    }
    if (document.documentElement.getAttribute('data-nav-layout') == 'horizontal' && window.innerWidth > 992) {
      this.closeMenu();
    }
    let html = this.elementRef.nativeElement.ownerDocument.documentElement;
    if (window.innerWidth <= 992) {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'close' ? 'close' : 'close'
      );
    }
  }
  closeMenu() {
    this.menuItems?.forEach((a: any) => {
      if (this.menuItems) {
        a.active = false;
      }
      a?.children?.forEach((b: any) => {
        if (a.children) {
          b.active = false;
        }
      });
    });
  }
}