import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { IHRMSUtilityDirectiveModule } from '@ihrms/shared';
import { MyOrgComponent } from './my-org.component';
import { MatCardModule } from '@angular/material/card';
import { UiIhrmsHighchartsModule } from '@ihrms/ihrms-highcharts';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatCardModule,
    UiIhrmsHighchartsModule,
    IHRMSUtilityDirectiveModule
  ],
  declarations: [
    MyOrgComponent,
  ],
  exports: [
    MyOrgComponent,
  ]
})
export class MyOrgModule {}
