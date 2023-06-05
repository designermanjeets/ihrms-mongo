import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SecurityContext
} from '@angular/core';
import { NotificationItem } from './_models/notification.model';
import { DomSanitizer, ɵDomSanitizerImpl } from '@angular/platform-browser';
import { NotificationConfig } from './_models/notification-config';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'ihrms-company-notifications',
  templateUrl: './company-notifications.component.html',
  styleUrls: ['./company-notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyNotificationsComponent implements OnInit {

  @Input() set cardRadius(radius: number) {
    if(radius) {
      this._radius = radius;
    }
  };

  @Input() palette: string | undefined;

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onClickHandler: EventEmitter<any> = new EventEmitter<any>();

  public _radius: number | undefined;

  @Input() sideBarWidth: number | undefined;
  @Input() notificationItems: NotificationItem[] = [];
  @Input() config!: NotificationConfig;

  @Output() closeNotificationEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  public randomLoader = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);

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
    const url = `${'http://localhost:4200/assets/' + headerImg}`;
    // safe value type URL
    const safeUrl = this._sanitizer.bypassSecurityTrustResourceUrl(url as any);
    // sanitized back from safe value raw URL
    return this._sanitizerImpl.sanitize(SecurityContext.RESOURCE_URL, safeUrl);
  }

  closeNotificationBar() {
    this.closeNotificationEvent.emit();
  }

}
