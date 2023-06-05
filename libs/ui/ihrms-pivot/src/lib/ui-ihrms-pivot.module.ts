import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SyncfusionPivotComponent } from './syncfusion-pivot/syncfusion-pivot.component';

// @syncfusion Components
import { CheckBoxAllModule, RadioButtonAllModule, ButtonAllModule } from '@syncfusion/ej2-angular-buttons';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { NumericTextBoxAllModule } from '@syncfusion/ej2-angular-inputs';
import { PivotFieldListAllModule } from '@syncfusion/ej2-angular-pivotview';
import { PivotViewAllModule } from '@syncfusion/ej2-angular-pivotview';

@NgModule({
  imports: [
    CommonModule,
    CheckBoxAllModule,
    RadioButtonAllModule,
    ButtonAllModule,
    ToolbarModule,
    NumericTextBoxAllModule,
    PivotFieldListAllModule,
    PivotViewAllModule
  ],
  exports: [SyncfusionPivotComponent],
  declarations: [SyncfusionPivotComponent],
})
export class UiIhrmsPivotModule {}
