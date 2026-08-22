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
              icon: page.menu_icon || this.moduleIconMap[normalizedName] || 'bx bx-circle',
              active: false,
              selected: false,
            };
          }) || [];
        } else {
          // 🔵 Standard multi-level logic
          this.menuItems = modules.map((module: Module) => this.mapModuleToMenu(module));

          // 🟢 Extract Settings items from separate Level 1 Modules in DB
          const settingsModules = modules.filter(m => m.jsonLabel?.trim() === 'Settings' || m.moduleName.trim() === 'Settings');
          if (settingsModules.length > 0) {
            this.settingsMenuItems = settingsModules.map((mod: Module) => {
              const normalizedName = mod.moduleName.trim();
              let path = this.urlNameMap[normalizedName] || this.urlMap[mod.url] || mod.url || '';
              return {
                title: mod.moduleName,
                type: 'link',
                path: path,
                icon: mod.menu_icon || 'bx-circle',
                active: false,
                selected: false
              };
            });
            // Filter out settings items from the main menuItems list
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

        // Add Settings menu item at the end
        this.menuItems.push({
          title: 'Settings',
          type: 'link',
          path: '/settings/company-details',
          icon: 'bx-cog',
          active: false,
          selected: false
        });

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
          icon: module.menu_icon || this.moduleIconMap[normalizedName] || 'bx bx-layer',
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
      const path = this.resolveMenuPath(normalizedName, undefined, module.url) || '/leases';
      if (this.isLeaseModule(normalizedName)) {
        return {
          title: module.moduleName,
          type: 'sub',
          selected: false,
          active: false,
          icon: module.menu_icon || this.moduleIconMap[normalizedName] || 'bx bx-layer',
          children: [
            {
              title: 'Leases',
              type: 'link',
              path,
              active: false,
              selected: false,
            },
          ],
        };
      }

      return {
        title: module.moduleName,
        type: 'link',
        path: this.resolveMenuPath(normalizedName, undefined, module.url) || '',
        icon: module.menu_icon || this.moduleIconMap[normalizedName] || 'bx bx-circle',
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

    return {
      title: this.isVisitorsParent(normalizedName) ? 'Visitors' : module.moduleName,
      type: 'sub',
      selected: false,
      active: false,
      icon: module.menu_icon || this.moduleIconMap[normalizedName] || 'bx bx-layer',
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
    'Download': '/downloads',
    'Downloads': '/downloads',
    'Download Center': '/downloads',
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


  switchToSettingsMenu() {
    this.isSettingsMode = true;
    this.menuItems = [
      {
        title: 'Back to Main Menu',
        type: 'link',
        path: '/insights',
        icon: 'bx-arrow-back',
        active: false,
        selected: false
      },
      ...this.settingsMenuItems
    ];
  }

  restoreMainMenu() {
    this.isSettingsMode = false;
    this.menuItems = [...this.originalMenuItems];
  }

  //Active Nav State
  setNavActive(item: any) {
    if (item.title === 'Settings') {
      this.switchToSettingsMenu();
      const firstItem = this.menuItems.find(m => m.title === 'Company details');
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
