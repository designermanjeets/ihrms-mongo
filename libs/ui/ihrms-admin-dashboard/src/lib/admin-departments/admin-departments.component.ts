/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { GQL_ALL_EMPLOYEES, GQL_EMPLOYEES, MultiChartsComponent } from '@ihrms/ihrms-components';
import { CONSTANTS } from '@ihrms/shared';
import { AdminDepartmentsService, GQL_CREATE_DEPARTMENTS, GQL_DEPARTMENTS, GQL_UPDATE_DEPARTMENTS } from './_services/admin-departments.service';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { IhrmsAdminDashboardService } from '../_services/ihrms-admin-dashboard.service';
import { Apollo } from 'apollo-angular';
import { GQL_LEAVE_TYPES } from '../admin-settings/_services/admin-settings.service';
import { SharedService } from '@ihrms/shared';
import { GridApi } from 'ag-grid-community';
import { ColumnApi } from '@ag-grid-community/core';

@Component({
  selector: 'ihrms-admin-departments',
  templateUrl: './admin-departments.component.html',
  styleUrls: ['./admin-departments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDepartmentsComponent implements OnInit, AfterViewInit, OnDestroy {

  highcharts: typeof Highcharts = Highcharts;
  gridsterOptions: GridsterConfig;
  cardSize = 500;
  gridLoaded = false;
  dashboardItems: Array<GridsterItem> | any;
  gridResize: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  multiChartData: any | undefined;
  rowIndexOrID: Subject<any> = new Subject();

  sub!: Subscription;
  dialogSub!: Subscription;

  
  userOptions: any;
  departmentOptions: any;
  
  LeaveTypesOptions: any;
  hide_show_add_button: any;
  hide_show_edit_button:any;
  hide_show_import_button: any;
  hide_show_export_button: any;
  departmentGridApi!: GridApi;
  departmentColumnApi!: ColumnApi;


  constructor(
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private _ads: AdminDepartmentsService,
    private router: Router,
    private _ihrmsadss: IhrmsAdminDashboardService,
    private sharedService: SharedService,
    private apollo: Apollo
  ) {
    this.gridsterOptions = this._ads.getGridsterOptions(this.cardSize, this);
  }

  ngOnInit(): void {
    this.hide_show_edit_button = this.sharedService.checkuserPermission('Admin', 'Department', 'edit');
    this.multiChartData = [
      {
        title: "",
        columnFit: true,
        pagination: true,
        paginationAutoPageSize: true,
        viewAll: false,
        gridData: {
          columnDefs: [
            { field: 'name', headerName: 'Department Name'},
            { field: 'departmentLead.username', headerName: 'Department Lead' },
            { field: 'audit.created_at', headerName: 'Creation Date'},
            { field: 'parentDepartment.name', headerName: 'Parent Department' },
            { field: 'leaveTypes', headerName: 'LeaveType Assigned', cellRenderer: 'GridSimpleListComponent', autoHeight: true },
            { field: 'status', headerName: 'Status', cellRenderer: 'GridStatusComponent' },
            { field: 'comments', headerName: 'Comments' },
            { field: 'Action', filter: false, cellRenderer: 'GridActionComponent',
              cellRendererParams: {
                action: this.outputActions.bind(this),
                value: { actionBtn: [ 'edit' ] }
              },
              hide: !this.hide_show_edit_button
            },
          ],
          rowData: [],
          updateGridFromOutside: this.rowIndexOrID
        },
        flex: 100,
        height: 100
      }
    ]

    this.setupDashboardItems();

    this.getDepartments();

    this.getAllUsers();

    this.getLeaveTypes();

  }

  ngAfterViewInit() {
    this.gridLoaded = true;
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.sub && this.sub.unsubscribe();
    this.dialogSub && this.dialogSub.unsubscribe();
  }

  getDepartments() {
    // this.sub = this._ihrmsadss.getEntityByAction(CONSTANTS.TITLES.Department, 'GetAllDepartments')
    this.sub = this.apollo.watchQuery<any, any>({ query: GQL_DEPARTMENTS, variables: { query: { limit: 100 }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getDepartments))
      .subscribe(val => {
        if(val) {
          this.multiChartData[0].gridData.rowData = val;
          this.departmentOptions = val;
          this.rowIndexOrID.next({ action: CONSTANTS.UPDATE, rowData: val });
          this.cdRef.detectChanges();
        }
      });
  }

  getAllUsers() {
    this.sub = this.apollo.watchQuery<any, any>({ query: GQL_ALL_EMPLOYEES, variables: { query: { 
      limit: 100,
      // approvers:  [{
      //   approverID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID,
      // }],
    }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getAllUsers))
      .subscribe(val => {
        if(val) {
          this.userOptions = val;
          this.cdRef.detectChanges();
        }
      });
  }

  getLeaveTypes() {
    this.sub = this.apollo.watchQuery<any, any>({ query: GQL_LEAVE_TYPES, variables: { query: { limit: 100 }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getLeaveTypes))
      .subscribe(val => {
        if(val) {
          this.LeaveTypesOptions = val;
          this.cdRef.detectChanges();
        }
      });
  }

  setupDashboardItems() {
    this.hide_show_add_button = this.sharedService.checkuserPermission('Admin', 'Department', 'add');
    this.hide_show_import_button = this.sharedService.checkuserPermission('Admin', 'Department', 'import');
    this.hide_show_export_button = this.sharedService.checkuserPermission('Admin', 'Department', 'export');
    this.dashboardItems = [
      {
        dynamicComponent: MultiChartsComponent,
        gridsterItem: { cols: 2, rows: 2, y: 0, x: 0 },
        inputs: {
          cardRadius: 20,
          title: CONSTANTS.TITLES.Departments,
          filterConfig: {
            filterForm: false,
            show_Export_Button: this.hide_show_export_button,
            addButton: this.hide_show_add_button,
            addButtonText: CONSTANTS.TITLES.AddDepartment,
          },
          compData: this.multiChartData,
          gridComponentFullHeight: true,
        },
        flatItem: false,
        outputs: {
          onClickHandler: { handler: this.dynamicCompClickHandler.bind(this), args: ['$event'] }
        }
      }
    ];
  }

  outputActions(event: any) {
    const mutation = event.action === CONSTANTS.EDIT ? GQL_UPDATE_DEPARTMENTS: null;
    const methodName = event.action === CONSTANTS.EDIT ? 'editDepartment': 'deleteDepartment';
    const dialogRef = this._ihrmsadss.outputActions(
      event,
      CONSTANTS.TITLES.Department,
      this._ads,
      this._ihrmsadss,
      this.dialog,
      this.rowIndexOrID,
      mutation,
      methodName
    );
    this.dialogRef(dialogRef);
  }

  dynamicCompClickHandler(event: any) {
    const dialogRef = this._ihrmsadss.dynamicCompClickHandler(
      event,
      this._ads,
      this._ihrmsadss,
      this.rowIndexOrID,
      CONSTANTS.TITLES.AddDepartment,
      GQL_CREATE_DEPARTMENTS,
      this.dialog,
      'createDepartment'
    );
    this.dialogRef(dialogRef);
    if(event.action === CONSTANTS.EXPORT_TO_EXCEL) {
      this.departmentGridApi.exportDataAsExcel({
        fileName: 'All_Department_.xlsx'
      });
    }
    if(event.action === CONSTANTS.PRINT_ONLY) {
      const eGridDiv = document.querySelector<HTMLElement>('#ihrmsGrid') as any;
      eGridDiv.style.width = '';
      eGridDiv.style.height = '';
      this.departmentGridApi.setDomLayout('print');
      setTimeout(function () {
        print();
      }, 2000);
    }

    if (event.component && event.comp_name === CONSTANTS.IHRMS_GRID_COMPONENT) {
      if (event.action === CONSTANTS.ON_GRID_READY) {
        this.departmentGridApi = event.gridApi;
        this.departmentColumnApi = event.gridColumnApi;
      }
    }
  }

  dialogRef(dialogRef: any) {
    // this.dialogSub && this.dialogSub.unsubscribe();
    dialogRef?.componentInstance?.dialogEventEmitter.subscribe((result: any) => {
      if(result && dialogRef.componentInstance) {
        if(result.action === CONSTANTS.FORM_OBJECT_EVENT) {
          this._ihrmsadss.getSelectOptions(dialogRef.componentInstance?.controlsObj, this.userOptions, 'departmentLeadId', '_id', 'eCode');
          this._ihrmsadss.getSelectOptions(dialogRef.componentInstance?.controlsObj, this.departmentOptions, 'parentDepartmentId', '_id');
          this._ihrmsadss.getSelectOptions(dialogRef.componentInstance?.controlsObj, this.LeaveTypesOptions, 'leaveTypesIDs', '_id');

        }
        if(result.action === CONSTANTS.FORM_VALUE_CHANGE) {
          //
        }
        if(result.action === CONSTANTS.FORM_SUBMIT_EVENT) {
          //
        }
      }
    });
  }

}
