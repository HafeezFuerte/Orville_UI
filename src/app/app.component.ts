import { ChangeDetectorRef, Component, NgZone, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TranslateloaderService } from './services/translateloader.service';
import { filter } from 'rxjs/operators';
// @ts-ignore
import { locale as englishjson } from '../../src/assets/i18n/en';
// @ts-ignore
import { locale as arabicjson } from '../../src/assets/i18n/ar';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
import { fromEvent } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from './components/common/store/login-auth-params/auth.selectors';
import { setAuthPropsData } from './components/common/store/login-auth-params/auth.actions';
import { CommonService } from './services/common.service';
import { LoaderService } from './services/loader.service';
import { OvModalPortalService } from './shared/services/ov-modal-portal.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: []
})
export class AppComponent implements OnInit {
  title = 'Orville';
  public isSpinner = true;
  loading$ = this.loaderService.loading$;
  private readonly modalPortal = inject(OvModalPortalService);
  private readonly zone = inject(NgZone);

  constructor(public translate: TranslateService, private cdr: ChangeDetectorRef, private translateloader: TranslateloaderService,
    private router: Router, private loaderService: LoaderService,
    private store: Store, private commonService: CommonService
  ) {}
  ngOnInit() {
    // Portal nested modal backdrops to body (header/sidebar + sticky table z-index fix)
    this.modalPortal.start(this.zone);

    // 🟢 Reset scroll to top on every navigation end globaly
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      window.scrollTo(0, 0);
    });

    this.translateloader.loadTranslations(englishjson, arabicjson);
    const savedLang = localStorage.getItem("selectedLang");
    this.translate.use(savedLang ? savedLang.toUpperCase() : 'EN');
    // this.translateloader.currentLang$.subscribe((lang:any) => {
    //   if (!lang) return;
    //   this.translate.use(lang);
    // });


    // this.isSpinner = false
    // fromEvent(window, 'load').subscribe(() => {document.querySelector('#loader')?.classList.remove('');});
  }
  setLanguage(n: any) {
    localStorage.setItem("selectedLang", n),
      this.translate.use(n.toUpperCase() || "EN")
  }
}
