import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { MultiChartsComponent } from '@ihrms/ihrms-components';
import { CONSTANTS } from '@ihrms/shared';
import { AdminCompaniesService, GQL_CREATE_TENANT, GQL_TENANTS, GQL_UPDATE_TENANT } from './_services/admin-companies.service';
import { IhrmsAdminDashboardService } from '../_services/ihrms-admin-dashboard.service';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import { SharedService } from '@ihrms/shared';
import { GridApi } from 'ag-grid-community';
import { ColumnApi } from '@ag-grid-community/core';


@Component({
  selector: 'ihrms-admin-companies',
  templateUrl: './admin-companies.component.html',
  styleUrls: ['./admin-companies.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminCompaniesComponent implements OnInit, AfterViewInit {

  highcharts: typeof Highcharts = Highcharts;
  gridsterOptions: GridsterConfig;
  cardSize = 500;
  gridLoaded = false;
  dashboardItems: Array<GridsterItem> | any;
  gridResize: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  multiChartData: any | undefined;
  rowIndexOrID: Subject<any> = new Subject();
  hide_show_add_button: any;
  hide_show_edit_button: any;
  hide_show_import_button: any;
  hide_show_export_button: any;
  companiesGridApi!: GridApi;
  companiesColumnApi!: ColumnApi;

  sub!: Subscription;

  constructor(
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private _acs: AdminCompaniesService,
    private router: Router,
    private _ihrmsadss: IhrmsAdminDashboardService,
    private apollo: Apollo,
    private sharedService: SharedService
  ) {
    this.gridsterOptions = this._acs.getGridsterOptions(this.cardSize, this);
  }

  ngOnInit(): void {
    this.hide_show_edit_button = this.sharedService.checkuserPermission('Companies', 'Company', 'edit');
    this.multiChartData = [
      {
        title: "",
        columnFit: true,
        pagination: true,
        paginationAutoPageSize: true,
        gridData: {
          columnDefs: [
            { field: 'name'},
            { field: 'printName'},
            { field: 'email'},
            { field: 'adminEmailAddress'},
            { field: 'connectionString'},
            { field: 'audit.created_at'},
            { field: 'status', headerName: 'Status', cellRenderer: 'GridStatusComponent'},
            { field: 'comments'},
            { field: 'Action', cellRenderer: 'GridActionComponent',
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

    this.getCompanies();

  }

  ngAfterViewInit() {
    this.gridLoaded = true;
    this.cdRef.detectChanges();
  }

  getCompanies() {
    this.sub = this.apollo.watchQuery<any, any>({ query: GQL_TENANTS, variables: { query: { limit: 100 }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getTenants))
      .subscribe(val => this.rowIndexOrID.next({rowData: val, action: CONSTANTS.UPDATE}));
  }

  setupDashboardItems() {
    this.hide_show_add_button = this.sharedService.checkuserPermission('Companies', 'Company', 'add');
    this.hide_show_import_button = this.sharedService.checkuserPermission('Companies', 'Company', 'import');
    this.hide_show_export_button = this.sharedService.checkuserPermission('Companies', 'Company', 'export');
    this.dashboardItems = [
      {
        dynamicComponent: MultiChartsComponent,
        gridsterItem: { cols: 2, rows: 2, y: 0, x: 0 },
        inputs: {
          cardRadius: 20,
          title: CONSTANTS.TITLES.Companies,
          filterConfig: {
            filterForm: false,
            addButton: this.hide_show_add_button,
            show_Export_Button: this.hide_show_export_button,
            addButtonText: CONSTANTS.TITLES.AddCompany,
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
    const mutation = event.action === CONSTANTS.EDIT ? GQL_UPDATE_TENANT: null;
    const methodName = event.action === CONSTANTS.EDIT ? 'editTenant': 'deleteTenant';
    const dialogRef = this._ihrmsadss.outputActions(
      event,
      CONSTANTS.TITLES.Company,
      this._acs,
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
      this._acs,
      this._ihrmsadss,
      this.rowIndexOrID,
      CONSTANTS.TITLES.AddCompany,
      GQL_CREATE_TENANT,
      this.dialog,
      'createTenant'
    );
    this.dialogRef(dialogRef);
    if(event.action === CONSTANTS.EXPORT_TO_EXCEL) {
      this.companiesGridApi.exportDataAsExcel({
        fileName: 'All_Companies_.xlsx'
      });
    }
    if(event.action === CONSTANTS.PRINT_ONLY) {
      const eGridDiv = document.querySelector<HTMLElement>('#ihrmsGrid') as any;
      eGridDiv.style.width = '';
      eGridDiv.style.height = '';
      this.companiesGridApi.setDomLayout('print');
      setTimeout(function () {
        print();
      }, 2000);
    }

    if (event.component && event.comp_name === CONSTANTS.IHRMS_GRID_COMPONENT) {
      if (event.action === CONSTANTS.ON_GRID_READY) {
        this.companiesGridApi = event.gridApi;
        this.companiesColumnApi = event.gridColumnApi;
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
