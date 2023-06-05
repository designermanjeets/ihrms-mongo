import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { BehaviorSubject, map, Observable, Subject, Subscription, zip } from 'rxjs';
import { EmpAttendanceService, GQL_ATTENDANCES_REQUESTS, GQL_GET_ATTENDANCE_BY_DATE_WISE, GQL_GET_ATTENDANCE_REQUEST_BY_DATE_WISE, GQL_TODAYS_ATTENDANCES_DAY_ALL_USERS_AVG } from './_services/emp-attendance.service';
import { MultiChartsComponent, TodaysInoutComponent } from '@ihrms/ihrms-components';
import * as Highcharts from 'highcharts';
import { IhrmsGridComponent } from '@ihrms/ihrms-grid';
import * as moment from 'moment';
import * as _ from 'lodash';
import { NavigationExtras, Router } from '@angular/router';
import { CONSTANTS } from '@ihrms/shared';
import { IhrmsEmpDashboardService } from '../_services/ihrms-emp-dashboard.service';
import { MatDialog } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'ihrms-emp-attendance',
  templateUrl: './emp-attendance.component.html',
  styleUrls: ['./emp-attendance.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmpAttendanceComponent implements OnInit, AfterViewInit {

  highcharts: typeof Highcharts = Highcharts;
  gridsterOptions: GridsterConfig;
  cardSize = 500;
  gridLoaded = false;
  dashboardItems: Array<GridsterItem> | any;
  gridResize: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  multiChartData: any | undefined;

  sub!: Subscription;

  rowDataAttendanceRequests!: any;
  updateComponent$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  getUserAttendanceDateWise$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  updateCharts$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  isLoggedIn!: any;

  constructor(
    private cdRef: ChangeDetectorRef,
    private _eas: EmpAttendanceService,
    private router: Router,
    public dialog: MatDialog,
    private _ihrmsempss: IhrmsEmpDashboardService,
    private apollo: Apollo
  ) {
    this.gridsterOptions = this._eas.getGridsterOptions(this.cardSize, this);
  }

  ngOnInit(): void {

    this.multiChartData = [
      {
        title: CONSTANTS.TITLES.RecentAttendance,
        columnFit: false,
        gridData: {
          columnDefs: this._eas.getAttendanceColDefs(this.outputActions, this),
          rowData: [],
          updateGridFromOutside: this.getUserAttendanceDateWise$
        },
        flex: 100,
        height: 45,
        marginBottom: 20,
        mobileFlexInPx: 300 
      },
      {
        title: CONSTANTS.TITLES.Attendance,
        series: {
          config: {
            innerSize: 80,
            depth: 45,
            alpha: 45
          },
          name: 'Days',
          type: 'pie',
          data: [],
          updateChartFromOutside: this.updateCharts$,
        },
        flex: 48,
        height: 50
      },
      {
        title: 'Avg. Working hours',
        series: {
          config: {
            alpha: 15,
            beta: 15,
            depth: 50,
            viewDistance: 45
          },
          name: 'Working hours',
          type: 'cylinder',
          data: [],
          updateChartFromOutside: this.updateCharts$,
        },
        xAxisCategories: [],
        flex: 48,
        height: 50
      },
    ];

    this.setupDashboardItems();

    this.getAttendanceDateWise();

    this.getAttendanceRequestAll();

    this.getAttendanceOverview();

    this.getAvgWorkingHours();

  }

  ngAfterViewInit() {
    this.gridLoaded = true;
    this.cdRef.detectChanges();
  }

  getAttendanceRequestAll() {
    this.sub = this.apollo.watchQuery<any, any>({ 
      query: GQL_ATTENDANCES_REQUESTS, 
      variables: { 
        query: { 
          limit: 100,
          dates: {
            // gte: moment(moment.now()).format('DD-MM-YYYY') // Need All Previous "Pending" Ones
          },
          userID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID,
        }
      }})
      .valueChanges
      .pipe(map((data: any) => data?.data?.getAttendanceRequests))
      .subscribe(val => {
        if(val) {
          this.updateComponent$.next({ action: CONSTANTS.UPDATE, rowData: val });
        }
      });
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
      .pipe(map((data: any) => data?.data?.getAttendancesByDayWise))
      .subscribe(val => this.getUserAttendanceDateWise$.next({ action: CONSTANTS.UPDATE, rowData: val }));
  }

  getAvgWorkingHours() {
    this.sub = this.apollo.watchQuery<any, any>({ 
      query: GQL_TODAYS_ATTENDANCES_DAY_ALL_USERS_AVG, 
      variables: { 
        query: { 
          limit: 100,
          userID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID,
          dates: {
            gte: moment().startOf('month').format(),
            lt: moment().endOf('month').format()
          }
        }
      }})
      .valueChanges
      .pipe(map((data: any) => data?.data?.getAttendancesByDayWiseAllUsersAvg))
      .subscribe(val => {
        if(val) {
          const avgPieData: any = [];
          val.forEach((avg: any, idx: number) => avgPieData.push(avg.totalHoursAvg))
          this.multiChartData[2].series = Object.assign({ }, this.multiChartData[2].series, { data: [avgPieData] });
        }
      });
  }

  getAttendanceOverview() {
    this.sub = this.apollo.watchQuery<any, any>({ 
      query: GQL_GET_ATTENDANCE_REQUEST_BY_DATE_WISE, 
      variables: { 
        query: { 
          limit: 10,
          userID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID,
          dates: {
            gte: moment().startOf('month').format(),
            lt: moment().endOf('month').format()
          }
        }
      }
    }).valueChanges
      .pipe(map((data: any) => data?.data?.getAttendanceRequestsByDayWise))
      .subscribe(val => {
        if(val) {
          console.log(val);
          const clean: any = [];
          const pieData = _.omit(Object.assign({}, _.countBy(val, 'attendanceType'), _.countBy(val, 'leaveTypeName')), ['undefined']);
          _.forEach(pieData, (val, key) => clean.push([key, val]));
          this.multiChartData[1].series = Object.assign({ }, this.multiChartData[1].series, { data: clean });
        }
      });
  }

  outputActions(event: any) {
    if(event.action === CONSTANTS.REQUEST_CORRECTION) {
      const rowData = _.cloneDeep(event);
      rowData.data.data.shiftName = rowData.data.data.user_roster?.shifts.length && rowData.data.data.user_roster?.shifts[0];
      rowData.data.data.punchIn = rowData.data?.data?.punchIn && this._ihrmsempss.getLocalTimeZone(rowData.data?.data?.date, rowData.data?.data?.punchIn);
      rowData.data.data.punchOut = rowData.data?.data?.punchOut && this._ihrmsempss.getLocalTimeZone(rowData.data?.data?.date, rowData.data?.data?.punchOut);
      this._eas.outputActions(rowData, this._eas, this.dialog, this.sub, this.getUserAttendanceDateWise$);
    }
  }

  setupDashboardItems() {

    this.dashboardItems = [
      {
        dynamicComponent: TodaysInoutComponent,
        gridsterItem: { cols: 1, rows: 1, y: 0, x: 0 },
        inputs: {
          cardRadius: 20,
          title: CONSTANTS.TITLES.TodaysAttendance,
          compData: this.isLoggedIn,
          updateComponent: this.updateCharts$
        },
        outputs: {
          onClickHandler: { handler: this.dynamicCompClickHandler.bind(this), args: ['$event'] }
        }
      },
      {
        dynamicComponent: MultiChartsComponent,
        gridsterItem: { cols: 2, rows: 2, y: 0, x: 1 },
        inputs: {
          cardRadius: 2,
          title: CONSTANTS.TITLES.Overview,
          compData: this.multiChartData,
          filters: false,
        },
        outputs: {
          onClickHandler: { handler: this.dynamicCompClickHandler.bind(this), args: ['$event'] }
        }
      },
      {
        dynamicComponent: IhrmsGridComponent,
        gridsterItem: { cols: 1, rows: 1, y: 1, x: 0 },
        inputs: {
          title: CONSTANTS.TITLES.AttendanceTypeRequests,
          cardRadius: 0,
          columnDefs: this._eas.getAttendanceRequestColDefs(this.outputActions, this),
          rowData: this.rowDataAttendanceRequests,
          flatItem: false,
          updateGridFromOutside: this.updateComponent$
        },
        gridComponentFullHeight: true,
        outputs: {
          onClickHandler: { handler: this.dynamicCompClickHandler.bind(this), args: ['$event'] }
        }
      }
    ];
  }

  dynamicCompClickHandler(event: any) {
    if(event.component && event.comp_name === CONSTANTS.IHRMS_GRID_COMPONENT) {
      if(event.action === CONSTANTS.VIEW_ALL) {
        if(event.component?.title === CONSTANTS.TITLES.MyRequests) {
          const navExtras: NavigationExtras = { queryParams: { tab: 1 } };
          this.router.navigate([`${CONSTANTS.EMP_DASHBOARD}/${CONSTANTS.EMP_ATTENDANCE_DETAILS}`], navExtras)
        }
        if(event.component?.title === CONSTANTS.TITLES.RecentAttendance) {
          this.router.navigate([`${CONSTANTS.EMP_DASHBOARD}/${CONSTANTS.EMP_ATTENDANCE_DETAILS}`])
        }
      }
    }
    if(event.component && event.comp_name === CONSTANTS.IHRMS_IN_OUT_COMPONENT) {
      if(event.action === CONSTANTS.REQUEST_CORRECTION) {
        const rowData = _.cloneDeep(event);
        rowData.data.loginInfo.inTime = rowData.data?.loginInfo?.inTime && this._ihrmsempss.getLocalTimeZone(new Date(), rowData.data?.loginInfo?.inTime);
        rowData.data.loginInfo.outTime = rowData.data?.loginInfo?.outTime && this._ihrmsempss.getLocalTimeZone(new Date(), rowData.data?.loginInfo?.outTime);
        this._eas.outputActions(rowData, this._eas, this.dialog, this.sub, this.getUserAttendanceDateWise$);
      }
    }
  }

}
