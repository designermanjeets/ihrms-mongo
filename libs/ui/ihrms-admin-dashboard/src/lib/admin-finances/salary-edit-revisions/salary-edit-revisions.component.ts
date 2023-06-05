/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { GQL_EMPLOYEES, GQL_EMPLOYEE_BY_ID } from '@ihrms/ihrms-components';
import { Apollo } from 'apollo-angular';
import { ControlBase } from '@ihrms/ihrms-dynamic-forms';
import { BehaviorSubject, delay, map, Observable, of, Subject, Subscription, switchMap } from 'rxjs';
import { GridApi, ICellRendererParams, Optional } from 'ag-grid-community';
import { GQL_EMPLOYEE_PAY_CALCULATE,GQL_EDIT_SALARY,GQL_SALARY_REVISIONS,SalarySettingsService,GQL_PAYHEADS } from '../../admin-settings/salary-settings/_services/salary-settings.service';
import * as _ from 'lodash';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CONSTANTS } from '@ihrms/shared';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';


@Component({
  selector: 'ihrms-salary-edit-revisions',
  templateUrl: './salary-edit-revisions.component.html',
  styleUrls: ['./salary-edit-revisions.component.scss'],
})
export class SalaryEditComponentRevisions implements OnInit {
  formulaChartData: any | undefined;
  userRowIndexOrID: Subject<any> = new Subject();
  controls$!: Observable<ControlBase<any>[]>;
  controlsObj!: ControlBase<any>[];
  trackAllColumns: any = [];
  allPayHeads: any = [];
  sub!: Subscription;
  salaryStrucOptions: any;
  salaryStructureId: any;
  tableId: any;
  departmentId: any;
  formulaGridApi!: GridApi;
  
  @Output() dialogEventEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private apollo: Apollo,
    private _sls: SalarySettingsService,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData: any,
    @Optional() public dialogRef: MatDialogRef<SalaryEditComponentRevisions>,
    private toastrService: ToastrService,
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
          { field: 'username', headerName: 'Username', filter: false },
          { field: 'eCode', filter: false },
          
        ],
        rowData: [],
        updateGridFromOutside: this.userRowIndexOrID,
      },
      flex: 100
    };
    this.getPayHeads();
  }

  getUserDataById() {
    const eCode = this.dialogData.params.eCode
    this.apollo.watchQuery<any, any>({ query: GQL_EMPLOYEE_BY_ID, variables: { query: { limit: 100, eCode: eCode }}})
    .valueChanges.subscribe(val => {
      if(val.data?.getUsers?.length) {
        this.generateDynamicPayHeadCols(this.dialogData.params, val);
      }
    });
  }

  getPayHeads() {
    this.sub = this.apollo.watchQuery<any, any>({ query: GQL_PAYHEADS, variables: { query: { limit: 100 }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getPayHeads))
      .subscribe(val => this.allPayHeads = val);
  }

  onAddEventSalaryRevisions(event: any) {
    
    const rowData : any = [];
    this.formulaGridApi.forEachNode((node: any) => rowData.push(Object.assign({}, node.data, { payHeads: [] })));
    this.allPayHeads.forEach((ph: any, idx: number) => {
      rowData.forEach((row: any) => {
        row._id = this.tableId;
        row.departmentId = this.departmentId;
        row.salaryStructureId = this.salaryStructureId;
        const isExists = Object.keys(row).filter(r => r === ph.name)[0];
        if(isExists) {
          row.payHeads.push({
            _id: ph._id,
            name: ph.name,
            value: Number(row[isExists]),
            payhead_type: ph.payhead_type,
          });
          delete row[isExists]; // Delete Root Level Heads Afterwards
        }
      })
    });
console.log(rowData[0])
    this.apollo.mutate({ mutation: GQL_SALARY_REVISIONS, variables: rowData[0]  })
      .pipe(map((res: any) => res?.data.createSalaryRevisons))
      .subscribe((val: any) => {
        if(val) {
          this.dialogRef.close();
          this.toastrService.success( `Success`, `Data Updated Successfully!`, { } );
          this.dialogEventEmitter.emit({ 'action': CONSTANTS.FORM_SUBMIT_EVENT});
        }
    });
  }
 
  onFormulaGridReady(event: any) {
    this.formulaGridApi = event.gridApi;
    this.getUserDataById();
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
      salaryStructure: this.salaryStructureId, //this.form?.value?.salary_structure,
      payHeads: payHeadsToSend.filter((ph: any) => ph.name !== 'username' || ph.name !== 'eCode') // Remove Non Pay Head Columns
    };
      console.log(payload)
    if(colID !== 'username' && colID !== 'eCode' && payload.payHeads.length) {
      this.calculatePayStructures(payload, paramsz.rowIndex);
    }

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
        this.ngxService.stopLoader('global_loader');
      }
    }, err=> {
      this.ngxService.stopLoader('global_loader');
    });
  }

  private generateDynamicPayHeadCols(formData: any, usersz: any) {
    console.log(formData)
    let colDefs = _.cloneDeep(this.formulaGridApi.getColumnDefs());
    colDefs = colDefs?.slice(0, 3);
    this.salaryStructureId = formData.salaryStructureId;
    this.tableId = formData._id;
    this.departmentId = formData.departmentId;
    const cellClassRules = {
      "cell-editable-ms": (params: any) => params.column.colId === 'Basic'
    };

    _.forEach(formData.payHeads, (str: any, idx: number) => {
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

    this.formulaGridApi.setRowData([formData]);
    this.formulaGridApi.setColumnDefs(colDefs || []);
    this.formulaGridApi.sizeColumnsToFit();

  }

  
}



