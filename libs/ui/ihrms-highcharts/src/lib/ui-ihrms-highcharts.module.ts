import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IhrmsChartComponent } from './ihrms-chart/ihrms-chart.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { FlexLayoutModule } from '@angular/flex-layout';
import { IHRMSUtilityDirectiveModule } from '@ihrms/shared';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    IHRMSUtilityDirectiveModule,
    HighchartsChartModule,
    NgxUiLoaderModule
  ],
  declarations: [
    IhrmsChartComponent
  ],
  exports: [
    IhrmsChartComponent
  ]
})
export class UiIhrmsHighchartsModule {}
