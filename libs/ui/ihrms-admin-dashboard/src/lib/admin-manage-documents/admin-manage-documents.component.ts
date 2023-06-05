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
import { GQL_DAYS_WISE_ATTENDANCES } from '../admin-attendance/_services/admin-attendance.service';
import { AdminMangeDocumentsService } from './_services/admin-mange-documents.service';

@Component({
  selector: 'ihrms-admin-manage-documents',
  templateUrl: './admin-manage-documents.component.html',
  styleUrls: ['./admin-manage-documents.component.scss'],
})
export class AdminManageDocumentsComponent implements OnInit, AfterViewInit {

  highcharts: typeof Highcharts = Highcharts;
  gridsterOptions: GridsterConfig;
  cardSize = 500;
  gridLoaded = false;
  dashboardItems: Array<GridsterItem> | any;
  gridResize: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  multiChartData: any | undefined;
  rowIndexOrID: Subject<any> = new Subject();

  sub!: Subscription;
  updateMultiComp$: Subject<any> = new Subject();

  constructor(
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private _amds: AdminMangeDocumentsService,
    private router: Router,
    private _ihrmsadss: IhrmsAdminDashboardService,
    private apollo: Apollo
  ) {
    this.gridsterOptions = this._amds.getGridsterOptions(this.cardSize, this);
  }

  ngOnInit(): void {
    this.setupDashboardItems(); // Attendance
  }

  ngAfterViewInit() {
    this.gridLoaded = true;
    this.cdRef.detectChanges();
  }
  setupDashboardItems() {

    this.multiChartData = [
      {
        fileManagerData: {
          filemanagerConfig: true
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
          title: CONSTANTS.TITLES.ManageDocuments,
          filterConfig: {
            filterForm: true,
            // show_Export_Button: this.hide_show_export_button,
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
    //
  }

}
