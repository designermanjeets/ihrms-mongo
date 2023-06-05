import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IhrmsGridsterComponent } from './ihrms-gridster/ihrms-gridster.component';
import { GridsterModule } from 'angular-gridster2';
import { DynamicModule } from 'ng-dynamic-component';

@NgModule({
  imports: [
    CommonModule,
    GridsterModule,
    DynamicModule,
  ],
  declarations: [
    IhrmsGridsterComponent
  ],
  exports:[
    IhrmsGridsterComponent
  ]
})
export class UiIhrmsGridsterModule {}
