import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { IHRMSUtilityDirectiveModule } from '@ihrms/shared';
import { UiIhrmsDynamicFormsModule } from '@ihrms/ihrms-dynamic-forms';
import { MyProfileComponent } from './my-profile.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { UiIhrmsGridModule } from '@ihrms/ihrms-grid';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatStepperModule,
    MatButtonModule,
    UiIhrmsDynamicFormsModule,
    IHRMSUtilityDirectiveModule,
    UiIhrmsGridModule,
    MatDialogModule,
    NgxUiLoaderModule
  ],
  declarations: [
    MyProfileComponent,
  ],
  exports: [
    MyProfileComponent
  ]
})
export class MyProfileModule {}
