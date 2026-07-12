import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { RouterOutlet, provideRouter, withInMemoryScrolling } from '@angular/router';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations'
import { App_Route } from './app.routes';
import { ColorPickerModule, ColorPickerService } from 'ngx-color-picker';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ToastrModule } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';
import { FlatpickrModule } from 'angularx-flatpickr';
import { TranslateModule } from "@ngx-translate/core";
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomPaginatorIntl } from './shared/services/custom-paginator-intl.service';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { provideStore } from '@ngrx/store';
import { commonReducer } from './components/common/store/common-payload/common.reducer';
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(App_Route, withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })), RouterOutlet, provideHttpClient(), ColorPickerModule, ColorPickerService, provideAnimations(), AngularFireModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
  { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl },
  provideStore({
    common: commonReducer
  }),
  importProvidersFrom(
    FlatpickrModule.forRoot(),
    TranslateModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    ToastrModule.forRoot({
      timeOut: 3000,
      closeButton: true,
      progressBar: true,
      positionClass: 'toast-top-right'
    }),
    SweetAlert2Module.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    })
  ),]
};



