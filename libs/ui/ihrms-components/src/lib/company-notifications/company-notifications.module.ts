import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { IHRMSUtilityDirectiveModule } from '@ihrms/shared';
import { MatCardModule } from '@angular/material/card';
import { CompanyNotificationsComponent } from './company-notifications.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule,
    MatMenuModule,
    MatDividerModule,
    IHRMSUtilityDirectiveModule,
    NgxUiLoaderModule
  ],
  declarations: [
    CompanyNotificationsComponent,
  ],
  exports: [
    CompanyNotificationsComponent
  ]
})
export class CompanyNotificationsModule {}
