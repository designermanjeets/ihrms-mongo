import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Optional,
  Output
} from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { map, Subject, Subscription } from 'rxjs';
import { CONSTANTS } from '@ihrms/shared';
import { Apollo } from 'apollo-angular';
import { ToastrService } from 'ngx-toastr';
import { GQL_GET_ATTENDANCE_BY_DATE_WISE, GQL_GET_CLOCK_DATA, IhrmsComponentsService } from '../_services/ihrms-components.service';
import * as moment from 'moment';

@Component({
  selector: 'ihrms-todays-inout',
  templateUrl: './todays-inout.component.html',
  styleUrls: ['./todays-inout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodaysInoutComponent implements OnInit {

  @Input() set cardRadius(radius: number) {
    if(radius) {
      this._radius = radius;
    }
  };

  @Input() palette: string | undefined;

  @Input() compData:any | undefined;

  @Input() title: string | undefined;

  @Input() shift: string | undefined;

  @Input() updateComponent!: Subject<any>;

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onClickHandler: EventEmitter<any> = new EventEmitter<any>();

  public _radius: number | undefined;

  public randomLoader = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);

  constants = CONSTANTS;

  sub!: Subscription;
  isLoggedIn = false;
  loginInfo: { inTime: any, outTime: any, shift: string } = { inTime: null, outTime: null, shift: ''};

  constructor(
    private ngxService: NgxUiLoaderService,
    @Optional() public dialogRef: MatDialogRef<TodaysInoutComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public attendanceData: any,
    private cdRef: ChangeDetectorRef,
    private apollo: Apollo,
    private toastrService: ToastrService,
    private _ihrmscs: IhrmsComponentsService,
  ) { }

  ngOnInit(): void {

    this.ngxService.startLoader(this.randomLoader);

    setTimeout( () => this.ngxService.stopLoader(this.randomLoader), 1000);

    this.getAttendanceDateWise();

    this.updateComponent?.subscribe(val => {
      if (val) {
        // this.compData = val?.filter((item: any) => item.timeIn && item.userId)[0];
        this.cdRef.detectChanges();
      }
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  getAttendanceDateWise() {
    this.sub = this.apollo.watchQuery<any, any>({ 
      query: GQL_GET_ATTENDANCE_BY_DATE_WISE, 
      variables: { 
        query: { 
          limit: 10,
          userID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID,
          dates: { 
            gte: moment().startOf('day').format(),
          },
        }
      }
    }).valueChanges
      .pipe(map((data: any) => data?.data?.getAttendancesByDayWise[0]))
      .subscribe(val => {
        if(val && val.punchIn) {
          this.isLoggedIn = true;
          this.loginInfo.inTime = this._ihrmscs.getLocalTimeZone(val.date, val.punchIn);
          this.loginInfo.outTime = val.punchOut;
          this.loginInfo.shift = val.user_roster?.shifts.length && val.user_roster?.shifts[0];
        } else {
          this.isLoggedIn = false;
        }
        this.cdRef.detectChanges();
      });
  }

  onCorrectTime(event: any) {
    this.onClickHandler.emit({ data: { loginInfo: this.loginInfo, userID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID }, component: this, comp_name: CONSTANTS.IHRMS_IN_OUT_COMPONENT, action: CONSTANTS.REQUEST_CORRECTION });
  }

}
