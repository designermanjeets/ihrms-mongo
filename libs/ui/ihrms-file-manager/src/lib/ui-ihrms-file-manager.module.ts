import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { ButtonModule, CheckBoxModule   } from '@syncfusion/ej2-angular-buttons';
import { ContextMenuModule ,ToolbarModule  } from '@syncfusion/ej2-angular-navigations';
import { FileManagerAllModule } from '@syncfusion/ej2-angular-filemanager';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { IhrmsFileManagerComponent } from './ihrms-file-manager/ihrms-file-manager.component';

@NgModule({
  imports: [
    CommonModule,
    FileManagerAllModule, 
    UploaderModule , 
    DialogModule, 
    CheckBoxModule, 
    ButtonModule, 
    DropDownListModule, 
    CommonModule, 
    ContextMenuModule, 
    ToolbarModule
  ],
  declarations: [
    IhrmsFileManagerComponent
  ],
  exports: [
    IhrmsFileManagerComponent
  ]
})
export class FileManagerModule {}
