import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpHelloComponent } from './emp-hello.component';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { IHRMSUtilityDirectiveModule } from '@ihrms/shared';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    FlexLayoutModule,
    MatButtonModule,
    IHRMSUtilityDirectiveModule,
    NgxUiLoaderModule
  ],
  declarations: [
    EmpHelloComponent,
  ],
  exports: [
    EmpHelloComponent
  ]
})
export class EmpHelloModule {}
