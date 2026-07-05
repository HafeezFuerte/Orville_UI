import { Component, ViewChild, ElementRef, Renderer2, HostListener } from '@angular/core';
import { Menu, NavService } from '../../services/nav.service';
import { Subscription, fromEvent, map, tap } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { checkHoriMenu, switcherArrowFn } from './sidebar';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../../../services/common.service';
interface PageMenu {
  menuID: number;
  menuName: string;
  parent_id:number;
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
}


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})

export class SidebarComponent {
  localStorage: any;
  // Addding sticky-pin
  scrolled = false;
  screenWidth: number;
  eventTriggered: boolean = false;
  public localdata = localStorage;
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
    private elementRef: ElementRef
  ) {
    this.screenWidth = window.innerWidth;
  }

 
  ngOnInit(): void { 
    const loggedInEmpId = Number(localStorage.getItem('userId')) || 120; // Fallback to 120 temporarily if not present depending on env

    const body = {  
  "userid": loggedInEmpId,
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
            const path = this.urlNameMap[normalizedName] || this.urlMap[page.url] || '';

            return {
              title: page.menuName,
              type: 'link',
              path: path,
              icon: this.moduleIconMap[normalizedName] || 'bx bx-circle',
              active: false,
              selected: false,
            };
          }) || [];
        } else {
          // 🔵 Standard multi-level logic
          this.menuItems = modules.map((module: Module) => {
            if(module.menuGroup[0].pages.length==0)
            {
              return {
                title: module.moduleName,
                type: 'link',
                path: module.url,
                icon: 'bx bx-circle',
                active: false,
                selected: false,
              };
            }
            else
            return {
              title: module.moduleName,
              type: 'sub',
              selected: false,
              active: false,
              icon: this.moduleIconMap[module.moduleName] || 'bx bx-layer',
              children: module.menuGroup?.map((group: MenuGroup) => {
                return {
                  title: group.mainMenuName,
                  type: 'sub',
                  selected: false,
                  active: false,
                  children: group.pages?.map((page: PageMenu) => {
                    const normalizedName = page.menuName.trim();
                    let path = this.urlNameMap[normalizedName]; 
                    if (!path) {
                      const lowerName = normalizedName.toLowerCase();
                      const matchingKey = Object.keys(this.urlNameMap).find(k => k.toLowerCase() === lowerName);
                      if (matchingKey) {
                        path = this.urlNameMap[matchingKey];
                      }
                    }

                    if (!path) {
                      path = this.urlMap[page.url];
                    }

                    return {
                      title: page.menuName,
                      type: 'link',
                      path: path || '',
                      active: false,
                      selected: false,
                    };
                  }) || [],
                };
              }) || [],
            };
          });

          // 🟢 Reorder: Move 'Employee Portal' to the top (only for multi-level)
          const portalIndex = this.menuItems.findIndex(m => m.title === 'Employee Portal');
          if (portalIndex > 0) {
            const [portalModule] = this.menuItems.splice(portalIndex, 1);
            this.menuItems.unshift(portalModule);
          }
        }

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
  };




  private urlMap: { [key: string]: string } = {

    'leases manaement': '/leases', 
  };

  private urlNameMap: { [key: string]: string } = {
    'Properties': '/properties',
    'Units': '/units',
    'Rooms': '/rooms',
    'Tenants': '/tenants',
    'Vendors': '/vendors',
    'Landlords': '/landlords', 
  };



  //Active Nav State
  setNavActive(item: any) {
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
    } else {
    }


    if (!item.active) {
      this.menuItems?.forEach((a: any) => {
        if (this.menuItems.includes(item)) {
          a.active = false;
        }
        a?.children?.forEach((b: any) => {
          if (a.children.includes(item)) {
            b.active = false;
          } else {
            b.active = false;
          }
          b?.children?.forEach((c: any) => {
            if (b.children.includes(item)) {
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
          if (ele.path) {
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
              if (child1.path) {
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