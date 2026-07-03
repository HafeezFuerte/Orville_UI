import { ChangeDetectorRef, Component } from '@angular/core';
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
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: []
})
export class AppComponent {
  title = 'ynex';
  public isSpinner = true;
  constructor(public translate: TranslateService, private cdr: ChangeDetectorRef, private translateloader: TranslateloaderService,
    private router: Router
  ) { }
  ngOnInit() {
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
