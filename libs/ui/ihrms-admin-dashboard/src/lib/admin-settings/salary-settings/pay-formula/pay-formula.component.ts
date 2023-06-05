import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef, EventEmitter,
  Inject, NgZone,
  OnInit, Optional, Output,
  ViewChild
} from '@angular/core';
import { ColumnApi, GridApi } from 'ag-grid-community';
import { FormGroup } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { GQL_PAYFORMULAS, GQL_PAYFORMULAS_CREATE, GQL_PAYFORMULAS_UPDATE, GQL_PAYHEADS, SalarySettingsService } from '../_services/salary-settings.service';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { CONSTANTS } from '@ihrms/shared';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import { ToastrService } from 'ngx-toastr';

import { SelectionService, EditService, SheetModel, DefineNameModel, FindOptions } from '@syncfusion/ej2-angular-spreadsheet';
import { SpreadsheetComponent,
  getCell,
  CellModel,
  SelectEventArgs,
  getRangeIndexes } from '@syncfusion/ej2-angular-spreadsheet';
import { DataManager, Query } from '@syncfusion/ej2-data';

@Component({
  selector: 'ihrms-pay-formula',
  templateUrl: './pay-formula.component.html',
  styleUrls: ['./pay-formula.component.scss'],
  providers: [SelectionService, EditService],
  changeDetection: ChangeDetectionStrategy.Default
})
export class PayFormulaComponent implements OnInit {

  formulaChartData: any | undefined;
  formulaBtnText = 'Add Formula';
  formulaGridApi!: GridApi;
  formulaGridColumnApi!: ColumnApi;
  formFormula!: FormGroup;

  // Some Defaults
  formulaIdCtrl = '';
  formulaNameCtrl = '';
  formulaCtrl = '';

  @Output() dialogEventEmitter: EventEmitter<any> = new EventEmitter<any>();

  payFormulaRowCurrentSelected!: number;
  payFormulaRowIndexOrID: Subject<any> = new Subject();

  sub!: Subscription;

  @ViewChild('spreadSheetFormula', { static: false }) spreadsheetObj!: SpreadsheetComponent;
  public spread_loaded = false;
  @ViewChild('formula')
  public spread_query: Query = new Query().select(['computedFormula', 'name', 'namePayslip', 'testValue']).take(200);
  public spread_data: DataManager = new DataManager();
  public freezePane: number = 1;
  public formulaStyles = { fontSize: "11pt", fontWeight: "bold", verticalAlign: "middle", height: '50px' };
  public headerStyles = {  backgroundColor: '#ddd',fontSize: "11pt", fontWeight: "bold", verticalAlign: "middle" };
  public cellObjs: any = {};

  constructor(
    private cdRef: ChangeDetectorRef,
    private _sls: SalarySettingsService,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData: any,
    @Optional() public dialogRef: MatDialogRef<PayFormulaComponent>,
    private ngZone: NgZone,
    private apollo: Apollo,
    private toastrService: ToastrService,
  ) { 

  }

  ngOnInit(): void {

    this.formulaChartData = {
      title: '',
      columnFit: true,
      pagination: true,
      paginationPageSize: 10,
      viewAll: false,
      gridData: {
        columnDefs: [
          { field: '_id', hide: true },
          { field: 'name', width: 150 },
          { field: 'formula', autoHeight: true },
          {
            field: 'Action', width: 150, cellRenderer: 'GridActionComponent',
            cellRendererParams: {
              action: this.outputFormulaActions.bind(this),
              value: { actionBtn: ['edit'] }
            },
            autoHeight: true
          }
        ],
        rowData: [],
        updateGridFromOutside: this.payFormulaRowIndexOrID,
      },
      flex: 100
    };

    this.getPayFormulas();

    this.getPayHeads();

  }

  created() {
    this.cellObjs = {};
    this.spreadsheetObj.merge("A2:A10");
    this.spreadsheetObj.cellFormat({  textAlign: 'left', verticalAlign: 'middle' }, 'A2:A10');
    this.spreadsheetObj.selectionSettings.mode = 'Multiple';
    this.spreadsheetObj.getData("A1:G50").then(data => {
      for (const [key, value] of data) { this.cellObjs[key] = value; }
      this.cellObjs = _.omitBy(this.cellObjs, (v) => _.isUndefined(v) || _.isNull(v) || _.isEmpty(v));
    });
  }

