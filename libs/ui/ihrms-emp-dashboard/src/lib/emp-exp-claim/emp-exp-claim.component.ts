import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { BehaviorSubject, map, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import * as _ from 'lodash';
import { EmpHelloComponent, IhrmsDialogComponent, MultiChartsComponent } from '@ihrms/ihrms-components';
import { CONSTANTS } from '@ihrms/shared';
import { IhrmsGridComponent } from '@ihrms/ihrms-grid';
import { EmpExpClaimService, GQL_EXPENSE_CLAIM, GQL_EXPENSE_CLAIM_CREATE, GQL_EXPENSE_CLAIM_UPDATE, GQL_LOAN_ADVANCES, GQL_LOAN_ADVANCES_CREATE } from './_services/emp-exp-claim.service';
import { GQL_USER_BY_ID, IhrmsEmpDashboardService } from '../_services/ihrms-emp-dashboard.service';
import { Apollo } from 'apollo-angular';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'ihrms-emp-exp-claim',
  templateUrl: './emp-exp-claim.component.html',
  styleUrls: ['./emp-exp-claim.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmpExpClaimComponent implements OnInit, AfterViewInit {

  highcharts: typeof Highcharts = Highcharts;
  gridsterOptions: GridsterConfig;
  cardSize = 340;
  gridLoaded = false;
  dashboardItems: Array<GridsterItem> | any;
  gridResize: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  multiChartData: any | undefined;

  userManager: any;
  getExpenseClaims$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  sub!: Subscription;

  constructor(
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private _ecl: EmpExpClaimService,
    private router: Router,
    private _eds: IhrmsEmpDashboardService,
    private apollo: Apollo,
    private toastrService: ToastrService,
  ) {
    this.gridsterOptions = this._ecl.getGridsterOptions(this.cardSize, this); //'scroll'
  }

  ngOnInit(): void {

    this.multiChartData = [
      {
        title: 'Claims Overview',
        series: {
          config: {
            innerSize: 60,
            depth: 0,
            alpha: 0,
            tooltipAffix: 'K'
          },
          name: 'Claims',
          type: 'pie',
          data: []
        },
        flex: 24,
        height: 98
      },
      {
        title: 'Claims Requests',
        series: {
          config: {
            beta: 0,
            depth: 0,
            alpha: 0
          },
          name: 'Amount',
          type: 'column',
          subType: 'multi',
          data: []
        },
        xAxisCategories: [],
        flex: 24,
        height: 98
      },
      {
        title: 'Loans Overview',
        series: {
          config: {
            innerSize: 50,
            depth: 35,
            alpha: 45,
            tooltipAffix: '$'
          },
          name: 'Loans',
          type: 'pie',
          data: []
        },
        flex: 24,
        height: 98
      },
      {
        title: 'Loan Requests',
        series: {
          config: {
            beta: 25,
            depth: 70,
            alpha: 10
          },
          name: 'Loans',
          type: 'column',
          data: []
        },
        xAxisCategories: [],
        flex: 24,
        height: 98
      },
    ]

    this.setupDashboardItems();

    this.getExpenseClaims();

    this.getLoanAdvances();

  }

  ngAfterViewInit() {
    this.gridLoaded = true;
    this.cdRef.detectChanges();
  }

  setupDashboardItems() {

    this.dashboardItems = [
      {
        dynamicComponent: EmpHelloComponent,
        gridsterItem: { cols: 1, rows: 1, y: 0, x: 0 },
        inputs: {
          cardRadius: 20,
          palette: 'primary',
          component: CONSTANTS.EMP_EXPENSE_CLAIM
        },
        outputs: {
          onClickHandler: { handler: this.dynamicCompClickHandler.bind(this), args: ['$event'] }
        }
      },
      {
        dynamicComponent: IhrmsGridComponent,
        gridsterItem: { cols: 1, rows: 1, y: 0, x: 1 },
        inputs: {
          title: CONSTANTS.TITLES.MyClaims,
          cardRadius: 0,
          rowData: [],
          columnDefs: [
            { field: 'claimType' },
            { field: 'claimAmount' },
            { field: 'date', headerName: 'Request Date' },
            { field: 'status' },
            { field: 'Action', filter: false, cellRenderer: 'GridActionComponent',
              cellRendererParams: {
                action: this.outputActions.bind(this),
                value: { actionBtn: [ 'cancel' ] },
                type: CONSTANTS.REQUEST // Just do Disable Action After Recall
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
        dynamicComponent: MultiChartsComponent,
        gridsterItem: { cols: 2, rows: 1, y: 1, x: 0 },
        inputs: {
          cardRadius: 20,
          title: CONSTANTS.TITLES.Overview,
          compData: this.multiChartData,
          filters: false,
        },
        outputs: {
          onClickHandler: { handler: this.dynamicCompClickHandler.bind(this), args: ['$event'] }
        }
      },
    ];
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
      .subscribe(val => {
        this.getExpenseClaims$.next({ action: CONSTANTS.UPDATE, rowData: val });

        const claimTypes: any = [];
        _.forEach(_.groupBy(val, 'claimType'), (lv, idx) => {
          claimTypes.push([ idx,  _.sumBy(lv, 'claimAmount')]);
        });
        this.multiChartData[0].series = Object.assign({ }, this.multiChartData[0].series, { data: claimTypes });

        const claimReqs: any = [];
        _.forEach(_.groupBy(val, 'status'), (lv, idx) => claimReqs.push([idx, lv.length]));
        this.multiChartData[1].xAxisCategories = Object.keys(_.groupBy(val, 'status'));
        this.multiChartData[1].series = Object.assign({ }, this.multiChartData[1].series, { data: [{ name: 'Claims', data: claimReqs}] });

      });
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
      .subscribe(val => {
        const loanAdvances: any = [];

        let totalLoanAmount = 0; let totalOutstanding = 0;
        _.forEach(_.groupBy(val, 'loanType'), (lv, idx) => totalLoanAmount+= _.sumBy(lv, 'loanAmount'));
        _.forEach(_.groupBy(val, 'loanType'), (lv, idx) => totalOutstanding+= _.sumBy(lv, 'totalOutstanding'));

        loanAdvances.push(
          [ 'Total-Issues', totalLoanAmount ], [ 'Outstanding', !isNaN(totalOutstanding) ? totalOutstanding:  1 ]
        );
        this.multiChartData[2].series = Object.assign({ }, this.multiChartData[2].series, { data: loanAdvances });

        const loanReqs: any = [];
        _.forEach(_.groupBy(val, 'status'), (lv, idx) => loanReqs.push([idx, lv.length]));
        this.multiChartData[3].xAxisCategories = Object.keys(_.groupBy(val, 'status'));
        this.multiChartData[3].series = Object.assign({ }, this.multiChartData[3].series, { data: loanReqs });
      });
  }

  getUserManager(controlsObj: any, dialogRef: any) {
    const userID = JSON.parse(sessionStorage.getItem('auth-user') || '').userID;
    this.apollo.watchQuery<any, any>({ query: GQL_USER_BY_ID, variables: { query: { limit: 100,
       id: userID,
      //  approvers:  [{
      //   approverID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID,
      // }],
      }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getUsers[0]))
      .subscribe(val => {
        this.userManager = [{ _id: val.reportingManager?._id, name: val.reportingManager?.username }];
        this._eds.getSelectOptions(controlsObj, this.userManager, 'toManagerID', '_id');
        dialogRef.componentInstance?.form?.get('toManagerID')?.patchValue(this.userManager[0]._id);
        this.cdRef.detectChanges();
      });
  }

  dynamicCompClickHandler(event: any) {
    if(event.component && event.comp_name === CONSTANTS.IHRMS_GRID_COMPONENT) {
      if(event.action === CONSTANTS.VIEW_ALL) {
        if(event.component?.title === CONSTANTS.TITLES.MyClaims) {
          const navExtras: NavigationExtras = { queryParams: { tab: 0 } };
          this.router.navigate([`${CONSTANTS.EMP_DASHBOARD}/${CONSTANTS.EMP_EXPENSE_CLAIM_DETAILS}`], navExtras)
        }
      }
    }
    if(event.action === CONSTANTS.REQUEST_LOAN) {
      this.openExpenseClaimRequestDialog(CONSTANTS.REQUEST_LOAN);
    }
    if(event.action === CONSTANTS.REQUEST_CLAIM) {
      this.openExpenseClaimRequestDialog(CONSTANTS.REQUEST_CLAIM);
    }
  }

  outputActions(event: any) {
    console.log(event);
    
    if(event.action === CONSTANTS.CANCEL) {
      console.log('Recall!');
      this.openExpenseClaimRequestDialog(CONSTANTS.CANCEL, event);
    }
    
  }

  openExpenseClaimRequestDialog(action: string, event?: any) {

    let fetchControls = null;
    let title = '';
    if(action === CONSTANTS.REQUEST_LOAN) {
      title = 'Request Loan';
      fetchControls = this._ecl.getRequestLoanDynamicControls();
    }
    if(action === CONSTANTS.REQUEST_CLAIM) {
      title = 'Request Claim';
      fetchControls = this._ecl.getRequestClaimDynamicControls();
    }
    if(action === CONSTANTS.CANCEL) {
      title = 'Recall Claim';
      fetchControls = this._ecl.getRequestClaimDynamicControls();
    }

    const dialogRef = this.dialog.open(IhrmsDialogComponent, {
      data: {
        title: title,
        controls: fetchControls,
        formConfig: {
          patchValue: action === CONSTANTS.CANCEL ? event.params.data: null,
          readOnly: action === CONSTANTS.CANCEL,
          closeFromOutside: true,
          okButtonText: action === CONSTANTS.CANCEL ? 'Recall': 'Request',
        }
      },
      panelClass: 'ihrms-dialog-overlay-panel',
    });

    dialogRef?.componentInstance?.dialogEventEmitter.subscribe((result: any) => {

      if(result && dialogRef.componentInstance) {
        if(result.action === CONSTANTS.FORM_OBJECT_EVENT) {
            this.getUserManager(dialogRef.componentInstance?.controlsObj, dialogRef);
        }
        if(result.action === CONSTANTS.FORM_VALUE_CHANGE) {
          //
        }
        if(result.action === CONSTANTS.FORM_SUBMIT_EVENT) {
          
          if(action === CONSTANTS.REQUEST_CLAIM) {
            const payload =  {
              userId: JSON.parse(sessionStorage.getItem('auth-user') || '').userID,
              ...result.value,
              claimAmount: Number(result.value.claimAmount)
            }
            this.apollo.mutate({ mutation: GQL_EXPENSE_CLAIM_CREATE, variables: payload, })
              .pipe(map((res: any) => res?.data.createExpenseClaims))
              .subscribe((val: any) => {
                if(val) {
                  this.toastrService.success( `Success`, `Expense Claim Created Successfully!`, { } );
                  this.getExpenseClaims();
                  this.dialog.closeAll();
                }
              });
          }

          if(action === CONSTANTS.REQUEST_LOAN) {
            
            const payload =  {
              userId: JSON.parse(sessionStorage.getItem('auth-user') || '').userID,
              ...result.value,
              loanAmount: Number(result.value.loanAmount),
              EMI: Number(result.value.EMI),
              period: Number(result.value.period)
            }
            this.apollo.mutate({ mutation: GQL_LOAN_ADVANCES_CREATE, variables: payload, })
              .pipe(map((res: any) => res?.data.createLoanAdvances))
              .subscribe((val: any) => {
                if(val) {
                  this.toastrService.success( `Success`, `Loan/Advance Created Successfully!`, { } );
                  // this.getLoanAdvances();
                  this.dialog.closeAll();
                }
              });

          }

          if(action === CONSTANTS.CANCEL) {
            const payload =  {
              userId: JSON.parse(sessionStorage.getItem('auth-user') || '').userID,
              ...result.value,
              status: 'Recalled',
              claimAmount: Number(result.value.claimAmount)
            }
            this.apollo.mutate({ mutation: GQL_EXPENSE_CLAIM_UPDATE, variables: payload, })
              .pipe(map((res: any) => res?.data.editExpenseClaims))
              .subscribe((val: any) => {
                if(val) {
                  this.toastrService.success( `Success`, `Expense Claim Recalled Successfully!`, { } );
                  this.getExpenseClaims();
                  this.dialog.closeAll();
                }
              });
          }

        }
      }

    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if(result) {
        console.log(`Dialog result: ${result}`);
      }
    });
  }

}
