import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { BehaviorSubject, Subscription } from 'rxjs';
import { EmpAttendanceService, GQL_ATTENDANCES_REQUESTS, GQL_GET_ATTENDANCE_BY_DATE_WISE } from '../_services/emp-attendance.service';
import * as moment from 'moment';
import { IhrmsGridComponent } from '@ihrms/ihrms-grid';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { CONSTANTS } from '@ihrms/shared';
import { map } from 'rxjs/operators';
import { IhrmsEmpDashboardService } from '../../_services/ihrms-emp-dashboard.service';
import { MatDialog } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import * as _ from 'lodash';
import { GridApi } from 'ag-grid-community';
import { ColumnApi } from '@ag-grid-community/core';
import { SharedService } from '@ihrms/shared';

@Component({
  selector: 'ihrms-emp-attendance-details',
  templateUrl: './emp-attendance-details.component.html',
  styleUrls: ['./emp-attendance-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmpAttendanceDetailsComponent implements OnInit {

  gridsterOptions: GridsterConfig;
  cardSize = 500;
  gridLoaded = false;
  dashboardItemsAttendanceDetails: Array<GridsterItem> | any;
  dashboardItemsAttendanceRequests: Array<GridsterItem> | any;
  gridResize: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  selectedIndex! : number;
  gridAttendancedetailsApi!: GridApi;
  columnAttendancedetailsApi!: ColumnApi;
  hide_show_export_button: any;

  rowDataAttendance!: any;
  updateComponent$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  rowDataAttendanceReq!: any;
  updateComponentReq$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  sub!: Subscription;

  filterConfig: any;

  constructor(
    private _eas: EmpAttendanceService,
    private router: Router,
    private route: ActivatedRoute,
    private _ihrmsempss: IhrmsEmpDashboardService,
    public dialog: MatDialog,
    private apollo: Apollo,
    private sharedService: SharedService
  ) {
    this.gridsterOptions = this._eas.getGridsterOptions(this.cardSize, this);
  }

  ngOnInit(): void {

    this.setupDashboardItems();

    this.route.queryParams.subscribe(params => {
      this.selectedIndex = +params['tab'];
    });

    this.filterConfig = { // Default Range
      start: moment(moment().subtract(30,'d')).add(1, 'd').toISOString(),
      end: moment().add(1, 'd').toISOString(),
      filterForm: false,
      show_Export_Button: this.hide_show_export_button,
    };

    this.getAttendanceDateWise();

    this.getAttendanceRequestAll();

  }

  getAttendanceDateWise() {
    this.sub = this.apollo.watchQuery<any, any>({ 
      query: GQL_GET_ATTENDANCE_BY_DATE_WISE, 
      variables: { 
        query: { 
          limit: 10,
          userID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID,
          dates: { 
            gte: moment().startOf('day').format(),
          },
        }
      }
    }).valueChanges
      .pipe(map((data: any) => data?.data?.getAttendancesByDayWise))
      .subscribe(val => this.updateComponent$.next({ action: CONSTANTS.UPDATE, rowData: val }));
  }

  getAttendanceRequestAll() {
    this.sub = this.apollo.watchQuery<any, any>({ 
      query: GQL_ATTENDANCES_REQUESTS, 
      variables: { 
        query: { 
          limit: 100,
          dates: {
            // gte: moment(moment.now()).format('DD-MM-YYYY') // Need All Previous "Pending" Ones
          },
          userID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID,
        }
      }})
      .valueChanges
      .pipe(map((data: any) => data?.data?.getAttendanceRequests))
      .subscribe(val => {
        if(val) {
          this.updateComponentReq$.next({ action: CONSTANTS.UPDATE, rowData: val });
        }
      });
  }

  outputActions(event: any) {
    if(event.action === CONSTANTS.REQUEST_CORRECTION) {
      const rowData = _.cloneDeep(event);
      rowData.data.data.shiftName = rowData.data.data.user_roster?.shifts.length && rowData.data.data.user_roster?.shifts[0];
      rowData.data.data.punchIn = rowData.data?.data?.punchIn && this._ihrmsempss.getLocalTimeZone(rowData.data?.data?.date, rowData.data?.data?.punchIn);
      rowData.data.data.punchOut = rowData.data?.data?.punchOut && this._ihrmsempss.getLocalTimeZone(rowData.data?.data?.date, rowData.data?.data?.punchOut);
      this._eas.outputActions(rowData, this._eas, this.dialog, this.sub, this.updateComponent$);
    }
  }

  setupDashboardItems() {
    this.hide_show_export_button = this.sharedService.checkuserPermission('Employee', 'Attendance', 'export');
    this.dashboardItemsAttendanceDetails = [
      {
        dynamicComponent: IhrmsGridComponent,
        gridsterItem: { cols: 1, rows: 1, y: 0, x: 0 },
        inputs: {
          title: '',
          cardRadius: 0,
          columnDefs: this._eas.getAttendanceColDefs(this.outputActions, this),
          rowData: this.rowDataAttendance,
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

    this.dashboardItemsAttendanceRequests = [
      {
        dynamicComponent: IhrmsGridComponent,
        gridsterItem: { cols: 1, rows: 1, y: 0, x: 0 },
        inputs: {
          title: '',
          cardRadius: 0,
          columnDefs: this._eas.getAttendanceRequestColDefs(this.outputActions, this),
          rowData: this.rowDataAttendanceReq,
          pagination: true,
          paginationAutoPageSize: true,
          columnFit: true,
          viewAll: false,
          updateGridFromOutside: this.updateComponentReq$
        },
        flatItem: true,
        gridComponentFullHeight: true,
        outputs: {
          onClickHandler: { handler: this.dynamicCompClickHandler.bind(this), args: ['$event'] }
        }
      }
    ];
  }

  dynamicCompClickHandler(event: any) {
    console.log(event)
    if (event.component && event.comp_name === CONSTANTS.IHRMS_GRID_COMPONENT) {
      if (event.action === CONSTANTS.ON_FIRST_DATA_RENDERED) {
        this.gridAttendancedetailsApi = event.event.api;
        this.columnAttendancedetailsApi = event.event.columnApi;
      }
    }
  }

  onFiltersClickHandler(event: any) {
    console.log(event)
    if(event.component && event.comp_name === CONSTANTS.IHRMS_FILTERS_COMPONENT) {
      if(event.action === CONSTANTS.FILTER_SEARCH) {
        //
      }
    }
    if(event.action === CONSTANTS.EXPORT_TO_EXCEL) {
      this.gridAttendancedetailsApi.exportDataAsExcel({
        fileName: 'All_Attendance-Details_.xlsx'
      });
    }
    if(event.action === CONSTANTS.PRINT_ONLY) {
      const eGridDiv = document.querySelector<HTMLElement>('#ihrmsGrid') as any;
      eGridDiv.style.width = '';
      eGridDiv.style.height = '';
      this.gridAttendancedetailsApi.setDomLayout('print');
      setTimeout(function () {
        print();
      }, 2000);
    }

  }

  onTabChanged(event: MatTabChangeEvent) {
    this.selectedIndex = event.index;
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: { tab: this.selectedIndex }});
  }

}
