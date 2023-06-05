import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { IHRMSUtilityDirectiveModule } from '@ihrms/shared';
import { NextpayrollComponent } from './nextpayroll.component';
import { MatIconModule } from '@angular/material/icon';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    FlexLayoutModule,
    MatIconModule,
    IHRMSUtilityDirectiveModule,
    NgxUiLoaderModule
  ],
  declarations: [
    NextpayrollComponent,
  ],
  exports: [
    NextpayrollComponent
  ]
})
export class NextPayrollModule {}
