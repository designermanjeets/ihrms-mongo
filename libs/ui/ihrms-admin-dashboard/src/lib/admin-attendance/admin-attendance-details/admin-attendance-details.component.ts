/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { BehaviorSubject, Subscription } from 'rxjs';
import * as moment from 'moment';
import { IhrmsGridComponent } from '@ihrms/ihrms-grid';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { GQL_EMPLOYEES } from '@ihrms/ihrms-components';
import { AdminAttendanceService, GQL_ATTENDANCES_REQUESTS,GQL_ATTENDANCE_TIME_CORRECTIONS, GQL_ATTENDANCE_TYPE_APPROVE_REJECT, GQL_DAYS_WISE_ATTENDANCES,GQL_ATTENDANCE_CORRECTION_APPROVE_REJECT, GQL_TODAYS_ATTENDANCES_DAY_ALL_USERS } from '../_services/admin-attendance.service';
import * as _ from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { CONSTANTS } from '@ihrms/shared';
import { IhrmsDialogComponent, TodaysInoutComponent,} from '@ihrms/ihrms-components';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { IhrmsAdminDashboardService } from '../../_services/ihrms-admin-dashboard.service';
import { Apollo } from 'apollo-angular';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GridApi } from 'ag-grid-community';
import { ColumnApi } from '@ag-grid-community/core';
import { SharedService } from '@ihrms/shared';

