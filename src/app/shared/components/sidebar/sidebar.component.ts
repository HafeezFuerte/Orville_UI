import { Component, ViewChild, ElementRef, Renderer2, HostListener } from '@angular/core';
import { Menu, NavService } from '../../services/nav.service';
import { Subscription, fromEvent } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { checkHoriMenu, switcherArrowFn } from './sidebar';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../../../services/common.service';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '../../../components/common/store/login-auth-params/auth.selectors';
import { buildFigmaSettingsMenuItems } from '../../../components/settings/settings-menu.data';
interface PageMenu {
  menuID: number;
  menuName: string;
  parent_id:number;
  menu_icon: string;
  url: string;
  ModuleId: number;
  IsActive: boolean;
  preOrder: number 
}

interface MenuGroup {
  mainMenuId: number;
  mainMenuName: string;
  pages: PageMenu[];
}

interface Module {
  moduleId: number;
  moduleName: string;
  url: string;
  childCount:number;
  menuGroup: MenuGroup[];
  pages:PageMenu[];
  menu_icon?: string;
  jsonLabel?: string;
}


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})

export class SidebarComponent {
  originalMenuItems: any[] = [];
  createOverlayOpen = false;
  settingsMenuItems: Menu[] = [];
  isSettingsMode = false;
  settingsSearchQuery = '';
  private allSettingsMenuItems: Menu[] = [];
  // Addding sticky-pin
  scrolled = false;
  screenWidth: number;
  eventTriggered: boolean = false;
  public localdata = localStorage;
  loggedInEmpId: any;
  // options = { autoHide: false, scrollbarMinSize: 100 };
  @HostListener('window:scroll', [])
  onWindowScroll() {

    const navScrollElement =
      this.elementRef.nativeElement.querySelector('.nav-scroll');
    this.scrolled = window.scrollY > 10;

    const sections = document.querySelectorAll('.side-menu__item');
    const scrollPos =
      window.scrollY ||
      this.elementRef.nativeElement.ownerDocument.documentElement.scrollTop ||
      document.body.scrollTop;

    sections.forEach((ele, i) => {
      const currLink = sections[i];
      const val: any = currLink.getAttribute('value');
      const refElement: any = document.querySelector('#' + val);

      // Add a null check here before accessing properties of refElement
      if (refElement !== null) {
        const scrollTopMinus = scrollPos + 73;
        if (
          refElement.offsetTop <= scrollTopMinus &&
          refElement.offsetTop + refElement.offsetHeight > scrollTopMinus
        ) {
          if (navScrollElement) {
            this.renderer.removeClass(navScrollElement, 'active');
          }
          currLink.classList.add('active');
        } else {
          currLink.classList.remove('active');
        }
      }
    });
  }

  public windowSubscribe$!: Subscription;
  options = { autoHide: false, scrollbarMinSize: 100 };
  icon!: SafeHtml;

  public menuItems!: Menu[];
  public menuitemsSubscribe$!: Subscription;

  constructor(
    private http: HttpClient,
    private navServices: NavService,
    private commonServices: CommonService,
    private sanitizer: DomSanitizer,
    public router: Router,
    public renderer: Renderer2,
    private elementRef: ElementRef,
    private store: Store

  ) {
    this.screenWidth = window.innerWidth;
  }

 
  ngOnInit(): void { 
   
    this.store.select(selectCurrentUser).subscribe(data => {
        this.loggedInEmpId = data?.userId;
      });
    const body = {  
  "userid": this.loggedInEmpId,
  "company_id": 1,
  "clientId": "74BB6922",
  "source": "web", 
  "search_keyword": "string"
};
    
    //this.spinner.show();
    this.commonServices.getSideNav(body).subscribe((res: any) => { 
      //this.spinner.hide();
      if (res["statusCode"] == "200") {
        // ✅ CORRECT ARRAY EXTRACTION
        const modules: Module[] = Array.isArray(res?.objResult)
          ? res.objResult
          : [];


        if (modules.length === 0) {
          console.warn('⚠️ No modules found in API response');
          return;
        }
 
        if (modules.length === 1 && modules[0].menuGroup?.length === 1) {
          // 🟢 Flatten logic: If only ONE module and ONE group, show pages directly
          const singleModule = modules[0];
          const singleGroup = singleModule.menuGroup[0];
          
          this.menuItems = singleGroup.pages?.map((page: PageMenu) => {
            const normalizedName = page.menuName.trim();
            const path = this.resolveMenuPath(normalizedName, singleModule.moduleName, page.url);
 
            return {
              title: page.menuName,
              type: 'link',
              path: path,
              icon:
                this.getFigmaIcon(normalizedName) ||
                page.menu_icon ||
                this.moduleIconMap[normalizedName] ||
                'bx bx-circle',
              active: false,
              selected: false,
            };
          }) || [];
        } else {
          // 🔵 Standard multi-level logic
          this.menuItems = modules.map((module: Module) => this.mapModuleToMenu(module));

          // 🟢 Hide Settings Level-1 modules from main nav (settings live in settings mode)
          const settingsModules = modules.filter(m => m.jsonLabel?.trim() === 'Settings' || m.moduleName.trim() === 'Settings');
          if (settingsModules.length > 0) {
            const settingsNames = settingsModules.map(m => m.moduleName.trim());
            this.menuItems = this.menuItems.filter(m => m.title !== 'Settings' && !settingsNames.includes(m.title || ''));
          }

          // 🟢 Reorder: Move 'Employee Portal' to the top (only for multi-level)
          const portalIndex = this.menuItems.findIndex(m => m.title === 'Employee Portal');
          if (portalIndex > 0) {
            const [portalModule] = this.menuItems.splice(portalIndex, 1);
            this.menuItems.unshift(portalModule);
          }

          // Hide Help Desk; move Ticket under Facility; match Figma Facility order
          this.menuItems = this.moveHelpDeskTicketsUnderFacility(this.menuItems);
          this.menuItems = this.reorderFacilityChildren(this.menuItems);
        }

        this.menuItems = this.ensureVisitorsMenu(this.menuItems);
        this.menuItems = this.ensureMoreMenuDefaults(this.menuItems);

        // Figma settings menu (always — independent of API Settings modules)
        this.settingsMenuItems = buildFigmaSettingsMenuItems();
        this.allSettingsMenuItems = [...this.settingsMenuItems];

        // Add Settings menu item at the end
        this.menuItems.push({
          title: 'Settings',
          type: 'link',
          path: '/settings/company-details',
          icon: this.getFigmaIcon('settings') || 'bx-cog',
          active: false,
          selected: false
        });

        // Presentation-only Add-ons / More grouping (does not drop API modules)
        this.menuItems = this.applyMainMenuPresentation(this.menuItems);

        this.originalMenuItems = [...this.menuItems];

        this.ParentActive();

        this.router.events.subscribe((event) => {
          if (event instanceof NavigationEnd) {
            this.ParentActive();
          }
        });

        this.windowSubscribe$ = fromEvent(window, 'resize').subscribe(() => {
          checkHoriMenu();
        });

        switcherArrowFn();
        checkHoriMenu();
      }
    }) 
  }



  private getModulePages(module: Module): PageMenu[] {
    const groupPages = module.menuGroup?.flatMap((group) => group.pages ?? []) ?? [];
    if (module.menuGroup?.length === 1 && (module.menuGroup[0].pages?.length ?? 0) > 0) {
      return module.menuGroup[0].pages;
    }
    if ((module.pages?.length ?? 0) > 0) {
      return module.pages;
    }
    return groupPages;
  }

