import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamNotificationsComponent } from './team-notifications.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { IHRMSUtilityDirectiveModule } from '@ihrms/shared';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    FlexLayoutModule,
    IHRMSUtilityDirectiveModule,
    NgxUiLoaderModule
  ],
  declarations: [
    TeamNotificationsComponent,
  ],
  exports: [
    TeamNotificationsComponent
  ]
})
export class TeamNotificationsModule {}
