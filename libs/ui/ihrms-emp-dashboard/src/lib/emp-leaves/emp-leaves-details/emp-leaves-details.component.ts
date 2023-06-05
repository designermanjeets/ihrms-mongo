import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { BehaviorSubject, Subject, Subscription, map } from 'rxjs';
import { IhrmsGridComponent } from '@ihrms/ihrms-grid';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { EmpLeavesService } from '../_services/emp-leaves.service';
import { GridApi } from 'ag-grid-community';
import { ColumnApi } from '@ag-grid-community/core';
import { SharedService } from '@ihrms/shared';
import { CONSTANTS } from '@ihrms/shared';
import { Apollo } from 'apollo-angular';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GQL_LEAVE_REQUEST } from '../../_services/ihrms-emp-dashboard.service';


@Component({
  selector: 'ihrms-emp-leaves-details',
  templateUrl: './emp-leaves-details.component.html',
  styleUrls: ['./emp-leaves-details.component.scss']
})
export class EmpLeavesDetailsComponent implements OnInit {

  gridsterOptions: GridsterConfig;
  gridLoaded = false;
  dashboardItemsLeaveRequests: Array<GridsterItem> | any;
  gridResize: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  selectedIndex! : number;
  @ViewChild('tabGroup') tabGroup!: ElementRef;
  gridAttendancedetailsApi!: GridApi;
  columnAttendancedetailsApi!: ColumnApi;
  hide_show_export_button: any;

  cardSize = this.tabGroup?.nativeElement?.offsetHeight;

  filterConfig: any;

  sub!: Subscription;
  rowIndexOrIDLeaveRequest: Subject<any> = new Subject();

  constructor(
    private _els: EmpLeavesService,
    private sharedService: SharedService,
    private apollo: Apollo,
    private toastrService: ToastrService,
    private ngxService: NgxUiLoaderService,
    private cdRef: ChangeDetectorRef,
    
  ) {
    this.gridsterOptions = this._els.getGridsterOptions(this.cardSize, this );
  }

  ngOnInit(): void {

    this.setupDashboardItems();
    
    this.getRequestleaves();

    this.filterConfig = {
      filterForm: false,
      show_Export_Button: this.hide_show_export_button,
    };

  }

  getRequestleaves() {
    this.sub = this.apollo.watchQuery<any, any>({ query: GQL_LEAVE_REQUEST, variables: { query: { limit: 100, userID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getLeaveRequests))
      .subscribe(val => {
        if(val) {
          this.rowIndexOrIDLeaveRequest.next({ action: CONSTANTS.UPDATE, rowData: val });
          this.cdRef.detectChanges();
        }
      });
  }

  outputActions(event: any) {
    console.log(event);
  }

  setupDashboardItems() {
    this.hide_show_export_button = this.sharedService.checkuserPermission('Employee', 'Leaves', 'export');
    
    this.dashboardItemsLeaveRequests = [
      {
        dynamicComponent: IhrmsGridComponent,
        gridsterItem: { cols: 1, rows: 1, y: 0, x: 0 },
        inputs: {
          title: '',
          cardRadius: 0,
          rowData: [],
          columnDefs: [
            { field: 'startDate'},
            { field: 'endDate'},
            { field: 'days'},
            { field: 'leaveType.name'},
            { field: 'status'}
          ],
          columnFit: true,
          updateGridFromOutside: this.rowIndexOrIDLeaveRequest,
          pagination: true,
          paginationAutoPageSize: true,
          viewAll: false,
          illustration: 'Illustration_Leave.png',
        },
        flatItem: true,
        gridComponentFullHeight: true,
        outputs: {
          onClickHandler: { handler: this.dynamicCompClickHandler, args: ['$event', this] }
        }
      }
    ];

  }

  dynamicCompClickHandler(event: any, _this: EmpLeavesDetailsComponent) {
    //
    if (event.component && event.comp_name === CONSTANTS.IHRMS_GRID_COMPONENT) {
      if (event.action === CONSTANTS.ON_FIRST_DATA_RENDERED) {
        _this.gridAttendancedetailsApi = event.event.api;
        _this.columnAttendancedetailsApi = event.event.columnApi;
      }
    }
  }

  onTabChanged(event: MatTabChangeEvent) {
    console.log(event);
    this.selectedIndex = event.index;
  }
  onFiltersClickHandler(event: any) {
    if(event.action === CONSTANTS.EXPORT_TO_EXCEL) {
      this.gridAttendancedetailsApi.exportDataAsExcel({
        fileName: 'All_Leaves-Details_.xlsx'
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

}

