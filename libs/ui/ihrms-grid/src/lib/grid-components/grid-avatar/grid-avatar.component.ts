import { Component, SecurityContext } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { DomSanitizer, ɵDomSanitizerImpl } from '@angular/platform-browser';
import { environment } from '../../../../../../../apps/i-shell/src/environments/environment';

@Component({
  selector: 'ihrms-grid-avatar',
  templateUrl: './grid-avatar.component.html',
  styleUrls: ['./grid-avatar.component.scss']
})
export class GridAvatarComponent implements ICellRendererAngularComp {

  public params!: any;

  env = environment;

  constructor(
    protected _sanitizer: DomSanitizer,
    protected _sanitizerImpl: ɵDomSanitizerImpl
  ) { }

  agInit(params: any): void {
    this.params = params.value;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

  backgroundImg(headerImg: any = 'shiba1.jpg') {
    // raw URL
    const url = `${this.env.assetsURL}/${headerImg}`;
    // safe value type URL
    const safeUrl = this._sanitizer.bypassSecurityTrustResourceUrl(url as any);
    // sanitized back from safe value raw URL
    return this._sanitizerImpl.sanitize(SecurityContext.RESOURCE_URL, safeUrl);
  }

}
