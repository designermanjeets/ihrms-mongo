/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef, ViewChild
} from '@angular/core';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { EmpHelloComponent, GQL_GET_ATTENDANCE_BY_DATE_WISE, NextpayrollComponent } from '@ihrms/ihrms-components';
import { constTeamNotifications, TeamNotifications } from './_models';
import { IhrmsChartComponent } from '@ihrms/ihrms-highcharts';
import * as Highcharts from 'highcharts';
import { BehaviorSubject, map, Subject, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CONSTANTS, SharedService } from '@ihrms/shared';
import { AdminDashboardService } from './_services/admin-dashboard.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { IhrmsGridComponent } from '@ihrms/ihrms-grid';
import * as moment from 'moment';
import { Apollo } from 'apollo-angular';
import { GQL_LEAVE_REQUESTS } from '../admin-leaves/_services/admin-leaves.service';
import { GQL_ATTENDANCE_TIME_CORRECTIONS, GQL_DAYS_WISE_ATTENDANCES, GQL_TODAYS_ATTENDANCES_OVERVIEW } from '../admin-attendance/_services/admin-attendance.service';
import { IhrmsAdminDashboardService } from '../_services/ihrms-admin-dashboard.service';
import * as _ from 'lodash';

@Component({
  selector: 'ihrms-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {

  cardSize = 325;

  highcharts: typeof Highcharts = Highcharts;

  gridsterOptions: GridsterConfig;

  gridLoaded = false;
  dashboardItems: Array<GridsterItem> | any;
  gridResize: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  teamNotifications: TeamNotifications[] | undefined;

  @ViewChild('myDialog', { static: true }) myDialog!: TemplateRef<any>;

  sub!: Subscription;
  updateChartFromOutside$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  getUserAttendanceCorrReq$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    public dialog: MatDialog,
    private _ads: AdminDashboardService,
    private _ihrmsads: IhrmsAdminDashboardService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private sharedService: SharedService,
    private activatedRoute: ActivatedRoute,
    private apollo: Apollo,
  ) {
    this.gridsterOptions = this._ads.getGridsterOptions(this.cardSize, this);
  }

  ngOnInit(): void {

    this.activatedRoute.data.subscribe(data => {
      if(data) {
        this.sharedService.environment = data?.environment;
      }
    });

    this.getMyTeamNotifications();

    this.setupDashboardItems();

    this.getLeaveByCurrentMonth();

    this.getAttendanceOverview();

    this.getAttendanceTimeCorrections();

    this.getAttendanceDateWise();

  }

  ngAfterViewInit() {
    this.gridLoaded = true;
    this.cdRef.detectChanges();
  }

  getMyTeamNotifications() {
    this.teamNotifications = constTeamNotifications;
  }

  setupDashboardItems() {
    
    this.dashboardItems = [
      {
        dynamicComponent: EmpHelloComponent,
        gridsterItem: { cols: 2, rows: 1, y: 0, x: 0 },
        inputs: {
          cardRadius: 2,
          palette: 'primary',
          component: CONSTANTS.ADMIN_DASHBOARD
        },
        outputs: {
          onClickHandler: { handler: this.dynamicCompClickHandler.bind(this), args: ['$event'] }
        }
      },
      {
        dynamicComponent: IhrmsGridComponent,
        gridsterItem: { cols: 2, rows: 1, y: 0, x: 2 },
        inputs: {
          title: CONSTANTS.TITLES.AttendanceTimeCorrections,
          cardRadius: 2,
          rowData: [],
          columnDefs: [
            { field: 'Action', filter: false, cellRenderer: 'GridActionComponent',
              cellRendererParams:{
                action: this.outputActions.bind(this),
                value: { actionBtn: [ 'check_circle', 'cancel' ] },
                type: CONSTANTS.REQUEST_ATTENDANCE
              }
            },
            { field: 'status' },
            { field: 'date', headerName: 'Date', sort: 'desc', cellRenderer: (data: any) => data.value && this._ihrmsads.getCurrentZoneTime(data.value) },
            { field: 'toManagerID', hide: true },
            { field: 'user.username', headerName: 'Employee' },
            { field: 'inTime', headerName: 'PunchIn', cellRenderer: (node: any) => node.value && moment(node.value).format("HH:mm A") },
            { field: 'outTime', headerName: 'PunchOut', cellRenderer: (node: any) => node.value && moment(node.value).format("HH:mm A") },
            { field: 'shiftName', headerName: 'Shift' },
            { field: 'totalHours', headerName: 'Production' },
            { field: 'overtime', headerName: 'Overtime' },
            { field: 'comments', headerName : 'Comments' },
          ],
          updateGridFromOutside: this.getUserAttendanceCorrReq$,
          flatItem: false
        },
        gridComponentFullHeight: true,
        outputs: {
          onClickHandler: { handler: this.dynamicCompClickHandler.bind(this), args: ['$event'] }
        }
      },
      {
        dynamicComponent: IhrmsChartComponent,
        gridsterItem: { cols: 1, rows: 1, y: 1, x: 0 },
        inputs: {
          cardRadius: 2,
          charTitle: CONSTANTS.TITLES.TodaysAttendance,
          timeline: false,
          series: {
            config: {
              alpha: 15,
              beta: 15,
              depth: 50,
              viewDistance: 45
            },
            name: 'Employees',
            type: 'cylinder',
            data: [], // [22], [3], [3], [1]
          },
          xAxisCategories: []
        }
      },
      {
        dynamicComponent: NextpayrollComponent,
        gridsterItem: { cols: 1, rows: 1, y: 1, x: 1 },
        inputs: {
          title: 'Next Payroll',
          cardRadius: 2,
        }
      },
      {
        dynamicComponent: IhrmsChartComponent,
        gridsterItem: { cols: 1, rows: 1, y: 1, x: 2 },
        inputs: {
          cardRadius: 2,
          charTitle: 'Leaves',
          series: {
            config: {
              innerSize: 80,
              depth: 45,
              alpha: 45
            },
            name: 'Days',
            type: 'pie',
            data: [],
          },
        }
      },
      {
        dynamicComponent: IhrmsChartComponent,
        gridsterItem: { cols: 1, rows: 1, y: 1, x: 3 },
        inputs: {
          cardRadius: 2,
          charTitle: CONSTANTS.TITLES.AttendanceType,
          series: {
            config: {
              beta: 25,
              depth: 70,
              alpha: 10
            },
            name: 'Employee',
            type: 'column',
            data: []
          },
          xAxisCategories: []
        }
      }
    ];
  }

  getAttendanceTimeCorrections() {
    this.sub = this.apollo.watchQuery<any, any>({ 
      query: GQL_ATTENDANCE_TIME_CORRECTIONS, 
      variables: { 
        query: { 
          limit: 100,
          dates: {
            gte: moment().startOf('month').format(),
          },
          approvers: [{
              approverID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID,
          }]
        }
      }})
      .valueChanges
      .pipe(map((data: any) => data?.data?.getAttendanceCorrections))
      .subscribe(val => this.getUserAttendanceCorrReq$.next({ action: CONSTANTS.UPDATE, rowData: val }));
  }

  getLeaveByCurrentMonth() {
    this.sub = this.apollo.watchQuery<any, any>({ 
      query: GQL_LEAVE_REQUESTS, 
      variables: { query: { limit: 100, dates: {
          gte: moment().startOf('month').format(),
          lt: moment().endOf('month').format()
        } 
      }}
    }).valueChanges
      .pipe(map((data: any) => data?.data?.getLeaveRequests))
      .subscribe(val => {
        if(val) {
          const leaveTypes: any = [];
          _.forEach(_.groupBy(val, 'leaveType.name'), (lv, idx) => {
            idx !== 'undefined' && leaveTypes.push([ idx,  lv.length])
          });
          this.dashboardItems[4].inputs.series = Object.assign({ }, this.dashboardItems[4].inputs.series, { data: leaveTypes });
        }
      });
  }

  getAttendanceOverview() {
    this.sub = this.apollo.watchQuery<any, any>({ 
      query: GQL_TODAYS_ATTENDANCES_OVERVIEW, 
      variables: { 
        query: { 
          limit: 100,
          dates: {
            gte: moment().startOf('month').format(),
            lt: moment().endOf('month').format()
          }
        }
      }})
      .valueChanges
      .pipe(map((data: any) => data?.data?.getAttendanceRequestsByDayWiseOverview))
      .subscribe(val => {
        if(val) {
          console.log(val);
          const clean: any = [];
          const pieData = _.omit(Object.assign({}, _.countBy(val, 'attendanceType'), _.countBy(val, 'leaveTypeName')), ['undefined']);
          _.forEach(pieData, (val, key) => clean.push([key, val]));
          this.dashboardItems[5].inputs.series = Object.assign({ }, this.dashboardItems[5].inputs.series, { data: clean });
        }
      });
  }

  getAttendanceDateWise() {
    this.sub = this.apollo.watchQuery<any, any>({ 
      query: GQL_DAYS_WISE_ATTENDANCES, 
      variables: { 
        query: { 
          dates: { 
            gte: moment().startOf('day').format(),
          },
          approvers: [{
              approverID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID,
          }]
        }
      }
    }).valueChanges
      .pipe(map((data: any) => data?.data?.getDayWiseAttendances))
      .subscribe(val => {
        if(val) {
          const fullDay: any = [];
          const halfDay: any = [];
          const shiftOff: any = [];
          let HalfDayCount = 0;
          let FullDayCount = 0;
          let shiftCount = 0;

          _.forEach(_.groupBy(val, 'isHalfDayOrFull'), (lv, idx) => {
            idx && idx === 'Full Day' && fullDay.push(++FullDayCount) 
            idx && idx === 'Half Day' && halfDay.push(++HalfDayCount)
          });
          _.forEach(_.groupBy(val, 'shiftName'), (lv, idx) => {
            idx && idx === 'OFF' && shiftOff.push(++shiftCount)
          });
          this.dashboardItems[2].inputs.xAxisCategories = ['Full Day', 'Half Day', 'OFF']

          this.dashboardItems[2].inputs.series = JSON.parse(JSON.stringify(Object.assign({ }, this.dashboardItems[2].inputs.series, { data: [fullDay, halfDay, shiftOff]})));
          console.log(this.dashboardItems[2].inputs.series)
          this.cdRef.detectChanges();
        }
      });
  }

  dynamicCompClickHandler(event: any) {
    if(event.action === CONSTANTS.ADD_EMPLOYEE) {
      this.router.navigateByUrl(`${CONSTANTS.ADMIN_DASHBOARD}/${CONSTANTS.CREATE_PROFILE}`)
    }
    if(event.action === CONSTANTS.CREATE_POST) {
      this.router.navigateByUrl(`${CONSTANTS.ADMIN_DASHBOARD}/${CONSTANTS.CREATE_POST}`)
    }
    if(event.component && event.comp_name === CONSTANTS.IHRMS_GRID_COMPONENT) {
      if(event.action === CONSTANTS.VIEW_ALL) {
        if(event.component?.title === CONSTANTS.TITLES.AttendanceTimeCorrections) {
          const navExtras: NavigationExtras = { queryParams: { tab: 1 } };
          this.router.navigate([`${CONSTANTS.ADMIN_DASHBOARD}/${CONSTANTS.ADMIN_ATTENDANCE_DETAILS}`], navExtras);
        }
      }
      if(event.action === CONSTANTS.ROW_DOUBLE_CLICKED) {
        this.openDialogWithTemplateRef(this.myDialog, event.event.data);
      }
    }
  }

  openDialogWithTemplateRef(templateRef: TemplateRef<any>, data: any) {
    this.dialog.open(templateRef, { data });
  }

  outputActions(event: any) {
    console.log(event);
  }

}
