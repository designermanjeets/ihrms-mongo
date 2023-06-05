import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { BehaviorSubject } from 'rxjs';
import { AdminFinancesService } from '../../../admin-finances/_services/admin-finances.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { IhrmsGridComponent } from '@ihrms/ihrms-grid';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'ihrms-admin-jobs-dashboard-details',
  templateUrl: './admin-jobs-dashboard-details.component.html',
  styleUrls: ['./admin-jobs-dashboard-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminJobsDashboardDetailsComponent implements OnInit {

  gridsterOptions: GridsterConfig;
  gridLoaded = false;

  dashboardItemsAll: Array<GridsterItem> | any;
  dashboardItemsSaved: Array<GridsterItem> | any;
  dashboardItemsApplied: Array<GridsterItem> | any;
  dashboardItemsInterviewing: Array<GridsterItem> | any;
  dashboardItemsOffered: Array<GridsterItem> | any;
  dashboardItemsArchived: Array<GridsterItem> | any;

  gridResize: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  selectedIndex! : number;
  @ViewChild('tabGroup') tabGroup!: ElementRef;

  cardSize = this.tabGroup?.nativeElement?.offsetHeight;

  filterConfig: any;

  constructor(
    private _afs: AdminFinancesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.gridsterOptions = this._afs.getGridsterOptions(this.cardSize, this );
  }

  ngOnInit(): void {

    this.setupDashboardItems();

    this.route.queryParams.subscribe(params => {
      this.selectedIndex = +params['tab'];
    });

    this.filterConfig = {
      filterForm: false
    };

  }

  outputActions(event: any) {
    console.log(event);
  }

  setupDashboardItems() {

    const userObj = { username: 'Harry', userImg: 'shiba1.jpg', subTitle: 'Engineer' };

    const columnDefsAll = [
      { field: 'Job Title' },
      { field: 'Designation' },
      { field: 'Department' },
      { field: 'Start Date' },
      { field: 'Expire Date' },
      { field: 'Job Type' },
      { field: 'Status'},
      { field: 'Action', cellRenderer: 'GridActionComponent',
        cellRendererParams: {
          action: this.outputActions.bind(this),
          value: { actionBtn: [ 'edit', 'cancel' ] }
        }
      },
    ];

    const columnDefsInterviewing = [
      { field: 'Job Title' },
      { field: 'Designation' },
      { field: 'Department' },
      { field: 'Start Date' },
      { field: 'Expire Date' },
      { field: 'Job Type' },
      { field: 'Status'},
      { field: 'Aptitude Test'},
      { field: 'Action', cellRenderer: 'GridActionComponent',
        cellRendererParams: {
          action: this.outputActions.bind(this),
          value: { type: 'buttons', names: [ 'Schedule Interview'] }
        }
      },
    ];

    const rowDataInterviewing = [
      {
        'Job Title': 'HR Admin',
        Designation: 'Sr Recruitment Executive',
        Department: 'HR',
        'Start Date': moment('2020-06-24 22:57:36').format("YYYY-MM-DD"),
        'Expire Date': moment('2020-08-24 22:57:36').format("YYYY-MM-DD"),
        'Job Type': 'Permanent',
        'Aptitude Test': 'Selected',
        Status: 'Open',
      },
      {
        'Job Title': 'HR Admin',
        Designation: 'Jr HR',
        Department: 'HR',
        'Start Date': moment('2020-06-24 22:57:36').format("YYYY-MM-DD"),
        'Expire Date': moment('2020-08-24 22:57:36').format("YYYY-MM-DD"),
        'Job Type': 'Permanent',
        'Aptitude Test': 'Selected',
        Status: 'Closed',
      },
      {
        'Job Title': 'HR Admin',
        Designation: 'Sr Recruitment Executive',
        Department: 'HR',
        'Start Date': moment('2020-06-24 22:57:36').format("YYYY-MM-DD"),
        'Expire Date': moment('2020-08-24 22:57:36').format("YYYY-MM-DD"),
        'Job Type': 'Permanent',
        'Aptitude Test': 'Selected',
        Status: 'Cancelled',
      },
      {
        'Job Title': 'HR Admin',
        Designation: 'Jr HR',
        Department: 'HR',
        'Start Date': moment('2020-06-24 22:57:36').format("YYYY-MM-DD"),
        'Expire Date': moment('2020-08-24 22:57:36').format("YYYY-MM-DD"),
        'Job Type': 'Permanent',
        'Aptitude Test': 'Rejected',
        Status: 'Open',
      },
      {
        'Job Title': 'HR Admin',
        Designation: 'Sr Recruitment Executive',
        Department: 'HR',
        'Start Date': moment('2020-06-24 22:57:36').format("YYYY-MM-DD"),
        'Expire Date': moment('2020-08-24 22:57:36').format("YYYY-MM-DD"),
        'Job Type': 'Permanent',
        'Aptitude Test': 'Selected',
        Status: 'Open',
      },
      {
        'Job Title': 'HR Admin',
        Designation: 'Jr HR',
        Department: 'HR',
        'Start Date': moment('2020-06-24 22:57:36').format("YYYY-MM-DD"),
        'Expire Date': moment('2020-08-24 22:57:36').format("YYYY-MM-DD"),
        'Job Type': 'Permanent',
        'Aptitude Test': 'Selected',
        Status: 'Closed',
      },
    ];
    const columnDefsOffered = [
      { field: 'Job Title' },
      { field: 'Designation' },
      { field: 'Department' },
      { field: 'Job Type' },
      { field: 'Action', cellRenderer: 'GridActionComponent',
        cellRendererParams: {
          action: this.outputActions.bind(this),
          value: { type: 'buttons', names: [ 'Download Offer'] }
        }
      },
    ];

    const rowDataOffered = [
      {
        'Job Title': 'HR Admin',
        'Designation': 'Sr Recruitment Executive',
        'Department': 'HR',
        'Job Type': 'Permanent',
      },
      {
        'Job Title': 'HR Admin',
        'Designation': 'Jr. HR',
        'Department': 'HR',
        'Job Type': 'Contract',
      },
      {
        'Job Title': 'HR Admin',
        'Designation': 'Sr Recruitment Executive',
        'Department': 'HR',
        'Job Type': 'Part Time',
      },
      {
        'Job Title': 'HR Admin',
        'Designation': 'Sr Recruitment Executive',
        'Department': 'HR',
        'Job Type': 'Permanent',
      },
    ];

    const rowDataAll = [
      {
        'Job Title': 'HR Admin',
        Designation: 'Sr Recruitment Executive',
        Department: 'HR',
        'Start Date': moment('2020-06-24 22:57:36').format("YYYY-MM-DD"),
        'Expire Date': moment('2020-08-24 22:57:36').format("YYYY-MM-DD"),
        'Job Type': 'Permanent',
        Status: 'Open',
      },
      {
        'Job Title': 'HR Admin',
        Designation: 'Jr HR',
        Department: 'HR',
        'Start Date': moment('2020-06-24 22:57:36').format("YYYY-MM-DD"),
        'Expire Date': moment('2020-08-24 22:57:36').format("YYYY-MM-DD"),
        'Job Type': 'Permanent',
        Status: 'Closed',
      },
      {
        'Job Title': 'HR Admin',
        Designation: 'Sr Recruitment Executive',
        Department: 'HR',
        'Start Date': moment('2020-06-24 22:57:36').format("YYYY-MM-DD"),
        'Expire Date': moment('2020-08-24 22:57:36').format("YYYY-MM-DD"),
        'Job Type': 'Permanent',
        Status: 'Cancelled',
      },
      {
        'Job Title': 'HR Admin',
        Designation: 'Jr HR',
        Department: 'HR',
        'Start Date': moment('2020-06-24 22:57:36').format("YYYY-MM-DD"),
        'Expire Date': moment('2020-08-24 22:57:36').format("YYYY-MM-DD"),
        'Job Type': 'Permanent',
        Status: 'Open',
      },
      {
        'Job Title': 'HR Admin',
        Designation: 'Sr Recruitment Executive',
        Department: 'HR',
        'Start Date': moment('2020-06-24 22:57:36').format("YYYY-MM-DD"),
        'Expire Date': moment('2020-08-24 22:57:36').format("YYYY-MM-DD"),
        'Job Type': 'Permanent',
        Status: 'Open',
      },
      {
        'Job Title': 'HR Admin',
        Designation: 'Jr HR',
        Department: 'HR',
        'Start Date': moment('2020-06-24 22:57:36').format("YYYY-MM-DD"),
        'Expire Date': moment('2020-08-24 22:57:36').format("YYYY-MM-DD"),
        'Job Type': 'Permanent',
        Status: 'Closed',
      },
      {
        'Job Title': 'HR Admin',
        Designation: 'Sr Recruitment Executive',
        Department: 'HR',
        'Start Date': moment('2020-06-24 22:57:36').format("YYYY-MM-DD"),
        'Expire Date': moment('2020-08-24 22:57:36').format("YYYY-MM-DD"),
        'Job Type': 'Permanent',
        Status: 'Cancelled',
      },
      {
        'Job Title': 'HR Admin',
        Designation: 'Jr HR',
        Department: 'HR',
        'Start Date': moment('2020-06-24 22:57:36').format("YYYY-MM-DD"),
        'Expire Date': moment('2020-08-24 22:57:36').format("YYYY-MM-DD"),
        'Job Type': 'Permanent',
        Status: 'Open',
      },
      {
        'Job Title': 'HR Admin',
        Designation: 'Sr Recruitment Executive',
        Department: 'HR',
        'Start Date': moment('2020-06-24 22:57:36').format("YYYY-MM-DD"),
        'Expire Date': moment('2020-08-24 22:57:36').format("YYYY-MM-DD"),
        'Job Type': 'Permanent',
        Status: 'Open',
      },
      {
        'Job Title': 'HR Admin',
        Designation: 'Jr HR',
        Department: 'HR',
        'Start Date': moment('2020-06-24 22:57:36').format("YYYY-MM-DD"),
        'Expire Date': moment('2020-08-24 22:57:36').format("YYYY-MM-DD"),
        'Job Type': 'Permanent',
        Status: 'Closed',
      },
      {
        'Job Title': 'HR Admin',
        Designation: 'Sr Recruitment Executive',
        Department: 'HR',
        'Start Date': moment('2020-06-24 22:57:36').format("YYYY-MM-DD"),
        'Expire Date': moment('2020-08-24 22:57:36').format("YYYY-MM-DD"),
        'Job Type': 'Permanent',
        Status: 'Cancelled',
      },
      {
        'Job Title': 'HR Admin',
        Designation: 'Jr HR',
        Department: 'HR',
        'Start Date': moment('2020-06-24 22:57:36').format("YYYY-MM-DD"),
        'Expire Date': moment('2020-08-24 22:57:36').format("YYYY-MM-DD"),
        'Job Type': 'Permanent',
        Status: 'Open',
      },
    ];

    this.dashboardItemsAll = [
      {
        dynamicComponent: IhrmsGridComponent,
        gridsterItem: { cols: 1, rows: 1, y: 0, x: 0 },
        inputs: {
          title: '',
          cardRadius: 0,
          rowData: rowDataAll,
          columnDefs: columnDefsAll,
          columnFit: true,
          pagination: true,
          paginationAutoPageSize: true,
          viewAll: false,
        },
        flatItem: true,
        gridComponentFullHeight: true,
        outputs: {
          onClickHandler: { handler: this.dynamicCompClickHandler.bind(this), args: ['$event'] }
        }
      }
    ];

    this.dashboardItemsSaved = [
      {
        dynamicComponent: IhrmsGridComponent,
        gridsterItem: { cols: 1, rows: 1, y: 0, x: 0 },
        inputs: {
          title: '',
          cardRadius: 0,
          rowData: rowDataAll,
          columnDefs: columnDefsAll,
          columnFit: true,
          pagination: true,
          paginationAutoPageSize: true,
          viewAll: false,
        },
        flatItem: true,
        gridComponentFullHeight: true,
        outputs: {
          onClickHandler: { handler: this.dynamicCompClickHandler.bind(this), args: ['$event'] }
        }
      }
    ];

    this.dashboardItemsApplied = [
      {
        dynamicComponent: IhrmsGridComponent,
        gridsterItem: { cols: 1, rows: 1, y: 0, x: 0 },
        inputs: {
          title: '',
          cardRadius: 0,
          rowData: rowDataAll,
          columnDefs: columnDefsAll,
          columnFit: true,
          pagination: true,
          paginationAutoPageSize: true,
          viewAll: false,
        },
        flatItem: true,
        gridComponentFullHeight: true,
        outputs: {
          onClickHandler: { handler: this.dynamicCompClickHandler.bind(this), args: ['$event'] }
        }
      }
    ];

    this.dashboardItemsInterviewing = [
      {
        dynamicComponent: IhrmsGridComponent,
        gridsterItem: { cols: 1, rows: 1, y: 0, x: 0 },
        inputs: {
          title: '',
          cardRadius: 0,
          rowData: rowDataInterviewing,
          columnDefs: columnDefsInterviewing,
          columnFit: true,
          pagination: true,
          paginationAutoPageSize: true,
          viewAll: false,
        },
        flatItem: true,
        gridComponentFullHeight: true,
        outputs: {
          onClickHandler: { handler: this.dynamicCompClickHandler.bind(this), args: ['$event'] }
        }
      }
    ];

    this.dashboardItemsOffered = [
      {
        dynamicComponent: IhrmsGridComponent,
        gridsterItem: { cols: 1, rows: 1, y: 0, x: 0 },
        inputs: {
          title: '',
          cardRadius: 0,
          rowData: rowDataOffered,
          columnDefs: columnDefsOffered,
          columnFit: true,
          pagination: true,
          paginationAutoPageSize: true,
          viewAll: false,
        },
        flatItem: true,
        gridComponentFullHeight: true,
        outputs: {
          onClickHandler: { handler: this.dynamicCompClickHandler.bind(this), args: ['$event'] }
        }
      }
    ];

    this.dashboardItemsArchived = [
      {
        dynamicComponent: IhrmsGridComponent,
        gridsterItem: { cols: 1, rows: 1, y: 0, x: 0 },
        inputs: {
          title: '',
          cardRadius: 0,
          rowData: rowDataAll,
          columnDefs: columnDefsAll,
          columnFit: true,
          pagination: true,
          paginationAutoPageSize: true,
          viewAll: false,
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
    //
  }

  onTabChanged(event: MatTabChangeEvent) {
    this.selectedIndex = event.index;
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: { tab: this.selectedIndex }});
  }

}
