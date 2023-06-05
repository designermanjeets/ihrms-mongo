import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { IHRMSUtilityDirectiveModule } from '@ihrms/shared';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { TodaysInoutComponent } from './todays-inout.component';
import { MatIconModule } from '@angular/material/icon';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    FlexLayoutModule,
    MatIconModule,
    IHRMSUtilityDirectiveModule,
    NgxUiLoaderModule
  ],
  declarations: [
    TodaysInoutComponent,
  ],
  exports: [
    TodaysInoutComponent
  ]
})
export class TodaysInoutModule {}
