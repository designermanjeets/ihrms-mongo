/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { ChangeDetectionStrategy, Component, ElementRef, OnInit, TemplateRef, ViewChild,ChangeDetectorRef } from '@angular/core';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { BehaviorSubject, map, Subject, Subscription } from 'rxjs';
import * as moment from 'moment';
import { IhrmsGridComponent } from '@ihrms/ihrms-grid';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { GQL_EMPLOYEES } from '@ihrms/ihrms-components';
import { AdminLeavesService, GQL_LEAVE_APPROVE_REJECT, GQL_LEAVE_BALANCE, GQL_LEAVE_REQUESTS } from '../_services/admin-leaves.service';
import { CONSTANTS } from '@ihrms/shared';
import { Apollo } from 'apollo-angular';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '@ihrms/shared';
import { GridApi } from 'ag-grid-community';
import { ColumnApi } from '@ag-grid-community/core';
import * as _ from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ihrms-admin-leaves-details',
  templateUrl: './admin-leaves-details.component.html',
  styleUrls: ['./admin-leaves-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminLeavesDetailsComponent implements OnInit {

  gridsterOptions: GridsterConfig;
  gridLoaded = false;
  dashboardItemsLeaveRequests: Array<GridsterItem> | any;
  gridResize: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  selectedIndex! : number;
  @ViewChild('tabGroup') tabGroup!: ElementRef;

  cardSize = this.tabGroup?.nativeElement?.offsetHeight;

  @ViewChild('confirmDialog') confirmDialog!: TemplateRef<any>;

  sub!: Subscription;
  rowIndexOrIDLeaveRequests: Subject<any> = new Subject();

  leaveRequestsByStatus: any;
  leaveRequestsByTypes: any;
  hide_show_export_button: any;
  admin_leave_detailsGridApi!: GridApi;
  admin_leave_detailsColumnApi!: ColumnApi;

  filterConfig!: any;

  dashboardItemsLeaveBalance: Array<GridsterItem> | any;
  admin_leave_balanceGridApi!: GridApi;
  admin_leave_balanceColumnApi!: ColumnApi;

  constructor(
    private _als: AdminLeavesService,
    private router: Router,
    private route: ActivatedRoute,
    private apollo: Apollo,
    public dialog: MatDialog,
    private toastrService: ToastrService,
    private sharedService: SharedService,
    private cdRef: ChangeDetectorRef,
  ) {
    this.gridsterOptions = this._als.getGridsterOptions(this.cardSize, this ); 
  }

  ngOnInit(): void {
    this.setupDashboardItems();

    this.route.queryParams.subscribe(params => {
      this.selectedIndex = +params['tab'];
    });

    this.filterConfig = {
      filterForm: true,
      show_Export_Button: this.hide_show_export_button,
      userOptions_leave: [],
    }
    
    this.getUsers();
  }

  getLeaveRequests(user_id?: any) {
    //alert(user_id)
    this.sub = this.apollo.watchQuery<any, any>(
      { 
        query: GQL_LEAVE_REQUESTS, 
        variables: { 
          query: { 
            limit: 100,
            userID: user_id,
            approvers: [{
              approverID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID,
            }], 
          }
        }
      }).valueChanges
      .pipe(map((data: any) => data?.data?.getLeaveRequests))
      .subscribe(val => {
        
        const colDefs = _.cloneDeep(this.dashboardItemsLeaveRequests[0].inputs.columnDefs);
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
            })
            
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

        this.admin_leave_detailsGridApi.setRowData(result);
        this.admin_leave_detailsGridApi.setColumnDefs(colDefs || []);
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

  getLeaveBalance(user_id?: any) {
    this.sub = this.apollo.watchQuery<any, any>({ query: GQL_LEAVE_BALANCE, variables: { 
      query: { 
      limit: 100,
      userID: user_id,
      approvers: [{
        approverID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID,
      }]
    }}
  }).valueChanges
      .pipe(map((data: any) => data?.data?.getLeaveBalance))
      .subscribe(val => {
        const flatEmps =  this.getReportees(val);
        const colDefs = _.cloneDeep(this.dashboardItemsLeaveBalance[0].inputs.columnDefs);
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

        this.admin_leave_balanceGridApi.setRowData(result);
        this.admin_leave_balanceGridApi.setColumnDefs(colDefs || []);
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
        approverID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID,
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
    this.hide_show_export_button = this.sharedService.checkuserPermission('Admin', 'Leaves', 'export');
    this.dashboardItemsLeaveRequests = [
      {
        dynamicComponent: IhrmsGridComponent,
        gridsterItem: { cols: 1, rows: 1, y: 0, x: 0 },
        inputs: {
          title: '',
          cardRadius: 0,
          columnDefs: [
            { field: 'user.username', headerName: 'Username'},
            { field: 'comments' },
            { field: 'startDate', headerName: 'Start Date', cellRenderer: (data: any) => data.value && moment(data.value).format('MM/DD/YYYY') },
            { field: 'endDate', headerName: 'End Date', cellRenderer: (data: any) => data.value && moment(data.value).format('MM/DD/YYYY') },
            { field: 'audit.created_at', headerName: 'Created Date', cellRenderer: (data: any) => data.value && moment(data.value).format('MM/DD/YYYY') },
            { field: 'leaveType.name', headerName: 'Type'},
            { field: 'days', headerName: 'Req. Days'},
            { field: 'leaveTypeBalance', headerName: 'Leave Balance', cellClass: 'cellclass4' },
          ],
          rowData: [],
          columnFit: false,
          pagination: true,
          paginationAutoPageSize: true,
          viewAll: false,
          updateGridFromOutside: this.rowIndexOrIDLeaveRequests,
        },
        flatItem: true,
        gridComponentFullHeight: true,
        outputs: {
          onClickHandler: { handler: this.dynamicCompClickHandler, args: ['$event', this] },
          onGridReadyOut: { handler: this.onGridReadyOutLeaveRequest.bind(this), args: ['$event'] },
        }
      }
    ];

    this.dashboardItemsLeaveBalance = [
      {
        dynamicComponent: IhrmsGridComponent,
        gridsterItem: { cols: 1, rows: 1, y: 0, x: 0 },
        inputs: {
          title: '',
          cardRadius: 0,
          columnDefs: [
            { field: 'username', headerName: 'Username'},
          ],
          rowData: [],
          columnFit: true,
          pagination: true,
          paginationAutoPageSize: true,
          viewAll: false,
        },
        flatItem: true,
        gridComponentFullHeight: true,
        outputs: {
          onClickHandler: { handler: this.dynamicCompClickHandler, args: ['$event', this] },
          onGridReadyOut: { handler: this.onGridReadyOutLeaveBalance.bind(this), args: ['$event'] },
        }
      }
    ];

  }

  onGridReadyOutLeaveRequest(event: any) {
    this.admin_leave_detailsGridApi = event.gridApi;
    this.admin_leave_detailsColumnApi = event.gridColumnApi;
    this.getLeaveRequests();
  }

  onGridReadyOutLeaveBalance(event: any) {
    this.admin_leave_balanceGridApi = event.gridApi;
    this.admin_leave_balanceColumnApi = event.gridColumnApi;
    this.getLeaveBalance();
  }

  onFilterSubmitLeave(event: any){
    if(event.action === CONSTANTS.EXPORT_TO_EXCEL) {
      this.admin_leave_detailsGridApi.exportDataAsExcel({
        fileName: 'All_Leave_details-Details_.xlsx'
      });
    }

    if(event.action === CONSTANTS.FILTER_SEARCH) {
      const start = moment(event.filterForm.value.start).add(1, 'd');
      const end = moment(event.filterForm.value.end).add(2, 'd');
      const user_id = event.filterForm.value.leaveFilter;
      this.getLeaveBalance(user_id);
     
     // this.getAttendanceAllToday(start, end,username)
    }
    if(event.action === CONSTANTS.PRINT_ONLY) {
      const eGridDiv = document.querySelector<HTMLElement>('#ihrmsGrid') as any;
      eGridDiv.style.width = '';
      eGridDiv.style.height = '';
      this.admin_leave_detailsGridApi.setDomLayout('print');
      setTimeout(function () {
        print();
      }, 2000);
    }
  }
  onFilterSubmitRequest(event: any){
    if(event.action === CONSTANTS.EXPORT_TO_EXCEL) {
      this.admin_leave_detailsGridApi.exportDataAsExcel({
        fileName: 'All_Leave_details-Details_.xlsx'
      });
    }

    if(event.action === CONSTANTS.FILTER_SEARCH) {
      const start = moment(event.filterForm.value.start).add(1, 'd');
      const end = moment(event.filterForm.value.end).add(2, 'd');
      const user_id = event.filterForm.value.leaveFilter;
      this.getLeaveRequests(user_id);
    }

    if(event.action === CONSTANTS.PRINT_ONLY) {
      const eGridDiv = document.querySelector<HTMLElement>('#ihrmsGrid') as any;
      eGridDiv.style.width = '';
      eGridDiv.style.height = '';
      this.admin_leave_detailsGridApi.setDomLayout('print');
      setTimeout(function () {
        print();
      }, 2000);
    }

  }

  dynamicCompClickHandler(event: any, _this: AdminLeavesDetailsComponent) {
    if (event.component && event.comp_name === CONSTANTS.IHRMS_GRID_COMPONENT) {
      if (event.action === CONSTANTS.ON_FIRST_DATA_RENDERED) {
        //
      }
    }
    
  }

  onTabChanged(event: MatTabChangeEvent) {
    this.selectedIndex = event.index;
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: { tab: this.selectedIndex }});
  }

  getUsers() {
    this.sub = this.apollo.watchQuery<any, any>({ query: GQL_EMPLOYEES, variables: { query: { 
      limit: 100,
      approvers: 
      [{
        approverID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID,
      }],
    }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getUsers))
      .subscribe(val => {
        if(val) {
          this.filterConfig.userOptions_leave = val;
          this.cdRef.detectChanges();
        }
      });
  }


}
