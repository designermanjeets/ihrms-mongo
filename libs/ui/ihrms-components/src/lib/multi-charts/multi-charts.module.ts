/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { IHRMSUtilityDirectiveModule } from '@ihrms/shared';
import { MatIconModule } from '@angular/material/icon';
import { MultiChartsComponent } from './multi-charts.component';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UiIhrmsHighchartsModule } from '@ihrms/ihrms-highcharts';
import { UiIhrmsGridModule } from '@ihrms/ihrms-grid';
import { IhrmsFiltersModule } from '../ihrms-filters/ihrms-filters.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { IhrmsListItemsModule } from '../ihrms-list-items/ihrms-list-items.module';
import { UiIhrmsPivotModule } from '@ihrms/ihrms-pivot';
import { FileManagerModule } from '@ihrms/file-manager';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    UiIhrmsHighchartsModule,
    UiIhrmsGridModule,
    IhrmsFiltersModule,
    IHRMSUtilityDirectiveModule,
    NgxUiLoaderModule,
    IhrmsListItemsModule,
    UiIhrmsPivotModule,
    FileManagerModule,
    MatButtonModule
  ],
  declarations: [
    MultiChartsComponent,
  ],
  exports: [
    MultiChartsComponent
  ]
})
export class MultiChartsModule {}