  onSelected(cell: any) {
    const sheet = this.spreadsheetObj.getActiveSheet();
    if(sheet.activeCell) {
      this.spreadsheetObj.getData("A2:A10").then(data => {
        for (const [key, value] of data) {
          this.cellObjs[key] = value;
        }
      });
    }
  }

  formulaCtrlChange(string: any) {
    _.each(this.cellObjs, (cellVal, cellKey) => {
      if(string.indexOf(cellKey) !== -1) {
        const idx = string.indexOf(cellKey);
        const key = string.substring(idx, idx + 2);
        string = string.replace(key, this.cellObjs[key].value);
      }
    });
    this.formulaCtrl = string;
  }
 
  getPayFormulas() {
    this.sub = this.apollo.watchQuery<any, any>({ query: GQL_PAYFORMULAS, variables: { query: { limit: 100 }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getPayFormulas))
      .subscribe(val => this.payFormulaRowIndexOrID.next({rowData: val, action: CONSTANTS.UPDATE}));
  }

  getPayHeads() {
    this.sub = this.apollo.watchQuery<any, any>({ query: GQL_PAYHEADS, variables: { query: { limit: 100 }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getPayHeads))
      .subscribe(val => {
        this.spread_loaded = true;
        const newData: any = [];
        _.forEach(val, v => newData.push(
          { 
            formula: v.formula, 
            name: v.name, 
            namePayslip: v.namePayslip,
            testValue: 100
          }
          ))
        this.spread_data = new DataManager(newData);
      });
  }

  formFormulaObjectEvent(form: FormGroup) {
    // this.formFormula = form;
  }

  onFormulaAddEvent() {
    const payload = {
      id: this.formulaIdCtrl,
      _id: this.formulaIdCtrl,
      name: this.formulaNameCtrl,
      formula: this.formulaCtrl
    } as any;
    if(this.formulaBtnText === 'Edit Formula') {
      delete payload._id;
      this.sub = this.apollo.mutate({ mutation: GQL_PAYFORMULAS_UPDATE, variables: payload })
        .pipe(map((data: any) => data?.data?.editPayFormula))
        .subscribe(val => {
          if(val) {
            this.toastrService.success( `Success`, `Data Updated Successfully!`, { } );
            this.payFormulaRowIndexOrID.next({rowIndex: this.payFormulaRowCurrentSelected, data: val, action: CONSTANTS.EDIT});
            this.formulaBtnText = 'Add Formula';
            this.formulaIdCtrl = '';
            this.formulaNameCtrl = '';
            this.formulaCtrl = '';
          }
        });
    }
    if(this.formulaBtnText === 'Add Formula') {
      this.sub = this.apollo.mutate({ mutation: GQL_PAYFORMULAS_CREATE, variables: payload })
        .pipe(map((data: any) => data?.data?.createPayFormula))
        .subscribe(val => {
          if(val) {
            this.toastrService.success( `Success`, `Data Created Successfully!`, { } );
            this.payFormulaRowIndexOrID.next({ data: val, action: CONSTANTS.ADD});
            this.formulaBtnText = 'Add Formula';
            this.formulaIdCtrl = '';
            this.formulaNameCtrl = '';
            this.formulaCtrl = '';
          }
        });
    }
  }

  formulaAddLoop(query: any) {
    //
  }

  onFormulaGridReady(event: any) {
    this.formulaGridApi = event.gridApi;
    this.formulaGridColumnApi = event.gridColumnApi;
  }

  outputFormulaActions(event: any) {
    if (event.action === CONSTANTS.EDIT) {
      this.formulaIdCtrl = event.params.data._id;
      this.formulaNameCtrl = event.params.data.name;
      this.formulaCtrl = event.params.data.formula;
      this.formulaBtnText = 'Edit Formula';
      this.payFormulaRowCurrentSelected = event.params.rowIndex;
    }
    if (event.action === CONSTANTS.CANCEL) {
      // this.salaryStructureGridApi.applyTransaction({ remove: [event.params.data] });
    }
  }

  closeDialog(event: any) {
    this.ngZone.run(() => this.dialogRef.close(event));
  }

  formSubmitted = () => {
    this.dialogEventEmitter.emit({ action: CONSTANTS.FORM_SUBMIT_EVENT, value: this.formulaGridApi });
  };

}
