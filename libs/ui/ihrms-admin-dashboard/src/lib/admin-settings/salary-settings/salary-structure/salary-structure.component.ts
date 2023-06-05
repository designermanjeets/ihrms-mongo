import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ColumnApi, GridApi } from 'ag-grid-community';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, map, Observable, Subject, Subscription } from 'rxjs';
import { ControlBase } from '@ihrms/ihrms-dynamic-forms';
import * as _ from 'lodash';
import { CONSTANTS } from '@ihrms/shared';
import { GQL_PAYHEADS, GQL_PAYSTRUCTURE, GQL_PAYSTRUCTURE_CREATE, GQL_PAYSTRUCTURE_UPDATE, SalarySettingsService } from '../_services/salary-settings.service';
import { ToastrService } from 'ngx-toastr';
import { Apollo } from 'apollo-angular';
import { IhrmsAdminDashboardService } from '../../../_services/ihrms-admin-dashboard.service';

const excel_formula = require('excel-formula');

@Component({
  selector: 'ihrms-salary-structure',
  templateUrl: './salary-structure.component.html',
  styleUrls: ['./salary-structure.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SalaryStructureComponent implements OnInit {

  salaryStructureChartData: any | undefined;
  salaryStructureBtnText = 'Add Salary Structure';
  salaryStructureGridApi!: GridApi;
  salaryStructureGridColumnApi!: ColumnApi;
  formSalaryStructure!: FormGroup;
  salaryStructureControls$!: Observable<ControlBase<any>[]>;
  salaryStructureControlsObj!: ControlBase<any>[];
  formSalaryStructureSubmit$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  payStructureRowCurrentSelected!: number;
  payStructureRowIndexOrID$: Subject<any> = new Subject();

  sub!: Subscription;

  payHeadOptions: any;

  constructor(
    private cdRef: ChangeDetectorRef,
    private _sls: SalarySettingsService,
    private toastrService: ToastrService,
    private apollo: Apollo,
    private _ihrmsadss: IhrmsAdminDashboardService,
  ) { }

  ngOnInit(): void {

    console.log(excel_formula);

    this.salaryStructureControls$ = this._sls.getSalaryStructureControls();
    this.sub = this.salaryStructureControls$.subscribe((cntrls: ControlBase<any>[]) => this.salaryStructureControlsObj = cntrls);

    this.salaryStructureChartData = {
      title: '',
      columnFit: true,
      pagination: true,
      paginationPageSize: 10,
      viewAll: false,
      gridData: {
        columnDefs: [
          {
            field: 'Action', cellRenderer: 'GridActionComponent',
            cellRendererParams: {
              action: this.outputSalaryStructureActions.bind(this),
              value: { actionBtn: ['edit'] }
            },
            autoHeight: true
          },
          { field: 'salaryStructure' },
          { field: 'payHeads', wrapText: false, cellRenderer: 'GridSimpleListComponent', autoHeight: true, },
          { field: 'printName' },
          { field: 'effectiveFrom' },
          { field: 'calculatedOn' },
          { field: 'calculatedType' },
          { field: 'isCTC', cellRenderer: 'GridCheckBoxComponent', autoHeight: true },
          { field: 'isESI', cellRenderer: 'GridCheckBoxComponent', autoHeight: true },
          { field: 'isPF', cellRenderer: 'GridCheckBoxComponent', autoHeight: true },
          { field: 'status', cellRenderer: 'GridStatusComponent' },
        ],
        rowData: [],
        updateGridFromOutside: this.payStructureRowIndexOrID$,
      },
      flex: 100
    };

    this.getPayHeads();

    this.getPayStructures();

  }

  getPayHeads() {
    this.sub = this.apollo.watchQuery<any, any>({ query: GQL_PAYHEADS, variables: { query: { limit: 100 }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getPayHeads))
      .subscribe(val => {
        this.payHeadOptions = val;
        this._ihrmsadss.getSelectOptions(this.salaryStructureControlsObj, this.payHeadOptions, 'payHeadIDs', '_id');
      });
  }

  getPayStructures() {
    this.sub = this.apollo.watchQuery<any, any>({ query: GQL_PAYSTRUCTURE, variables: { query: { limit: 100 }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getPayStructures))
      .subscribe(val => this.payStructureRowIndexOrID$.next({rowData: val, action: CONSTANTS.UPDATE}));
  }

  formSalaryStructureSubmitEvent(event: any) {

    let selected_payheads: any = []
    const all_tokens: any = [];

    selected_payheads = _.filter(this.payHeadOptions, (payhead) => _.some(event.payHeadIDs, (ph) => payhead._id === ph));

    selected_payheads.forEach((payhead: any) => {
      payhead.computedFormula?.formula && all_tokens.push(...excel_formula.getTokens(payhead.computedFormula.formula));
    });
    
    const filter_only_heads = _.filter(all_tokens, (tok) => _.some(this.payHeadOptions, (ph) => tok.value === ph.name));
    const left_out_heads = _.filter(filter_only_heads, (filter_head) => !_.some(selected_payheads, (ph) => filter_head.value === ph.name));

    console.log(selected_payheads);
    console.log(_.uniqBy(filter_only_heads, 'value'));
    console.log(left_out_heads);

    if(left_out_heads?.length) {
      this.toastrService.error( `Error`, `${left_out_heads[0].value} is in Formula but not selected!`, { } );
      return;
    }

    if(this.formSalaryStructure.valid) {
      if(this.salaryStructureBtnText === 'Edit Salary Structure') {
        event.id = event._id;
        this.sub = this.apollo.mutate({ mutation: GQL_PAYSTRUCTURE_UPDATE, variables: event })
          .pipe(map((data: any) => data?.data?.editPayStructure))
          .subscribe(val => {
            if(val) {
              this.toastrService.success( `Success`, `Data Updated Successfully!`, { } );
              this.payStructureRowIndexOrID$.next({rowIndex: this.payStructureRowCurrentSelected, data: val, action: CONSTANTS.EDIT});
              this.salaryStructureBtnText = 'Add Salary Structure';
              this.formSalaryStructure.reset();
            }
          });
      }
      if(this.salaryStructureBtnText === 'Add Salary Structure') {
        this.sub = this.apollo.mutate({ mutation: GQL_PAYSTRUCTURE_CREATE, variables: event })
          .pipe(map((data: any) => data?.data?.createPayStructure))
          .subscribe(val => {
            if(val) {
              this.toastrService.success( `Success`, `Data Updated Successfully!`, { } );
              this.payStructureRowIndexOrID$.next({ data: val, action: CONSTANTS.ADD});
              this.salaryStructureBtnText = 'Add Salary Structure';
              this.formSalaryStructure.reset();
            }
          });
      }
    }
  }

  formSalaryStructureObjectEvent(form: FormGroup) {
    this.formSalaryStructure = form;
    this._ihrmsadss.getSelectOptions(this.salaryStructureControlsObj, this.payHeadOptions, 'payHead', '_id');
  }

  formSalaryStructureClickEvent(event: any) {
    console.log(event);
  }

  onSalaryStructureAddEvent(event: any) {
    this.formSalaryStructureSubmit$.next(true);
  }

  onSalaryStructureGridReady(event: any) {
    this.salaryStructureGridApi = event.gridApi;
    this.salaryStructureGridColumnApi = event.gridColumnApi;
  }

  outputSalaryStructureActions(event: any) {
    if (event.action === CONSTANTS.EDIT) {
      this.formSalaryStructure.patchValue(event.params.data);
      this.salaryStructureBtnText = 'Edit Salary Structure';
      this.payStructureRowCurrentSelected = event.params.rowIndex;
    }
    if (event.action === CONSTANTS.CANCEL) {
      this.salaryStructureGridApi.applyTransaction({ remove: [event.params.data] });
    }
  }

}
