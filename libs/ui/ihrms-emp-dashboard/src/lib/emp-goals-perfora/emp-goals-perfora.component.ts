import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { BehaviorSubject, map, Subscription } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import * as _ from 'lodash';
import { IhrmsDialogComponent, MultiChartsComponent } from '@ihrms/ihrms-components';
import { IhrmsGridComponent } from '@ihrms/ihrms-grid';
import { CONSTANTS } from '@ihrms/shared';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Apollo } from 'apollo-angular';
import { EmpGoalsPerformaService } from './_services/emp-goals-performa.service';

@Component({
  selector: 'ihrms-emp-goals-perfora',
  templateUrl: './emp-goals-perfora.component.html',
  styleUrls: ['./emp-goals-perfora.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmpGoalsPerforaComponent implements OnInit, AfterViewInit {

  highcharts: typeof Highcharts = Highcharts;
  gridsterOptions: GridsterConfig;
  cardSize = 500;
  gridLoaded = false;
  dashboardItems: Array<GridsterItem> | any;
  gridResize: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  multiChartData: any | undefined;

  getExpenseClaims$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  getloanAdvances$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  sub!: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private _egps: EmpGoalsPerformaService,
    private router: Router,
    private apollo: Apollo,
    public dialog: MatDialog,
    private toastrService: ToastrService
  ) {
    this.gridsterOptions = this._egps.getGridsterOptions(this.cardSize, this);
  }

  ngOnInit(): void {

    this.multiChartData = [
      {
        title: CONSTANTS.TITLES.Goals,
        list_items: [
          { item: 'My Individual Goals', url: '' },
          { item: 'My Developments Goals', url: '' }
        ],
        flex: 100,
        height: 49
      },
      {
        title: CONSTANTS.TITLES.PerformanceDiscussions,
        list_items: [
          { item: 'My Performance Discussions', url: '' },
          { item: 'My Asked Feedbacks', url: '' }
        ],
        flex: 100,
        height: 48
      },
    ]

    this.setupDashboardItems();

  }

  ngAfterViewInit() {
    this.gridLoaded = true;
    this.cdRef.detectChanges();
  }

  outputActions(event: any) {
    console.log(event);
  }
  
  openDialog(action: string, eventz?: any, type?: string) {

    const event = _.cloneDeep(eventz);
    
    // fetchControls = this._ecs.getRequestLoanDynamicControls();

    const dialogRef = this.dialog.open(IhrmsDialogComponent, {
      data: {
        title: '',
        controls: [],
        formConfig: {
          patchValue: event.params.data,
          readOnly: true,
          closeFromOutside: true,
          okButtonText: action === CONSTANTS.CANCEL ? 'Reject': 'Approve',
        }
      },
      panelClass: 'ihrms-dialog-overlay-panel',
    });

    dialogRef?.componentInstance?.dialogEventEmitter.subscribe((result: any) => {

      if(result && dialogRef.componentInstance) {
        if(result.action === CONSTANTS.FORM_OBJECT_EVENT) {
        }
        if(result.action === CONSTANTS.FORM_VALUE_CHANGE) {
          //
        }

        if(result.action === CONSTANTS.FORM_SUBMIT_EVENT) {
          //
        }
      }

    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if(result) {
        console.log(`Dialog result: ${result}`);
      }
    });
  }

  setupDashboardItems() {
    
    this.dashboardItems = [
      {
        dynamicComponent: IhrmsGridComponent,
        gridsterItem: { cols: 2, rows: 1, y: 0, x: 0 },
        inputs: {
          title: CONSTANTS.TITLES.MyGoals,
          cardRadius: 0,
          rowData: [],
          columnDefs: [
            { field: 'status' },
            { field: 'goal', headerName: 'Goal' },
            { field: 'duedate', headerName: 'Due Date' },
            { field: 'Action', filter: false, cellRenderer: 'GridActionComponent',
              cellRendererParams: {
                action: this.outputActions.bind(this),
                value: { actionBtn: [ 'check_circle', 'cancel' ] },
                type: CONSTANTS.REQUEST
              }
            },
          ],
          flatItem: false,
          updateGridFromOutside: this.getExpenseClaims$
        },
        gridComponentFullHeight: true,
        outputs: {
          onClickHandler: { handler: this.dynamicCompClickHandler.bind(this), args: ['$event'] }
        }
      },
      {
        dynamicComponent: IhrmsGridComponent,
        gridsterItem: { cols: 2, rows: 1, y: 1, x: 0 },
        inputs: {
          title: CONSTANTS.TITLES.MyFeedbacks,
          cardRadius: 0,
          rowData: [],
          columnDefs: [
            { field: 'date', headerName: 'Date'},
            { field: 'from'},
            { field: 'feedback'},
            { field: 'Action', filter: false, cellRenderer: 'GridActionComponent',
              cellRendererParams: {
                action: this.outputActions.bind(this),
                value: { actionBtn: [ 'check_circle', 'cancel' ] },
                type: CONSTANTS.REQUEST
              }
            },
          ],
          flatItem: false,
          updateGridFromOutside: this.getloanAdvances$
        },
        gridComponentFullHeight: true,
        outputs: {
          onClickHandler: { handler: this.dynamicCompClickHandler.bind(this), args: ['$event'] }
        }
      },
      {
        dynamicComponent: MultiChartsComponent,
        gridsterItem: { cols: 1, rows: 2, y: 0, x: 2 },
        inputs: {
          cardRadius: 20,
          title: CONSTANTS.TITLES.GoalsAndDevelopments,
          compData: this.multiChartData,
          filters: false,
        },
        outputs: {
          onClickHandler: { handler: this.dynamicCompClickHandler.bind(this), args: ['$event'] }
        }
      },
    ];
  }

  dynamicCompClickHandler(event: any) {
    console.log(event);
    if(event.component && event.comp_name === CONSTANTS.IHRMS_GRID_COMPONENT) {
      if(event.action === CONSTANTS.VIEW_ALL) {
        if(event.component?.title === CONSTANTS.TITLES.MyGoals) {
          this.router.navigate([`${CONSTANTS.EMP_DASHBOARD}/${CONSTANTS.EMP_GOALS_PERFORMANCE_DETAILS}`])
        }
        if(event.component?.title === CONSTANTS.TITLES.MyFeedbacks) {
          const navExtras: NavigationExtras = { queryParams: { tab: 1 } };
          this.router.navigate([`${CONSTANTS.EMP_DASHBOARD}/${CONSTANTS.EMP_GOALS_PERFORMANCE_DETAILS}`], navExtras)
        }
      }
    }
  }

}

