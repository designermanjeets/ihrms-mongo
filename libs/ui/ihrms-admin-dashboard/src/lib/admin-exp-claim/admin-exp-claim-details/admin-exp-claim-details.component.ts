import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { BehaviorSubject, map, Subscription } from 'rxjs';
import * as moment from 'moment';
import { IhrmsGridComponent } from '@ihrms/ihrms-grid';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { AdminExpClaimService, GQL_EXPENSE_CLAIM, GQL_LOAN_ADVANCES } from '../_services/admin-exp-claim.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { CONSTANTS } from '@ihrms/shared';
import { GridApi } from 'ag-grid-community';
import { ColumnApi } from '@ag-grid-community/core';
import { SharedService } from '@ihrms/shared';

@Component({
  selector: 'ihrms-admin-exp-claim-details',
  templateUrl: './admin-exp-claim-details.component.html',
  styleUrls: ['./admin-exp-claim-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminExpClaimDetailsComponent implements OnInit {

  gridsterOptions: GridsterConfig;
  gridLoaded = false;
  dashboardItemsClaimsRequests: Array<GridsterItem> | any;
  dashboardItemsLoanRequests: Array<GridsterItem> | any;
  gridResize: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  selectedIndex! : number;
  @ViewChild('tabGroup') tabGroup!: ElementRef;
  adminexpenseclaimGridApi!: GridApi;
  adminexpenseclaimColumnApi!: ColumnApi;
  hide_show_export_button: any;

  cardSize = this.tabGroup?.nativeElement?.offsetHeight;
  filterConfig: any;

  getExpenseClaims$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  getloanAdvances$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  sub!: Subscription;

  constructor(
    private _ecs: AdminExpClaimService,
    private router: Router,
    private route: ActivatedRoute,
    private apollo: Apollo,
    private sharedService: SharedService
  ) {
    this.gridsterOptions = this._ecs.getGridsterOptions(this.cardSize, this );
  }

  ngOnInit(): void {

    this.setupDashboardItems();

    this.getExpenseClaims();

    this.getLoanAdvances();

    this.route.queryParams.subscribe(params => {
      this.selectedIndex = +params['tab'];
    });

    this.filterConfig = {
      filterForm: false,
      show_Export_Button: this.hide_show_export_button,
    };

  }
  
  getExpenseClaims() {
    this.sub = this.apollo.watchQuery<any, any>({ 
      query: GQL_EXPENSE_CLAIM, 
      variables: { 
        query: { 
          limit: 10,
          userID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID,
          // dates: { gte: moment().startOf('day').format(), },
        }
      }
    }).valueChanges
      .pipe(map((data: any) => data?.data?.getExpenseClaims))
      .subscribe(val => this.getExpenseClaims$.next({ action: CONSTANTS.UPDATE, rowData: val }));
  }

  getLoanAdvances() {
    this.sub = this.apollo.watchQuery<any, any>({ 
      query: GQL_LOAN_ADVANCES, 
      variables: { 
        query: { 
          limit: 10,
          userID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID,
          // dates: { gte: moment().startOf('day').format(), },
        }
      }
    }).valueChanges
      .pipe(map((data: any) => data?.data?.getLoanAdvances))
      .subscribe(val => this.getloanAdvances$.next({ action: CONSTANTS.UPDATE, rowData: val }));
  }

  outputActions(event: any) {
    console.log(event);
  }

  setupDashboardItems() {
    this.hide_show_export_button = this.sharedService.checkuserPermission('Admin', 'Expense', 'export');
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
    if (event.component && event.comp_name === CONSTANTS.IHRMS_GRID_COMPONENT) {
      if (event.action === CONSTANTS.ON_FIRST_DATA_RENDERED) {
        this.adminexpenseclaimGridApi = event.event.api;
        this.adminexpenseclaimColumnApi = event.event.columnApi;
      }
    }
  }

  onFilterSubmit(event: any) {
    console.log(event);
    if(event.action === CONSTANTS.EXPORT_TO_EXCEL) {
      this.adminexpenseclaimGridApi.exportDataAsExcel({
        fileName: 'All_Candidates-Details_.xlsx'
      });
    }
    if(event.action === CONSTANTS.PRINT_ONLY) {
      const eGridDiv = document.querySelector<HTMLElement>('#ihrmsGrid') as any;
      eGridDiv.style.width = '';
      eGridDiv.style.height = '';
      this.adminexpenseclaimGridApi.setDomLayout('print');
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
