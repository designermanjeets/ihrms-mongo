import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { IHRMSUtilityDirectiveModule } from './_directives/ihrms-utilities.directive';

// @ngx-translate
import { TranslateModule } from '@ngx-translate/core';
import { SidebarModule } from 'ng-sidebar';
import { authInterceptorProviders } from '@ihrms/auth';
import { NgxUploaderModule } from 'ngx-uploader';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    FlexLayoutModule,
    SidebarModule,
    IHRMSUtilityDirectiveModule,
    NgxUploaderModule
  ],
  exports: [
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    FlexLayoutModule,
    SidebarModule,
    IHRMSUtilityDirectiveModule,
    NgxUploaderModule
  ],
  declarations: [ ]
})
export class UiSharedModule {}