@Component({
  selector: 'ihrms-admin-attendance-details',
  templateUrl: './admin-attendance-details.component.html',
  styleUrls: ['./admin-attendance-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminAttendanceDetailsComponent implements OnInit {

  gridsterOptions: GridsterConfig;
  cardSize = 500;
  gridLoaded = false;
  dashboardItemsAttendanceDetails: Array<GridsterItem> | any;
  dashboardItemsAttendanceRequests: Array<GridsterItem> | any;
  dashboardItemsAttendanceDetailsTime: Array<GridsterItem> | any;
  gridResize: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  getUserAttendanceCorrReq$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  selectedIndex! : number;
  hide_show_export_button: any;
  filterConfig!: any;
  attendanceGridApi!: GridApi;
  attendanceColumnApi!: ColumnApi;

  attendanceTypeReqRowData: any;
  updateComponent$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  updateComponentAttendance$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  sub!: Subscription;

  constructor(
    private _ads: AdminAttendanceService,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    public dialog: MatDialog,
    private _ihrmsads: IhrmsAdminDashboardService,
    private apollo: Apollo,
    private toastrService: ToastrService,
    private sharedService: SharedService,
  ) {
    this.gridsterOptions = this._ads.getGridsterOptions(this.cardSize, this);
  }

  ngOnInit(): void {

    this.setupDashboardItems();

    this.filterConfig = { // Default Range
      filterForm: true,
      show_Export_Button: this.hide_show_export_button,
      userOptions: [],
    };

    this.route.queryParams.subscribe(params => {
      this.selectedIndex = +params['tab'];
    });

    this.getAttendanceAllToday();

    this.getAttendanceRequests();

    this.getUsers();
    
    const start = moment(moment().startOf('month').format()).add(1, 'd');
    const end = moment(moment().endOf('month').format()).add(2, 'd');
    this.getAttendanceTimeCorrections(start, end);

  }

  setupDashboardItems() {
    this.hide_show_export_button = this.sharedService.checkuserPermission('Admin', 'Attendance', 'export');
    this.dashboardItemsAttendanceDetails = [
      {
        dynamicComponent: IhrmsGridComponent,
        gridsterItem: { cols: 1, rows: 1, y: 0, x: 0 },
        inputs: {
          title: '',
          cardRadius: 0,
          columnFit: true,
          columnDefs: [
            { field: 'date', sort: 'desc', headerName: 'Date', cellRenderer: (data: any) => moment(data.value).format('MM/DD/YYYY') },
            { field: 'username', headerName: 'Employee' },
            { field: 'punchIn', headerName: 'PunchIn' ,cellRenderer: (node: any) => node.value && this._ihrmsads.getLocalTimeZone(node.data.date, node.value) },
            { field: 'punchOut', headerName: 'PunchOut',cellRenderer: (node: any) => node.value && this._ihrmsads.getLocalTimeZone(node.data.date, node.value) },
            { field: 'shiftName', headerName: 'Shift' },
            { field: 'totalHours', headerName: 'Production', valueFormatter: (params: any) => params.value && params.value.toFixed(2) },
            { field: 'overtime', headerName: 'Overtime', valueFormatter: (params: any) => params.value && params.value.toFixed(2) },
            { field: 'isHalfDayOrFull', headerName: 'Day' },
            { field: 'Action',  width: 300,cellRenderer: 'ReqCorrectionComponent',
              cellRendererParams: {
                action: this.outputActions.bind(this),
              },
            },
          ],
          rowData: [],
          pagination: true,
          paginationAutoPageSize: true,
          viewAll: false,
          updateGridFromOutside: this.updateComponentAttendance$
        },
        flatItem: true,
        gridComponentFullHeight: true,
        outputs: {
          onClickHandler: { handler: this.dynamicCompClickHandler.bind(this), args: ['$event']}
        }
      }
    ];

    this.dashboardItemsAttendanceDetailsTime = [
      {
        dynamicComponent: IhrmsGridComponent,
        gridsterItem: { cols: 1, rows: 1, y: 0, x: 0 },
        inputs: {
          title: '',
          cardRadius: 0,
          columnFit: true,
          columnDefs: [
            { field: 'date', headerName: 'Date', sort: 'desc', cellRenderer: (data: any) => data.value && this._ihrmsads.getCurrentZoneTime(data.value) },
            { field: 'toManagerID', hide: true },
            { field: 'user.username', headerName: 'Employee' },
            { field: 'inTime', headerName: 'PunchIn', cellRenderer: (data: any) => data.value && moment(data.value).format('hh:mm A') },
            { field: 'outTime', headerName: 'PunchOut', cellRenderer: (data: any) => data.value && moment(data.value).format('hh:mm A') },
            { field: 'shiftName', headerName: 'Shift'},
            { field: 'totalHours', headerName: 'Production'},
            { field: 'overtime', headerName: 'Overtime' },
            { field: 'comments', headerName : 'Comments' },
            { field: 'Action', filter: false, cellRenderer: 'GridActionComponent',
              cellRendererParams: {
                action: this.outputActionsTimeCorrApproveReject.bind(this),
                value: { actionBtn: [ 'check_circle', 'cancel' ] },
                type: CONSTANTS.REQUEST_ATTENDANCE
              }        
            },
          ],
          rowData: [],
          pagination: true,
          paginationAutoPageSize: true,
          viewAll: false,
          updateGridFromOutside: this.getUserAttendanceCorrReq$
        },
        flatItem: false,
        gridComponentFullHeight: true,
        outputs: {
          onClickHandler: { handler: this.dynamicCompClickHandler.bind(this), args: ['$event']}
        }
      }
    ];

    this.dashboardItemsAttendanceRequests = [
      {
        dynamicComponent: IhrmsGridComponent,
        gridsterItem: { cols: 1, rows: 1, y: 0, x: 0 },
        inputs: {
          title: '',
          cardRadius: 0,
          columnDefs: this._ads.getAttendanceRequestColDefs(this.outputActions, this),
          rowData: this.attendanceTypeReqRowData,
          pagination: true,
          paginationAutoPageSize: true,
          columnFit: true,
          viewAll: false,
          updateGridFromOutside: this.updateComponent$
        },
        flatItem: true,
        gridComponentFullHeight: true,
        outputs: {
          onClickHandler: { handler: this.dynamicCompClickHandler.bind(this), args: ['$event'] }
        }
      }
    ];

  }

  outputActionsTimeCorrApproveReject(event: any) {
    if(event.action === CONSTANTS.CHECK_CIRCLE || event.action === CONSTANTS.CANCEL) {

      const dialogRef = this.openDialogTimeCorr(event.params.data, event.action);

      dialogRef.componentInstance.dialogEventEmitter.subscribe((result: any) => {

        if(result) {
        if(result.action === CONSTANTS.FORM_OBJECT_EVENT) {
          //
          }
          if(result.action === CONSTANTS.FORM_SUBMIT_EVENT) {
            const payload = {
              id:result.value._id,
              ...result.value,
              status: event.action === CONSTANTS.CHECK_CIRCLE ? CONSTANTS.Approved : CONSTANTS.Rejected,
              _id: result.value._id,
              inTime:event.params.data.inTime,
              outTime:event.params.data.outTime,
              created_by:event.params.data.user.username,
            // userId: result.value.user?._id
            }
            this.apollo.mutate({ mutation: GQL_ATTENDANCE_CORRECTION_APPROVE_REJECT, variables: payload, })
            .pipe(map((res: any) => res?.data.approveRejectTimeCorrection))
            .subscribe((val: any) => {
              if(val) {
                this.toastrService.success( `Success`, `Data Added Successfully!`, { } );
                this.dialog.closeAll();
                this.getAttendanceTimeCorrections();
              }
            });        
          
          }
        }})
      }
  }

  openDialogTimeCorr(rowData: any, action: string): any {
    const fetchControls = this._ads.getAttendanceTimeCorrectionsControls();
    const rowDatam = _.cloneDeep(rowData);
    rowDatam.userfield = rowData.user.username;
    rowDatam.inTime = rowData.inTime && moment(rowData.inTime).format('hh:mm A');
    rowDatam.outTime = rowData.outTime && moment(rowData.outTime).format('hh:mm A');
    // rowDatam.toManagerID = rowData.toManager?.username;
    rowDatam.toManagerID = rowData.user?.reportingManager?.username;
   
    return this.dialog.open(IhrmsDialogComponent, {
      data: {
        title: action === CONSTANTS.CHECK_CIRCLE ? 'Approve Attendance Time Corrections': 'Reject Attendance Time Corrections',
        controls: fetchControls,
        formConfig: {
          okButtonText: action === CONSTANTS.CHECK_CIRCLE ? 'Confirm': 'Reject',
          patchValue: rowDatam,
          readOnly: true,
          closeFromOutside: true
        }
      },
      panelClass: 'ihrms-dialog-overlay-panel',
    });
  
  }
  

  getCurrentZoneTime(d: any) {
    return moment(d).format('MM/DD/YYYY');
  }

  getAttendanceTimeCorrections(start?: any, end?: any,username?: any) {
    const params = (start && end || username) ?  
    { gte: new Date(new Date(start).setUTCHours(0, 0, 0, 0)), lt: new Date(new Date(end).setUTCHours(0, 0, 0, 0)) }: 
    { gte: new Date(new Date().setUTCHours(0, 0, 0, 0)) }
    this.sub = this.apollo.watchQuery<any, any>({ 
      query: GQL_ATTENDANCE_TIME_CORRECTIONS, 
      variables: { 
        query: { 
          limit: 100,
          dates: params,
          username: username,
          approvers: [{
              approverID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID,
          }]
        }
      }})
      .valueChanges
      .pipe(map((data: any) => data?.data?.getAttendanceCorrections))
      .subscribe(val => this.getUserAttendanceCorrReq$.next({ action: CONSTANTS.UPDATE, rowData: val }));   
  }

  outputActions(event: any) {
    if(event.action === CONSTANTS.CHECK_CIRCLE || event.action === CONSTANTS.CANCEL) {

      const dialogRef = this.openDialog(event.params.data, event.action);

      dialogRef.componentInstance.dialogEventEmitter.subscribe((result: any) => {

        if(result) {
          if(result.action === CONSTANTS.FORM_OBJECT_EVENT) {
            // this._ihrmsads.getSelectOptions(dialogRef.componentInstance?.controlsObj, this.userOptions, 'toManagerID', 'username', 'username');
            (result.value as FormGroup).get('user')?.patchValue(event.params.data?.user?.username);
            (result.value as FormGroup).get('toManagerID')?.patchValue(event.params.data?.toManager?.username);
          }
          if(result.action === CONSTANTS.FORM_SUBMIT_EVENT) {
            const payload = {
              ...result.value,
              status: event.action === CONSTANTS.CHECK_CIRCLE ? CONSTANTS.Approved : CONSTANTS.Rejected,
              id: result.value._id,
              userId: result.value.user._id
            }
            this.apollo.mutate({ mutation: GQL_ATTENDANCE_TYPE_APPROVE_REJECT, variables: payload, })
              .pipe(map((res: any) => res?.data.approveRejectAttendanceRequest))
              .subscribe((val: any) => {
                if(val) {
                  this.toastrService.success( `Success`, `Data Added Successfully!`, { } );
                  this.dialog.closeAll();
                  this.getAttendanceRequests();
                }
              });
          }
        }

      });
    }  

    if(event.action === CONSTANTS.REQUEST_CORRECTION) {
      const rowData = _.cloneDeep(event);
      rowData.data.data.shiftName = rowData.data.data.roster?.shifts.length && rowData.data.data.roster?.shifts[0];
       rowData.data.data.inTime = rowData.data?.data?.punchIn && this._ihrmsads.getLocalTimeZone(rowData.data?.data?.date, rowData.data?.data?.punchIn);
       rowData.data.data.outTime = rowData.data?.data?.punchOut && this._ihrmsads.getLocalTimeZone(rowData.data?.data?.date, rowData.data?.data?.punchOut);
       this._ads.outputActions(rowData, this._ads, this.dialog, this.sub, this.updateComponent$);
      this.cdRef.detectChanges();
    }
  }
  
  openDialog(rowData: any, action: string): any {
    
    const fetchControls = this._ads.getDynamicControls();

    return this.dialog.open(IhrmsDialogComponent, {
      data: {
        title: action === CONSTANTS.CHECK_CIRCLE ? 'Approve Attendance Request': 'Reject Attendance Request',
        controls: fetchControls,
        formConfig: {
          okButtonText: action === CONSTANTS.CHECK_CIRCLE ? 'Confirm': 'Reject',
          patchValue: rowData,
          readOnly: true,
          closeFromOutside: true
        }
      },
      panelClass: 'ihrms-dialog-overlay-panel',
    });

  }

  dynamicCompClickHandler(event: any) {
    if(event.comp_name === CONSTANTS.IHRMS_GRID_COMPONENT && event.action === CONSTANTS.ROW_CLICKED) {
      const dialogRef = this.dialog.open(TodaysInoutComponent, {
        panelClass: 'attendance-details',
        data: event.event?.data
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }
    if (event.component && event.comp_name === CONSTANTS.IHRMS_GRID_COMPONENT) {
      if (event.action === CONSTANTS.ON_FIRST_DATA_RENDERED) {
        this.attendanceGridApi = event.event.api;
        this.attendanceColumnApi = event.event.columnApi;
      }
    }
  }

  getAttendanceAllToday(start?: any, end?: any,username?: any, limit?: number) {

    const params = (start && end || username) ?  
    { gte: new Date(new Date(start).setUTCHours(0, 0, 0, 0)), lt: new Date(new Date(end).setUTCHours(0, 0, 0, 0)) }: 
    { gte: new Date(new Date().setUTCHours(0, 0, 0, 0)) }
    this.sub = this.apollo.watchQuery<any, any>({ 
      query: GQL_DAYS_WISE_ATTENDANCES, 
      variables: { 
        query: { 
          limit: limit || 100,
          dates: params,
          username: username,
          approvers: [{
              approverID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID,
          }]
        }
      }})
      .valueChanges
      .pipe(map((data: any) => data?.data?.getDayWiseAttendances))
      .subscribe(val => {
        if(val) {
          this.updateComponentAttendance$.next({ action: CONSTANTS.UPDATE, rowData: val });
        }
      });
  }

  getAttendanceRequests() {
    this.sub = this.apollo.watchQuery<any, any>({ 
      query: GQL_ATTENDANCES_REQUESTS, 
      variables: { 
        query: { 
          limit: 100,
          dates: {
            // gte: moment(moment.now()).format('DD-MM-YYYY') // Need All Previous "Pending" Ones
          }
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

  uploadAttendance(selectedFiles: any) {
    const formData = new FormData();
    formData.append('file', selectedFiles);
    this._ihrmsads.createEntityWithAction(CONSTANTS.TITLES.Attendance, 'UploadExcel', formData)
      .pipe(map((data: any) => data?.result))
      .subscribe(val => {
        if(val) {
          console.log(val);
          this.cdRef.detectChanges();
        }
      });
  }

  onFilterSubmit(event: any) {
    console.log(event);
    if(event.component && event.comp_name === CONSTANTS.IHRMS_FILTERS_COMPONENT) {
      if(event.action === CONSTANTS.UPLOAD_ANY) {
        this.uploadAttendance(event?.selectedFiles[0]);
      }
      if(event.action === CONSTANTS.FILTER_SEARCH) {
        const start = moment(event.filterForm.value.start).add(1, 'd');
        const end = moment(event.filterForm.value.end).add(2, 'd');
        const username = event.filterForm.value.attendanceFilter;
        this.getAttendanceAllToday(start, end,username, 9999)
      }
    }
    if(event.action === CONSTANTS.EXPORT_TO_EXCEL) {
      this.attendanceGridApi.exportDataAsExcel({
        fileName: 'All_Attendance-Details_.xlsx'
      });
    }
    if(event.action === CONSTANTS.PRINT_ONLY) {
      const eGridDiv = document.querySelector<HTMLElement>('#ihrmsGrid') as any;
      eGridDiv.style.width = '';
      eGridDiv.style.height = '';
      this.attendanceGridApi.setDomLayout('print');
      setTimeout(function () {
        print();
      }, 2000);
    }
  }

  onFilterSubmitTimeRequest(event: any) {

    if(event.action === CONSTANTS.FILTER_SEARCH) {
      const start = moment(event.filterForm.value.start).add(1, 'd');
      const end = moment(event.filterForm.value.end).add(2, 'd');
      const username = event.filterForm.value.attendanceFilter;
      this.getAttendanceTimeCorrections(start, end,username);
    }
  }

  onFilterSubmitRequest(event: any) {
    if(event.action === CONSTANTS.EXPORT_TO_EXCEL) {
      this.attendanceGridApi.exportDataAsExcel({
        fileName: 'All_Attendance-Details_.xlsx'
      });
    }
    if(event.action === CONSTANTS.PRINT_ONLY) {
      const eGridDiv = document.querySelector<HTMLElement>('#ihrmsGrid') as any;
      eGridDiv.style.width = '';
      eGridDiv.style.height = '';
      this.attendanceGridApi.setDomLayout('print');
      setTimeout(function () {
        print();
      }, 2000);
    }
  }

  onTabChanged(event: MatTabChangeEvent) {
    this.selectedIndex = event.index;
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: { tab: this.selectedIndex }});
  }

  getUsers() {
    this.sub = this.apollo.watchQuery<any, any>({ query: GQL_EMPLOYEES, variables: { query: { 
      limit: 100,
      approvers:  [{
        approverID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID,
      }],
      
     }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getUsers))
      .subscribe(val => {
        if(val) {
          this.filterConfig.userOptions = val;
          this.cdRef.detectChanges();
        }
      });
  }

}