  private mapPageToChild(page: PageMenu, parentTitle: string) {
    const normalizedName = page.menuName.trim();
    const path = this.resolveMenuPath(normalizedName, parentTitle, page.url);
    return {
      title: page.menuName,
      type: 'link',
      path: path || '',
      icon: page.menu_icon || 'bx bx-circle',
      active: false,
      selected: false,
    };
  }

  private isLeaseModule(name: string): boolean {
    return (name || '').trim().toLowerCase().includes('lease');
  }

  private mapModuleToMenu(module: Module) {
    const normalizedName = module.moduleName.trim();
    const pages = this.getModulePages(module);

    if (pages.length === 0) {
      if (this.isCommissionsParent(normalizedName)) {
        return {
          title: module.moduleName,
          type: 'sub',
          selected: false,
          active: false,
          icon:
            this.getFigmaIcon(normalizedName) ||
            module.menu_icon ||
            this.moduleIconMap[normalizedName] ||
            'bx bx-layer',
          children: this.withCommissionsAllChild([]),
        };
      }
      if (this.isVisitorsParent(normalizedName)) {
        return {
          title: 'Visitors',
          type: 'sub',
          selected: false,
          active: false,
          icon: this.getFigmaIcon('visitors') || module.menu_icon || this.moduleIconMap[normalizedName] || 'bx bx-layer',
          children: this.withVisitorsChildren(),
        };
      }
      // Figma: Lease Management is a direct link (no single-item "Leases" submenu).
      if (this.isLeaseModule(normalizedName)) {
        return {
          title: module.moduleName,
          type: 'link',
          path: this.resolveMenuPath(normalizedName, undefined, module.url) || '/leases',
          icon:
            this.getFigmaIcon(normalizedName) ||
            module.menu_icon ||
            this.moduleIconMap[normalizedName] ||
            'bx bx-layer',
          active: false,
          selected: false,
        };
      }

      return {
        title: module.moduleName,
        type: 'link',
        path: this.resolveMenuPath(normalizedName, undefined, module.url) || '',
        icon:
          this.getFigmaIcon(normalizedName) ||
          module.menu_icon ||
          this.moduleIconMap[normalizedName] ||
          'bx bx-circle',
        active: false,
        selected: false,
      };
    }

    let children = pages.map((page) => this.mapPageToChild(page, module.moduleName));
    if (this.isCommissionsParent(normalizedName)) {
      children = this.withCommissionsAllChild(children);
    }
    if (this.isVisitorsParent(normalizedName)) {
      children = this.withVisitorsChildren();
    }
    // Flatten Lease Management when API only returns a single Leases child (matches Figma).
    if (this.isLeaseModule(normalizedName) && children.length <= 1) {
      const only = children[0];
      return {
        title: module.moduleName,
        type: 'link',
        path: only?.path || this.resolveMenuPath(normalizedName, undefined, module.url) || '/leases',
        icon:
          this.getFigmaIcon(normalizedName) ||
          module.menu_icon ||
          this.moduleIconMap[normalizedName] ||
          'bx bx-layer',
        active: false,
        selected: false,
      };
    }

    return {
      title: this.isVisitorsParent(normalizedName) ? 'Visitors' : module.moduleName,
      type: 'sub',
      selected: false,
      active: false,
      icon:
        this.getFigmaIcon(normalizedName) ||
        module.menu_icon ||
        this.moduleIconMap[normalizedName] ||
        'bx bx-layer',
      children,
    };
  }

  private withCommissionsAllChild(_children: any[]): any[] {
    return [
      {
        title: 'All',
        type: 'link',
        path: '/commissions',
        active: false,
        selected: false,
        exact: true,
      },
      {
        title: 'Tenant Commissions',
        type: 'link',
        path: '/commissions/tenant',
        active: false,
        selected: false,
        exact: true,
      },
      {
        title: 'Landlord Commissions',
        type: 'link',
        path: '/commissions/landlord',
        active: false,
        selected: false,
        exact: true,
      },
    ];
  }

  private withVisitorsChildren(): any[] {
    return [
      {
        title: 'All Visitors',
        type: 'link',
        path: '/visitors',
        active: false,
        selected: false,
        exact: true,
      },
      {
        title: 'Check-In Visitors',
        type: 'link',
        path: '/visitors/check-in',
        active: false,
        selected: false,
        exact: true,
      },
      {
        title: 'Check-Out Visitors',
        type: 'link',
        path: '/visitors/check-out',
        active: false,
        selected: false,
        exact: true,
      },
    ];
  }

  private moduleIconMap: { [key: string]: string } = {
    'HMS': 'bx bx-user-circle',       // Human Resource Management
    'AMS': 'bx bx-wallet',            // Account Management
    'BMS': 'bx bx-briefcase-alt-2',   // Business Management
    'Administration': 'bx bx-shield-quarter',
    'Personnel': 'bx bx-group',
    'Financials & Accounting': 'bx bx-stats', 
    'Performance': 'bx bx-line-chart',
    'Masters': 'bx bx-cog',
    'Recruitment': 'bx bx-user-plus',
    'Mobile Phones': 'bx bx-mobile-alt',
    'Inspections': 'bx bx-check-shield', 
  };




  private urlMap: { [key: string]: string } = {
    'leases manaement': '/leases',
    'leases management': '/leases',
    'lease management': '/leases',
    'facility/purchase-order': '/facility/purchase-orders',
    '/facility/purchase-order': '/facility/purchase-orders',
    'purchase-order': '/facility/purchase-orders',
    '/purchase-order': '/facility/purchase-orders',
  };

