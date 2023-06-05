import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { IHRMSUtilityDirectiveModule } from '@ihrms/shared';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { UiIhrmsDynamicFormsModule } from '@ihrms/ihrms-dynamic-forms';
import { AgmCoreModule } from '@agm/core';
import { IhrmsDialogComponent } from './ihrms-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    FlexLayoutModule,
    UiIhrmsDynamicFormsModule,
    IHRMSUtilityDirectiveModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAdyoUPM1ubli0K1kQfIWrVoZC_CgYwa3A',
    })
  ],
  declarations: [
    IhrmsDialogComponent,
  ],
  exports: [
    IhrmsDialogComponent
  ]
})
export class IhrmsDialogModule {}
