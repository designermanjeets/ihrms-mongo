import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SecurityContext,
  ViewChild
} from '@angular/core';
import { notificationItems } from './_models';
import { NotificationItem } from '../company-notifications/_models/notification.model';
import { NotificationConfig } from '../company-notifications/_models/notification-config';
import { User } from '@ihrms/auth';
import { DomSanitizer, ɵDomSanitizerImpl } from '@angular/platform-browser';
import { environment } from '../../../../../../apps/i-shell/src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'ihrms-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreatePostComponent implements OnInit {

  @Input() set cardRadius(radius: number) {
    if(radius) {
      this._radius = radius;
    }
  };

  @Input() palette: string | undefined;

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onClickHandler: EventEmitter<any> = new EventEmitter<any>();

  public _radius: number | undefined;

  public randomLoader = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);

  notificationItems: NotificationItem[]  = notificationItems;
  config: NotificationConfig = {
    title: 'Posts',
    closeable: false,
    flatInsideCard: true,
    height: 70
  };

  user: User = {
    username: 'John Doe',
    userImg: 'shiba1.jpg'
  };

  env = environment;

  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFile: File | undefined;

  constructor(
    protected _sanitizer: DomSanitizer,
    protected _sanitizerImpl: ɵDomSanitizerImpl,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit(): void {

    this.ngxService.startLoader(this.randomLoader);

    setTimeout( () => this.ngxService.stopLoader(this.randomLoader), 1000);
  }

  backgroundImg(headerImg: any) {
    // raw URL
    const url = `${this.env.assetsURL}/${headerImg}`;
    // safe value type URL
    const safeUrl = this._sanitizer.bypassSecurityTrustResourceUrl(url as any);
    // sanitized back from safe value raw URL
    return this._sanitizerImpl.sanitize(SecurityContext.RESOURCE_URL, safeUrl);
  }

  uploadFileEvt(imgFile: any) {
    this.selectedFile = imgFile.target.files[0];
    console.log(this.selectedFile);
    if (imgFile.target.files && imgFile.target.files[0]) {
      // Do some Stuff
    }
  }

}
