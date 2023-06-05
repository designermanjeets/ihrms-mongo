import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { MultiChartsComponent } from '@ihrms/ihrms-components';
import { CONSTANTS } from '@ihrms/shared';
import { AdminHolidaysService, GQL_CREATE_HOLIDAY, GQL_HOLIDAYS, GQL_UPDATE_HOLIDAY } from './_services/admin-holidays.service';
import { MatDialog } from '@angular/material/dialog';
import { IhrmsAdminDashboardService } from '../_services/ihrms-admin-dashboard.service';
import { map } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { SharedService } from '@ihrms/shared';
import { GridApi } from 'ag-grid-community';
import { ColumnApi } from '@ag-grid-community/core';


@Component({
  selector: 'ihrms-admin-holidays',
  templateUrl: './admin-holidays.component.html',
  styleUrls: ['./admin-holidays.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminHolidaysComponent implements OnInit, AfterViewInit {

  highcharts: typeof Highcharts = Highcharts;
  gridsterOptions: GridsterConfig;
  cardSize = 500;
  gridLoaded = false;
  dashboardItems: Array<GridsterItem> | any;
  gridResize: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  multiChartData: any | undefined;
  rowIndexOrID: Subject<any> = new Subject();

  sub!: Subscription;
  hide_show_add_button: any;
  hide_show_edit_button: any;
  hide_show_import_button: any;
  hide_show_export_button: any;
  holidaysGridApi!: GridApi;
  holidaysColumnApi!: ColumnApi;

  constructor(
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private _ahs: AdminHolidaysService,
    private router: Router,
    private _ihrmsadss: IhrmsAdminDashboardService,
    private apollo: Apollo,
    private sharedService: SharedService
  ) {
    this.gridsterOptions = this._ahs.getGridsterOptions(this.cardSize, this);
  }

  ngOnInit(): void {
    this.hide_show_edit_button = this.sharedService.checkuserPermission('Admin', 'Holidays', 'edit');
    this.multiChartData = [
      {
        title: "",
        columnFit: true,
        pagination: true,
        paginationAutoPageSize: true,
        viewAll: false,
        gridData: {
          columnDefs: [
            { field: 'name'},
            { field: 'date'},
            { field: 'comments'},
            { field: 'status', cellRenderer: 'GridStatusComponent'},
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

    this.getHoliday();

  }

  ngAfterViewInit() {
    this.gridLoaded = true;
    this.cdRef.detectChanges();
  }

  getHoliday() {
    // this._ihrmsadss.getEntityAll(CONSTANTS.TITLES.Holiday)
    this.sub = this.apollo.watchQuery<any, any>({ query: GQL_HOLIDAYS, variables: { query: { limit: 100 }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getHolidays))
      .subscribe(val => this.multiChartData[0].gridData.rowData = val);
  }

  setupDashboardItems() {
    this.hide_show_add_button = this.sharedService.checkuserPermission('Admin', 'Holidays', 'add');
    this.hide_show_import_button = this.sharedService.checkuserPermission('Admin', 'Holidays', 'import');
    this.hide_show_export_button = this.sharedService.checkuserPermission('Admin', 'Holidays', 'export');
    this.dashboardItems = [
      {
        dynamicComponent: MultiChartsComponent,
        gridsterItem: { cols: 2, rows: 2, y: 0, x: 0 },
        inputs: {
          cardRadius: 20,
          title: CONSTANTS.TITLES.Holidays,
          filterConfig: {
            filterForm: false,
            addButton: this.hide_show_add_button,
            show_Export_Button: this.hide_show_export_button,
            addButtonText: CONSTANTS.TITLES.AddHoliday,
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
    const mutation = event.action === CONSTANTS.EDIT ? GQL_UPDATE_HOLIDAY: null;
    const methodName = event.action === CONSTANTS.EDIT ? 'editHolidays': 'deleteHolidays';
    const dialogRef = this._ihrmsadss.outputActions
    this._ihrmsadss.outputActions(
      event,
      CONSTANTS.TITLES.Holiday,
      this._ahs,
      this._ihrmsadss,
      this.dialog,
      this.rowIndexOrID,
      mutation,
      methodName
    );
    this.dialogRef(dialogRef);
  }

  dynamicCompClickHandler(event: any) {
    const dialogRef= this._ihrmsadss.dynamicCompClickHandler(
      event,
      this._ahs,
      this._ihrmsadss,
      this.rowIndexOrID,
      CONSTANTS.TITLES.AddHoliday,
      GQL_CREATE_HOLIDAY,
      this.dialog,
      'createHolidays'
    );
    this.dialogRef(dialogRef);
    if(event.action === CONSTANTS.EXPORT_TO_EXCEL) {
      this.holidaysGridApi.exportDataAsExcel({
        fileName: 'All_Holidays_.xlsx'
      });
    }
    if(event.action === CONSTANTS.PRINT_ONLY) {
      const eGridDiv = document.querySelector<HTMLElement>('#ihrmsGrid') as any;
      eGridDiv.style.width = '';
      eGridDiv.style.height = '';
      this.holidaysGridApi.setDomLayout('print');
      setTimeout(function () {
        print();
      }, 2000);
    }

    if (event.component && event.comp_name === CONSTANTS.IHRMS_GRID_COMPONENT) {
      if (event.action === CONSTANTS.ON_GRID_READY) {
        this.holidaysGridApi = event.gridApi;
        this.holidaysColumnApi = event.gridColumnApi;
      }
    }
    }

    dialogRef(dialogRef: any) {
      this.sub = dialogRef?.componentInstance?.dialogEventEmitter.subscribe((result: any) => {
        if(result && dialogRef.componentInstance) {
          if(result.action === CONSTANTS.FORM_OBJECT_EVENT) {
            // this._ihrmsadss.getSelectOptions(dialogRef.componentInstance?.controlsObj, this.departmentOptions, 'departmentId', '_id')
          }
          if(result.action === CONSTANTS.FORM_VALUE_CHANGE) {
  
          }
        }
      });
    }

}
  

  