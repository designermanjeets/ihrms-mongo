import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { TeamNotifications } from '@ihrms/admin-dashboard';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'ihrms-team-notifications',
  templateUrl: './team-notifications.component.html',
  styleUrls: ['./team-notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamNotificationsComponent implements OnInit {

  @Input() set cardRadius(radius: number) {
    if(radius) {
      this._radius = radius;
    }
  };

  @Input() palette: string | undefined;

  @Input() compData: TeamNotifications[] | undefined;

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onClickHandler: EventEmitter<any> = new EventEmitter<any>();

  public _radius: number | undefined;

  public randomLoader = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);

  constructor(
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit(): void {

    this.ngxService.startLoader(this.randomLoader);

    setTimeout( () => this.ngxService.stopLoader(this.randomLoader), 1000);
  }

}
