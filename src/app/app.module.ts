import { NgModule } from '@angular/core';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContentLayoutComponent } from './shared/layouts/content-layout/content-layout.component';
import { SimplebarAngularModule } from 'simplebar-angular';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SwitcherComponent } from './shared/components/switcher/switcher.component';
import { ColorPickerModule, ColorPickerService } from 'ngx-color-picker';
import { PageHeaderComponent } from './shared/components/page-header/page-header.component';
import { AuthenticationLayoutComponent } from './shared/layouts/authentication-layout/authentication-layout.component';
import { TabToTopComponent } from './shared/components/tab-to-top/tab-to-top.component';
import { HoverEffectSidebarDirective } from './shared/directives/hover-effect-sidebar.directive';
import { FullscreenDirective } from './shared/directives/fullscreen.directive';
import { LandingSwitcherComponent } from './shared/components/landing-switcher/landing-switcher.component';
import { LandingLayoutComponent } from './shared/layouts/landing-layout/landing-layout.component';
import { NgxColorsModule } from 'ngx-colors';
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
@NgModule({
    declarations: [
        HeaderComponent,
        SidebarComponent,
        ContentLayoutComponent,
        SwitcherComponent,
        PageHeaderComponent,
        TabToTopComponent,
        FooterComponent,
        FullscreenDirective,
        HoverEffectSidebarDirective,
        AuthenticationLayoutComponent,
        LandingSwitcherComponent,
        LandingLayoutComponent,

    ],

    imports: [
        CommonModule,
        RouterModule,
        SimplebarAngularModule,
        FormsModule,
        ReactiveFormsModule,
        ColorPickerModule,
        TranslateModule.forRoot()
        // NgxColorsModule
    ],
    exports: [
        HeaderComponent,
        SidebarComponent,
        ContentLayoutComponent,
        SwitcherComponent,
        PageHeaderComponent,
        TabToTopComponent,
        FooterComponent,
        FullscreenDirective,
        HoverEffectSidebarDirective,
        AuthenticationLayoutComponent,
        LandingSwitcherComponent,
        LandingLayoutComponent,

    ],
    providers: [ColorPickerService, TranslateModule],
})

export class AppModule { }
