/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/member-ordering */
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MultiChartsComponent } from '@ihrms/ihrms-components';
import { CONSTANTS } from '@ihrms/shared';
import { IhrmsAdminDashboardService } from '../_services/ihrms-admin-dashboard.service';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import { AdminLogsService, GQL_ACTIVITY_LOGS } from './_services/admin-logs.service';
import * as moment from 'moment';
import { GridApi, GridOptions, IsRowMaster } from 'ag-grid-community';
import { ColumnApi } from '@ag-grid-community/core';

@Component({
  selector: 'ihrms-admin-activity-logs',
  templateUrl: './admin-activity-logs.component.html',
  styleUrls: ['./admin-activity-logs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminActivityLogsComponent implements OnInit, AfterViewInit {

  highcharts: typeof Highcharts = Highcharts;
  gridsterOptions: GridsterConfig;
  cardSize = 500;
  gridLoaded = false;
  dashboardItems: Array<GridsterItem> | any;
  gridResize: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  multiChartData: any | undefined;
  rowIndexOrID: Subject<any> = new Subject();

  sub!: Subscription;
  
  logsGridApi!: GridApi;
  logsGridOptions!: GridOptions;
  logsGridColumnApi!: ColumnApi;

  masterDetail = true;
  public isRowMaster: IsRowMaster = (dataItem: any) => {
    return dataItem ? dataItem.change_history?.changedFields?.length > 0 : false;
  };
  // provide Detail Cell Renderer Params
  detailCellRendererParams = {
    // provide the Grid Options to use on the Detail Grid
    detailGridOptions: {
        columnDefs: [
          { field: 'object_id', headerName: 'Object ID'},
          { field: 'property', headerName: 'Property'},
          { field: 'old_value', headerName: 'Old Value'},
          { field: 'new_value', headerName: 'New Value'},
        ]
    },
    // get the rows for each Detail Grid
    getDetailRowData: (params: any) => {
      params.successCallback(params.data?.change_history.changedFields || []);
    }
  };

  rowClassRules = {
    'row-border-transparent': function(params: any) { return params.data.event_summary.status !== 'Success' && params.data.event_summary.status !== 'success' && params.data.event_summary.status !== 'Failed' },
    'row-border-green': function(params: any) { return params.data.event_summary.status === 'Success' || params.data.event_summary.status === 'success'; },
    'row-border-red': function(params: any) { return params.data.event_summary.status === 'Failed'; },
  };

  constructor(
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private _als: AdminLogsService,
    private router: Router,
    private _ihrmsadss: IhrmsAdminDashboardService,
    private apollo: Apollo
  ) {
    this.gridsterOptions = this._als.getGridsterOptions(this.cardSize, this);
  }

  ngOnInit(): void {

    this.multiChartData = [
      {
        title: "",
        columnFit: true,
        pagination: true,
        paginationAutoPageSize: true,
        masterDetail: this.masterDetail,
        detailCellRendererParams: this.detailCellRendererParams,
        isRowMaster: this.isRowMaster,
        rowClassRules: this.rowClassRules,
        gridData: {
          columnDefs: [
            { field: 'event_summary.operation_name', headerName: 'Operation Name', cellRenderer: 'agGroupCellRenderer'},
            { field: 'event_summary.status', headerName: 'Operation Status'},
            { field: 'change_history.change_table', headerName: 'Table'},
            { field: 'change_history.change_type', headerName: 'Action'},
            // { field: 'change_history.changedFields', headerName: 'Changed Fields', wrapText: false, cellRenderer: 'GridSimpleListComponent', autoHeight: true, },
            { field: 'event_summary.event_initiated_by_user', headerName: 'By User'},
            { field: 'event_summary.timestamp', headerName: 'Time', cellRenderer: (data: any) => data.value && moment(data.value).fromNow()},
            { field: 'event_summary.timestamp', headerName: 'Timestamp', cellRenderer: (data: any) => data.value && moment(data.value).format('MM/DD/YYYY hh:mm:ss A')},
            { field: 'event_summary.success_or_error_msg', headerName: 'Success/Error Message'},
            // { field: 'event_summary.tenant_id', headerName: 'Tenant Id'},
          ],
          rowData: [],
          updateGridFromOutside: this.rowIndexOrID
        },
        flex: 100,
        height: 100
      }
    ]

    this.setupDashboardItems();

    this.getActivityLogs();

  }

  ngAfterViewInit() {
    this.gridLoaded = true;
    this.cdRef.detectChanges();
  }

  getActivityLogs() {
    this.sub = this.apollo.watchQuery<any, any>({ query: GQL_ACTIVITY_LOGS, variables: { query: { limit: 100, sortBy: '-1' }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getActivityLogs))
      .subscribe(val => {
        this.rowIndexOrID.next({rowData: val, action: CONSTANTS.UPDATE})
      });
  }

  setupDashboardItems() {

    this.dashboardItems = [
      {
        dynamicComponent: MultiChartsComponent,
        gridsterItem: { cols: 2, rows: 2, y: 0, x: 0 },
        inputs: {
          cardRadius: 20,
          title: CONSTANTS.TITLES.AuditLogs,
          filterConfig: {
            filterForm: false,
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
    if (event.component && event.comp_name === CONSTANTS.IHRMS_GRID_COMPONENT) {
      if (event.action === CONSTANTS.ON_GRID_READY) {
        this.logsGridApi = event.gridApi;
        this.logsGridColumnApi = event.gridColumnApi;
        this.logsGridOptions = event.gridOptions;
      }
      if(event.action === CONSTANTS.ON_FIRST_DATA_RENDERED) {
        this.logsGridApi.forEachNode((node) => node.expanded = false);
        this.logsGridApi.onGroupExpandedOrCollapsed();
      }
    }
  }

  dialogRef(dialogRef: any) {
    this.sub = dialogRef?.componentInstance?.dialogEventEmitter.subscribe((result: any) => {
      if(result && dialogRef.componentInstance) {
        if(result.action === CONSTANTS.FORM_OBJECT_EVENT) {
        }
        if(result.action === CONSTANTS.FORM_VALUE_CHANGE) {
        }
        if(result.action === CONSTANTS.FORM_SUBMIT_EVENT) {
        }
      }
    });
  }

}
