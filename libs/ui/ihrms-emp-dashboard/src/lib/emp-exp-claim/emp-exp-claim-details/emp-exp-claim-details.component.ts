import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { BehaviorSubject, map, Subscription } from 'rxjs';
import * as moment from 'moment';
import { IhrmsGridComponent } from '@ihrms/ihrms-grid';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { EmpExpClaimService, GQL_EXPENSE_CLAIM, GQL_EXPENSE_CLAIM_UPDATE, GQL_LOAN_ADVANCES, GQL_LOAN_ADVANCES_UPDATE } from '../_services/emp-exp-claim.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { GQL_USER_BY_ID, IhrmsEmpDashboardService } from '../../_services/ihrms-emp-dashboard.service';
import { CONSTANTS } from '@ihrms/shared';
import { MatDialog } from '@angular/material/dialog';
import { IhrmsDialogComponent } from '@ihrms/ihrms-components';
import { ToastrService } from 'ngx-toastr';
import { GridApi } from 'ag-grid-community';
import { ColumnApi } from '@ag-grid-community/core';
import { SharedService } from '@ihrms/shared';

@Component({
  selector: 'ihrms-emp-exp-claim-details',
  templateUrl: './emp-exp-claim-details.component.html',
  styleUrls: ['./emp-exp-claim-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmpExpClaimDetailsComponent implements OnInit {

  gridsterOptions: GridsterConfig;
  gridLoaded = false;
  dashboardItemsClaimsRequests: Array<GridsterItem> | any;
  dashboardItemsLoanRequests: Array<GridsterItem> | any;
  gridResize: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  selectedIndex! : number;
  @ViewChild('tabGroup') tabGroup!: ElementRef;

  cardSize = this.tabGroup?.nativeElement?.offsetHeight;
  filterConfig: any;
  gridEmpExpenceClaimApi!: GridApi;
  columnEmpExpenceClaimApi!: ColumnApi;
  hide_show_export_button: any;

  userManager: any;
  getExpenseClaims$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  getloanAdvances$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  sub!: Subscription;

  constructor(
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private _eds: IhrmsEmpDashboardService,
    private _ecl: EmpExpClaimService,
    private router: Router,
    private route: ActivatedRoute,
    private apollo: Apollo,
    private toastrService: ToastrService,
    private sharedService: SharedService
  ) {
    this.gridsterOptions = this._ecl.getGridsterOptions(this.cardSize, this );
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

  setupDashboardItems() {
    this.hide_show_export_button = this.sharedService.checkuserPermission('Employee', 'Expense Claim', 'export');
    this.dashboardItemsClaimsRequests = [
      {
        dynamicComponent: IhrmsGridComponent,
        gridsterItem: { cols: 1, rows: 1, y: 0, x: 0 },
        inputs: {
          title: '',
          cardRadius: 0,
          rowData: [],
          columnDefs: [
            { field: 'user.username' },
            { field: 'claimType' },
            { field: 'claimAmount' },
            { field: 'date', headerName: 'Request Date' },
            { field: 'status' },
            { field: 'toManager.username'},
            { field: 'Action', cellRenderer: 'GridActionComponent',
              cellRendererParams: {
                action: this.outputActionsClaimsReq.bind(this),
                value: { actionBtn: [ 'cancel' ] },
                type: CONSTANTS.REQUEST // Just do Disable Action After Recall
              }
            },
          ],
          columnFit: true,
          viewAll: false,
          pagination: true,
          paginationAutoPageSize: true,
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
            { field: 'user.username' },
            { field: 'loanAmount'},
            { field: 'loanType'},
            { field: 'EMI'},
            { field: 'period'},
            { field: 'outstanding'},
            { field: 'toManager.username'},
            { field: 'date', headerName: 'Request Date'},
            { field: 'status'},
            { field: 'Action', cellRenderer: 'GridActionComponent',
              cellRendererParams: {
                action: this.outputActionsLoanReq.bind(this),
                value: { actionBtn: [ 'cancel' ] },
                type: CONSTANTS.REQUEST // Just do Disable Action After Recall
              }
            },
          ],
          columnFit: true,
          viewAll: false,
          pagination: true,
          paginationAutoPageSize: true,
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

  outputActionsClaimsReq(event: any) {
    console.log(event);
    if(event.action === CONSTANTS.CANCEL) {
      this.openExpenseClaimRequestDialog(CONSTANTS.CANCEL, event, 'Claim');
    }
  }

  outputActionsLoanReq(event: any) {
    console.log(event);
    if(event.action === CONSTANTS.CANCEL) {
      this.openExpenseClaimRequestDialog(CONSTANTS.CANCEL, event, 'LoanAdvance');
    }
  }
  
  openExpenseClaimRequestDialog(action: string, event?: any, type?: string) {

    let fetchControls = null;
    let title = '';
    if(action === CONSTANTS.CANCEL && type === 'Claim') {
      title = 'Recall Claim';
      fetchControls = this._ecl.getRequestClaimDynamicControls();
    }
    if(action === CONSTANTS.CANCEL && type === 'LoanAdvance') {
      title = 'Recall Loan/Advance';
      fetchControls = this._ecl.getRequestLoanDynamicControls();
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

          if(action === CONSTANTS.CANCEL && type === 'Claim') {
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

          if(action === CONSTANTS.CANCEL && type === 'LoanAdvance') {
            const payload =  {
              userId: JSON.parse(sessionStorage.getItem('auth-user') || '').userID,
              ...result.value,
              status: 'Recalled',
              loanAmount: Number(result.value.loanAmount),
              EMI: Number(result.value.EMI),
              period: Number(result.value.period)
            }
            this.apollo.mutate({ mutation: GQL_LOAN_ADVANCES_UPDATE, variables: payload, })
              .pipe(map((res: any) => res?.data.editLoanAdvances))
              .subscribe((val: any) => {
                if(val) {
                  this.toastrService.success( `Success`, `Loan/Advance Recalled Successfully!`, { } );
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
  
  getUserManager(controlsObj: any, dialogRef: any) {
    const userID = JSON.parse(sessionStorage.getItem('auth-user') || '').userID;
    this.apollo.watchQuery<any, any>({ query: GQL_USER_BY_ID, variables: { query: { 
      limit: 100,
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
    if (event.component && event.comp_name === CONSTANTS.IHRMS_GRID_COMPONENT) {
      if (event.action === CONSTANTS.ON_FIRST_DATA_RENDERED) {
        this.gridEmpExpenceClaimApi = event.event.api;
        this.columnEmpExpenceClaimApi = event.event.columnApi;
      }
    }
  }

  onTabChanged(event: MatTabChangeEvent) {
    this.selectedIndex = event.index;
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: { tab: this.selectedIndex }});
  }
  onFiltersClickHandler(event: any) {
    if(event.action === CONSTANTS.EXPORT_TO_EXCEL) {
      this.gridEmpExpenceClaimApi.exportDataAsExcel({
        fileName: 'All_Expence-Claim_.xlsx'
      });
    }
    if(event.action === CONSTANTS.PRINT_ONLY) {
      const eGridDiv = document.querySelector<HTMLElement>('#ihrmsGrid') as any;
      eGridDiv.style.width = '';
      eGridDiv.style.height = '';
      this.gridEmpExpenceClaimApi.setDomLayout('print');
      setTimeout(function () {
        print();
      }, 2000);
    }
   }

}

