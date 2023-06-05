import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { IHRMSUtilityDirectiveModule } from '@ihrms/shared';
import { MatCardModule } from '@angular/material/card';
import { IhrmsDashbaordAllComponent } from './ihrms-dashbaord-all.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    FlexLayoutModule,
    IHRMSUtilityDirectiveModule,
    MatIconModule
  ],
  declarations: [
    IhrmsDashbaordAllComponent,
  ],
  exports: [
    IhrmsDashbaordAllComponent
  ]
})
export class IhrmsDashboardAllModule {}
