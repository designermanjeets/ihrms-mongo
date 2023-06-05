/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { BehaviorSubject, map, Subject, Subscription } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { MultiChartsComponent } from '@ihrms/ihrms-components';
import { CONSTANTS } from '@ihrms/shared';
import { AdminFinancesService, GQL_CREATE_PAYROLL, GQL_DAYS_WISE_SALARY, GQL_DELETE_PAYROLL, GQL_GET_MONTHLY_OVERTIME, GQL_GET_PAYROLL } from './_services/admin-finances.service';
import { IhrmsChartComponent } from '@ihrms/ihrms-highcharts';
import { Apollo } from 'apollo-angular';
import * as moment from 'moment';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'ihrms-admin-finances',
  templateUrl: './admin-finances.component.html',
  styleUrls: ['./admin-finances.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminFinancesComponent implements OnInit {

  gridsterOptions: GridsterConfig;
  cardSize = 300;
  gridLoaded = false;
  dashboardItems: Array<GridsterItem> | any;
  gridResize: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  multiChartData: any | undefined;
  rowIndexOrID: Subject<any> = new Subject();
  selectedRowIndex!: number;
  
  sub!: Subscription;
  @ViewChild('confirmPayrollDialog') confirmPayrollDialog!: TemplateRef<any>;

  generatedPayroll!: any;

  constructor(
    public dialog: MatDialog,
    private _afs: AdminFinancesService,
    private router: Router,
    private apollo: Apollo
  ) {
    this.gridsterOptions = this._afs.getGridsterOptions(this.cardSize, this);
  }

  ngOnInit(): void {

    this.multiChartData = [
      {
        title: 'Payout Details',
        series: {
          config: {
            alpha: 0,
            beta: 0,
            depth: 0
            // tooltipAffix: 'K'
          },
          name: 'Amount',
          type: 'column',
          data: [
            // [40], [45]
          ]
        },
        xAxisCategories: [ ],
        flex: 32,
        height: 95
      },
      {
        title: 'Employee Details',
        series: {
          config: {
            alpha: 0,
            beta: 0,
            depth: 0
          },
          name: 'Employees',
          type: 'column',
          data: [ 
            // [40], [45]
          ]
        },
        xAxisCategories: [ ],
        flex: 32,
        height: 95
      },
      {
        title: "Payroll Inputs",
        columnFit: true,
        gridData: {
          columnDefs: [
            { field: 'Input', sortable: true, filter: true },
            { field: 'Action', width: 100, cellRenderer: 'GridActionComponent',
              cellRendererParams: {
                action: this.outputActions.bind(this),
                value: { type: 'switch', options: [ 'Release', 'Lock'  ] }
              }},
          ],
          rowData: [
            { Input: 'Payroll Inputs', checked: false },
            { Input: 'Employee View Release', checked: false },
            { Input: 'Statement View', checked: false },
            { Input: 'Payroll', checked: false },
          ],
          updateGridFromOutside: this.rowIndexOrID
        },
        flex: 32,
        height: 95,
        mobileFlexInPx: 300
      },
    ]

    this.setupDashboardItems();

    this.getPayroll();

    // this.getOvertimeMonthlyHours();

  }

  setupDashboardItems() {

    this.dashboardItems = [
      {
        dynamicComponent: MultiChartsComponent,
        gridsterItem: { cols: 3, rows: 4, y: 0, x: 0 },
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
      {
        dynamicComponent: IhrmsChartComponent,
        gridsterItem: { cols: 1, rows: 3, y: 4, x: 0 },
        inputs: {
          charTitle: 'Salary On Hold/Pending',
          series: {
            config: {
              innerSize: 50,
              depth: 0,
              alpha: 0,
              tooltipAffix: ''
            },
            name: 'Amount',
            type: 'pie',
            data: []
          },
        }
      },
      {
        dynamicComponent: IhrmsChartComponent,
        gridsterItem: { cols: 1, rows: 3, y: 4, x: 1 },
        inputs: {
          charTitle: 'Salary Released',
          series: {
            config: {
              innerSize: 50,
              depth: 0,
              alpha: 0,
              tooltipAffix: ''
            },
            name: 'Amount',
            type: 'pie',
            data: []
          },
        }
      },
      {
        dynamicComponent: IhrmsChartComponent,
        gridsterItem: { cols: 1, rows: 3, y: 4, x: 1 },
        inputs: {
          charTitle: 'Overtime',
          series: {
            config: {
              beta: 0,
              depth: 0,
              alpha: 0
            },
            name: 'Overtime Pay',
            type: 'column',
            data: []
          },
          // xAxisCategories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        }
      },
    ];
  }

  openPayDialog(event: any): any {
    return this.dialog.open(this.confirmPayrollDialog, {
      panelClass: ['ihrms-dialog-overlay-panel', 'confirm-dialog-panel'],
      data: event,
      disableClose: true
    });
  }

  onPayCancel(event: any, res: boolean) { 
    if(res) {
      this.multiChartData[2].gridData.rowData[3].checked = true;
      if(event.action === 'Generate') {
        this.getPayrollSalary();
        this.rowIndexOrID.next({rowIndex: this.selectedRowIndex, action: CONSTANTS.EDIT, data: event.params.data });
      } else {
        this.deletePayrollSalary();
      }
    } else {
      this.multiChartData[2].gridData.rowData[3].checked = false;
      if(this.generatedPayroll) {
        const payInputs = this.generatedPayroll.payrollInputs;
        const rowData = [
          { Input: 'Payroll Inputs', checked: payInputs.payInputs },
          { Input: 'Employee View Release', checked: payInputs.empViewRelease },
          { Input: 'Statement View', checked: payInputs.statementView },
          { Input: 'Payroll', checked: payInputs.payrollProcess },
        ];
        this.rowIndexOrID.next({ action: CONSTANTS.UPDATE, rowData });
      } else {
        const rowData = [
          { Input: 'Payroll Inputs', checked: false },
          { Input: 'Employee View Release', checked: false },
          { Input: 'Statement View', checked: false },
          { Input: 'Payroll', checked: false },
        ];
        this.rowIndexOrID.next({ action: CONSTANTS.UPDATE, rowData });
      }
    }
    this.dialog.closeAll();
  }

  totalRowData() {
    const result = [];
    result.push({
      Component: ' Annual CTC ',
      Amount: '$31,000',
    });
    return result;
  }

  dynamicCompClickHandler(event: any) {
    if(event.component && event.comp_name === CONSTANTS.IHRMS_GRID_COMPONENT) {
      if(event.action === CONSTANTS.VIEW_ALL) {
        if(event.component?.title === CONSTANTS.TITLES.PayrollInputs) {
          const navExtras: NavigationExtras = { queryParams: { tab: 0 } };
          this.router.navigate([`${CONSTANTS.ADMIN_DASHBOARD}/${CONSTANTS.ADMIN_FINANCES_DETAILS}`], navExtras)
        }
      }
    }
  }

  outputActions(event: any) {
    if(event.type === 'switch' && event.params?.data?.Input === 'Payroll') {
      if(event.action?.checked) {
        this.selectedRowIndex = event.params.rowIndex;
        console.log('Payroll Checked');
        event['action'] = 'Generate'
        this.openPayDialog(event);
      } else {
        this.selectedRowIndex = -1;
        console.log('!Payroll Checked');
        event['action'] = 'Delete'
        this.openPayDialog(event);
      }
    }
  }

  getPayrollSalary() {
    this.sub = this.apollo.query<any, any>({ 
      query: GQL_DAYS_WISE_SALARY, 
      variables: { 
        query: { 
          dates: {
           gte: new Date(new Date(moment().startOf('month').format()).setUTCHours(0, 0, 0, 0)),
           lt: new Date(new Date(moment().endOf('month').format()).setUTCHours(0, 0, 0, 0))
          },
        }
      }})
      .pipe(map((data: any) => data?.data?.getCalculateSalarydayWise))
      .subscribe(val => {
        if(val) {
          const month = new Date(new Date(moment().startOf('month').format()).setUTCHours(0, 0, 0, 0));
          const res: any = _.forEach(_.cloneDeep(val), v => (delete v.user_salary_object, delete v._id, v['month'] = month));
           const payload = {
            month: month,
            payrolls: res,
            payrollInputs: {
              empViewRelease: this.multiChartData[2].gridData.rowData[1].checked,
              payInputs: this.multiChartData[2].gridData.rowData[0].checked,
              payrollProcess: this.multiChartData[2].gridData.rowData[3].checked,
              statementView: this.multiChartData[2].gridData.rowData[2].checked
            },
           };
           this.createPayroll(payload);
        }
      });
  }

  deletePayrollSalary() {
    this.apollo.mutate({ mutation: GQL_DELETE_PAYROLL, variables: this.generatedPayroll, })
    .pipe(map((res: any) => res?.data.deletePayroll))
    .subscribe((val: any) => {
      if(val) {
        this.generatedPayroll = null;
        const rowData = [
          { Input: 'Payroll Inputs', checked: false },
          { Input: 'Employee View Release', checked: false },
          { Input: 'Statement View', checked: false },
          { Input: 'Payroll', checked: false },
        ];
        this.rowIndexOrID.next({ action: CONSTANTS.UPDATE, rowData });
      }
    });
  }

  createPayroll(payload: any) {
    this.apollo.mutate({ mutation: GQL_CREATE_PAYROLL, variables: payload, })
    .pipe(map((res: any) => res?.data.createPayroll))
    .subscribe((val: any) => {
      if(val) {
        this.generatedPayroll = val;
        const payInputs = this.generatedPayroll.payrollInputs;
        const rowData = [
          { Input: 'Payroll Inputs', checked: payInputs.payInputs },
          { Input: 'Employee View Release', checked: payInputs.empViewRelease },
          { Input: 'Statement View', checked: payInputs.statementView },
          { Input: 'Payroll', checked: payInputs.payrollProcess },
        ];
        this.rowIndexOrID.next({ action: CONSTANTS.UPDATE, rowData });
      }
    });
  }

  getPayroll() {
    this.sub = this.apollo.watchQuery<any, any>({ 
      query: GQL_GET_PAYROLL, 
      variables: { 
        query: { 
          month: new Date(new Date(moment().startOf('month').format()).setUTCHours(0, 0, 0, 0)),
        }
      }})
      .valueChanges
      .pipe(map((data: any) => data?.data?.getPayroll[0]))
      .subscribe(val => {
        if(val) {

          this.generatedPayroll = val;

          const payInputs = val.payrollInputs;
          const rowData = [
            { Input: 'Payroll Inputs', checked: payInputs.payInputs },
            { Input: 'Employee View Release', checked: payInputs.empViewRelease },
            { Input: 'Statement View', checked: payInputs.statementView },
            { Input: 'Payroll', checked: payInputs.payrollProcess },
          ];
          this.rowIndexOrID.next({ action: CONSTANTS.UPDATE, rowData });

          const salariesOnHold: any = [];
          const salariesReleased: any = [];
          _.forEach(_.groupBy(val.payrolls, 'status'), (lv: any, idx) => {
            idx !== 'Released' && salariesOnHold.push([ idx,  lv.length]);
            idx === 'Released' && salariesReleased.push([ idx,  lv.length]);
          });
          this.dashboardItems[1].inputs.series = Object.assign({ }, this.dashboardItems[1].inputs.series, { data: salariesOnHold });
          this.dashboardItems[2].inputs.series = Object.assign({ }, this.dashboardItems[2].inputs.series, { data: salariesReleased });

          let totalOvertimePay: any = 0;
          let totalUserRangeSalary: any = 0;
          let totalDaysAbsent: any = 0;
          let totalDaysPresent: any = 0;
          let totalSecurity: any = 0;
          let Employees_Statutory_Deductions: any = 0;
          let Employers_Statutory_Contributions: any = 0;
          let Earnings_for_Employee: any = 0;
          _.forEach(val.payrolls, (lv: any) => {
            totalOvertimePay = totalOvertimePay + lv.total_overtime_done_by_user;
            totalUserRangeSalary = totalUserRangeSalary + lv.user_range_salary;
            totalDaysAbsent = totalDaysAbsent + lv.totalDaysAbsent;
            totalDaysPresent = totalDaysPresent + lv.totalDaysPresent;
            totalSecurity = totalSecurity + lv.Security_Deposit;
            Employees_Statutory_Deductions = Employees_Statutory_Deductions + lv.Employees_Statutory_Deductions;
            Employers_Statutory_Contributions = Employers_Statutory_Contributions + lv.Employers_Statutory_Contributions;
            Earnings_for_Employee = Earnings_for_Employee + lv.Earnings_for_Employee;
          });

          const totalSalaryDays = val.payrolls[0].day_diff;

          this.dashboardItems[3].inputs.series = Object.assign({ }, this.dashboardItems[3].inputs.series, { data: [totalOvertimePay] });
          
          this.multiChartData[0].xAxisCategories = [
            'User Salary', 
            'Absent Days', 
            'Present Days', 
            'Salary Days', 
            'Security Deduc',
            'Statutory Deduc',
            'Security Contri',
            'Emp. Earnings'
          ]
          this.multiChartData[0].series = Object.assign({ }, 
            this.multiChartData[0].series, { 
                data: [
                    [ totalUserRangeSalary ],
                    [ totalDaysAbsent ],
                    [ totalDaysPresent ],
                    [ totalSalaryDays ],
                    [ totalSecurity ],
                    [ Employees_Statutory_Deductions ],
                    [ Employers_Statutory_Contributions ],
                    [ Earnings_for_Employee ],
                ]
              }
            );
            
            
          const salariesUserData: any = [];
          const salariesxAxisCategories: any = [];
          _.forEach(val.payrolls, (lv: any, idx) => {
            salariesxAxisCategories.push(lv.username)
            salariesUserData.push([lv.user_range_salary]);
          });

          this.multiChartData[1].xAxisCategories = salariesxAxisCategories;
          this.multiChartData[1].series = Object.assign({ }, this.multiChartData[1].series, {  data: salariesUserData } );

        }
      });
  }

  getOvertimeMonthlyHours() {
    this.sub = this.apollo.watchQuery<any, any>({ 
      query: GQL_GET_MONTHLY_OVERTIME, 
      variables: { 
        query: { 
          dates: {
            gte: new Date(new Date(moment().startOf('year').format()).setUTCHours(0, 0, 0, 0)),
            lt: new Date(new Date(moment().endOf('year').format()).setUTCHours(0, 0, 0, 0))
          }
        }
      }})
      .valueChanges
      .pipe(map((data: any) => data?.data?.getOvertimeMonthWise))
      .subscribe(val => {
        if(val) {
          const avgColData: any = [];
          val.forEach((avg: any, idx: number) => avgColData.push(['Week ' + (idx + 1), avg.totalOvertimeHours]));
          this.dashboardItems[3].inputs.xAxisCategories = Object.keys(_.groupBy(val, '_id.week'));
          this.dashboardItems[3].inputs.series = Object.assign({ }, this.dashboardItems[3].inputs.series, { data: avgColData });
        }
      });
  }

}
