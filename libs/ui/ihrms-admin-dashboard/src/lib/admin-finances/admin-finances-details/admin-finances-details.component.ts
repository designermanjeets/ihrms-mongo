/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { ChangeDetectionStrategy, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { BehaviorSubject,Subscription,Subject } from 'rxjs';
import * as moment from 'moment';
import { IhrmsGridComponent } from '@ihrms/ihrms-grid';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { AdminFinancesService,GQL_SALARY, GQL_GET_PAYROLL, GQL_EDIT_PAYROLL, GQL_SALARY_REVISIONS,GQL_GET_SALARY_SLIP_DETAILS } from '../_services/admin-finances.service';
import { IhrmsAdminDashboardService } from '../../_services/ihrms-admin-dashboard.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { CONSTANTS } from '@ihrms/shared';
import { GridApi } from 'ag-grid-community';
import { ColumnApi } from '@ag-grid-community/core';
import * as _ from 'lodash';
import { GQL_PAYHEADS } from '../../admin-settings/salary-settings/_services/salary-settings.service';
import { MatDialog } from '@angular/material/dialog';
import { SalaryEditComponent } from '../salary-edit/salary-edit.component';
import { SalaryEditComponentRevisions } from '../salary-edit-revisions/salary-edit-revisions.component';
import { SharedService } from '@ihrms/shared';


import { jsPDF } from 'jspdf';

@Component({
  selector: 'ihrms-admin-finances-details',
  templateUrl: './admin-finances-details.component.html',
  styleUrls: ['./admin-finances-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminFinancesDetailsComponent implements OnInit {

  gridApi!: GridApi;
  columnApi!: ColumnApi;
  gridSalaryRevisionsApi!: GridApi;
  columnSalaryRevisionsApi!: ColumnApi;
  hide_show_export_button: any;
  gridsterOptions: GridsterConfig;
  gridLoaded = false;
  dashboardItemsSalary: Array<GridsterItem> | any;
  dashboardItemsSalaryRevisions: Array<GridsterItem> | any;
  dashboardItemsIncomeTax: Array<GridsterItem> | any;
  dashboardItemsPayroll: Array<GridsterItem> | any;
  gridResize: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  selectedIndex! : number;
  @ViewChild('tabGroup') tabGroup!: ElementRef;
  multiChartData: any | undefined;
  sub!: Subscription;
  rowIndexOrIDSalaryRequests: Subject<any> = new Subject();
  rowIndexOrIDSalaryRevisions: Subject<any> = new Subject();
  rowIndexOrIDSalaryPayroll: Subject<any> = new Subject();

  cardSize = this.tabGroup?.nativeElement?.offsetHeight;
  
  filterConfig: any;
  allPayHeads: any = [];
  summaryList:any = [];

  @ViewChild('confirmDialog') confirmDialog!: TemplateRef<any>;
  @ViewChild('confirmPayrollDialog') confirmPayrollDialog!: TemplateRef<any>;
  @ViewChild('printPayslipDialog') printPayslipDialog!: TemplateRef<any>;
  @ViewChild('payslipContent', { static: true }) payslipContent!: ElementRef;
  @ViewChild('payslipPDFContent', { static: true }) payslipPDFContent!: ElementRef;

  constructor(
    public dialog: MatDialog,
    private _afs: AdminFinancesService,
    private router: Router,
    private route: ActivatedRoute,
    private _ihrmsadss: IhrmsAdminDashboardService,
    private apollo: Apollo,
    private sharedService: SharedService
  ) {
    this.gridsterOptions = this._afs.getGridsterOptions(this.cardSize, this );
  }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.selectedIndex = +params['tab'];
      this.setupDashboardItems();
      this.getPayHeads();
    });

    this.filterConfig = {
      filterForm: false,
      show_Export_Button: this.hide_show_export_button,
    };

  }

  getCurrentZoneTime(d: any) {
    return moment(d).format('MM-DD-YYYY');
  }
  
  getCurrentMonthFirstdate(){
    return moment().startOf('month').format('DD-MM-YYYY');
  }

  getCurrentMonthLastdate(){
   return moment().endOf('month').format("DD-MM-YYYY");
  }

  outputActions(event: any) {
    if(event.action === CONSTANTS.EDIT) {
      const dialogRef = this.dialog.open(SalaryEditComponent, {
        data: { dialog: true, okButtonText: 'Save Changes', action: 'Add', params: event.params.data },
        panelClass: 'ihrms-dialog-overlay-panel',
        height: '320px'
      });

      dialogRef.componentInstance.dialogEventEmitter.subscribe((result: any) => {
        if (result) {
          if (result.action === CONSTANTS.FORM_SUBMIT_EVENT) {
            this.getSalary();
          }
        }
      });
    }
    if(event.action === CONSTANTS.PRINT) {
      this.onPayPrint(event);
    }
    
  }

  outputActionsRevisions(event: any) {
    if(event.action === CONSTANTS.EDIT) {
      const dialogRef = this.dialog.open(SalaryEditComponentRevisions, {
        data: { dialog: true, okButtonText: 'Save Changes', action: 'Add', params: event.params.data },
        panelClass: 'ihrms-dialog-overlay-panel',
        height: '320px'
      });
  
      dialogRef.componentInstance.dialogEventEmitter.subscribe((result: any) => {
        if (result) {
          if (result.action === CONSTANTS.FORM_SUBMIT_EVENT) {
            this.getSalaryRevisions();
          }
        }
      });
    }
    if(event.action === CONSTANTS.PRINT) {
      console.log('Print');
    }
  }

  outputActionsPayroll(event: any) {
    this.openPayDialog(event);
  }

  editPayroll(payload: any) {
    this.apollo.mutate({ mutation: GQL_EDIT_PAYROLL, variables: payload, })
    .pipe(map((res: any) => res?.data.editPayroll))
    .subscribe((val: any) => {
      if(val) {
        this.getPayroll();
      }
    });
  }

  getPayHeads() {
    this.sub = this.apollo.query<any, any>({ query: GQL_PAYHEADS, variables: { query: { limit: 100 }}})
      .pipe(map((data: any) => data?.data?.getPayHeads))
      .subscribe(val => this.allPayHeads = val);
  }

  getPayroll() {
    this.sub = this.apollo.query<any, any>({ 
      query: GQL_GET_PAYROLL, 
      variables: { 
        query: { 
          month: new Date(new Date(moment().startOf('month').format()).setUTCHours(0, 0, 0, 0)),
        }
      }})
      .pipe(map((data: any) => data?.data?.getPayroll[0]))
      .subscribe(val => {
        if(val) {
           this.rowIndexOrIDSalaryPayroll.next({rowData: val.payrolls, action: CONSTANTS.UPDATE});
        } else {
          this.openDialog();
        }
      });
  }

  getSalary() {
    const actionCol = { 
      field: 'Action', cellRenderer: 'GridActionComponent',
        cellRendererParams: {
          action: this.outputActions.bind(this),
          value: { actionBtn: [ 'edit',] } // 'print', 'download'
        }
    };
    this.sub = this.apollo.query<any, any>({ query: GQL_SALARY, variables: { query: { limit: 100 }}})
      .pipe(map((data: any) => data?.data?.getSalary))
      .subscribe(val => {
        if(val) {
          const colDefs: any = _.cloneDeep(this.dashboardItemsSalary[0].inputs.columnDefs);
          const valz = _.cloneDeep(val)
           valz?.forEach(async(u: any, idx: number) => {
              u.payHeads?.forEach((k: any, idy: number) => u[k.name] = k.value);
          });
          _.forEach(this.allPayHeads, (str: any, idx: number) => colDefs?.length && colDefs.push( //  && str.name !== 'Overtime' 
            { 
              field : str.name,
              hide: str.name === 'Overtime',
              cellRenderer: (data: any) => {
                return data.column.colId === 'CTC' ? data.value && `&#8377;${data.value}`:  data.value && `&#8377;${data.value}`;
              }
            }
          ));
          setTimeout(() => {
            this.gridApi.setRowData(valz);
            this.gridApi.setColumnDefs([...colDefs, actionCol] || []);
            this.gridApi.sizeColumnsToFit();
          }, 1000);
        }
      });
  }
  
  openDialog(): any {
    return this.dialog.open(this.confirmDialog, {
      panelClass: ['ihrms-dialog-overlay-panel', 'confirm-dialog-panel'],
      disableClose: true
    })
    .afterClosed().subscribe((val: boolean) => {
      this.selectedIndex = 0;
    })
  }

  openPayDialog(event: any): any {
    return this.dialog.open(this.confirmPayrollDialog, {
      panelClass: ['ihrms-dialog-overlay-panel', 'confirm-dialog-panel'],
      data: event,
      disableClose: true
    });
  }

  onCancel() { 
    this.dialog.closeAll();
  }

  onPayCancel(event: any) { 
    if(event) {
      const payload = {
        payrolls: [{
            ...event.params.data, 
            status: event.action === 'Release' ? 'Released': 'Hold',
          }]
        }
      this.editPayroll(payload);
    }
    this.dialog.closeAll();
  }

  onPayPrint(event: any): any {
    this.getSalarySlipDetatails(event);
  }

  onPayPrintCancel() {
    this.dialog.closeAll();
  }

  downloadAsPDF() {
    const pages = document.querySelector('#ihrmsGrid') as HTMLElement;
    const doc = new jsPDF({
      unit: 'px',
      format: [1100, 1100]
    });
    doc.setFontSize(12);
    doc.setProperties({
      author: 'GONN'
    })

    doc.html(pages, {
      margin: 20,
      callback: (doc: jsPDF) => {
        doc.save('pdf-export');
      }
    });
  }

  getSalarySlipDetatails(event:any){
      this.sub = this.apollo.watchQuery<any, any>({ 
        query: GQL_GET_SALARY_SLIP_DETAILS, 
        variables: {
          query: {
            dates: { 
              gte: "2022-12-21T00:00:00+05:30",
              lt: "2022-12-30T00:00:00+05:30"
            },
            eCode: event.params.data.eCode,
          }}
        }).valueChanges
        .pipe(map((data: any) => data?.data?.getUserSalarySlip))
        .subscribe((val: any) => {
          if(val.length) {
            this.dialog.open(this.printPayslipDialog, {
              panelClass: ['ihrms-dialog-overlay-panel', 'confirm-dialog-panel', 'payslipClass'],
              data: val[0],
              width: "100vw",
              height: "100vh",
              disableClose: true,
            });
          }
      });  
  }
  

  getSalaryRevisions() {
    const actionCol = { 
      field: 'Action', cellRenderer: 'GridActionComponent',
        cellRendererParams: {
          action: this.outputActionsRevisions.bind(this),
          value: { actionBtn: [ 'edit', 'print', 'download'] }
        }
    };
    this.sub = this.apollo.watchQuery<any, any>({ query: GQL_SALARY_REVISIONS, variables: { query: { limit: 100 }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getSalaryRevisions))
      .subscribe(val => {
        if(val) {
          const colDefs: any = _.cloneDeep(this.dashboardItemsSalaryRevisions[0].inputs.columnDefs);
          const valz = _.cloneDeep(val)
           valz?.forEach(async(u: any, idx: number) => {
              u.payHeads?.forEach((k: any, idy: number) => u[k.name] = k.value);
          });
          _.forEach(this.allPayHeads, (str: any, idx: number) => colDefs?.length && colDefs.push(
            { 
              field : str.name,
              cellRenderer: (data: any) => {
                return data.column.colId === 'Overtime' ? data.value && `&#8377;${data.value}/hr`:  data.value && `&#8377;${data.value}`;
              }
            }
          ));
          setTimeout(() => {
            this.gridSalaryRevisionsApi.setRowData(valz);
            this.gridSalaryRevisionsApi.setColumnDefs([...colDefs, actionCol] || []);
            this.gridSalaryRevisionsApi.sizeColumnsToFit();
          }, 1000);
        }
      });
  }

  setupDashboardItems() {
    this.hide_show_export_button = this.sharedService.checkuserPermission('Admin', 'Holidays', 'export');
    const rowClassRules = {
      'row-bg-transparent': function(params: any) { return params.data.status !== 'Hold' && params.data.status !== 'Released'; },
      'row-bg-red': function(params: any) { return params.data.status === 'Hold'; },
      'row-bg-green': function(params: any) { return params.data.status === 'Released'; },
    };

    this.dashboardItemsSalary = [
      {
        dynamicComponent: IhrmsGridComponent,
        gridsterItem: { cols: 1, rows: 1, y: 0, x: 0 },
        inputs: {
          title: '',
          cardRadius: 0,
          rowData: [],
          columnDefs: [
            { field: 'username', headerName: 'Username', autoHeight: true, },
            { field: 'eCode', cellRenderer: 'GridAvatarComponent', autoHeight: true, },
            { field: 'effectiveDate', headerName: 'Effective Date', cellRenderer: (data: any) => data.value && moment(data.value).format('MM/DD/YYYY') },
            { field: 'department.name', headerName: 'Department'},
            // { field: 'CTC', cellRenderer: (data: any) => data.value && `&#8377;${data.value}`},
          ],
          columnFit: false,
          pagination: true,
          paginationAutoPageSize: true,
          viewAll: false,
          updateGridFromOutside: this.rowIndexOrIDSalaryRequests,
        },
        flatItem: true,
        gridComponentFullHeight: true,
        outputs: {
          onClickHandler: { handler: this.dynamicCompClickHandler.bind(this), args: ['$event'] },
          onGridReadyOut: { handler: this.onGridReadyOutSalary.bind(this), args: ['$event'] },
        }
      }
    ];

    this.dashboardItemsSalaryRevisions = [
      {
        dynamicComponent: IhrmsGridComponent,
        gridsterItem: { cols: 1, rows: 1, y: 0, x: 0 },
        inputs: {
          title: '',
          cardRadius: 0,
          rowData: [],
          columnDefs: [
            { field: 'username', headerName: 'Username', autoHeight: true, },
            { field: 'eCode', cellRenderer: 'GridAvatarComponent', autoHeight: true, },
            { field: 'effectiveDate', headerName: 'Effective Date', cellRenderer: (data: any) => data.value && moment(data.value).format('MM/DD/YYYY') },
            { field: 'department.name', headerName: 'Department'},
            // { field: 'CTC', cellRenderer: (data: any) => data.value && `&#8377;${data.value}`},
          ],
          columnFit: false,
          pagination: true,
          paginationAutoPageSize: true,
          viewAll: false,
          updateGridFromOutside: this.rowIndexOrIDSalaryRevisions,
        },
        flatItem: true,
        gridComponentFullHeight: true,
        outputs: {
          onClickHandler: { handler: this.dynamicCompClickHandler.bind(this), args: ['$event'] },
          onGridReadyOut: { handler: this.onGridReadyOutSalaryRevisions.bind(this), args: ['$event'] },
        }
      }
    ];

    this.dashboardItemsIncomeTax = [
      {
        dynamicComponent: IhrmsGridComponent,
        gridsterItem: { cols: 1, rows: 1, y: 0, x: 0 },
        inputs: {
          title: '',
          cardRadius: 0,
          rowData: [],
          columnDefs: [
            { field: 'null',},
            { field: 'Total',},
            { field: 'Jan',},
            { field: 'Feb',},
            { field: 'Mar',},
            { field: 'Apr',},
            { field: 'May',},
            { field: 'Jun',},
            { field: 'Jul',},
            { field: 'Aug',},
            { field: 'Sep',},
            { field: 'Oct',},
            { field: 'Nov',},
            { field: 'Dec',},
          ],
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

    this.dashboardItemsPayroll = [
      {
        dynamicComponent: IhrmsGridComponent,
        gridsterItem: { cols: 1, rows: 1, y: 0, x: 0 },
        inputs: {
          title: '',
          cardRadius: 0,
          rowData: [],
          rowClassRules: rowClassRules,
          columnDefs: [
            { field: 'eCode', },
            { field: 'username', headerName: 'Employee',},
            { field: 'totalDaysPresent', headerName: 'Present Days' },
            { field: 'totalDaysAbsent', headerName: 'Leaves'},
            { field: 'companyDaysOFF', headerName: 'Days Off'},
            { field: 'Earnings_for_Employee', headerName: 'Earnings', cellRenderer: (data: any) => data.value && `&#8377;${data.value}`},
            { field: 'Employees_Statutory_Deductions', headerName: 'Deductions', cellRenderer: (data: any) => data.value && `&#8377;${data.value}`},
            { field: 'Employers_Statutory_Contributions', headerName: 'Contributions', cellRenderer: (data: any) => data.value && `&#8377;${data.value}`},
            { field: 'Security_Deposit', headerName: 'Security Deposit', cellRenderer: (data: any) => data.value && `&#8377;${data.value}`},
            { field: 'total_overtime', headerName: 'Overtime' },
            { field: 'total_overtime_done_by_user', headerName: 'Overtime Amt.', cellRenderer: (data: any) => data.value && `&#8377;${data.value}`},
            { field: 'user_range_salary', headerName: 'Total Salary', cellRenderer: (data: any) => data.value && `&#8377;${data.value}` },
            { field: 'total_pay_heads_salary', headerName: 'Net Salary', cellRenderer: (data: any) => data.value && `&#8377;${data.value}` },
            { field: 'user_salary', headerName:'CTC', cellRenderer: (data: any) => data.value && `&#8377;${data.value}`},
            // { field: 'user_overtime',headerName:'OverTime', cellRenderer: (data: any) => data.value && `&#8377;${data.value}`},
            { field: 'day_diff', headerName: 'Total Days'},
            // { field: 'Per_day', headerName: 'Loss Of Pay', cellRenderer: (data: any) => data.value && `&#8377;${data.value}`},
            // { field: 'department.name', headerName: 'Gross', cellRenderer: (data: any) => data.value && `&#8377;${data.value}`},
            { field: 'status' },
            { field: 'Actions', cellRenderer: 'GridActionComponent', width: 300,
              cellRendererParams: {
                action: this.outputActionsPayroll.bind(this),
                value: { type: 'buttons', names: [ 'Release', 'Hold'] },
                type: CONSTANTS.REQUEST
              }
            },
          ],
          columnFit: false,
          pagination: true,
          paginationAutoPageSize: true,
          viewAll: false,
          // pinnedBottomRowData: this.totalRowData(),
          updateGridFromOutside: this.rowIndexOrIDSalaryPayroll,
        },
        flatItem: true,
        gridComponentFullHeight: true,
        outputs: {
          onClickHandler: { handler: this.dynamicCompClickHandler.bind(this), args: ['$event'] },
          onGridReadyOut: { handler: this.onGridReadyOutSalaryPayroll.bind(this), args: ['$event'] },
         
        }
      }
    ];

  }

  onGridReadyOutSalaryPayroll(event: any) {
    this.gridApi = event.gridApi;
    this.columnApi = event.gridColumnApi;
    this.getPayroll();
  }

  onGridReadyOutSalary(event: any) {
    this.gridApi = event.gridApi;
    this.columnApi = event.gridColumnApi;
    this.getSalary();
  }

  onGridReadyOutSalaryRevisions(event: any) {
    this.gridSalaryRevisionsApi = event.gridApi;
    this.columnSalaryRevisionsApi = event.gridColumnApi;
    this.getSalaryRevisions();
  }

  onFilterSubmitFinance(event: any){
    if(event.action === CONSTANTS.EXPORT_TO_EXCEL) {
      this.gridSalaryRevisionsApi.exportDataAsExcel({
        fileName: 'All_Salary_details-Details_.xlsx'
      });
    }
    if(event.action === CONSTANTS.PRINT_ONLY) {
      const eGridDiv = document.querySelector<HTMLElement>('#ihrmsGrid') as any;
      eGridDiv.style.width = '';
      eGridDiv.style.height = '';
      this.gridSalaryRevisionsApi.setDomLayout('print');
      setTimeout(function () {
        print();
      }, 2000);
    }
  }

  onFilterSubmitPayroll(event: any){

    if(event.action === CONSTANTS.EXPORT_TO_EXCEL) {
      this.gridSalaryRevisionsApi.exportDataAsExcel({
        fileName: 'All_Payroll-Details_.xlsx'
      });
    }
    if(event.action === CONSTANTS.PRINT_ONLY) {
      const eGridDiv = document.querySelector<HTMLElement>('#ihrmsGrid') as any;
      eGridDiv.style.width = '';
      eGridDiv.style.height = '';
      this.gridSalaryRevisionsApi.setDomLayout('print');
      setTimeout(function () {
        print();
      }, 2000);
    }
  }

  onFilterSubmitSalaryRevisions(event: any){
    if(event.action === CONSTANTS.EXPORT_TO_EXCEL) {
      this.gridSalaryRevisionsApi.exportDataAsExcel({
        fileName: 'All_Salary_Revisions-Details_.xlsx'
      });
    }
    if(event.action === CONSTANTS.PRINT_ONLY) {
      const eGridDiv = document.querySelector<HTMLElement>('#ihrmsGrid') as any;
      eGridDiv.style.width = '';
      eGridDiv.style.height = '';
      this.gridSalaryRevisionsApi.setDomLayout('print');
      setTimeout(function () {
        print();
      }, 2000);
    }
  }

  dynamicCompClickHandler(event: any) {
    console.log(event);
    if(event.action === CONSTANTS.EXPORT_TO_EXCEL) {
      this.gridSalaryRevisionsApi.exportDataAsExcel({
        fileName: 'All_Attendance-Details_.xlsx'
      });
    }
    if(event.action === CONSTANTS.PRINT_ONLY) {
      const eGridDiv = document.querySelector<HTMLElement>('#ihrmsGrid') as any;
      eGridDiv.style.width = '';
      eGridDiv.style.height = '';
      this.gridSalaryRevisionsApi.setDomLayout('print');
      setTimeout(function () {
        print();
      }, 2000);
    }
    if (event.component && event.comp_name === CONSTANTS.IHRMS_GRID_COMPONENT) {
      if (event.action === CONSTANTS.ON_FIRST_DATA_RENDERED) {
        this.gridSalaryRevisionsApi = event.event.api;
        this.columnSalaryRevisionsApi = event.event.columnApi;
      }
    }
  }

  totalRowData(val?: any) {
    const result = [];
    result.push({
      user_range_salary: val?.payrolls?.user_range_salary,
      Actions: 'Pay All',
    });
    return result;
  }

  onTabChanged(event: MatTabChangeEvent) {
    this.selectedIndex = event.index;
    if(!this.selectedIndex) { this.getSalary() }
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: { tab: this.selectedIndex }});
  }

}