  private urlNameMap: { [key: string]: string } = {
    'My Day': '/dashboard/crm',
    'Properties': '/properties',
    'Units': '/units',
    'Rooms': '/rooms',
    'Parkings': '/parkings',
    'All Contacts': '/contacts/all-contacts',
    'Tenants': '/contacts/tenants',
    'Vendors': '/contacts/vendors',
    'Landlords': '/contacts/landlords',
    'Leases Management': '/leases',
    'Lease Management': '/leases',
    'Leases': '/leases',
    'Landlord Contracts': '/landlord-contracts',
    'Landlord Contract': '/landlord-contracts',
    'Add Contract': '/landlord-contracts/create',
    'Vendor Contracts': '/vendor-contracts',
    'Vendor Contract': '/vendor-contracts',
    'Add Vendor Contract': '/vendor-contracts/create', 
    'Support Technicians': '/contacts/support-technicians',
    'Ligitations': '/legal/litigations',
    'Litigations': '/legal/litigations',
    'Legal': '/legal/litigations',
    'Inspections': '/inspections/list',
    'Inspection List': '/inspections/list',
    'Templates List': '/inspections/templates',
    'Template List': '/inspections/templates',
    'Templates': '/inspections/templates',
    'Broadcasts': '/broadcasts',
    'Work Orders': '/facility/work-orders',
    'Work Order': '/facility/work-orders',
    'Requests': '/facility/requests',
    'Request': '/facility/requests',
    'Tickets': '/facility/tickets',
    'Ticket': '/facility/tickets',
    'Quotations': '/facility/quotations',
    'Quotation': '/facility/quotations',
    'Preventive Maintenance': '/facility/preventive-maintenance',
    'Preventive maintenance': '/facility/preventive-maintenance',
    'Parts/Inventory': '/facility/inventory',
    'Parts / Inventory': '/facility/inventory',
    'Inventory': '/facility/inventory',
    'Party/Inventory': '/facility/inventory',
    'Purchase Order': '/facility/purchase-orders',
    'Purchase Orders': '/facility/purchase-orders',
    'Assets': '/facility/assets',
    'Insights': '/insights',
    'Reports': '/reports',
    'Documents': '/documents',
    'Document Center': '/documents',
    'Documents Center': '/documents',
    'Download': '/downloads',
    'Downloads': '/downloads',
    'Download Center': '/downloads',
    'Archives': '/archives',
    'Archive': '/archives',
    'Email Logs': '/email-logs',
    'Email Log': '/email-logs',
    'EmailLogs': '/email-logs',
    'Activity Logs': '/activity-logs',
    'Activity Log': '/activity-logs',
    'ActivityLogs': '/activity-logs',
    'Mobile Stats': '/mobile-stats',
    'Mobile Stat': '/mobile-stats',
    'MobileStats': '/mobile-stats',
    'Mobile Statistics': '/mobile-stats',
    'Feedbacks': '/feedbacks',
    'Feedback': '/feedbacks',
    'Tracked Actions': '/tracked-actions',
    'Tracked Action': '/tracked-actions',
    'TrackedActions': '/tracked-actions',
    'Invoices': '/accounting/invoices',
    'Invoice': '/accounting/invoices',
    'Expenses': '/accounting/expenses',
    'Credit Notes': '/accounting/credit-notes',
    'Chart of Accounts': '/accounting/chart-of-accounts',
    'Cheques': '/accounting/cheques',
    'Commissions': '/commissions',
    'Tenant Commissions': '/commissions/tenant',
    'Landlord Commissions': '/commissions/landlord',
    'Collection Request': '/collection-requests',
    'Collection Requests': '/collection-requests',
    'Visitors': '/visitors',
    'Visitor': '/visitors',
    'Guests': '/visitors',
    'Guest List': '/visitors',
    'All Visitors': '/visitors',
    'Check-In Visitors': '/visitors/check-in',
    'Check-In Visitor': '/visitors/check-in',
    'Check-Out Visitors': '/visitors/check-out',
    'Check-Out Visitor': '/visitors/check-out',
    'Reminders': '/reminders',
    'Reminder': '/reminders',
    'Bookings': '/bookings/reservations',
    'Booking': '/bookings/reservations',
    'Spaces': '/bookings/spaces',
    'Space': '/bookings/spaces',
    'Reservations': '/bookings/reservations',
    'Reservation': '/bookings/reservations',
    'Events': '/community/events',
    'Event': '/community/events',
    'Promotions': '/community/promotions',
    'Promotion': '/community/promotions',
    'Rules / Guide': '/community/rules-guides',
    'Rules/Guide': '/community/rules-guides',
    'Rules Guide': '/community/rules-guides',
    'Rules & Guides': '/community/rules-guides',
    'Rules and Guides': '/community/rules-guides',
    'Rules & Guide': '/community/rules-guides',
    'Rules Guides': '/community/rules-guides',
    'Guides': '/community/rules-guides',
    'Community': '/community/events',
  };

  private isAccountingParent(parentTitle?: string): boolean {
    if (!parentTitle) {
      return false;
    }
    const name = parentTitle.trim().toLowerCase();
    return name === 'ams' || name.includes('account');
  }

  private isCommissionsParent(parentTitle?: string): boolean {
    const name = (parentTitle || '').trim().toLowerCase();
    return name === 'commissions' || name === 'commission';
  }

  private isVisitorsParent(parentTitle?: string): boolean {
    const name = (parentTitle || '').trim().toLowerCase();
    return name === 'guests' || name === 'visitor' || name === 'visitors' || name.includes('guest');
  }

  private isVisitorsChildTitle(title?: string): boolean {
    const name = (title || '').trim().toLowerCase();
    return (
      name === 'all visitors' ||
      name === 'check-in visitors' ||
      name === 'check-in visitor' ||
      name === 'check-out visitors' ||
      name === 'check-out visitor' ||
      name === 'guest list'
    );
  }

  private resolveVisitorsChildPath(menuName: string): string {
    const name = (menuName || '').trim().toLowerCase();
    if (name.includes('check-in')) {
      return '/visitors/check-in';
    }
    if (name.includes('check-out')) {
      return '/visitors/check-out';
    }
    return '/visitors';
  }

  private ensureVisitorsMenu(items: Menu[]): Menu[] {
    if (!items?.length) {
      return items;
    }

    const hasVisitorsParent = items.some((item) => this.isVisitorsParent(item.title));
    let result = items;

    if (hasVisitorsParent) {
      result = items.filter((item) => {
        if (item.type === 'sub') {
          return true;
        }
        return !this.isVisitorsChildTitle(item.title);
      });
    }

    return result.map((item) => {
      if (!this.isVisitorsParent(item.title)) {
        return item;
      }

      return {
        title: 'Visitors',
        type: 'sub',
        icon: this.getFigmaIcon('visitors') || item.icon,
        active: false,
        selected: false,
        children: this.withVisitorsChildren(),
      };
    });
  }

  /** Ensure More-section links exist even when API omits them. */
  private ensureMoreMenuDefaults(items: Menu[]): Menu[] {
    if (!items) {
      return items;
    }

    const defaults: { key: string; title: string; path: string; iconKey: string; fallbackIcon: string }[] = [
      {
        key: 'document center',
        title: 'Document Center',
        path: '/documents',
        iconKey: 'document center',
        fallbackIcon: './assets/images/nav/documents.svg',
      },
      {
        key: 'download center',
        title: 'Download Center',
        path: '/downloads',
        iconKey: 'download center',
        fallbackIcon: './assets/images/nav/download.svg',
      },
      {
        key: 'archives',
        title: 'Archives',
        path: '/archives',
        iconKey: 'archives',
        fallbackIcon: './assets/images/nav/archives.svg',
      },
      {
        key: 'email logs',
        title: 'Email Logs',
        path: '/email-logs',
        iconKey: 'email logs',
        fallbackIcon: './assets/images/nav/email-logs.svg',
      },
      {
        key: 'activity logs',
        title: 'Activity Logs',
        path: '/activity-logs',
        iconKey: 'activity logs',
        fallbackIcon: './assets/images/nav/activity-logs.svg',
      },
      {
        key: 'mobile stats',
        title: 'Mobile Stats',
        path: '/mobile-stats',
        iconKey: 'mobile stats',
        fallbackIcon: './assets/images/nav/mobile-stats.svg',
      },
      {
        key: 'feedbacks',
        title: 'Feedbacks',
        path: '/feedbacks',
        iconKey: 'feedbacks',
        fallbackIcon: './assets/images/nav/feedbacks.svg',
      },
      {
        key: 'tracked actions',
        title: 'Tracked Actions',
        path: '/tracked-actions',
        iconKey: 'tracked actions',
        fallbackIcon: './assets/images/nav/tracked-actions.svg',
      },
    ];

    let result = [...items];
    for (const def of defaults) {
      const exists = result.some((item) => this.matchMoreKey(item.title) === def.key);
      if (exists) {
        continue;
      }
      result.push({
        title: def.title,
        type: 'link',
        path: def.path,
        icon: this.getFigmaIcon(def.iconKey) || def.fallbackIcon,
        active: false,
        selected: false,
      });
    }
    return result;
  }

  private isHelpDeskMenu(title?: string): boolean {
    const name = (title || '').trim().toLowerCase().replace(/[\s_-]+/g, '');
    return name === 'helpdesk' || name === 'helpdesks';
  }

