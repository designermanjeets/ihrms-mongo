import { Component, ViewEncapsulation, ViewChild, OnInit, Input, AfterViewInit  } from '@angular/core';
import { FileManagerComponent, NavigationPaneService, ToolbarService, DetailsViewService } from '@syncfusion/ej2-angular-filemanager';
import { DropDownButton, ItemModel } from '@syncfusion/ej2-splitbuttons';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ihrms-file-manager',
  templateUrl: './ihrms-file-manager.component.html',
  styleUrls: ['./ihrms-file-manager.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ NavigationPaneService, ToolbarService, DetailsViewService]
})
export class IhrmsFileManagerComponent implements OnInit, AfterViewInit {

  @Input() fileManagerConfig: any;
  
  //DropDownButton items definition
  public items: ItemModel[] = [{ text: 'Folder' }, { text: 'Files' }];

  @ViewChild('fileObj')

  public fileObj!: FileManagerComponent;
  public ajaxSettings!: object;
  public hostUrl = 'https://ihrmstorage.blob.core.windows.net/ihrms-blob-container?si=192.168.1.67&sip=192.168.1.67&sv=2022-11-02&sr=c&sig=k9hoS%2Bzgi9uNYXxl1pnGiwjQQe0gpidp6%2BSFeWZkvGo%3D';

  public ngOnInit(): void {
    this.ajaxSettings = {
      url: this.hostUrl + 'api/AzureProvider/AzureFileOperations',
    };
  }

  ngAfterViewInit(): void {
      console.log(this.fileManagerConfig);
  }

  onSuccess(args: any) {
    if (!document.getElementById("file_tb_upload")?.classList.contains("e-dropdown-btn")) {
      const customBtn: HTMLElement | any = document.getElementById('file_tb_upload');
      customBtn.onclick = (e: any) => {
        e.stopPropagation();
      };
      const drpDownBtn: DropDownButton = new DropDownButton(
        {
          items: this.items,
          select: (args) => {
            if (args.item.text === 'Folder') {
              this.fileObj.uploadSettings.directoryUpload = true;
            } else {
              this.fileObj.uploadSettings.directoryUpload = false;
            }
            setTimeout(function () {
              const uploadBtn: HTMLElement | any = document.querySelector(
                '.e-file-select-wrap button'
              );
              uploadBtn.click();
            }, 100);
          },
        },
        '#file_tb_upload'
      );
    }
  }
}
