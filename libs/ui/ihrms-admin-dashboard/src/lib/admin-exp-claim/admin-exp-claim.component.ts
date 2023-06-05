/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { BehaviorSubject, map, Subscription } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import * as _ from 'lodash';
import { IhrmsDialogComponent, MultiChartsComponent } from '@ihrms/ihrms-components';
import { IhrmsGridComponent } from '@ihrms/ihrms-grid';
import { CONSTANTS } from '@ihrms/shared';
import { AdminExpClaimService, GQL_EXPENSE_CLAIM, GQL_EXPENSE_CLAIM_UPDATE, GQL_LOAN_ADVANCES, GQL_LOAN_ADVANCES_UPDATE } from './_services/admin-exp-claim.service';
import { Apollo } from 'apollo-angular';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'ihrms-admin-exp-claim',
  templateUrl: './admin-exp-claim.component.html',
  styleUrls: ['./admin-exp-claim.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminExpClaimComponent implements OnInit, AfterViewInit {

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
    private _ecs: AdminExpClaimService,
    private router: Router,
    private apollo: Apollo,
    public dialog: MatDialog,
    private toastrService: ToastrService
  ) {
    this.gridsterOptions = this._ecs.getGridsterOptions(this.cardSize, this);
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
        flex: 49,
        height: 49
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
        flex: 49,
        height: 49
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
        flex: 49,
        height: 48
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
        flex: 49,
        height: 48
      },
    ]

    this.setupDashboardItems();

    this.getExpenseClaims();

    this.getLoanAdvances();

    // this.gridResize.subscribe(value => {
    //   console.log(value);
    // })

  }

  ngAfterViewInit() {
    this.gridLoaded = true;
    this.cdRef.detectChanges();
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
        this.getloanAdvances$.next({ action: CONSTANTS.UPDATE, rowData: val });
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

  outputActionsClaimsReq(event: any) {
    console.log(event);
    this.openExpenseClaimRequestDialog(event.action, event, 'Claim');
  }

  outputActionsLoanReq(event: any) {
    console.log(event);
    this.openExpenseClaimRequestDialog(event.action, event, 'LoanAdvance');
  }
  
  openExpenseClaimRequestDialog(action: string, eventz?: any, type?: string) {

    const event = _.cloneDeep(eventz);

    let fetchControls = null;
    let title = '';
    if(type === 'Claim') {
      title = action === CONSTANTS.CANCEL ? 'Reject Claim' : 'Approve Claim';
      fetchControls = this._ecs.getRequestClaimDynamicControls();
    }
    if(type === 'LoanAdvance') {
      title = action === CONSTANTS.CANCEL ? 'Reject Loan/Advance' : 'Approve Loan/Advance';
      fetchControls = this._ecs.getRequestLoanDynamicControls();
    }

    event.params.data['userCtrl'] = event.params.data?.user?.username;
    event.params.data['toManagerCtrl'] = event.params.data?.toManager?.username;
    const dialogRef = this.dialog.open(IhrmsDialogComponent, {
      data: {
        title: title,
        controls: fetchControls,
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
          //
        }
        if(result.action === CONSTANTS.FORM_VALUE_CHANGE) {
          //
        }

        if(result.action === CONSTANTS.FORM_SUBMIT_EVENT) {

          if(type === 'Claim') {
            const payload =  {
              userId: event.params.data.user._id,
              ...result.value,
              status: action === CONSTANTS.CANCEL ? 'Rejected': 'Approved',
              claimAmount: Number(result.value.claimAmount)
            }
            this.apollo.mutate({ mutation: GQL_EXPENSE_CLAIM_UPDATE, variables: payload, })
              .pipe(map((res: any) => res?.data.editExpenseClaims))
              .subscribe((val: any) => {
                if(val) {
                  this.toastrService.success( `Success`, `Expense Claim Updated Successfully!`, { } );
                  this.getExpenseClaims();
                  this.dialog.closeAll();
                }
              });
          }

          if(type === 'LoanAdvance') {
            const payload =  {
              userId: event.params.data.user._id,
              ...result.value,
              status: action === CONSTANTS.CANCEL ? 'Rejected': 'Approved',
              loanAmount: Number(result.value.loanAmount),
              EMI: Number(result.value.EMI),
              period: Number(result.value.period)
            }
            this.apollo.mutate({ mutation: GQL_LOAN_ADVANCES_UPDATE, variables: payload, })
              .pipe(map((res: any) => res?.data.editLoanAdvances))
              .subscribe((val: any) => {
                if(val) {
                  this.toastrService.success( `Success`, `Loan/Advance Updated Successfully!`, { } );
                  this.getLoanAdvances();
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

  setupDashboardItems() {
    
    this.dashboardItems = [
      {
        dynamicComponent: MultiChartsComponent,
        gridsterItem: { cols: 2, rows: 2, y: 0, x: 0 },
        inputs: {
          cardRadius: 20,
          title: "Overview",
          compData: this.multiChartData,
          filters: false,
        },
        outputs: {
          onClickHandler: { handler: this.dynamicCompClickHandler.bind(this), args: ['$event'] }
        }
      },
      {
        dynamicComponent: IhrmsGridComponent,
        gridsterItem: { cols: 1, rows: 1, y: 0, x: 2 },
        inputs: {
          title: CONSTANTS.TITLES.RequestsApprovalsClaims,
          cardRadius: 0,
          rowData: [],
          columnDefs: [
            { field: 'Action', cellRenderer: 'GridActionComponent',
              cellRendererParams: {
                action: this.outputActionsClaimsReq.bind(this),
                value: { actionBtn: [ 'check_circle', 'cancel' ] },
                type: CONSTANTS.REQUEST
              }
            },
            { field: 'status' },
            { field: 'user.username', headerName: 'Employee' },
            { field: 'claimType' },
            { field: 'claimAmount' },
            { field: 'date', headerName: 'Request Date' },
            { field: 'toManager.username'},
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
        gridsterItem: { cols: 1, rows: 1, y: 1, x: 2 },
        inputs: {
          title: CONSTANTS.TITLES.RequestsApprovalsLoans,
          cardRadius: 0,
          rowData: [],
          columnDefs: [
            { field: 'Action' , cellRenderer: 'GridActionComponent',
              cellRendererParams: {
                action: this.outputActionsLoanReq.bind(this),
                value: { actionBtn: [ 'check_circle', 'cancel' ] },
                type: CONSTANTS.REQUEST
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
          flatItem: false,
          updateGridFromOutside: this.getloanAdvances$
        },
        gridComponentFullHeight: true,
        outputs: {
          onClickHandler: { handler: this.dynamicCompClickHandler.bind(this), args: ['$event'] }
        }
      }
    ];
  }

  dynamicCompClickHandler(event: any) {
    if(event.component && event.comp_name === CONSTANTS.IHRMS_GRID_COMPONENT) {
      if(event.action === CONSTANTS.VIEW_ALL) {
        if(event.component?.title === CONSTANTS.TITLES.RequestsApprovalsClaims) {
          this.router.navigate([`${CONSTANTS.ADMIN_DASHBOARD}/${CONSTANTS.ADMIN_EXPENSE_CLAIM_DETAILS}`])
        }
        if(event.component?.title === CONSTANTS.TITLES.RequestsApprovalsLoans) {
          const navExtras: NavigationExtras = { queryParams: { tab: 1 } };
          this.router.navigate([`${CONSTANTS.ADMIN_DASHBOARD}/${CONSTANTS.ADMIN_EXPENSE_CLAIM_DETAILS}`], navExtras)
        }
      }
    }
  }

}