  private isFacilityMenu(title?: string): boolean {
    const name = (title || '').trim().toLowerCase();
    return name === 'facility' || name === 'facilities';
  }

  private isTicketMenu(title?: string): boolean {
    const name = (title || '').trim().toLowerCase();
    return name === 'ticket' || name === 'tickets';
  }

  /** Desired Facility submenu order (Figma / product IA). */
  private readonly facilityChildOrder: string[] = [
    'requests',
    'work order',
    'tickets',
    'quotations',
    'preventive maintenance',
    'assets',
    'party/inventory',
    'purchase order',
  ];

  private normalizeFacilityChildKey(title?: string): string {
    return (title || '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/work orders?\b/, 'work order')
      .replace(/\btickets?\b/, 'tickets')
      .replace(/quotation(s)?\b/, 'quotations')
      .replace(/preventive[\s-]?maintenance/, 'preventive maintenance')
      .replace(/party[\s_/&-]*inventory/, 'party/inventory')
      .replace(/parts?[\s_/&-]*inventory/, 'party/inventory')
      .replace(/purchase[\s-]?orders?\b/, 'purchase order');
  }

  private facilityChildSortIndex(title?: string): number {
    const key = this.normalizeFacilityChildKey(title);
    const idx = this.facilityChildOrder.indexOf(key);
    return idx === -1 ? this.facilityChildOrder.length + 1 : idx;
  }

  /** Reorder Facility children to match product order; leave unknown items at the end. */
  private reorderFacilityChildren(items: Menu[]): Menu[] {
    if (!items?.length) {
      return items;
    }
    const facilityIndex = items.findIndex((item) => this.isFacilityMenu(item.title));
    if (facilityIndex < 0) {
      return items;
    }

    const facility = { ...items[facilityIndex] };
    const children = [...(facility.children || [])].map((child) => {
      if (this.isTicketMenu(child.title)) {
        return { ...child, title: 'Tickets', path: '/facility/tickets' };
      }
      const key = this.normalizeFacilityChildKey(child.title);
      if (key === 'quotations') {
        return { ...child, title: 'Quotations', path: '/facility/quotations' };
      }
      if (key === 'preventive maintenance') {
        return { ...child, title: 'Preventive Maintenance', path: '/facility/preventive-maintenance' };
      }
      if (key === 'party/inventory') {
        return { ...child, title: 'Parts/Inventory', path: '/facility/inventory' };
      }
      if (key === 'purchase order') {
        return { ...child, title: 'Purchase Order', path: '/facility/purchase-orders' };
      }
      // Design uses singular "Work Order"
      if (key === 'work order' && (child.title || '').toLowerCase().includes('orders')) {
        return { ...child, title: 'Work Order' };
      }
      return child;
    });

    if (!children.some((c) => this.normalizeFacilityChildKey(c.title) === 'quotations')) {
      children.push({
        title: 'Quotations',
        type: 'link',
        path: '/facility/quotations',
        active: false,
        selected: false,
      });
    }

    if (!children.some((c) => this.normalizeFacilityChildKey(c.title) === 'preventive maintenance')) {
      children.push({
        title: 'Preventive Maintenance',
        type: 'link',
        path: '/facility/preventive-maintenance',
        active: false,
        selected: false,
      });
    }

    if (!children.some((c) => this.normalizeFacilityChildKey(c.title) === 'party/inventory')) {
      children.push({
        title: 'Parts/Inventory',
        type: 'link',
        path: '/facility/inventory',
        active: false,
        selected: false,
      });
    }

    if (!children.some((c) => this.normalizeFacilityChildKey(c.title) === 'purchase order')) {
      children.push({
        title: 'Purchase Order',
        type: 'link',
        path: '/facility/purchase-orders',
        active: false,
        selected: false,
      });
    }

    children.sort((a, b) => {
      const diff = this.facilityChildSortIndex(a.title) - this.facilityChildSortIndex(b.title);
      if (diff !== 0) {
        return diff;
      }
      return (a.title || '').localeCompare(b.title || '');
    });

    facility.type = 'sub';
    facility.children = children;
    facility.path = undefined;

    const next = [...items];
    next[facilityIndex] = facility;
    return next;
  }

  /**
   * Hide Help Desk as a top-level item and attach its Ticket child(ren) under Facility.
   * Preserves API paths on Ticket links.
   */
  private moveHelpDeskTicketsUnderFacility(items: Menu[]): Menu[] {
    if (!items?.length) {
      return items;
    }

    const helpDeskItems = items.filter((item) => this.isHelpDeskMenu(item.title));
    if (!helpDeskItems.length) {
      return items;
    }

    const ticketChildren: Menu[] = [];
    for (const helpDesk of helpDeskItems) {
      const kids = (helpDesk.children || []).filter((child) => this.isTicketMenu(child.title));
      if (kids.length) {
        ticketChildren.push(...kids);
      } else if (helpDesk.type === 'link' || this.isTicketMenu(helpDesk.title)) {
        ticketChildren.push({
          title: 'Tickets',
          type: 'link',
          path: helpDesk.path || '',
          icon: helpDesk.icon,
          active: false,
          selected: false,
        });
      } else if ((helpDesk.children || []).length) {
        ticketChildren.push(...(helpDesk.children as Menu[]));
      } else {
        ticketChildren.push({
          title: 'Tickets',
          type: 'link',
          path: helpDesk.path || '',
          icon: helpDesk.icon,
          active: false,
          selected: false,
        });
      }
    }

    const withoutHelpDesk = items.filter((item) => !this.isHelpDeskMenu(item.title));
    if (!ticketChildren.length) {
      return withoutHelpDesk;
    }

    const facilityIndex = withoutHelpDesk.findIndex((item) => this.isFacilityMenu(item.title));
    if (facilityIndex < 0) {
      return withoutHelpDesk;
    }

    const facility = { ...withoutHelpDesk[facilityIndex] };
    const existingChildren = [...(facility.children || [])];
    const existingTicketTitles = new Set(
      existingChildren
        .filter((c) => this.isTicketMenu(c.title))
        .map((c) => (c.title || '').trim().toLowerCase())
    );

    for (const ticket of ticketChildren) {
      const key = (ticket.title || 'Tickets').trim().toLowerCase();
      if (existingTicketTitles.has(key) || existingTicketTitles.has('ticket') || existingTicketTitles.has('tickets')) {
        continue;
      }
      existingChildren.push({
        ...ticket,
        title: 'Tickets',
        type: 'link',
        path: '/facility/tickets',
        active: false,
        selected: false,
      });
      existingTicketTitles.add('tickets');
    }

    facility.type = 'sub';
    facility.children = existingChildren;
    facility.path = undefined;

    const next = [...withoutHelpDesk];
    next[facilityIndex] = facility;
    return next;
  }

  private isReportMenu(menuName: string): boolean {
    const name = (menuName || '').trim().toLowerCase();
    return name === 'report' || name === 'reports';
  }

  private isReportsRoute(path?: string): boolean {
    if (!path) {
      return false;
    }
    const normalized = path.trim().toLowerCase().replace(/\/+$/, '');
    return normalized === '/reports' || normalized === 'reports';
  }

  /** Accounting reports are a different product from Rental Reports at /reports. */
  private isCommunityParent(parentTitle?: string): boolean {
    const name = (parentTitle || '').trim().toLowerCase();
    return name === 'community' || name.includes('community');
  }

  /** Map API menu labels under Community to static frontend routes. */
  /** API menus sometimes emit singular purchase-order paths that 404 against our routes. */
  private normalizePurchaseOrderPath(path?: string): string {
    if (!path) {
      return '';
    }
    const trimmed = path.trim();
    if (!trimmed) {
      return '';
    }
    const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    if (
      withLeadingSlash === '/facility/purchase-order' ||
      withLeadingSlash.startsWith('/facility/purchase-order/')
    ) {
      return withLeadingSlash.replace('/facility/purchase-order', '/facility/purchase-orders');
    }
    if (
      withLeadingSlash === '/purchase-order' ||
      withLeadingSlash.startsWith('/purchase-order/')
    ) {
      return withLeadingSlash.replace('/purchase-order', '/facility/purchase-orders');
    }
    return withLeadingSlash;
  }

  private resolveCommunityPath(menuName: string): string {
    const name = (menuName || '').trim().toLowerCase().replace(/\s+/g, ' ');
    if (!name || name === 'community') {
      return '/community/events';
    }
    if (name.includes('event')) {
      return '/community/events';
    }
    if (name.includes('promo')) {
      return '/community/promotions';
    }
    if (
      name.includes('rule') ||
      name.includes('guide') ||
      name.includes('rules/guide') ||
      name.includes('rules / guide')
    ) {
      return '/community/rules-guides';
    }
    return '';
  }

  private resolveMenuPath(menuName: string, parentTitle?: string, fallbackUrl?: string): string {
    const normalizedName = (menuName || '').trim();
    if (this.isAccountingParent(parentTitle) && this.isReportMenu(normalizedName)) {
      return '/accounting/reports';
    }
    if (this.isCommissionsParent(parentTitle)) {
      const child = normalizedName.toLowerCase();
      if (child === 'all' || child === 'commissions') {
        return '/commissions';
      }
      if (child.includes('tenant')) {
        return '/commissions/tenant';
      }
      if (child.includes('landlord')) {
        return '/commissions/landlord';
      }
    }
    if (this.isCommunityParent(parentTitle)) {
      const communityPath = this.resolveCommunityPath(normalizedName);
      if (communityPath) {
        return communityPath;
      }
    }
    if (this.isVisitorsParent(parentTitle)) {
      return this.resolveVisitorsChildPath(normalizedName);
    }

    let path = this.urlNameMap[normalizedName];
    if (!path) {
      const lowerName = normalizedName.toLowerCase();
      const matchingKey = Object.keys(this.urlNameMap).find((key) => key.toLowerCase() === lowerName);
      if (matchingKey) {
        path = this.urlNameMap[matchingKey];
      }
    }
    if (!path) {
      const communityPath = this.resolveCommunityPath(normalizedName);
      if (communityPath) {
        path = communityPath;
      }
    }
    if (!path && fallbackUrl) {
      path = this.urlMap[fallbackUrl] || fallbackUrl;
    }
    if (!path && this.isVisitorsChildTitle(normalizedName)) {
      path = this.resolveVisitorsChildPath(normalizedName);
    }

    path = this.normalizePurchaseOrderPath(path);

    if (this.isAccountingParent(parentTitle) && this.isReportsRoute(path)) {
      return '/accounting/reports';
    }

    return path || '';
  }

  private figmaIconMap: { [key: string]: string } = {
    'my day': './assets/images/nav/my-day.svg',
    'insights': './assets/images/nav/insights.svg',
    'properties': './assets/images/nav/properties.svg',
    'units': './assets/images/nav/properties.svg',
    'rooms': './assets/images/nav/properties.svg',
    'parkings': './assets/images/nav/properties.svg',
    'contacts': './assets/images/nav/contacts.svg',
    'all contacts': './assets/images/nav/contacts.svg',
    'tenants': './assets/images/nav/contacts.svg',
    'vendors': './assets/images/nav/contacts.svg',
    'landlords': './assets/images/nav/contacts.svg',
    'support technicians': './assets/images/nav/contacts.svg',
    'lease management': './assets/images/nav/lease.svg',
    'leases management': './assets/images/nav/lease.svg',
    'leases': './assets/images/nav/lease.svg',
    'contracts': './assets/images/nav/contracts.svg',
    'accounting': './assets/images/nav/accounting.svg',
    'commissions': './assets/images/nav/commissions.svg',
    'collection request': './assets/images/nav/collection.svg',
    'property listings': './assets/images/nav/listings.svg',
    'reminders': './assets/images/nav/reminders.svg',
    'broadcasts': './assets/images/nav/broadcasts.svg',
    'bookings': './assets/images/nav/bookings.svg',
    'community': './assets/images/nav/community.svg',
    'facility': './assets/images/nav/facility.svg',
    'work orders': './assets/images/nav/facility.svg',
    'assets': './assets/images/nav/facility.svg',
    'guests': './assets/images/nav/guests.svg',
    'visitors': './assets/images/nav/guests.svg',
    'visitor': './assets/images/nav/guests.svg',
    'legal': './assets/images/nav/legal.svg',
    'inspections': './assets/images/nav/inspections.svg',
    'reports': './assets/images/nav/reports.svg',
    'documents': './assets/images/nav/documents.svg',
    'document center': './assets/images/nav/documents.svg',
    'download': './assets/images/nav/download.svg',
    'downloads': './assets/images/nav/download.svg',
    'download center': './assets/images/nav/download.svg',
    'archives': './assets/images/nav/archives.svg',
    'archive': './assets/images/nav/archives.svg',
    'email logs': './assets/images/nav/email-logs.svg',
    'email log': './assets/images/nav/email-logs.svg',
    'activity logs': './assets/images/nav/activity-logs.svg',
    'activity log': './assets/images/nav/activity-logs.svg',
    'mobile stats': './assets/images/nav/mobile-stats.svg',
    'feedbacks': './assets/images/nav/feedbacks.svg',
    'feedback': './assets/images/nav/feedbacks.svg',
    'tracked actions': './assets/images/nav/tracked-actions.svg',
    'tracked action': './assets/images/nav/tracked-actions.svg',
    'imports': './assets/images/nav/imports.svg',
    'ai chats': './assets/images/nav/ai-chats.svg',
    'ai chat': './assets/images/nav/ai-chats.svg',
    'marketplace': './assets/images/nav/marketplace.svg',
    'help center': './assets/images/nav/help-center.svg',
    "what's new": './assets/images/nav/whats-new.svg',
    'whats new': './assets/images/nav/whats-new.svg',
    'berto.ai crm': './assets/images/nav/addons/berto.svg',
    'berto.ai': './assets/images/nav/addons/berto.svg',
    'spacehub': './assets/images/nav/addons/spacehub.svg',
    'space hub': './assets/images/nav/addons/spacehub.svg',
    'guestflow': './assets/images/nav/addons/guestflow.svg',
    'guest flow': './assets/images/nav/addons/guestflow.svg',
    'snaglist': './assets/images/nav/addons/snaglist.svg',
    'snaplist': './assets/images/nav/addons/snaglist.svg',
    'engagehub': './assets/images/nav/addons/engagehub.svg',
    'engage hub': './assets/images/nav/addons/engagehub.svg',
    'servicehub': './assets/images/nav/addons/servicehub.svg',
    'service hub': './assets/images/nav/addons/servicehub.svg',
    'reportstudio': './assets/images/nav/addons/reportstudio.svg',
    'report studio': './assets/images/nav/addons/reportstudio.svg',
    'setting': './assets/images/nav/settings.svg',
    'settings': './assets/images/nav/settings.svg',
  };

  getFigmaIcon(title?: string): string | null {
    if (!title) {
      return null;
    }
    const normalized = title.trim().toLowerCase();
    if (this.figmaIconMap[normalized]) {
      return this.figmaIconMap[normalized];
    }
    const keys = Object.keys(this.figmaIconMap).sort((a, b) => b.length - a.length);
    for (const key of keys) {
      if (normalized.includes(key)) {
        return this.figmaIconMap[key];
      }
    }
    return null;
  }

  /** Presentation grouping: primary → Add-ons → More → Settings. Never drops API items. */
  private applyMainMenuPresentation(items: Menu[]): Menu[] {
    if (!items?.length) {
      return items;
    }

    const settings: Menu[] = [];
    const primary: Menu[] = [];
    const addons: Menu[] = [];
    const more: Menu[] = [];

    for (const item of items) {
      if (item.type === 'heading') {
        primary.push(item);
        continue;
      }
      const titleKey = this.normalizeNavKey(item.title);
      if (titleKey === 'settings') {
        settings.push({ ...item, menutype: 'settings' });
        continue;
      }

      const addOnKey = this.matchAddOnKey(item.title);
      if (addOnKey) {
        addons.push(this.decorateAddOnItem(item, addOnKey));
        continue;
      }

      const moreKey = this.matchMoreKey(item.title);
      if (moreKey) {
        // One entry per More key (e.g. hide primary "Documents Center" duplicate)
        if (more.some((m) => this.matchMoreKey(m.title) === moreKey)) {
          continue;
        }
        more.push(this.decorateMoreItem(item, moreKey));
        continue;
      }

      primary.push({
        ...item,
        icon: this.getFigmaIcon(item.title) || item.icon,
        menutype: 'primary',
      });
    }

    const result: Menu[] = [...primary];

    if (addons.length) {
      result.push({
        title: 'Add-ons',
        type: 'heading',
        menutype: 'addons-heading',
      });
      result.push(...this.sortByPreferredOrder(addons, this.addOnsOrder));
    }

    if (more.length) {
      result.push({
        title: 'More',
        type: 'heading',
        menutype: 'more-heading',
      });
      result.push(...this.sortByPreferredOrder(more, this.moreOrder));
    }

    if (settings.length) {
      result.push({
        title: 'Settings',
        type: 'heading',
        menutype: 'settings-heading',
      });
      result.push(...settings);
    }

    return result;
  }

  private readonly addOnsOrder: string[] = [
    'berto.ai crm',
    'spacehub',
    'guestflow',
    'snaglist',
    'engagehub',
    'servicehub',
    'reportstudio',
  ];

  private readonly moreOrder: string[] = [
    'document center',
    'download center',
    'archives',
    'email logs',
    'activity logs',
    'mobile stats',
    'feedbacks',
    'tracked actions',
    'imports',
    'ai chats',
    'marketplace',
    'help center',
    "what's new",
  ];

  private readonly addOnChrome: {
    [key: string]: { plate: string; icon: string };
  } = {
    'berto.ai crm': { plate: '#4B2E83', icon: './assets/images/nav/addons/berto.svg' },
    spacehub: { plate: '#C084FC', icon: './assets/images/nav/addons/spacehub.svg' },
    guestflow: { plate: '#5BA3E0', icon: './assets/images/nav/addons/guestflow.svg' },
    snaglist: { plate: '#F08A3C', icon: './assets/images/nav/addons/snaglist.svg' },
    engagehub: { plate: '#1E3A8A', icon: './assets/images/nav/addons/engagehub.svg' },
    servicehub: { plate: '#1E40AF', icon: './assets/images/nav/addons/servicehub.svg' },
    reportstudio: { plate: '#2563EB', icon: './assets/images/nav/addons/reportstudio.svg' },
  };

  private normalizeNavKey(title?: string): string {
    return (title || '')
      .trim()
      .toLowerCase()
      .replace(/[’']/g, "'")
      .replace(/\s+/g, ' ');
  }

  private matchAddOnKey(title?: string): string | null {
    const n = this.normalizeNavKey(title);
    if (!n) {
      return null;
    }
    if (n.includes('berto')) {
      return 'berto.ai crm';
    }
    if (n === 'spacehub' || n === 'space hub' || n.includes('spacehub')) {
      return 'spacehub';
    }
    if (n === 'guestflow' || n === 'guest flow' || n.includes('guestflow')) {
      return 'guestflow';
    }
    if (n === 'snaglist' || n === 'snaplist' || n === 'snag list' || n.includes('snaglist') || n.includes('snaplist')) {
      return 'snaglist';
    }
    if (n === 'engagehub' || n === 'engage hub' || n.includes('engagehub')) {
      return 'engagehub';
    }
    if (n === 'servicehub' || n === 'service hub' || n.includes('servicehub')) {
      return 'servicehub';
    }
    if (n === 'reportstudio' || n === 'report studio' || n === 'reports studio' || n.includes('reportstudio')) {
      return 'reportstudio';
    }
    return null;
  }

  private matchMoreKey(title?: string): string | null {
    const n = this.normalizeNavKey(title);
    if (!n) {
      return null;
    }
    const pairs: [RegExp | string, string][] = [
      [/^documents?\s*center$|^documents?$/, 'document center'],
      [/^downloads?\s*center$|^downloads?$/, 'download center'],
      [/^archives?$/, 'archives'],
      [/^email logs?$/, 'email logs'],
      [/^activity logs?$/, 'activity logs'],
      [/^mobile stats?$|^mobile statistics$/, 'mobile stats'],
      [/^feedbacks?$/, 'feedbacks'],
      [/^tracked actions?$/, 'tracked actions'],
      [/^imports?$/, 'imports'],
      [/^ai chats?$/, 'ai chats'],
      [/^marketplace$/, 'marketplace'],
      [/^help center$/, 'help center'],
      [/^what's new$|^whats new$/, "what's new"],
    ];
    for (const [test, key] of pairs) {
      if (typeof test === 'string') {
        if (n === test) {
          return key;
        }
      } else if (test.test(n)) {
        return key;
      }
    }
    return null;
  }

  private decorateAddOnItem(item: Menu, key: string): Menu {
    const chrome = this.addOnChrome[key];
    return {
      ...item,
      menutype: 'addons',
      icon: chrome?.icon || this.getFigmaIcon(item.title) || item.icon,
      iconPlate: chrome?.plate || '#26264F',
    };
  }

  private decorateMoreItem(item: Menu, key: string): Menu {
    const decorated: Menu = {
      ...item,
      menutype: 'more',
      icon: this.getFigmaIcon(item.title) || item.icon,
    };
    // Prefer screenshot / Figma labels under More
    if (key === 'document center') {
      decorated.title = 'Document Center';
      decorated.path = decorated.path || '/documents';
      decorated.icon = this.getFigmaIcon('document center') || decorated.icon;
    }
    if (key === 'download center') {
      decorated.title = 'Download Center';
      decorated.path = decorated.path || '/downloads';
      decorated.icon = this.getFigmaIcon('download center') || decorated.icon;
    }
    if (key === 'archives') {
      decorated.title = 'Archives';
      decorated.path = decorated.path || '/archives';
      decorated.icon = this.getFigmaIcon('archives') || decorated.icon;
    }
    if (key === 'email logs') {
      decorated.title = 'Email Logs';
      decorated.path = decorated.path || '/email-logs';
      decorated.icon = this.getFigmaIcon('email logs') || decorated.icon;
    }
    if (key === 'activity logs') {
      decorated.title = 'Activity Logs';
      decorated.path = decorated.path || '/activity-logs';
      decorated.icon = this.getFigmaIcon('activity logs') || decorated.icon;
    }
    if (key === 'mobile stats') {
      decorated.title = 'Mobile Stats';
      decorated.path = decorated.path || '/mobile-stats';
      decorated.icon = this.getFigmaIcon('mobile stats') || decorated.icon;
    }
    if (key === 'feedbacks') {
      decorated.title = 'Feedbacks';
      decorated.path = decorated.path || '/feedbacks';
      decorated.icon = this.getFigmaIcon('feedbacks') || decorated.icon;
    }
    if (key === 'tracked actions') {
      decorated.title = 'Tracked Actions';
      decorated.path = decorated.path || '/tracked-actions';
      decorated.icon = this.getFigmaIcon('tracked actions') || decorated.icon;
    }
    if (key === 'marketplace') {
      decorated.badgeText = 'New';
    }
    return decorated;
  }

  private sortByPreferredOrder(items: Menu[], order: string[]): Menu[] {
    const rank = (title?: string): number => {
      const addOnKey = this.matchAddOnKey(title);
      const moreKey = this.matchMoreKey(title);
      const key = addOnKey || moreKey || this.normalizeNavKey(title);
      const idx = order.indexOf(key);
      return idx === -1 ? 999 : idx;
    };
    return [...items].sort((a, b) => rank(a.title) - rank(b.title));
  }

  isAddOnsHeading(item: Menu): boolean {
    return item?.type === 'heading' && item?.menutype === 'addons-heading';
  }

  isNavHeading(item: Menu): boolean {
    return item?.type === 'heading';
  }

  isAddOnItem(item: Menu): boolean {
    return item?.menutype === 'addons';
  }


  switchToSettingsMenu() {
    this.isSettingsMode = true;
    this.settingsSearchQuery = '';
    // Always rebuild so menu paths stay in sync with settings-menu.data.ts
    this.allSettingsMenuItems = buildFigmaSettingsMenuItems();
    this.settingsMenuItems = [...this.allSettingsMenuItems];
    // Back link lives in fixed chrome — keep it out of the scrolling list
    this.menuItems = [...this.settingsMenuItems];
  }

  onSettingsSearchChange(query: string) {
    this.settingsSearchQuery = query || '';
    const q = this.settingsSearchQuery.trim().toLowerCase();
    const source = this.allSettingsMenuItems.length
      ? this.allSettingsMenuItems
      : buildFigmaSettingsMenuItems();

    if (!q) {
      this.settingsMenuItems = source.map((item) => ({ ...item }));
    } else {
      const filtered: Menu[] = [];
      let pendingHeading: Menu | null = null;
      for (const item of source) {
        if (item.type === 'heading') {
          pendingHeading = { ...item };
          continue;
        }
        if ((item.title || '').toLowerCase().includes(q)) {
          if (pendingHeading) {
            filtered.push(pendingHeading);
            pendingHeading = null;
          }
          filtered.push({ ...item });
        }
      }
      this.settingsMenuItems = filtered;
    }

    this.menuItems = [...this.settingsMenuItems];
  }

  restoreMainMenu() {
    this.isSettingsMode = false;
    this.settingsSearchQuery = '';
    this.menuItems = [...this.originalMenuItems];
  }

  //Active Nav State
  setNavActive(item: any) {
    if (item.title === 'Settings') {
      this.switchToSettingsMenu();
      const firstItem = this.menuItems.find(m => m.title === 'Company Details');
      if (firstItem) {
        firstItem.active = true;
        firstItem.selected = true;
      }
      return;
    }
    if (item.title === 'Back to Main Menu') {
      this.restoreMainMenu();
      return;
    }

    if (item.type === 'heading') {
      return;
    }

    const isHorizontal = document.documentElement.getAttribute('data-nav-layout') === 'horizontal';

    // 1. Full Reset of all items to inactive/unselected
    this.menuItems?.forEach((menuItem) => {
      menuItem.active = false;
      menuItem.selected = false;
      if (menuItem.children) {
        menuItem.children?.forEach((submenuItems) => {
          submenuItems.active = false;
          submenuItems.selected = false;
          if (submenuItems.children) {
            submenuItems.children?.forEach((subsubmenuItems) => {
              subsubmenuItems.active = false;
              subsubmenuItems.selected = false;
            });
          }
        });
      }
    });

    // 2. Activate specific item and its hierarchy
    this.menuItems?.filter((menuItem) => {
      if (menuItem === item) {
        menuItem.active = true;
        menuItem.selected = true;
      }

      if (menuItem.children) {
        menuItem.children?.filter((submenuItems) => {
          if (submenuItems === item) {
            menuItem.active = !isHorizontal;
            menuItem.selected = true;
            submenuItems.active = true;
            submenuItems.selected = true;
          }

          if (submenuItems.children) {
            submenuItems.children?.forEach((subsubmenuItems) => {
              if (subsubmenuItems === item) {
                menuItem.active = !isHorizontal;
                submenuItems.active = !isHorizontal;
                subsubmenuItems.active = true;
                menuItem.selected = true;
                submenuItems.selected = true;
                subsubmenuItems.selected = true;
              }
            });
          }
        });
      }
    });
  }

  // Toggle menu
  toggleNavActive(item: any) {
    if (localStorage.getItem('ynex-sidemenu-styles') == 'icontext') {
      document.querySelector('html')?.setAttribute('icon-text', 'open')
    } else {
      document.querySelector('html')?.removeAttribute('icon-text')
    }
    if (localStorage.getItem('ynex-sidemenu-styles') == 'doublemenu') {
      if (item.active) return;
    }

    if (!item.active) {
      // If we are opening a menu, collapse all other menus at the same level
      this.menuItems?.forEach((a: any) => {
        if (this.menuItems.includes(item) && a !== item) {
          a.active = false;
        }
        a?.children?.forEach((b: any) => {
          if (a.children.includes(item) && b !== item) {
            b.active = false;
          }
          b?.children?.forEach((c: any) => {
            if (b.children.includes(item) && c !== item) {
              c.active = false;
            }
          });
        });
      });
    }
    item.active = !item.active;
  }
  // Close Nav menu
  closeNavActive() {
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

  // ParentActive() {
  //   this.menuItems.map((element: any) => {
  //     if (element.children) {
  //       element.active = false;
  //       element.selected = false;
  //       element.children.map((ele: any) => {
  // 
  //         if (ele.path == this.router.url) {
  //           element.active = true;
  //           element.selected = true;
  //         }
  //         if (ele.children) {
  //           ele.active = false;
  //           ele.children.map((child1: any) => {
  //             if (child1.path == this.router.url) {
  //               element.active = true;
  //               element.selected = true;
  //               ele.active = true;
  //               ele.selected = true;
  //             }
  //           });
  //         }
  //       });
  //     }
  //   });
  // }
  ParentActive() {
    const currentUrl = this.router.url;

    // Auto-switch menu based on URL
    if (currentUrl.startsWith('/settings/')) {
      if (!this.isSettingsMode) {
        this.switchToSettingsMenu();
      }
    } else {
      if (this.isSettingsMode) {
        this.restoreMainMenu();
      }
    }

    const isHorizontal = document.documentElement.getAttribute('data-nav-layout') === 'horizontal';

    // 1. Reset all active states first
    this.menuItems.forEach((element: any) => {
      element.active = false;
      element.selected = false;
      if (element.children) {
        element.children.forEach((ele: any) => {
          ele.active = false;
          ele.selected = false;
          if (ele.children) {
            ele.children.forEach((child1: any) => {
              child1.active = false;
              child1.selected = false;
            });
          }
        });
      }
    });

    // 2. Find the best match
    // We prioritize:
    // a. Exact path match (match.path === currentUrl)
    // b. Active router match (router.isActive(match.path, true))
    // c. Prefix match (router.isActive(match.path, false)) with longest path
    
    let bestMatch: { element: any; ele: any; child1?: any; specificity: number } | null = null;

    this.menuItems.forEach((element: any) => {
      if (element.children) {
        element.children.forEach((ele: any) => {
          // Check Group path
          if (ele.path && ele.path !== '' && ele.path !== '/') {
            let specificity = 0;
            if (ele.path === currentUrl) specificity = 3;
            else if (this.router.isActive(ele.path, true)) specificity = 2;
            else if (this.router.isActive(ele.path, false)) specificity = 1;

            if (specificity > 0) {
              if (!bestMatch || specificity > bestMatch.specificity || (specificity === bestMatch.specificity && ele.path.length > (bestMatch.child1?.path?.length || bestMatch.ele.path.length))) {
                bestMatch = { element, ele, specificity };
              }
            }
          }

          // Check Page path
          if (ele.children) {
            ele.children.forEach((child1: any) => {
              if (child1.path && child1.path !== '' && child1.path !== '/') {
                let specificity = 0;
                if (child1.path === currentUrl) specificity = 3;
                else if (this.router.isActive(child1.path, true)) specificity = 2;
                else if (this.router.isActive(child1.path, false)) specificity = 1;

                if (specificity > 0) {
                  // Prioritize higher specificity, then longer path
                  if (!bestMatch || specificity > bestMatch.specificity || (specificity === bestMatch.specificity && child1.path.length > (bestMatch.child1?.path?.length || bestMatch.ele.path.length || 0))) {
                    bestMatch = { element, ele, child1, specificity };
                  }
                }
              }
            });
          }
        });
      }
    });

    // 3. Apply the best match if found
    if (bestMatch) {
      this.setMenuHeaders((bestMatch as any).element, (bestMatch as any).ele, (bestMatch as any).child1);
      return;
    }

    if (currentUrl.startsWith('/visitors')) {
      for (const element of this.menuItems) {
        if (element.title !== 'Visitors' || element.type !== 'sub' || !element.children?.length) {
          continue;
        }
        const activeChild =
          element.children.find((child) => child.path === currentUrl) ||
          element.children.find((child) => child.path === '/visitors') ||
          element.children[0];
        if (activeChild) {
          this.setMenuHeaders(element, activeChild);
          return;
        }
      }
    }

    // 4. Fallback search (Truncated) - only if no specific match found
    const segments = currentUrl.split('/');
    if (segments.length > 1) {
      const truncatedUrl = '/' + segments[1];
      
      for (const element of this.menuItems) {
        if (element.children) {
          for (const ele of element.children) {
            if (ele.path === truncatedUrl) {
              element.active = !isHorizontal;
              element.selected = true;
              return;
            }
            if (ele.children) {
              for (const child1 of ele.children) {
                if (child1.path === truncatedUrl) {
                  element.active = !isHorizontal;
                  element.selected = true;
                  ele.active = !isHorizontal;
                  ele.selected = true;
                  return;
                }
              }
            }
          }
        }
      }
    }
  }

  // Helper to activate menu items and their parents
  setMenuHeaders(parent: any, child: any, subChild?: any) {
    const isHorizontal = document.documentElement.getAttribute('data-nav-layout') === 'horizontal';

    parent.active = !isHorizontal;
    parent.selected = true;
    child.active = !isHorizontal;
    child.selected = true;
    if (subChild) {
      subChild.active = !isHorizontal;
      subChild.selected = true;
    }
  }

  @ViewChild('iconContainer', { static: true }) iconContainer!: ElementRef;
  getSanitizedSVG(svgContent: string, menu: any): SafeHtml {
    const svg = this.renderer.createElement(
      'svg',
      'http://www.w3.org/2000/svg'
    );
    svg.innerHTML = svgContent;
    svg.classList.add('side-menu__icon');
    this.renderer.listen(svg, 'click', () => {
      this.toggleNavActive(menu);
    });
    // return svg;
    return this.sanitizer.bypassSecurityTrustHtml(svgContent);
  }
  ngOnDestroy() {
    if (this.menuitemsSubscribe$) {
      this.menuitemsSubscribe$.unsubscribe();
    }

    if (this.windowSubscribe$) {
      this.windowSubscribe$.unsubscribe();
    }
  }
  menuOpen() {
    const mainContent = document.querySelector('.main-content') as HTMLElement;

    if (localStorage['Ynexverticalstyles'] === 'icontext' && localStorage['iconText'] !== 'open') {
      // Assuming you have a service or method to update the theme
      this.updateTheme({ ...this.getCurrentTheme(), iconText: 'open' });

      mainContent?.addEventListener('click', (_event) => {
        // Assuming you have a service or method to update the theme
        this.updateTheme({ ...this.getCurrentTheme(), iconText: '' });
      });
    }

    if (localStorage['Ynexverticalstyles'] === 'doublemenu' && this.getCurrentTheme().dataToggled !== 'double-menu-open') {
      // Assuming you have a service or method to update the theme
      this.updateTheme({ ...this.getCurrentTheme(), dataToggled: 'double-menu-open' });
    }
  }

  // Replace this method with your actual method or service call to update the theme
  updateTheme(updatedTheme: any) {
    // Implement the logic to update the theme in your application
    // This might involve a service or a method that dispatches an action to update the theme state
    console.log('Update Theme:', updatedTheme);
  }

  // Replace this method with your actual method or service call to get the current theme
  getCurrentTheme(): any {
    // Implement the logic to get the current theme from your application state or service
    // Return the current theme object
    return {};
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.menuResizeFn();

    this.screenWidth = window.innerWidth;

    // Check if the event hasn't been triggered and the screen width is less than or equal to your breakpoint
    if (!this.eventTriggered && this.screenWidth <= 992) {
      document.documentElement?.setAttribute('data-toggled', 'close')


      // Trigger your event or perform any action here
      this.eventTriggered = true; // Set the flag to true to prevent further triggering
    } else if (this.screenWidth > 992) {
      // Reset the flag when the screen width goes beyond the breakpoint
      this.eventTriggered = false;
    }
  }
  WindowPreSize: number[] = [window.innerWidth];
  menuResizeFn(): void {
    this.WindowPreSize.push(window.innerWidth);

    if (this.WindowPreSize.length > 2) {
      this.WindowPreSize.shift();
    }

    if (this.WindowPreSize.length > 1) {
      const html = document.documentElement;

      if (this.WindowPreSize[this.WindowPreSize.length - 1] < 992 && this.WindowPreSize[this.WindowPreSize.length - 2] >= 992) {
        // less than 992
        html.setAttribute('data-toggled', 'close');
      }

      if (this.WindowPreSize[this.WindowPreSize.length - 1] >= 992 && this.WindowPreSize[this.WindowPreSize.length - 2] < 992) {
        // greater than 992
        html.removeAttribute('data-toggled');
        document.querySelector('#responsive-overlay')?.classList.remove('active');
      }
    }
  }


  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (document.documentElement.getAttribute('data-nav-layout') == 'horizontal') {
      if (this.elementRef.nativeElement.contains(event.target)) {
        // Clicked inside the menu - do nothing (let other handlers work)
      } else {
        // Clicked outside - close menu
        this.closeNavActive(); // Close menu
      }
    }
  }
}
