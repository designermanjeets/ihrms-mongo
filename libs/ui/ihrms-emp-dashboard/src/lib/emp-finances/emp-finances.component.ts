import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { BehaviorSubject, map, Subject, Subscription } from 'rxjs';
import { EmpFinancesService, GQL_PAYHEADS, GQL_SALARY_REVISIONS } from './_services/emp-finances.service';
import * as moment from 'moment';
import { IhrmsGridComponent } from '@ihrms/ihrms-grid';
import { MultiChartsComponent } from '@ihrms/ihrms-components';
import { CONSTANTS } from '@ihrms/shared';
import { NavigationExtras, Router } from '@angular/router';
import { GQL_GET_PAYROLL, GQL_SALARY } from '../_services/ihrms-emp-dashboard.service';
import * as _ from 'lodash';
import { Apollo } from 'apollo-angular';
import { GridApi } from 'ag-grid-community';
import { ColumnApi } from '@ag-grid-community/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'ihrms-emp-finances',
  templateUrl: './emp-finances.component.html',
  styleUrls: ['./emp-finances.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmpFinancesComponent implements OnInit {

  gridsterOptions: GridsterConfig;
  cardSize = 500;
  gridLoaded = false;
  dashboardItems: Array<GridsterItem> | any;
  gridResize: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  multiChartData: any | undefined;
  sub!: Subscription;
  rowIndexOrID: Subject<any> = new Subject();

  gridSalaryRevisionsApi!: GridApi;
  columnSalaryRevisionsApi!: ColumnApi;
  allPayHeads: any = [];

  constructor(
    private _efs: EmpFinancesService,
    private router: Router,
    private apollo: Apollo,
    public dialog: MatDialog,
  ) {
    this.gridsterOptions = this._efs.getGridsterOptions(this.cardSize, this);
  }

  ngOnInit(): void {

    this.multiChartData = [
      {
        title: 'My Pay',
        series: {
          config: {
            innerSize: 80,
            depth: 45,
            alpha: 45
          },
          name: 'Percentage',
          type: 'pie',
          data: []
        },
        flex: 100,
        height: 47
      },
      {
        title: CONSTANTS.TITLES.PayrollHistoric,
        columnFit: true,
        gridData: {
          columnDefs: [
            { field: 'Date', sortable: true, filter: false },
            { field: 'Salary', sortable: true, filter: false, type: 'rightAligned' },
            { field: 'Action', filter: false, width: 70, cellClass: "grid-cell-centered", cellRenderer: 'GridActionComponent',
              cellRendererParams: {
                action: this.outputActions.bind(this),
                value: { actionBtn: [ 'print', 'download' ] }
              }
            },
          ],
          rowData: []
        },
        flex: 100,
        height: 47,
        mobileFlexInPx: 300
      },
    ]

    this.setupDashboardItems();

    this.getSalary();

  }

  setupDashboardItems() {
    this.dashboardItems = [
      {
        dynamicComponent: IhrmsGridComponent,
        gridsterItem: { cols: 2, rows: 1, y: 0, x: 0 },
        inputs: {
          title: CONSTANTS.TITLES.Salary,
          cardRadius: 0,
          rowData: [],
          columnDefs: [
            { field: 'Component', sortable: true, filter: false },
            { field: 'Amount', sortable: true, filter: false, type: 'rightAligned', cellRenderer: (data: any) => data.value && `&#8377;${data.value}` },
          ],
          flatItem: false,
          columnFit: true,
          pinnedBottomRowData: [],
          updateGridFromOutside: this.rowIndexOrID
        },
        gridComponentFullHeight: true,
        outputs: {
          onClickHandler: { handler: this.dynamicCompClickHandler.bind(this), args: ['$event'] }
        }
      },
      {
        dynamicComponent: MultiChartsComponent,
        gridsterItem: { cols: 2, rows: 2, y: 0, x: 2 },
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
        dynamicComponent: IhrmsGridComponent,
        gridsterItem: { cols: 2, rows: 1, y: 1, x: 0 },
        inputs: {
          title: CONSTANTS.TITLES.SalaryRevisions,
          cardRadius: 0,
          rowData: [],
          columnDefs: [
            { field: 'username', headerName: 'Username', autoHeight: true, },
            { field: 'eCode', cellRenderer: 'GridAvatarComponent', autoHeight: true, },
            { field: 'effectiveDate', headerName: 'Effective Date', cellRenderer: (data: any) => data.value && moment(data.value).format('MM/DD/YYYY') },
            { field: 'department.name', headerName: 'Department'},
            { field: 'CTC', cellRenderer: (data: any) => data.value && `&#8377;${data.value}`},
          ],
          flatItem: false,
          viewAll: false,
        },
        gridComponentFullHeight: true,
        outputs: {
          onClickHandler: { handler: this.dynamicCompClickHandler.bind(this), args: ['$event'] },
          onGridReadyOut: { handler: this.onGridReadyOutSalaryRevisions.bind(this), args: ['$event'] },
        }
      },
    ];
  }

  onGridReadyOutSalaryRevisions(event: any) {
    this.gridSalaryRevisionsApi = event.gridApi;
    this.columnSalaryRevisionsApi = event.gridColumnApi;
    this.getSalaryRevisions();
  }
  
  getSalaryRevisions() {
    const actionCol = { 
      field: 'Action', cellRenderer: 'GridActionComponent',
        cellRendererParams: {
          action: this.outputActionsRevisions.bind(this),
          value: { actionBtn: [ 'edit', 'print', 'download'] }
        }
    };
    this.sub = this.apollo.watchQuery<any, any>({ query: GQL_SALARY_REVISIONS, variables: { query: { limit: 100, eCode: JSON.parse(sessionStorage.getItem('auth-user') || '').eCode }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getSalaryRevisions))
      .subscribe(val => {
        if(val) {
          const colDefs: any = _.cloneDeep(this.dashboardItems[2].inputs.columnDefs);
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

  outputActionsRevisions(event: any) {
    if(event.action === CONSTANTS.EDIT) {
      // const dialogRef = this.dialog.open(SalaryEditComponentRevisions, {
      //   data: { dialog: true, okButtonText: 'Save Changes', action: 'Add', params: event.params.data },
      //   panelClass: 'ihrms-dialog-overlay-panel',
      //   height: '320px'
      // });
  
      // dialogRef.componentInstance.dialogEventEmitter.subscribe((result: any) => {
      //   if (result) {
      //     if (result.action === CONSTANTS.FORM_SUBMIT_EVENT) {
      //       this.getSalaryRevisions();
      //     }
      //   }
      // });
    }
    if(event.action === CONSTANTS.PRINT) {
      console.log('Print');
    }
  }

  getPayHeads() {
    this.sub = this.apollo.watchQuery<any, any>({ query: GQL_PAYHEADS, variables: { query: { limit: 100 }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getPayHeads))
      .subscribe(val => this.allPayHeads = val);
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
        if(event.component?.title === CONSTANTS.TITLES.PayrollHistoric) {
          const navExtras: NavigationExtras = { queryParams: { tab: 1 } };
          this.router.navigate([`${CONSTANTS.EMP_DASHBOARD}/${CONSTANTS.EMP_FINANCES_DETAILS}`], navExtras)
        }
        if(event.component?.title === CONSTANTS.TITLES.Salary) {
          this.router.navigate([`${CONSTANTS.EMP_DASHBOARD}/${CONSTANTS.EMP_FINANCES_DETAILS}`])
        }
      }
    }
  }

  outputActions(event: any) {
    console.log(event);
  }

  getSalary() {
    this.sub = this.apollo.watchQuery<any, any>({ 
      query: GQL_SALARY, 
      variables: { 
        query: { 
            eCode: JSON.parse(sessionStorage.getItem('auth-user') || '').eCode
        }
      }})
      .valueChanges
      .pipe(map((data: any) => data?.data?.getSalary[0]))
      .subscribe(val => {
        if(val) {
          const rowData: any = [];
          _.forEach(val.payHeads, ph => {
            rowData.push({ Component: ph.name, Amount: `${ph.value}`, })
          });
          const pinnedBottomRowData = [{ Component: 'Annual CTC ', Amount: val.CTC, }]
          this.rowIndexOrID.next({rowData: rowData, action: CONSTANTS.UPDATE, pinnedBottomRowData: pinnedBottomRowData});
        }
      });
  }

}
