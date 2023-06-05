import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { GQL_LEAVE_BALANCE, GQL_LEAVE_CREATE, GQL_LEAVE_REQUEST, GQL_LEAVE_TYPES, GQL_USER_BY_ID, IhrmsEmpDashboardService } from '../_services/ihrms-emp-dashboard.service';
import { map } from 'rxjs/operators';
import { EmpHelloComponent, IhrmsDialogComponent, MultiChartsComponent } from '@ihrms/ihrms-components';
import { IhrmsGridComponent } from '@ihrms/ihrms-grid';
import { CONSTANTS, SharedService } from '@ihrms/shared';
import { EmpLeavesService } from './_services/emp-leaves.service';
import { MatDialog } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import * as _ from 'lodash';


@Component({
  selector: 'ihrms-emp-leaves',
  templateUrl: './emp-leaves.component.html',
  styleUrls: ['./emp-leaves.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmpLeavesComponent implements OnInit, AfterViewInit {

  highcharts: typeof Highcharts = Highcharts;
  gridsterOptions: GridsterConfig;
  cardSize = 340;
  gridLoaded = false;
  leaveTypesData: any;
  dashboardItems: Array<GridsterItem> | any;
  gridResize: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  multiChartData: any | undefined;
  LeaveTypesOptions : any;
  userAssignedLeaveTypesOptions : any;
  userManager: any;

  sub!: Subscription;

  public randomLoader = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);

  rowIndexOrIDLeaveRequest: Subject<any> = new Subject();
  updateMultiChartFromOutside$: Subject<any> = new Subject();
  
  leaveRequestsByStatus: any;
  leaveRequestsByTypes: any;

  userLeaveTypesNBalance: [] = [];

  constructor(
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private _els: EmpLeavesService,
    private router: Router,
    private apollo: Apollo,
    private toastrService: ToastrService,
    private ngxService: NgxUiLoaderService,
    private _eds: IhrmsEmpDashboardService,
    private _sharedService: SharedService
  ) {
    this.gridsterOptions = this._els.getGridsterOptions(this.cardSize, this); //, 'scroll'
  }

  ngOnInit(): void {

    this.multiChartData = [
      {
        title: 'Leaves Balance Overview',
        series: {
          config: {
            innerSize: 60,
            depth: 0,
            alpha: 0
          },
          name: 'Leaves',
          type: 'pie',
          data: []
        },
        flex: 24,
        height: 98
      },
      {
        title: 'Leaves by Month',
        series: {
          config: {
            beta: 0,
            depth: 0,
            alpha: 0
          },
          name: 'Days',
          type: 'column',
          subType: 'multi',
          data: [
            { name: 'Leaves', data: []} //13, 20, 10, 5, 13, 20
          ]
        },
        xAxisCategories: (this.highcharts as any).getOptions().lang.shortMonths,
        flex: 24,
        height: 98
      },
      {
        title: 'Leave Requests',
        series: {
          config: {
            innerSize: 50,
            depth: 35,
            alpha: 45
          },
          name: 'Leaves',
          type: 'pie',
          data: [] // ['Approved', 10], ['Pending', 25], ['Declined', 7] 
        },
        flex: 24,
        height: 98
      },
      {
        title: 'Avg. Leave Types',
        series: {
          config: {
            beta: 25,
            depth: 70,
            alpha: 10
          },
          name: 'Leaves',
          type: 'column',
          data: []
        },
        // xAxisCategories: ['Marriage', 'Paternity', 'Sick', 'Unpaid'],
        flex: 24,
        height: 98
      },
    ]

    this.setupDashboardItems();

    setTimeout(() => this.initCharts(), 1000);
  }

  ngAfterViewInit() {
    this.gridLoaded = true;
    this.getUserManager();
    this.getLeaveTypes();
    this.cdRef.detectChanges();
  }

  initCharts() {
    this.getRequestleaves();
    this.getLeaveBalanceByUserID();
    this.getLeaveRequestsByCurrentMonth();
    this.getLeaveRequestsByCurrentYear();
  }

  getLeaveBalanceByUserID() {
    this.sub = this.apollo.query<any, any>({ query: GQL_LEAVE_BALANCE, variables: { 
      query: { 
      limit: 100,
      userID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID,
    }}
  })
    .pipe(map((data: any) => data?.data?.getLeaveBalance)) // [0].leaveTypesNBalance
    .subscribe(val => {
      this.userLeaveTypesNBalance = val.filter((v: any) => v._id === JSON.parse(sessionStorage.getItem('auth-user') || '').userID)[0].leaveTypesNBalance;
      
      const leaveTypes: any = [];
      const singleUserBal = val.filter((v: any) => v._id === JSON.parse(sessionStorage.getItem('auth-user') || '').userID);
      _.forEach(singleUserBal[0].leaveTypesNBalance, (lv, idx) => leaveTypes.push([ lv.name,  (lv.remaining_days == null? lv.days: lv.remaining_days)]));
      this.multiChartData[0].series = Object.assign({ }, this.multiChartData[0].series, { data: leaveTypes });
    
    });
  }

  getLeaveRequestsByCurrentMonth() {
    this.sub = this.apollo.watchQuery<any, any>({ 
      query: GQL_LEAVE_REQUEST, 
      variables: { query: { limit: 100, dates: {
          gte: moment().startOf('year').format(),
          lt: moment().endOf('year').format()
        },
        userID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID
      }}
    }).valueChanges
      .pipe(map((data: any) => data?.data?.getLeaveRequests))
      .subscribe(val => {
        this.leaveRequestsByStatus = {};
        this.leaveRequestsByStatus = _.groupBy(val, 'status');

        const leaveTypes: any = [];
        _.forEach(_.groupBy(val, 'leaveType.name'), (lv, idx) => leaveTypes.push([ idx,  lv.length]));

        // this.multiChartData[0].series = Object.assign({ }, this.multiChartData[0].series, { data: leaveTypes });

        this.multiChartData[2].series = Object.assign({ }, 
          this.multiChartData[2].series, {
          data: [
            ['Approved', this.leaveRequestsByStatus?.Approved?.length],
            ['Pending', this.leaveRequestsByStatus?.Pending?.length],
            ['Rejected', this.leaveRequestsByStatus?.Rejected?.length]
          ] 
        });

        this.multiChartData[3].series = Object.assign({ }, this.multiChartData[3].series, { data: leaveTypes });
      });
  }

  getLeaveRequestsByCurrentYear() {
    this.sub = this.apollo.watchQuery<any, any>({ 
      query: GQL_LEAVE_REQUEST, 
      variables: { query: { limit: 100, dates: {
          gte: moment().startOf('year').format(),
          lt: moment().endOf('year').format()
        },
        userID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID
      }}
    }).valueChanges
      .pipe(map((data: any) => data?.data?.getLeaveRequests))
      .subscribe(val => {
        const res = _.cloneDeep(val);
        _.each(res, (lv, idx) => res[idx].startDate = moment(res[idx].startDate, 'YYYY/MM/DD').format('MMM'));

        const leaveTypes: any = [];
        _.forEach(_.groupBy(res, 'startDate'), (lv, idx) => leaveTypes.push({name: idx, data: [lv.length]}));

        this.multiChartData[1].series = Object.assign({ }, this.multiChartData[1].series, { data: leaveTypes });
      });
  }

  outputActions(event: any) {
    console.log(event);
  }

  getLeaveTypes() { // By Department By ID  , departmentId: departID,
    this.apollo.watchQuery({ query: GQL_LEAVE_TYPES, variables: { query: { 
      limit: 100,
     }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getLeaveTypes))
      .subscribe(val => this.LeaveTypesOptions = val);
  }

  getUserManager() {
    const userID = JSON.parse(sessionStorage.getItem('auth-user') || '').userID;
    this.apollo.watchQuery<any, any>({ query: GQL_USER_BY_ID, variables: { query: { 
      limit: 100,
       id: userID,
      //  approvers:  [{
      //   approverID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID,
      // }],
      }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getUsers[0]))
      .subscribe(val => {
        this.userManager = [{ _id: val.reportingManager?._id, name: val.reportingManager?.username }];
        this.cdRef.detectChanges();
      });
  }

  setupDashboardItems() {

    this.dashboardItems = [
      {
        dynamicComponent: EmpHelloComponent,
        gridsterItem: { cols: 1, rows: 1, y: 0, x: 0 },
        inputs: {
          cardRadius: 20,
          palette: 'primary',
          component: CONSTANTS.EMP_LEAVES
        },
        outputs: {
          onClickHandler: { handler: this.dynamicCompClickHandler, args: ['$event', this] }
        }
      },
      {
        dynamicComponent: IhrmsGridComponent,
        gridsterItem: { cols: 1, rows: 1, y: 0, x: 1 },
        inputs: {
          title: 'My Requests',
          cardRadius: 0,
          columnDefs: [
            { field: 'startDate'},
            { field: 'endDate'},
            { field: 'days'},
            { field: 'leaveType.name'},
            { field: 'status'}
          ],
          rowData: [],
          columnFit: true,
          flatItem: false,
          updateGridFromOutside: this.rowIndexOrIDLeaveRequest
        },
        gridComponentFullHeight: true,
        outputs: {
          onClickHandler: { handler: this.dynamicCompClickHandler, args: ['$event', this] }
        }
      },
      {
        dynamicComponent: MultiChartsComponent,
        gridsterItem: { cols: 2, rows: 1, y: 1, x: 0 },
        inputs: {
          cardRadius: 20,
          title: "Overview",
          compData: this.multiChartData,
          filters: false,
          updateMultiChart: this.updateMultiChartFromOutside$,
        },
        outputs: {
          onClickHandler: { handler: this.dynamicCompClickHandler, args: ['$event', this] }
        }
      },
    ];
  }

  dynamicCompClickHandler(event: any, _this: EmpLeavesComponent) {
    if(event.component && event.comp_name === CONSTANTS.IHRMS_GRID_COMPONENT) {
      if(event.action === CONSTANTS.VIEW_ALL) {
      _this.router.navigateByUrl(`${CONSTANTS.EMP_DASHBOARD}/${CONSTANTS.EMP_LEAVES_DETAILS}`)
      }
    }
    if(event.action === CONSTANTS.REQUEST_LEAVE) {
      _this.openDutyRequestDialog(CONSTANTS.REQUEST_LEAVE);
    }
}

  getRequestleaves() {
    this.sub = this.apollo.watchQuery<any, any>({ query: GQL_LEAVE_REQUEST, variables: { query: { limit: 100, userID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getLeaveRequests))
      .subscribe(val => {
        if(val) {
          this.rowIndexOrIDLeaveRequest.next({ action: CONSTANTS.UPDATE, rowData: val });
          this.cdRef.detectChanges();
        }
      });
  }


  openDutyRequestDialog(action: string) {
    let fetchControls = null;
    let title = '';
    if(action === CONSTANTS.REQUEST_LEAVE) {
      title = 'Request Leave';
      fetchControls = this._els.getRequestLeaveDynamicControls();
    }

    const dialogRef = this.dialog.open(IhrmsDialogComponent,{
      data: {
        title: title,
        controls: fetchControls,
        formConfig: {
          closeFromOutside: true
        }
      },
      panelClass: 'ihrms-dialog-overlay-panel',
    });

    dialogRef?.componentInstance?.dialogEventEmitter.subscribe((result: any) => {

      if(result && dialogRef.componentInstance) {
        if(result.action === CONSTANTS.FORM_OBJECT_EVENT) {
          this.userAssignedLeaveTypesOptions = [];

          this.userLeaveTypesNBalance?.forEach((mod: any, idx: number) => {
          this.LeaveTypesOptions?.forEach((lvTy: any, idx: number) => {
              if(mod.name === lvTy.name) {
                this.userAssignedLeaveTypesOptions.push({ ...mod });
              }
            });
          });
           this._eds.getSelectOptions(dialogRef.componentInstance?.controlsObj, this.userAssignedLeaveTypesOptions, 'leaveTypeID', '_id');
           this._eds.getSelectOptions(dialogRef.componentInstance?.controlsObj, this.userManager, 'toManagerID', '_id');
           if(this.userManager && this.userManager[0]?._id) {
            dialogRef.componentInstance?.form?.get('toManagerID')?.patchValue(this.userManager[0]._id, { emitEvent: false });
           } else {
            this.getUserManager();
           }
        }
        if(result.action === CONSTANTS.FORM_VALUE_CHANGE) {
          const selectedLeaveTypeId: any = this.userLeaveTypesNBalance?.filter((lvTy: any) => lvTy._id === dialogRef.componentInstance?.form?.value.leaveTypeID)[0];
          if(selectedLeaveTypeId) {
            const remaining_days = selectedLeaveTypeId?.remaining_days === null ?  selectedLeaveTypeId.days:  selectedLeaveTypeId.remaining_days;
            dialogRef.componentInstance?.form?.get('remainingDays')?.patchValue(remaining_days, { emitEvent: false })
          }
        }
        
        if(result.action === CONSTANTS.FORM_SUBMIT_EVENT) {
          const payload =  {
            userID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID,
            ...result.value,
            startDate: moment(moment(result.startDate)).add(330, 'minutes'), // Manual TimeZone TODO
            endDate: moment(moment(result.endDate)).add(330, 'minutes'), // Manual TimeZone TODO
            days: Number(result.value.days)
          }
          this.apollo.mutate({ mutation: GQL_LEAVE_CREATE, variables: payload, })
            .pipe(map((res: any) => res?.data.createLeaveRequest))
            .subscribe((val: any) => {
              if(val) {
                this.toastrService.success( `Success`, `Leave Request Created Successfully!`, { } );
                this.getRequestleaves();
                dialogRef.close();
                // this._sharedService.webHookTestOnLeaveRequest().subscribe(rows => {
                //   if(rows) {
                //     console.log(rows);
                //   }
                // });
              }
            });
        }
      }

    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if(result) {
        console.log(`Dialog result: ${result}`);
      }
    });
 
  }
  


}

