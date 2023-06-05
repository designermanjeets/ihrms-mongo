/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import { GridsterConfig } from 'angular-gridster2';
import { BehaviorSubject, map, Subject, Subscription } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import * as moment from 'moment';
import { MultiChartsComponent } from '@ihrms/ihrms-components';
import { CONSTANTS, IhrmsDashboardItem } from '@ihrms/shared';
import { AdminLeavesService, GQL_LEAVE_APPROVE_REJECT, GQL_LEAVE_BALANCE, GQL_LEAVE_REQUESTS } from './_services/admin-leaves.service';
import { Apollo } from 'apollo-angular';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { GridApi } from 'ag-grid-community';
import { IhrmsAdminDashboardService } from '../_services/ihrms-admin-dashboard.service';

@Component({
  selector: 'ihrms-admin-leaves',
  templateUrl: './admin-leaves.component.html',
  styleUrls: ['./admin-leaves.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminLeavesComponent implements OnInit, AfterViewInit {

  highcharts: typeof Highcharts = Highcharts;
  gridsterOptions: GridsterConfig;
  cardSize = 500;
  gridLoaded = false;
  dashboardItems!: Array<IhrmsDashboardItem>;
  gridResize: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  multiChartData: any | undefined;

  sub!: Subscription;
  rowIndexOrIDLeaveRequests: Subject<any> = new Subject();
  rowIndexOrIDLeaveBalance: Subject<any> = new Subject();
  updateMultiChartFromOutside$: Subject<any> = new Subject();

  leaveRequestsByStatus: any;
  leaveRequestsByTypes: any;
  
  leaveBalanceGridApi!: GridApi;
  leaveRequestGridApi!: GridApi;

  @ViewChild('confirmDialog') confirmDialog!: TemplateRef<any>;

  constructor(
    private cdRef: ChangeDetectorRef,
    private _als: AdminLeavesService,
    private router: Router,
    private apollo: Apollo,
    public dialog: MatDialog,
    private toastrService: ToastrService,
    private _ihrmsads: IhrmsAdminDashboardService
  ) {
    this.gridsterOptions = this._als.getGridsterOptions(this.cardSize, this);
  }

  ngOnInit(): void {

    this.multiChartData = [
      {
        title: CONSTANTS.TITLES.RequestsApprovals,
        columnFit: false,
        gridData: {
          columnDefs: [
            { field: 'user.username', headerName: 'Username'},
            { field: 'comments' },
            { field: 'startDate', headerName: 'Start Date', cellRenderer: (data: any) => data.value && this._ihrmsads.getCurrentZoneTime(data.value) },
            { field: 'endDate', headerName: 'End Date', cellRenderer: (data: any) => data.value && this._ihrmsads.getCurrentZoneTime(data.value) },
            { field: 'audit.created_at', headerName: 'Created Date', cellRenderer: (data: any) => data.value && this._ihrmsads.getCurrentZoneTime(data.value) },
            { field: 'leaveType.name', headerName: 'Type'},
            { field: 'days', headerName: 'Req. Days'},
            { field: 'leaveTypeBalance', headerName: 'Leave Balance', cellClass: 'cellclass4' },
          ],
          rowData: [],
          updateGridFromOutside: this.rowIndexOrIDLeaveRequests,
        },
        height: 45,
        flex: 49,
        marginBottom: 20
      },
      {
        title: CONSTANTS.TITLES.LeaveBalance,
        columnFit: false,
        gridData: {
          columnDefs: [
            { field: 'username', headerName: 'Username'},
          ],
          rowData: [],
          updateGridFromOutside: this.rowIndexOrIDLeaveBalance,
        },
        height: 45,
        flex: 49,
        marginBottom: 20
      },
      {
        title: 'Leaves Overview',
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
        height: 49,
        flex: 24
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
            { name: 'Leaves', data: [ ]}
          ]
        },
        xAxisCategories: (this.highcharts as any).getOptions().lang.shortMonths,
        height: 49,
        flex: 24
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
          data: []
        },
        height: 49,
        flex: 24
      },
      {
        title: 'Leave Types',
        series: {
          config: {
            beta: 25,
            depth: 70,
            alpha: 10
          },
          name: 'Leaves',
          type: 'column',
          data: [ 10, 25, 7, 5 ]
        },
        xAxisCategories: ['Marriage', 'Paternity', 'Sick', 'Unpaid'],
        height: 49,
        flex: 24
      },
    ]
    this.setupDashboardItems();

    setTimeout(() => this.initCharts(), 1000);
  }

  ngAfterViewInit() {
    this.gridLoaded = true;
    this.cdRef.detectChanges();
  }

  initCharts() {
    this.getLeaveRequests();
    this.getLeaveBalance();
    this.getLeaveRequestsByCurrentMonth();
    this.getLeaveRequestsByCurrentYear();
  }

  getLeaveRequests() {
    this.sub = this.apollo.watchQuery<any, any>(
      { 
        query: GQL_LEAVE_REQUESTS, 
        variables: { 
          query: { 
            limit: 100,
            approvers: [{
                approverID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID,
            }]
          }
        }
      }
      ).valueChanges
      .pipe(map((data: any) => data?.data?.getLeaveRequests))
      .subscribe(val => {
        const colDefs = _.cloneDeep(this.multiChartData[0].gridData.columnDefs);
        const leaveRequestResponse: any = [];
        val.forEach((emp: any) => {
          // Check if All previous Approvers Have approved the Request
          const isAllowedForAction = this.isAllowedForAction(emp);
          const leaveRequestResponse_inner: any = [];
          emp.approvers?.forEach((eachLvType: any, idx: number) => {
            const isExists = colDefs.filter((col: any) => col.prop_name === eachLvType.approverName)
            if(!isExists.length) {
              if(idx === 0) { // Just One Col Needed
                colDefs?.push(
                  { field: 'isAllowedForAction', headerName: 'isAllowedForAction', prop_name: eachLvType.isAllowedForAction, hide: true },
                  { field: 'approver' + idx, headerName: 'Approver ' + (emp.approvers.length - idx), prop_name: eachLvType.approverName, cellClass: 'cellclass' + idx },
                  { field: 'approverStatus' + idx, headerName: 'Status', prop_name: eachLvType.approverStatus, cellClass: 'cellclass' + idx },
                );
              } else {
                colDefs?.push(
                  { field: 'approver' + idx, headerName: 'Approver ' + (emp.approvers.length - idx), prop_name: eachLvType.approverName, cellClass: 'cellclass' + idx },
                  { field: 'approverStatus' + idx, headerName: 'Status', prop_name: eachLvType.approverStatus, cellClass: 'cellclass' + idx },
                );
              }
            }
            leaveRequestResponse_inner.push({
                ..._.omit(emp, ['approvers']),
                ['approver' + idx]: eachLvType.approverName,
                ['approverStatus' + idx]: eachLvType.approverStatus,
                ['isAllowedForAction']: isAllowedForAction,
            });
            
          });

          leaveRequestResponse.push( ...leaveRequestResponse_inner );

        });

        colDefs.push(
          { field: 'Action', filter: false, cellRenderer: 'GridActionComponent',
            cellRendererParams: {
              action: this.outputActions.bind(this),
              value: { actionBtn: [ 'check_circle', 'cancel' ] },
              type: CONSTANTS.REQUEST_LEAVE
            }
        }); // Action Column at the End 
        
        const result = _(leaveRequestResponse)
        .groupBy('audit.created_at')
        .map((g) => _.mergeWith({}, ...g, (obj: any, src: any) => _.isArray(obj) ? obj.concat(src) : undefined))
        .value();

        this.leaveRequestGridApi.setRowData(result);
        this.leaveRequestGridApi.setColumnDefs(colDefs || []);

      });
  }

  isAllowedForAction(l_request: any) {
    let isAllowed = true;
    const curr_user = JSON.parse(sessionStorage.getItem('auth-user') || '').userID;
    const curr_user_level = l_request.approvers.filter((approver: any) => approver.approverID === curr_user)[0]?.approverLevel;
    l_request.approvers.forEach((approver: any) => {
      if(
        approver.approverLevel > curr_user_level && approver.approverStatus === CONSTANTS.Pending ||
        approver.approverLevel === curr_user_level && approver.approverStatus === CONSTANTS.Approved 
        ) {
        isAllowed = false;
      }
    });

    return isAllowed;
  }

  getLeaveBalance() {
    this.sub = this.apollo.watchQuery<any, any>({ query: GQL_LEAVE_BALANCE, variables: { 
      query: { 
      limit: 100,
      approvers: [{
        approverID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID,
      }]
    }}
  }).valueChanges
      .pipe(map((data: any) => data?.data?.getLeaveBalance))
      .subscribe(val => {
        const flatEmps =  this.getReportees(val);
        const colDefs = _.cloneDeep(this.multiChartData[1].gridData.columnDefs);
        const leaveBalanceResponse: any = [];
        flatEmps.forEach((emp: any) => {
          const leaveBalanceResponse_inner: any = [];
          emp.leaveTypesNBalance?.forEach((eachLvType: any, idx: number) => {
            const isExists = colDefs.filter((col: any) => col.prop_name === eachLvType.name)
            if(!isExists.length) {
              colDefs?.push(
                { field: 'name' + idx, headerName: 'Leave Type', prop_name: eachLvType.name, cellClass: 'cellclass' + idx },
                { field: 'total_days' + idx, headerName: 'Total Days', cellClass: 'cellclass' + idx  },
                { field: 'remaining_days' + idx, headerName: 'Remaining Days', cellClass: 'cellclass' + idx  }
              );
            }
            leaveBalanceResponse_inner.push({
                username: emp.username,
                ['name' + idx]: eachLvType.name,
                ['total_days' + idx]: eachLvType.days,
                ['remaining_days' + idx]: (eachLvType.remaining_days == null? eachLvType.days: eachLvType.remaining_days) // If Null means All Days Available
            })
          });
          leaveBalanceResponse.push( ...leaveBalanceResponse_inner );
        });
        
        const result = _(leaveBalanceResponse)
        .groupBy('username')
        .map((g) => _.mergeWith({}, ...g, (obj: any, src: any) => _.isArray(obj) ? obj.concat(src) : undefined))
        .value();

        this.leaveBalanceGridApi.setRowData(result);
        this.leaveBalanceGridApi.setColumnDefs(colDefs || []);
      });
  }

  getReportees(members: any): any {
    let children: any = [];
    const flattenMembers = members.map((m: any) => {
      if (m.reportees && m.reportees.length) {
        children = [...children, ...m.reportees];
      }
      return m;
    });
  
    return flattenMembers.concat(children.length ? this.getReportees(children) : children);
  };

  getLeaveRequestsByCurrentMonth() {
    this.sub = this.apollo.watchQuery<any, any>({ 
      query: GQL_LEAVE_REQUESTS, 
      variables: { 
        query: { limit: 100,
        approvers: [{
          approverID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID,
        }], 
        dates: {
          gte: moment().startOf('year').format(),
          lt: moment().endOf('year').format()
        } 
      }}
    }).valueChanges
      .pipe(map((data: any) => data?.data?.getLeaveRequests))
      .subscribe(val => {
        this.leaveRequestsByStatus = {};
        this.leaveRequestsByStatus = _.groupBy(val, 'status');

        const leaveTypes: any = [];
        _.forEach(_.groupBy(val, 'leaveType.name'), (lv, idx) => leaveTypes.push([ idx,  lv.length]));

        this.multiChartData[2].series = Object.assign({ }, this.multiChartData[2].series, { data: leaveTypes });

        this.multiChartData[4].series = Object.assign({ }, 
          this.multiChartData[4].series, {
          data: [
            ['Approved', this.leaveRequestsByStatus?.Approved?.length],
            ['Pending', this.leaveRequestsByStatus?.Pending?.length],
            ['Rejected', this.leaveRequestsByStatus?.Rejected?.length]
          ] 
        });

        this.multiChartData[5].series = Object.assign({ }, this.multiChartData[5].series, { data: leaveTypes });
        this.updateMultiChartFromOutside$.next(true);
      });
  }

  getLeaveRequestsByCurrentYear() {
    this.sub = this.apollo.watchQuery<any, any>({ 
      query: GQL_LEAVE_REQUESTS, 
      variables: { 
        query: { limit: 100, 
        approvers: [{
          approverID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID,
        }],
        dates: {
          gte: moment().startOf('year').format(),
          lt: moment().endOf('year').format()
        } 
      }}
    }).valueChanges
      .pipe(map((data: any) => data?.data?.getLeaveRequests))
      .subscribe(val => {
        const res = _.cloneDeep(val);
        _.each(res, (lv, idx) => res[idx].startDate = moment(res[idx].startDate, 'YYYY/MM/DD').format('MMM'));

        const leaveTypes: any = [];
        _.forEach(_.groupBy(res, 'startDate'), (lv, idx) => leaveTypes.push({name: idx, data: [lv.length]}));

        this.multiChartData[3].series = Object.assign({ }, this.multiChartData[3].series, { data: leaveTypes });
      });
  }

  outputActions(event: any) {
    console.log(event);
    if(event.action === CONSTANTS.CHECK_CIRCLE || event.action === CONSTANTS.CANCEL) {
      this.openDialog(event.params.data, event.action);
    }
  }

  onCancel(data: any, action: string) { 
    this.dialog.closeAll();
  }

  onConfirm(data: any, action: string) {
    const payload = {
      ...data,
      status: action === CONSTANTS.CHECK_CIRCLE ? CONSTANTS.Approved : CONSTANTS.Rejected,
      id: data._id,
      approvers: [{
        approverID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID, // Send Current Approver
      }]
    }
    this.apollo.mutate({ mutation: GQL_LEAVE_APPROVE_REJECT, variables: payload, })
      .pipe(map((res: any) => res?.data.approveRejectLeaveRequest))
      .subscribe((val: any) => {
        if(val) {
          this.toastrService.success( `Success`, `Data Added Successfully!`, { } );
          this.dialog.closeAll();
          this.getLeaveRequests();
          this.getLeaveBalance();
        }
      });
  }
  
  openDialog(rowData: any, action: string): any {
    return this.dialog.open(this.confirmDialog, {
      data: { rowData, action },
      panelClass: ['ihrms-dialog-overlay-panel', 'confirm-dialog-panel'],
    });
  }

  setupDashboardItems() {

    this.dashboardItems = [
      {
        dynamicComponent: MultiChartsComponent,
        gridsterItem: { cols: 1, rows: 4, y: 0, x: 0 },
        inputs: {
          cardRadius: 20,
          title: CONSTANTS.TITLES.Overview,
          compData: this.multiChartData,
          filters: false,
          updateMultiChart: this.updateMultiChartFromOutside$,
        },
        outputs: {
          onClickHandler: { handler: this.dynamicCompClickHandler.bind(this), args: ['$event'] }
        }
      },
    ];
  }

  dynamicCompClickHandler(event: any) {
    if(event.component && event.comp_name === CONSTANTS.IHRMS_GRID_COMPONENT) {
      if(event.action === CONSTANTS.VIEW_ALL) {
        if(event.component?.title === CONSTANTS.TITLES.RequestsApprovals) {
          const navExtras: NavigationExtras = { queryParams: { tab: 0 } };
          this.router.navigate([`${CONSTANTS.ADMIN_DASHBOARD}/${CONSTANTS.ADMIN_LEAVES_DETAILS}`], navExtras)
        }
        if(event.component?.title === CONSTANTS.TITLES.LeaveBalance) {
          const navExtras: NavigationExtras = { queryParams: { tab: 1 } };
          this.router.navigate([`${CONSTANTS.ADMIN_DASHBOARD}/${CONSTANTS.ADMIN_LEAVES_DETAILS}`], navExtras)
        }
      }
      if(event.action === CONSTANTS.ON_GRID_READY) {
        if(event.component.title === CONSTANTS.TITLES.LeaveBalance) {
          this.leaveBalanceGridApi = event.component.gridApi
        }
        if(event.component.title === CONSTANTS.TITLES.RequestsApprovals) {
          this.leaveRequestGridApi = event.component.gridApi
        }
      }
    }
    if(event.component && event.comp_name === CONSTANTS.IHRMS_MULTI_CHART_COMPONENT) {
      console.log(event)
    }
  }

}
