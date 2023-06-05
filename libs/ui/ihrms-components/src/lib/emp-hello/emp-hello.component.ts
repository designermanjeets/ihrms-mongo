import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CONSTANTS, IHRMSUtilityDirective } from '@ihrms/shared';
import * as moment from 'moment';
import { GQL_GET_ATTENDANCE_BY_DATE_WISE, GQL_GET_CLOCK_DATA, GQL_WEB_CLOCK_IN_OUT, IhrmsComponentsService } from '../_services/ihrms-components.service';
import { map, Subscription } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { User } from '@ihrms/auth';
import { Apollo } from 'apollo-angular';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'ihrms-emp-hello',
  templateUrl: './emp-hello.component.html',
  styleUrls: ['./emp-hello.component.scss'],
  providers: [IHRMSUtilityDirective]
})

export class EmpHelloComponent implements OnInit, OnDestroy {

  public randomLoader = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);

  constructor(
    private _ihrmscs: IhrmsComponentsService,
    private ngxService: NgxUiLoaderService,
    private cdRef: ChangeDetectorRef,
    private apollo: Apollo,
    private toastrService: ToastrService,
  ) { }

  @Input() set cardRadius(radius: number) {
    if (radius) {
      this._radius = radius;
    }
  };

  @Input() palette: string | undefined;

  @Input() component!: string;

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onClickHandler: EventEmitter<any> = new EventEmitter<any>();

  public _radius: number | undefined;

  constants = CONSTANTS;

  sub!: Subscription;

  isLoggedIn = false;
  isLoggedOut = false;
  user!: User;
  loginInfo: { inTime: any, outTime: any } = { inTime: null, outTime: null};

  currTime = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");

  ngOnInit(): void {

    this.user = JSON.parse(sessionStorage.getItem('auth-user') || '');

    this.getClockInOutData();

    setInterval(this.clockUpdate.bind(this), 1000);
  }

  clockUpdate() {
    this.currTime = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  getClockInOutData() {
    this.sub = this.apollo.watchQuery<any, any>({ 
      query: GQL_GET_ATTENDANCE_BY_DATE_WISE, 
      variables: {
        query: {
          dates: { gte: moment().startOf('day').format() },
          userID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID,
        }}
      }).valueChanges
      .pipe(map((data: any) => data?.data?.getAttendancesByDayWise[0]))
      .subscribe((res: any) => {
        if(res) {
          this.loginInfo.inTime = res.punchIn && this._ihrmscs.getLocalTimeZone(res.date, res.punchIn);
          this.loginInfo.outTime = res.punchOut && this._ihrmscs.getLocalTimeZone(res.date, res.punchOut);
          sessionStorage.getItem('isLoggedIn') ? this.isLoggedIn = true: this.isLoggedIn = false;
        }
    })
  }

  onButtonClicks($event: any, action: string) {
    if (action === CONSTANTS.TITLES.Attendance) {
      const clockData = {
        userId: this.user.userID,
        eCode: this.user.eCode,
        inTime: !this.isLoggedIn ? Date.now(): null, 
        outTime: this.isLoggedIn ? Date.now(): null
      }
      this.sub = this.apollo.mutate({ mutation: GQL_WEB_CLOCK_IN_OUT, variables: clockData, })
        .pipe(map((data: any) => data?.data.createAttendance))
        .subscribe((res: any) => {
          // this.loginInfo.inTime = res.inTime && moment(res.inTime).add(res.inTime, 'hours').format('hh:mm:ss a') as any;
          this.loginInfo.outTime = res.outTime && moment(res.outTime).add(res.outTime, 'hours').format('hh:mm:ss a') as any;
          if(res.inTime) {
            sessionStorage.setItem('isLoggedIn', res.inTime.toString())
          } else {
            sessionStorage.removeItem('isLoggedIn');
          };
          this.getClockInOutData();
        });
    }
    this.onClickHandler.emit({ $event, fun: 'onButtonClicks', action })
  }

}
