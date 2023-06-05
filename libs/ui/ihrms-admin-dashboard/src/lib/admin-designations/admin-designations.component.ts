import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CONSTANTS } from '@ihrms/shared';
import { MultiChartsComponent } from '@ihrms/ihrms-components';
import { AdminDesignationsService, GQL_CREATE_DESIGNATION, GQL_DEPARTMENTS, GQL_DESIGNATIONS, GQL_UPDATE_DESIGNATION } from './_services/admin-designations.service';
import { map } from 'rxjs/operators';
import { IhrmsAdminDashboardService } from '../_services/ihrms-admin-dashboard.service';
import { Apollo } from 'apollo-angular';
import { SharedService } from '@ihrms/shared';
import { GridApi } from 'ag-grid-community';
import { ColumnApi } from '@ag-grid-community/core';

@Component({
  selector: 'ihrms-admin-designations',
  templateUrl: './admin-designations.component.html',
  styleUrls: ['./admin-designations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDesignationsComponent implements OnInit, AfterViewInit, OnDestroy {

  highcharts: typeof Highcharts = Highcharts;
  gridsterOptions: GridsterConfig;
  cardSize = 500;
  gridLoaded = false;
  dashboardItems: Array<GridsterItem> | any;
  gridResize: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  multiChartData: any | undefined;
  rowIndexOrID: Subject<any> = new Subject();

  departmentOptions: any;

  sub!: Subscription;

  hide_show_add_button: any;
  hide_show_edit_button: any;
  hide_show_import_button: any;
  hide_show_export_button: any;
  designationsGridApi!: GridApi;
  designationsColumnApi!: ColumnApi;

  constructor(
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private _ads: AdminDesignationsService,
    private _ihrmsadss: IhrmsAdminDashboardService,
    private apollo: Apollo,
    private sharedService: SharedService
  ) {
    this.gridsterOptions = this._ads.getGridsterOptions(this.cardSize, this);
  }

  ngOnInit(): void {
    this.hide_show_edit_button = this.sharedService.checkuserPermission('Admin', 'Designation', 'edit');
    this.multiChartData = [
      {
        title: "",
        columnFit: true,
        pagination: true,
        paginationAutoPageSize: true,
        viewAll: false,
        gridData: {
          columnDefs: [
            { field: 'name', autoHeight: true },
            { field: 'department.name', headerName: 'Department Name'},
            { field: 'audit.created_at', headerName: 'Creation Date'},
            { field: 'status', cellRenderer: 'GridStatusComponent'},
            { field: 'comments'},
            { field: 'Action', filter: false, cellRenderer: 'GridActionComponent',
              cellRendererParams: {
                action: this.outputActions.bind(this),
                value: { actionBtn: ['edit'] }
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

    this.getDesignations();

    this.getDepartments();

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

  getDesignations() {
    this.sub = this.apollo.watchQuery<any, any>({ query: GQL_DESIGNATIONS, variables: { query: { limit: 100 }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getDesignations))
      .subscribe(val => {
        this.multiChartData[0].gridData.rowData = val;
        this.rowIndexOrID.next({ action: CONSTANTS.UPDATE, rowData: val });
      });
  }

  getDepartments() {
    this.sub = this.apollo.watchQuery<any, any>({ query: GQL_DEPARTMENTS, variables: { query: { limit: 100 }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getDepartments))
      .subscribe(val => this.departmentOptions = val);
  }

  setupDashboardItems() {

    this.hide_show_add_button = this.sharedService.checkuserPermission('Admin', 'Designation', 'add');
    this.hide_show_export_button = this.sharedService.checkuserPermission('Admin', 'Designation', 'export');

    this.dashboardItems = [
      {
        dynamicComponent: MultiChartsComponent,
        gridsterItem: { cols: 2, rows: 2, y: 0, x: 0 },
        inputs: {
          cardRadius: 20,
          title: CONSTANTS.TITLES.Designations,
          filterConfig: {
            filterForm: false,
            addButton: this.hide_show_add_button,
            show_Export_Button: this.hide_show_export_button,
            addButtonText: CONSTANTS.TITLES.AddDesignation,
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
    const mutation = event.action === CONSTANTS.EDIT ? GQL_UPDATE_DESIGNATION: null;
    const methodName = event.action === CONSTANTS.EDIT ? 'editDesignation': 'deleteDesignation';
    const dialogRef = this._ihrmsadss.outputActions(
      event,
      CONSTANTS.TITLES.Designation,
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
      CONSTANTS.TITLES.AddDesignation,
      GQL_CREATE_DESIGNATION,
      this.dialog,
      'createDesignation'
    );
    this.dialogRef(dialogRef);
    if(event.action === CONSTANTS.EXPORT_TO_EXCEL) {
      this.designationsGridApi.exportDataAsExcel({
        fileName: 'All_Designations_.xlsx'
      });
    }
    if(event.action === CONSTANTS.PRINT_ONLY) {
      const eGridDiv = document.querySelector<HTMLElement>('#ihrmsGrid') as any;
      eGridDiv.style.width = '';
      eGridDiv.style.height = '';
      this.designationsGridApi.setDomLayout('print');
      setTimeout(function () {
        print();
      }, 2000);
    }

    if (event.component && event.comp_name === CONSTANTS.IHRMS_GRID_COMPONENT) {
      if (event.action === CONSTANTS.ON_GRID_READY) {
        this.designationsGridApi = event.gridApi;
        this.designationsColumnApi = event.gridColumnApi;
      }
    }
  }

  dialogRef(dialogRef: any) {
    this.sub = dialogRef?.componentInstance?.dialogEventEmitter.subscribe((result: any) => {
      if(result && dialogRef.componentInstance) {
        if(result.action === CONSTANTS.FORM_OBJECT_EVENT) {
          this._ihrmsadss.getSelectOptions(dialogRef.componentInstance?.controlsObj, this.departmentOptions, 'departmentId', '_id')
        }
        if(result.action === CONSTANTS.FORM_VALUE_CHANGE) {

        }
      }
    });
  }

}