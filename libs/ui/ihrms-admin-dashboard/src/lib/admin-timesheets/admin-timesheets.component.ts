import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { BehaviorSubject, map, Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { GQL_EMPLOYEES, IhrmsDialogComponent, MultiChartsComponent } from '@ihrms/ihrms-components';
import { CONSTANTS } from '@ihrms/shared';
import { AdminTimesheetsService, GQL_TIMESHEETS, GQL_TIMESHEETS_CREATE, GQL_TIMESHEETS_UPDATE } from './_services/admin-timesheets.service';
import { MatDialog } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import { ToastrService } from 'ngx-toastr';
import { IhrmsAdminDashboardService } from '../_services/ihrms-admin-dashboard.service';
import { SharedService } from '@ihrms/shared';
import { GridApi } from 'ag-grid-community';
import { ColumnApi } from '@ag-grid-community/core';

@Component({
  selector: 'ihrms-admin-timesheets',
  templateUrl: './admin-timesheets.component.html',
  styleUrls: ['./admin-timesheets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminTimesheetsComponent implements OnInit, AfterViewInit {

  highcharts: typeof Highcharts = Highcharts;
  gridsterOptions: GridsterConfig;
  cardSize = 500;
  gridLoaded = false;
  dashboardItems: Array<GridsterItem> | any;
  gridResize: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  multiChartData: any | undefined;
  rowIndexOrID: Subject<any> = new Subject();
  rowCurrentSelected!: number;

  userOptions: any;
  hide_show_add_button: any;
  hide_show_edit_button: any;
  hide_show_import_button: any;
  hide_show_export_button: any;
  timesheetsGridApi!: GridApi;
  timesheetsColumnApi!: ColumnApi;

  sub!: Subscription;

  constructor(
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private _ats: AdminTimesheetsService,
    private router: Router,
    private apollo: Apollo,
    private toastrService: ToastrService,
    private _ihrmsadss: IhrmsAdminDashboardService,
    private sharedService: SharedService
  ) {
    this.gridsterOptions = this._ats.getGridsterOptions(this.cardSize, this);
  }

  ngOnInit(): void {
    this.hide_show_edit_button = this.sharedService.checkuserPermission('Admin', 'Timesheet', 'edit');
    this.multiChartData = [
      {
        title: "",
        columnFit: true,
        pagination: true,
        paginationAutoPageSize: true,
        viewAll: false,
        gridData: {
          columnDefs: [
            { field: 'assignedToID', hide: true }, // cellRenderer: 'GridAvatarComponent', autoHeight: true,
            { field: 'assignedTo.username', headerName: 'Employee' }, // cellRenderer: 'GridAvatarComponent', autoHeight: true,
            { field: 'department.name', headerName: 'Department'},
            // { field: 'user.designation.name', headerName: 'Designation'},
            { field: 'assignedDate', headerName: 'Date Assigned'},
            { field: 'createdBy.username', headerName: 'Assigned By'},
            { field: 'projectName'},
            { field: 'hours'},
            { field: 'comments'},
            { field: 'status'},
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

    this.getUsers();

    this.getTimesheets();

  }

  ngAfterViewInit() {
    this.gridLoaded = true;
    this.cdRef.detectChanges();
  }

  getUsers() {
    this.sub = this.apollo.watchQuery<any, any>({ query: GQL_EMPLOYEES, variables: { query: { 
      limit: 100,
      approvers:  [{
        approverID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID,
      }],
    }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getUsers))
      .subscribe(val => this.userOptions = val);
  }

  getTimesheets() {
    this.sub = this.apollo.watchQuery<any, any>({ query: GQL_TIMESHEETS, variables: { query: { limit: 100 }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getTimesheets))
      .subscribe(val => this.rowIndexOrID.next({rowData: val, action: CONSTANTS.UPDATE}));
  }

  outputActions(event: any) {
    if(event.action === CONSTANTS.EDIT ) {
      this.rowCurrentSelected = event.params.rowIndex;
      this.openAddTimeSheetDialog(CONSTANTS.TITLES.EditTimesheet, CONSTANTS.EDIT, event.params.node.id, event.params.data);
    }
    if(event.action === CONSTANTS.CANCEL ) {
      this.openAddTimeSheetDialog(CONSTANTS.TITLES.DeleteTimesheet, CONSTANTS.CANCEL, event.params.node.id, event.params.data, true);
    }
  }

  setupDashboardItems() {
    this.hide_show_add_button = this.sharedService.checkuserPermission('Admin', 'Timesheet', 'add');
    this.hide_show_import_button = this.sharedService.checkuserPermission('Admin', 'Timesheet', 'import');
    this.hide_show_export_button = this.sharedService.checkuserPermission('Admin', 'Timesheet', 'export');
    this.dashboardItems = [
      {
        dynamicComponent: MultiChartsComponent,
        gridsterItem: { cols: 2, rows: 2, y: 0, x: 0 },
        inputs: {
          cardRadius: 20,
          title: CONSTANTS.TITLES.Timesheet,
          filterConfig: {
            filterForm: false,
            addButton: this.hide_show_add_button,
            show_Export_Button: this.hide_show_export_button,
            addButtonText: CONSTANTS.TITLES.AddTimesheet,
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

  dynamicCompClickHandler(event: any) {
    if(event.component && event.comp_name === CONSTANTS.IHRMS_FILTERS_COMPONENT) {
      if(event.action === CONSTANTS.ADD_ANY && event.text === CONSTANTS.TITLES.AddTimesheet) {
        this.openAddTimeSheetDialog(event.text, CONSTANTS.ADD_ANY);
      }
    }
    if(event.action === CONSTANTS.EXPORT_TO_EXCEL) {
      this.timesheetsGridApi.exportDataAsExcel({
        fileName: 'All_Timesheets_.xlsx'
      });
    }
    if(event.action === CONSTANTS.PRINT_ONLY) {
      const eGridDiv = document.querySelector<HTMLElement>('#ihrmsGrid') as any;
      eGridDiv.style.width = '';
      eGridDiv.style.height = '';
      this.timesheetsGridApi.setDomLayout('print');
      setTimeout(function () {
        print();
      }, 2000);
    }

    if (event.component && event.comp_name === CONSTANTS.IHRMS_GRID_COMPONENT) {
      if (event.action === CONSTANTS.ON_GRID_READY) {
        this.timesheetsGridApi = event.gridApi;
        this.timesheetsColumnApi = event.gridColumnApi;
      }
    }
  }

  openAddTimeSheetDialog(title: string, action: string, rowIndex?: number, patchValue?: any, readOnly?: boolean) {

    const fetchControls = this._ats.getTimesheetDynamicControls();

    const dialogRef = this.dialog.open(IhrmsDialogComponent, {
      data: {
        title: title,
        controls: fetchControls,
        formConfig: {
          okButtonText: 'Save Changes',
          patchValue: patchValue,
          readOnly: readOnly,
          action: action,
          closeFromOutside: true
        }
      },
      panelClass: 'ihrms-dialog-overlay-panel',
    });

    dialogRef.componentInstance.dialogEventEmitter.subscribe((result: any) => {
      if(result) {
        if(result.action === CONSTANTS.FORM_OBJECT_EVENT) {
          this._ihrmsadss.getSelectOptions(dialogRef.componentInstance?.controlsObj, this.userOptions, 'assignedToID', '_id', 'username');
        }
        if(result.action === CONSTANTS.FORM_SUBMIT_EVENT) {
          const payload =  {
            ...result.value,
            hours: Number(result.value.hours),
            createdByID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID
          }
          if(result.action === CONSTANTS.FORM_SUBMIT_EVENT && action === CONSTANTS.EDIT) {
            !payload.id && (payload.id = payload._id); // Mongo has _id
            this.apollo.mutate({ mutation: GQL_TIMESHEETS_UPDATE, variables: payload })
              .pipe(map((res: any) => res?.data.editTimesheet))
              .subscribe((val: any) => {
                if(val) {
                  this.rowIndexOrID.next({rowIndex: this.rowCurrentSelected, data: val, action: CONSTANTS.EDIT});
                  this.toastrService.success( `Success`, `Data Updated Successfully!`, { } );
                  dialogRef.close();
                }
              });
          }
          if(result.action === CONSTANTS.FORM_SUBMIT_EVENT && action === CONSTANTS.ADD_ANY) {
            delete payload.id; delete payload._id;
            this.apollo.mutate({ mutation: GQL_TIMESHEETS_CREATE, variables: payload })
              .pipe(map((res: any) => res?.data.createTimesheet))
              .subscribe((val: any) => {
                if(val) {
                  this.rowIndexOrID.next({data: val, action: CONSTANTS.ADD});
                  this.toastrService.success( `Success`, `Data Added Successfully!`, { } );
                  dialogRef.close();
                }
              });
          }
        }
      }
    })
  }

}
