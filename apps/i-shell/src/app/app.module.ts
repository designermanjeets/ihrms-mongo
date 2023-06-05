/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient } from '@angular/common/http';

import { GraphQLModule } from './graphQL/graphql.module';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './routing/app-routing.module';
import { UiSharedModule } from '@ihrms/shared';

// @ngx-translate
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { IhrmsSidebarComponent, MenuItemComponent, UiIhrmsSidebarModule } from '@ihrms/ihrms-sidebar';
import { IhrmsNavbarComponent, UiIhrmsNavbarModule } from '@ihrms/ihrms-navbar';
import { CompanyNotificationsModule } from '@ihrms/ihrms-components';
import { IhrmsSearchComponent } from '@ihrms/ihrms-search';
import { NgxUiLoaderConfig, NgxUiLoaderModule, PB_DIRECTION, POSITION, SPINNER } from 'ngx-ui-loader';
import { authInterceptorProviders, cacheInterceptorProviders } from '@ihrms/auth';
import { MAT_DATE_LOCALE } from '@angular/material/core';


// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: "white",
  bgsOpacity: 1,
  fgsColor: "rgba(7,124,140, 1)",
  hasProgressBar: false,
  pbColor: "red",
  bgsPosition: POSITION.bottomCenter,
  bgsSize: 40,
  bgsType: SPINNER.rectangleBounce, // background spinner type
  fgsType: SPINNER.rectangleBounce, // foreground spinner type
  pbDirection: PB_DIRECTION.leftToRight, // progress bar direction
  pbThickness: 5, // progress bar thickness,
  overlayColor: "rgba(255, 255, 255, .9)",
  blur: 9,
};

@NgModule({
  declarations: [
    AppComponent,
    IhrmsSidebarComponent,
    MenuItemComponent,
    IhrmsNavbarComponent,
    IhrmsSearchComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    GraphQLModule,
    ToastrModule.forRoot(
      {
        timeOut: 10000,
        positionClass: 'toast-top-right',
        preventDuplicates: true,
        maxOpened: 5,
      }
    ),
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    AppRoutingModule,
    UiSharedModule,
    UiIhrmsSidebarModule,
    UiIhrmsNavbarModule,
    CompanyNotificationsModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
  ],
  providers: [
    authInterceptorProviders,
    cacheInterceptorProviders,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
