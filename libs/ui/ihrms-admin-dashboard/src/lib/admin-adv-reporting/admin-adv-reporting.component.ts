/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/member-ordering */
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { GQL_EMPLOYEES, MultiChartsComponent } from '@ihrms/ihrms-components';
import { CONSTANTS } from '@ihrms/shared';
import { IhrmsAdminDashboardService } from '../_services/ihrms-admin-dashboard.service';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import * as moment from 'moment';
import { GridApi, GridOptions, IsRowMaster } from 'ag-grid-community';
import { ColumnApi } from '@ag-grid-community/core';
import { AdminAdvReportingService } from './_services/admin-adv-reporting.service';
import { GQL_DAYS_WISE_ATTENDANCES } from '../admin-attendance/_services/admin-attendance.service';

@Component({
  selector: 'ihrms-admin-adv-reporting',
  templateUrl: './admin-adv-reporting.component.html',
  styleUrls: ['./admin-adv-reporting.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminAdvReportingComponent implements OnInit, AfterViewInit {

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

  dataSourceSettings: any = { };
  updateMultiComp$: Subject<any> = new Subject();

  constructor(
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private _advs: AdminAdvReportingService,
    private router: Router,
    private _ihrmsadss: IhrmsAdminDashboardService,
    private apollo: Apollo
  ) {
    this.gridsterOptions = this._advs.getGridsterOptions(this.cardSize, this);
  }

  ngOnInit(): void {
    this.setupDashboardItems(); // Attendance
  }

  ngAfterViewInit() {
    this.gridLoaded = true;
    this.cdRef.detectChanges();
  }

  getAttendance(start?: any, end?: any,username?: any) {
    const params = (start && end || username) ?  
    { gte: new Date(new Date(start).setUTCHours(0, 0, 0, 0)), lt: new Date(new Date(end).setUTCHours(0, 0, 0, 0)) }: 
    { gte: new Date(new Date().setUTCHours(0, 0, 0, 0)) }
    this.sub = this.apollo.watchQuery<any, any>({ 
      query: GQL_DAYS_WISE_ATTENDANCES, 
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
      .pipe(map((data: any) => data?.data?.getDayWiseAttendances))
      .subscribe(val => {
        if(val) {
          this.dataSourceSettings = {
            enableSorting: true,
            columns: [
              { name: 'date', caption: 'date' },
            ],
            rows: [
              { name: 'username', caption: 'username', expandAll: true, allowDragAndDrop: false },
            ],
            formatSettings: [
              { name: 'punchIn', format: 'N0' },
              { name: 'punchOut', format: 'N0' },
            ],
            dataSource: val,
            expandAll: false,
            values: [
              // { name: 'username', caption: 'username', type: 'Index' },
              // { name: 'eCode', caption: 'eCode' },
              // { name: 'punchIn', caption: 'punchIn', type: 'Index' },
              // { name: 'punchOut', caption: 'punchOut', type: 'Index'  },
              // { name: 'shiftName', caption: 'shiftName', type: 'Index' },
              { name: 'totalHours', caption: 'Total Hours' },
              { name: 'overtime', caption: 'Overtime' },
            ],
            filters: [
              { name: 'date', caption: 'date' }
            ],
            fieldMapping: [
              { name: 'userId', dataType: 'string' },
              { name: 'username', caption: 'username', dataType: 'string' },
              { name: 'date', caption: 'date', dataType: 'string' },
              { name: 'punchIn', caption: 'punchIn', dataType: 'string' },
              { name: 'punchOut', caption: 'punchOut', dataType: 'string' }
            ],
            groupSettings: [
              // { name: 'username' }
            ],
            conditionalFormatSettings: [
              {
                measure: 'totalHours',
                value1: 1,
                value2: 4,
                conditions: 'Between',
                style: {
                  backgroundColor: '#c0c71a',
                  color: 'white',
                  fontFamily: 'Tahoma',
                  fontSize: '12px'
                },
                applyGrandTotals: true
              },
            ],
            showHeaderWhenEmpty: true,
            emptyCellsTextContent: '-',
          };
          this.multiChartData = [
            {
              pivotData: {
                pivot: true,
                dataSourceSettings: this.dataSourceSettings,
                title: 'Attendance Analysis'
              },
              flex: 100,
              height: 100
            },
          ]
          // this.multiChartData[0].pivotData.title = 'Attendance Analysis';
          // this.multiChartData[0].pivotData.dataSourceSettings = this.dataSourceSettings;
          this.updateMultiComp$.next(this.multiChartData);
        }
      });
  }

  setupDashboardItems() {

    this.multiChartData = [
      {
        pivotData: {
          pivot: true,
          dataSourceSettings: this.dataSourceSettings,
          title: 'Analysis'
        },
        flex: 100,
        height: 100
      }
    ];

    this.dashboardItems = [
      {
        dynamicComponent: MultiChartsComponent,
        gridsterItem: { cols: 2, rows: 2, y: 0, x: 0 },
        inputs: {
          cardRadius: 20,
          title: CONSTANTS.TITLES.AdvanceReporting,
          filterConfig: {
            filterForm: true,
            // show_Export_Button: this.hide_show_export_button,
            moduleOptions: true
          },
          compData: this.multiChartData,
          gridComponentFullHeight: true,
          updateMultiChart: this.updateMultiComp$
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
    if (event.component && event.comp_name === CONSTANTS.IHRMS_FILTERS_COMPONENT) {
      if (event.action === CONSTANTS.FILTER_ON_VALUE_CHANGE) {
        console.log(event);
      }
      if (event.action === CONSTANTS.FILTER_SEARCH) {
        console.log(event);
        const start = moment(event.filterForm.value.start).add(1, 'd');
        const end = moment(event.filterForm.value.end).add(2, 'd');
        const username = event.filterForm.value.attendanceFilter;
        if(event.filterForm.value.modulesFilter === 'Attendance') {
          this.getAttendance(start, end,username);
        }
      }
    }
  }

  dialogRef(dialogRef: any) {
    this.sub = dialogRef?.componentInstance?.dialogEventEmitter.subscribe((result: any) => {
      if(result && dialogRef.componentInstance) {
        if(result.action === CONSTANTS.FORM_OBJECT_EVENT) {
          //
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

