import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { BehaviorSubject } from 'rxjs';
import { AdminFinancesService } from '../../admin-finances/_services/admin-finances.service';
import { NavigationExtras, Router } from '@angular/router';
import { MultiChartsComponent } from '@ihrms/ihrms-components';
import { CONSTANTS } from '@ihrms/shared';
import * as moment from 'moment';
import { IhrmsGridComponent } from '@ihrms/ihrms-grid';

@Component({
  selector: 'ihrms-admin-candidates-dashboard',
  templateUrl: './admin-candidates-dashboard.component.html',
  styleUrls: ['./admin-candidates-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminCandidatesDashboardComponent implements OnInit {

  gridsterOptions: GridsterConfig;
  cardSize = 300;
  gridLoaded = false;
  dashboardItems: Array<GridsterItem> | any;
  gridResize: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  multiChartData: any | undefined;

  constructor(
    private _afs: AdminFinancesService,
    private router: Router
  ) {
    this.gridsterOptions = this._afs.getGridsterOptions(this.cardSize, this);
  }

  ngOnInit(): void {

    this.multiChartData = [
      {
        title: CONSTANTS.TITLES.CandidatesOverview,
        series: {
          config: {
            innerSize: 80,
            depth: 0,
            alpha: 0,
            tooltipAffix: ' Candidates'
          },
          name: 'Candidates',
          type: 'pie',
          data: [
            ['Applied', 35],
            ['Offered', 10],
            ['Visited', 60],
            ['Saved', 10],
          ]
        },
        flex: 32,
        height: 95
      },
      {
        title: CONSTANTS.TITLES.JobsOverview,
        series: {
          config: {
            alpha: 0,
            beta: 0,
            depth: 0
          },
          name: 'Jobs',
          type: 'column',
          subType: 'multi',
          data: [
            { name: 'Web Designer', data: [13, 20, 10, 5]},
            { name: 'UI Developers', data: [25, 40, 40, 29]},
            { name: '.Net Developers', data: [22, 14, 24, 29]},
            { name: 'HR Managers', data: [2, 4, 4, 9]}
          ]
        },
        xAxisCategories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        flex: 32,
        height: 95
      },
      {
        title: CONSTANTS.TITLES.LatestJobs,
        columnFit: true,
        gridData: {
          columnDefs: [
            { field: 'Job Title', sortable: true, filter: true },
            { field: 'Date Created', sortable: true, filter: true, width: 150, type: 'rightAligned' },
          ],
          rowData: [
            { 'Job Title': 'Web Designer', 'Date Created': moment('2020-06-24 22:57:36').format("YYYY-MM-DD") },
            { 'Job Title': 'UI Developer', 'Date Created': moment('2020-06-24 22:57:36').format("YYYY-MM-DD") },
            { 'Job Title': '.Net Developer', 'Date Created': moment('2020-06-24 22:57:36').format("YYYY-MM-DD") },
            { 'Job Title': 'HR Manager', 'Date Created': moment('2020-06-24 22:57:36').format("YYYY-MM-DD") },
          ]
        },
        flex: 32,
        height: 95
      },
    ]

    this.setupDashboardItems();

  }

  setupDashboardItems() {

    const userObj = { username: 'Harry', userImg: 'shiba2.jpg', subTitle: 'Engineer' };

    const columnDefsOfferedJobs = [
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

    const rowDataOfferedJobs = [
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

    const columnDefsAppliedJobs = [
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

    const rowDataAppliedJobs = [
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

    this.dashboardItems = [
      {
        dynamicComponent: MultiChartsComponent,
        gridsterItem: { cols: 4, rows: 4, y: 0, x: 0 },
        inputs: {
          cardRadius: 20,
          title: CONSTANTS.TITLES.Candidates +' - '+ CONSTANTS.TITLES.Overview,
          compData: this.multiChartData,
          filters: false,
        },
        outputs: {
          onClickHandler: { handler: this.dynamicCompClickHandler.bind(this), args: ['$event'] }
        }
      },
      {
        dynamicComponent: IhrmsGridComponent,
        gridsterItem: { cols: 2, rows: 3, y: 4, x: 0 },
        inputs: {
          title: CONSTANTS.TITLES.OfferedJobs,
          cardRadius: 0,
          rowData: rowDataOfferedJobs,
          columnDefs: columnDefsOfferedJobs,
          flatItem: false,
          columnFit: true
        },
        outputs: {
          onClickHandler: { handler: this.dynamicCompClickHandler.bind(this), args: ['$event'] }
        }
      },
      {
        dynamicComponent: IhrmsGridComponent,
        gridsterItem: { cols: 2, rows: 3, y: 4, x: 1 },
        inputs: {
          title: CONSTANTS.TITLES.AppliedJobs,
          cardRadius: 0,
          rowData: rowDataAppliedJobs,
          columnDefs: columnDefsAppliedJobs,
          flatItem: false,
        },
        outputs: {
          onClickHandler: { handler: this.dynamicCompClickHandler.bind(this), args: ['$event'] }
        }
      },
    ];
  }

  dynamicCompClickHandler(event: any) {
    if(event.component && event.comp_name === CONSTANTS.IHRMS_GRID_COMPONENT) {
      if(event.action === CONSTANTS.VIEW_ALL) {
        if(event.component?.title === CONSTANTS.TITLES.LatestJobs) {
          const navExtras: NavigationExtras = { queryParams: { tab: 0 } };
          this.router.navigate([`${CONSTANTS.ADMIN_DASHBOARD}/${CONSTANTS.ADMIN_JOBS}/${CONSTANTS.ADMIN_CANDIDATES_DASHBOARD_DETAILS}`], navExtras)
        }
        if(event.component?.title === CONSTANTS.TITLES.OfferedJobs) {
          const navExtras: NavigationExtras = { queryParams: { tab: 4 } };
          this.router.navigate([`${CONSTANTS.ADMIN_DASHBOARD}/${CONSTANTS.ADMIN_JOBS}/${CONSTANTS.ADMIN_CANDIDATES_DASHBOARD_DETAILS}`], navExtras)
        }
        if(event.component?.title === CONSTANTS.TITLES.AppliedJobs) {
          const navExtras: NavigationExtras = { queryParams: { tab: 2 } };
          this.router.navigate([`${CONSTANTS.ADMIN_DASHBOARD}/${CONSTANTS.ADMIN_JOBS}/${CONSTANTS.ADMIN_CANDIDATES_DASHBOARD_DETAILS}`], navExtras)
        }
      }
    }
    if(event.component && event.comp_name === CONSTANTS.IHRMS_CHART_COMPONENT) {
      if(event.event === CONSTANTS.EVENTS.pointClickEvent) {
       if( event.component?.charTitle === CONSTANTS.TITLES.CandidatesOverview) {
         this.router.navigate([`${CONSTANTS.ADMIN_DASHBOARD}/${CONSTANTS.ADMIN_JOBS}/${CONSTANTS.ADMIN_CANDIDATES_DASHBOARD_DETAILS}`])
        }
       if( event.component?.charTitle === CONSTANTS.TITLES.JobsOverview) {
         this.router.navigate([`${CONSTANTS.ADMIN_DASHBOARD}/${CONSTANTS.ADMIN_JOBS}/${CONSTANTS.ADMIN_JOBS_DASHBOARD}`])
        }
      }
    }
  }

  outputActions(event: any) {
    console.log(event);
  }

}
