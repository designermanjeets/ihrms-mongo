import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { BehaviorSubject, Subscription } from 'rxjs';
import { constMyTasksItems, constTeamNotifications, TaskItems, TeamNotifications } from './_models';
import { MatDialog } from '@angular/material/dialog';
import { EmpDashboardService, GQL_ATTENDANCE_REQUEST_CREATE, GQL_GET_CLOCK_DATA, GQL_LEAVES_DATA, GQL_TASKS_DATA } from './_services/emp-dashboard.service';
import {
  EmpHelloComponent,
  IhrmsComponentsService, IhrmsDialogComponent,
  TeamNotificationsComponent
} from '@ihrms/ihrms-components';
import { IhrmsChartComponent } from '@ihrms/ihrms-highcharts';
import { CONSTANTS, SharedService } from '@ihrms/shared';
import { IhrmsGridComponent } from '@ihrms/ihrms-grid';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { map } from 'rxjs/operators';
import { GQL_USER_BY_ID, IhrmsEmpDashboardService } from '../_services/ihrms-emp-dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Apollo } from 'apollo-angular';
import * as _ from 'lodash';

declare const google: any;

@Component({
  selector: 'ihrms-emp-dashboard',
  templateUrl: './emp-dashboard.component.html',
  styleUrls: ['./emp-dashboard.component.scss']
})
export class EmpDashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  cardSize = 325;

  highcharts: typeof Highcharts = Highcharts;

  gridsterOptions: GridsterConfig;

  gridLoaded = false;
  dashboardItems: Array<GridsterItem> | any;
  gridResize: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  myTasksItems: TaskItems | undefined;
  teamNotifications: TeamNotifications[] | undefined;

  latitude!: number;
  longitude!: number;
  currentAddress!: string;
  googleMapType = 'satellite';

  sub!: Subscription;
  
  userManager: any;

  environment: any;

  public randomLoader = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);

  updateComponentMyTasks$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private _eds: EmpDashboardService,
    private sharedService: SharedService,
    private activatedRoute: ActivatedRoute,
    private ihrmservice: IhrmsComponentsService,
    private mapsAPILoader: MapsAPILoader,
    private _ihrmsemps: IhrmsEmpDashboardService,
    private toastrService: ToastrService,
    private ngxService: NgxUiLoaderService,
    private apollo: Apollo
  ) {
    this.gridsterOptions = this._eds.getGridsterOptions(this.cardSize, this);
  }

  ngOnInit(): void {

    this.activatedRoute.data.subscribe(data => {
      if (data) {
        this.sharedService.environment = data?.environment;
        data?.environment.production && this.loadMap();
      }
    });

    this.getMyTeamNotifications();

    this.setupDashboardItems();

    this.getClockData();

    this.getLeavesData();

    this.getUserManager();

    this.getMyTasksItems();

  }

  ngAfterViewInit() {
    this.gridLoaded = true;
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    if(this.sub) {
      this.sub.unsubscribe();
    }
  }

  getUserManager() {
    const userID = JSON.parse(sessionStorage.getItem('auth-user') || '').userID;
    this.apollo.watchQuery<any, any>({ query: GQL_USER_BY_ID, variables: { query: { limit: 100,
       id: userID,
      //  approvers:  [{
      //   approverID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID,
      // }],
      }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getUsers[0]))
      .subscribe(val => {
        if(val) {
          this.userManager = [{ _id: val.reportingManager?._id, name: val.reportingManager?.username }];
          this.cdRef.detectChanges();
        }
      });
  }

  private loadMap(): void {
    if (navigator) {
      this.mapsAPILoader.load().then(() => {
        navigator.geolocation.getCurrentPosition( pos => {
          this.longitude = +pos.coords.longitude;
          this.latitude = +pos.coords.latitude;
          this.geocodeLatLng();
        });
      });
    }
  }

  geocodeLatLng() {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat: this.latitude, lng: this.longitude } })
      .then((response: any) => {
        if (response.results[0]) {
          console.log(response.results[0].formatted_address);
          this.currentAddress = response.results[0].formatted_address;
        } else {
          console.error("No results found");
        }
      })

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
          component: CONSTANTS.EMP_DASHBOARD
        },
        outputs: {
          onClickHandler: { handler: this.dynamicCompClickHandler.bind(this), args: ['$event'] }
        }
      },
      {
        dynamicComponent: IhrmsChartComponent,
        gridsterItem: { cols: 1, rows: 1, y: 0, x: 2 },
        inputs: {
          cardRadius: 2,
          charTitle: 'Attendance',
          series: {
            config: {
              beta: 25,
              depth: 70,
              alpha: 10
            },
            name: 'Attendance Days',
            type: 'bar',
            data: [] // [[22], [3], [3]]
          },
          xAxisCategories: ['In Time', 'Late', 'Absent']
        }
      },
      {
        dynamicComponent: TeamNotificationsComponent,
        gridsterItem: { cols: 1, rows: 2, y: 0, x: 3 },
        inputs: {
          cardRadius: 2,
          compData: this.teamNotifications
        }
      },
      {
        dynamicComponent: IhrmsGridComponent,
        gridsterItem: { cols: 2, rows: 1, y: 1, x: 0 },
        inputs: {
          title: 'Assigned Tasks',
          cardRadius: 2,
          columnDefs: [
            { field: 'createdBy.username', headerName: 'Created By', sortable: true },
            { field: 'startDate', sortable: true },
            { field: 'endDate', sortable: true},
            { field: 'status', sortable: true },
            { field: 'timeTaken', sortable: true },
            { field: 'timeAssigned', sortable: true },
            { field: 'comments', sortable: true },
          
          ],
          rowData: [], // rowData
          flatItem: false,
          columnFit: false,
          updateGridFromOutside: this.updateComponentMyTasks$
        },
        gridComponentFullHeight: true,
        outputs: {
          onClickHandler: { handler: this.dynamicCompClickHandler.bind(this), args: ['$event'] }
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
            data: [] // tempPieSeries
          }
        }
      },
    ];
  }

  getMyTasksItems() {
    this.sub = this.apollo.watchQuery<any, any>({ 
      query: GQL_TASKS_DATA, 
      variables: {
        query: {
          dates: { 
            gte: moment().startOf('month').format(),
            lt: moment().endOf('month').format()
          },
          userID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID
        }}
      }).valueChanges
      .pipe(map((data: any) => data?.data?.getTasks))
      .subscribe((tasks: any) => {
        this.updateComponentMyTasks$.next({ action: CONSTANTS.UPDATE, rowData: tasks });
    })
  }

  getClockData() {
    this.sub = this.apollo.watchQuery<any, any>({ 
      query: GQL_GET_CLOCK_DATA, 
      variables: {
        query: {
          dates: { 
            gte: moment().startOf('month').format(),
            lt: moment().endOf('month').format()
          },
          sortBy: "1",
          userID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID
        }}
      }).valueChanges
      .pipe(map((data: any) => data?.data?.getAttendances))
      .subscribe((res: any) => {
        const response = _.cloneDeep(res);
        const attendanceTypes: any = [];
        _.map(response, (r, idx) => response[idx].date = moment(r.date).format("DD-MMM-YYYY"))
        _.forEach(_.groupBy(response, 'date'), (lv, idx) => attendanceTypes.push([lv.length]));
        this.dashboardItems[1].inputs.series = Object.assign({ }, this.dashboardItems[1].inputs.series, { data: attendanceTypes });
    })
  }
  
  getLeavesData() {
    this.sub = this.apollo.watchQuery<any, any>({ 
      query: GQL_LEAVES_DATA, 
      variables: {
        query: {
          dates: { 
            gte: moment().startOf('month').format(),
            lt: moment().endOf('month').format()
          },
          userID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID
        }}
      }).valueChanges
      .pipe(map((data: any) => data?.data?.getLeaveRequests))
      .subscribe((res: any) => {
        const response = _.cloneDeep(res);
        const attendanceTypes: any = [];
        _.map(response, (r, idx) => response[idx].date = moment(r.date).format("DD-MMM-YYYY"))
        _.forEach(_.groupBy(response, 'leaveType.name'), (lv, idx) => attendanceTypes.push([idx, lv.length]));
        this.dashboardItems[4].inputs.series = Object.assign({ }, this.dashboardItems[4].inputs.series, { data: attendanceTypes });
        setTimeout(() => window.dispatchEvent(new Event('resize')), 1000);
    })
  }

  dynamicCompClickHandler(event: any) {
    if (event.action === CONSTANTS.ON_DUTY || event.action === CONSTANTS.WORK_FROM_HOME || event.action === CONSTANTS.REMOTE) {
      this.openDutyRequestDialog(event.action);
    }
    if (event.component?.title === "Upcoming Tasks") {
      console.log(event);
    }
  }

  openDutyRequestDialog(action: string) {
    let fetchControls = null;
    let title = null;
    let attendanceType = null;
    let formConfig = null;
    if (action === CONSTANTS.ON_DUTY || action === CONSTANTS.WORK_FROM_HOME || action === CONSTANTS.REMOTE) {
      title = action === CONSTANTS.ON_DUTY ? 'On Duty' : CONSTANTS.WORK_FROM_HOME ? 'Work From Home': CONSTANTS.REMOTE ? 'Remote' : 'Title';
      attendanceType = action === CONSTANTS.ON_DUTY ? 'OnDuty' : CONSTANTS.WORK_FROM_HOME ? 'WFH': CONSTANTS.REMOTE ? 'Remote' : null;
      fetchControls = this._eds.getOnDutyDynamicControls();
      formConfig = {
        closeFromOutside: true,
        mapData: {
          longitude: this.longitude,
          latitude: this.latitude,
          address: this.currentAddress,
          userId: JSON.parse(sessionStorage.getItem('auth-user') || '').username,
          toManagerID: this.userManager && this.userManager[0]?._id,
          attendanceType: attendanceType
        }
      };
    }

    const dialogRef = this.dialog.open(IhrmsDialogComponent, {
      data: {
        title: title,
        controls: fetchControls,
        formConfig: formConfig
      },
      panelClass: 'ihrms-dialog-overlay-panel',
    });

    dialogRef.componentInstance.dialogEventEmitter.subscribe((result: any) => {
      if (result) {
        if (result.action === CONSTANTS.FORM_OBJECT_EVENT && (action === CONSTANTS.REMOTE || action === CONSTANTS.ON_DUTY || action === CONSTANTS.WORK_FROM_HOME)) {
          this._ihrmsemps.getSelectOptions(dialogRef.componentInstance?.controlsObj, this.userManager, 'toManagerID', '_id')
          result.value.patchValue(dialogRef.componentInstance?.formConfig?.mapData);
        }
        if (result.action === CONSTANTS.FORM_SUBMIT_EVENT) {
          const payload =  {
            ...result.value,
            userId: JSON.parse(sessionStorage.getItem('auth-user') || '').userID,
            days: Number(result.value.days)
          }
          this.apollo.mutate({ mutation: GQL_ATTENDANCE_REQUEST_CREATE, variables: payload, })
            .pipe(map((res: any) => res?.data.createAttendanceRequest))
            .subscribe((val: any) => {
              if(val) {
                this.toastrService.success( `Success`, `Attedance Request Created Successfully!`, { } );
                dialogRef.close();
              }
            });
        }
      }
    });
  }

}
