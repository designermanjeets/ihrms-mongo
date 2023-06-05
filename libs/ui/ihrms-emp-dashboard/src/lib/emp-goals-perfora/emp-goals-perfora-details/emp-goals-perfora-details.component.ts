import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { IhrmsGridComponent } from '@ihrms/ihrms-grid';
import { CONSTANTS } from '@ihrms/shared';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, map, Subscription } from 'rxjs';
import { EmpGoalsPerformaService } from '../_services/emp-goals-performa.service';
import { GridApi } from 'ag-grid-community';
import { ColumnApi } from '@ag-grid-community/core';
import { SharedService } from '@ihrms/shared';

@Component({
  selector: 'ihrms-emp-goals-perfora-details',
  templateUrl: './emp-goals-perfora-details.component.html',
  styleUrls: ['./emp-goals-perfora-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmpGoalsPerforaDetailsComponent implements OnInit {

  gridsterOptions: GridsterConfig;
  gridLoaded = false;
  dashboardItemsClaimsRequests: Array<GridsterItem> | any;
  dashboardItemsLoanRequests: Array<GridsterItem> | any;
  gridResize: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  selectedIndex! : number;
  @ViewChild('tabGroup') tabGroup!: ElementRef;

  cardSize = this.tabGroup?.nativeElement?.offsetHeight;
  filterConfig: any;
  gridEmpGoalPerApi!: GridApi;
  columnEmpGoalPerApi!: ColumnApi;
  hide_show_export_button: any;

  getExpenseClaims$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  getloanAdvances$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  sub!: Subscription;

  constructor(
    private _egps: EmpGoalsPerformaService,
    private router: Router,
    private route: ActivatedRoute,
    private apollo: Apollo,
    private sharedService: SharedService
  ) {
    this.gridsterOptions = this._egps.getGridsterOptions(this.cardSize, this );
  }

  ngOnInit(): void {

    this.setupDashboardItems();

    this.getLoanAdvances();

    this.route.queryParams.subscribe(params => {
      this.selectedIndex = +params['tab'];
    });

    this.filterConfig = {
      filterForm: false,
      show_Export_Button: this.hide_show_export_button,
    };

  }

  getLoanAdvances() {
    // this.sub = this.apollo.watchQuery<any, any>({ 
    //   query: GQL_LOAN_ADVANCES, 
    //   variables: { 
    //     query: { 
    //       limit: 10,
    //       userID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID,
    //       // dates: { gte: moment().startOf('day').format(), },
    //     }
    //   }
    // }).valueChanges
    //   .pipe(map((data: any) => data?.data?.getLoanAdvances))
    //   .subscribe(val => this.getloanAdvances$.next({ action: CONSTANTS.UPDATE, rowData: val }));
  }

  outputActions(event: any) {
    console.log(event);
  }

  setupDashboardItems() {
    this.hide_show_export_button = this.sharedService.checkuserPermission('Employee', 'Goals and Performance', 'export');
    this.dashboardItemsClaimsRequests = [
      {
        dynamicComponent: IhrmsGridComponent,
        gridsterItem: { cols: 1, rows: 1, y: 0, x: 0 },
        inputs: {
          title: '',
          cardRadius: 0,
          rowData: [],
          columnDefs: [
            { field: 'Action', cellRenderer: 'GridActionComponent',
              cellRendererParams: {
                action: this.outputActions.bind(this),
                value: { actionBtn: [ 'check_circle', 'cancel' ] }
              }
            },
            { field: 'status' },
            { field: 'user.username', headerName: 'Employee' },
            { field: 'claimType' },
            { field: 'claimAmount' },
            { field: 'date', headerName: 'Request Date' },
            { field: 'toManager.username'},
          ],
          columnFit: true,
          pagination: true,
          paginationAutoPageSize: true,
          viewAll: false,
          illustration: 'Illustration_Loan.png',
          updateGridFromOutside: this.getExpenseClaims$
        },
        flatItem: true,
        gridComponentFullHeight: true,
        outputs: {
          onClickHandler: { handler: this.dynamicCompClickHandler.bind(this), args: ['$event'] }
        }
      }
    ];

    this.dashboardItemsLoanRequests = [
      {
        dynamicComponent: IhrmsGridComponent,
        gridsterItem: { cols: 1, rows: 1, y: 0, x: 0 },
        inputs: {
          title: '',
          cardRadius: 0,
          rowData: [],
          columnDefs: [
            { field: 'Action' , cellRenderer: 'GridActionComponent',
              cellRendererParams: {
                action: this.outputActions.bind(this),
                value: { actionBtn: [ 'check_circle', 'cancel' ] }
              }
            },
            { field: 'status' },
            { field: 'user.username', headerName: 'Employee' },
            { field: 'loanAmount'},
            { field: 'loanType'},
            { field: 'EMI'},
            { field: 'period'},
            { field: 'outstanding'},
            { field: 'toManager.username'},
            { field: 'date', headerName: 'Request Date'},
          ],
          columnFit: true,
          pagination: true,
          paginationAutoPageSize: true,
          viewAll: false,
          illustration: 'Illustration_Loan.png',
          updateGridFromOutside: this.getloanAdvances$
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
    if (event.component && event.comp_name === CONSTANTS.IHRMS_GRID_COMPONENT) {
      if (event.action === CONSTANTS.ON_FIRST_DATA_RENDERED) {
        this.gridEmpGoalPerApi = event.event.api;
        this.columnEmpGoalPerApi = event.event.columnApi;
      }
    }
  }

  onTabChanged(event: MatTabChangeEvent) {
    this.selectedIndex = event.index;
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: { tab: this.selectedIndex }});
  }

  onFiltersClickHandler(event: any) {
    if(event.action === CONSTANTS.EXPORT_TO_EXCEL) {
      this.gridEmpGoalPerApi.exportDataAsExcel({
        fileName: 'All_Goals-Performance_.xlsx'
      });
    }
    if(event.action === CONSTANTS.PRINT_ONLY) {
      const eGridDiv = document.querySelector<HTMLElement>('#ihrmsGrid') as any;
      eGridDiv.style.width = '';
      eGridDiv.style.height = '';
      this.gridEmpGoalPerApi.setDomLayout('print');
      setTimeout(function () {
        print();
      }, 2000);
    }
   }

}


