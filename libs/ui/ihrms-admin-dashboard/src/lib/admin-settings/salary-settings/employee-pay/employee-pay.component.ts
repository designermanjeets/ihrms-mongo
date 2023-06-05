/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { ColumnApi } from '@ag-grid-community/core';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GridApi, ICellRendererParams } from 'ag-grid-community';
import { Apollo } from 'apollo-angular';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, delay, map, Observable, Subject, Subscription } from 'rxjs';
import { GQL_EMPLOYEE_PAY_CALCULATE, GQL_PAYSTRUCTURE, GQL_UPLOAD_EMPLOYEE_SALARY_DETAILS, SalarySettingsService } from '../_services/salary-settings.service';
import * as _ from 'lodash';
import { CONSTANTS } from '@ihrms/shared';
import { ControlBase } from '@ihrms/ihrms-dynamic-forms';
import { GQL_DEPARTMENTS } from '../../../admin-departments/_services/admin-departments.service';
import { GQL_EMPLOYEES } from '@ihrms/ihrms-components';
import { IhrmsAdminDashboardService } from '../../../_services/ihrms-admin-dashboard.service';
import { GQL_PAYHEADS } from '../../../admin-settings/salary-settings/_services/salary-settings.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
// const excel_formula = require('excel-formula');

@Component({
  selector: 'ihrms-employee-pay',
  templateUrl: './employee-pay.component.html',
  styleUrls: ['./employee-pay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeePayComponent implements OnInit {

  formulaChartData: any | undefined;
  formulaBtnText = 'Add Formula';
  formulaGridApi!: GridApi;
  formulaGridColumnApi!: ColumnApi;
  formFormula!: FormGroup;

  form!: FormGroup;
  controls$!: Observable<ControlBase<any>[]>;
  controlsObj!: ControlBase<any>[];
  formSubmit$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  @Output() dialogEventEmitter: EventEmitter<any> = new EventEmitter<any>();

  userRowCurrentSelected!: number;
  userRowIndexOrID: Subject<any> = new Subject();

  sub!: Subscription;
  salaryStrucOptions: any;
  generateColumns = false;

  trackAllColumns: any = [];
  isCalculationDone = true;
  allPayHeads: any = [];
  payHeadIDs: any = [];
  allDepartUsers = [];

  constructor(
    private cdRef: ChangeDetectorRef,
    private _sls: SalarySettingsService,
    private apollo: Apollo,
    private toastrService: ToastrService,
    private _ihrmsadss: IhrmsAdminDashboardService,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit(): void {

    this.controls$ = this._sls.getPayEmployeeSalarySettingControls();
    this.controls$.subscribe(val => this.controlsObj = val);

    this.formulaChartData = {
      title: '',
      columnFit: true,
      pagination: true,
      paginationPageSize: 10,
      gridData: {
        columnDefs: [
          { field: '_id', hide: true, filter: false },
          { field: 'username', headerName: 'Username', filter: false },
          { field: 'eCode', filter: false },
        ],
        rowData: [],
        updateGridFromOutside: this.userRowIndexOrID,
      },
      flex: 100
    };

    this.getDepartments();
    
    this.getPayStructures();

    this.getPayHeads();

  }

  onCellValueChangedOut(event: any) {
    // if(event?.event?.column?.userProvidedColDef?.cellRendererParams?.calculationType !== "UserDefinedValue") {
      this.ngxService.startLoader('global_loader');
      this.calculateSalary(event.event);
    // }
  }

  private calculateSalary(paramsz: ICellRendererParams ) {

    const params = _.cloneDeep(paramsz);
    const colID: any = params.column?.getColId();
    params.data[colID] = params.value;

    const ifExists = this.trackAllColumns.filter((colId: any) => Object.keys(colId)[0] === colID)[0];
    if(ifExists && params.value !== undefined && params.value !== null) {
      ifExists[colID] = params.value;
    } else {
      params.value !== undefined && params.value !== null && this.trackAllColumns.push({ [colID]: params.value });
    }

    const payHeadsToSend: any = [];
    this.trackAllColumns.forEach((col: any, idx: number) => {
      payHeadsToSend.push({
        name: Object.keys(col)[0],
        value: col[Object.keys(col)[0]],
      });
    })

    const payload = {
      username: params.data?.username,
      eCode: params.data?.eCode,
      salaryStructure: this.form?.value?.salary_structure,
      payHeads: payHeadsToSend.filter((ph: any) => ph.name !== 'username' || ph.name !== 'eCode') // Remove Non Pay Head Columns
    };

    if(colID !== 'username' && colID !== 'eCode' && payload.payHeads.length) {
      this.isCalculationDone = false;
      this.calculatePayStructures(payload, paramsz.rowIndex);
    }

  }
  
  private generateDynamicPayHeadCols(formData: any, usersz: any) {

    const users = _.cloneDeep(usersz);
    const selected_structure = this.salaryStrucOptions.filter((struc: any) => struc._id === formData.salary_structure)[0];
    
    if(selected_structure) {

      let colDefs = _.cloneDeep(this.formulaGridApi.getColumnDefs());
      colDefs = colDefs?.slice(0, 3);

      const cellClassRules = {
        "cell-editable-ms": (params: any) => params.column.colId === 'Basic'
      };

      _.forEach(selected_structure.payHeads, (str: any, idx: number) => {
        if(colDefs?.length) {
          colDefs.push({
            field : str.name,
            filter: false,
            hide: str.name === 'Overtime',
            editable: str.name === 'Basic' || str.calculationType === 'UserDefinedValue',
            cellClassRules: cellClassRules,
            cellRendererParams: {
              calculationType: str.calculationType,
              payHeadType: str.payhead_type,
            }
          });
        }
      });

      _.forEach(users, u => _.forEach(selected_structure.payHeads, ph => u[ph.name] = '0'));

      this.formulaGridApi.setRowData(users);
      this.formulaGridApi.setColumnDefs(colDefs || []);
      this.formulaGridApi.sizeColumnsToFit();
    }
  }

  extractValues(options: any) {
    const newOpts: any = []; _.forEach(_.cloneDeep(options), payStru => newOpts.push(payStru.salaryStructure));
    return newOpts;
  }

  onDataChangeHandler(event: any) {
    console.log(event);
  }

  formulaCtrlChange(string: any) {
    //
  }
 
  getDepartments() {
    this.sub = this.apollo.watchQuery<any, any>({ query: GQL_DEPARTMENTS, variables: { query: { limit: 100 }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getDepartments))
      .subscribe(val => {
        this._ihrmsadss.getSelectOptions(this.controlsObj, val, 'department', '_id');
      });
  }

  getUserByDepartmentID(formData: any) {
    return this.apollo.watchQuery<any, any>({ query: GQL_EMPLOYEES, variables: { query: { 
      limit: 100, 
      departmentId: formData.department,
      approvers:  [{
        approverID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID,
      }],
    }}}).valueChanges
      .pipe(delay(100), map((data: any) => {
        return data?.data?.getUsers.filter((u: any) => !u.salary?.CTC);
      }))
      .subscribe(val => {
        if(val) {
          this.allDepartUsers = val;
          this._ihrmsadss.getSelectOptions(this.controlsObj, this.allDepartUsers, 'userID', '_id');
        }
        // this.generateDynamicPayHeadCols(formData, val);
      });
  }

  getUserByID(userID: string) {
    return this.apollo.query<any, any>({ query: GQL_EMPLOYEES, variables: { query: { 
      limit: 100, 
      id: userID,
      // approvers:  [{
      //   approverID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID,
      // }],
     }}})
      .pipe(map((data: any) => data?.data?.getUsers))
      .subscribe(val => {
        if(val) {
          this.generateDynamicPayHeadCols(this.form.value, val);
        }
      });
  }

  getPayStructures() {
    this.sub = this.apollo.watchQuery<any, any>({ query: GQL_PAYSTRUCTURE, variables: { query: { limit: 100 }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getPayStructures))
      .subscribe(val => {
        this.salaryStrucOptions = val;
        this._ihrmsadss.getSelectOptions(this.controlsObj, this.salaryStrucOptions, 'salary_structure', '_id', 'printName');
      });
  }

  calculatePayStructures(payload: any, rowIndex: number) {
    this.apollo.mutate({ mutation: GQL_EMPLOYEE_PAY_CALCULATE, variables: { input: payload} })
    .pipe(map((res: any) => res?.data.calculatePayStructure))
    .subscribe((val: any) => {
      if(val) {
        const convertToGridRows: any = [];
        val.calculatedPayHeads.forEach((r: any) => convertToGridRows.push({ [r.name]: r.calculatedValue }));
        const gridObj = Object.assign({}, val, ...convertToGridRows);
        delete gridObj.calculatedPayHeads;
        this.userRowIndexOrID.next({rowIndex, rowData: gridObj, action: CONSTANTS.EDIT})
        this.toastrService.success( `Success`, `Data Calculated Successfully!`, { } );
        this.isCalculationDone = true;
        this.ngxService.stopLoader('global_loader');
      }
    }, err=> {
      this.isCalculationDone = true;
      this.ngxService.stopLoader('global_loader');
    });
  }
 
  formObjectEvent(form: FormGroup) {
    this.form = form;
    this.form.get('salary_structure')?.disable();
    this.form.get('department')?.valueChanges
    .subscribe(val => {
      if(val) {
        this.getUserByDepartmentID(this.form.value);
        this.form.get('salary_structure')?.enable();
      } else {
        this.form.get('salary_structure')?.disable();
      }
    });
  }

  formSubmitEvent(event: any) {
    this.formulaGridApi.setRowData([]);
    // this.getUserByDepartmentID(event);
    this.getUserByID(event.userID);
  }

  onSelect(event: any) {
    this.formSubmit$.next(true);
  }

  getPayHeads() {
    this.sub = this.apollo.watchQuery<any, any>({ query: GQL_PAYHEADS, variables: { query: { limit: 100 }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getPayHeads))
      .subscribe(val => this.allPayHeads = val);
  }

  onAddEventSalary(event: any) {
    const rowData : any = [];
    this.formulaGridApi.forEachNode((node: any) => rowData.push(Object.assign({}, node.data, { payHeads: [] })));
    this.allPayHeads.forEach((ph: any, idx: number) => {
      rowData.forEach((row: any) => {
        row.departmentId =  this.form.get('department')?.value;
        row.salaryStructureId =  this.form.get('salary_structure')?.value;
        const isExists = Object.keys(row).filter(r => r === ph.name)[0];
        if(isExists) {
          row.payHeads.push({
            _id: ph._id,
            name: ph.name,
            value: Math.round(row[isExists]),
            payhead_type: ph.payhead_type,
            calculationType: ph.calculationType,
          });
          delete row[isExists]; // Delete Root Level Heads Afterwards
        }
      })
    });

    this.apollo.mutate({ mutation: GQL_UPLOAD_EMPLOYEE_SALARY_DETAILS, variables: { input: rowData } })
      .pipe(map((res: any) => res?.data.insertManySalaryUsers))
      .subscribe((val: any) => {
        if(val) {
          this.toastrService.success( `Success`, `Data Added Successfully!`, { } );
        }
    });
  }

  onFormulaGridReady(event: any) {
    this.formulaGridApi = event.gridApi;
    this.formulaGridColumnApi = event.gridColumnApi;
  }

  outputFormulaActions(event: any) {
    console.log(event)
    if (event.action === CONSTANTS.EDIT) {
      // Form Patch
      this.formulaBtnText = 'Edit Formula';
      this.userRowCurrentSelected = event.params.rowIndex;
    }
    if (event.action === CONSTANTS.CANCEL) {
      // this.salaryStructureGridApi.applyTransaction({ remove: [event.params.data] });
    }
  }

}
